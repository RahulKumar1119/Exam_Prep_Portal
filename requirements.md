# JAIIB-CAIIB Exam Prep Portal - Requirements Document

## Introduction

The JAIIB-CAIIB Exam Prep Portal is a full-stack web application designed to help bank officers prepare for IIBF (Indian Institute of Banking and Finance) certification exams. The portal provides adaptive practice sets, AI-powered tutoring with regulatory citations, performance tracking, and comprehensive analytics. The system is built on AWS infrastructure with React.js frontend, Python Lambda backend, DynamoDB database, and AWS Bedrock for AI services.

## Glossary

- **Portal**: The JAIIB-CAIIB Exam Prep Portal web application
- **User**: Any individual accessing the Portal (bank officers, trainers, administrators)
- **Bank Officer**: Primary user role preparing for JAIIB/CAIIB certification exams
- **Trainer**: User role managing question banks and monitoring trainee progress
- **Administrator**: User role managing system configuration, analytics, and compliance
- **Practice Set**: A collection of 4 multiple-choice questions (MCQs) from a specific JAIIB paper
- **JAIIB Paper**: One of four certification exam papers: IE & IFS, PPB, AFB, RBWM
- **MCQ**: Multiple-choice question with 4 options and one correct answer
- **Session**: A timed practice set attempt (10 minutes duration)
- **Score**: Numerical result calculated based on correct answers in a session
- **Feedback**: Immediate response provided after session completion
- **AI Tutor**: AWS Bedrock Claude 4.5 Haiku service providing explanations and guidance
- **RBI/IIBF Norms**: Regulatory guidelines and standards from Reserve Bank of India and IIBF
- **Question Bank**: Repository of all MCQs organized by paper and topic
- **Performance Dashboard**: User interface displaying score trends and learning analytics
- **Audit Log**: Record of all system activities for compliance and security
- **KMS**: AWS Key Management Service for encryption key management
- **DynamoDB**: AWS NoSQL database for storing application data
- **Lambda**: AWS serverless compute service for backend logic
- **API Gateway**: AWS service for managing REST API endpoints
- **CloudWatch**: AWS monitoring and logging service
- **Amplify**: AWS hosting platform for React frontend

## Requirements

### Requirement 1: User Authentication and Registration

**User Story:** As a bank officer, I want to securely register and authenticate to the Portal, so that my learning progress is protected and personalized.

#### Acceptance Criteria

1. WHEN a new user accesses the Portal, THE Portal SHALL display a registration form requesting email, password, full name, and bank affiliation
2. WHEN a user submits the registration form with valid data, THE Authentication_Service SHALL create a user account and send a verification email
3. WHEN a user clicks the verification link in the email, THE Authentication_Service SHALL mark the account as verified
4. WHEN a verified user enters valid credentials on the login page, THE Authentication_Service SHALL authenticate the user and create a session token
5. WHEN a user enters invalid credentials, THE Authentication_Service SHALL reject the login attempt and display an error message without revealing whether the email exists
6. WHEN a user requests a password reset, THE Authentication_Service SHALL send a reset link valid for 24 hours
7. WHEN a user clicks the reset link and enters a new password, THE Authentication_Service SHALL update the password using bcrypt with minimum 12-character salt rounds
8. WHEN a user session expires after 30 minutes of inactivity, THE Portal SHALL redirect the user to the login page
9. WHEN a user logs out, THE Authentication_Service SHALL invalidate the session token immediately

#### Success Metrics

- Registration completion rate: >80% of users who start registration complete it
- Login success rate: >99% for valid credentials
- Password reset success rate: >95%

---

### Requirement 2: Practice Set Generation

**User Story:** As a bank officer, I want to generate practice sets with 4 MCQs from a specific JAIIB paper, so that I can practice exam-style questions efficiently.

#### Acceptance Criteria

1. WHEN a user selects a JAIIB paper (IE & IFS, PPB, AFB, or RBWM), THE Practice_Set_Generator SHALL display a "Generate Practice Set" button
2. WHEN a user clicks "Generate Practice Set", THE Practice_Set_Generator SHALL randomly select 4 unique MCQs from the selected paper's question bank
3. WHEN a practice set is generated, THE Practice_Set_Generator SHALL ensure no MCQ appears twice in the same user session
4. WHEN a practice set is generated, THE Practice_Set_Generator SHALL assign a unique session ID and record the generation timestamp
5. WHEN a user has completed fewer than 10 practice sets, THE Practice_Set_Generator SHALL randomly select from all difficulty levels
6. WHEN a user has completed 10 or more practice sets, THE Practice_Set_Generator SHALL weight selection toward questions matching the user's weak areas (topics with <70% accuracy)
7. WHEN a practice set is generated, THE Portal SHALL display all 4 MCQs with options A, B, C, D and start a 10-minute countdown timer
8. WHEN a user generates a new practice set before completing the current one, THE Portal SHALL save the incomplete session and start the new session

#### Success Metrics

- Practice set generation latency: <500ms
- Question uniqueness: 100% within a session
- Adaptive selection accuracy: >85% of weak-area questions correctly identified

---

### Requirement 3: Session Timer Management

**User Story:** As a bank officer, I want a visible timer for each 10-minute practice session, so that I can manage my time effectively during practice.

#### Acceptance Criteria

1. WHEN a practice set is displayed, THE Timer SHALL show the remaining time in MM:SS format
2. WHEN the timer reaches 5 minutes remaining, THE Timer SHALL change color to yellow as a warning
3. WHEN the timer reaches 1 minute remaining, THE Timer SHALL change color to red and display a warning message
4. WHEN the timer reaches 0 seconds, THE Timer SHALL automatically submit the practice set and display results
5. WHEN a user manually submits before time expires, THE Timer SHALL stop and record the submission time
6. WHEN a user navigates away from the practice set page, THE Timer SHALL pause and resume when the user returns within 5 minutes
7. IF a user's session is inactive for more than 5 minutes, THEN THE Timer SHALL expire the session and display a "Session Expired" message
8. WHEN the timer is running, THE Portal SHALL update the display every second with no perceptible lag

#### Success Metrics

- Timer accuracy: ±1 second deviation
- Timer display update latency: <100ms
- Session timeout reliability: 100% enforcement

---

### Requirement 4: MCQ Scoring Engine

**User Story:** As a bank officer, I want immediate scoring and feedback after completing a practice set, so that I can understand my performance instantly.

#### Acceptance Criteria

1. WHEN a practice set is submitted, THE Scoring_Engine SHALL calculate the score as (correct_answers / 4) × 100
2. WHEN a practice set is submitted, THE Scoring_Engine SHALL display the score as a percentage (0-100%)
3. WHEN a practice set is submitted, THE Scoring_Engine SHALL display which questions were answered correctly and incorrectly
4. WHEN a practice set is submitted, THE Scoring_Engine SHALL record the score, timestamp, paper name, and session ID in the database
5. WHEN a user views their score, THE Portal SHALL display the correct answer for each question
6. WHEN a user views their score, THE Portal SHALL display the user's selected answer for each question
7. WHEN a user scores 75% or higher, THE Portal SHALL display a "Passed" badge with green highlighting
8. WHEN a user scores below 75%, THE Portal SHALL display a "Review Needed" message with orange highlighting
9. WHEN a practice set is submitted, THE Scoring_Engine SHALL calculate and store the time taken to complete the set
10. WHEN a user views results, THE Portal SHALL provide a "Request AI Explanation" button for each incorrect answer

#### Success Metrics

- Scoring calculation accuracy: 100%
- Score display latency: <200ms
- Score recording reliability: 100% (no lost scores)

---

### Requirement 5: AI-Powered Tutoring with RBI/IIBF Citations

**User Story:** As a bank officer, I want AI-powered explanations for incorrect answers with regulatory citations, so that I can learn the correct concepts backed by official guidelines.

#### Acceptance Criteria

1. WHEN a user clicks "Request AI Explanation" for an incorrect answer, THE AI_Tutor SHALL invoke AWS Bedrock Claude 4.5 Haiku
2. WHEN the AI_Tutor receives a request, THE AI_Tutor SHALL generate an explanation within 5 seconds
3. WHEN the AI_Tutor generates an explanation, THE explanation SHALL include:
   - The correct answer with reasoning
   - Relevant RBI/IIBF regulatory citations or guidelines
   - Key concepts related to the question topic
   - Common misconceptions to avoid
4. WHEN the AI_Tutor generates an explanation, THE Portal SHALL display the explanation in a readable format with proper formatting
5. WHEN a user requests an explanation, THE Portal SHALL log the request with question ID, user ID, and timestamp
6. WHEN the AI_Tutor receives a request, THE AI_Tutor SHALL include context about the user's previous performance on similar topics
7. WHEN the AI_Tutor generates an explanation, THE explanation SHALL be between 150-300 words
8. WHEN the AI_Tutor fails to generate an explanation within 5 seconds, THE Portal SHALL display a fallback message: "Explanation temporarily unavailable. Please try again."
9. WHEN a user views an explanation, THE Portal SHALL provide options to "Save Explanation" or "Request Follow-up Question"

#### Success Metrics

- AI explanation generation latency: <5 seconds (p95)
- Explanation quality rating: >4.0/5.0 (user feedback)
- Citation accuracy: 100% (verified against RBI/IIBF guidelines)
- User satisfaction with explanations: >80%

---

### Requirement 6: Performance Dashboard

**User Story:** As a bank officer, I want to view my performance trends and learning analytics, so that I can track my progress toward exam readiness.

#### Acceptance Criteria

1. WHEN a user accesses the Performance Dashboard, THE Dashboard SHALL display the user's overall score across all practice sets
2. WHEN a user accesses the Performance Dashboard, THE Dashboard SHALL display a line chart showing score trends over the last 30 days
3. WHEN a user accesses the Performance Dashboard, THE Dashboard SHALL display performance by JAIIB paper (IE & IFS, PPB, AFB, RBWM) as a bar chart
4. WHEN a user accesses the Performance Dashboard, THE Dashboard SHALL display the number of practice sets completed
5. WHEN a user accesses the Performance Dashboard, THE Dashboard SHALL display the average score across all practice sets
6. WHEN a user accesses the Performance Dashboard, THE Dashboard SHALL display weak areas (topics with <70% accuracy) highlighted in red
7. WHEN a user accesses the Performance Dashboard, THE Dashboard SHALL display strong areas (topics with >85% accuracy) highlighted in green
8. WHEN a user accesses the Performance Dashboard, THE Dashboard SHALL display the total study time in hours and minutes
9. WHEN a user clicks on a specific paper in the dashboard, THE Dashboard SHALL display detailed performance metrics for that paper including topic-wise breakdown
10. WHEN a user accesses the Performance Dashboard, THE Dashboard SHALL display a "Recommended Practice Areas" section based on weak areas
11. WHEN a user accesses the Performance Dashboard, THE Dashboard SHALL display the date of the last practice session

#### Success Metrics

- Dashboard load time: <1 second
- Chart rendering latency: <500ms
- Data accuracy: 100% (matches database records)
- Dashboard availability: >99.9%

---

### Requirement 7: Question Bank Management

**User Story:** As a trainer or administrator, I want to manage the question bank with versioning and categorization, so that I can maintain accurate and up-to-date exam content.

#### Acceptance Criteria

1. WHEN a trainer accesses the Question Bank Management interface, THE Interface SHALL display all MCQs organized by JAIIB paper
2. WHEN a trainer accesses the Question Bank Management interface, THE Interface SHALL display MCQs organized by topic within each paper
3. WHEN a trainer creates a new MCQ, THE Question_Bank_Manager SHALL require: question text, 4 options, correct answer, topic, difficulty level, and RBI/IIBF reference
4. WHEN a trainer submits a new MCQ, THE Question_Bank_Manager SHALL validate that all required fields are populated
5. WHEN a trainer submits a new MCQ, THE Question_Bank_Manager SHALL assign a unique question ID and creation timestamp
6. WHEN a trainer edits an existing MCQ, THE Question_Bank_Manager SHALL create a new version and preserve the previous version
7. WHEN a trainer edits an MCQ, THE Question_Bank_Manager SHALL record the editor's user ID, timestamp, and change description
8. WHEN a trainer publishes a new version of the question bank, THE Question_Bank_Manager SHALL create a version snapshot with a version number (v1.0, v1.1, etc.)
9. WHEN a new question bank version is published, THE Portal SHALL use the new version for all new practice sets generated after the publication time
10. WHEN a trainer views question bank history, THE Question_Bank_Manager SHALL display all versions with publication dates and change summaries
11. WHEN a trainer deletes an MCQ, THE Question_Bank_Manager SHALL mark it as inactive rather than permanently deleting it
12. WHEN a trainer searches for MCQs, THE Question_Bank_Manager SHALL support filtering by paper, topic, difficulty, and keyword

#### Success Metrics

- Question bank size: >500 MCQs across all papers
- Version management accuracy: 100% (no lost versions)
- Search query latency: <300ms
- Question validation accuracy: 100%

---

### Requirement 8: Error Handling and Resilience

**User Story:** As a user, I want the Portal to handle errors gracefully and recover from failures, so that my experience is reliable and uninterrupted.

#### Acceptance Criteria

1. WHEN a database connection fails, THE Error_Handler SHALL retry the operation up to 3 times with exponential backoff (1s, 2s, 4s)
2. WHEN a database operation fails after 3 retries, THE Error_Handler SHALL log the error to CloudWatch and display a user-friendly error message
3. WHEN an API Gateway request times out, THE Error_Handler SHALL return a 504 Gateway Timeout error with a retry suggestion
4. WHEN an AWS Lambda function fails, THE Error_Handler SHALL log the error with full stack trace to CloudWatch
5. WHEN AWS Bedrock service is unavailable, THE Error_Handler SHALL display a fallback message and queue the AI explanation request for retry
6. WHEN a user's session token is invalid, THE Portal SHALL redirect to the login page with a "Session expired" message
7. WHEN a network request fails on the frontend, THE Portal SHALL display a "Connection error" message with a "Retry" button
8. WHEN a user submits a practice set and the submission fails, THE Portal SHALL save the response locally and retry when connectivity is restored
9. WHEN a critical error occurs, THE Error_Handler SHALL send an alert to the Administrator via CloudWatch
10. WHEN an error occurs, THE Portal SHALL log the error with user ID, timestamp, action, and error details for audit purposes

#### Success Metrics

- Error recovery success rate: >95%
- Mean time to recovery (MTTR): <5 minutes
- Error logging completeness: 100% of errors logged
- User-facing error clarity: >90% of users understand error messages

---

### Requirement 9: Responsive UI for Desktop/Tablet/Mobile

**User Story:** As a bank officer, I want to access the Portal on any device (desktop, tablet, mobile), so that I can practice anytime and anywhere.

#### Acceptance Criteria

1. WHEN a user accesses the Portal on a desktop (1920×1080 or larger), THE UI SHALL display the full layout with sidebar navigation and all content visible
2. WHEN a user accesses the Portal on a tablet (768×1024), THE UI SHALL display a responsive layout with collapsible sidebar and optimized spacing
3. WHEN a user accesses the Portal on a mobile device (375×667), THE UI SHALL display a mobile-optimized layout with hamburger menu and stacked content
4. WHEN a user resizes the browser window, THE UI SHALL reflow content smoothly without breaking layout
5. WHEN a user views MCQs on mobile, THE UI SHALL display one question per screen with clear option buttons
6. WHEN a user views the Performance Dashboard on mobile, THE UI SHALL display charts in a scrollable, readable format
7. WHEN a user interacts with the Portal on mobile, THE UI SHALL have touch-friendly buttons (minimum 44×44 pixels)
8. WHEN a user accesses the Portal on a slow network (3G), THE Portal SHALL load within 3 seconds
9. WHEN a user accesses the Portal on a mobile device, THE Portal SHALL use responsive images that scale appropriately
10. WHEN a user accesses the Portal, THE Portal SHALL support both portrait and landscape orientations on mobile devices

#### Success Metrics

- Mobile usability score: >90 (Google Lighthouse)
- Desktop usability score: >95 (Google Lighthouse)
- Responsive design test coverage: 100% of pages
- Mobile load time: <3 seconds (p95)

---

### Requirement 10: Notification System

**User Story:** As a bank officer, I want to receive notifications about my progress and learning milestones, so that I stay motivated and informed.

#### Acceptance Criteria

1. WHEN a user completes 5 practice sets, THE Notification_Service SHALL send a "5 Practice Sets Completed" notification
2. WHEN a user completes 10 practice sets, THE Notification_Service SHALL send a "10 Practice Sets Completed" notification with a congratulations message
3. WHEN a user achieves an average score of 80% or higher on a paper, THE Notification_Service SHALL send a "Mastery Achieved" notification for that paper
4. WHEN a user has not practiced for 7 days, THE Notification_Service SHALL send a "Time to Practice" reminder notification
5. WHEN a new question bank version is published, THE Notification_Service SHALL send a "New Questions Available" notification to all users
6. WHEN a user receives a notification, THE Portal SHALL display it as an in-app notification badge
7. WHEN a user receives a notification, THE Notification_Service SHALL optionally send an email notification (if user has opted in)
8. WHEN a user views a notification, THE Portal SHALL mark it as read and remove the badge
9. WHEN a user accesses the Notifications page, THE Portal SHALL display all notifications with timestamps in reverse chronological order
10. WHEN a user receives a notification, THE Notification_Service SHALL log the notification with user ID, type, timestamp, and delivery status

#### Success Metrics

- Notification delivery success rate: >99%
- Notification delivery latency: <5 seconds
- User engagement with notifications: >60% click-through rate
- Notification opt-in rate: >70%

---

### Requirement 11: Analytics and Reporting for Administrators

**User Story:** As an administrator, I want to view system-wide analytics and generate reports, so that I can monitor platform usage and learning outcomes.

#### Acceptance Criteria

1. WHEN an administrator accesses the Analytics Dashboard, THE Dashboard SHALL display the total number of registered users
2. WHEN an administrator accesses the Analytics Dashboard, THE Dashboard SHALL display the number of active users in the last 7 days, 30 days, and 90 days
3. WHEN an administrator accesses the Analytics Dashboard, THE Dashboard SHALL display the total number of practice sets completed across all users
4. WHEN an administrator accesses the Analytics Dashboard, THE Dashboard SHALL display the average score across all users
5. WHEN an administrator accesses the Analytics Dashboard, THE Dashboard SHALL display a line chart showing daily active users over the last 30 days
6. WHEN an administrator accesses the Analytics Dashboard, THE Dashboard SHALL display performance metrics by JAIIB paper (average scores, completion rates)
7. WHEN an administrator accesses the Analytics Dashboard, THE Dashboard SHALL display the most frequently attempted questions
8. WHEN an administrator accesses the Analytics Dashboard, THE Dashboard SHALL display the most frequently skipped questions
9. WHEN an administrator generates a report, THE Report_Generator SHALL export data in CSV or PDF format
10. WHEN an administrator generates a report, THE Report_Generator SHALL allow filtering by date range, paper, and user cohort
11. WHEN an administrator accesses the Analytics Dashboard, THE Dashboard SHALL display system performance metrics (API response time, error rate, uptime)
12. WHEN an administrator accesses the Analytics Dashboard, THE Dashboard SHALL display the top 10 users by practice set completion count

#### Success Metrics

- Analytics dashboard load time: <2 seconds
- Report generation time: <30 seconds for 1 year of data
- Analytics data accuracy: 100% (matches database records)
- Report export success rate: >99%

---

### Requirement 12: Audit Logging and Compliance Tracking

**User Story:** As a compliance officer, I want comprehensive audit logs of all system activities, so that I can ensure regulatory compliance and security.

#### Acceptance Criteria

1. WHEN any user action occurs (login, practice set submission, score view, etc.), THE Audit_Logger SHALL record the action with user ID, timestamp, action type, and result
2. WHEN a user logs in, THE Audit_Logger SHALL record the login timestamp, IP address, and device information
3. WHEN a user logs out, THE Audit_Logger SHALL record the logout timestamp
4. WHEN a practice set is submitted, THE Audit_Logger SHALL record the session ID, questions attempted, answers submitted, and score
5. WHEN a question bank is modified, THE Audit_Logger SHALL record the modifier's user ID, timestamp, question ID, and change description
6. WHEN an administrator accesses sensitive data, THE Audit_Logger SHALL record the access with timestamp and data accessed
7. WHEN an audit log is created, THE Audit_Logger SHALL store it in a tamper-proof manner (immutable records)
8. WHEN a compliance officer requests an audit report, THE Audit_Logger SHALL generate a report covering a specified date range
9. WHEN an audit log is generated, THE Audit_Logger SHALL include all required fields: user ID, timestamp, action type, resource ID, result, and IP address
10. WHEN audit logs are stored, THE Audit_Logger SHALL encrypt them using AWS KMS with a dedicated encryption key
11. WHEN audit logs are accessed, THE Portal SHALL log the access itself (meta-audit logging)
12. WHEN audit logs reach 1 year old, THE Audit_Logger SHALL archive them to AWS S3 for long-term retention

#### Success Metrics

- Audit log completeness: 100% of actions logged
- Audit log accuracy: 100% (verified against system events)
- Audit log retrieval latency: <1 second for 1 month of data
- Audit log encryption: 100% of logs encrypted

---

### Requirement 13: Data Security with Encryption and KMS

**User Story:** As a security officer, I want all sensitive data encrypted and managed securely, so that user data is protected against unauthorized access.

#### Acceptance Criteria

1. WHEN user data is stored in DynamoDB, THE Security_Manager SHALL encrypt it using AWS KMS with a customer-managed key
2. WHEN data is transmitted between the frontend and backend, THE Security_Manager SHALL use TLS 1.2 or higher encryption
3. WHEN a user's password is stored, THE Security_Manager SHALL hash it using bcrypt with a minimum 12-character salt round
4. WHEN sensitive data (passwords, tokens) is logged, THE Security_Manager SHALL mask or redact it in logs
5. WHEN a user's personal data is accessed, THE Security_Manager SHALL verify the user's authorization before granting access
6. WHEN data is deleted, THE Security_Manager SHALL perform secure deletion (overwrite with random data before removal)
7. WHEN AWS KMS keys are rotated, THE Security_Manager SHALL automatically re-encrypt data with the new key
8. WHEN a user requests data export, THE Security_Manager SHALL provide encrypted data with a secure download link valid for 24 hours
9. WHEN API requests are made, THE Security_Manager SHALL validate API keys and rate-limit requests to prevent abuse
10. WHEN a security incident is detected, THE Security_Manager SHALL log the incident and alert the security team via CloudWatch

#### Success Metrics

- Data encryption coverage: 100% of sensitive data encrypted
- TLS enforcement: 100% of data in transit encrypted
- Password hashing compliance: 100% of passwords hashed with bcrypt
- Key rotation frequency: Quarterly or as per AWS best practices
- Security incident response time: <1 hour

---

### Requirement 14: System Performance and Scalability

**User Story:** As a platform operator, I want the system to perform reliably under load and scale automatically, so that users have a consistent experience.

#### Acceptance Criteria

1. WHEN a user makes an API request, THE API_Gateway SHALL respond within 200ms (p95)
2. WHEN a practice set is generated, THE Practice_Set_Generator SHALL complete within 500ms (p95)
3. WHEN a user submits a practice set, THE Scoring_Engine SHALL calculate and store the score within 300ms (p95)
4. WHEN the system experiences 1000 concurrent users, THE System SHALL maintain API response time within 500ms (p95)
5. WHEN the system experiences 5000 concurrent users, THE System SHALL automatically scale Lambda functions and DynamoDB capacity
6. WHEN DynamoDB reaches 80% capacity utilization, THE Auto_Scaler SHALL increase provisioned capacity by 50%
7. WHEN Lambda function invocations exceed 1000 per second, THE Auto_Scaler SHALL increase concurrent execution limit
8. WHEN the system is under normal load, THE Auto_Scaler SHALL scale down resources to reduce costs
9. WHEN a user accesses the Portal, THE Portal SHALL load within 2 seconds (p95) on a 4G network
10. WHEN the system experiences a traffic spike, THE System SHALL maintain availability >99.9%

#### Success Metrics

- API response time (p95): <200ms
- Practice set generation latency (p95): <500ms
- System availability: >99.9%
- Auto-scaling success rate: >99%
- Cost optimization: <10% over-provisioning

---

### Requirement 15: Question Bank Versioning and Rollback

**User Story:** As a question bank manager, I want to version the question bank and rollback to previous versions if needed, so that I can manage content changes safely.

#### Acceptance Criteria

1. WHEN a question bank version is published, THE Version_Manager SHALL create a snapshot with a unique version number (v1.0, v1.1, v2.0, etc.)
2. WHEN a version is created, THE Version_Manager SHALL record the publication timestamp, publisher user ID, and change summary
3. WHEN a version is created, THE Version_Manager SHALL store all MCQs in that version with their complete data
4. WHEN a trainer views version history, THE Version_Manager SHALL display all versions with publication dates, publishers, and change summaries
5. WHEN a trainer initiates a rollback, THE Version_Manager SHALL require confirmation before proceeding
6. WHEN a rollback is confirmed, THE Version_Manager SHALL revert the question bank to the selected version
7. WHEN a rollback occurs, THE Version_Manager SHALL record the rollback action with timestamp, initiator user ID, and reason
8. WHEN a rollback occurs, THE Version_Manager SHALL create a new version snapshot documenting the rollback
9. WHEN a new version is published, THE Portal SHALL use it for all new practice sets generated after the publication time
10. WHEN a user has an incomplete practice set from a previous version, THE Portal SHALL allow them to complete it with the original version's questions

#### Success Metrics

- Version creation latency: <1 second
- Rollback success rate: 100%
- Version history retrieval latency: <500ms
- Version data integrity: 100% (no data loss)

---

## Dependencies and Constraints

### Technical Dependencies

- AWS Lambda (Python runtime)
- AWS API Gateway
- AWS DynamoDB
- AWS Bedrock (Claude 4.5 Haiku)
- AWS CloudWatch
- AWS KMS
- AWS Amplify
- React.js 18+
- Tailwind CSS 3+
- Node.js 18+

### External Dependencies

- IIBF exam guidelines and question bank
- RBI regulatory documentation
- AWS service availability and quotas

### Constraints

- Session timeout: 30 minutes of inactivity
- Practice set duration: Fixed 10 minutes
- AI explanation generation: Maximum 5 seconds
- Question bank minimum size: 500 MCQs across all papers
- System availability target: >99.9%
- Data retention: Audit logs retained for minimum 1 year
- Compliance: RBI data residency requirements (India region only)

---

## Success Criteria Summary

| Metric | Target |
|--------|--------|
| Registration completion rate | >80% |
| Login success rate | >99% |
| Practice set generation latency | <500ms |
| Timer accuracy | ±1 second |
| Scoring accuracy | 100% |
| AI explanation latency | <5 seconds (p95) |
| Dashboard load time | <1 second |
| Mobile usability score | >90 |
| Notification delivery success | >99% |
| Analytics dashboard load time | <2 seconds |
| Audit log completeness | 100% |
| Data encryption coverage | 100% |
| API response time (p95) | <200ms |
| System availability | >99.9% |
| Version management accuracy | 100% |
