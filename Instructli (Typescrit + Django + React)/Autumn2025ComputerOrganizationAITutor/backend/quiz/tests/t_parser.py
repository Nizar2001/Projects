"""Test script for the parser module.

This script tests the parser by loading questions from test_bank.json
and verifying that generate_question_instance works correctly for each question.

Usage:
    cd backend
    python -m quiz.tests.t_parser
    OR
    python quiz/tests/t_parser.py
"""

import json
import os
import sys
from types import SimpleNamespace

# Add the backend directory to the path so we can import quiz.services.parser
backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from quiz.services.parser import generate_question_instance


def load_test_bank():
    """Load questions from test_bank.json."""
    # Get the path to test_bank.json (in the quiz directory)
    current_dir = os.path.dirname(os.path.abspath(__file__))
    quiz_dir = os.path.dirname(current_dir) # go up from tests/ to quiz/
    test_bank_path = os.path.join(quiz_dir, 'test_bank.json')
    
    if not os.path.exists(test_bank_path):
        raise FileNotFoundError(f"Could not find test_bank.json at {test_bank_path}")
    
    with open(test_bank_path, 'r') as f:
        return json.load(f)


def test_parser_on_test_bank():
    """Test the parser on all questions in test_bank.json."""
    questions = load_test_bank()
    
    print(f"Testing parser on {len(questions)} questions from test_bank.json\n")
    print("=" * 80)
    
    passed = 0
    failed = 0
    
    for i, q_data in enumerate(questions, 1):
        print(f"\n[Question {i}/{len(questions)}]")
        print(f"Question String: {q_data['question_string']}")
        print(f"Answer Template: {q_data['answer']}")
        
        # Create a simple object with question_string and answer attributes
        question = SimpleNamespace(
            question_string=q_data['question_string'],
            answer=q_data['answer']
        )
        
        try:
            # Test the parser
            result = generate_question_instance(question)
            
            # Validate result structure
            assert 'question_text' in result, "Missing 'question_text' in result"
            assert 'answer_text' in result, "Missing 'answer_text' in result"
            assert 'variables' in result, "Missing 'variables' in result"
            assert isinstance(result['question_text'], str), "question_text must be a string"
            assert isinstance(result['answer_text'], str), "answer_text must be a string"
            assert isinstance(result['variables'], dict), "variables must be a dict"
            
            # Check that variables were generated (if question has generators)
            if '$' in q_data['question_string'] and '#' in q_data['question_string']:
                assert len(result['variables']) > 0, "Expected variables to be generated"
            
            # Check that question_text doesn't contain unresolved variables
            assert '$' not in result['question_text'] or '#random' not in result['question_text'], \
                f"Question text contains unresolved variables: {result['question_text']}"
            
            # Check that answer_text doesn't contain unresolved function calls
            assert not (result['answer_text'].startswith('#') and result['answer_text'].endswith('#')), \
                f"Answer text contains unresolved function calls: {result['answer_text']}"
            
            print(f"✓ PASSED")
            print(f"  Rendered Question: {result['question_text']}")
            print(f"  Rendered Answer: {result['answer_text']}")
            print(f"  Variables: {result['variables']}")
            
            passed += 1
            
        except Exception as e:
            print(f"✗ FAILED: {str(e)}")
            import traceback
            traceback.print_exc()
            failed += 1
    
    print("\n" + "=" * 80)
    print(f"\nTest Summary:")
    print(f"  Passed: {passed}/{len(questions)}")
    print(f"  Failed: {failed}/{len(questions)}")
    
    if failed == 0:
        print("\n✓ All tests passed!")
        return True
    else:
        print(f"\n✗ {failed} test(s) failed")
        return False


if __name__ == '__main__':
    success = test_parser_on_test_bank()
    exit(0 if success else 1)
