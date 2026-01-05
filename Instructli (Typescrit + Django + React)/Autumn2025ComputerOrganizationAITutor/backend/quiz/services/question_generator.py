"""
Question generator service for creating new quiz questions using OpenAI API.

This module provides functionality to generate new quiz questions based on
existing questions from test_bank.json using OpenAI's prompt-based generation.
"""

import json
import os
from types import SimpleNamespace
from typing import List, Dict, Any
import random

from chat.services.clients import openai
from quiz.services.parser import generate_question_instance


# Prompt IDs for question generation and verification
QUESTION_GENERATION_PROMPT_ID = "pmpt_690ce76611bc8196979ae7b15c3090910d65657bddfa0381"
QUESTION_VERIFICATION_PROMPT_ID = "pmpt_690ce933fa808190b1611dccdb8ed08804f75d55565174c6" 


def load_questions_from_test_bank(difficulty: str = None, limit: int = 5) -> List[Dict[str, Any]]:
    """
    Load questions from test_bank.json file with optional filtering.
    
    Args:
        difficulty: Optional difficulty filter ('easy', 'medium', 'hard')
        limit: Maximum number of questions to return (default 5)
    
    Returns:
        List of question dictionaries from test_bank.json
    """
    # Get the path to test_bank.json (in the quiz directory)
    current_dir = os.path.dirname(os.path.abspath(__file__))
    quiz_dir = os.path.dirname(current_dir)
    test_bank_path = os.path.join(quiz_dir, 'test_bank.json')
    
    if not os.path.exists(test_bank_path):
        raise FileNotFoundError(f"Could not find test_bank.json at {test_bank_path}")
    
    with open(test_bank_path, 'r') as f:
        questions = json.load(f)
    
    # Filter by difficulty if specified
    if difficulty:
        questions = [q for q in questions if q.get('difficulty', '').lower() == difficulty.lower()]
    
    # Randomly shuffle and return a subset
    random.shuffle(questions)
    return questions[:limit]

def parse_question_from_test_bank(question_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Parse a question from test_bank.json using the parser.
    
    Args:
        question_data: Dictionary from test_bank.json with question_string and answer
        
    Returns:
        Dictionary with parsed question_text and answer_text
    """
    question = SimpleNamespace(
        question_string=question_data['question_string'],
        answer=question_data['answer']
    )
    
    result = generate_question_instance(question)
    
    # Check if answer still contains unevaluated function calls (parser bug with nested patterns)
    answer_text = result['answer_text']
    print(answer_text)
    # if '(' in answer_text and ')' in answer_text:
    #     # Skip questions with complex nested function calls that parser can't handle
    #     raise ValueError(f"Answer contains unevaluated function calls: {answer_text}")
    
    return {
        'question_text': result['question_text'],
        'answer_text': result['answer_text'],
        'variables': result['variables'],
    }


def generate_and_verify_questions(parsed_question) -> List[Dict[str, Any]]:
    """
    Generate new quiz questions using OpenAI API and verify them.
    
    Process:
    1. Call generator prompt to generate questions (no "valid" key)
    2. Call verificator prompt to verify questions (adds "valid" key)
    3. Filter to return only questions with valid=True
    
    Args:
        parsed_question: The parsed question text to send to OpenAI generator
        
    Returns:
        List of valid generated questions (only questions with valid=True):
        [
            {
                "question": "...",
                "type": "multiple_choice" or "short_answer",
                "options": [...],  # Only present for type="multiple_choice"
                "answer": "...",
                "explanation": "..."
            },
            ...
        ]
    
    Raises:
        ValueError: If OpenAI response cannot be parsed
        Exception: If OpenAI API call fails
    """
    try:
        # Step 1: Call generator prompt to generate questions
        generator_prompt_variables = {
            "question": json.dumps(parsed_question)
        }
        
        generator_response = openai.responses.create(
            model="gpt-4.1-mini",
            prompt={
                "id": QUESTION_GENERATION_PROMPT_ID,
                "variables": generator_prompt_variables,
            },
        )
        
        # Extract and parse generator response
        generator_response_text = generator_response.output_text
        
        try:
            generated_questions = json.loads(generator_response_text)
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse generator response as JSON: {e}. Response: {generator_response_text}")
        
        # Validate that generator response is a list
        if not isinstance(generated_questions, list):
            raise ValueError(f"Expected list of questions from generator, got {type(generated_questions)}. Response: {generator_response_text}")
        
        # If no questions generated, return empty list
        if len(generated_questions) == 0:
            return []
        # Step 2: Call verificator prompt to verify questions
        verificator_prompt_variables = {
            "question": json.dumps(generated_questions)  # Pass generated questions as JSON string
        }
        
        verificator_response = openai.responses.create(
            model="gpt-4.1-mini",
            prompt={
                "id": QUESTION_VERIFICATION_PROMPT_ID,
                "variables": verificator_prompt_variables,
            },
        )
        
        # Extract and parse verificator response
        verificator_response_text = verificator_response.output_text
        verified_questions = json.loads(verificator_response_text)
        
        # Validate that verificator response is a list
        if not isinstance(verified_questions, list):
            raise ValueError(f"Expected list of questions from verificator, got {type(verified_questions)}. Response: {verificator_response_text}")
        
        # Step 3: Filter questions to only return valid ones (valid=True)
        valid_questions = []
        for question in verified_questions:
            if not isinstance(question, dict):
                continue
            
            # Check if question is valid
            if question.get("valid", False) is True:
                # Validate required fields
                if "question" not in question:
                    continue
                if "type" not in question:
                    continue
                if "answer" not in question:
                    continue
                
                
                # Validate multiple_choice has options
                if question["type"] == "multiple_choice":
                    if "options" not in question or not isinstance(question["options"], list):
                        continue
                
                # Remove the "valid" field before returning (not needed in response)
                # question.pop("valid", None)
                valid_questions.append(question)
        
        return valid_questions
        
    except Exception as e:
        # Re-raise with more context
        if isinstance(e, (ValueError, json.JSONDecodeError)):
            raise
        raise Exception(f"OpenAI API call failed: {str(e)}") from e


def generate_questions_from_test_bank(difficulty: str = None, use_ai: bool = True) -> List[Dict[str, Any]]:
    """Load questions from test_bank.json, parse them, and optionally verify with OpenAI.
    
    Args:
        difficulty: Optional difficulty filter ('easy', 'medium', 'hard')
        use_ai: If True, use OpenAI to generate/verify questions. If False, return parsed questions directly.
    
    Returns:
        List of valid quiz questions ready for the frontend
    """
    # Load questions from test_bank.json with difficulty filter
    limit = 5 if use_ai else 10  # More questions for non-AI quizzes due to lower reliability rate
    questions = load_questions_from_test_bank(difficulty=difficulty, limit=limit)
    # Parse each question to generate concrete instances
    parsed_question_list = []
    for question_data in questions:
        try:
            # Parse the question
            parsed = parse_question_from_test_bank(question_data)
            
            if use_ai:
                # For AI generation, use the old format
                parsed_question_list.append({
                    "questions_test": parsed["question_text"],
                    "answer_text": parsed["answer_text"]
                })
            else:
                # For non-AI, return parsed questions directly with all metadata
                parsed_question_list.append({
                    "question": parsed["question_text"],
                    "answer": parsed["answer_text"],
                    "type": question_data.get("type", "short_answer"),
                    "difficulty": question_data.get("difficulty", "easy"),
                    "tag": question_data.get("tag", [])
                })
        except Exception as e:
            # Log error but continue with other questions
            print(f"Error processing question: {str(e)}")
            continue
    
    if not use_ai:
        # Return parsed questions directly without AI processing
        return parsed_question_list
    
    # Generate and verify questions via OpenAI
    generated = generate_and_verify_questions(parsed_question_list)
    return generated
