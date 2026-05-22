"""
Dashboard Lambda Function for JAIIB-CAIIB Exam Prep Portal

Provides performance metrics and analytics for the user dashboard.
"""

import json
import os
import sys
from datetime import datetime, timedelta, date
from typing import Dict, Any
from decimal import Decimal

import boto3
from botocore.exceptions import ClientError

# Add current directory and parent directory to path for shared module imports
# In Lambda runtime, shared/ is at the same level as lambda_function.py (/var/task/shared/)
# In local dev, shared/ is one level up (backend/shared/)
sys.path.insert(0, os.path.dirname(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from shared.syllabus import PAPER_SYLLABUS, normalize_topic, get_coverage_gaps


class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super().default(obj)

# Initialize AWS clients
dynamodb = boto3.resource('dynamodb')

# Environment variables
USERS_TABLE = os.environ.get('USERS_TABLE', 'jaiib-users')
SESSIONS_TABLE = os.environ.get('SESSIONS_TABLE', 'jaiib-practice-sessions')

# DynamoDB tables
users_table = dynamodb.Table(USERS_TABLE)
sessions_table = dynamodb.Table(SESSIONS_TABLE)


def get_user_performance(user_id: str) -> Dict[str, Any]:
    """Get user performance metrics."""
    try:
        # Query practice sessions for this user
        response = sessions_table.query(
            IndexName='user-id-index',
            KeyConditionExpression='user_id = :user_id',
            ExpressionAttributeValues={':user_id': user_id}
        )
        
        sessions = response.get('Items', [])
        
        if not sessions:
            # No sessions yet, return default metrics
            return {
                'overall_score': 0,
                'total_sessions': 0,
                'average_score': 0,
                'total_study_time': 0,
                'last_session_date': None,
            }
        
        # Calculate metrics
        total_score = 0
        total_time = 0
        completed_sessions = 0
        last_session_date = None
        
        for session in sessions:
            if session.get('status') == 'completed':
                score = session.get('score', 0)
                total_score += score
                completed_sessions += 1
                
                # Track last session date
                submitted_at = session.get('submitted_at')
                if submitted_at:
                    if not last_session_date or submitted_at > last_session_date:
                        last_session_date = submitted_at
            
            # Add time taken
            time_taken = session.get('time_taken', 0)
            total_time += time_taken
        
        average_score = total_score / completed_sessions if completed_sessions > 0 else 0
        overall_score = int(average_score)
        
        return {
            'overall_score': overall_score,
            'total_sessions': len(sessions),
            'average_score': int(average_score),
            'total_study_time': total_time,
            'last_session_date': last_session_date,
        }
    
    except ClientError as e:
        print(f"Error getting user performance: {e}")
        return {
            'overall_score': 0,
            'total_sessions': 0,
            'average_score': 0,
            'total_study_time': 0,
            'last_session_date': None,
        }


def get_paper_performance(user_id: str) -> list:
    """Get performance by paper."""
    try:
        response = sessions_table.query(
            IndexName='user-id-index',
            KeyConditionExpression='user_id = :user_id',
            ExpressionAttributeValues={':user_id': user_id}
        )
        
        sessions = response.get('Items', [])
        paper_stats = {}
        
        for session in sessions:
            if session.get('status') == 'completed':
                paper_name = session.get('paper_name', 'Unknown')
                score = session.get('score', 0)
                
                if paper_name not in paper_stats:
                    paper_stats[paper_name] = {
                        'scores': [],
                        'sessions': 0,
                    }
                
                paper_stats[paper_name]['scores'].append(score)
                paper_stats[paper_name]['sessions'] += 1
        
        # Convert to list format
        paper_performance = []
        for paper_name, stats in paper_stats.items():
            avg_score = sum(stats['scores']) / len(stats['scores']) if stats['scores'] else 0
            paper_performance.append({
                'paper_name': paper_name,
                'average_score': int(avg_score),
                'sessions_completed': stats['sessions'],
                'accuracy_by_topic': {},  # Placeholder
            })
        
        return paper_performance
    
    except ClientError as e:
        print(f"Error getting paper performance: {e}")
        return []


def get_weak_areas(user_id: str) -> list:
    """Get weak areas based on actual session topic scores.
    
    .. deprecated::
        This standalone function is deprecated. Use get_dashboard_data() instead,
        which provides granular topic-level weak areas using the shared syllabus module.
    """
    try:
        response = sessions_table.query(
            IndexName='user-id-index',
            KeyConditionExpression='user_id = :user_id',
            ExpressionAttributeValues={':user_id': user_id}
        )
        sessions = response.get('Items', [])
        topic_scores: Dict[str, list] = {}
        for session in sessions:
            if session.get('status') == 'completed':
                topic = session.get('paper_name', 'General')
                score = float(session.get('score', 0))
                topic_scores.setdefault(topic, []).append(score)
        weak = [t for t, scores in topic_scores.items()
                if (sum(scores) / len(scores)) < 70]
        return weak or []
    except ClientError as e:
        print(f"Error getting weak areas: {e}")
        return []


def get_strong_areas(user_id: str) -> list:
    """Get strong areas based on actual session topic scores.
    
    .. deprecated::
        This standalone function is deprecated. Use get_dashboard_data() instead,
        which provides granular topic-level strong areas using the shared syllabus module.
    """
    try:
        response = sessions_table.query(
            IndexName='user-id-index',
            KeyConditionExpression='user_id = :user_id',
            ExpressionAttributeValues={':user_id': user_id}
        )
        sessions = response.get('Items', [])
        topic_scores: Dict[str, list] = {}
        for session in sessions:
            if session.get('status') == 'completed':
                topic = session.get('paper_name', 'General')
                score = float(session.get('score', 0))
                topic_scores.setdefault(topic, []).append(score)
        strong = [t for t, scores in topic_scores.items()
                  if (sum(scores) / len(scores)) >= 85]
        return strong or []
    except ClientError as e:
        print(f"Error getting strong areas: {e}")
        return []


def get_trend_data(user_id: str) -> list:
    """Get score trend data over time."""
    try:
        response = sessions_table.query(
            IndexName='user-id-index',
            KeyConditionExpression='user_id = :user_id',
            ExpressionAttributeValues={':user_id': user_id}
        )
        
        sessions = response.get('Items', [])
        trend_data = []
        
        # Sort by date
        sorted_sessions = sorted(
            [s for s in sessions if s.get('status') == 'completed'],
            key=lambda x: x.get('submitted_at', '')
        )
        
        for session in sorted_sessions[-10:]:  # Last 10 sessions
            trend_data.append({
                'date': session.get('submitted_at', ''),
                'score': session.get('score', 0),
            })
        
        return trend_data
    
    except ClientError as e:
        print(f"Error getting trend data: {e}")
        return []


def get_dashboard_data(user_id: str) -> Dict[str, Any]:
    """Get complete dashboard data for user — single DynamoDB query."""
    try:
        # ONE query, reused for all metrics
        response = sessions_table.query(
            IndexName='user-id-index',
            KeyConditionExpression='user_id = :user_id',
            ExpressionAttributeValues={':user_id': user_id}
        )
        sessions = response.get('Items', [])
    except ClientError as e:
        print(f"Error fetching sessions: {e}")
        sessions = []

    completed = [s for s in sessions if s.get('status') == 'completed']

    # --- Metrics ---
    if not completed:
        metrics = {
            'overall_score': 0, 'total_sessions': 0,
            'average_score': 0, 'total_study_time': 0,
            'last_session_date': None,
        }
    else:
        scores = [float(s.get('score', 0)) for s in completed]
        avg = sum(scores) / len(scores)
        best = max(scores)
        last_date = max((s.get('submitted_at', '') for s in completed), default=None)
        total_time = sum(int(s.get('time_taken', 0)) for s in sessions)
        metrics = {
            'overall_score': round(best, 1),
            'total_sessions': len(completed),
            'average_score': round(avg, 1),
            'total_study_time': total_time,
            'last_session_date': last_date,
        }

    # --- Paper performance ---
    paper_stats: Dict[str, list] = {}
    for s in completed:
        paper = s.get('paper_name', 'Unknown')
        paper_stats.setdefault(paper, []).append(float(s.get('score', 0)))

    paper_performance = [
        {
            'paper_name': paper,
            'average_score': round(sum(scores) / len(scores), 1),
            'sessions_completed': len(scores),
            'accuracy_by_topic': {},
        }
        for paper, scores in paper_stats.items()
    ]

    # --- Topic-level analysis from questions in sessions ---
    topic_correct: Dict[str, int] = {}
    topic_total: Dict[str, int] = {}
    papers_attempted: set = set()
    
    for s in completed:
        questions = s.get('questions', [])
        user_answers = s.get('user_answers', {})
        paper_name = s.get('paper_name', '')
        
        if paper_name:
            papers_attempted.add(paper_name)
        
        # If answers are stored at session level
        if not user_answers:
            # Try to reconstruct from the results if available
            continue
            
        for q in questions:
            topic = q.get('topic', 'General')
            # Normalize topic to canonical syllabus entry
            # Returns None if topic is actually a paper display name (skip it)
            topic = normalize_topic(topic, paper_name)
            if topic is None:
                continue
            qid = q.get('question_id', '')
            correct_answer = q.get('correct_answer', '')
            user_answer = user_answers.get(qid, '')
            
            topic_total.setdefault(topic, 0)
            topic_correct.setdefault(topic, 0)
            topic_total[topic] += 1
            
            if user_answer and user_answer == correct_answer:
                topic_correct[topic] += 1

    # Calculate topic accuracy
    topic_accuracy: Dict[str, float] = {}
    for topic in topic_total:
        if topic_total[topic] > 0:
            topic_accuracy[topic] = round(
                (topic_correct.get(topic, 0) / topic_total[topic]) * 100, 1
            )
        else:
            topic_accuracy[topic] = 0.0

    # Weak areas: topics with < 50% accuracy (at least 2 questions attempted)
    weak_areas = [
        t for t, acc in sorted(topic_accuracy.items(), key=lambda x: x[1])
        if acc < 50 and topic_total.get(t, 0) >= 2
    ][:8]  # Top 8 weakest

    # Strong areas: topics with >= 70% accuracy (at least 2 questions attempted)
    strong_areas = [
        t for t, acc in sorted(topic_accuracy.items(), key=lambda x: -x[1])
        if acc >= 70 and topic_total.get(t, 0) >= 2
    ][:5]  # Top 5 strongest

    # Fallback: if no granular topic data available but user has completed sessions,
    # identify weak/strong papers based on paper_performance scores
    if not weak_areas and not strong_areas and completed:
        for pp in paper_performance:
            if pp['sessions_completed'] >= 2:
                if pp['average_score'] < 50:
                    # Get some recommended topics from this paper's syllabus
                    paper_data = PAPER_SYLLABUS.get(pp['paper_name'], {})
                    for module_topics in paper_data.get('modules', {}).values():
                        weak_areas.extend(module_topics[:2])
                        if len(weak_areas) >= 8:
                            break
        weak_areas = weak_areas[:8]

    # Recommended areas: unattempted topics + low-accuracy topics
    recommended_areas = []
    attempted_topics_set = set(topic_total.keys())
    
    # Get coverage gaps for each paper the user has attempted
    unattempted = []
    for paper in papers_attempted:
        gaps = get_coverage_gaps(list(attempted_topics_set), paper)
        unattempted.extend(gaps)
    # Deduplicate while preserving order
    seen = set()
    unique_unattempted = []
    for t in unattempted:
        if t not in seen:
            seen.add(t)
            unique_unattempted.append(t)
    
    # Low-accuracy topics (< 50%) not already in weak_areas list
    low_accuracy_topics = [
        t for t, acc in sorted(topic_accuracy.items(), key=lambda x: x[1])
        if acc < 50 and t not in unique_unattempted
    ]
    
    # Prioritize: unattempted first, then lowest-performing
    recommended_areas = (unique_unattempted + low_accuracy_topics)[:10]

    # --- Trend data (last 10 completed sessions) ---
    sorted_sessions = sorted(completed, key=lambda x: x.get('submitted_at', ''))
    trend_data = [
        {'date': s.get('submitted_at', ''), 'score': float(s.get('score', 0))}
        for s in sorted_sessions[-10:]
    ]

    # --- Exam Readiness Score (per paper) ---
    # Algorithm: weighted combination of recent performance, consistency, and coverage
    exam_readiness = {}
    for paper, scores in paper_stats.items():
        if len(scores) < 2:
            # Not enough data
            exam_readiness[paper] = {
                'score': 0,
                'label': 'Not enough data',
                'sessions_needed': max(0, 5 - len(scores)),
            }
            continue
        
        # Factor 1: Recent performance (last 5 sessions, weighted toward recent)
        recent_scores = scores[-5:]
        weights = list(range(1, len(recent_scores) + 1))  # [1,2,3,4,5]
        weighted_avg = sum(s * w for s, w in zip(recent_scores, weights)) / sum(weights)
        
        # Factor 2: Consistency (low variance = more predictable)
        if len(scores) >= 3:
            mean_score = sum(scores) / len(scores)
            variance = sum((s - mean_score) ** 2 for s in scores) / len(scores)
            std_dev = variance ** 0.5
            # Consistency score: 100 if std_dev=0, decreases as variance increases
            consistency = max(0, 100 - std_dev * 2)
        else:
            consistency = 50  # neutral if not enough data
        
        # Factor 3: Improvement trend (are scores going up?)
        if len(scores) >= 3:
            first_half = scores[:len(scores)//2]
            second_half = scores[len(scores)//2:]
            first_avg = sum(first_half) / len(first_half)
            second_avg = sum(second_half) / len(second_half)
            trend_bonus = min(15, max(-10, (second_avg - first_avg) * 0.5))
        else:
            trend_bonus = 0
        
        # Factor 4: Volume bonus (more practice = more confidence)
        volume_bonus = min(10, len(scores) * 0.5)
        
        # Combined readiness score (pass mark is 50 out of 100)
        # Scale weighted_avg to percentage of pass threshold
        pass_threshold = 50  # JAIIB pass mark
        raw_readiness = (weighted_avg / pass_threshold) * 60  # 60% weight on score
        raw_readiness += consistency * 0.2  # 20% weight on consistency
        raw_readiness += trend_bonus  # trend bonus/penalty
        raw_readiness += volume_bonus  # volume bonus
        
        readiness_score = max(0, min(100, round(raw_readiness, 0)))
        
        # Label
        if readiness_score >= 80:
            label = 'Likely to pass'
        elif readiness_score >= 60:
            label = 'On track'
        elif readiness_score >= 40:
            label = 'Needs more practice'
        else:
            label = 'At risk'
        
        exam_readiness[paper] = {
            'score': int(readiness_score),
            'label': label,
            'recent_avg': round(weighted_avg, 1),
            'sessions_completed': len(scores),
            'trend': 'improving' if trend_bonus > 2 else ('declining' if trend_bonus < -2 else 'stable'),
        }

    # --- Study Streak & Gamification ---
    streak = {'current_streak': 0, 'longest_streak': 0, 'badges': []}
    
    if completed:
        # Extract unique practice dates (YYYY-MM-DD)
        practice_dates = set()
        for s in completed:
            submitted = s.get('submitted_at', '')
            if submitted:
                # Handle both ISO format and date-only
                date_str = submitted[:10]  # YYYY-MM-DD
                practice_dates.add(date_str)
        
        if practice_dates:
            sorted_dates = sorted(practice_dates, reverse=True)
            
            # Calculate current streak (consecutive days ending today or yesterday)
            today = date.today()
            today_str = today.isoformat()
            yesterday_str = (today - timedelta(days=1)).isoformat()
            
            # Start counting from today or yesterday
            if sorted_dates[0] == today_str or sorted_dates[0] == yesterday_str:
                current_streak = 1
                check_date = date.fromisoformat(sorted_dates[0])
                
                for i in range(1, len(sorted_dates)):
                    prev_date = date.fromisoformat(sorted_dates[i])
                    if (check_date - prev_date).days == 1:
                        current_streak += 1
                        check_date = prev_date
                    elif (check_date - prev_date).days == 0:
                        continue  # same day, skip
                    else:
                        break
            else:
                current_streak = 0
            
            # Calculate longest streak
            all_dates_sorted = sorted(practice_dates)
            longest = 1
            current_run = 1
            for i in range(1, len(all_dates_sorted)):
                d1 = date.fromisoformat(all_dates_sorted[i-1])
                d2 = date.fromisoformat(all_dates_sorted[i])
                if (d2 - d1).days == 1:
                    current_run += 1
                    longest = max(longest, current_run)
                elif (d2 - d1).days > 1:
                    current_run = 1
            longest = max(longest, current_run)
            
            streak['current_streak'] = current_streak
            streak['longest_streak'] = longest
        
        # --- Badges ---
        badges = []
        total = len(completed)
        best_score = max(float(s.get('score', 0)) for s in completed) if completed else 0
        papers_done = set(s.get('paper_name', '') for s in completed)
        
        # Session milestones
        if total >= 1:
            badges.append({'id': 'first_session', 'name': 'First Steps', 'icon': '🎯', 'description': 'Completed your first practice session'})
        if total >= 10:
            badges.append({'id': 'ten_sessions', 'name': 'Dedicated Learner', 'icon': '📚', 'description': 'Completed 10 practice sessions'})
        if total >= 25:
            badges.append({'id': 'twentyfive_sessions', 'name': 'Consistent Performer', 'icon': '💪', 'description': 'Completed 25 practice sessions'})
        if total >= 50:
            badges.append({'id': 'fifty_sessions', 'name': 'Practice Champion', 'icon': '🏆', 'description': 'Completed 50 practice sessions'})
        
        # Score milestones
        if best_score >= 50:
            badges.append({'id': 'pass_mark', 'name': 'Pass Mark Achieved', 'icon': '✅', 'description': 'Scored 50+ (passing threshold)'})
        if best_score >= 70:
            badges.append({'id': 'high_scorer', 'name': 'High Scorer', 'icon': '⭐', 'description': 'Scored 70+ in a session'})
        if best_score >= 90:
            badges.append({'id': 'top_performer', 'name': 'Top Performer', 'icon': '🌟', 'description': 'Scored 90+ in a session'})
        
        # Paper coverage
        if len(papers_done) >= 2:
            badges.append({'id': 'multi_paper', 'name': 'Well Rounded', 'icon': '📋', 'description': 'Practiced 2+ different papers'})
        if len(papers_done) >= 4:
            badges.append({'id': 'all_papers', 'name': 'Complete Coverage', 'icon': '🎓', 'description': 'Practiced all 4 JAIIB papers'})
        
        # Streak badges
        if streak['current_streak'] >= 3:
            badges.append({'id': 'streak_3', 'name': 'On Fire', 'icon': '🔥', 'description': '3-day practice streak'})
        if streak['current_streak'] >= 7:
            badges.append({'id': 'streak_7', 'name': 'Week Warrior', 'icon': '⚡', 'description': '7-day practice streak'})
        if streak['longest_streak'] >= 14:
            badges.append({'id': 'streak_14', 'name': 'Unstoppable', 'icon': '💎', 'description': '14-day practice streak'})
        
        streak['badges'] = badges

    # --- Percentile Ranking (per paper) ---
    # Compare this user's average score against all other users
    percentile_ranking = {}
    if paper_stats:
        try:
            # Scan all completed sessions (projection: user_id, paper_name, score)
            all_sessions_resp = sessions_table.scan(
                FilterExpression='#s = :completed',
                ExpressionAttributeNames={'#s': 'status'},
                ExpressionAttributeValues={':completed': 'completed'},
                ProjectionExpression='user_id, paper_name, score'
            )
            all_items = all_sessions_resp.get('Items', [])
            
            # Handle pagination
            while 'LastEvaluatedKey' in all_sessions_resp:
                all_sessions_resp = sessions_table.scan(
                    FilterExpression='#s = :completed',
                    ExpressionAttributeNames={'#s': 'status'},
                    ExpressionAttributeValues={':completed': 'completed'},
                    ProjectionExpression='user_id, paper_name, score',
                    ExclusiveStartKey=all_sessions_resp['LastEvaluatedKey']
                )
                all_items.extend(all_sessions_resp.get('Items', []))
            
            # Group by (user_id, paper_name) → average score
            user_paper_scores: Dict[str, Dict[str, list]] = {}
            for item in all_items:
                uid = item.get('user_id', '')
                paper = item.get('paper_name', '')
                score = float(item.get('score', 0))
                if uid and paper:
                    user_paper_scores.setdefault(paper, {}).setdefault(uid, []).append(score)
            
            # Calculate percentile for each paper
            for paper, user_scores in paper_stats.items():
                my_avg = sum(user_scores) / len(user_scores)
                
                # Get all users' averages for this paper
                paper_users = user_paper_scores.get(paper, {})
                all_averages = [
                    sum(scores) / len(scores)
                    for scores in paper_users.values()
                ]
                
                if len(all_averages) >= 2:
                    # Percentile = % of users scoring below this user
                    users_below = sum(1 for avg in all_averages if avg < my_avg)
                    percentile = round((users_below / len(all_averages)) * 100)
                    
                    percentile_ranking[paper] = {
                        'percentile': percentile,
                        'total_users': len(all_averages),
                        'your_avg': round(my_avg, 1),
                        'message': f'You scored better than {percentile}% of candidates',
                    }
                else:
                    percentile_ranking[paper] = {
                        'percentile': None,
                        'total_users': len(all_averages),
                        'your_avg': round(my_avg, 1),
                        'message': 'Not enough users for comparison yet',
                    }
        except ClientError as e:
            print(f"Error computing percentile: {e}")
            # Graceful fallback — don't break the dashboard
            percentile_ranking = {}

    return {
        'metrics': metrics,
        'paper_performance': paper_performance,
        'weak_areas': weak_areas,
        'strong_areas': strong_areas,
        'trend_data': trend_data,
        'topic_accuracy': topic_accuracy,
        'recommended_areas': recommended_areas,
        'exam_readiness': exam_readiness,
        'study_streak': streak,
        'percentile_ranking': percentile_ranking,
    }


def success_response(status_code: int, data: Dict[str, Any]) -> Dict[str, Any]:
    """Return success response."""
    return {
        'statusCode': status_code,
        'body': json.dumps(data, cls=DecimalEncoder),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }


def error_response(status_code: int, message: str) -> Dict[str, Any]:
    """Return error response."""
    return {
        'statusCode': status_code,
        'body': json.dumps({'error': message}),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }


def handler(event, context):
    """Lambda handler for dashboard requests."""
    try:
        # Parse request
        http_method = event.get('httpMethod', 'GET')
        path = event.get('path', '')
        
        # Remove stage name from path if present
        if path.startswith('/prod/'):
            path = path[5:]
        
        # Handle CORS preflight requests
        if http_method == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
                },
                'body': json.dumps({})
            }
        
        # Get user ID from multiple sources
        user_id = None
        
        # Try decoding JWT from Authorization header
        auth_header = (event.get('headers') or {}).get('Authorization', '') or \
                      (event.get('headers') or {}).get('authorization', '')
        if auth_header.startswith('Bearer '):
            try:
                import base64
                token = auth_header.split(' ')[1]
                # Decode payload without verification (API Gateway handles auth)
                payload_b64 = token.split('.')[1]
                # Add padding
                payload_b64 += '=' * (4 - len(payload_b64) % 4)
                payload = json.loads(base64.b64decode(payload_b64).decode('utf-8'))
                user_id = payload.get('sub') or payload.get('user_id')
            except Exception:
                pass

        # Try from request context (API Gateway authorizer)
        if not user_id:
            request_context = event.get('requestContext', {})
            authorizer = request_context.get('authorizer', {})
            if isinstance(authorizer, dict):
                user_id = authorizer.get('claims', {}).get('sub')
        
        # Try from query parameters
        if not user_id:
            query_params = event.get('queryStringParameters', {}) or {}
            user_id = query_params.get('user_id')
        
        # Try from path parameters
        if not user_id:
            path_params = event.get('pathParameters', {}) or {}
            user_id = path_params.get('user_id')
        
        if not user_id:
            return error_response(401, 'User ID required')
        
        # Route to appropriate handler
        if (path == '/dashboard/performance' or path == '/dashboard') and http_method == 'GET':
            dashboard_data = get_dashboard_data(user_id)
            return success_response(200, dashboard_data)
        else:
            return error_response(404, f'Endpoint not found: {path}')
    
    except Exception as e:
        print(f"Error: {e}")
        return error_response(500, 'Internal server error')
