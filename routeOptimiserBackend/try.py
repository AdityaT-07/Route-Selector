import pickle

file_path = './data/processed/transport_graph.pkl' # Replace with your file's actual path

try:
    with open(file_path, 'rb') as file:
        data = pickle.load(file)
    
    # Now you can work with the 'data' object
    print(data) 

except Exception as e:
    print(f"An error occurred: {e}")