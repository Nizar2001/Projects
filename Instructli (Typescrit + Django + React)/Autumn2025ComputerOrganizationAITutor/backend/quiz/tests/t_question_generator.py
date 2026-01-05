"""
Test script for the question generator module.

This script tests the question generator by loading questions from test_bank.json
and verifying that the generator functions work correctly.

Usage:
    cd backend
    python quiz/tests/t_question_generator.py
"""

import json
import os
import sys
from types import SimpleNamespace

# Add the backend directory to the path first (before Django setup)
backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Set up Django environment (minimal setup for imports, no database needed)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'djangobackend.settings')
import django
django.setup()

from quiz.services.question_generator import (
    load_questions_from_test_bank,
    parse_question_from_test_bank,
    generate_and_verify_questions,
    generate_questions_from_test_bank
)


def test_load_questions_from_test_bank():
    """Test loading questions from test_bank.json."""
    print("Testing load_questions_from_test_bank()...")
    
    try:
        questions = load_questions_from_test_bank()
        
        assert isinstance(questions, list), "Should return a list"
        assert len(questions) > 0, "Should load at least one question"
        
        # Check structure of first question
        first_q = questions[0]
        assert "question_string" in first_q, "Question should have 'question_string'"
        assert "answer" in first_q, "Question should have 'answer'"
        assert "type" in first_q, "Question should have 'type'"
        
        print(f"✓ PASSED - Loaded {len(questions)} questions from test_bank.json")
        return True
        
    except Exception as e:
        print(f"✗ FAILED: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def test_parse_question_from_test_bank():
    """Test parsing questions from test_bank.json."""
    print("\nTesting parse_question_from_test_bank()...")
    
    try:
        questions = load_questions_from_test_bank()
        
        if len(questions) == 0:
            print("✗ FAILED: No questions to test")
            return False
        
        # Test parsing first question
        first_q = questions[0]
        parsed = parse_question_from_test_bank(first_q)
        
        # Validate parsed result structure
        assert "question_text" in parsed, "Should have 'question_text'"
        assert "answer_text" in parsed, "Should have 'answer_text'"
        assert "variables" in parsed, "Should have 'variables'"
        assert isinstance(parsed["question_text"], str), "question_text should be a string"
        assert isinstance(parsed["answer_text"], str), "answer_text should be a string"
        assert isinstance(parsed["variables"], dict), "variables should be a dict"
        
        # Check that variables were replaced (no $ symbols in question_text)
        assert "$" not in parsed["question_text"] or "#random" not in parsed["question_text"], \
            f"Question text should not contain unresolved variables: {parsed['question_text']}"
        
        print(f"✓ PASSED - Parsed question successfully")
        print(f"  Original: {first_q['question_string'][:50]}...")
        print(f"  Parsed: {parsed['question_text'][:50]}...")
        print(f"  Variables: {parsed['variables']}")
        
        return True
        
    except Exception as e:
        print(f"✗ FAILED: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def test_generate_and_verify_questions():
    """Test generating questions from OpenAI (requires API key)."""
    print("\nTesting generate_and_verify_questions()...")
    print("Note: This test requires OpenAI API key and will make API calls")
    
    try:
        # Load and parse a question first
        questions = load_questions_from_test_bank()
        if len(questions) == 0:
            print("✗ FAILED: No questions to test")
            return False
        
        # Parse first question
        parsed = parse_question_from_test_bank(questions[0])
        parsed_question_text = parsed['question_text']
        
        print(f"  Sending to OpenAI: {parsed_question_text[:80]}...")
        
        # Generate questions (this makes an API call)
        generated = generate_and_verify_questions(parsed_question_text)
        
        # Validate result
        assert isinstance(generated, list), "Should return a list"
        
        # Check structure of generated questions
        for i, q in enumerate(generated):
            assert isinstance(q, dict), f"Question {i} should be a dict"
            assert "question" in q, f"Question {i} should have 'question' field"
            assert "type" in q, f"Question {i} should have 'type' field"
            assert "answer" in q, f"Question {i} should have 'answer' field"
            assert "valid" not in q, "Valid field should be removed from response"
            
            if q["type"] == "multiple_choice":
                assert "options" in q, f"Multiple choice question {i} should have 'options'"
                assert isinstance(q["options"], list), f"Options should be a list"
        
        print(f"✓ PASSED - Generated {len(generated)} valid questions")
        for i, q in enumerate(generated[:3], 1):  # Show first 3
            print(f"  Question {i}: {q['question'][:60]}...")
        
        return True
        
    except Exception as e:
        print(f"✗ FAILED: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def test_generate_questions_from_test_bank():
    """Test the full pipeline: load, parse, generate (requires API key)."""
    print("\nTesting generate_questions_from_test_bank()...")
    print("Note: This test requires OpenAI API key and will make multiple API calls")
    print("      This may take a while and cost API credits...")
    
    try:
        # This makes API calls for all questions - might be slow/expensive
        all_questions = generate_questions_from_test_bank()
        
        assert isinstance(all_questions, list), "Should return a list"
        
        print(f"✓ PASSED - Generated {len(all_questions)} total valid questions from all test_bank questions")
        
        if len(all_questions) > 0:
            print("\nSample generated questions:")
            for i, q in enumerate(all_questions[:5], 1):  # Show first 5
                print(f"\n  {i}. Type: {q.get('type', 'unknown')}")
                print(f"     Question: {q.get('question', 'N/A')[:80]}...")
                print(f"     Answer: {q.get('answer', 'N/A')[:60]}...")
        
        return True
        
    except Exception as e:
        print(f"✗ FAILED: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def run_all_tests():
    """Run all tests."""
    print("=" * 80)
    print("Testing question_generator.py with test_bank.json")
    print("=" * 80)
    
    results = []
    
    # Test 1: Load questions
    results.append(("Load Questions", test_load_questions_from_test_bank()))
    
    # Test 2: Parse questions
    results.append(("Parse Questions", test_parse_question_from_test_bank()))
    
    # Test 3: Generate questions (requires API)
    print("\n" + "=" * 80)
    print("API Tests (require OpenAI API key)")
    print("=" * 80)
    
    user_input = input("\nDo you want to run API tests? This will make OpenAI API calls. (y/n): ")
    if user_input.lower() == 'y':
        results.append(("Generate & Verify", test_generate_and_verify_questions()))
        
        user_input2 = input("\nDo you want to test full pipeline (all questions)? This may be slow/expensive. (y/n): ")
        if user_input2.lower() == 'y':
            results.append(("Full Pipeline", test_generate_questions_from_test_bank()))
        else:
            results.append(("Full Pipeline", None))  # Skipped
    else:
        results.append(("Generate & Verify", None))  # Skipped
        results.append(("Full Pipeline", None))  # Skipped
    
    # Summary
    print("\n" + "=" * 80)
    print("Test Summary:")
    print("=" * 80)
    
    passed = sum(1 for _, result in results if result is True)
    failed = sum(1 for _, result in results if result is False)
    skipped = sum(1 for _, result in results if result is None)
    
    for test_name, result in results:
        if result is True:
            print(f"  ✓ {test_name}: PASSED")
        elif result is False:
            print(f"  ✗ {test_name}: FAILED")
        else:
            print(f"  - {test_name}: SKIPPED")
    
    print(f"\nTotal: {passed} passed, {failed} failed, {skipped} skipped")
    
    if failed == 0:
        print("\n✓ All tests passed!")
        return True
    else:
        print(f"\n✗ {failed} test(s) failed")
        return False


if __name__ == '__main__':
    success = run_all_tests()
    exit(0 if success else 1)

