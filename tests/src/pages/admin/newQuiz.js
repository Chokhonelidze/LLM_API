import React, { useState } from "react";
import { graphql } from "../../functions/graphql";

export default function NewQuiz() {
    const [inputText,setInputText] = useState("");
    const [allTexts,setAllTexts] = useState("");
    const [title,setTitle] = useState("");
    const submitQuiz = async ()=>{
        const q = `
        mutation CreateQuiz($input: quizInput!) {
            createQuiz(input: $input)
        }
        `;
        await graphql(q,{input:{title:title,text:allTexts}},null,(quiz)=>{
            if(quiz?.createQuiz) {
                alert("new Quiz was created ID =",quiz?.createQuiz);
            }
            else{
                alert("there was error creating new quiz");
            }

        })

    }
    return <div className="container mt-5">
    <div className="row">
        <div className="col">
            {allTexts}
        </div>
    </div>
    <div className="row">
        <div className="col-10">
        <label for="input_test" class="form-label">Example textarea</label>
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
            <input type="text" className="form-control" value={title} onChange={(e)=>{setTitle(e.target.value);}} />
        </div>
        <div className="col-4">
            <button className="btn btn-primary" onClick={()=>{submitQuiz();}}>Create Quiz</button>
        </div>
    </div>
</div>
}