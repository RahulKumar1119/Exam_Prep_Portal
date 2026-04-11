# Infrastructure Initialization Tests

## Overview

This test suite validates that the JAIIB-CAIIB Exam Prep Portal infrastructure is properly initialized and configured according to requirements 14.5 and 14.6.

**Feature**: jaiib-caiib-exam-prep-portal  
**Property 1**: Infrastructure components initialize correctly

## Test Coverage

### 1. DynamoDB Tables Verification

**Test**: `test_dynamodb_tables_exist_and_configured`

Verifies that all 6 required DynamoDB tables exist with correct schemas:

- **jaiib-users**: User accounts and profiles
  - Partition Key: `user_id`
  - GSI: `email-index` for email lookups
  - Encryption: KMS enabled
  - PITR: Enabled

- **jaiib-practice-sessions**: Active practice sessions
  - Partition Key: `session_id`
  - GSI: `user-id-index` for user session lookups
  - Encryption: KMS enabled
  - PITR: Enabled

- **jaiib-scores**: User scores and results
  - Partition Key: `user_id`
  - Sort Key: `submitted_at`
  - Encryption: KMS enabled
  - PITR: Enabled

- **jaiib-question-bank**: MCQ repository with versioning
  - Partition Key: `question_id`
  - Sort Key: `version`
  - GSI: `paper-topic-index` for paper/topic lookups
  - Encryption: KMS enabled
  - PITR: Enabled

- **jaiib-audit-logs**: Audit trail for compliance
  - Partition Key: `log_id`
  - Sort Key: `timestamp`
  - GSI: `user-id-index` for user audit trail
  - Encryption: KMS enabled
  - PITR: Enabled

- **jaiib-notifications**: User notifications
  - Partition Key: `user_id`
  - Sort Key: `notification_id`
  - Encryption: KMS enabled
  - PITR: Enabled

### 2. KMS Key Verification

**Test**: `test_kms_key_accessible_and_functional`

Verifies that the KMS key is properly configured:

- Key exists with alias `alias/jaiib-caiib-key`
- Key is enabled
- Automatic key rotation is enabled
- Encryption/decryption operations work correctly

**Property-Based Test**: `test_kms_encryption_decryption_roundtrip`

Tests encryption/decryption with randomized binary data (1-1000 bytes):
- Encrypts random data with KMS key
- Decrypts the ciphertext
- Verifies the decrypted data matches the original plaintext
- Runs 50 iterations with different data sizes

### 3. API Gateway Verification

**Test**: `test_api_gateway_endpoints_accessible`

Verifies that the API Gateway is properly deployed:

- API exists with name containing "jaiib" or "exam"
- Required resource paths exist: `/auth`, `/practice`, `/dashboard`
- API is deployed (has stages)

### 4. Encryption Coverage

**Property-Based Test**: `test_dynamodb_table_encryption_enabled`

Tests that all DynamoDB tables have encryption enabled:
- Runs 100 iterations, testing each table
- Verifies SSE (Server-Side Encryption) is enabled
- Verifies KMS customer-managed key is used
- Validates KMS key ARN contains "jaiib-caiib-key"

### 5. Point-in-Time Recovery

**Property-Based Test**: `test_dynamodb_table_pitr_enabled`

Tests that all DynamoDB tables have PITR enabled:
- Runs 100 iterations, testing each table
- Verifies PointInTimeRecoveryStatus is "ENABLED"
- Ensures data protection and disaster recovery capability

### 6. Integration Test

**Test**: `test_infrastructure_initialization_complete`

Integration test that verifies all infrastructure components are initialized:
- All DynamoDB tables exist and are configured correctly
- KMS key is accessible and functional
- API Gateway endpoints are accessible
- All components work together

## Running the Tests

### Prerequisites

```bash
pip install -r tests/requirements.txt
```

### Run All Tests

```bash
python3 -m pytest tests/infrastructure/test_infrastructure_init.py -v
```

### Run Specific Test

```bash
python3 -m pytest tests/infrastructure/test_infrastructure_init.py::TestInfrastructureInitialization::test_dynamodb_tables_exist_and_configured -v
```

### Run with Coverage

```bash
python3 -m pytest tests/infrastructure/test_infrastructure_init.py -v --cov=tests/infrastructure
```

### Run Property-Based Tests Only

```bash
python3 -m pytest tests/infrastructure/test_infrastructure_init.py -v -k "property"
```

## Test Results

### Expected Behavior

**Before Infrastructure Deployment**:
- All tests will FAIL with resource not found errors
- This is expected and indicates infrastructure hasn't been deployed yet

**After Infrastructure Deployment**:
- All tests should PASS
- DynamoDB tables will be found and verified
- KMS key will be accessible
- API Gateway endpoints will be accessible

### Sample Output (After Deployment)

```
tests/infrastructure/test_infrastructure_init.py::TestInfrastructureInitialization::test_dynamodb_tables_exist_and_configured PASSED [ 14%]
tests/infrastructure/test_infrastructure_init.py::TestInfrastructureInitialization::test_kms_key_accessible_and_functional PASSED [ 28%]
tests/infrastructure/test_infrastructure_init.py::TestInfrastructureInitialization::test_api_gateway_endpoints_accessible PASSED [ 42%]
tests/infrastructure/test_infrastructure_init.py::TestInfrastructureInitialization::test_dynamodb_table_encryption_enabled PASSED [ 57%]
tests/infrastructure/test_infrastructure_init.py::TestInfrastructureInitialization::test_dynamodb_table_pitr_enabled PASSED [ 71%]
tests/infrastructure/test_infrastructure_init.py::TestInfrastructureInitialization::test_kms_encryption_decryption_roundtrip PASSED [ 85%]
tests/infrastructure/test_infrastructure_init.py::TestInfrastructureInitialization::test_infrastructure_initialization_complete PASSED [100%]

======================== 7 passed in 2.45s ========================
```

## Test Configuration

### Hypothesis Settings

- **Max Examples**: 100 iterations for table tests, 50 for encryption tests
- **Health Checks**: Suppressed `too_slow` and `function_scoped_fixture` checks
- **Strategies**: 
  - Table names: Sampled from list of 6 required tables
  - Binary data: 1-1000 bytes for encryption tests

### AWS Configuration

- **Region**: ap-south-1 (India)
- **Clients**: DynamoDB, KMS, API Gateway
- **Credentials**: Uses AWS CLI configuration or environment variables

## Validation Checklist

After infrastructure deployment, verify:

- ✅ All 6 DynamoDB tables exist
- ✅ All tables have correct partition/sort keys
- ✅ All tables have required GSIs
- ✅ All tables have KMS encryption enabled
- ✅ All tables have PITR enabled
- ✅ KMS key exists with correct alias
- ✅ KMS key is enabled
- ✅ KMS key rotation is enabled
- ✅ KMS encryption/decryption works
- ✅ API Gateway is deployed
- ✅ Required API paths exist
- ✅ All tests pass

## Troubleshooting

### Test Failures

**Error**: `ResourceNotFoundException: Table: jaiib-users not found`
- **Cause**: Infrastructure not deployed
- **Solution**: Deploy infrastructure using CDK: `cdk deploy`

**Error**: `NotFoundException: Alias arn:aws:kms:ap-south-1:...:alias/jaiib-caiib-key is not found`
- **Cause**: KMS key not created
- **Solution**: Ensure CDK stack includes KMS key creation

**Error**: `JAIIB API not found`
- **Cause**: API Gateway not deployed
- **Solution**: Ensure CDK stack includes API Gateway creation

### AWS Credentials

Ensure AWS credentials are configured:

```bash
aws configure
# or set environment variables:
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret
export AWS_DEFAULT_REGION=ap-south-1
```

## Requirements Validation

**Requirement 14.5**: System Performance and Scalability
- Infrastructure must support auto-scaling
- DynamoDB on-demand billing mode enables automatic scaling
- Lambda auto-scaling configured

**Requirement 14.6**: System Performance and Scalability
- Infrastructure must handle 1000+ concurrent users
- DynamoDB on-demand mode scales automatically
- API Gateway rate limiting configured (100 req/min per user)

## Related Documentation

- [Infrastructure Summary](../../infrastructure/INFRASTRUCTURE_SUMMARY.md)
- [DynamoDB Schemas](../../infrastructure/DYNAMODB_SCHEMAS.md)
- [API Gateway Configuration](../../infrastructure/API_GATEWAY_CONFIG.md)
- [KMS Configuration](../../infrastructure/KMS_CLOUDWATCH_CONFIG.md)
- [Lambda Role Policy](../../infrastructure/LAMBDA_ROLE_POLICY.md)

## Next Steps

1. Deploy infrastructure using CDK: `cdk deploy`
2. Run tests to verify deployment: `pytest tests/infrastructure/test_infrastructure_init.py -v`
3. Proceed to Task 2: Implement User Authentication Service
4. Continue with remaining tasks in the implementation plan

## Test Maintenance

### Adding New Tests

When adding new infrastructure components:

1. Add verification method to `InfrastructureValidator` class
2. Create test method in `TestInfrastructureInitialization` class
3. Add property-based test if applicable
4. Update this README with new test coverage
5. Update requirements validation section

### Updating Existing Tests

When infrastructure changes:

1. Update table schemas in `verify_dynamodb_tables_exist()`
2. Update required paths in `verify_api_gateway_endpoints_accessible()`
3. Update KMS key verification if key alias changes
4. Run tests to verify changes
5. Update this README with changes

