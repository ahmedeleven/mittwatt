def preprocess_data(data):
    try:
        data = data.dropna()  # Drop missing values
        # Convert categorical columns using pd.get_dummies() if needed
        # data = pd.get_dummies(data, columns=['categorical_column'])
        print('Data was processed')
        return data
    except Exception as e:
        print(f'Exception occured - {e}')

# if __name__ == "__main__":
