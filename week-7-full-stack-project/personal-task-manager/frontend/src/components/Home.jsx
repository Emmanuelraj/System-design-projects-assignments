import { useEffect, useState } from "react";

function Home(){

    const [tasks,setTasks]=useState([]);
    const [title, setTitle]= useState("");
    const [description, setDescription]=useState("");
    const token = localStorage.getItem("token");

    const createTask =async ()=>{ 
       
        await fetch('http://localhost:3000/api/tasks',{
            method:"POST",
             headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body:JSON.stringify({title: title, description: description})
        })
        setTitle("");
        setDescription("");
    }

    const fetchTasks = async () => {
    const res = await fetch('http://localhost:3000/api/tasks', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  if (!token) return <p>Please login to see tasks.</p>;


    return(
        <div>
            <h2>Your Tasks</h2>
            <ul>
                {tasks.map((task) => (
                <li key={task.taskId}>{task.title}</li>
                ))}
            </ul>
            <div className="task-container">
                <input type="text" value ={title} placeholder="Enter your task" onChange={(e)=>setTitle(e.target.value)}/>
                <br/>
                <br/>
                <textarea type="text" value={description} placeholder="Enter your description" onChange={(e)=>setDescription(e.target.value)} rows={3} style={{ resize: "vertical" }}/>
                <br/>
                <br/>
                <button onClick={createTask}>Add new Task </button> 
            </div>
        </div>
    )
}

export default Home;