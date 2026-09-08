"""
Dashboard Lambda Function for JAIIB-CAIIB Exam Prep Portal

Provides performance metrics and analytics for the user dashboard.
"""

import json
import os
import sys
from datetime import datetime, timedelta, date, timezone
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
            q_type = q.get('question_type', 'single_choice')
            correct_answer = q.get('correct_answer', '')
            correct_answers = q.get('correct_answers')
            user_answer = user_answers.get(qid, '')

            topic_total.setdefault(topic, 0)
            topic_correct.setdefault(topic, 0)
            topic_total[topic] += 1

            # Type-aware correctness
            if q_type == 'multi_select' and correct_answers:
                if isinstance(user_answer, list):
                    is_corr = set(user_answer) == set(correct_answers)
                elif isinstance(user_answer, str) and user_answer:
                    is_corr = set([s.strip() for s in user_answer.split(',')]) == set(correct_answers)
                else:
                    is_corr = False
            elif q_type == 'yes_no' and correct_answers:
                is_corr = user_answer == correct_answers if isinstance(user_answer, list) else user_answer == correct_answer
            elif q_type in ('ordering', 'build_list') and q.get('correct_order'):
                is_corr = isinstance(user_answer, list) and user_answer == q.get('correct_order')
            elif q_type == 'drag_drop' and q.get('correct_mapping'):
                is_corr = isinstance(user_answer, dict) and user_answer == q.get('correct_mapping')
            elif q_type == 'hot_area' and q.get('correct_area'):
                is_corr = user_answer == q.get('correct_area')
            else:
                is_corr = bool(user_answer) and user_answer == correct_answer

            if is_corr:
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

    # Fill accuracy_by_topic per paper
    # Build per-paper topic map
    paper_topic_map: Dict[str, Dict[str, float]] = {}
    for topic, acc in topic_accuracy.items():
        # Find which paper this topic belongs to via syllabus
        for paper_name, paper_data in PAPER_SYLLABUS.items():
            for module_topics in paper_data.get('modules', {}).values():
                if topic in module_topics:
                    paper_topic_map.setdefault(paper_name, {})[topic] = acc
                    break
    for pp in paper_performance:
        pp['accuracy_by_topic'] = paper_topic_map.get(pp['paper_name'], {})

    # --- Difficulty accuracy ---
    diff_correct: Dict[str, int] = {'easy': 0, 'medium': 0, 'hard': 0}
    diff_total: Dict[str, int] = {'easy': 0, 'medium': 0, 'hard': 0}
    type_correct: Dict[str, int] = {}
    type_total: Dict[str, int] = {}
    time_per_paper: Dict[str, list] = {}
    for s in completed:
        pn = s.get('paper_name', 'Unknown')
        time_per_paper.setdefault(pn, []).append(int(s.get('time_taken', 0)))
        for q in s.get('questions', []):
            diff = q.get('difficulty', 'medium')
            qtype = q.get('question_type', 'single_choice')
            qid = q.get('question_id', '')
            ua = s.get('user_answers', {}).get(qid, '')
            # type-aware correctness (reuse same logic as topic block)
            if qtype == 'multi_select' and q.get('correct_answers'):
                c_ans = q.get('correct_answers')
                if isinstance(ua, list):
                    is_c = set(ua) == set(c_ans)
                elif isinstance(ua, str) and ua:
                    is_c = set([s.strip() for s in ua.split(',')]) == set(c_ans)
                else:
                    is_c = False
            elif qtype == 'yes_no' and q.get('correct_answers'):
                is_c = ua == q.get('correct_answers') if isinstance(ua, list) else ua == q.get('correct_answer')
            elif qtype in ('ordering', 'build_list') and q.get('correct_order'):
                is_c = isinstance(ua, list) and ua == q.get('correct_order')
            elif qtype == 'drag_drop' and q.get('correct_mapping'):
                is_c = isinstance(ua, dict) and ua == q.get('correct_mapping')
            elif qtype == 'hot_area' and q.get('correct_area'):
                is_c = ua == q.get('correct_area')
            else:
                is_c = bool(ua) and ua == q.get('correct_answer', '')
            diff_total[diff] = diff_total.get(diff, 0) + 1
            type_total[qtype] = type_total.get(qtype, 0) + 1
            if is_c:
                diff_correct[diff] = diff_correct.get(diff, 0) + 1
                type_correct[qtype] = type_correct.get(qtype, 0) + 1

    difficulty_accuracy = {k: round((diff_correct.get(k, 0) / v) * 100, 1) if v else 0 for k, v in diff_total.items()}
    question_type_accuracy = {k: round((type_correct.get(k, 0) / v) * 100, 1) if v else 0 for k, v in type_total.items()}
    avg_time_per_paper = {k: round(sum(v) / len(v), 1) if v else 0 for k, v in time_per_paper.items()}
    time_trend = [{'date': s.get('submitted_at', '')[:10], 'time_taken': int(s.get('time_taken', 0))} for s in sorted(completed, key=lambda x: x.get('submitted_at', ''))[-10:]]

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

    # --- Coverage viz per paper (for syllabus sunburst) ---
    coverage = {}
    for paper in set(list(papers_attempted) + list(paper_stats.keys())):
        paper_data = PAPER_SYLLABUS.get(paper, {})
        total_topics = sum(len(v) for v in paper_data.get('modules', {}).values())
        attempted_for_paper = sum(1 for t in paper_topic_map.get(paper, {}).keys() if t in attempted_topics_set)
        # Fallback: topics derived from attempted set that belong to paper
        if total_topics == 0:
            continue
        pct = round((attempted_for_paper / total_topics) * 100, 1) if total_topics else 0
        coverage[paper] = {'total': total_topics, 'covered': attempted_for_paper, 'pct': pct, 'gaps': get_coverage_gaps(list(attempted_topics_set), paper)[:5]}

    # --- Trend data: last 30 days bucketed daily avg + 30-day date range ---
    from collections import defaultdict
    cutoff = (datetime.utcnow() - timedelta(days=30)).isoformat()
    recent_completed = [s for s in completed if s.get('submitted_at', '') >= cutoff]
    # bucket by YYYY-MM-DD
    bucket: Dict[str, list] = defaultdict(list)
    for s in recent_completed:
        day = s.get('submitted_at', '')[:10]
        if day:
            bucket[day].append(float(s.get('score', 0)))
    # also include older if <10 points (fallback to last 10)
    if len(bucket) < 5 and completed:
        sorted_sessions = sorted(completed, key=lambda x: x.get('submitted_at', ''))
        trend_data = [{'date': s.get('submitted_at', ''), 'score': float(s.get('score', 0))} for s in sorted_sessions[-10:]]
    else:
        trend_data = [{'date': d, 'score': round(sum(v) / len(v), 1)} for d, v in sorted(bucket.items())]

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
        
        # Combined readiness score — per-paper pass mark (JAIIB 50, AI-300 70, CAPM 70)
        paper_pass = {'IE & IFS': 50, 'PPB': 50, 'AFM': 50, 'RBWM': 50, 'AI-300': 70, 'CAPM': 70}
        pass_threshold = paper_pass.get(paper, 50)
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
    # Paginated scan with limit to avoid full-table blowup; Lambda container caches for 5 min
    percentile_ranking = {}
    # simple in-memory cache (Lambda container reuse)
    if not hasattr(get_dashboard_data, '_cache'):
        get_dashboard_data._cache = {}  # type: ignore
    cache_key = 'percentile_v1'
    cached = get_dashboard_data._cache.get(cache_key)  # type: ignore
    if cached and (datetime.utcnow() - cached['ts']).seconds < 300:
        all_items = cached['items']
    elif paper_stats:
        try:
            # Paginated scan with limit (max 1000 items per page, up to 5 pages → 5000 sessions)
            all_items = []
            scan_kwargs: Dict[str, Any] = {
                'FilterExpression': '#s = :completed',
                'ExpressionAttributeNames': {'#s': 'status'},
                'ExpressionAttributeValues': {':completed': 'completed'},
                'ProjectionExpression': 'user_id, paper_name, score',
                'Limit': 1000,
            }
            resp = sessions_table.scan(**scan_kwargs)
            all_items.extend(resp.get('Items', []))
            pages = 1
            while 'LastEvaluatedKey' in resp and pages < 5:
                scan_kwargs['ExclusiveStartKey'] = resp['LastEvaluatedKey']
                resp = sessions_table.scan(**scan_kwargs)
                all_items.extend(resp.get('Items', []))
                pages += 1
            get_dashboard_data._cache[cache_key] = {'items': all_items, 'ts': datetime.utcnow()}  # type: ignore
        except ClientError as e:
            print(f"Error computing percentile scan: {e}")
            all_items = []
    else:
        all_items = []

    if paper_stats and 'all_items' in locals() and all_items:
        try:
            
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
        'difficulty_accuracy': difficulty_accuracy,
        'question_type_accuracy': question_type_accuracy,
        'avg_time_per_paper': avg_time_per_paper,
        'time_trend': time_trend,
        'coverage': coverage,
    }


def get_leaderboard(exam: str = 'JAIIB') -> Dict[str, Any]:
    """Get leaderboard filtered by exam. Only includes sessions for papers belonging to the exam."""
    # Define which papers belong to which exam
    exam_papers = {
        'JAIIB': {'IE & IFS', 'PPB', 'AFM', 'RBWM'},
        'AI-300': {'AI-300'},
        'CAPM': {'CAPM'},
    }
    valid_papers = exam_papers.get(exam, exam_papers.get('JAIIB', set()))
    # ALL = combine everything
    if exam == 'ALL':
        valid_papers = set()
        for papers in exam_papers.values():
            valid_papers.update(papers)

    try:
        # Scan completed sessions with limit + batch (avoid full-table blowup)
        all_items = []
        scan_kwargs = {
            'FilterExpression': '#s = :completed',
            'ExpressionAttributeNames': {'#s': 'status'},
            'ExpressionAttributeValues': {':completed': 'completed'},
            'ProjectionExpression': 'user_id, paper_name, score, submitted_at',
            'Limit': 1000,
        }
        pages = 0
        while pages < 5:
            resp = sessions_table.scan(**scan_kwargs)
            all_items.extend(resp.get('Items', []))
            if 'LastEvaluatedKey' not in resp:
                break
            scan_kwargs['ExclusiveStartKey'] = resp['LastEvaluatedKey']
            pages += 1

        # Filter by exam papers
        all_items = [item for item in all_items if item.get('paper_name', '') in valid_papers]

        if not all_items:
            return {'leaderboard': [], 'total_participants': 0, 'exam': exam}

        # Group by user_id
        user_stats: Dict[str, Dict[str, Any]] = {}
        for item in all_items:
            uid = item.get('user_id', '')
            if not uid:
                continue
            score = float(item.get('score', 0))
            submitted = item.get('submitted_at', '')

            if uid not in user_stats:
                user_stats[uid] = {
                    'scores': [],
                    'papers': set(),
                    'last_active': '',
                }
            user_stats[uid]['scores'].append(score)
            user_stats[uid]['papers'].add(item.get('paper_name', ''))
            if submitted > user_stats[uid]['last_active']:
                user_stats[uid]['last_active'] = submitted

        # Fetch user names via batch_get_item (avoid N+1)
        user_names: Dict[str, str] = {}
        uids = list(user_stats.keys())
        try:
            # Batch in groups of 100 (DynamoDB limit)
            for i in range(0, len(uids), 100):
                batch_keys = [{'user_id': uid} for uid in uids[i:i+100]]
                batch_resp = dynamodb.meta.client.batch_get_item(
                    RequestItems={
                        users_table.name: {'Keys': batch_keys, 'ProjectionExpression': 'user_id, full_name'}
                    }
                )
                for item in batch_resp.get('Responses', {}).get(users_table.name, []):
                    user_names[item['user_id']] = item.get('full_name', 'Anonymous')
            # Fallback for missing names
            for uid in uids:
                user_names.setdefault(uid, 'Anonymous')
        except Exception:
            for uid in uids:
                user_names[uid] = 'Anonymous'

        # Build leaderboard entries
        leaderboard = []
        for uid, stats in user_stats.items():
            scores = stats['scores']
            avg_score = sum(scores) / len(scores)
            best_score = max(scores)
            leaderboard.append({
                'user_id': uid,
                'name': user_names.get(uid, 'Anonymous'),
                'average_score': round(avg_score, 1),
                'best_score': round(best_score, 1),
                'sessions_completed': len(scores),
                'papers_attempted': len(stats['papers']),
                'last_active': stats['last_active'][:10] if stats['last_active'] else '',
            })

        # Sort by average score descending
        leaderboard.sort(key=lambda x: (-x['average_score'], -x['sessions_completed']))

        # Assign ranks
        for i, entry in enumerate(leaderboard):
            entry['rank'] = i + 1

        return {
            'leaderboard': leaderboard[:50],  # Top 50
            'total_participants': len(leaderboard),
            'exam': exam,
        }

    except ClientError as e:
        print(f"Error fetching leaderboard: {e}")
        return {'leaderboard': [], 'total_participants': 0}


EXAM_PAPERS = {
    'JAIIB': {'IE & IFS', 'PPB', 'AFM', 'RBWM'},
    'CAIIB': {'ABM'},
    'AI-300': {'AI-300'},
    'CAPM': {'CAPM'},
}


def _num(value, default=0.0) -> float:
    """Coerce DynamoDB/str/None values to float (scores/times are stored as strings)."""
    try:
        if value is None or value == '':
            return default
        return float(value)
    except (TypeError, ValueError):
        return default


def _to_epoch(value) -> int:
    """Normalize epoch seconds (int/str) or ISO-8601 strings to epoch seconds."""
    if value is None or value == '':
        return 0
    if isinstance(value, (int, float)):
        return int(value)
    if isinstance(value, str):
        s = value.strip()
        if s.isdigit():
            try:
                return int(s)
            except ValueError:
                return 0
        try:
            # fromisoformat handles 'YYYY-MM-DDTHH:MM:SS.ffffff' (naive = UTC here)
            dt = datetime.fromisoformat(s)
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            return int(dt.timestamp())
        except ValueError:
            return 0
    try:
        return int(value)  # Decimal and friends
    except (TypeError, ValueError):
        return 0


def _scan_all(table, **kwargs) -> list:
    """Paginated scan with a page cap to avoid full-table blowup (1000 x 5)."""
    items: list = []
    scan_kwargs: Dict[str, Any] = dict(kwargs)
    scan_kwargs.setdefault('Limit', 1000)
    pages = 0
    while pages < 5:
        resp = table.scan(**scan_kwargs)
        items.extend(resp.get('Items', []))
        if 'LastEvaluatedKey' not in resp:
            break
        scan_kwargs['ExclusiveStartKey'] = resp['LastEvaluatedKey']
        pages += 1
    return items


def _paper_exam(paper_name: str) -> str:
    """Map a paper name to its exam group (default JAIIB for legacy papers)."""
    for exam, papers in EXAM_PAPERS.items():
        if paper_name in papers:
            return exam
    return 'JAIIB'


def _pct_change(current: float, previous: float):
    """Percent change vs previous period; None when there is no baseline."""
    if previous is None or previous == 0:
        return None
    return round(((current - previous) / abs(previous)) * 100, 1)


def _require_admin_response(user_id: str):
    """Return an error response unless user_id belongs to an admin; else None."""
    try:
        resp = users_table.get_item(
            Key={'user_id': user_id},
            ProjectionExpression='user_id, #r',
            ExpressionAttributeNames={'#r': 'role'},
        )
    except ClientError as e:
        print(f"Error checking admin role: {e}")
        return error_response(500, 'Failed to verify admin access')
    item = resp.get('Item')
    if not item or item.get('role') != 'admin':
        return error_response(403, 'Admin access required')
    return None


def get_admin_analytics(range_days: int = 30, exam: str = 'ALL') -> Dict[str, Any]:
    """System-wide admin analytics over users + completed practice sessions.

    Range-scoped metrics (active users, attempts, avg score/time, retention,
    growth, exam/subject performance, insights, recent activity) are computed
    for [now - range_days, now] with deltas against the previous equal-length
    period. User totals are global. `exam` filters session-scoped metrics.
    """
    now = datetime.now(timezone.utc)
    now_ts = int(now.timestamp())
    start_ts = now_ts - range_days * 86400
    prev_start_ts = start_ts - range_days * 86400
    exam = (exam or 'ALL').upper()

    def allowed(paper: str) -> bool:
        if exam == 'ALL':
            return True
        return paper in EXAM_PAPERS.get(exam, set())

    empty: Dict[str, Any] = {
        'range_days': range_days,
        'exam': exam,
        'overview': {
            'total_users': 0, 'total_registered': 0, 'unverified_pending': 0,
            'active_users': 0, 'test_attempts': 0, 'avg_score': 0,
            'avg_time_sec': 0, 'retention_pct': 0,
            'deltas': {'active_users': None, 'test_attempts': None,
                       'avg_score': None, 'avg_time_sec': None, 'retention_pct': None},
        },
        'growth': [], 'exam_performance': [], 'subject_performance': [],
        'insights': [{'level': 'info', 'text': 'Not enough data yet.'}],
        'recent_activity': [], 'top_users': [],
        'funnel': [], 'cohorts': [], 'difficult_questions': [], 'dropoff': [],
    }

    try:
        users = _scan_all(
            users_table,
            ProjectionExpression='user_id, email, full_name, created_at, last_login, email_verified',
        )
        sessions = _scan_all(
            sessions_table,
            FilterExpression='#s = :completed',
            ExpressionAttributeNames={'#s': 'status'},
            ExpressionAttributeValues={':completed': 'completed'},
            ProjectionExpression='user_id, paper_name, score, submitted_at, created_at, time_taken, questions, user_answers',
        )
        all_sessions = _scan_all(
            sessions_table,
            ProjectionExpression='user_id, paper_name, #s, submitted_at, created_at',
            ExpressionAttributeNames={'#s': 'status'},
        )
    except ClientError as e:
        print(f"Error scanning for admin analytics: {e}")
        return empty

    # --- Users ---
    verified = [u for u in users if u.get('email_verified') is True]
    user_map = {u.get('user_id', ''): u for u in users if u.get('user_id')}

    # --- Sessions: normalize + exam filter ---
    norm_sessions = []
    for s in sessions:
        paper = s.get('paper_name', 'Unknown') or 'Unknown'
        if not allowed(paper):
            continue
        ts = _to_epoch(s.get('submitted_at')) or _to_epoch(s.get('created_at'))
        if not ts:
            continue
        norm_sessions.append({
            'user_id': s.get('user_id', ''),
            'paper_name': paper,
            'exam': _paper_exam(paper),
            'score': _num(s.get('score')),
            'time_taken': int(_num(s.get('time_taken'))),
            'ts': ts,
            'questions': s.get('questions', []) or [],
            'user_answers': s.get('user_answers', {}) or {},
        })

    cur = [s for s in norm_sessions if s['ts'] >= start_ts]
    prev = [s for s in norm_sessions if prev_start_ts <= s['ts'] < start_ts]

    def period_stats(items: list) -> Dict[str, Any]:
        users_active = {s['user_id'] for s in items if s['user_id']}
        scores = [s['score'] for s in items]
        times = [s['time_taken'] for s in items]
        returning = sum(
            1 for u in users_active
            if any(s['user_id'] == u and s['ts'] < start_ts for s in norm_sessions)
        )
        return {
            'active': len(users_active),
            'attempts': len(items),
            'avg_score': round(sum(scores) / len(scores), 1) if scores else 0,
            'avg_time': round(sum(times) / len(times), 1) if times else 0,
            'retention': round((returning / len(users_active)) * 100, 1) if users_active else 0,
        }

    c, p = period_stats(cur), period_stats(prev)
    overview = {
        'total_users': len(verified),
        'total_registered': len(users),
        'unverified_pending': len(users) - len(verified),
        'active_users': c['active'],
        'test_attempts': c['attempts'],
        'avg_score': c['avg_score'],
        'avg_time_sec': c['avg_time'],
        'retention_pct': c['retention'],
        'deltas': {
            'active_users': _pct_change(c['active'], p['active']),
            'test_attempts': _pct_change(c['attempts'], p['attempts']),
            'avg_score': round(c['avg_score'] - p['avg_score'], 1) if p['attempts'] else None,
            'avg_time_sec': round(c['avg_time'] - p['avg_time'], 1) if p['attempts'] else None,
            'retention_pct': round(c['retention'] - p['retention'], 1) if p['active'] else None,
        },
    }

    # --- Growth: daily buckets (fill zeros) ---
    growth = []
    active_by_day: Dict[str, set] = {}
    attempts_by_day: Dict[str, int] = {}
    new_by_day: Dict[str, int] = {}
    for s in cur:
        day = datetime.fromtimestamp(s['ts'], tz=timezone.utc).date().isoformat()
        active_by_day.setdefault(day, set()).add(s['user_id'])
        attempts_by_day[day] = attempts_by_day.get(day, 0) + 1
    for u in users:
        cts = _to_epoch(u.get('created_at'))
        if cts >= start_ts:
            day = datetime.fromtimestamp(cts, tz=timezone.utc).date().isoformat()
            new_by_day[day] = new_by_day.get(day, 0) + 1
        login_ts = _to_epoch(u.get('last_login'))
        if login_ts >= start_ts:
            day = datetime.fromtimestamp(login_ts, tz=timezone.utc).date().isoformat()
            active_by_day.setdefault(day, set())
    for i in range(range_days):
        day = (now - timedelta(days=range_days - 1 - i)).date().isoformat()
        growth.append({
            'date': day,
            'new_users': new_by_day.get(day, 0),
            'active_users': len(active_by_day.get(day, set())),
            'attempts': attempts_by_day.get(day, 0),
        })

    # --- Exam performance per paper ---
    def paper_stats(items: list) -> Dict[str, Dict[str, Any]]:
        agg: Dict[str, Dict[str, Any]] = {}
        for s in items:
            a = agg.setdefault(s['paper_name'], {'scores': [], 'times': []})
            a['scores'].append(s['score'])
            a['times'].append(s['time_taken'])
        return agg

    cur_papers, prev_papers = paper_stats(cur), paper_stats(prev)
    exam_performance = []
    for paper in sorted(cur_papers):
        scores = cur_papers[paper]['scores']
        times = cur_papers[paper]['times']
        avg = sum(scores) / len(scores)
        prev_avg = (sum(prev_papers[paper]['scores']) / len(prev_papers[paper]['scores'])
                    if paper in prev_papers and prev_papers[paper]['scores'] else None)
        exam_performance.append({
            'paper_name': paper,
            'exam': _paper_exam(paper),
            'attempts': len(scores),
            'avg_score': round(avg, 1),
            'avg_time_sec': round(sum(times) / len(times), 1) if times else 0,
            'delta_score': round(avg - prev_avg, 1) if prev_avg is not None else None,
        })
    exam_performance.sort(key=lambda x: (-x['attempts'], -x['avg_score']))

    # --- Subject performance: topic accuracy from embedded questions ---
    topic_correct: Dict[str, int] = {}
    topic_total: Dict[str, int] = {}
    for s in cur:
        answers = s['user_answers']
        if not isinstance(answers, dict) or not answers:
            continue
        for q in s['questions']:
            if not isinstance(q, dict):
                continue
            topic = q.get('topic', 'General') or 'General'
            qid = q.get('question_id', '')
            ua = answers.get(qid)
            if ua is None or ua == '':
                continue
            topic_total[topic] = topic_total.get(topic, 0) + 1
            correct = q.get('correct_answer', '')
            qtype = q.get('question_type', 'single_choice')
            if qtype == 'multi_select' and q.get('correct_answers'):
                expected = set(q.get('correct_answers'))
                got = set(ua) if isinstance(ua, list) else {t.strip() for t in str(ua).split(',')}
                is_corr = got == expected
            else:
                is_corr = ua == correct
            if is_corr:
                topic_correct[topic] = topic_correct.get(topic, 0) + 1
    subject_performance = [
        {'topic': t, 'attempts': n,
         'accuracy': round((topic_correct.get(t, 0) / n) * 100, 1)}
        for t, n in topic_total.items() if n >= 2
    ]
    subject_performance.sort(key=lambda x: (-x['attempts'], x['accuracy']))
    subject_performance = subject_performance[:12]

    # --- Actionable insights (rule-based) ---
    insights = []
    drops = [e for e in exam_performance
             if e['delta_score'] is not None and e['delta_score'] <= -3 and e['attempts'] >= 2]
    if drops:
        worst = min(drops, key=lambda e: e['delta_score'])
        insights.append({'level': 'warn',
                         'text': f"{worst['paper_name']} avg score dropped {abs(worst['delta_score'])} pts vs prior period."})
    # Inactive 14+ days (verified users, latest session or login)
    latest_activity: Dict[str, int] = {}
    for s in norm_sessions:
        if s['user_id']:
            latest_activity[s['user_id']] = max(latest_activity.get(s['user_id'], 0), s['ts'])
    for u in verified:
        uid = u.get('user_id', '')
        login_ts = _to_epoch(u.get('last_login'))
        if login_ts > latest_activity.get(uid, 0):
            latest_activity[uid] = login_ts
    inactive = sum(1 for uid in (u.get('user_id', '') for u in verified)
                   if now_ts - latest_activity.get(uid, 0) >= 14 * 86400)
    if inactive:
        insights.append({'level': 'warn',
                         'text': f"{inactive} users haven't attempted a test in 14+ days."})
    gains = [e for e in exam_performance
             if e['delta_score'] is not None and e['delta_score'] >= 3 and e['attempts'] >= 2]
    if gains:
        best = max(gains, key=lambda e: e['delta_score'])
        insights.append({'level': 'good',
                         'text': f"{best['paper_name']} avg score up {best['delta_score']} pts vs prior period."})
    attempts_per_user: Dict[str, int] = {}
    for s in cur:
        if s['user_id']:
            attempts_per_user[s['user_id']] = attempts_per_user.get(s['user_id'], 0) + 1
    power = sum(1 for n in attempts_per_user.values() if n >= 5)
    if power:
        insights.append({'level': 'good',
                         'text': f"{power} users completed 5+ tests in the last {range_days} days."})
    if not insights:
        insights.append({'level': 'info', 'text': 'Not enough data for insights yet.'})

    # --- Recent activity + top users ---
    try:
        uids = list({s['user_id'] for s in cur if s['user_id']})
        names: Dict[str, Dict[str, str]] = {}
        for i in range(0, len(uids), 100):
            batch = [{'user_id': uid} for uid in uids[i:i + 100]]
            batch_resp = dynamodb.meta.client.batch_get_item(
                RequestItems={users_table.name: {
                    'Keys': batch,
                    'ProjectionExpression': 'user_id, full_name, email'}})
            for item in batch_resp.get('Responses', {}).get(users_table.name, []):
                names[item['user_id']] = {
                    'name': item.get('full_name', 'Anonymous'),
                    'email': item.get('email', '')}
    except Exception as e:
        print(f"Error batch-fetching user names for analytics: {e}")
        names = {}

    latest = sorted(cur, key=lambda s: s['ts'], reverse=True)[:10]
    recent_activity = [{
        'user_id': s['user_id'],
        'name': names.get(s['user_id'], {}).get('name', 'Anonymous'),
        'email': names.get(s['user_id'], {}).get('email', ''),
        'paper_name': s['paper_name'],
        'exam': s['exam'],
        'score': s['score'],
        'attempts': attempts_per_user.get(s['user_id'], 0),
        'last_active': datetime.fromtimestamp(s['ts'], tz=timezone.utc).isoformat(),
    } for s in latest]

    user_scores: Dict[str, list] = {}
    for s in cur:
        if s['user_id']:
            user_scores.setdefault(s['user_id'], []).append(s['score'])
    ranked = sorted(user_scores.items(), key=lambda kv: (-len(kv[1]), -(sum(kv[1]) / len(kv[1]))))[:10]
    top_users = [{
        'user_id': uid,
        'full_name': names.get(uid, {}).get('name', 'Anonymous'),
        'email': names.get(uid, {}).get('email', ''),
        'completion_count': len(scores),
        'average_score': round(sum(scores) / len(scores), 1),
    } for uid, scores in ranked]

    # --- Phase 2: funnel, cohorts, difficult questions, drop-off ---
    # Per-user completed timestamps (all time, exam-filtered) + started sets
    # from the any-status scan (started = any session incl. ready/in_progress).
    completed_by_user: Dict[str, list] = {}
    for s in norm_sessions:
        if s['user_id']:
            completed_by_user.setdefault(s['user_id'], []).append(s['ts'])
    started_users = {
        (a.get('user_id', ''))
        for a in all_sessions
        if a.get('user_id')
        and (exam == 'ALL' or (a.get('paper_name', '') or '') in EXAM_PAPERS.get(exam, set()))
    }
    verified_uids = [u.get('user_id', '') for u in verified if u.get('user_id')]

    def _stage_count(pred) -> int:
        return sum(1 for uid in verified_uids if pred(uid))

    active_30d_cutoff = now_ts - 30 * 86400
    funnel_counts = [
        ('registered', 'Registered', len(verified_uids)),
        ('started', 'Started First Test',
         _stage_count(lambda uid: uid in started_users)),
        ('completed_first', 'Completed First Test',
         _stage_count(lambda uid: len(completed_by_user.get(uid, [])) >= 1)),
        ('second_test', 'Attempted 2nd Test',
         _stage_count(lambda uid: len(completed_by_user.get(uid, [])) >= 2)),
        ('five_plus', 'Attempted 5+ Tests',
         _stage_count(lambda uid: len(completed_by_user.get(uid, [])) >= 5)),
        ('active', 'Active Learners (30d)',
         _stage_count(lambda uid: any(t >= active_30d_cutoff
                                      for t in completed_by_user.get(uid, [])))),
    ]
    funnel = []
    for i, (stage, label, count) in enumerate(funnel_counts):
        prev_count = funnel_counts[i - 1][2] if i > 0 else count
        funnel.append({
            'stage': stage, 'label': label, 'count': count,
            'conversion': round((count / prev_count) * 100, 1) if prev_count else 0,
        })

    # --- Cohorts: signup week -> completed-test activity in weeks 0..3 ---
    from collections import defaultdict as _dd
    cohort_members: Dict[str, list] = _dd(list)  # monday -> [(uid, created_ts)]
    for u in verified:
        cts = _to_epoch(u.get('created_at'))
        if not cts or not u.get('user_id'):
            continue
        monday = (datetime.fromtimestamp(cts, tz=timezone.utc)
                  - timedelta(days=datetime.fromtimestamp(cts, tz=timezone.utc).weekday()))
        cohort_members[monday.date().isoformat()].append((u['user_id'], cts))
    cohorts = []
    for monday in sorted(cohort_members, reverse=True)[:6]:
        members = cohort_members[monday]
        size = len(members)
        weeks = []
        for w in range(4):
            # window relative to each member's own signup, aggregated:
            # only members whose window has fully elapsed count toward denom.
            denom = sum(1 for _, cts in members if cts + (w + 1) * 7 * 86400 <= now_ts)
            if not denom:
                weeks.append(None)
                continue
            hits = sum(
                1 for uid, cts in members
                if cts + (w + 1) * 7 * 86400 <= now_ts
                and any(cts + w * 7 * 86400 <= t < cts + (w + 1) * 7 * 86400
                        for t in completed_by_user.get(uid, []))
            )
            weeks.append(round((hits / denom) * 100, 1))
        cohorts.append({'cohort': monday, 'size': size,
                        'w0': weeks[0], 'w1': weeks[1], 'w2': weeks[2], 'w3': weeks[3]})

    # --- Difficult questions: per-question accuracy in range ---
    qstats: Dict[str, Dict[str, Any]] = {}
    for s in cur:
        answers = s['user_answers']
        if not isinstance(answers, dict) or not answers:
            continue
        for q in s['questions']:
            if not isinstance(q, dict):
                continue
            qid = q.get('question_id', '')
            if not qid:
                continue
            e = qstats.setdefault(qid, {
                'question_id': qid,
                'paper_name': s['paper_name'],
                'topic': q.get('topic', 'General') or 'General',
                'question_text': str(q.get('question_text', ''))[:120],
                'attempts': 0, 'correct': 0, 'skips': 0,
                '_correct_answer': q.get('correct_answer', ''),
                '_correct_answers': q.get('correct_answers'),
                '_qtype': q.get('question_type', 'single_choice'),
            })
            ua = answers.get(qid)
            if ua is None or ua == '':
                e['skips'] += 1
                continue
            e['attempts'] += 1
            if e['_qtype'] == 'multi_select' and e['_correct_answers']:
                expected = set(e['_correct_answers'])
                got = set(ua) if isinstance(ua, list) else {t.strip() for t in str(ua).split(',')}
                if got == expected:
                    e['correct'] += 1
            elif ua == e['_correct_answer']:
                e['correct'] += 1
    difficult_questions = []
    for e in qstats.values():
        if e['attempts'] < 2:
            continue
        acc = round((e['correct'] / e['attempts']) * 100, 1)
        difficult_questions.append({
            'question_id': e['question_id'],
            'paper_name': e['paper_name'],
            'topic': e['topic'],
            'question_text': e['question_text'],
            'attempts': e['attempts'],
            'accuracy': acc,
            'skip_count': e['skips'],
            'suspect': acc < 25 and e['attempts'] >= 5,
        })
    difficult_questions.sort(key=lambda x: (x['accuracy'], -x['attempts']))
    difficult_questions = difficult_questions[:15]

    # --- Drop-off analysis ---
    one_and_done = _stage_count(lambda uid: len(completed_by_user.get(uid, [])) == 1)
    abandoned = 0
    for a in all_sessions:
        status = a.get('status', '')
        if status == 'expired':
            abandoned += 1
        elif status in ('ready', 'in_progress'):
            cts = _to_epoch(a.get('created_at'))
            if cts and now_ts - cts > 24 * 3600 and not _to_epoch(a.get('submitted_at')):
                abandoned += 1
    dropoff = [
        {'label': 'Signed up but never verified',
         'count': len(users) - len(verified),
         'detail': 'Unverified accounts pending email confirmation (auto-purge via TTL).'},
        {'label': 'Started a test but never completed one',
         'count': max(0, funnel[1]['count'] - funnel[2]['count']),
         'detail': 'Users with a session but zero completions — onboarding friction.'},
        {'label': 'Completed exactly one test, never returned',
         'count': one_and_done,
         'detail': 'One-and-done users; prime re-engagement targets.'},
        {'label': 'Abandoned sessions (expired/stale)',
         'count': abandoned,
         'detail': 'Sessions expired by timer or stale >24h without submit.'},
        {'label': 'Inactive 14+ days',
         'count': inactive,
         'detail': 'Verified users with no test activity in 14+ days (churn risk).'},
    ]

    return {
        'range_days': range_days,
        'exam': exam,
        'overview': overview,
        'growth': growth,
        'exam_performance': exam_performance,
        'subject_performance': subject_performance,
        'insights': insights,
        'recent_activity': recent_activity,
        'top_users': top_users,
        'funnel': funnel,
        'cohorts': cohorts,
        'difficult_questions': difficult_questions,
        'dropoff': dropoff,
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
        if path == '/dashboard/analytics' and http_method == 'GET':
            query_params = event.get('queryStringParameters', {}) or {}
            admin_err = _require_admin_response(user_id)
            if admin_err:
                return admin_err
            try:
                range_days = int(query_params.get('range', '30'))
            except (TypeError, ValueError):
                range_days = 30
            if range_days not in (7, 30, 90):
                range_days = 30
            exam_filter = (query_params.get('exam') or 'ALL').upper()
            return success_response(200, get_admin_analytics(range_days, exam_filter))
        elif (path == '/dashboard/performance' or path == '/dashboard') and http_method == 'GET':
            dashboard_data = get_dashboard_data(user_id)
            return success_response(200, dashboard_data)
        elif path == '/dashboard/leaderboard' and http_method == 'GET':
            query_params = event.get('queryStringParameters', {}) or {}
            exam_filter = query_params.get('exam', 'JAIIB')
            leaderboard_data = get_leaderboard(exam_filter)
            return success_response(200, leaderboard_data)
        else:
            return error_response(404, f'Endpoint not found: {path}')
    
    except Exception as e:
        print(f"Error: {e}")
        return error_response(500, 'Internal server error')
