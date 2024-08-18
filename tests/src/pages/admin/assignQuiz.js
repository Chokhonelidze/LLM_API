import React, { useEffect, useState } from "react";
import { graphql } from "../../functions/graphql";
import * as short from "short-uuid";

export default function AssignQuiz() {
    const [data,setData] = useState([]);
    const [selected,setSelected] = useState([]);
    const [users,setUsers] = useState([]);

    const loadQuizUsers = async ()=>{
        const q =`query GetAllUsersForQuiz($quiz: ID) {
                        getAllUsersForQuiz(quiz: $quiz) {
                            success
                            errors
                            users {
                            _id
                            userName
                            }
                        }
                    }`;
        await graphql(q,{quiz:selected},null,(response)=>{
            if(response?.getAllUsersForQuiz?.success){
                setUsers(response?.getAllUsersForQuiz?.users);
            }
        });
    }
    const load = async ()=>{
        const q = `
        query GetAllQuiz {
            getAllQuiz {
                _id
                title
            }
        },
        `;
        await graphql(q,{},null,(response)=>{
            if(response?.getAllQuiz) {
                setData(response?.getAllQuiz);
                setSelected(response?.getAllQuiz[0]['_id']);
            }
        })

    }
    const assignQuizToUsers = async ()=>{
        const q = `
        mutation AssignQuizToUsers($input: AssignUsersInput!) {
            assignQuizToUsers(input: $input)
        }
        `;
        const inputUsers = users.map((item)=>{
            return {
                userName:item.userName,
                _id:item?.['_id'],
                quizID:selected
            }
        });
        console.log(users);
        console.log(inputUsers);
        await graphql(q,{input:{
            users:inputUsers,
        }},null,(response)=>{
        });

    }
    useEffect(()=>{
        load();
    },[])
    useEffect(()=>{
        if(selected){
            loadQuizUsers();
        }
    },[selected]);
    const options = data?.map((item,index)=>{
        return <option value={item._id} key={"quizOption_"+index}>{item.title}</option>
    })
    return <div className="container">
        {data && data.length > 0 ? <>
        <div className="row mt-5">
            <div className="col">
                <select className="form-select" onSelect={(e)=>{setSelected(e.target.value);}}>
                    {options}
                </select>
            </div>
        </div>
        {selected?
        <>
        <div className="row mt-2">
            <div className="col-2">
                <button className="btn btn-primary" 
                onClick={()=>{
                    let shot = short.generate();
                    setUsers([...users,{_id:shot,userName:""}])
                }}>Add Student</button>
            </div>
            <div className="col-10"></div>
        </div>
        {users?.map((item,index)=>{
            return <div className="row mt-2" key={"item_student"+index}>
                <div className="col-3 ">
                    <input className="form-control" type="text" value={item?.['_id']} disabled/>
                </div>
                <div className="col-3">
                    <input className="form-control" type="text" value={item?.userName} onChange={(e)=>{
                        let temp = [...users];
                        temp[index]['userName'] = e.target.value;
                        setUsers(temp);
                    }}/>
                </div>
                <div className="col-6"></div>
            </div>
        })}
        {users.length > 0?<div className="row mt-2">
            <div className="col-6">
                <button className="btn btn-primary" onClick={()=>{assignQuizToUsers();}}>Save</button>
            </div>
            <div className="col-6">

            </div>

        </div>:""
        }
  
        </>:""}</>:<h2 className="text-warning">You don't have quiz please create one</h2>}
    </div>

}