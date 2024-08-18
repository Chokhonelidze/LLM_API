import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { graphql } from "../functions/graphql";

export default function CheckScore() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    const q = `
        query CheckQuiz($input: checkQuizInput!) {
        checkQuiz(input: $input) {
            quiz {
            id
            text
            options {
                key
                text
                why
            }
            answered
            answer
            }
            score
        }
        }
        `;
    await graphql(q, { input: { userID: id } }, null, (results) => {
      if (results?.checkQuiz) {
        setData(results?.checkQuiz?.quiz);
        setScore(results?.checkQuiz?.score);
      }
    });
    setLoading(false);
  };
  useEffect(() => {
    if (id) {
      load();
    }
  }, [id]);

  const Questions = data?.map((mitem, index) => {
    const Options = mitem?.options?.map((item, index) => {
          let className = "";
          let wrongClass ="";
          if(item.key === mitem.answer) {
            className = "text-primary";
          }
          if(mitem.answer !== mitem.answered && item.key === mitem.answered){
            wrongClass="text-warning"
          }
          return (
            <li
              className={"list-group-item "+className+wrongClass}
              key={"option_" + index}
            >
                <div className="row">
                <div className="col-2">
                    {item.key}
                </div>
                <div className="col-8">
                <div className="row">
                {item.text}
                </div>
                <div className="row mt-2">
                    {item.why}
                </div>
                </div>
                </div>
            </li>
          );
        
      });
    let className = "row my-2  border border-info";
    if(mitem?.answer !== mitem?.answered) {
        className = "row my-2 border border-danger"
    }
    return (
      <>
        <div className="row my-4 "></div>
        <div className={className}>
          <div className="col-3"></div>
          <div className="col-6">{mitem.text}</div>
          <div className="col-3"></div>
        </div>
        <div className={className}>
          <div className="col-2"></div>
          <div className="col-8">
            <ul className="list-group">{Options}</ul>
          </div>
          <div className="col-2"></div>
        </div>
      </>
    );
  });

  return loading ? (
    <span className="loader"></span>
  ) : (
    <div className="container">
      <div className="row"></div>
      <div className="row"></div>
      <div className="row">
        <div className="col-4"></div>
        <div className="col-4">
          <h2 className="text-info">Your Score Is: <b className="text-primary">{score}%</b></h2>
        </div>
        <div className="col-4"></div>
      </div>
      <div className="row">
        {Questions}
      </div>
    </div>
  );
}
