# DynamoDB Table Schemas

## Overview

All DynamoDB tables are encrypted with AWS KMS customer-managed key and have point-in-time recovery enabled.

## 1. Users Table (`jaiib-users`)

**Partition Key**: `user_id` (String)

**Attributes**:
- `user_id` (String, PK) - UUID of user
- `email` (String) - User email address
- `full_name` (String) - User's full name
- `bank_affiliation` (String) - Bank name
- `password_hash` (String) - Bcrypt hashed password
- `email_verified` (Boolean) - Email verification status
- `created_at` (Number) - Timestamp of account creation
- `last_login` (Number) - Timestamp of last login
- `role` (String) - User role (bank_officer, trainer, admin)
- `status` (String) - Account status (active, inactive, suspended)
- `preferences` (Map) - User preferences (notifications_enabled, theme, etc.)

**Global Secondary Indexes**:
- `email-index` (Partition Key: email) - For email-based lookups

**Billing Mode**: On-demand

**TTL**: None

## 2. Practice Sessions Table (`jaiib-practice-sessions`)

**Partition Key**: `session_id` (String)

**Attributes**:
- `session_id` (String, PK) - UUID of session
- `user_id` (String) - User ID
- `paper_name` (String) - JAIIB paper name (IE & IFS, PPB, AFB, RBWM)
- `questions` (List) - List of question IDs
- `user_answers` (Map) - Question ID to selected option mapping
- `score` (Number) - Score (0-100)
- `time_taken` (Number) - Time taken in seconds
- `submitted_at` (Number) - Submission timestamp
- `status` (String) - Session status (in_progress, completed, expired)
- `version` (String) - Question bank version used
- `ttl` (Number) - TTL for session expiration (30 days)

**Global Secondary Indexes**:
- `user-id-index` (Partition Key: user_id) - For user session lookups

**Billing Mode**: On-demand

**TTL**: `ttl` attribute (30 days)

## 3. Scores Table (`jaiib-scores`)

**Partition Key**: `user_id` (String)
**Sort Key**: `submitted_at` (Number)

**Attributes**:
- `user_id` (String, PK) - User ID
- `submitted_at` (Number, SK) - Submission timestamp
- `session_id` (String) - Session ID
- `paper_name` (String) - JAIIB paper name
- `score` (Number) - Score (0-100)
- `questions_correct` (Number) - Number of correct answers
- `time_taken` (Number) - Time taken in seconds
- `topic_breakdown` (Map) - Topic to accuracy percentage mapping

**Billing Mode**: On-demand

**TTL**: None

## 4. Question Bank Table (`jaiib-question-bank`)

**Partition Key**: `question_id` (String)
**Sort Key**: `version` (String)

**Attributes**:
- `question_id` (String, PK) - UUID of question
- `version` (String, SK) - Version number (v1.0, v1.1, etc.)
- `paper_name` (String) - JAIIB paper name
- `topic` (String) - Question topic
- `difficulty` (String) - Difficulty level (easy, medium, hard)
- `question_text` (String) - Question text
- `options` (List) - List of 4 options [A, B, C, D]
- `correct_answer` (String) - Correct answer (A/B/C/D)
- `rbi_reference` (String) - RBI guideline reference
- `iibf_reference` (String) - IIBF guideline reference
- `created_at` (Number) - Creation timestamp
- `created_by` (String) - Creator user ID
- `status` (String) - Question status (active, inactive)

**Global Secondary Indexes**:
- `paper-topic-index` (Partition Key: paper_name, Sort Key: topic) - For paper/topic lookups

**Billing Mode**: On-demand

**TTL**: None

## 5. Audit Logs Table (`jaiib-audit-logs`)

**Partition Key**: `log_id` (String)
**Sort Key**: `timestamp` (Number)

**Attributes**:
- `log_id` (String, PK) - UUID of log entry
- `timestamp` (Number, SK) - Event timestamp
- `user_id` (String) - User ID
- `action_type` (String) - Action type (login, logout, practice_submit, etc.)
- `resource_id` (String) - Resource ID (session_id, question_id, etc.)
- `resource_type` (String) - Resource type (session, question, user, etc.)
- `result` (String) - Result (success, failure)
- `ip_address` (String) - IP address
- `device_info` (String) - Device information
- `details` (Map) - Additional details (encrypted)

**Global Secondary Indexes**:
- `user-id-index` (Partition Key: user_id, Sort Key: timestamp) - For user audit trail

**Billing Mode**: On-demand

**TTL**: None (1-year retention, then archive to S3)

## 6. Notifications Table (`jaiib-notifications`)

**Partition Key**: `user_id` (String)
**Sort Key**: `notification_id` (String)

**Attributes**:
- `user_id` (String, PK) - User ID
- `notification_id` (String, SK) - UUID of notification
- `type` (String) - Notification type (milestone, reminder, update)
- `title` (String) - Notification title
- `message` (String) - Notification message
- `read` (Boolean) - Read status
- `created_at` (Number) - Creation timestamp
- `action_url` (String) - Optional action URL

**Billing Mode**: On-demand

**TTL**: None

## Encryption

All tables use AWS KMS customer-managed key for encryption at rest:
- **Key ID**: `alias/jaiib-caiib-key`
- **Key Rotation**: Enabled (automatic quarterly rotation)

## Backup and Recovery

All tables have:
- **Point-in-Time Recovery**: Enabled
- **Backup Retention**: 35 days
- **Restore Window**: Any point in last 35 days

## Performance Optimization

### Global Secondary Indexes

- **Users**: Email lookup for authentication
- **Practice Sessions**: User session history
- **Question Bank**: Paper and topic filtering
- **Audit Logs**: User audit trail

### Partition Key Design

- **Users**: `user_id` for even distribution
- **Practice Sessions**: `session_id` for unique sessions
- **Scores**: `user_id` for user-specific queries
- **Question Bank**: `question_id` for unique questions
- **Audit Logs**: `log_id` for unique log entries
- **Notifications**: `user_id` for user notifications

### Billing Mode

All tables use **On-Demand** billing mode:
- No capacity planning required
- Automatic scaling
- Pay per request
- Suitable for variable workloads

## Monitoring

CloudWatch metrics available:
- `ConsumedReadCapacityUnits`
- `ConsumedWriteCapacityUnits`
- `UserErrors`
- `SystemErrors`
- `SuccessfulRequestLatency`

## Related Resources

- [DynamoDB Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)
- [DynamoDB Encryption](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/encryption.html)
- [DynamoDB Global Secondary Indexes](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GSI.html)
