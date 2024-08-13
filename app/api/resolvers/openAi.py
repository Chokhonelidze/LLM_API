from openai import AzureOpenAI
import json,os
from ariadne import convert_kwargs_to_snake_case
from api import mongo
from api.models import Quiz
from bson.objectid import ObjectId


@convert_kwargs_to_snake_case
def createQuiz(obj,info,input):
    try:
        client = AzureOpenAI(
                    azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
                    api_key=os.environ["AZURE_OPENAI_KEY"],
                    api_version=os.environ["AZURE_OPENAI_APIVERSION"]
                )
        CHATGPT_MODEL = os.environ["CHATGPT_MODEL"]
        quiz_input="""
                    use graphql schema and based on provided ** Lesson Material ** build quiz with 10 question use GRAPHQL schema 
                    type Quiz {
                        "name of quiz based on reading material use Unknow if you can't name it"
                        title: String
                        "questions from reading material"
                        questions: [Question!]!
                    }

                    "quiz question designed to test knowlage and understanding of reading material"
                    type Question {
                        "text of question"
                        text: String!
                        "should provide 4 options A,B,C,D or A and B as true or falce there should be only one correct option"
                        options: [Option!]!
                        "correct ansower for question"
                        answer: Answer!
                    }
                    type Option {
                        key:Answer!
                        "Option's text"
                        text: String!
                        "explain why this option is true or false for specific question"
                        why:String!
                    }
                    enum Answer {
                        A
                        B
                        C
                        D
                    }

                    type Query {
                        "Quiz designed to test understanding of students for reading material"
                        quiz: Quiz!
                    } 
                    OUTPUT JSON representing response from schema Quiz
                    """
        user_input = input.get('text')
        messages = [{"role":"user","content":user_input},{"role":"system","content":quiz_input}]
        response = client.chat.completions.create(
            messages = messages,
            model = CHATGPT_MODEL,
            temperature=0.8,
            top_p=0.4
        )
        data = [msg.message.content for msg in response.choices]
        js = json.loads(data[0])
        title = js['data']['quiz']['title']
        questions = js['data']['quiz']['questions'] 
        obj = Quiz(title=title,content=questions)
        id = mongo.db.Quiz.insert_one(obj.to_dict()).inserted_id
    except Exception as e:
        print(e)
    finally:
        return id

@convert_kwargs_to_snake_case
def deleteQuiz(obj,info,id):
    mongo.db.Quiz.delete_one({"_id":ObjectId(id)})
    return True


@convert_kwargs_to_snake_case
def getQuiz(obj,info,id):
    data = mongo.db.Quiz.find_one_or_404({"_id":ObjectId(id)})
    return data

def getAllQuiz(obj,info):
    data = mongo.db.Quiz.find()
    return data


queries = {
    "getQuiz":getQuiz,
    "getAllQuiz":getAllQuiz
}
mutations = {
     "createQuiz":createQuiz,
     "deleteQuiz":deleteQuiz
} 
openAI_resolver = {
    "queries":queries,
    "mutations":mutations
}