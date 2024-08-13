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
        "text of question"
        text: String!
        "provied options a) for true or b) for false or 4 a) b) c) d) options"
        options: [Option!]!
        "correct ansower for question"
        answer: Answer!
    }                                                               
    type Option {
        key:Answer!
        "Option's text"
        text: String!
        "explain why the opti                                                               on is true or false"
        why:String
    }

    input quizInput{
        text:String!
    }
"""
query = """
    "Quiz designed to test understanding of students for reading material"
    getQuiz(id:ID!):Quiz!
    "get all Quizes"
    getAllQuiz:[Quiz!]
"""
mutation = """
    createQuiz(input:quizInput!):ID!
    deleteQuiz(id:ID!):Boolean!
"""
openAi = {
    "type":type,
    "query":query,
    "mutation":mutation
}