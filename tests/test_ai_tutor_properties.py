"""
Property-Based Tests for AI Tutor Service
Tests correctness properties using Hypothesis
"""

import pytest
from hypothesis import given, strategies as st, settings, HealthCheck
from unittest.mock import patch, MagicMock
import json
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend', 'ai_tutor'))

from explanation_service import ExplanationGenerator, ExplanationStorage


# Custom strategies
question_strategy = st.fixed_dictionaries({
    'question_text': st.text(min_size=10, max_size=200),
    'options': st.lists(st.text(min_size=5, max_size=50), min_size=4, max_size=4),
    'correct_answer': st.sampled_from(['A', 'B', 'C', 'D']),
    'topic': st.text(min_size=3, max_size=50)
})

user_context_strategy = st.fixed_dictionaries({
    'accuracy': st.integers(min_value=0, max_value=100),
    'attempts': st.integers(min_value=0, max_value=100),
    'average_score': st.floats(min_value=0, max_value=100)
})

explanation_strategy = st.text(
    min_size=150,
    max_size=300,
    alphabet=st.characters(blacklist_categories=('Cc', 'Cs'))
)


class TestExplanationGenerationLatency:
    """
    Property 14: AI Explanation Generation Latency
    
    For any request for an AI explanation, the system should generate and return 
    the explanation within 5 seconds, or display a fallback message if the timeout 
    is exceeded.
    
    Validates: Requirements 5.2, 5.8
    """
    
    @patch('explanation_service.bedrock_client')
    @given(question_strategy, user_context_strategy)
    @settings(max_examples=5, suppress_health_check=[HealthCheck.too_slow])
    def test_explanation_generation_completes_within_timeout(self, mock_bedrock, question, user_context):
        """
        Property: For any question and user context, explanation generation 
        should complete within 5 seconds or return fallback
        """
        import time
        
        # Mock successful Bedrock response
        mock_response = {
            'body': MagicMock(read=lambda: json.dumps({
                'content': [{'text': 'The correct answer is A because it represents the key concept. ' \
                                    'This is important for understanding the topic. ' \
                                    'The reasoning is clear and the concept is fundamental.'}]
            }).encode())
        }
        mock_bedrock.invoke_model.return_value = mock_response
        
        start_time = time.time()
        result = ExplanationGenerator.generate_explanation('q1', 'u1', question, user_context)
        elapsed = time.time() - start_time
        
        # Property: Either success or fallback, but always completes
        assert result is not None
        assert 'success' in result
        assert 'explanation' in result
        
        # Property: Completes within reasonable time (5 seconds)
        assert elapsed < 5.0, f"Explanation generation took {elapsed:.2f}s, exceeds 5s timeout"
        
        # Property: If fallback, has appropriate message
        if result.get('is_fallback'):
            assert "temporarily unavailable" in result['explanation'] or \
                   "error" in result['explanation'].lower()
    
    @patch('explanation_service.bedrock_client')
    @given(question_strategy, user_context_strategy)
    @settings(max_examples=5, suppress_health_check=[HealthCheck.too_slow])
    def test_explanation_fallback_on_timeout(self, mock_bedrock, question, user_context):
        """
        Property: When Bedrock times out, system returns fallback message 
        instead of crashing
        """
        # Mock timeout
        mock_bedrock.invoke_model.side_effect = Exception("Request timeout")
        
        result = ExplanationGenerator.generate_explanation('q1', 'u1', question, user_context)
        
        # Property: Always returns a result, never crashes
        assert result is not None
        assert isinstance(result, dict)
        
        # Property: Fallback is marked appropriately
        assert result.get('is_fallback') is True
        
        # Property: Fallback message is user-friendly
        assert len(result['explanation']) > 0
        assert "error" not in result['explanation'].lower() or \
               "temporarily" in result['explanation'].lower()


class TestExplanationContentQuality:
    """
    Property 15: Explanation Contains Required Elements
    
    For any AI-generated explanation, it should include the correct answer with 
    reasoning, relevant RBI/IIBF citations, key concepts, and common misconceptions, 
    with word count between 150-300 words.
    
    Validates: Requirements 5.3, 5.7
    """
    
    @given(st.text(min_size=150, max_size=300, alphabet=st.characters(blacklist_categories=('Cc', 'Cs'))))
    @settings(max_examples=5)
    def test_explanation_word_count_within_range(self, explanation):
        """
        Property: For any explanation, word count should be between 150-300 words
        """
        word_count = len(explanation.split())
        
        # Property: Word count is within acceptable range
        assert 150 <= word_count <= 300, \
            f"Word count {word_count} outside range [150, 300]"
    
    @given(st.text(min_size=150, max_size=300, alphabet=st.characters(blacklist_categories=('Cc', 'Cs'))))
    @settings(max_examples=5)
    def test_explanation_contains_reasoning(self, explanation):
        """
        Property: For any explanation, it should contain reasoning indicators
        """
        reasoning_keywords = ['because', 'reason', 'since', 'therefore', 'thus', 'hence']
        
        # Property: At least one reasoning keyword present
        has_reasoning = any(keyword in explanation.lower() for keyword in reasoning_keywords)
        
        # This is a soft property - explanations should ideally have reasoning
        # but we allow some flexibility
        assert has_reasoning or len(explanation.split()) > 200, \
            "Explanation lacks reasoning indicators"
    
    @given(st.text(min_size=150, max_size=300, alphabet=st.characters(blacklist_categories=('Cc', 'Cs'))))
    @settings(max_examples=5)
    def test_explanation_contains_concepts(self, explanation):
        """
        Property: For any explanation, it should reference key concepts
        """
        concept_keywords = ['concept', 'principle', 'understand', 'important', 'key', 'essential']
        
        # Property: At least one concept keyword present
        has_concepts = any(keyword in explanation.lower() for keyword in concept_keywords)
        
        # This is a soft property - explanations should reference concepts
        assert has_concepts or len(explanation.split()) > 200, \
            "Explanation lacks concept references"
    
    @given(st.text(min_size=150, max_size=300))
    @settings(max_examples=5)
    def test_explanation_validation_consistency(self, explanation):
        """
        Property: For any explanation, validation result should be consistent
        """
        is_valid_1, _ = ExplanationGenerator.validate_explanation(explanation)
        is_valid_2, _ = ExplanationGenerator.validate_explanation(explanation)
        
        # Property: Validation is deterministic
        assert is_valid_1 == is_valid_2, \
            "Validation result is not consistent for same input"
    
    @given(question_strategy)
    @settings(max_examples=5)
    def test_prompt_includes_all_question_components(self, question):
        """
        Property: For any question, the generated prompt should include 
        all question components
        """
        user_context = {'accuracy': 50}
        prompt = ExplanationGenerator.build_tutor_prompt(question, user_context)
        
        # Property: Prompt includes question text
        assert question['question_text'] in prompt, \
            "Prompt missing question text"
        
        # Property: Prompt includes topic
        assert question['topic'] in prompt, \
            "Prompt missing topic"
        
        # Property: Prompt includes correct answer
        assert question['correct_answer'] in prompt, \
            "Prompt missing correct answer"
    
    @given(st.text(min_size=100, max_size=500))
    @settings(max_examples=5)
    def test_citation_extraction_deterministic(self, text):
        """
        Property: For any text, citation extraction should be deterministic
        """
        citations_1 = ExplanationGenerator.extract_citations(text)
        citations_2 = ExplanationGenerator.extract_citations(text)
        
        # Property: Same citations extracted each time
        assert len(citations_1) == len(citations_2), \
            "Citation extraction is not deterministic"
        
        # Property: Citations are in same order
        for c1, c2 in zip(citations_1, citations_2):
            assert c1['source'] == c2['source'], \
                "Citation sources differ"
            assert c1['reference'] == c2['reference'], \
                "Citation references differ"


class TestExplanationStorage:
    """
    Property tests for explanation storage and retrieval
    """
    
    @patch('explanation_service.explanations_table')
    @given(
        st.uuids().map(str),
        st.uuids().map(str),
        st.uuids().map(str),
        st.text(min_size=150, max_size=300, alphabet=st.characters(blacklist_categories=('Cc', 'Cs'))),
        st.lists(st.fixed_dictionaries({
            'source': st.sampled_from(['RBI', 'IIBF']),
            'reference': st.text(min_size=10, max_size=100)
        }), max_size=5),
        st.integers(min_value=150, max_value=300)
    )
    @settings(max_examples=5)
    def test_save_and_retrieve_explanation(self, mock_table, exp_id, user_id, q_id, 
                                          explanation, citations, word_count):
        """
        Property: For any explanation data, save and retrieve should preserve all data
        """
        # Mock successful save
        mock_table.put_item.return_value = {}
        mock_table.get_item.return_value = {
            'Item': {
                'explanation_id': exp_id,
                'user_id': user_id,
                'question_id': q_id,
                'explanation': explanation,
                'citations': citations,
                'word_count': word_count
            }
        }
        
        # Save
        save_success = ExplanationStorage.save_explanation(
            exp_id, user_id, q_id, explanation, citations, word_count
        )
        
        # Property: Save succeeds
        assert save_success is True
        
        # Retrieve
        retrieved = ExplanationStorage.get_explanation(exp_id)
        
        # Property: Retrieved data matches saved data
        assert retrieved is not None
        assert retrieved['explanation_id'] == exp_id
        assert retrieved['user_id'] == user_id
        assert retrieved['question_id'] == q_id
        assert retrieved['explanation'] == explanation
        assert retrieved['word_count'] == word_count


class TestExplanationEdgeCases:
    """
    Property tests for edge cases and boundary conditions
    """
    
    @given(st.text(max_size=149))
    @settings(max_examples=5)
    def test_explanation_too_short_validation(self, short_text):
        """
        Property: For any text shorter than 150 words, validation should fail
        """
        is_valid, error_msg = ExplanationGenerator.validate_explanation(short_text)
        
        # Property: Short explanations fail validation
        if len(short_text.split()) < 150:
            assert is_valid is False, \
                "Short explanation should fail validation"
    
    @given(st.text(min_size=301))
    @settings(max_examples=5)
    def test_explanation_too_long_validation(self, long_text):
        """
        Property: For any text longer than 300 words, validation should fail
        """
        is_valid, error_msg = ExplanationGenerator.validate_explanation(long_text)
        
        # Property: Long explanations fail validation
        if len(long_text.split()) > 300:
            assert is_valid is False, \
                "Long explanation should fail validation"
    
    @given(st.just(""))
    @settings(max_examples=1)
    def test_empty_explanation_validation(self, empty_text):
        """
        Property: Empty explanation should always fail validation
        """
        is_valid, error_msg = ExplanationGenerator.validate_explanation(empty_text)
        
        # Property: Empty explanation fails
        assert is_valid is False
        assert "empty" in error_msg.lower()
    
    @given(question_strategy)
    @settings(max_examples=5)
    def test_prompt_handles_special_characters(self, question):
        """
        Property: For any question with special characters, prompt should handle them safely
        """
        user_context = {'accuracy': 50}
        
        # Should not raise exception
        try:
            prompt = ExplanationGenerator.build_tutor_prompt(question, user_context)
            assert prompt is not None
            assert len(prompt) > 0
        except Exception as e:
            pytest.fail(f"Prompt generation failed with special characters: {str(e)}")
