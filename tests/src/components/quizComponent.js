import React, { useEffect, useState } from "react";
import { graphql } from "../functions/graphql";
import { Link } from "react-router-dom";

export default function QuizComponent({ data,userId}) {
  const [currentQuestion, setQuestionCount] = useState(0);
  const [answers, setAnswers] = useState({});
  const [question, setQuestion] = useState(data[0].text);
  const [options, setOptions] = useState(data[0].options);
  const [enableSubmit,setEnableSubbmit] = useState(false);
  const [submitted,setSubmitted] = useState(false);

  const changeQuestion= (newPage) =>{
    if(newPage < data.length) {
        setQuestion(data[newPage].text);
        setOptions(data[newPage].options);
        setQuestionCount(newPage);
    }
    else {
      setEnableSubbmit(true);
    }
  } 
  const submit =async () =>{
    const q = `
    mutation SubmitQuiz($input: submitQuizInput!) {
      submitQuiz(input: $input)
    }
    `;
    await graphql(q,{input:{userID:userId,answers:answers}},null,(response)=>{
      if(response?.submitQuiz){
        setSubmitted(true);
      }

    });
  }
  const selectAnswer = (answer) => {
    const temp = { ...answers };
    temp[currentQuestion] = answer;
    setAnswers(temp);
    changeQuestion(currentQuestion+1);
  };
  const Options = options?.map((item, index) => {
    if (answers[currentQuestion] === item.key) {
      return (
        <li
          className="list-group-item active"
          key={"option_" + index}
          style={{ cursor: "pointer" }}
        >
          {item.text}
        </li>
      );
    } else {
      return (
        <li
          className="list-group-item "
          key={"option_" + index}
          onClick={() => {
            selectAnswer(item.key);
          }}
          style={{ cursor: "pointer" }}
        >
          {item.text}
        </li>
      );
    }
  });

  return (submitted? <div className="container">
    <div className="row"></div>
    <div className="row"></div>
    <div className="row">
      <div className="col-3"></div>
      <div className="col-6">
      <div className="alert alert-success" role="alert">
        <h4 className="alert-heading">Congratulations!</h4>
      <p>You've successfully submitted the quiz.</p>
      <hr/>
      <p className="mb-0">Check your results: <Link to={"/checkResults/"+userId}>click here to see scores</Link></p>
    </div>
      </div>
      <div className="col-3"></div>

    </div>

  </div>:
    <div className="container">
      <div className="row my-4"></div>
      <div className="row my-2">
        <div className="col-3"></div>
        <div className="col-6">{question}</div>
        <div className="col-3"></div>
      </div>
      <div className="row my-2">
        <div className="col-3"></div>
        <div className="col-6">
          <ul className="list-group">{Options}</ul>
        </div>
        <div className="col-3"></div>
      </div>
      {enableSubmit?
      <div className="row my-2">
        <div className="col-4"></div>
        <div className="col-4"><button className="btn btn-primary" onClick={async ()=>{await submit()}} >Submit Quiz</button></div>
        <div className="col-4"></div>
      </div>:""}
    </div>
  );
}
