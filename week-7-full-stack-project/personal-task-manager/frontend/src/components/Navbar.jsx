import { Link } from "react-router-dom"
import Home from "./Home"
import Login from "./Login"
import SignUp from "./Signup"

function Navbar(){
    return (
        <>
         <nav style={{ marginBottom: "20px" }}>
          <Link to="/signup" style={{ marginRight: "10px", textDecoration:"none" }}>Signup</Link>
          <Link to="/login" style={{ marginRight: "10px", textDecoration:"none"}}>Login</Link>
          <Link to="/home" style={{ marginRight: "10px", textDecoration:"none" }}>Home</Link>
        </nav>
        </>
    )
}

export default Navbar