type = """
type Users {
    _id:ID!
    name:String
    score:Int
    end_date:String
}
"gets all users for a quiz"
type usersForQuiz {
    success:Boolean!
    errors:[String]
    users:[Users]!
}
input UserInfo {
    "Random Generated User Id"
    _id:ID!
    "User Name For Quiz"
    name:String!
    "Quiz ID assigned to user"
    quizID:ID!
}
input AssignUsersInput {
    users:[UserInfo!]!
}
"""
query = """
    "gets all users for specific quiz"
    getAllUsersForQuiz(quiz:ID):usersForQuiz
"""
mutation = """
    "Assignes quizes to users"
    assignQuizToUsers(input:AssignUsersInput!):Boolean!
"""
quizUsers = {
    "type":type,
    "query":query,
    "mutation":mutation
}