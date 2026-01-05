# Quiz API Frontend Examples

This document provides examples of how to call the Quiz API endpoints from the frontend using axios.

## Setup

The frontend uses an axios instance configured in `frontend/src/utils/api.ts` that automatically handles authentication tokens.

```typescript
import api from '@/utils/api'; // or your path to api.ts
```

---

## GET Requests

### 1. List All Questions (with query parameters)

```typescript
// Basic - get all published questions
const getQuestions = async () => {
  try {
    const response = await api.get('/api/quiz/questions/');
    console.log(response.data); // Array of questions or paginated results
    return response.data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};

// With filtering query parameters
    const getFilteredQuestions = async () => {
    try {
        const response = await api.get('/api/quiz/questions/', {
        params: {
            difficulty: 'easy',           // Filter by difficulty
            type: 'short_answer',          // Filter by type
            is_published: true,            // Filter by published status (admin only)
            search: 'binary',              // Search in question_string and tags
            ordering: '-created_at'        // Order by created_at descending
        }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching filtered questions:', error);
        throw error;
    }
    };

// Example usage
getFilteredQuestions();
```

### 2. Get Single Question by ID

```typescript
const getQuestionById = async (questionId: number) => {
  try {
    const response = await api.get(`/api/quiz/questions/${questionId}/`);
    console.log(response.data); // Single question object
    return response.data;
  } catch (error) {
    console.error('Error fetching question:', error);
    throw error;
  }
};

// Example usage
getQuestionById(1);
```

### 3. Get Random Questions (with query parameters)

```typescript
const getRandomQuestions = async () => {
  try {
    const response = await api.get('/api/quiz/random/', {
      params: {
        difficulty: 'easy',        // Optional: filter by difficulty
        type: 'short_answer',      // Optional: filter by type
        limit: 5,                  // Optional: number of questions (default: 10)
        render: 'true'             // Optional: get rendered questions
      }
    });
    console.log(response.data); // Array of random questions
    return response.data;
  } catch (error) {
    console.error('Error fetching random questions:', error);
    throw error;
  }
};

// Example usage
getRandomQuestions();
```

### 4. Get Quiz Statistics

```typescript
const getQuizStats = async () => {
  try {
    const response = await api.get('/api/quiz/stats/');
    console.log(response.data);
    // Response structure:
    // {
    //   total_questions: 15,
    //   published_questions: 15,
    //   unpublished_questions: 0,
    //   by_difficulty: { easy: 10, medium: 5, hard: 0 },
    //   by_type: { multiple_choice: 0, short_answer: 15, ... }
    // }
    return response.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

// Example usage
getQuizStats();
```

### 5. Get Available Tags

```typescript
const getTags = async () => {
  try {
    const response = await api.get('/api/quiz/tags/');
    console.log(response.data);
    // Response structure:
    // [
    //   { tag: 'arithmetic', question_count: 5, published_count: 5 },
    //   { tag: 'numeric representation', question_count: 3, published_count: 3 },
    //   ...
    // ]
    return response.data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
};

// Example usage
getTags();
```

---

## POST Requests

### 1. Create a New Question

```typescript
const createQuestion = async () => {
  try {
    const questionData = {
      question_string: 'What is 2 + 2?',
      type: 'short_answer',
      answer: '4',
      tag: ['math', 'arithmetic'],
      difficulty: 'easy',
      is_published: false
    };

    const response = await api.post('/api/quiz/questions/', questionData);
    console.log(response.data); // Created question object with ID
    return response.data;
  } catch (error) {
    console.error('Error creating question:', error);
    throw error;
  }
};

// Example usage
createQuestion();
```

### 2. Create a Multiple Choice Question

```typescript
const createMultipleChoiceQuestion = async () => {
  try {
    const questionData = {
      question_string: 'What is the capital of France?',
      type: 'multiple_choice',
      answer: {
        options: ['London', 'Paris', 'Berlin', 'Madrid'],
        correct_answer: 'Paris'
      },
      tag: ['geography', 'capitals'],
      difficulty: 'easy',
      is_published: true
    };

    const response = await api.post('/api/quiz/questions/', questionData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating multiple choice question:', error);
    throw error;
  }
};

// Example usage
createMultipleChoiceQuestion();
```

### 3. Get Questions by Filter (POST endpoint)

```typescript
const getQuestionsByFilter = async () => {
  try {
    const filterData = {
      tags: ['arithmetic', 'numeric representation'],
      difficulty: ['easy', 'medium'],
      type: ['short_answer'],
      exclude_ids: [1, 2, 3],  // Exclude specific question IDs
      count: 5                 // Number of questions to return
    };

    const response = await api.post('/api/quiz/questions/by-filter/', filterData, {
      params: {
        render: 'true'  // Optional: get rendered questions
      }
    });
    console.log(response.data); // Array of filtered random questions
    return response.data;
  } catch (error) {
    console.error('Error fetching filtered questions:', error);
    throw error;
  }
};

// Example usage
getQuestionsByFilter();
```

---

## PUT Requests

### Update a Question (Full Update)

```typescript
const updateQuestion = async (questionId: number) => {
  try {
    const updatedData = {
      question_string: 'What is 3 + 3?',
      type: 'short_answer',
      answer: '6',
      tag: ['math', 'arithmetic'],
      difficulty: 'medium',
      is_published: true
    };

    const response = await api.put(`/api/quiz/questions/${questionId}/`, updatedData);
    console.log(response.data); // Updated question object
    return response.data;
  } catch (error) {
    console.error('Error updating question:', error);
    throw error;
  }
};

// Example usage
updateQuestion(1);
```

**Note:** PUT requires all fields. Use PATCH for partial updates.

---

## PATCH Requests

### 1. Partial Update of a Question

```typescript
const partialUpdateQuestion = async (questionId: number) => {
  try {
    // Only include fields you want to update
    const partialData = {
      difficulty: 'hard',
      is_published: true
    };

    const response = await api.patch(`/api/quiz/questions/${questionId}/`, partialData);
    console.log(response.data); // Updated question object
    return response.data;
  } catch (error) {
    console.error('Error partially updating question:', error);
    throw error;
  }
};

// Example usage
partialUpdateQuestion(1);
```

### 2. Toggle Publish Status (Admin Only)

```typescript
const togglePublishStatus = async (questionId: number) => {
  try {
    const response = await api.patch(`/api/quiz/questions/${questionId}/publish/`);
    console.log(response.data); // Question with toggled publish status
    return response.data;
  } catch (error) {
    console.error('Error toggling publish status:', error);
    throw error;
  }
};

// Example usage
togglePublishStatus(1);
```

---

## DELETE Requests

### Delete a Question

```typescript
const deleteQuestion = async (questionId: number) => {
  try {
    const response = await api.delete(`/api/quiz/questions/${questionId}/`);
    console.log(response.status); // 204 No Content on success
    return response.status;
  } catch (error) {
    console.error('Error deleting question:', error);
    throw error;
  }
};

// Example usage
deleteQuestion(1);
```

---

## Complete React Component Example

```typescript
import React, { useState, useEffect } from 'react';
import api from '@/utils/api';

const QuizComponent = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // GET: Fetch questions on component mount
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/quiz/questions/', {
          params: {
            difficulty: 'easy',
            is_published: true
          }
        });
        setQuestions(response.data.results || response.data);
      } catch (err) {
        setError('Failed to fetch questions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // POST: Create a new question
  const handleCreateQuestion = async () => {
    try {
      const newQuestion = {
        question_string: 'New question?',
        type: 'short_answer',
        answer: 'Answer',
        tag: ['test'],
        difficulty: 'easy',
        is_published: false
      };

      const response = await api.post('/api/quiz/questions/', newQuestion);
      setQuestions([...questions, response.data]);
      console.log('Question created:', response.data);
    } catch (err) {
      setError('Failed to create question');
      console.error(err);
    }
  };

  // PATCH: Update question
  const handleUpdateQuestion = async (questionId: number) => {
    try {
      const response = await api.patch(`/api/quiz/questions/${questionId}/`, {
        difficulty: 'medium'
      });
      setQuestions(questions.map(q => 
        q.id === questionId ? response.data : q
      ));
      console.log('Question updated:', response.data);
    } catch (err) {
      setError('Failed to update question');
      console.error(err);
    }
  };

  // DELETE: Delete question
  const handleDeleteQuestion = async (questionId: number) => {
    try {
      await api.delete(`/api/quiz/questions/${questionId}/`);
      setQuestions(questions.filter(q => q.id !== questionId));
      console.log('Question deleted');
    } catch (err) {
      setError('Failed to delete question');
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <button onClick={handleCreateQuestion}>Create Question</button>
      {questions.map(question => (
        <div key={question.id}>
          <h3>{question.question_string}</h3>
          <button onClick={() => handleUpdateQuestion(question.id)}>Update</button>
          <button onClick={() => handleDeleteQuestion(question.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default QuizComponent;
```

---

## Error Handling

All endpoints may return errors. Here's a common error handling pattern:

```typescript
const handleApiCall = async () => {
  try {
    const response = await api.get('/api/quiz/questions/');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Server responded with error status
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
      
      if (error.response.status === 401) {
        // Unauthorized - token might be expired
        console.error('Authentication failed');
      } else if (error.response.status === 403) {
        // Forbidden - user doesn't have permission
        console.error('Permission denied');
      } else if (error.response.status === 404) {
        // Not found
        console.error('Resource not found');
      } else if (error.response.status === 400) {
        // Bad request - validation error
        console.error('Validation errors:', error.response.data);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('No response received:', error.request);
    } else {
      // Error setting up request
      console.error('Error:', error.message);
    }
    throw error;
  }
};
```

---

## Summary

- **GET**: Use for retrieving data. Can include query parameters for filtering.
- **POST**: Use for creating new resources or complex filtering (like `/by-filter/`).
- **PUT**: Use for full updates (all fields required).
- **PATCH**: Use for partial updates (only send fields you want to change).
- **DELETE**: Use for deleting resources.

All requests automatically include authentication tokens via the axios interceptor in `api.ts`.


