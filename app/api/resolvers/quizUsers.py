from openai import AzureOpenAI
import json,os
from ariadne import convert_kwargs_to_snake_case
from api import mongo
from api.models import QuizUsers
from bson.objectid import ObjectId



@convert_kwargs_to_snake_case
def assignQuizToUsers(obj,info,input):
    success=True
    try:
        users = input.get('users')
        quiz_id = users[0]['quiz_id']
        mongo.db.QuizUsers.delete_many({"quizID":quiz_id})
        users = [QuizUsers(quizID=user['quiz_id'],_id=user['_id'],name=user['name']).to_dict() for user in users]
        insertId = mongo.db.QuizUsers.insert_many(users).inserted_ids
        print(insertId)
    except Exception as e:
        success = False
        print("Error=",e,flush=True)
    finally:
        return success 
    

@convert_kwargs_to_snake_case
def getAllUsersForQuiz(obj,info,quiz):
    try:
        users = mongo.db.QuizUsers.find()
        payload = {
            "success":True,
            "users":users
        }
    except Exception as e:
        users = []
        print("Error=",e,flush=True)
        payload = {
            "success":False,
            "errors":[e]
        }
    finally:
        return payload




queries = { 
"getAllUsersForQuiz":getAllUsersForQuiz
}
mutations = {
"assignQuizToUsers":assignQuizToUsers
} 
quiz_users_resolver = {
    "queries":queries,
    "mutations":mutations
}