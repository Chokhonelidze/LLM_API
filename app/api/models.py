import datetime
from bson.objectid import ObjectId


class Quiz:
    def __init__(self, title, content, date_posted=None, _id=None):
        self.title = title
        self.content = content
        self.date_posted = date_posted if date_posted else datetime.datetime.now(tz=datetime.timezone.utc).timestamp()
        self._id = _id if _id else ObjectId()
    def to_dict(self):
        return {
            "title": self.title,
            "content": self.content,
            "date_posted": self.date_posted,
            "_id": self._id
        }
    @staticmethod
    def from_dict(data):
        return Quiz(
            title=data.get('title'),
            content=data.get('content'),
            date_posted=data.get('date_posted'),
            _id=data.get('_id')
    )

    def __repr__(self):
        return f"Post('{self.title}', '{self.date_posted}')"
    

class QuizUsers:
    def __init__(self, quizID,name, answers=[], score=0, start_date=None,end_date=None, _id=None):
        self.quizID = quizID
        self.name = name
        self.answers = answers
        self.score = score
        self.start_date = start_date if start_date else datetime.datetime.now(tz=datetime.timezone.utc).timestamp()
        self.end_date = end_date if end_date else None
        self._id = _id if _id else ObjectId()
    def to_dict(self):
        return {
            "quizID": self.quizID,
            "name": self.name,
            "answers": self.answers,
            "score": self.score,
            "start_date":self.start_date,
            "end_date":self.end_date,
            "_id": self._id
        }
    @staticmethod
    def from_dict(data):
        return QuizUsers(
            quizID=data.get('quizID'),
            name=data.get('name'),
            answers=data.get('answers'),
            score=data.get('score'),
            start_date=data.get('start_date'),
            end_date=data.get('end_date'),
            _id=data.get('_id')
            )

    def __repr__(self):
        return f"Post('{self.QuizUsers}', '{self.start_date}')"