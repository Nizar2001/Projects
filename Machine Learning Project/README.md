# Food Preference Prediction Model

## Project Description
This project uses machine learning to classify food preferences food preferences (Pizza, Shawarma, Sushi) based on a set of questions asked from the user and make prediction whether their choice of food is pizza, shawarma or sushi. Initially, the model is trained using Decision Tree, K-Nearest-Model and Logistic regression to idenfity the model with highest valication and accuray rate. Then Logistic regression is chosen to make prediciton since it is the model with highest training, validation and test accuracy


## Technical Specifications
- Python 3.8+ required
- Dependencies: numpy, pandas, scikit-learn, re


## Dataset

The dataset used is `cleaned_data_combined.csv` and includes the following columns:

- **Q1**: From a scale 1 to 5, how complex is it to make this food? (Where 1 is the most simple, and 5 is the most complex)  
- **Q2**: How many ingredients would you expect this food item to contain?  
- **Q3**: In what setting would you expect this food to be served? (e.g., Week day lunch, Weekend dinner, At a party, etc.)  
- **Q4**: How much would you expect to pay for one serving of this food item?  
- **Q5**: What movie do you think of when thinking of this food item?  
- **Q6**: What drink would you pair with this food item?  
- **Q7**: When you think about this food item, who does it remind you of?  
- **Q8**: How much hot sauce would you add to this food item?  
- **Label**: The food preference — `Pizza`, `Sushi`, or `Shawarma` (target output)

Each row represents one survey response.

---

## Models Used

The following machine learning models are implemented using scikit-learn:

1. KNN.py - K-Nearest Neighbors classifier
2. decision_tree.py - Decision Tree classifier
3. logistic_regression.py - Logistic Regression classifier  


Models are trained on 70% of the data and validated on 15% of the data, while the remaining 15% is used for final testing. 
Accuracy scores are compared across different models, and the best-performing model (Logistic Regression) is used to make predictions.



## Model Performance
| Algorithm           | Train Accuracy | Validation Accuracy | Test Accuracy | 
|---------------------|----------------|---------------------|---------------|  
| KNN                 | 82.52%         | 62.20%              | 66.13%        |
| Decision Tree       | 82.66%         | 79.64%              | 80.24%        |
| Logistic Regression | 94.70%         | 84.62%              | 85.02%        |


## How to Use the Model

### 1. Train the Model

Run `logistic_regression.py` to train the model.

This will generate a file called `model_params.npy` which contains:
- The model weights
- The model bias
- The list of expected feature columns

These parameters will be used by the `predict.py` script.

---

### 2. Predict Using New Responses

To predict food preferences, use the `predict_all` function from `pred.py`.
Run `predict.py` to make predictions on new survey responses.

It contains a function `predict_all` that takes the path to a CSV file input (with responses to the 8 survey questions) and 
returns a list of predicted food preferences

Each item in the returned list corresponds to one row in the input file:
- The first prediction is for the first user response
- The second prediction is for the second response
- And so on

### Example Usage

```python
from predict import predict_all

predictions = predict_all("testing_data.csv")
print(predictions)
Output: ['Pizza', 'Pizza', 'Sushi', 'Pizza', ...]
 ```

## File Structure 

    ├── cleaned_data_combined.csv      # Dataset file (Used for Training)
    ├── Testing_data.csv               # External file used for Testing
    ├── Logistic_regression.py         # Main training script (best model)
    ├── Decision_trees.py              # Alternative model
    ├── KNN_model.py                   # Alternative model
    ├── predict.py                     # Script to make predictions using saved parameters
    ├── model_params.npy               # Saved logistic regression model parameters
    └── README.md                      # Documentation


## Liscence 
Personal Academic Project - All Rights Reserved.  
For usage permissions, contact: [nizar.shayan@mail.utoronto.ca]