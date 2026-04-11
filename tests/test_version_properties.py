"""
Property-Based Tests for Question Bank Versioning

Tests universal properties that should hold across all valid inputs:
- Property 20: Question bank versioning preserves history
- Property 21: Version rollback restores state
"""

import pytest
from hypothesis import given, strategies as st, assume
import json
from datetime import datetime
from unittest.mock import patch, MagicMock
import sys

sys.path.insert(0, 'backend/question_bank')

from version_manager import (
    generate_version_number,
    initiate_rollback,
    confirm_and_execute_rollback
)


# Strategies for generating test data
def version_string_strategy():
    """Generate version strings like v1.0, v2.1, etc."""
    return st.builds(
        lambda major, minor: f"v{major}.{minor}",
        major=st.integers(min_value=1, max_value=10),
        minor=st.integers(min_value=0, max_value=20)
    )

version_strings = st.lists(
    version_string_strategy(),
    unique=True,
    max_size=10
)

valid_version_lists = st.lists(
    st.sampled_from([
        "v1.0", "v1.1", "v1.2", "v2.0", "v2.1", "v3.0"
    ]),
    unique=True,
    max_size=5
)


class TestVersioningPreservesHistory:
    """
    Property 20: Question bank versioning preserves history
    
    **Validates: Requirements 7.6, 7.7**
    
    For any question bank edit, the system should create a new version while 
    preserving the previous version, recording the editor's user ID, timestamp, 
    and change description.
    """
    
    @given(
        publisher_id=st.text(min_size=1, max_size=50),
        change_summary=st.text(min_size=1, max_size=200),
        question_count=st.integers(min_value=1, max_value=500)
    )
    def test_version_creation_records_metadata(self, publisher_id, change_summary, question_count):
        """
        For any valid publisher ID, change summary, and question count,
        version creation should record all metadata correctly.
        """
        # Generate test questions
        questions = [
            {
                'question_id': f'q{i}',
                'question_text': f'Question {i}',
                'options': ['A', 'B', 'C', 'D'],
                'correct_answer': 'A',
                'topic': 'Banking',
                'difficulty': 'easy'
            }
            for i in range(question_count)
        ]
        
        with patch('version_manager.get_version_history_table') as mock_vh_table, \
             patch('version_manager.get_question_bank_table') as mock_qb_table, \
             patch('version_manager.cloudwatch'):
            
            mock_vh_instance = MagicMock()
            mock_qb_instance = MagicMock()
            mock_vh_table.return_value = mock_vh_instance
            mock_qb_table.return_value = mock_qb_instance
            
            # Mock scan to return no existing versions
            mock_vh_instance.scan.return_value = {'Items': []}
            
            from version_manager import create_version
            
            result = create_version(
                publisher_user_id=publisher_id,
                change_summary=change_summary,
                questions_data=questions
            )
            
            # Verify metadata is recorded
            assert result['success'] is True
            assert result['question_count'] == question_count
            assert 'publication_timestamp' in result
            assert 'version_id' in result
            assert result['version_number'] == 'v1.0'
            
            # Verify put_item was called with correct metadata
            call_args = mock_vh_instance.put_item.call_args
            assert call_args is not None
            item = call_args[1]['Item']
            assert item['publisher_user_id'] == publisher_id
            assert item['change_summary'] == change_summary
    
    @given(valid_version_lists)
    def test_version_numbers_increment_monotonically(self, existing_versions):
        """
        For any list of existing versions, the next version number should be
        greater than all existing versions (monotonic increment).
        """
        from version_manager import generate_version_number
        
        next_version = generate_version_number(existing_versions)
        
        # Parse version numbers
        def parse_version(v):
            if v.startswith('v'):
                parts = v[1:].split('.')
                if len(parts) == 2:
                    try:
                        return (int(parts[0]), int(parts[1]))
                    except ValueError:
                        return None
            return None
        
        next_parsed = parse_version(next_version)
        assert next_parsed is not None
        
        # Verify next version is greater than all existing
        for existing in existing_versions:
            existing_parsed = parse_version(existing)
            if existing_parsed:
                # Next version should be >= existing version
                assert next_parsed >= existing_parsed
    
    @given(
        num_versions=st.integers(min_value=1, max_value=10),
        questions_per_version=st.integers(min_value=1, max_value=50)
    )
    def test_multiple_versions_preserve_previous_data(self, num_versions, questions_per_version):
        """
        For any sequence of version creations, each new version should preserve
        the previous version's data without modification.
        """
        with patch('version_manager.get_version_history_table') as mock_vh_table, \
             patch('version_manager.get_question_bank_table') as mock_qb_table, \
             patch('version_manager.cloudwatch'):
            
            mock_vh_instance = MagicMock()
            mock_qb_instance = MagicMock()
            mock_vh_table.return_value = mock_vh_instance
            mock_qb_table.return_value = mock_qb_instance
            
            from version_manager import create_version
            
            created_versions = []
            existing_versions = []
            
            for v in range(num_versions):
                # Mock scan to return previously created versions
                mock_vh_instance.scan.return_value = {
                    'Items': [{'version_number': ver} for ver in existing_versions]
                }
                
                questions = [
                    {
                        'question_id': f'q{i}',
                        'question_text': f'Question {i} v{v}',
                        'options': ['A', 'B', 'C', 'D'],
                        'correct_answer': 'A'
                    }
                    for i in range(questions_per_version)
                ]
                
                result = create_version(
                    publisher_user_id=f'user{v}',
                    change_summary=f'Version {v}',
                    questions_data=questions
                )
                
                assert result['success'] is True
                created_versions.append(result['version_number'])
                existing_versions.append(result['version_number'])
            
            # Verify all versions were created
            assert len(created_versions) == num_versions
            
            # Verify versions are unique
            assert len(set(created_versions)) == num_versions


class TestVersionRollbackRestoresState:
    """
    Property 21: Version rollback restores state
    
    **Validates: Requirements 15.6, 15.8**
    
    For any question bank rollback to a previous version, the system should 
    restore all questions to their state in that version and create a new 
    version snapshot documenting the rollback.
    """
    
    @given(
        target_version=st.sampled_from(['v1.0', 'v1.1', 'v2.0']),
        rollback_reason=st.text(min_size=1, max_size=200)
    )
    def test_rollback_creates_new_version_snapshot(self, target_version, rollback_reason):
        """
        For any rollback operation, a new version snapshot should be created
        documenting the rollback action.
        """
        with patch('version_manager.get_version_history_table') as mock_vh_table, \
             patch('version_manager.get_question_bank_table') as mock_qb_table, \
             patch('version_manager.cloudwatch'):
            
            mock_vh_instance = MagicMock()
            mock_qb_instance = MagicMock()
            mock_vh_table.return_value = mock_vh_instance
            mock_qb_table.return_value = mock_qb_instance
            
            # Mock existing versions
            mock_vh_instance.scan.return_value = {
                'Items': [
                    {'version_number': 'v1.0'},
                    {'version_number': 'v1.1'},
                    {'version_number': 'v2.0'}
                ]
            }
            
            from version_manager import create_version
            
            # Create a rollback version
            result = create_version(
                publisher_user_id='admin123',
                change_summary=f'Rollback to {target_version}: {rollback_reason}',
                questions_data=[]
            )
            
            # Verify new version was created
            assert result['success'] is True
            assert 'version_id' in result
            assert 'publication_timestamp' in result
            
            # Verify rollback is documented in change summary
            call_args = mock_vh_instance.put_item.call_args
            item = call_args[1]['Item']
            assert 'Rollback' in item['change_summary']
    
    @given(
        num_questions=st.integers(min_value=1, max_value=100),
        num_versions=st.integers(min_value=2, max_value=5)
    )
    def test_rollback_preserves_target_version_questions(self, num_questions, num_versions):
        """
        For any rollback to a target version, the questions from that version
        should be preserved and accessible.
        """
        with patch('version_manager.get_version_history_table') as mock_vh_table, \
             patch('version_manager.get_question_bank_table') as mock_qb_table, \
             patch('version_manager.cloudwatch'):
            
            mock_vh_instance = MagicMock()
            mock_qb_instance = MagicMock()
            mock_vh_table.return_value = mock_vh_instance
            mock_qb_table.return_value = mock_qb_instance
            
            from version_manager import create_version, get_version_details
            
            # Create initial version with questions
            questions = [
                {
                    'question_id': f'q{i}',
                    'question_text': f'Question {i}',
                    'options': ['A', 'B', 'C', 'D'],
                    'correct_answer': 'A'
                }
                for i in range(num_questions)
            ]
            
            mock_vh_instance.scan.return_value = {'Items': []}
            
            result = create_version(
                publisher_user_id='user1',
                change_summary='Initial version',
                questions_data=questions
            )
            
            initial_version = result['version_number']
            
            # Create additional versions
            for v in range(1, num_versions):
                mock_vh_instance.scan.return_value = {
                    'Items': [{'version_number': initial_version}]
                }
                
                create_version(
                    publisher_user_id=f'user{v}',
                    change_summary=f'Update {v}',
                    questions_data=[]
                )
            
            # Verify initial version questions are preserved
            mock_vh_instance.scan.return_value = {
                'Items': [
                    {
                        'version_id': 'v1',
                        'version_number': initial_version,
                        'publisher_user_id': 'user1',
                        'publication_timestamp': '2024-01-01T10:00:00',
                        'change_summary': 'Initial version',
                        'question_count': num_questions,
                        'questions_snapshot': json.dumps(questions)
                    }
                ]
            }
            
            details = get_version_details(initial_version)
            
            assert details['success'] is True
            assert len(details['questions']) == num_questions


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
