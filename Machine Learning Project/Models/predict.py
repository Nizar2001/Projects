"""
This script is designed to make predictions about food items based on user input data.

The main functionality of the script includes:
1. **Data Cleaning**: The script processes raw user input data to extract meaningful numeric values or standardized text.
It handles responses about the number of ingredients in a food item, the expected cost, and the preferred drink pairing.

2. **Feature Encoding**: Categorical features like the drink pairing or the setting in which the food is served are
encoded using techniques like one-hot and multi-hot encoding to prepare the data for machine learning models.

3. **Prediction**: Using a pre-trained machine learning model, the script predicts the type of food
(e.g., Pizza, Shawarma, or Sushi) based on the processed input data. It computes the class probabilities using a softmax
 function and selects the class with the highest probability.

The model parameters (weights, bias, and expected feature set) are loaded from a pre-trained model file
(`model_params.npy`), and predictions are made for a set of input data provided in a CSV file. The script outputs a
list of predicted labels for each input.

In summary, this script transforms raw user input, prepares it for prediction, and uses a trained machine learning model
 to predict the type of food item based on the provided features.
"""


import numpy as np
import pandas as pd



def clean_Q2_Q4(value: str) -> int:

    """
    Cleans user input by extracting a number from a string.

    Parameters:
        value (str): The input string, which may contain digits or words.

    Returns:
        int: A numeric representation of the input, based on the following logic:
            - If the value is a digit (like "5"), it converts it to an integer directly.

            - If the value is a string that contains digits (like "I like 2 and..."), it extracts the
             first number and returns it.

            - If no number is found, it falls back to counting the number of words in the input text
            (e.g., "cheese, flour, chicken" would return 3).
    """

    if value.isdigit():
        return int(value)


    num = ''
    for char in value:
        if char.isdigit():
            num += char
        elif num:
            break

    if num:
        return int(num)

    return len(value.split())

def clean_Q6(value: str) -> str:
    """
    Cleans user input by extracting a single word from a string.

    Parameters:
        value (str): The input string, which may contain words like: pop, soda, coke

    Returns:
        str: A standardized drink name:
            - Returns "water" if the input mentions water.
            - Returns "coke" if the input contains variations like "cola", "coke", "pop", or "soda".
            - Otherwise, returns the original input in lowercase.

    """
    value = str(value).lower()

    # Check for 'water' with possible punctuation
    if 'water' in value:
        return "water"

    # Check for cola, coke, pop, soda (with possible punctuation)
    cola_keywords = ['cola', 'coke', 'pop', 'soda']
    for keyword in cola_keywords:
        if keyword in value:
            return "coke"

    # Check for 'pepsi' with possible variations
    if 'pepsi' in value:
        return "pepsi"

    # If no match, return the original value
    return value


def clean_data(df: pd.DataFrame, selected_features: list) -> pd.DataFrame:
    """
    Cleans the data in a pandas DataFrame based on the selected features.

    This function applies specific cleaning operations to columns of the DataFrame
    depending on the features provided. The cleaning operations include:
    - For columns corresponding to "Q2: How many ingredients would you expect this food item to contain?"
      and "Q4: How much would you expect to pay for one serving of this food item?", it uses the
      `clean_Q2_Q4` function to extract or calculate a numeric value.
    - For the column "Q6: What drink would you pair with this food item?", it uses the `clean_Q6` function
      to standardize drink names based on the input.
    - For other columns, it converts all values to lowercase.

    Parameters:
        df (pandas.DataFrame): The DataFrame containing the data to be cleaned.
        selected_features (list): A list of column names in the DataFrame that need to be cleaned.

    Returns:
        pandas.DataFrame: The DataFrame with cleaned columns based on the selected features.
    """

    for feature in selected_features:
        if feature == 'Q2: How many ingredients would you expect this food item to contain?':

            df['Q2: How many ingredients would you expect this food item to contain?'] = (
                df['Q2: How many ingredients would you expect this food item to contain?'].apply(
                    lambda x: clean_Q2_Q4(str(x))))

        elif feature == "Q4: How much would you expect to pay for one serving of this food item?":
            df["Q4: How much would you expect to pay for one serving of this food item?"] = (
                df["Q4: How much would you expect to pay for one serving of this food item?"].apply(
                    lambda x: clean_Q2_Q4(str(x))))

        elif feature == "Q6: What drink would you pair with this food item?":
            # Clean the data of the feature named Q6
            df["Q6: What drink would you pair with this food item?"] = (
                df["Q6: What drink would you pair with this food item?"].apply(
                    lambda x: clean_Q6(str(x))))

        else:
            df[feature] = (df[feature].apply(lambda x: str(x).lower()))



def encode_features(df: pd.DataFrame, selected_features: list) -> pd.DataFrame:
    """
    Encodes categorical features for decision trees using one-hot and multi-hot encoding.

    This function processes categorical features from the dataset and applies encoding:
    - One-hot encoding is applied to single-value categorical features (Q5, Q6, Q8).
    - Multi-hot encoding is applied to multi-value categorical features (features with multiple possible values) like
      Q3 and Q7

    Parameters:
        df (pd.DataFrame): The DataFrame containing the features to be encoded.
        selected_features (list): A list of column names that need to be encoded in the DataFrame.

    Returns:
        pd.DataFrame: The DataFrame with encoded categorical features, with one-hot encoding applied to single-value
                      categorical features and multi-hot encoding applied to multi-value categorical features.
    """

    # One-Hot Encoding for Single-Value Categorical Features
    one_hot_features = [
        "Q5: What movie do you think of when thinking of this food item?",
        "Q6: What drink would you pair with this food item?",
        "Q8: How much hot sauce would you add to this food item?"
    ]

    # Select only the one-hot encoding features from the selected features
    selected_one_hot_features = []
    for feature in one_hot_features:
        if feature in selected_features:
            selected_one_hot_features.append(feature)

    # Apply One-Hot Encoding
    df = pd.get_dummies(df, columns=selected_one_hot_features)

    # Define the list of categorical features for multi-hot encoding (features with multiple values)
    multi_value_features = [
        "Q3: In what setting would you expect this food to be served? Please check all that apply",
        "Q7: When you think about this food item, who does it remind you of?"
    ]

    # Apply Multi-Hot Encoding
    for feature in multi_value_features:
        if feature in selected_features:
            # Split the feature's values by comma and strip any whitespace
            df[feature] = df[feature].apply(lambda x: x.split(",") if isinstance(x, str) else [])

            # Get all unique categories (flat set of all values in the feature column)
            all_categories = set([category for sublist in df[feature] for category in sublist])

            # Create binary columns for each category
            for category in all_categories:
                df[f"{feature}_{category}"] = df[feature].apply(lambda x: 1 if category in x else 0)

            # Drop the original multi-value column
            df = df.drop(columns=[feature])

    return df




def align_columns(df1: pd.DataFrame, df2: pd.DataFrame)-> pd.DataFrame:
    """
    Ensures df2 has the same columns as df1 by adding missing columns, removing extra ones,
    and maintaining the same column order.

    Parameters:
        df1 (pd.DataFrame): The reference DataFrame with the desired columns.
        df2 (pd.DataFrame): The DataFrame whose columns are to be aligned with df1.

    Returns:
        pd.DataFrame: A DataFrame with columns aligned to match df1. Missing columns are added with default values
                      (0), and extra columns are removed. The column order will be the same as in df1.
    """

    df1_columns = set(df1)

    df2_columns = set(df2.columns)

    # Find columns that are present in df1 but missing in df2
    missing_cols = list(df1_columns - df2_columns)


    # If there are missing columns in df2, add them with a default value (0) to match df1's structure
    if missing_cols:
        df2 = pd.concat([df2, pd.DataFrame(0, index=df2.index, columns=missing_cols)], axis=1)

    # Find columns that are present in df2 but not in df1 (extra columns)
    extra_cols = list(df2_columns - df1_columns)

    # If there are extra columns in df2, remove them to match the columns in df1
    if extra_cols:
        df2 = df2.drop(columns=extra_cols)

    df1_lst = df1

    # Reorder the columns of df2 to match the order of columns in df1
    df2 = df2[df1_lst].copy()

    return df2


def predict(df2: pd.DataFrame, num_to_target: dict[int, str],
            weights: np.ndarray, bias: np.ndarray, i: int) -> str:
    """
    Predict the label for a single input example using a softmax-based linear classifier.

    Parameters:
        df2 (pd.DataFrame): The DataFrame containing encoded feature values for each input example.
        num_to_target (dict[int, str]): A mapping from numerical class indices back to string labels.
        weights (np.ndarray): Weight matrix of shape (n_classes, n_features) used for computing class scores.
        bias (np.ndarray): Bias vector of shape (n_classes,) added to the logits.
        i (int): The index of the input example in df2 to be predicted.

    Returns:
        str: The predicted class label (e.g., "Pizza", "Shawarma", or "Sushi").

    Notes:
        - This function assumes that all features are already encoded as integers.
        - It applies the softmax function to compute class probabilities and returns the label with the highest score.
    """

    # Extract the feature values for the i-th sample from the DataFrame
    X_values = df2.iloc[i].values  # Convert to NumPy array

    # Ensure all values are integers (Not Boolean)
    X_values = X_values.astype(int)

    # Compute the raw scores (logits) for each class using the linear model
    logits = np.dot(weights, X_values) + bias  # Shape: (n_classes,)

    # Apply softmax with numerical stability: subtract max to avoid overflow
    exp_logits = np.exp(logits - np.max(logits))

    # Normalize to convert logits into probabilities
    probabilities = exp_logits / np.sum(exp_logits)

    # Select the index of the class with the highest probability
    predicted_class_index = np.argmax(probabilities)

    # Convert the predicted index back to the corresponding class label
    return num_to_target[predicted_class_index]



def predict_all(filename: str)-> list[str]:
    """
    Makes predictions for the data in the specified file.

    Parameters:
        filename (str): Path to the CSV file containing test data.

    Returns:
        list: A list of predicted labels for the given data.
    """

    selected_features = [
        "Q1: From a scale 1 to 5, how complex is it to make this food? (Where 1 is the most simple, and 5 is the most complex)",
        "Q2: How many ingredients would you expect this food item to contain?",
        "Q3: In what setting would you expect this food to be served? Please check all that apply",
        "Q4: How much would you expect to pay for one serving of this food item?",
        "Q6: What drink would you pair with this food item?",
        "Q7: When you think about this food item, who does it remind you of?",
        "Q8: How much hot sauce would you add to this food item?",
        "Q5: What movie do you think of when thinking of this food item?"
    ]

    # Load test data from the provided file
    df2 = pd.read_csv(filename)

    # Prepare the data for training
    df2 = df2[selected_features]
    # Handle missing values
    df2 = df2.fillna(0)


    # Clean the data_set
    clean_data(df2, selected_features)

    # Encode categorical features
    df2 = encode_features(df2, selected_features)

    # Load trained model parameters
    parameters = np.load("model_params.npy", allow_pickle=True).item()

    expected_features = parameters["expected_features"]  # Get feature names from trained model
    df1_columns = expected_features

    # Align the columns with the expected feature set from the trained model
    df2 = align_columns(df1_columns, df2)


    # Define target label mappings
    num_to_target = {0 : "Pizza", 1: "Shawarma", 2: "Sushi"}


    # Extract model weights and biases
    weights = parameters["weights"]  # Shape: (n_classes, n_features)
    bias = parameters["bias"]  # Shape: (n_classes,)

    total_data_points = df2.shape[0]



    # Make predictions for all data points in the test set
    result = []
    for i in range(total_data_points):
         result.append(predict(df2,  num_to_target, weights, bias, i))

    return result

if __name__ == "__main__":
    print(predict_all("Testing_data.csv"))
