# JAIIB-CAIIB Exam Prep Portal

A full-stack web application designed to help bank officers prepare for IIBF (Indian Institute of Banking and Finance) certification exams with adaptive practice sets, AI-powered tutoring, and comprehensive performance tracking.

## 🎯 Overview

The JAIIB-CAIIB Exam Prep Portal provides:
- **Interactive Practice Sets**: 4-question adaptive practice sets for 4 JAIIB papers (IE & IFS, PPB, AFB, RBWM)
- **AI-Powered Tutoring**: AWS Bedrock Claude 4.5 Haiku explanations with RBI/IIBF regulatory citations
- **Performance Tracking**: Real-time dashboards with score trends, weak/strong areas, and learning analytics
- **Admin Analytics**: System-wide metrics, user engagement tracking, and compliance reporting
- **Secure & Scalable**: End-to-end encryption, auto-scaling for 100+ concurrent users, 99.9% uptime target

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React.js 18 with TypeScript
- Tailwind CSS for responsive design
- AWS Amplify for hosting
- React Query for data caching

**Backend:**
- AWS Lambda (Python) for serverless compute
- AWS API Gateway for REST API management
- AWS DynamoDB for NoSQL database
- AWS Bedrock (Claude 4.5 Haiku) for AI services
- AWS KMS for encryption key management
- AWS CloudWatch for monitoring and logging

**Infrastructure:**
- AWS CDK for Infrastructure as Code
- AWS S3 for data archival
- AWS SES for email notifications
- AWS CloudFront for CDN

## 📋 Project Structure

```
.kiro/specs/jaiib-caiib-exam-prep-portal/
├── requirements.md          # 15 core requirements with acceptance criteria
├── design.md               # Technical architecture with 30 correctness properties
├── tasks.md                # 21 implementation tasks across 7 phases
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.9+
- AWS Account with appropriate permissions
- AWS CLI configured
- Docker (for local testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jaiib-caiib-exam-prep-portal
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../backend
   pip install -r requirements.txt
   ```

4. **Configure AWS credentials**
   ```bash
   aws configure
   ```

5. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your AWS configuration
   ```

## 📚 Documentation

### Specification Documents

- **[requirements.md](requirements.md)**: Complete requirements specification with 15 core features, acceptance criteria, and success metrics
- **[design.md](design.md)**: Technical design document with architecture, data models, API endpoints, Lambda functions, and 30 correctness properties
- **[tasks.md](tasks.md)**: Implementation plan with 21 tasks organized across 7 phases, including property-based testing tasks

### Key Features

#### 1. User Authentication & Registration
- Secure registration with email verification
- JWT-based session management (30-min timeout)
- Password reset with 24-hour valid links
- Bcrypt password hashing (12-character salt rounds)

#### 2. Practice Set Generation
- Adaptive 4-question practice sets for 4 JAIIB papers
- Random selection for new users (<10 completed sets)
- Weak-area weighted selection for experienced users (≥10 sets)
- <500ms generation latency

#### 3. Session Timer Management
- 10-minute countdown timer with MM:SS display
- Color warnings: yellow at 5 min, red at 1 min
- Auto-submission at timeout
- ±1 second accuracy

#### 4. MCQ Scoring Engine
- Immediate score calculation: (correct/4) × 100
- Pass/fail indicators (≥75% = Pass)
- Question-by-question feedback
- Time tracking per session

#### 5. AI-Powered Tutoring
- AWS Bedrock Claude 4.5 Haiku integration
- Explanations with RBI/IIBF regulatory citations
- 150-300 word explanations within 5 seconds
- Fallback messages on service unavailability

#### 6. Performance Dashboard
- Overall score and 30-day trends
- Performance breakdown by paper
- Weak/strong areas identification
- Recommended practice areas
- <1 second load time

#### 7. Question Bank Management
- Version control with rollback capability
- Topic and difficulty categorization
- Trainer/admin CRUD operations
- Search and filtering

#### 8. Admin Analytics
- User engagement metrics (7/30/90 day active users)
- Performance analytics by paper
- Most attempted/skipped questions
- CSV/PDF report export
- <2 second dashboard load time

#### 9. Audit Logging & Compliance
- Comprehensive action logging (login, practice, scoring, etc.)
- KMS-encrypted immutable records
- Meta-audit logging (log access to logs)
- 1-year retention with S3 archival

#### 10. Security & Encryption
- TLS 1.2+ for all data transmission
- AWS KMS encryption at rest
- Role-based access control (bank_officer, trainer, admin)
- Rate limiting (100 req/min per user)

## 🔄 Implementation Phases

### Phase 1: Infrastructure & Authentication (Tasks 1-3)
- AWS infrastructure setup
- User authentication service
- Session management

### Phase 2: Core Practice Engine (Tasks 4-7)
- Practice set generation
- Session timer management
- MCQ scoring engine

### Phase 3: AI Integration & Feedback (Tasks 8-9)
- AWS Bedrock integration
- AI explanation generation

### Phase 4: Frontend & UI (Tasks 10-12)
- React frontend setup
- Practice interface
- Performance dashboard

### Phase 5: Analytics & Admin (Tasks 13-16)
- Question bank versioning
- Audit logging
- Notification system

### Phase 6: Security & Compliance (Tasks 17-19)
- Data encryption
- Security hardening
- Performance optimization

### Phase 7: Integration & Deployment (Tasks 20-21)
- End-to-end testing
- Production deployment

## 🧪 Testing Strategy

### Unit Testing
- 80% code coverage target
- Specific examples and edge cases
- Framework: pytest (backend), Jest (frontend)

### Property-Based Testing
- 30 correctness properties from design document
- Universal properties across all inputs
- Framework: Hypothesis (Python), fast-check (JavaScript)

### Integration Testing
- Complete user workflows
- Error scenarios and recovery
- Performance under load

### Performance Testing
- API response time targets (<200ms p95)
- Practice set generation (<500ms p95)
- Dashboard load time (<1s)
- Concurrent user load (1000+ users)

## 📊 Success Metrics

| Metric | Target |
|--------|--------|
| Registration completion rate | >80% |
| Login success rate | >99% |
| Practice set generation latency | <500ms (p95) |
| Timer accuracy | ±1 second |
| Scoring accuracy | 100% |
| AI explanation latency | <5 seconds (p95) |
| Dashboard load time | <1 second |
| Mobile usability score | >90 (Lighthouse) |
| Notification delivery success | >99% |
| System availability | >99.9% |
| Data encryption coverage | 100% |
| API response time | <200ms (p95) |

## 🔐 Security

### Data Protection
- **At Rest**: DynamoDB encrypted with AWS KMS (customer-managed key)
- **In Transit**: TLS 1.2+ for all API calls
- **Passwords**: Bcrypt hashing with 12-character salt rounds
- **Tokens**: JWT with 30-minute expiry, refresh tokens in httpOnly cookies

### Access Control
- Role-based access control (bank_officer, trainer, admin)
- API endpoint authorization checks
- Sensitive data access logging

### Compliance
- Audit logging for all user actions
- Immutable audit records with KMS encryption
- 1-year retention with S3 archival
- RBI data residency requirements (India region only)

## 📈 Performance

### Scalability
- Auto-scaling Lambda functions for concurrent execution
- DynamoDB auto-scaling with 80% utilization threshold
- CloudFront CDN for static asset distribution
- Connection pooling for database queries

### Optimization
- React Query caching (5-min TTL)
- DynamoDB DAX for hot data
- Lambda provisioned concurrency for warm starts
- Minimal Lambda dependencies for fast cold starts

## 🚢 Deployment

### Development
```bash
npm run dev          # Frontend development server
python app.py        # Backend local server
```

### Staging
```bash
npm run build         # Build frontend
aws amplify deploy    # Deploy to Amplify
sam deploy            # Deploy Lambda functions
```

### Production
```bash
# Blue-green deployment strategy
# Automated testing before deployment
# Health checks and monitoring
```

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/password-reset-request` - Password reset request
- `POST /api/auth/password-reset` - Password reset

### Practice Endpoints
- `POST /api/practice/generate` - Generate practice set
- `POST /api/practice/submit` - Submit practice set
- `GET /api/practice/session/{session_id}` - Get session details
- `GET /api/practice/results/{session_id}` - Get results

### AI Tutor Endpoints
- `POST /api/tutor/explain` - Request AI explanation
- `POST /api/tutor/save-explanation` - Save explanation

### Dashboard Endpoints
- `GET /api/dashboard/performance` - Get performance metrics
- `GET /api/dashboard/analytics` - Get admin analytics
- `GET /api/dashboard/audit-logs` - Get audit logs

### Question Bank Endpoints
- `POST /api/questions/create` - Create MCQ
- `PUT /api/questions/{question_id}` - Update MCQ
- `GET /api/questions/search` - Search questions
- `POST /api/questions/version/publish` - Publish version
- `POST /api/questions/version/rollback` - Rollback version

## 🐛 Troubleshooting

### Common Issues

**Lambda Cold Start Delays**
- Solution: Enable provisioned concurrency for critical functions
- Reference: Task 18.1

**DynamoDB Throttling**
- Solution: Enable auto-scaling with 80% utilization threshold
- Reference: Task 18.2

**Bedrock Service Unavailable**
- Solution: Implement fallback messages and retry queue
- Reference: Task 8.1, Requirement 5.8

**High API Response Times**
- Solution: Enable caching, optimize queries, check CloudWatch metrics
- Reference: Task 18.1

## 📞 Support

For issues or questions:
1. Check the [requirements.md](requirements.md) for feature specifications
2. Review the [design.md](design.md) for technical details
3. Consult [tasks.md](tasks.md) for implementation guidance
4. Check CloudWatch logs for error details

## 📄 License

[Your License Here]

## 👥 Contributors

- Requirements Team
- Architecture Team
- Development Team

## 🔗 Related Resources

- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [AWS DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)
- [AWS Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)
- [React.js Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## 📅 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026 | Initial release with 15 core requirements, complete technical design, and 21 implementation tasks |

---

**Last Updated**: April 2026  
**Status**: Specification Complete - Ready for Implementation
