from pymongo import MongoClient
import os

class Database:
    def __init__(self):
        self.client = MongoClient(os.getenv("MONGO_URI"))
        self.db = self.client.get_database(os.getenv("DB_NAME", "default"))

    def get_collection(self, collection_name):
        return self.db[collection_name]

db_instance = Database()
