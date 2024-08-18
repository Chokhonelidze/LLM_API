from openai import AzureOpenAI
import json,os,datetime
from ariadne import convert_kwargs_to_snake_case
from api import mongo
from api.models import Quiz,QuizUsers
from bson.objectid import ObjectId


@convert_kwargs_to_snake_case
def createQuiz(obj,info,input):
    try:
        client = AzureOpenAI(
                    azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
                    api_key=os.environ["AZURE_OPENAI_KEY"],
                    api_version=os.environ["AZURE_OPENAI_APIVERSION"]
                )
        questionCount = input.get('number_of_questions') or 10
        CHATGPT_MODEL = os.environ["CHATGPT_MODEL"]
        quiz_input=f"""
                    use graphql schema and based on provided ** Lesson Material ** build quiz with {questionCount} question use GRAPHQL schema 
                    type Quiz {{
                        "name of quiz based on reading material use Unknow if you can't name it"
                        title: String
                        "questions from reading material it can be for option question or true or falce question with only A True and B Falce options"
                        questions: [Question!]!
                    }}

                    "quiz question designed to test knowlage and understanding of reading material"
                    type Question {{
                        "numarate question for example 1,2,3,4 ... n" 
                        id:ID!
                        "text of question"
                        text: String!
                        "should provide 4 options A,B,C,D or A and B as true or falce there should be only one correct option"
                        options: [Option!]!
                        "correct ansower for question"
                        answer: Answer!
                    }}
                    type Option {{
                        key:Answer!
                        "Option's text"
                        text: String!
                        "explain why this option is true or false for specific question"
                        why:String!
                    }}
                    enum Answer {{
                        A
                        B
                        C
                        D
                    }}

                    type Query {{
                        "Quiz designed to test understanding of students for reading material"
                        quiz: Quiz!
                    }} 
                    OUTPUT JSON representing response from schema Quiz
                    """
        user_input = input.get('text')
        title = input.get('title')
        messages = [{"role":"user","content":user_input},{"role":"system","content":quiz_input}]
        response = client.chat.completions.create(
            messages = messages,
            model = CHATGPT_MODEL,
            temperature=0.8,
            top_p=0.4
        )
        data = [msg.message.content for msg in response.choices]
        js = json.loads(data[0])
        if not title:
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

@convert_kwargs_to_snake_case
def getAllQuiz(obj,info):
    data = mongo.db.Quiz.find()
    return data

@convert_kwargs_to_snake_case
def getQuizForUser(obj,info,user_id):
    data = None
    try:
        user_result = mongo.db.QuizUsers.find_one({"_id":user_id})
        quiz_id = user_result['quiz_id']
        data = mongo.db.Quiz.find_one_or_404({"_id":ObjectId(quiz_id)})

    except Exception as e:
        print(e)
    finally:
        return data

@convert_kwargs_to_snake_case
def checkQuiz(obj,info,input):
    try:
        user_id = input.get("user_id")
        user_result = mongo.db.QuizUsers.find_one({"_id":user_id})
        quiz_id = user_result['quiz_id']
        answers = user_result['answers']
        score = user_result['score']
        data = mongo.db.Quiz.find_one_or_404({"_id":ObjectId(quiz_id)})
        outputObj = []
     
        for quiz in data['content']:
            output = {}
            output['id'] = quiz['id']
            output['text'] = quiz['text']
            output['answer'] = quiz['answer']
            output['options'] = quiz['options']
            output['answered'] = answers[str(int(quiz['id'])-1)]
            outputObj.append(output)
        return {
            "quiz":outputObj,
            "score":score
        }

    except Exception as e :
        print("error",e,flush=True)

@convert_kwargs_to_snake_case
def submitQuiz(obj,info,input):
    try:
        user_id = input.get("user_id")
        answers = input.get("answers")
        user_result = mongo.db.QuizUsers.find_one({"_id":user_id})
        quiz_id = user_result['quiz_id']
        data = mongo.db.Quiz.find_one_or_404({"_id":ObjectId(quiz_id)})
        score_count = 0;
        for quiz in data['content']:
            question_id = quiz['id']
            if quiz['answer'] == answers[str(int(question_id)-1)]:
                score_count = score_count + 1
        final_score = int(100 * float(score_count) / float(len(data['content'])))
        newvalues = { "$set": { 'score':final_score,'answers':answers,'endDate':datetime.datetime.now(tz=datetime.timezone.utc)} }
        mongo.db.QuizUsers.update_one({"_id":user_id},newvalues)
        return True
                


    except Exception as e:
        print("error",e,flush=True)
        return False
    
queries = {
    "getQuiz":getQuiz,
    "getAllQuiz":getAllQuiz,
    "getQuizForUser":getQuizForUser,
    "checkQuiz":checkQuiz
}
mutations = {
     "createQuiz":createQuiz,
     "deleteQuiz":deleteQuiz,
     "submitQuiz":submitQuiz
} 
openAI_resolver = {
    "queries":queries,
    "mutations":mutations
}