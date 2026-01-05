"""
This Python script processes a food-related survey dataset to train a machine learning model
(Logistic Regression) for classification tasks. It performs data cleaning, encodes categorical features,
splits the dataset, and evaluates the model's accuracy on unseen data.
"""
import re
import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder, MultiLabelBinarizer, OneHotEncoder
from sklearn.model_selection import train_test_split


file_name = "cleaned_data_combined.csv"
random_state = 42


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

    numbers = re.findall(r'\d+', value)
    if numbers:
        return int(numbers[0])


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
    if re.search(r'\b(water)\b[.,!]?', value):
        return "water"

    elif re.search(r'\b(colas?|cokes?|pops?|sodas?)\b[.,!]?', value):
        return "coke"
    elif re.search(r'\b(pepsis?)\b[.,!]?', value):
        return "pepsi"

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

            # Split multiple values by comma (if applicable)
            df[feature] = df[feature].apply(lambda x: x.split(","))

            # Use MultiLabelBinarizer to transform multi-valued categorical features
            mlb = MultiLabelBinarizer()
            encoded = mlb.fit_transform(df[feature])
            encoded_df = pd.DataFrame(encoded, columns=[f"{feature}_{cat}" for cat in mlb.classes_])

            # Merge the encoded features back to the dataframe and drop the original feature
            df = df.drop(columns=[feature]).join(encoded_df)

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

    # Convert the columns of df1 and df2 into sets to make it easier to compare and find differences
    df1_columns = set(df1)
    df1_columns.add("Label")

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


    df1_lst = df1.tolist()
    df1_lst.append("Label")


    # Reorder the columns of df2 to match the order of columns in df1
    df2 = df2[df1_lst].copy()

    return df2


def train_model(file_name: str) -> None:
    """
    Trains a Logistic Regression classifier on the provided dataset and evaluates its performance.

    This function reads a CSV file containing food-related survey data,
    selects specific features, cleans and encodes the data, trains a logistic regression model,
    evaluates it on training, validation, and test sets, and saves model parameters.

    Parameters
        file_name (str): The path to the CSV file name containing the training data.

    Returns:
        None
    """

    df = pd.read_csv(file_name)
    # Select a subset of features for the baseline model
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

    # Prepare the data for training
    df = df[selected_features + ["Label"]]

    # Replace any missing values with 0
    df = df.fillna(0)

    # Clean the data_set
    clean_data(df, selected_features)

    # Encode categorical features
    df = encode_features(df, selected_features)

    label_encoder = LabelEncoder()
    df["Label"] = label_encoder.fit_transform(df["Label"])

    # Shuffle the dataset
    df = df.sample(frac=1, random_state=random_state)

    # Define features and target
    X = df.drop(columns=["Label"])
    y = df["Label"]


    # Split dataset into training (60%), validation (20%), and testing (20%)
    X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.3, random_state=random_state)
    X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, random_state=random_state)

    # Initialize and train the logistic regression model
    model = LogisticRegression(solver='lbfgs', max_iter=500, random_state=random_state)
    model.fit(X_train, y_train)

    # Compute accuracy scores
    train_score = model.score(X_train, y_train)
    val_score = model.score(X_val, y_val)
    test_score = model.score(X_test, y_test)


    # Print performance metrics
    print(f"Training Accuracy: {train_score * 100:.2f}%")
    print(f"Validation Accuracy: {val_score * 100:.2f}%")
    print(f"Test Accuracy: {test_score * 100:.2f}%")


    # Load external test dataset
    df2 = pd.read_csv("Testing_data2.csv")


    df2 = df2[selected_features + ["Label"]]
    # Handle missing values
    df2 = df2.fillna(0)

    # Clean and encode the new dataset using the same process
    clean_data(df2, selected_features)
    # Encode categorical features
    df2 = encode_features(df2, selected_features)


    # Get expected feature names from trained model
    expected_features = model.feature_names_in_
    df1_columns = expected_features

    # Align the test dataset columns with the model's expected feature names
    df2 = align_columns(df1_columns, df2)



    # Encode the labels in the test set
    label_encoder = LabelEncoder()
    df2["Label"] = label_encoder.fit_transform(df2["Label"])

    # Define features and target
    X2 = df2.drop(columns=["Label"])
    y2 = df2["Label"]

    # Evaluate the model on the second test dataset
    test2_score = model.score(X2, y2)


    # Extract and save model parameters (weights, bias, feature names)
    weights = model.coef_  # # Model weights (coefficients)
    bias = model.intercept_  # Model intercept (bias term)
    expected_features = X.columns.tolist()  # Save column names in order

    params = {
        "weights": weights,
        "bias": bias,
        "expected_features": expected_features
    }

    # Save model parameters to a .npy file
    np.save("model_params.npy", params)


    # Report the accuracy on the second test set
    print(f"Test2 Accuracy: {test2_score * 100:.2f}%")



if __name__ == "__main__":
    train_model(file_name)