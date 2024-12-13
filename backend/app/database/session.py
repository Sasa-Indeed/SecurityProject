from pymongo import MongoClient
import os

class Database:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Database, cls).__new__(cls)
            cls._instance.client = MongoClient(os.getenv("MONGO_URI"))
            cls._instance.db = cls._instance.client.get_database(os.getenv("DB_NAME", "default"))
        return cls._instance

    def get_collection(self, collection_name):
        return self.db[collection_name]

db_instance = Database()
