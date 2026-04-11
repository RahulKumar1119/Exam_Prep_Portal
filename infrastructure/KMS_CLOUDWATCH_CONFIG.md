# KMS and CloudWatch Configuration

## AWS KMS (Key Management Service)

### Customer-Managed Key

**Key Details**:
- **Alias**: `alias/jaiib-caiib-key`
- **Key Rotation**: Enabled (automatic quarterly rotation)
- **Key Policy**: Allows Lambda role to encrypt/decrypt
- **Removal Policy**: RETAIN (key is not deleted when stack is destroyed)

### Key Permissions

The Lambda execution role has permissions to:
- `kms:Decrypt` - Decrypt encrypted data
- `kms:GenerateDataKey` - Generate data encryption keys
- `kms:DescribeKey` - Get key metadata

### Encryption Coverage

All sensitive data encrypted with this key:
- DynamoDB table data
- Audit logs
- User passwords (hashed with bcrypt, then encrypted)
- Session tokens
- Personal information

### Key Rotation

- **Automatic Rotation**: Enabled
- **Rotation Period**: Quarterly (90 days)
- **Data Re-encryption**: Automatic
- **No Manual Action Required**: AWS handles rotation

### Key Monitoring

Monitor key usage in CloudWatch:

```bash
aws cloudwatch get-metric-statistics \
  --namespace AWS/KMS \
  --metric-name UserErrorCount \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-02T00:00:00Z \
  --period 3600 \
  --statistics Sum
```

### Key Access

To grant additional access to the key:

```python
kms_key.add_to_resource_policy(
    iam.PolicyStatement(
        effect=iam.Effect.ALLOW,
        principals=[iam.ServicePrincipal("s3.amazonaws.com")],
        actions=["kms:Decrypt", "kms:GenerateDataKey"],
        resources=["*"],
    )
)
```

## CloudWatch Logging

### Log Group

**Name**: `/aws/lambda/jaiib-caiib`

**Retention**: 1 year (365 days)

**Removal Policy**: RETAIN (logs are not deleted when stack is destroyed)

### Log Streams

Automatically created for each Lambda function:
- `authentication-lambda`
- `practice-generator-lambda`
- `scoring-engine-lambda`
- `ai-tutor-lambda`
- `analytics-lambda`
- `notification-lambda`

### Log Format

All logs include:
- Timestamp
- Log level (INFO, WARNING, ERROR)
- Function name
- Request ID
- Message
- Stack trace (for errors)

### Log Queries

#### Find Errors

```
fields @timestamp, @message, @logStream
| filter @message like /ERROR/
| stats count() by @logStream
```

#### Find Slow Requests

```
fields @timestamp, @duration
| filter @duration > 500
| stats avg(@duration), max(@duration) by @logStream
```

#### Find Failed Authentications

```
fields @timestamp, @message
| filter @message like /authentication failed/
| stats count() by @message
```

## CloudWatch Metrics

### Custom Metrics

**Namespace**: `JaiibCaiib`

#### 1. API Response Time

- **Metric Name**: `ApiResponseTime`
- **Unit**: Milliseconds
- **Statistic**: Average
- **Period**: 1 minute
- **Dimensions**: Endpoint, Method

#### 2. Lambda Duration

- **Metric Name**: `LambdaDuration`
- **Unit**: Milliseconds
- **Statistic**: Average
- **Period**: 1 minute
- **Dimensions**: FunctionName

#### 3. Error Rate

- **Metric Name**: `ErrorRate`
- **Unit**: Percent
- **Statistic**: Sum
- **Period**: 1 minute
- **Dimensions**: FunctionName

#### 4. DynamoDB Read Capacity

- **Metric Name**: `ConsumedReadCapacityUnits`
- **Unit**: Count
- **Statistic**: Sum
- **Period**: 1 minute
- **Dimensions**: TableName

### AWS Managed Metrics

#### Lambda Metrics

- `Invocations` - Number of function invocations
- `Duration` - Function execution time
- `Errors` - Number of errors
- `Throttles` - Number of throttled invocations
- `ConcurrentExecutions` - Concurrent executions

#### DynamoDB Metrics

- `ConsumedReadCapacityUnits` - Read capacity consumed
- `ConsumedWriteCapacityUnits` - Write capacity consumed
- `UserErrors` - User-caused errors
- `SystemErrors` - System-caused errors
- `SuccessfulRequestLatency` - Request latency

#### API Gateway Metrics

- `Count` - Number of API calls
- `4XXError` - Client errors
- `5XXError` - Server errors
- `Latency` - Response time
- `IntegrationLatency` - Backend response time

## CloudWatch Alarms

### 1. API Response Time Alarm

**Condition**: Average response time > 500ms for 2 consecutive periods

**Action**: Send SNS notification

```python
cloudwatch.Alarm(
    self,
    "ApiResponseTimeAlarm",
    metric=api_response_time,
    threshold=500,
    evaluation_periods=2,
    datapoints_to_alarm=2,
    alarm_description="Alert when API response time exceeds 500ms",
)
```

### 2. Error Rate Alarm

**Condition**: Error rate > 1% for 2 consecutive periods

**Action**: Send SNS notification

```python
cloudwatch.Alarm(
    self,
    "ErrorRateAlarm",
    metric=error_rate,
    threshold=1,
    evaluation_periods=2,
    datapoints_to_alarm=2,
    alarm_description="Alert when error rate exceeds 1%",
)
```

### 3. DynamoDB Throttling Alarm

**Condition**: Read capacity > 80% for 1 period

**Action**: Send SNS notification and trigger auto-scaling

```python
cloudwatch.Alarm(
    self,
    "DynamoDBThrottlingAlarm",
    metric=dynamodb_read_capacity,
    threshold=80,
    evaluation_periods=1,
    datapoints_to_alarm=1,
    alarm_description="Alert when DynamoDB reaches 80% capacity",
)
```

## CloudWatch Dashboards

### Create Dashboard

```bash
aws cloudwatch put-dashboard \
  --dashboard-name JaiibCaiibDashboard \
  --dashboard-body file://dashboard.json
```

### Dashboard Widgets

1. **API Response Time** - Line chart
2. **Error Rate** - Line chart
3. **Lambda Duration** - Line chart
4. **DynamoDB Capacity** - Line chart
5. **Active Users** - Number widget
6. **Practice Sets Completed** - Number widget
7. **System Availability** - Gauge widget

## Monitoring Best Practices

### 1. Set Up Alarms

- Response time > 500ms
- Error rate > 1%
- DynamoDB throttling
- Lambda concurrent execution limit

### 2. Create Dashboards

- Real-time system health
- Performance metrics
- Error tracking
- Capacity utilization

### 3. Log Analysis

- Search for errors
- Identify slow requests
- Track user actions
- Audit compliance

### 4. Regular Reviews

- Weekly performance review
- Monthly capacity planning
- Quarterly cost optimization
- Annual security audit

## Troubleshooting

### No Logs Appearing

1. Verify Lambda role has CloudWatch Logs permissions
2. Check log group exists
3. Verify Lambda function is being invoked
4. Check for errors in Lambda execution

### High Latency

1. Check DynamoDB capacity utilization
2. Review Lambda cold start times
3. Check network latency
4. Verify KMS key performance

### High Error Rate

1. Check Lambda function logs
2. Verify DynamoDB table access
3. Check KMS key permissions
4. Review API Gateway configuration

## Related Resources

- [AWS KMS Documentation](https://docs.aws.amazon.com/kms/)
- [CloudWatch Logs Documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/)
- [CloudWatch Metrics Documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/)
- [CloudWatch Alarms Documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/)
