import React, { useEffect, useState } from "react";
import { graphql } from "../../functions/graphql";
import * as short from "short-uuid";

export default function AssignQuiz() {
    const [data,setData] = useState([]);
    const [selected,setSelected] = useState([]);
    const [users,setUsers] = useState([]);
    const load = async ()=>{
        const q = `
        query GetAllQuiz {
            getAllQuiz {
                _id
                title
            }
        }
        `;
        await graphql(q,{},null,(response)=>{
            if(response?.getAllQuiz) {
                setData(response?.getAllQuiz);
            }
        })

    }
    useEffect(()=>{
        load();
    },[])
    const options = data?.map((item,index)=>{
        return <option value={item._id} key={"quizOption_"+index}>{item.title}</option>
    })
    return <div className="container">
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
                    setUsers([...users,{uid:shot,name:""}])
                }}>Add Student</button>
            </div>
            <div className="col-10"></div>
        </div>
        {users?.map((item,index)=>{
            return <div className="row mt-2" key={"item_student"+index}>
                <div className="col-3 ">
                    <input className="form-control" type="text" value={item?.uid} disabled/>
                </div>
                <div className="col-3">
                    <input className="form-control" type="text" value={item?.name} onChange={(e)=>{
                        let temp = [...users];
                        temp[index] = e.target.value;
                        setUsers(temp);
                    }}/>
                </div>
                <div className="col-6"></div>
            </div>
        })}
        {users.length > 0?<div className="row mt-2">
            <div className="col-6">
                <button className="btn btn-primary">Save</button>
            </div>
            <div className="col-6">

            </div>

        </div>:""
        }
  
        </>:""}
    </div>

}