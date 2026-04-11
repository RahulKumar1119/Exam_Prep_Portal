"""
Property-Based Tests for Question Bank CRUD Operations

Tests universal properties that should hold across all valid inputs.

**Validates: Requirements 7.3, 7.4, 7.5, 7.11, 7.12**
"""

import pytest
from hypothesis import given, strategies as st, assume
from unittest.mock import patch, MagicMock
import sys
import os
import uuid

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend', 'question_bank'))

from crud_service import (
    validate_mcq_fields,
    create_mcq,
    update_mcq,
    delete_mcq,
    search_mcqs,
    VALID_PAPERS,
    VALID_DIFFICULTIES
)


# Strategies for generating test data
valid_question_text = st.text(
    alphabet=st.characters(blacklist_categories=('Cc', 'Cs')),
    min_size=10,
    max_size=500
)

valid_option = st.text(
    alphabet=st.characters(blacklist_categories=('Cc', 'Cs')),
    min_size=2,
    max_size=200
)

valid_options = st.lists(valid_option, min_size=4, max_size=4)

valid_correct_answer = st.sampled_from(['A', 'B', 'C', 'D'])

valid_topic = st.text(
    alphabet=st.characters(blacklist_categories=('Cc', 'Cs')),
    min_size=2,
    max_size=100
)

valid_difficulty = st.sampled_from(VALID_DIFFICULTIES)

valid_paper = st.sampled_from(VALID_PAPERS)

valid_reference = st.text(
    alphabet=st.characters(blacklist_categories=('Cc', 'Cs')),
    min_size=1,
    max_size=200
)

valid_references = st.fixed_dictionaries({
    'rbi_reference': valid_reference,
    'iibf_reference': valid_reference
})

valid_user_id = st.uuids().map(str)


class TestMCQCreationProperties:
    """Property-based tests for MCQ creation"""
    
    @given(
        question_text=valid_question_text,
        options=valid_options,
        correct_answer=valid_correct_answer,
        topic=valid_topic,
        difficulty=valid_difficulty,
        references=valid_references,
        paper=valid_paper,
        creator_user_id=valid_user_id
    )
    @patch('crud_service.get_question_bank_table')
    @patch('crud_service.cloudwatch')
    def test_create_mcq_always_succeeds_with_valid_data(
        self, mock_cw, mock_table,
        question_text, options, correct_answer, topic, difficulty,
        references, paper, creator_user_id
    ):
        """
        **Property: MCQ Creation Always Succeeds with Valid Data**
        
        For any valid MCQ data (question text, options, correct answer, topic,
        difficulty, references, paper), creating an MCQ should always succeed
        and return a question_id and version.
        
        **Validates: Requirements 7.3, 7.4, 7.5**
        """
        mock_db_table = MagicMock()
        mock_table.return_value = mock_db_table
        
        result = create_mcq(
            question_text=question_text,
            options=options,
            correct_answer=correct_answer,
            topic=topic,
            difficulty=difficulty,
            references=references,
            paper=paper,
            creator_user_id=creator_user_id
        )
        
        # Property: Creation should always succeed
        assert result['success'] is True
        
        # Property: Result should contain question_id
        assert 'question_id' in result
        assert isinstance(result['question_id'], str)
        assert len(result['question_id']) > 0
        
        # Property: Result should contain version
        assert 'version' in result
        assert result['version'] == 'v1.0'
        
        # Property: Result should contain timestamp
        assert 'created_at' in result
        
        # Property: Database put_item should be called exactly once
        mock_db_table.put_item.assert_called_once()
        
        # Property: Stored item should have all required fields
        call_args = mock_db_table.put_item.call_args
        stored_item = call_args[1]['Item']
        
        assert stored_item['question_id'] == result['question_id']
        assert stored_item['version'] == 'v1.0'
        assert stored_item['question_text'] == question_text
        assert stored_item['options'] == options
        assert stored_item['correct_answer'] == correct_answer
        assert stored_item['topic'] == topic
        assert stored_item['difficulty'] == difficulty
        assert stored_item['paper'] == paper
        assert stored_item['created_by'] == creator_user_id
        assert stored_item['status'] == 'active'
    
    @given(
        question_text=valid_question_text,
        options=valid_options,
        correct_answer=valid_correct_answer,
        topic=valid_topic,
        difficulty=valid_difficulty,
        references=valid_references,
        paper=valid_paper,
        creator_user_id=valid_user_id
    )
    @patch('crud_service.get_question_bank_table')
    @patch('crud_service.cloudwatch')
    def test_created_mcq_has_unique_id(
        self, mock_cw, mock_table,
        question_text, options, correct_answer, topic, difficulty,
        references, paper, creator_user_id
    ):
        """
        **Property: Created MCQs Have Unique IDs**
        
        For any valid MCQ data, each created MCQ should have a unique question_id.
        
        **Validates: Requirements 7.3, 7.4**
        """
        mock_db_table = MagicMock()
        mock_table.return_value = mock_db_table
        
        # Create multiple MCQs with same data
        result1 = create_mcq(
            question_text=question_text,
            options=options,
            correct_answer=correct_answer,
            topic=topic,
            difficulty=difficulty,
            references=references,
            paper=paper,
            creator_user_id=creator_user_id
        )
        
        result2 = create_mcq(
            question_text=question_text,
            options=options,
            correct_answer=correct_answer,
            topic=topic,
            difficulty=difficulty,
            references=references,
            paper=paper,
            creator_user_id=creator_user_id
        )
        
        # Property: IDs should be different
        assert result1['question_id'] != result2['question_id']


class TestMCQUpdateProperties:
    """Property-based tests for MCQ update"""
    
    @given(
        question_text=valid_question_text,
        options=valid_options,
        correct_answer=valid_correct_answer,
        topic=valid_topic,
        difficulty=valid_difficulty,
        references=valid_references,
        paper=valid_paper,
        updater_user_id=valid_user_id
    )
    @patch('crud_service.get_question_bank_table')
    @patch('crud_service.get_mcq')
    @patch('crud_service.cloudwatch')
    def test_update_mcq_creates_new_version(
        self, mock_cw, mock_get, mock_table,
        question_text, options, correct_answer, topic, difficulty,
        references, paper, updater_user_id
    ):
        """
        **Property: MCQ Update Creates New Version**
        
        For any MCQ update with valid data, the system should create a new version
        and preserve the previous version.
        
        **Validates: Requirements 7.4, 7.6, 7.7**
        """
        mock_db_table = MagicMock()
        mock_table.return_value = mock_db_table
        
        # Mock existing MCQ
        mock_get.return_value = {
            'success': True,
            'question': {
                'question_id': 'q123',
                'version': 'v1.0',
                'question_text': 'Old question',
                'options': ['A', 'B', 'C', 'D'],
                'correct_answer': 'A',
                'topic': 'Old Topic',
                'difficulty': 'easy',
                'paper': paper,
                'rbi_reference': 'ref1',
                'iibf_reference': 'ref2',
                'created_at': '2024-01-01',
                'created_by': 'user1'
            }
        }
        
        result = update_mcq(
            question_id='q123',
            question_text=question_text,
            options=options,
            correct_answer=correct_answer,
            topic=topic,
            difficulty=difficulty,
            references=references,
            updater_user_id=updater_user_id
        )
        
        # Property: Update should succeed
        assert result['success'] is True
        
        # Property: New version should be created
        assert 'new_version' in result
        assert result['new_version'] == 'v1.1'
        
        # Property: Previous version should be preserved
        assert 'previous_version' in result
        assert result['previous_version'] == 'v1.0'
        
        # Property: Database put_item should be called for new version
        mock_db_table.put_item.assert_called_once()
        
        # Property: New version should have updated_by set
        call_args = mock_db_table.put_item.call_args
        stored_item = call_args[1]['Item']
        assert stored_item['updated_by'] == updater_user_id
        assert stored_item['previous_version'] == 'v1.0'


class TestMCQDeletionProperties:
    """Property-based tests for MCQ deletion"""
    
    @given(deleter_user_id=valid_user_id)
    @patch('crud_service.get_question_bank_table')
    @patch('crud_service.get_mcq')
    @patch('crud_service.cloudwatch')
    def test_delete_mcq_marks_inactive_not_permanent(
        self, mock_cw, mock_get, mock_table, deleter_user_id
    ):
        """
        **Property: MCQ Deletion Marks as Inactive (Soft Delete)**
        
        For any MCQ deletion, the system should mark the MCQ as inactive
        rather than permanently deleting it, preserving all version history.
        
        **Validates: Requirements 7.5, 7.11**
        """
        mock_db_table = MagicMock()
        mock_table.return_value = mock_db_table
        
        mock_get.return_value = {
            'success': True,
            'question': {
                'question_id': 'q123',
                'version': 'v1.0'
            }
        }
        
        result = delete_mcq('q123', deleter_user_id)
        
        # Property: Deletion should succeed
        assert result['success'] is True
        
        # Property: Should use update_item (soft delete), not delete_item
        mock_db_table.update_item.assert_called_once()
        
        # Property: Update should set status to 'inactive'
        call_args = mock_db_table.update_item.call_args
        update_expr = call_args[1]['UpdateExpression']
        assert '#status = :inactive' in update_expr
        
        # Property: Should record deletion timestamp and user
        expr_values = call_args[1]['ExpressionAttributeValues']
        assert expr_values[':inactive'] == 'inactive'
        assert expr_values[':user_id'] == deleter_user_id


class TestMCQSearchProperties:
    """Property-based tests for MCQ search"""
    
    @given(
        paper=st.one_of(st.none(), valid_paper),
        topic=st.one_of(st.none(), valid_topic),
        difficulty=st.one_of(st.none(), valid_difficulty)
    )
    @patch('crud_service.get_question_bank_table')
    def test_search_mcqs_returns_only_active_questions(
        self, mock_table, paper, topic, difficulty
    ):
        """
        **Property: Search Returns Only Active Questions**
        
        For any search query, the system should only return questions with
        status='active', never returning inactive (deleted) questions.
        
        **Validates: Requirements 7.12**
        """
        mock_db_table = MagicMock()
        mock_table.return_value = mock_db_table
        
        # Mock results with mix of active and inactive
        mock_items = [
            {'question_id': 'q1', 'version': 'v1.0', 'status': 'active'},
            {'question_id': 'q2', 'version': 'v1.0', 'status': 'active'},
            {'question_id': 'q3', 'version': 'v1.0', 'status': 'inactive'}
        ]
        mock_db_table.scan.return_value = {'Items': mock_items, 'Count': 3}
        
        result = search_mcqs(paper=paper, topic=topic, difficulty=difficulty)
        
        # Property: Search should succeed
        assert result['success'] is True
        
        # Property: Filter expression should include status check
        call_args = mock_db_table.scan.call_args
        filter_expr = call_args[1].get('FilterExpression', '')
        assert '#status = :active' in filter_expr
    
    @given(
        paper=st.one_of(st.none(), valid_paper),
        topic=st.one_of(st.none(), valid_topic),
        difficulty=st.one_of(st.none(), valid_difficulty),
        keyword=st.one_of(st.none(), st.text(min_size=1, max_size=50))
    )
    @patch('crud_service.get_question_bank_table')
    def test_search_mcqs_returns_latest_versions(
        self, mock_table, paper, topic, difficulty, keyword
    ):
        """
        **Property: Search Returns Latest Versions**
        
        For any search query, when multiple versions of the same question exist,
        the system should return only the latest version.
        
        **Validates: Requirements 7.12**
        """
        mock_db_table = MagicMock()
        mock_table.return_value = mock_db_table
        
        # Mock results with multiple versions of same question
        mock_items = [
            {'question_id': 'q1', 'version': 'v1.0'},
            {'question_id': 'q1', 'version': 'v1.1'},
            {'question_id': 'q1', 'version': 'v1.2'},
            {'question_id': 'q2', 'version': 'v1.0'}
        ]
        mock_db_table.scan.return_value = {'Items': mock_items, 'Count': 4}
        
        result = search_mcqs(paper=paper, topic=topic, difficulty=difficulty, keyword=keyword)
        
        # Property: Search should succeed
        assert result['success'] is True
        
        # Property: Should only return 2 questions (latest versions)
        assert result['count'] == 2
        
        # Property: For q1, should only have v1.2
        q1_results = [q for q in result['questions'] if q['question_id'] == 'q1']
        assert len(q1_results) == 1
        assert q1_results[0]['version'] == 'v1.2'


class TestMCQValidationProperties:
    """Property-based tests for MCQ field validation"""
    
    @given(
        question_text=valid_question_text,
        options=valid_options,
        correct_answer=valid_correct_answer,
        topic=valid_topic,
        difficulty=valid_difficulty,
        references=valid_references,
        paper=valid_paper
    )
    def test_valid_mcq_fields_always_pass_validation(
        self, question_text, options, correct_answer, topic,
        difficulty, references, paper
    ):
        """
        **Property: Valid MCQ Fields Always Pass Validation**
        
        For any valid MCQ data generated by our strategies, validation should
        always pass.
        
        **Validates: Requirements 7.3, 7.4, 7.5**
        """
        is_valid, error = validate_mcq_fields(
            question_text=question_text,
            options=options,
            correct_answer=correct_answer,
            topic=topic,
            difficulty=difficulty,
            references=references,
            paper=paper
        )
        
        # Property: Validation should pass
        assert is_valid is True
        assert error == ""
    
    @given(
        question_text=st.text(max_size=9),  # Too short
        options=valid_options,
        correct_answer=valid_correct_answer,
        topic=valid_topic,
        difficulty=valid_difficulty,
        references=valid_references,
        paper=valid_paper
    )
    def test_invalid_question_text_fails_validation(
        self, question_text, options, correct_answer, topic,
        difficulty, references, paper
    ):
        """
        **Property: Invalid Question Text Fails Validation**
        
        For any question text shorter than 10 characters, validation should fail.
        
        **Validates: Requirements 7.3, 7.4**
        """
        assume(len(question_text) < 10)  # Ensure we have short text
        
        is_valid, error = validate_mcq_fields(
            question_text=question_text,
            options=options,
            correct_answer=correct_answer,
            topic=topic,
            difficulty=difficulty,
            references=references,
            paper=paper
        )
        
        # Property: Validation should fail
        assert is_valid is False
        assert len(error) > 0
    
    @given(
        question_text=valid_question_text,
        correct_answer=valid_correct_answer,
        topic=valid_topic,
        difficulty=valid_difficulty,
        references=valid_references,
        paper=valid_paper
    )
    def test_invalid_options_count_fails_validation(
        self, question_text, correct_answer, topic,
        difficulty, references, paper
    ):
        """
        **Property: Invalid Options Count Fails Validation**
        
        For any options list that doesn't have exactly 4 options, validation should fail.
        
        **Validates: Requirements 7.3, 7.4**
        """
        # Generate invalid options (not 4)
        invalid_options = st.lists(valid_option, min_size=1, max_size=3).example()
        
        is_valid, error = validate_mcq_fields(
            question_text=question_text,
            options=invalid_options,
            correct_answer=correct_answer,
            topic=topic,
            difficulty=difficulty,
            references=references,
            paper=paper
        )
        
        # Property: Validation should fail
        assert is_valid is False
        assert 'exactly 4 options' in error
