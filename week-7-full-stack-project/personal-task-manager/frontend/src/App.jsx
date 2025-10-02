import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './App.css'
import Navbar from "./components/Navbar";
import SignUp from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";



function App() {
 

  

  return (
   <Router>
      <div style={{ padding: "20px", fontFamily: "Arial", textAlign:"center"}}>
       
        <Navbar/>
         <h1>Personal Task Manager</h1>

         <Routes>
            <Route path ="/signup" element ={<SignUp/>}> </Route>
            <Route path ="/login" element ={<Login/>}></Route>
            <Route path ="/home" element ={<Home/>}></Route>
         </Routes>
      </div>
   </Router>
  )
}

export default App
