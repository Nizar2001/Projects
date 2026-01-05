"""
This Python file trains a model using K Nearest Neighbour and measures
the accuracy of the trained model on unseen data.
"""
import re
import pandas as pd
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import LabelEncoder
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




def train_model(file_name: str, k: int)-> None:
    """
    Loads a dataset from a CSV file, cleans and encodes the data, splits it into training,
    validation, and test sets, then trains a K-Nearest Neighbors (kNN) classifier using the
    specified number of neighbors (k). Finally, it evaluates and prints the model’s accuracy
    on all three data subsets.

    Parameters:
        file_name (str): Path to the CSV file containing the dataset. The file must include
                         the selected question-based feature columns and a "Label" column.
        k (int): The number of neighbors to use for the kNN classifier.

    Steps performed:
        1. Reads data from the specified CSV file into a DataFrame.
        2. Selects a subset of survey-based features and the label column.
        3. Replaces missing values with 0.
        4. Cleans the dataset using `clean_data` function.
        5. Encodes string-based categorical features using Label Encoding.
        6. One-hot encodes the "Label" column into binary columns.
        7. Shuffles the dataset randomly for unbiased training.
        8. Splits the data into training (70%), validation (15%), and test (15%) sets.
        9. Trains a kNN model with `k` neighbors on the training data.
        10. Evaluates and prints training, validation, and test accuracy.

    Output:
        None. Results are printed to the console.
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
        "Q8: How much hot sauce would you add to this food item?"]

    # Prepare the data for training
    df = df[selected_features + ["Label"]]
    # Handle missing values
    df = df.fillna(0)
    # Encode categorical features (if necessary)

    clean_data(df, selected_features)



    for col in selected_features:
        if df[col].dtype == 'object':
            df[col] = LabelEncoder().fit_transform(df[col].astype(str))

    # Convert categorical labels to numerical values
    df = pd.get_dummies(df, columns=["Label"], prefix="Label")



    # Shuffle the dataset
    df = df.sample(frac=1, random_state=random_state)
    x = df.drop(columns=[col for col in df.columns if col.startswith("Label_")]).values
    y = df[[col for col in df.columns if col.startswith("Label_")]].values

    # Train-test split

    n_train = int(0.7 * len(df))
    n_val = int(0.15 * len(df))

    # Splitting the data
    x_train = x[:n_train]
    y_train = y[:n_train]
    x_val = x[n_train:n_train + n_val]
    y_val = y[n_train:n_train + n_val]
    x_test = x[n_train + n_val:]
    y_test = y[n_train + n_val:]

    # Train and evaluate a kNN classifier
    clf = KNeighborsClassifier(n_neighbors=k)
    clf.fit(x_train, y_train)

    # Evaluate on training, validation, and test data
    train_acc = clf.score(x_train, y_train)
    val_acc = clf.score(x_val, y_val)
    test_acc = clf.score(x_test, y_test)

    print(f"{type(clf).__name__} train acc: {train_acc * 100:.2f}%")
    print(f"{type(clf).__name__} validation acc: {val_acc * 100:.2f}%")
    print(f"{type(clf).__name__} test acc: {test_acc * 100:.2f}%")

if __name__ == "__main__":
    train_model(file_name, 3)