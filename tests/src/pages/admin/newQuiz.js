import React, { useState } from "react";
import { graphql } from "../../functions/graphql";

export default function NewQuiz() {
    const [inputText,setInputText] = useState("");
    const [allTexts,setAllTexts] = useState("");
    const [title,setTitle] = useState("");
    const [questionCount,setQuestionCount] = useState(10);
    const [isLoading,setIsLoading] = useState(false);
    const submitQuiz = async ()=>{
        setIsLoading(true);
        const q = `
        mutation CreateQuiz($input: quizInput!) {
            createQuiz(input: $input)
        }
        `;
        await graphql(q,{input:{title:title,text:allTexts?allTexts:inputText,numberOFQuestions:Number(questionCount)}},null,(quiz)=>{
            if(quiz?.createQuiz) {
                alert("new Quiz was created ID ="+quiz?.createQuiz);
            }
            else{
                alert("there was error creating new quiz");
            }

        });
        setTitle("");
        setAllTexts("");
        setQuestionCount(10);
        setInputText("");
        setIsLoading(false);

    }
    return <div className="container mt-5">
    {isLoading?<span className="loader"></span>:<>
    <div className="row">
        <div className="col">
            {allTexts}
        </div>
    </div>
    <div className="row">
        <div className="col-10">
        <label htmlFor="input_test" className="form-label">Example textarea</label>
            <textarea id="input_test" className="form-control" value={inputText}  onChange={(e)=>{
                setInputText(e.target.value);
                e.preventDefault();
            }}/>
        </div>
        <div className="col-2">
            <button className="btn btn-primary mt-5" onClick={()=>{
                setAllTexts(allTexts + inputText);
                setInputText("");
            }} >Add Text</button>
        </div>
    </div>
    <div className="row mt-2">
        <div className="col-8">
            <input type="text" placeholder="Add name if you wnat to name quiz" className="form-control" value={title} onChange={(e)=>{setTitle(e.target.value);}} />
        </div>
        <div className="col-2">
            <input type="text" value={questionCount} className="form-control" onChange={(e)=>{
                if(!isNaN(e.target.value)) {
                    setQuestionCount(e.target.value);
                }
            }} />
        </div>
        <div className="col-2">
            <button className="btn btn-primary" onClick={()=>{submitQuiz();}}>Create Quiz</button>
        </div>
    </div>
    </>}
</div>
}