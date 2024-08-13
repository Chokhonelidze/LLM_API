import os
from flask import Flask
from flask_cors import CORS,cross_origin
from bson import json_util

from flask_migrate import Migrate

from flask_pymongo import PyMongo


app = Flask(__name__)
CORS(app,resources={r"/graphql/": {"origins": ["localhost:3000","http://localhost:3000"]}})
app.config['MONGO_URI']=os.environ['DB_CONNECTION_STRING']
app.config['FLASK_DEBUG'] = os.environ.get('FLASK_DEBUG');
app.config['SECRET_KEY'] = os.urandom(24)
mongo = PyMongo(app)
migrate = Migrate(app,mongo,compare_type=True,include_schemas=True)

basedir = os.path.abspath(os.path.dirname(__file__))
