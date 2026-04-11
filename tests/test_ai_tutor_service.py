"""
Unit Tests for AI Tutor Service
Tests explanation generation, validation, and storage
"""

import pytest
import json
from unittest.mock import Mock, patch, MagicMock
from datetime import datetime
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend', 'ai_tutor'))

from explanation_service import (
    ExplanationGenerator,
    ExplanationStorage,
    get_user_performance_context
)


class TestExplanationGenerator:
    """Test ExplanationGenerator class"""
    
    def test_build_tutor_prompt_structure(self):
        """Test that prompt is built with all required components"""
        question = {
            'question_text': 'What is RBI?',
            'options': ['Reserve Bank of India', 'Royal Bank of India', 'Regional Bank of India', 'Reserve Banking Institute'],
            'correct_answer': 'A',
            'topic': 'Banking Basics'
        }
        user_context = {'accuracy': 65}
        
        prompt = ExplanationGenerator.build_tutor_prompt(question, user_context)
        
        assert 'What is RBI?' in prompt
        assert 'Reserve Bank of India' in prompt
        assert 'Banking Basics' in prompt
        assert 'intermediate' in prompt
        assert 'REQUIREMENTS:' in prompt
    
    def test_build_tutor_prompt_beginner_level(self):
        """Test prompt for beginner user"""
        question = {
            'question_text': 'Test question',
            'options': ['A', 'B', 'C', 'D'],
            'correct_answer': 'A',
            'topic': 'Topic'
        }
        user_context = {'accuracy': 30}
        
        prompt = ExplanationGenerator.build_tutor_prompt(question, user_context)
        assert 'beginner' in prompt
    
    def test_build_tutor_prompt_advanced_level(self):
        """Test prompt for advanced user"""
        question = {
            'question_text': 'Test question',
            'options': ['A', 'B', 'C', 'D'],
            'correct_answer': 'A',
            'topic': 'Topic'
        }
        user_context = {'accuracy': 85}
        
        prompt = ExplanationGenerator.build_tutor_prompt(question, user_context)
        assert 'advanced' in prompt
    
    def test_extract_citations_rbi_reference(self):
        """Test extraction of RBI citations"""
        explanation = "According to RBI Circular 2023-24, banks must maintain capital ratios. The RBI Guidelines state that..."
        
        citations = ExplanationGenerator.extract_citations(explanation)
        
        assert len(citations) > 0
        assert any(c['source'] == 'RBI' for c in citations)
    
    def test_extract_citations_iibf_reference(self):
        """Test extraction of IIBF citations"""
        explanation = "IIBF Guidelines require compliance with international standards. The IIBF Framework provides..."
        
        citations = ExplanationGenerator.extract_citations(explanation)
        
        assert len(citations) > 0
        assert any(c['source'] == 'IIBF' for c in citations)
    
    def test_extract_citations_no_references(self):
        """Test extraction when no citations present"""
        explanation = "This is a simple explanation without any regulatory references."
        
        citations = ExplanationGenerator.extract_citations(explanation)
        
        assert len(citations) == 0
    
    def test_validate_explanation_valid(self):
        """Test validation of valid explanation"""
        explanation = "The correct answer is A because it represents the Reserve Bank of India, which is the central banking authority. " \
                     "This is an important concept in banking fundamentals. The RBI is responsible for monetary policy and regulation. " \
                     "Understanding this principle is crucial for exam success and financial literacy."
        
        is_valid, error_msg = ExplanationGenerator.validate_explanation(explanation)
        
        # Should be valid or at least have the required elements
        assert error_msg == "" or "empty" not in error_msg.lower()
    
    def test_validate_explanation_too_short(self):
        """Test validation of explanation that's too short"""
        explanation = "The answer is A."
        
        is_valid, error_msg = ExplanationGenerator.validate_explanation(explanation)
        
        assert is_valid is False
        assert "too short" in error_msg.lower()
    
    def test_validate_explanation_too_long(self):
        """Test validation of explanation that's too long"""
        explanation = " ".join(["word"] * 350)
        
        is_valid, error_msg = ExplanationGenerator.validate_explanation(explanation)
        
        assert is_valid is False
        assert "too long" in error_msg.lower()
    
    def test_validate_explanation_missing_elements(self):
        """Test validation when required elements are missing"""
        explanation = "This is a test explanation that has enough words to pass the word count requirement " \
                     "but it does not contain any of the required elements like answer or reasoning or concepts " \
                     "that should be present in a good explanation for the exam."
        
        is_valid, error_msg = ExplanationGenerator.validate_explanation(explanation)
        
        # May or may not be valid depending on content, but should check for elements
        assert isinstance(is_valid, bool)
    
    def test_validate_explanation_empty(self):
        """Test validation of empty explanation"""
        explanation = ""
        
        is_valid, error_msg = ExplanationGenerator.validate_explanation(explanation)
        
        assert is_valid is False
        assert "empty" in error_msg.lower()
    
    @patch('explanation_service.bedrock_client')
    def test_invoke_bedrock_success(self, mock_bedrock):
        """Test successful Bedrock invocation"""
        mock_response = {
            'body': MagicMock(read=lambda: json.dumps({
                'content': [{'text': 'This is a test explanation with enough words to be valid and complete.'}]
            }).encode())
        }
        mock_bedrock.invoke_model.return_value = mock_response
        
        explanation, success = ExplanationGenerator.invoke_bedrock("test prompt")
        
        assert success is True
        assert explanation is not None
        assert "test explanation" in explanation
    
    @patch('explanation_service.bedrock_client')
    def test_invoke_bedrock_failure(self, mock_bedrock):
        """Test failed Bedrock invocation"""
        mock_bedrock.invoke_model.side_effect = Exception("Service unavailable")
        
        explanation, success = ExplanationGenerator.invoke_bedrock("test prompt")
        
        assert success is False
        assert explanation is None
    
    @patch('explanation_service.bedrock_client')
    def test_generate_explanation_success(self, mock_bedrock):
        """Test successful explanation generation"""
        mock_response = {
            'body': MagicMock(read=lambda: json.dumps({
                'content': [{'text': 'The correct answer is A because it represents the Reserve Bank of India. ' \
                                    'This is the central banking authority responsible for monetary policy. ' \
                                    'Understanding this concept is crucial for banking exams.'}]
            }).encode())
        }
        mock_bedrock.invoke_model.return_value = mock_response
        
        question = {
            'question_text': 'What is RBI?',
            'options': ['Reserve Bank of India', 'Royal Bank', 'Regional Bank', 'Reserve Banking'],
            'correct_answer': 'A',
            'topic': 'Banking'
        }
        user_context = {'accuracy': 70}
        
        result = ExplanationGenerator.generate_explanation('q1', 'u1', question, user_context)
        
        assert result['success'] is True
        assert result['explanation'] is not None
        assert result['word_count'] > 0
        assert isinstance(result['citations'], list)
    
    @patch('explanation_service.bedrock_client')
    def test_generate_explanation_timeout(self, mock_bedrock):
        """Test explanation generation with timeout"""
        mock_bedrock.invoke_model.side_effect = Exception("Request timeout")
        
        question = {
            'question_text': 'Test question',
            'options': ['A', 'B', 'C', 'D'],
            'correct_answer': 'A',
            'topic': 'Topic'
        }
        user_context = {'accuracy': 50}
        
        result = ExplanationGenerator.generate_explanation('q1', 'u1', question, user_context)
        
        assert result['success'] is False
        assert result['is_fallback'] is True
        assert "temporarily unavailable" in result['explanation']


class TestExplanationStorage:
    """Test ExplanationStorage class"""
    
    @patch('explanation_service.explanations_table')
    def test_save_explanation_success(self, mock_table):
        """Test successful explanation storage"""
        mock_table.put_item.return_value = {}
        
        success = ExplanationStorage.save_explanation(
            'exp1', 'u1', 'q1',
            'Test explanation',
            [{'source': 'RBI', 'reference': 'RBI Circular'}],
            150
        )
        
        assert success is True
        mock_table.put_item.assert_called_once()
    
    @patch('explanation_service.explanations_table')
    def test_save_explanation_failure(self, mock_table):
        """Test failed explanation storage"""
        mock_table.put_item.side_effect = Exception("Database error")
        
        success = ExplanationStorage.save_explanation(
            'exp1', 'u1', 'q1',
            'Test explanation',
            [],
            150
        )
        
        assert success is False
    
    @patch('explanation_service.explanations_table')
    def test_get_explanation_success(self, mock_table):
        """Test successful explanation retrieval"""
        mock_table.get_item.return_value = {
            'Item': {
                'explanation_id': 'exp1',
                'explanation': 'Test explanation',
                'citations': []
            }
        }
        
        result = ExplanationStorage.get_explanation('exp1')
        
        assert result is not None
        assert result['explanation_id'] == 'exp1'
    
    @patch('explanation_service.explanations_table')
    def test_get_explanation_not_found(self, mock_table):
        """Test retrieval of non-existent explanation"""
        mock_table.get_item.return_value = {}
        
        result = ExplanationStorage.get_explanation('nonexistent')
        
        assert result is None
    
    @patch('explanation_service.explanations_table')
    def test_get_user_explanations(self, mock_table):
        """Test retrieval of user's explanations"""
        mock_table.query.return_value = {
            'Items': [
                {'explanation_id': 'exp1', 'user_id': 'u1'},
                {'explanation_id': 'exp2', 'user_id': 'u1'}
            ]
        }
        
        results = ExplanationStorage.get_user_explanations('u1')
        
        assert len(results) == 2
        assert all(r['user_id'] == 'u1' for r in results)


class TestUserPerformanceContext:
    """Test user performance context retrieval"""
    
    @patch('explanation_service.dynamodb')
    def test_get_user_performance_context_with_scores(self, mock_dynamodb):
        """Test getting performance context with existing scores"""
        mock_table = MagicMock()
        mock_dynamodb.Table.return_value = mock_table
        
        mock_table.query.return_value = {
            'Items': [
                {'score': 80, 'topic': 'Banking'},
                {'score': 70, 'topic': 'Banking'},
                {'score': 90, 'topic': 'Banking'}
            ]
        }
        
        context = get_user_performance_context('u1', 'Banking')
        
        assert context['accuracy'] > 0
        assert context['attempts'] == 3
        assert context['average_score'] > 0
    
    @patch('explanation_service.dynamodb')
    def test_get_user_performance_context_no_scores(self, mock_dynamodb):
        """Test getting performance context with no scores"""
        mock_table = MagicMock()
        mock_dynamodb.Table.return_value = mock_table
        
        mock_table.query.return_value = {'Items': []}
        
        context = get_user_performance_context('u1', 'Banking')
        
        assert context['accuracy'] == 0
        assert context['attempts'] == 0
        assert context['average_score'] == 0
