# JAIIB-CAIIB Exam Prep Portal - Technical Design Document

## Overview

The JAIIB-CAIIB Exam Prep Portal is a full-stack web application built on AWS infrastructure designed to help bank officers prepare for IIBF certification exams. The system provides adaptive practice sets, AI-powered tutoring with regulatory citations, comprehensive performance tracking, and administrative analytics.

### Key Design Principles

- **Scalability**: Auto-scaling Lambda functions and DynamoDB to handle 100+ concurrent users
- **Security**: End-to-end encryption with AWS KMS, bcrypt password hashing, audit logging
- **Resilience**: Retry logic with exponential backoff, graceful error handling, fallback mechanisms
- **Performance**: Sub-500ms practice set generation, <200ms API responses, <1s dashboard load
- **User Experience**: Responsive design across desktop/tablet/mobile, real-time feedback, adaptive learning

## Architecture Overview

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend Layer                            │
│  React.js 18 + Tailwind CSS (AWS Amplify Hosting)              │
│  - Authentication UI                                             │
│  - Practice Set Interface                                        │
│  - Performance Dashboard                                         │
│  - Admin Analytics                                               │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS/TLS 1.2+
┌────────────────────────▼────────────────────────────────────────┐
│                    API Gateway Layer                             │
│  - Request routing and validation                                │
│  - Rate limiting (100 req/min per user)                         │
│  - CORS configuration                                            │
│  - Request/response transformation                               │
└────────────────────────┬────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
┌───────▼────────┐ ┌────▼──────────┐ ┌──▼──────────────┐
│  Lambda Layer  │ │ Bedrock AI    │ │ CloudWatch      │
│  (Python)      │ │ Service       │ │ Monitoring      │
│  - Auth        │ │ - Claude 4.5  │ │ - Logs          │
│  - Practice    │ │   Haiku       │ │ - Metrics       │
│  - Scoring     │ │ - Explanations│ │ - Alarms        │
│  - Analytics   │ │ - Citations   │ │ - Dashboards    │
└───────┬────────┘ └───────────────┘ └─────────────────┘
        │
┌───────▼────────────────────────────────────────────────┐
│              Data Layer                                 │
│  DynamoDB (KMS Encrypted)                              │
│  - Users table                                          │
│  - Practice sessions table                              │
│  - Scores table                                         │
│  - Question bank table                                  │
│  - Audit logs table                                     │
│  - Notifications table                                  │
└────────────────────────────────────────────────────────┘
```

### Component Architecture

**Frontend Components:**
- Authentication Module (Login, Registration, Password Reset)
- Practice Set Interface (Question Display, Timer, Answer Selection)
- Results Display (Score, Feedback, AI Explanation Request)
- Performance Dashboard (Charts, Trends, Analytics)
- Admin Dashboard (User Analytics, Question Management)
- Notification Center

**Backend Services:**
- Authentication Service (JWT tokens, session management)
- Practice Set Generator (Adaptive question selection)
- Scoring Engine (Score calculation, result storage)
- AI Tutor Service (Bedrock integration, explanation generation)
- Question Bank Manager (CRUD operations, versioning)
- Analytics Service (Aggregation, reporting)
- Audit Logger (Compliance tracking)
- Notification Service (Event-driven notifications)

## Data Models

### DynamoDB Tables

**1. Users Table**
```
PK: user_id (UUID)
SK: email (GSI)
Attributes:
  - full_name: string
  - password_hash: string (bcrypt)
  - email_verified: boolean
  - created_at: timestamp
  - last_login: timestamp
  - role: enum (bank_officer, trainer, admin)
  - status: enum (active, inactive, suspended)
  - preferences: map (notifications_enabled, theme, etc.)
```

**2. Practice Sessions Table**
```
PK: session_id (UUID)
SK: user_id (GSI)
Attributes:
  - paper_name: string (IE & IFS, PPB, AFB, RBWM)
  - questions: list of question_ids
  - user_answers: map (question_id -> selected_option)
  - score: number (0-100)
  - time_taken: number (seconds)
  - submitted_at: timestamp
  - status: enum (in_progress, completed, expired)
  - version: string (question bank version)
```

**3. Scores Table**
```
PK: user_id (UUID)
SK: submitted_at (timestamp)
Attributes:
  - session_id: string
  - paper_name: string
  - score: number
  - questions_correct: number
  - time_taken: number
  - topic_breakdown: map (topic -> accuracy%)
```

**4. Question Bank Table**
```
PK: question_id (UUID)
SK: version (string, e.g., "v1.0")
Attributes:
  - paper_name: string
  - topic: string
  - difficulty: enum (easy, medium, hard)
  - question_text: string
  - options: list [A, B, C, D]
  - correct_answer: string (A/B/C/D)
  - rbi_reference: string
  - iibf_reference: string
  - created_at: timestamp
  - created_by: user_id
  - status: enum (active, inactive)
```

**5. Audit Logs Table**
```
PK: log_id (UUID)
SK: timestamp (timestamp)
Attributes:
  - user_id: string
  - action_type: string (login, logout, practice_submit, etc.)
  - resource_id: string
  - resource_type: string
  - result: enum (success, failure)
  - ip_address: string
  - device_info: string
  - details: map (encrypted)
```

**6. Notifications Table**
```
PK: user_id (UUID)
SK: notification_id (UUID)
Attributes:
  - type: string (milestone, reminder, update)
  - title: string
  - message: string
  - read: boolean
  - created_at: timestamp
  - action_url: string (optional)
```

## API Endpoints

### Authentication Endpoints

```
POST /api/auth/register
  Request: { email, password, full_name }
  Response: { user_id, message, verification_email_sent }
  
POST /api/auth/verify-email
  Request: { token }
  Response: { success, message }
  
POST /api/auth/login
  Request: { email, password }
  Response: { access_token, refresh_token, user_id, role }
  
POST /api/auth/logout
  Request: { access_token }
  Response: { success }
  
POST /api/auth/refresh-token
  Request: { refresh_token }
  Response: { access_token }
  
POST /api/auth/password-reset-request
  Request: { email }
  Response: { message, reset_link_sent }
  
POST /api/auth/password-reset
  Request: { token, new_password }
  Response: { success, message }
```

### Practice Set Endpoints

```
POST /api/practice/generate
  Request: { paper_name }
  Response: { session_id, questions: [{ id, text, options }], timer_duration }
  
POST /api/practice/submit
  Request: { session_id, answers: { question_id: option } }
  Response: { score, results: [{ question_id, correct, user_answer, correct_answer }] }
  
GET /api/practice/session/{session_id}
  Response: { session_data, questions, user_answers, status }
  
GET /api/practice/results/{session_id}
  Response: { score, results, time_taken, paper_name }
```

### AI Tutor Endpoints

```
POST /api/tutor/explain
  Request: { question_id, session_id }
  Response: { explanation, citations: [{ source, reference }], follow_up_questions }
  
POST /api/tutor/save-explanation
  Request: { question_id, explanation_id }
  Response: { success }
```

### Dashboard Endpoints

```
GET /api/dashboard/performance
  Response: { overall_score, trend_data, paper_breakdown, weak_areas, strong_areas }
  
GET /api/dashboard/analytics
  Response: { total_users, active_users, avg_score, completion_rate, performance_by_paper }
  
GET /api/dashboard/audit-logs
  Request: { date_range, action_type, user_id }
  Response: { logs: [{ timestamp, action, user, result }] }
```

### Question Bank Endpoints

```
POST /api/questions/create
  Request: { question_text, options, correct_answer, topic, difficulty, references }
  Response: { question_id, version }
  
PUT /api/questions/{question_id}
  Request: { question_text, options, correct_answer, topic, difficulty, references }
  Response: { question_id, new_version }
  
GET /api/questions/search
  Request: { paper, topic, difficulty, keyword }
  Response: { questions: [{ id, text, topic, difficulty }] }
  
POST /api/questions/version/publish
  Request: { version_number, change_summary }
  Response: { version_id, published_at }
  
POST /api/questions/version/rollback
  Request: { target_version }
  Response: { success, rolled_back_version }
```

## Lambda Functions

### Authentication Lambda

```python
def handler(event, context):
    action = event['action']
    
    if action == 'register':
        return register_user(event['body'])
    elif action == 'login':
        return authenticate_user(event['body'])
    elif action == 'verify_email':
        return verify_email(event['body'])
    elif action == 'reset_password':
        return reset_password(event['body'])
    
    return error_response(400, "Invalid action")
```

### Practice Set Generator Lambda

```python
def handler(event, context):
    user_id = event['user_id']
    paper_name = event['paper_name']
    
    # Get user's performance history
    user_performance = get_user_performance(user_id)
    
    # Determine selection strategy
    if len(user_performance['sessions']) < 10:
        questions = select_random_questions(paper_name, 4)
    else:
        weak_areas = identify_weak_areas(user_performance)
        questions = select_adaptive_questions(paper_name, weak_areas, 4)
    
    # Create session
    session_id = create_session(user_id, paper_name, questions)
    
    return {
        'session_id': session_id,
        'questions': format_questions(questions),
        'timer_duration': 600  # 10 minutes in seconds
    }
```

### Scoring Engine Lambda

```python
def handler(event, context):
    session_id = event['session_id']
    user_answers = event['answers']
    
    # Get session and questions
    session = get_session(session_id)
    questions = get_questions(session['question_ids'])
    
    # Calculate score
    correct_count = 0
    results = []
    
    for question in questions:
        user_answer = user_answers.get(question['id'])
        is_correct = user_answer == question['correct_answer']
        correct_count += is_correct
        
        results.append({
            'question_id': question['id'],
            'correct': is_correct,
            'user_answer': user_answer,
            'correct_answer': question['correct_answer']
        })
    
    score = (correct_count / len(questions)) * 100
    
    # Store score
    store_score(session_id, score, results)
    
    return {
        'score': score,
        'results': results,
        'passed': score >= 75
    }
```

### AI Tutor Lambda

```python
def handler(event, context):
    question_id = event['question_id']
    user_id = event['user_id']
    
    # Get question and user context
    question = get_question(question_id)
    user_context = get_user_performance_context(user_id, question['topic'])
    
    # Generate explanation using Bedrock
    prompt = build_tutor_prompt(question, user_context)
    explanation = invoke_bedrock(prompt)
    
    # Extract citations
    citations = extract_citations(explanation)
    
    # Log request
    log_tutor_request(user_id, question_id)
    
    return {
        'explanation': explanation,
        'citations': citations,
        'word_count': len(explanation.split())
    }
```

## Frontend Architecture

### Component Structure

```
App/
├── Layout/
│   ├── Header (Navigation, User Menu)
│   ├── Sidebar (Navigation Links)
│   └── Footer
├── Auth/
│   ├── LoginPage
│   ├── RegisterPage
│   └── PasswordResetPage
├── Practice/
│   ├── PaperSelection
│   ├── PracticeSetInterface
│   │   ├── QuestionDisplay
│   │   ├── OptionButtons
│   │   ├── Timer
│   │   └── SubmitButton
│   └── ResultsDisplay
│       ├── ScoreCard
│       ├── QuestionReview
│       └── AIExplanationRequest
├── Dashboard/
│   ├── PerformanceOverview
│   ├── ScoreTrends (Chart)
│   ├── PaperBreakdown (Chart)
│   ├── WeakAreas
│   └── RecommendedPractice
├── Admin/
│   ├── AnalyticsDashboard
│   ├── QuestionBankManager
│   ├── UserManagement
│   └── AuditLogs
└── Notifications/
    └── NotificationCenter
```

### State Management

Using React Context + Hooks:
- AuthContext: User authentication state, tokens
- PracticeContext: Current session, questions, answers, timer
- DashboardContext: Performance data, charts
- NotificationContext: Notifications, alerts

### Responsive Breakpoints

- Desktop: 1920px+ (full layout)
- Tablet: 768px-1919px (collapsible sidebar)
- Mobile: <768px (hamburger menu, stacked layout)

## Error Handling and Resilience

### Retry Strategy

```python
def retry_with_backoff(func, max_retries=3):
    for attempt in range(max_retries):
        try:
            return func()
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            wait_time = 2 ** attempt  # 1s, 2s, 4s
            time.sleep(wait_time)
```

### Error Categories

1. **Database Errors**: Retry with exponential backoff
2. **API Timeouts**: Return 504 with retry suggestion
3. **Bedrock Unavailable**: Queue for retry, show fallback message
4. **Authentication Failures**: Redirect to login
5. **Validation Errors**: Return 400 with error details

### Fallback Mechanisms

- AI explanation timeout: Display cached explanation or generic guidance
- Dashboard data unavailable: Show cached data with "last updated" timestamp
- Question bank unavailable: Use previous version

## Security Implementation

### Authentication Flow

```
1. User registers with email/password
2. Password hashed with bcrypt (12 salt rounds)
3. Verification email sent
4. User clicks verification link
5. Account marked as verified
6. User logs in with email/password
7. JWT token generated (30-min expiry)
8. Refresh token stored in httpOnly cookie
9. Token validated on each request
10. Session expires after 30 min inactivity
```

### Data Encryption

- **At Rest**: DynamoDB encrypted with AWS KMS (customer-managed key)
- **In Transit**: TLS 1.2+ for all API calls
- **Sensitive Fields**: Passwords hashed with bcrypt, tokens encrypted
- **Audit Logs**: Encrypted with separate KMS key

### Authorization

- Role-based access control (bank_officer, trainer, admin)
- API endpoints validate user role
- Question bank edits restricted to trainers/admins
- Analytics restricted to admins

## Performance Optimization

### Caching Strategy

- **Frontend**: React Query for API response caching (5-min TTL)
- **Backend**: DynamoDB DAX for hot data (questions, user profiles)
- **CloudFront**: CDN for static assets (images, CSS, JS)

### Database Optimization

- GSI on email for user lookups
- GSI on user_id for session queries
- Partition key design for even distribution
- TTL on temporary data (reset tokens, sessions)

### Lambda Optimization

- Connection pooling for DynamoDB
- Warm start optimization (provisioned concurrency)
- Minimal dependencies for fast cold starts
- Async processing for non-critical operations

## Monitoring and Observability

### CloudWatch Metrics

- API response times (p50, p95, p99)
- Lambda invocation count and duration
- DynamoDB read/write capacity utilization
- Error rates by endpoint
- User session count
- Practice set generation latency

### CloudWatch Logs

- All Lambda function logs
- API Gateway access logs
- Authentication events
- Error stack traces
- Audit trail

### Alarms

- API response time > 500ms
- Error rate > 1%
- DynamoDB throttling
- Lambda concurrent execution limit
- Bedrock service unavailable

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: User Registration Creates Verified Account

*For any* valid user registration with email, password, and full name, submitting the registration form should create a user account in the database and send a verification email.

**Validates: Requirements 1.2**

### Property 2: Email Verification Enables Login

*For any* registered user who clicks the verification link in their email, the account should be marked as verified and the user should be able to log in with their credentials.

**Validates: Requirements 1.3**

### Property 3: Valid Credentials Authenticate User

*For any* verified user with correct email and password, the authentication service should create a valid session token that can be used for subsequent requests.

**Validates: Requirements 1.4**

### Property 4: Invalid Credentials Rejected

*For any* invalid email/password combination, the authentication service should reject the login attempt without revealing whether the email exists in the system.

**Validates: Requirements 1.5**

### Property 5: Session Timeout Enforces Inactivity

*For any* user session that remains inactive for 30 minutes, the session should be automatically invalidated and the user should be redirected to the login page.

**Validates: Requirements 1.8**

### Property 6: Practice Set Contains Unique Questions

*For any* practice set generated for a user, the set should contain exactly 4 unique questions from the selected paper's question bank with no duplicates.

**Validates: Requirements 2.2, 2.3**

### Property 7: Adaptive Selection Favors Weak Areas

*For any* user who has completed 10 or more practice sets, the practice set generator should weight question selection toward topics where the user has <70% accuracy.

**Validates: Requirements 2.6**

### Property 8: Timer Accuracy Within Tolerance

*For any* practice session, the timer should display remaining time in MM:SS format and update every second with ±1 second deviation from actual elapsed time.

**Validates: Requirements 3.1, 3.8**

### Property 9: Auto-Submit at Timeout

*For any* practice session where the timer reaches 0 seconds, the system should automatically submit the practice set and display results without user intervention.

**Validates: Requirements 3.4**

### Property 10: Score Calculation Accuracy

*For any* submitted practice set, the score should be calculated as (correct_answers / 4) × 100 and stored in the database with 100% accuracy.

**Validates: Requirements 4.1, 4.4**

### Property 11: Score Display Reflects Submission

*For any* submitted practice set, the results display should show the user's selected answer and the correct answer for each question, with correct/incorrect indicators.

**Validates: Requirements 4.3, 4.5, 4.6**

### Property 12: Pass/Fail Badge Displays Correctly

*For any* submitted practice set, if the score is ≥75%, a "Passed" badge with green highlighting should display; if <75%, a "Review Needed" message with orange highlighting should display.

**Validates: Requirements 4.7, 4.8**

### Property 13: AI Explanation Generation Latency

*For any* request for an AI explanation, the system should generate and return the explanation within 5 seconds, or display a fallback message if the timeout is exceeded.

**Validates: Requirements 5.2, 5.8**

### Property 14: Explanation Contains Required Elements

*For any* AI-generated explanation, it should include the correct answer with reasoning, relevant RBI/IIBF citations, key concepts, and common misconceptions, with word count between 150-300 words.

**Validates: Requirements 5.3, 5.7**

### Property 15: Dashboard Displays All Metrics

*For any* user accessing the Performance Dashboard, the dashboard should display overall score, score trends (30-day chart), performance by paper, weak areas, strong areas, total study time, and recommended practice areas.

**Validates: Requirements 6.1-6.11**

### Property 16: Dashboard Load Time Performance

*For any* dashboard access, the page should load within 1 second (p95) and charts should render within 500ms.

**Validates: Requirements 6 (Success Metrics)**

### Property 17: Question Bank Versioning Preserves History

*For any* question bank edit, the system should create a new version while preserving the previous version, recording the editor's user ID, timestamp, and change description.

**Validates: Requirements 7.6, 7.7**

### Property 18: Version Rollback Restores State

*For any* question bank rollback to a previous version, the system should restore all questions to their state in that version and create a new version snapshot documenting the rollback.

**Validates: Requirements 15.6, 15.8**

### Property 19: Database Retry Logic Succeeds

*For any* database operation that fails initially, the system should retry up to 3 times with exponential backoff (1s, 2s, 4s) and succeed if the operation succeeds on any retry.

**Validates: Requirements 8.1**

### Property 20: Error Logging Completeness

*For any* error that occurs in the system, the error should be logged to CloudWatch with user ID, timestamp, action, error details, and stack trace for audit purposes.

**Validates: Requirements 8.10, 12.1**

### Property 21: Responsive Layout Adapts to Viewport

*For any* viewport size (desktop ≥1920px, tablet 768-1919px, mobile <768px), the UI should display an appropriate layout with proper spacing, readable text, and touch-friendly buttons (≥44×44px on mobile).

**Validates: Requirements 9.1-9.7**

### Property 22: Mobile Load Time Performance

*For any* user accessing the Portal on a mobile device over 3G network, the page should load within 3 seconds (p95).

**Validates: Requirements 9.8**

### Property 23: Notification Delivery Success

*For any* notification event (milestone, reminder, update), the system should deliver the notification to the user within 5 seconds with >99% success rate.

**Validates: Requirements 10.1-10.10**

### Property 24: Audit Log Immutability

*For any* audit log entry created, the entry should be stored in a tamper-proof manner and encrypted with AWS KMS, with access to audit logs themselves logged (meta-audit logging).

**Validates: Requirements 12.7, 12.11**

### Property 25: Data Encryption Coverage

*For any* sensitive data (passwords, tokens, personal information) stored in DynamoDB, the data should be encrypted using AWS KMS with a customer-managed key.

**Validates: Requirements 13.1, 13.3**

### Property 26: TLS Encryption for Data in Transit

*For any* data transmitted between frontend and backend, the transmission should use TLS 1.2 or higher encryption.

**Validates: Requirements 13.2**

### Property 27: API Response Time Performance

*For any* API request, the system should respond within 200ms (p95) under normal load conditions.

**Validates: Requirements 14.1**

### Property 28: Practice Set Generation Latency

*For any* practice set generation request, the system should complete within 500ms (p95).

**Validates: Requirements 14.2**

### Property 29: System Scalability Under Load

*For any* load up to 1000 concurrent users, the system should maintain API response time within 500ms (p95) and availability >99.9%.

**Validates: Requirements 14.4, 14.10**

### Property 30: Auto-Scaling Triggers Correctly

*For any* DynamoDB capacity reaching 80% utilization or Lambda invocations exceeding 1000/second, the auto-scaler should increase provisioned capacity by 50% or increase concurrent execution limit.

**Validates: Requirements 14.6, 14.7**

## Testing Strategy

### Unit Testing Approach

Unit tests focus on specific examples, edge cases, and error conditions:

- Authentication: Valid/invalid credentials, password reset flow, token expiration
- Scoring: Score calculation with 0-4 correct answers, edge cases (0%, 25%, 50%, 75%, 100%)
- Timer: Timer display format, color changes at thresholds, auto-submission
- Question selection: Random selection for new users, adaptive selection for experienced users
- Error handling: Retry logic, fallback messages, error logging

### Property-Based Testing Approach

Property-based tests verify universal properties across all inputs using randomization:

- **Authentication**: For all valid user data, registration should create account and send email
- **Practice Sets**: For all users and papers, generated sets should contain 4 unique questions
- **Scoring**: For all answer combinations, score should equal (correct/4)*100
- **Adaptive Selection**: For all users with 10+ sessions, weak areas should be weighted higher
- **Timer**: For all sessions, timer should update every second with ±1s accuracy
- **Dashboard**: For all users, dashboard should display all required metrics
- **Encryption**: For all sensitive data, encryption should be applied consistently
- **Audit Logging**: For all user actions, audit logs should be created with all required fields

### Property Test Configuration

Each property-based test will:
- Run minimum 100 iterations with randomized inputs
- Use appropriate generators for each data type (emails, passwords, scores, etc.)
- Reference the design document property in test comments
- Tag with format: **Feature: jaiib-caiib-exam-prep-portal, Property {number}: {property_text}**
- Verify both success and failure paths

### Test Coverage Goals

- Unit tests: 80% code coverage
- Property tests: All 30 correctness properties implemented
- Integration tests: Key workflows (registration → practice → scoring → dashboard)
- Performance tests: Latency targets for all critical paths
- Security tests: Encryption, authentication, authorization

## Deployment and Operations

### Deployment Pipeline

1. Code commit to repository
2. Automated tests run (unit, property, integration)
3. Build artifacts created (Lambda packages, frontend bundle)
4. Deploy to staging environment
5. Smoke tests run
6. Manual approval for production
7. Blue-green deployment to production
8. Health checks and monitoring

### Infrastructure as Code

- AWS CloudFormation templates for all resources
- Lambda function definitions
- DynamoDB table schemas
- API Gateway configuration
- IAM roles and policies
- CloudWatch alarms and dashboards

### Monitoring and Alerting

- Real-time dashboards for system health
- Alerts for performance degradation
- Error rate monitoring
- Capacity utilization tracking
- Cost monitoring and optimization

## Conclusion

This design document provides a comprehensive blueprint for implementing the JAIIB-CAIIB Exam Prep Portal. The architecture prioritizes scalability, security, and performance while maintaining a focus on user experience and learning outcomes. The system is designed to handle 100+ concurrent users with sub-500ms practice set generation and <200ms API responses, supported by comprehensive monitoring, error handling, and audit logging for compliance.
