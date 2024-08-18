type = """
scalar JSON
    enum Answer {
        A
        B
        C
        D
    }
    type Quiz {
        _id:ID
        "based on reading material use Unknow if you can't name it"
        title: String
        "questions from reading material"
        content: [Question!]!
    }
    "quiz question designed to test knowlage and understanding of reading material"
    type Question {
        id:ID!
        "text of question"
        text: String!
        "provied options a) for true or b) for false or 4 a) b) c) d) options"
        options: [Option!]!
    }                                                               
    type Option {
        key:Answer!
        "Option's text"
        text: String!
    }
    type CheckedOption {
        key:Answer!
        text:String!
        why:String!   
    }
    type checkedQuiz {
        id:ID!
        text:String!
        options:[CheckedOption]!
        answered:String!
        answer:String!
    }
    type finalOutputForQuiz {
        quiz:[checkedQuiz]!
        score:Int
    }
    input quizInput{
        text:String!
        title:String
        numberOFQuestions:Int = 10
    }
    input checkQuizInput {
        userID:ID!
    }

    input submitQuizInput {
        userID:ID!
        answers:JSON!
    }
    

"""
query = """
    "Quiz designed to test understanding of students for reading material"
    getQuiz(id:ID!):Quiz!
    "get all Quizes"
    getAllQuiz:[Quiz!]
    "returns quiz based on assigned userID"
    getQuizForUser(userID:ID!):Quiz
    "check answers and output report"
    checkQuiz(input:checkQuizInput!):finalOutputForQuiz
"""
mutation = """
    "creates new quiz"
    createQuiz(input:quizInput!):ID!
    "deletes quiz"
    deleteQuiz(id:ID!):Boolean!
    "submit quiz"
    submitQuiz(input:submitQuizInput!):Boolean!
"""
openAi = {
    "type":type,
    "query":query,
    "mutation":mutation
}