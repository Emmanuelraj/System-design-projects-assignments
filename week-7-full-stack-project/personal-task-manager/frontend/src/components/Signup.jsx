import { useState } from "react";
import {useNavigate} from "react-router-dom"

function SignUp(){

   const [username, setUsername] = useState("");
   const [password, setPassword]= useState("");
   
    const navigate = useNavigate();

    const handleSignup= async()=>{
        const res = await fetch('http://localhost:3000/api/tasks/auth/signup', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ username, password }),
        });
          const data = await res.json();
         alert(data.message || "Signed up successfully!");
         // we are directing to login page
          if (res.ok) {
                navigate("/login");
                }
    }


    return (
        <div>
            <h2>Signup</h2>
            
                   <input placeholder="username" value ={username} onChange={(e)=>setUsername(e.target.value)} />

                   <input type="password" value ={password} onChange ={(e)=>setPassword(e.target.value)} />

                   <button onClick={handleSignup}>Sign Up</button>

           
        </div>
    )
}

export default SignUp