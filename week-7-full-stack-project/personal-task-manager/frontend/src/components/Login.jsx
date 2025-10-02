import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

function Login(){

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();


    useEffect(()=>{
         // If user already logged in, redirect to tasks
         if(localStorage.getItem("token")){
            navigate("home")
         }
    },[navigate])


    const  handleLogin = async(e)=>{
          const res = await fetch('http://localhost:3000/api/tasks/auth/login',{
            method:"POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
           });
         const data = await res.json();
         if(data.token){
              localStorage.setItem("token", data.token)
             alert(data.message || "Logged  successfully!");
             //redirect to home 
             navigate("/home");
         }else{
            alert(data.message || "Login failed");     
         }
         
        
    }



    return (
        <div className="container" style={{ padding: "20px", fontFamily: "Arial"}}>
            <h2>Login</h2>
            <label htmlFor="userName">UserName</label>
             <br/>
            <input type="text" value ={username} placeholder="Enter UserName"  onChange={(e)=>setUsername(e.target.value)}/>
             <br/>
            <label htmlFor="password">Password</label> 
             <br/>
            <input type="password" value ={password} placeholder="Enter Password"  onChange={(e)=>setPassword(e.target.value)}/>
             <br/>
            <button onClick={handleLogin}>Login  </button>
        </div>
    )
}

export default Login