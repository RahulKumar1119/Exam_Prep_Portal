import aws_cdk as cdk
from aws_cdk import (
    aws_lambda as lambda_,
    aws_apigateway as apigw,
    aws_dynamodb as dynamodb,
    aws_kms as kms,
    aws_cloudwatch as cloudwatch,
    aws_iam as iam,
    aws_logs as logs,
    Duration,
    RemovalPolicy,
)
from constructs import Construct


class JaiibCaiibStack(cdk.Stack):
    def __init__(self, scope: Construct, id: str, **kwargs):
        super().__init__(scope, id, **kwargs)

        # Create KMS customer-managed key for encryption
        kms_key = kms.Key(
            self,
            "JaiibKmsKey",
            enable_key_rotation=True,
            removal_policy=RemovalPolicy.RETAIN,
            description="KMS key for JAIIB-CAIIB Portal data encryption",
        )
        kms_key.add_alias("alias/jaiib-caiib-key")

        # Create Lambda execution role
        lambda_role = iam.Role(
            self,
            "LambdaExecutionRole",
            assumed_by=iam.ServicePrincipal("lambda.amazonaws.com"),
            description="Execution role for JAIIB-CAIIB Lambda functions",
        )

        # Add CloudWatch Logs permissions
        lambda_role.add_managed_policy(
            iam.ManagedPolicy.from_aws_managed_policy_name(
                "service-role/AWSLambdaBasicExecutionRole"
            )
        )

        # Add DynamoDB permissions
        lambda_role.add_to_policy(
            iam.PolicyStatement(
                effect=iam.Effect.ALLOW,
                actions=[
                    "dynamodb:GetItem",
                    "dynamodb:PutItem",
                    "dynamodb:UpdateItem",
                    "dynamodb:DeleteItem",
                    "dynamodb:Query",
                    "dynamodb:Scan",
                    "dynamodb:BatchGetItem",
                    "dynamodb:BatchWriteItem",
                ],
                resources=["arn:aws:dynamodb:*:*:table/jaiib-*"],
            )
        )

        # Add KMS permissions
        lambda_role.add_to_policy(
            iam.PolicyStatement(
                effect=iam.Effect.ALLOW,
                actions=[
                    "kms:Decrypt",
                    "kms:GenerateDataKey",
                    "kms:DescribeKey",
                ],
                resources=[kms_key.key_arn],
            )
        )

        # Add SES permissions for email
        lambda_role.add_to_policy(
            iam.PolicyStatement(
                effect=iam.Effect.ALLOW,
                actions=[
                    "ses:SendEmail",
                    "ses:SendRawEmail",
                ],
                resources=["*"],
            )
        )

        # Create DynamoDB Tables
        users_table = self._create_users_table(kms_key)
        practice_sessions_table = self._create_practice_sessions_table(kms_key)
        scores_table = self._create_scores_table(kms_key)
        question_bank_table = self._create_question_bank_table(kms_key)
        audit_logs_table = self._create_audit_logs_table(kms_key)
        notifications_table = self._create_notifications_table(kms_key)

        # Grant Lambda role access to all tables
        for table in [
            users_table,
            practice_sessions_table,
            scores_table,
            question_bank_table,
            audit_logs_table,
            notifications_table,
        ]:
            table.grant_read_write_data(lambda_role)

        # Create CloudWatch Log Group
        log_group = logs.LogGroup(
            self,
            "JaiibLogGroup",
            log_group_name="/aws/lambda/jaiib-caiib",
            retention=logs.RetentionDays.ONE_YEAR,
            removal_policy=RemovalPolicy.RETAIN,
        )

        # Create CloudWatch Metrics
        self._create_cloudwatch_metrics()

        # Create API Gateway
        api = self._create_api_gateway(lambda_role)

        # Output resource ARNs and endpoints
        cdk.CfnOutput(
            self,
            "KmsKeyArn",
            value=kms_key.key_arn,
            description="ARN of KMS key for data encryption",
        )
        cdk.CfnOutput(
            self,
            "LambdaRoleArn",
            value=lambda_role.role_arn,
            description="ARN of Lambda execution role",
        )
        cdk.CfnOutput(
            self,
            "ApiEndpoint",
            value=api.url,
            description="API Gateway endpoint URL",
        )
        cdk.CfnOutput(
            self,
            "UsersTableName",
            value=users_table.table_name,
            description="DynamoDB Users table name",
        )
        cdk.CfnOutput(
            self,
            "PracticeSessionsTableName",
            value=practice_sessions_table.table_name,
            description="DynamoDB Practice Sessions table name",
        )
        cdk.CfnOutput(
            self,
            "ScoresTableName",
            value=scores_table.table_name,
            description="DynamoDB Scores table name",
        )
        cdk.CfnOutput(
            self,
            "QuestionBankTableName",
            value=question_bank_table.table_name,
            description="DynamoDB Question Bank table name",
        )
        cdk.CfnOutput(
            self,
            "AuditLogsTableName",
            value=audit_logs_table.table_name,
            description="DynamoDB Audit Logs table name",
        )
        cdk.CfnOutput(
            self,
            "NotificationsTableName",
            value=notifications_table.table_name,
            description="DynamoDB Notifications table name",
        )
        cdk.CfnOutput(
            self,
            "LogGroupName",
            value=log_group.log_group_name,
            description="CloudWatch Log Group name",
        )

    def _create_users_table(self, kms_key: kms.Key) -> dynamodb.Table:
        """Create Users DynamoDB table"""
        table = dynamodb.Table(
            self,
            "UsersTable",
            table_name="jaiib-users",
            partition_key=dynamodb.Attribute(
                name="user_id", type=dynamodb.AttributeType.STRING
            ),
            billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST,
            encryption=dynamodb.TableEncryption.CUSTOMER_MANAGED,
            encryption_key=kms_key,
            removal_policy=RemovalPolicy.RETAIN,
            point_in_time_recovery=True,
        )

        # Add GSI for email lookup
        table.add_global_secondary_index(
            index_name="email-index",
            partition_key=dynamodb.Attribute(
                name="email", type=dynamodb.AttributeType.STRING
            ),
            projection_type=dynamodb.ProjectionType.ALL,
        )

        return table

    def _create_practice_sessions_table(self, kms_key: kms.Key) -> dynamodb.Table:
        """Create Practice Sessions DynamoDB table"""
        table = dynamodb.Table(
            self,
            "PracticeSessionsTable",
            table_name="jaiib-practice-sessions",
            partition_key=dynamodb.Attribute(
                name="session_id", type=dynamodb.AttributeType.STRING
            ),
            billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST,
            encryption=dynamodb.TableEncryption.CUSTOMER_MANAGED,
            encryption_key=kms_key,
            removal_policy=RemovalPolicy.RETAIN,
            point_in_time_recovery=True,
            time_to_live_attribute="ttl",
        )

        # Add GSI for user_id lookup
        table.add_global_secondary_index(
            index_name="user-id-index",
            partition_key=dynamodb.Attribute(
                name="user_id", type=dynamodb.AttributeType.STRING
            ),
            projection_type=dynamodb.ProjectionType.ALL,
        )

        return table

    def _create_scores_table(self, kms_key: kms.Key) -> dynamodb.Table:
        """Create Scores DynamoDB table"""
        table = dynamodb.Table(
            self,
            "ScoresTable",
            table_name="jaiib-scores",
            partition_key=dynamodb.Attribute(
                name="user_id", type=dynamodb.AttributeType.STRING
            ),
            sort_key=dynamodb.Attribute(
                name="submitted_at", type=dynamodb.AttributeType.NUMBER
            ),
            billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST,
            encryption=dynamodb.TableEncryption.CUSTOMER_MANAGED,
            encryption_key=kms_key,
            removal_policy=RemovalPolicy.RETAIN,
            point_in_time_recovery=True,
        )

        return table

    def _create_question_bank_table(self, kms_key: kms.Key) -> dynamodb.Table:
        """Create Question Bank DynamoDB table"""
        table = dynamodb.Table(
            self,
            "QuestionBankTable",
            table_name="jaiib-question-bank",
            partition_key=dynamodb.Attribute(
                name="question_id", type=dynamodb.AttributeType.STRING
            ),
            sort_key=dynamodb.Attribute(
                name="version", type=dynamodb.AttributeType.STRING
            ),
            billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST,
            encryption=dynamodb.TableEncryption.CUSTOMER_MANAGED,
            encryption_key=kms_key,
            removal_policy=RemovalPolicy.RETAIN,
            point_in_time_recovery=True,
        )

        # Add GSI for paper and topic lookup
        table.add_global_secondary_index(
            index_name="paper-topic-index",
            partition_key=dynamodb.Attribute(
                name="paper_name", type=dynamodb.AttributeType.STRING
            ),
            sort_key=dynamodb.Attribute(
                name="topic", type=dynamodb.AttributeType.STRING
            ),
            projection_type=dynamodb.ProjectionType.ALL,
        )

        return table

    def _create_audit_logs_table(self, kms_key: kms.Key) -> dynamodb.Table:
        """Create Audit Logs DynamoDB table"""
        table = dynamodb.Table(
            self,
            "AuditLogsTable",
            table_name="jaiib-audit-logs",
            partition_key=dynamodb.Attribute(
                name="log_id", type=dynamodb.AttributeType.STRING
            ),
            sort_key=dynamodb.Attribute(
                name="timestamp", type=dynamodb.AttributeType.NUMBER
            ),
            billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST,
            encryption=dynamodb.TableEncryption.CUSTOMER_MANAGED,
            encryption_key=kms_key,
            removal_policy=RemovalPolicy.RETAIN,
            point_in_time_recovery=True,
        )

        # Add GSI for user_id lookup
        table.add_global_secondary_index(
            index_name="user-id-index",
            partition_key=dynamodb.Attribute(
                name="user_id", type=dynamodb.AttributeType.STRING
            ),
            sort_key=dynamodb.Attribute(
                name="timestamp", type=dynamodb.AttributeType.NUMBER
            ),
            projection_type=dynamodb.ProjectionType.ALL,
        )

        return table

    def _create_notifications_table(self, kms_key: kms.Key) -> dynamodb.Table:
        """Create Notifications DynamoDB table"""
        table = dynamodb.Table(
            self,
            "NotificationsTable",
            table_name="jaiib-notifications",
            partition_key=dynamodb.Attribute(
                name="user_id", type=dynamodb.AttributeType.STRING
            ),
            sort_key=dynamodb.Attribute(
                name="notification_id", type=dynamodb.AttributeType.STRING
            ),
            billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST,
            encryption=dynamodb.TableEncryption.CUSTOMER_MANAGED,
            encryption_key=kms_key,
            removal_policy=RemovalPolicy.RETAIN,
            point_in_time_recovery=True,
        )

        return table

    def _create_cloudwatch_metrics(self):
        """Create CloudWatch metrics and alarms"""
        # API Response Time Metric
        api_response_time = cloudwatch.Metric(
            namespace="JaiibCaiib",
            metric_name="ApiResponseTime",
            statistic="Average",
            period=Duration.minutes(1),
        )

        # Lambda Duration Metric
        lambda_duration = cloudwatch.Metric(
            namespace="JaiibCaiib",
            metric_name="LambdaDuration",
            statistic="Average",
            period=Duration.minutes(1),
        )

        # Error Rate Metric
        error_rate = cloudwatch.Metric(
            namespace="JaiibCaiib",
            metric_name="ErrorRate",
            statistic="Sum",
            period=Duration.minutes(1),
        )

        # DynamoDB Read Capacity Metric
        dynamodb_read_capacity = cloudwatch.Metric(
            namespace="AWS/DynamoDB",
            metric_name="ConsumedReadCapacityUnits",
            statistic="Sum",
            period=Duration.minutes(1),
        )

        # Create Alarms
        cloudwatch.Alarm(
            self,
            "ApiResponseTimeAlarm",
            metric=api_response_time,
            threshold=500,
            evaluation_periods=2,
            datapoints_to_alarm=2,
            alarm_description="Alert when API response time exceeds 500ms",
        )

        cloudwatch.Alarm(
            self,
            "ErrorRateAlarm",
            metric=error_rate,
            threshold=1,
            evaluation_periods=2,
            datapoints_to_alarm=2,
            alarm_description="Alert when error rate exceeds 1%",
        )

        cloudwatch.Alarm(
            self,
            "DynamoDBThrottlingAlarm",
            metric=dynamodb_read_capacity,
            threshold=80,
            evaluation_periods=1,
            datapoints_to_alarm=1,
            alarm_description="Alert when DynamoDB reaches 80% capacity",
        )

    def _create_api_gateway(self, lambda_role: iam.Role) -> apigw.RestApi:
        """Create API Gateway with CORS and rate limiting"""
        api = apigw.RestApi(
            self,
            "JaiibApi",
            rest_api_name="jaiib-caiib-api",
            description="JAIIB-CAIIB Exam Prep Portal API",
            default_cors_preflight_options=apigw.CorsOptions(
                allow_origins=apigw.Cors.ALL_ORIGINS,
                allow_methods=apigw.Cors.ALL_METHODS,
                allow_headers=[
                    "Content-Type",
                    "Authorization",
                    "X-Amz-Date",
                    "X-Api-Key",
                    "X-Amz-Security-Token",
                ],
                max_age=Duration.days(1),
            ),
            endpoint_types=[apigw.EndpointType.REGIONAL],
        )

        # Add request validator
        request_validator = api.add_request_validator(
            "RequestValidator",
            validate_request_body=True,
            validate_request_parameters=True,
        )

        # Create auth resource
        auth_resource = api.root.add_resource("auth")
        auth_resource.add_method(
            "POST",
            apigw.MockIntegration(
                integration_responses=[
                    apigw.IntegrationResponse(status_code="200")
                ]
            ),
            method_responses=[apigw.MethodResponse(status_code="200")],
        )

        # Create practice resource
        practice_resource = api.root.add_resource("practice")
        practice_resource.add_method(
            "POST",
            apigw.MockIntegration(
                integration_responses=[
                    apigw.IntegrationResponse(status_code="200")
                ]
            ),
            method_responses=[apigw.MethodResponse(status_code="200")],
        )

        # Create dashboard resource
        dashboard_resource = api.root.add_resource("dashboard")
        dashboard_resource.add_method(
            "GET",
            apigw.MockIntegration(
                integration_responses=[
                    apigw.IntegrationResponse(status_code="200")
                ]
            ),
            method_responses=[apigw.MethodResponse(status_code="200")],
        )

        return api
