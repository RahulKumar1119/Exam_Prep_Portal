"""
Audit Log Retrieval and Reporting Service

Implements:
- Audit log retrieval with date range filtering
- Audit report generation for compliance officers
- Filtering by action type, user ID, resource type
- Report export in CSV/PDF format
"""

import json
import os
import csv
import io
from datetime import datetime
from typing import Dict, Any, Optional, List
import boto3
from botocore.exceptions import ClientError

# AWS clients
dynamodb = boto3.resource('dynamodb')
s3_client = boto3.client('s3')

# Environment variables
AUDIT_LOGS_TABLE = os.environ.get('AUDIT_LOGS_TABLE', 'AuditLogs')
REPORTS_BUCKET = os.environ.get('REPORTS_BUCKET', 'jaiib-audit-reports')

# DynamoDB table
audit_logs_table = dynamodb.Table(AUDIT_LOGS_TABLE)


class AuditReportingService:
    """Service for retrieving and reporting on audit logs."""
    
    @staticmethod
    def retrieve_audit_logs(
        start_date: str,
        end_date: str,
        user_id: Optional[str] = None,
        action_type: Optional[str] = None,
        resource_type: Optional[str] = None,
        limit: int = 1000
    ) -> Dict[str, Any]:
        """
        Retrieve audit logs with filtering.
        
        Args:
            start_date: Start date (ISO format)
            end_date: End date (ISO format)
            user_id: Filter by user ID (optional)
            action_type: Filter by action type (optional)
            resource_type: Filter by resource type (optional)
            limit: Maximum number of logs to return
        
        Returns:
            Dictionary with logs and metadata
        """
        try:
            # Build filter expression
            filter_expressions = []
            expression_values = {}
            
            # Always filter by timestamp range
            filter_expressions.append('#ts BETWEEN :start_date AND :end_date')
            expression_values[':start_date'] = start_date
            expression_values[':end_date'] = end_date
            
            if user_id:
                filter_expressions.append('user_id = :user_id')
                expression_values[':user_id'] = user_id
            
            if action_type:
                filter_expressions.append('action_type = :action_type')
                expression_values[':action_type'] = action_type
            
            if resource_type:
                filter_expressions.append('resource_type = :resource_type')
                expression_values[':resource_type'] = resource_type
            
            filter_expression = ' AND '.join(filter_expressions)
            
            # Query audit logs
            response = audit_logs_table.scan(
                FilterExpression=filter_expression,
                ExpressionAttributeNames={'#ts': 'timestamp'},
                ExpressionAttributeValues=expression_values,
                Limit=limit
            )
            
            logs = response.get('Items', [])
            
            # Sort by timestamp descending
            logs.sort(key=lambda x: x.get('timestamp', ''), reverse=True)
            
            return {
                'status': 'success',
                'logs': logs,
                'count': len(logs),
                'last_evaluated_key': response.get('LastEvaluatedKey'),
                'query_params': {
                    'start_date': start_date,
                    'end_date': end_date,
                    'user_id': user_id,
                    'action_type': action_type,
                    'resource_type': resource_type
                }
            }
        except ClientError as e:
            print(f"Error retrieving audit logs: {str(e)}")
            return {
                'status': 'error',
                'message': str(e)
            }
    
    @staticmethod
    def generate_csv_report(
        logs: List[Dict[str, Any]],
        report_name: str = 'audit_report'
    ) -> Dict[str, Any]:
        """
        Generate a CSV report from audit logs.
        
        Args:
            logs: List of audit log records
            report_name: Name for the report file
        
        Returns:
            Dictionary with CSV content and metadata
        """
        try:
            if not logs:
                return {
                    'status': 'success',
                    'content': '',
                    'filename': f'{report_name}.csv',
                    'message': 'No logs to export'
                }
            
            # Create CSV in memory
            output = io.StringIO()
            
            # Get all unique field names from logs
            fieldnames = set()
            for log in logs:
                fieldnames.update(log.keys())
            
            fieldnames = sorted(list(fieldnames))
            
            # Write CSV
            writer = csv.DictWriter(output, fieldnames=fieldnames)
            writer.writeheader()
            
            for log in logs:
                # Convert non-string values to strings
                row = {}
                for field in fieldnames:
                    value = log.get(field, '')
                    if isinstance(value, (dict, list)):
                        row[field] = json.dumps(value)
                    else:
                        row[field] = str(value)
                writer.writerow(row)
            
            csv_content = output.getvalue()
            
            return {
                'status': 'success',
                'content': csv_content,
                'filename': f'{report_name}.csv',
                'content_type': 'text/csv',
                'record_count': len(logs)
            }
        except Exception as e:
            print(f"Error generating CSV report: {str(e)}")
            return {
                'status': 'error',
                'message': str(e)
            }
    
    @staticmethod
    def generate_pdf_report(
        logs: List[Dict[str, Any]],
        report_name: str = 'audit_report',
        title: str = 'Audit Report'
    ) -> Dict[str, Any]:
        """
        Generate a PDF report from audit logs.
        
        Note: This is a simplified implementation. For production use,
        consider using a library like reportlab or weasyprint.
        
        Args:
            logs: List of audit log records
            report_name: Name for the report file
            title: Title for the report
        
        Returns:
            Dictionary with PDF content and metadata
        """
        try:
            # For now, return a message indicating PDF generation
            # In production, use reportlab or similar library
            
            if not logs:
                return {
                    'status': 'success',
                    'message': 'No logs to export',
                    'filename': f'{report_name}.pdf'
                }
            
            # Create a simple text-based report that can be converted to PDF
            report_lines = [
                f'{"=" * 80}',
                f'{title}',
                f'Generated: {datetime.utcnow().isoformat()}',
                f'Total Records: {len(logs)}',
                f'{"=" * 80}',
                ''
            ]
            
            # Add log entries
            for i, log in enumerate(logs, 1):
                report_lines.append(f'Record {i}:')
                report_lines.append(f'  Log ID: {log.get("log_id", "N/A")}')
                report_lines.append(f'  Timestamp: {log.get("timestamp", "N/A")}')
                report_lines.append(f'  User ID: {log.get("user_id", "N/A")}')
                report_lines.append(f'  Action: {log.get("action_type", "N/A")}')
                report_lines.append(f'  Resource: {log.get("resource_type", "N/A")} ({log.get("resource_id", "N/A")})')
                report_lines.append(f'  Result: {log.get("result", "N/A")}')
                report_lines.append(f'  IP Address: {log.get("ip_address", "N/A")}')
                report_lines.append(f'  Device: {log.get("device_info", "N/A")}')
                report_lines.append('')
            
            report_content = '\n'.join(report_lines)
            
            return {
                'status': 'success',
                'content': report_content,
                'filename': f'{report_name}.pdf',
                'content_type': 'application/pdf',
                'record_count': len(logs),
                'note': 'This is a text-based report. Use reportlab or similar for true PDF generation.'
            }
        except Exception as e:
            print(f"Error generating PDF report: {str(e)}")
            return {
                'status': 'error',
                'message': str(e)
            }
    
    @staticmethod
    def save_report_to_s3(
        report_content: str,
        report_name: str,
        report_format: str = 'csv'
    ) -> Dict[str, Any]:
        """
        Save a generated report to S3.
        
        Args:
            report_content: Content of the report
            report_name: Name for the report
            report_format: Format of the report (csv or pdf)
        
        Returns:
            Dictionary with S3 location and metadata
        """
        try:
            # Create S3 key
            timestamp = datetime.utcnow().strftime('%Y-%m-%d-%H-%M-%S')
            s3_key = f'reports/{timestamp}-{report_name}.{report_format}'
            
            # Determine content type
            content_type = 'text/csv' if report_format == 'csv' else 'application/pdf'
            
            # Upload to S3
            s3_client.put_object(
                Bucket=REPORTS_BUCKET,
                Key=s3_key,
                Body=report_content.encode('utf-8') if isinstance(report_content, str) else report_content,
                ContentType=content_type,
                ServerSideEncryption='AES256'
            )
            
            # Generate presigned URL (valid for 24 hours)
            presigned_url = s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': REPORTS_BUCKET, 'Key': s3_key},
                ExpiresIn=86400  # 24 hours
            )
            
            return {
                'status': 'success',
                'report_location': f's3://{REPORTS_BUCKET}/{s3_key}',
                'download_url': presigned_url,
                'expires_in_hours': 24
            }
        except ClientError as e:
            print(f"Error saving report to S3: {str(e)}")
            return {
                'status': 'error',
                'message': str(e)
            }
    
    @staticmethod
    def generate_compliance_report(
        start_date: str,
        end_date: str,
        report_format: str = 'csv',
        save_to_s3: bool = True
    ) -> Dict[str, Any]:
        """
        Generate a comprehensive compliance report.
        
        Args:
            start_date: Start date (ISO format)
            end_date: End date (ISO format)
            report_format: Format of the report (csv or pdf)
            save_to_s3: Whether to save the report to S3
        
        Returns:
            Dictionary with report content and metadata
        """
        try:
            # Retrieve all audit logs for the date range
            result = AuditReportingService.retrieve_audit_logs(
                start_date=start_date,
                end_date=end_date,
                limit=10000
            )
            
            if result.get('status') != 'success':
                return result
            
            logs = result.get('logs', [])
            
            # Generate report in requested format
            if report_format == 'csv':
                report_result = AuditReportingService.generate_csv_report(
                    logs,
                    report_name=f'compliance_report_{start_date}_{end_date}'
                )
            else:
                report_result = AuditReportingService.generate_pdf_report(
                    logs,
                    report_name=f'compliance_report_{start_date}_{end_date}',
                    title=f'Compliance Audit Report ({start_date} to {end_date})'
                )
            
            if report_result.get('status') != 'success':
                return report_result
            
            # Save to S3 if requested
            if save_to_s3:
                s3_result = AuditReportingService.save_report_to_s3(
                    report_result.get('content', ''),
                    f'compliance_report_{start_date}_{end_date}',
                    report_format
                )
                
                if s3_result.get('status') == 'success':
                    report_result.update(s3_result)
            
            # Add summary statistics
            action_counts = {}
            user_counts = {}
            result_counts = {'success': 0, 'failure': 0}
            
            for log in logs:
                action = log.get('action_type', 'unknown')
                action_counts[action] = action_counts.get(action, 0) + 1
                
                user = log.get('user_id', 'unknown')
                user_counts[user] = user_counts.get(user, 0) + 1
                
                result = log.get('result', 'unknown')
                if result in result_counts:
                    result_counts[result] += 1
            
            report_result['summary'] = {
                'total_records': len(logs),
                'date_range': {'start': start_date, 'end': end_date},
                'action_breakdown': action_counts,
                'user_breakdown': user_counts,
                'result_breakdown': result_counts
            }
            
            return report_result
        except Exception as e:
            print(f"Error generating compliance report: {str(e)}")
            return {
                'status': 'error',
                'message': str(e)
            }
    
    @staticmethod
    def get_audit_statistics(
        start_date: str,
        end_date: str
    ) -> Dict[str, Any]:
        """
        Get statistics about audit logs for a date range.
        
        Args:
            start_date: Start date (ISO format)
            end_date: End date (ISO format)
        
        Returns:
            Dictionary with audit statistics
        """
        try:
            result = AuditReportingService.retrieve_audit_logs(
                start_date=start_date,
                end_date=end_date,
                limit=10000
            )
            
            if result.get('status') != 'success':
                return result
            
            logs = result.get('logs', [])
            
            # Calculate statistics
            action_counts = {}
            user_counts = {}
            result_counts = {'success': 0, 'failure': 0}
            resource_type_counts = {}
            
            for log in logs:
                action = log.get('action_type', 'unknown')
                action_counts[action] = action_counts.get(action, 0) + 1
                
                user = log.get('user_id', 'unknown')
                user_counts[user] = user_counts.get(user, 0) + 1
                
                result = log.get('result', 'unknown')
                if result in result_counts:
                    result_counts[result] += 1
                
                resource_type = log.get('resource_type', 'unknown')
                resource_type_counts[resource_type] = resource_type_counts.get(resource_type, 0) + 1
            
            return {
                'status': 'success',
                'date_range': {'start': start_date, 'end': end_date},
                'total_records': len(logs),
                'action_breakdown': action_counts,
                'user_breakdown': user_counts,
                'result_breakdown': result_counts,
                'resource_type_breakdown': resource_type_counts,
                'success_rate': (result_counts.get('success', 0) / len(logs) * 100) if logs else 0
            }
        except Exception as e:
            print(f"Error calculating audit statistics: {str(e)}")
            return {
                'status': 'error',
                'message': str(e)
            }
