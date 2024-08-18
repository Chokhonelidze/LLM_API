import os
from flask import Flask
from flask_cors import CORS,cross_origin
from bson import json_util

from flask_migrate import Migrate

from flask_pymongo import PyMongo


app = Flask(__name__)

app.config['MONGO_URI']=os.environ['DB_CONNECTION_STRING']
app.config['FLASK_DEBUG'] = os.environ.get('FLASK_DEBUG');
app.config['SECRET_KEY'] = os.urandom(24)
mongo = PyMongo(app)
migrate = Migrate(app,mongo,compare_type=True,include_schemas=True)

basedir = os.path.abspath(os.path.dirname(__file__))
CORS(app,origins=["http://209.122.34.37:3000/","http://209.122.34.37:3000","http://localhost:3000/","http://myhome.smho.site:3000/","localhost:3000","http://localhost:3000","https://chokhonelidze.github.io"])
