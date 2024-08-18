import React, { useState } from "react";
import { graphql } from "../functions/graphql";
import QuizComponent from "../components/quizComponent";

export default function Home(){
    const [userID,setUserID] = useState("");
    const [loading,setLoading] = useState(false);
    const [data,setData] = useState(false);
    const [errors,setErrors] = useState("");
    const loadQuiz = async ()=>{
        const q = `
        query GetQuizForUser($userId: ID!) {
            getQuizForUser(userID: $userId) {
                _id
                title
                content {
                id
                text
                options {
                    key
                    text
                }
                }
            }
            }
        `;
        await graphql(q,{userId:userID},null,(resp)=>{
            setLoading(true);
            if(resp?.getQuizForUser){
                setData(resp?.getQuizForUser?.content);
            }
            else {
                setErrors(" User ID is incorrect please try again");
            }
            setLoading(false);
        });
    };

    return <div className="container">
        {loading?<span className="loader"></span>:
        errors?<h3 className="text-danger">{errors}</h3>:
        data?<div className="row"><QuizComponent data={data}/></div>:<div>
            <form className="row g-3 mt-5">
        <div className="col-auto">
          <label htmlFor="inputPassword2" className="visually-hidden">User Temporary ID</label>
          <input type="text" className="form-control" id="inputPassword2" placeholder="umRgzjsaujwGpE3wFzgosB" 
          onChange={(e)=>{
            setUserID(e.target.value);
          }}/>
        </div>
        <div className="col-auto">
          <button type="button" className="btn btn-primary mb-3" onClick={()=>{
            if(userID.length > 0) {
                loadQuiz();
            }
          }}>Confirm identity</button>
        </div>
      </form></div>}
    </div>

}