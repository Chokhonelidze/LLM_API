import React, {useCallback, useEffect, useState } from "react";
import { graphql } from "../../functions/graphql";
import * as short from "short-uuid";
export default function AssignQuiz() {
    const [data,setData] = useState([]);
    const [selected,setSelected] = useState("");
    const [users,setUsers] = useState([]);
    const [loading,setLoading] = useState(false);
    const loadQuizUsers = useCallback(async ()=>{
        if(!selected) return;
        const q =`query GetAllUsersForQuiz($quiz: ID) {
                        getAllUsersForQuiz(quiz: $quiz) {
                            success
                            errors
                            users {
                            _id,
                            name,
                            score,
                            end_date
                            }
                        }
                    }`;
        await graphql(q,{quiz:selected},null,(response)=>{
            if(response?.getAllUsersForQuiz?.success){
                setUsers(response?.getAllUsersForQuiz?.users);
            }
        });
    },[selected]);
    const load = useCallback( async ()=>{
        setLoading(true);
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
        setLoading(false);
    },[]);
    const assignQuizToUsers = async ()=>{
        const q = `
        mutation AssignQuizToUsers($input: AssignUsersInput!) {
            assignQuizToUsers(input: $input)
        }
        `;
        const inputUsers = users.map((item)=>{
            return {
                name:item.name,
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
    const goToPage = (id,score)=>{
        if(id && score){
            window.open('/checkResults/'+id,'_blank', 'rel=noopener noreferrer');
        } 
    }
    useEffect(()=>{
            load();
    },[load]);
    useEffect(()=>{
            loadQuizUsers();
    },[loadQuizUsers]);
    const options = data?.map((item,index)=>{
        return <option value={item._id} key={"quizOption_"+index}>{item.title}</option>
    });
    return loading?<span className="loader"></span>:<div className="container">
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
                    setUsers([...users,{_id:shot,name:""}])
                }}>Add Student</button>
            </div>
            <div className="col-10"></div>
        </div>
        <table className="table text-primary table-bordered ">
            <thead>
                <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Score</th>
                <th>Compleated Date</th>
                </tr>
            </thead>
            <tbody>
                {users?.map((item,index)=>{
                    let className = "";
                    if(item?.score) {
                        className = " table-active";
                    }
                    const date = new Date(item?.end_date*1000)
                    return (
                        <tr className={className} key={"row_item_"+index}>
                        <th><input className="form-control" type="text" value={item?.['_id']} disabled/></th>
                        <td>
                        {item?.score?<input className="form-control" type="text" value={item?.name}  disabled/>:
                    <input className="form-control" type="text" value={item?.name} onChange={(e)=>{
                        let temp = [...users];
                        temp[index]['name'] = e.target.value;
                        setUsers(temp);
                    }}/>}
                        </td>
                        <td onClick={()=>{
                            goToPage(item?.['_id'],item?.score);
                        }} style={{cursor:"pointer"}}>
                            {item?.score?item.score+' %':""}
                        </td>
                        <td>
                            {item?.end_date?date.toLocaleString():""}
                        </td>
                        </tr>
                        
                    )

                })}

            </tbody>
        </table>
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