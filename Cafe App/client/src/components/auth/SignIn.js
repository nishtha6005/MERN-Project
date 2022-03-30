import React,{useState,useEffect} from 'react'
import {useNavigate,Link} from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SignIn(){
    const [credentials,setCredentials]=useState({
        email:'',password:''
    })
    
    const navigate=useNavigate()
    
    useEffect(()=>{
        document.title = 'Sign In'
        window.localStorage.clear('bearer')
    },[])

    // CHANGE HANDLER FUNCTION
    const handleChange=e=>{
        let {name,value}=e.target
        setCredentials({...credentials,[name]:value})
    }

    const loginHandler=e=>{
        e.preventDefault()
        let {email,password} = credentials
        if(! email.trim()|| ! password.trim())
        {
            toast.error("Please enter email and password",{
                position: "top-center",
                autoClose: 3000,
            })
        }
        else
        {
            axios.post('http://localhost:8000/auth/signin',credentials,
            {
                withCredentials:true
            })
            .then(res=>{
                window.localStorage.setItem("bearer",res.data.token) 
                window.localStorage.setItem("admin",res.data.isAdmin)
                // toast.success("Login Successfull",{
                //     position: "top-center",
                //     autoClose: 1000,
                // })     
                if(res.data.isAdmin === true)
                    return navigate('/admin',{state:{bearer:res.data.token,isAdmin:res.data.isAdmin}})
                else 
                    return navigate('/menu-items',{state:{bearer:res.data.token,isAdmin:res.data.isAdmin}})
            })
            .catch(error=>{
                toast.error("Invalid User Credentials",{
                    position: "top-center",
                    autoClose: 3000,
                })
                setCredentials({email:'',password:''})
            })
        }   
    }

    return (
        <>
        <div className='box-model' >
            <h2>Sign In</h2>
            <br />
            <form  method="post" >
                <div className="form-group">
                    <input 
                        type="email" 
                        className="form-control" 
                        placeholder="Enter email " 
                        name='email' 
                        value={credentials.email} 
                        onChange={(e)=>handleChange(e)}
                        required
                    />                        
                </div><br/>
                <div className="form-group">
                    <input 
                        type="password" 
                        className="form-control" 
                        placeholder="Enter password" 
                        required
                        name='password' 
                        value={credentials.password} 
                        onChange={(e)=>handleChange(e)}
                    />
                </div><br/>
                <div className="form-group">
                    <button 
                        type="submit" 
                        className="btn btn-success btn-block" 
                        onClick={(e)=>loginHandler(e)}>Login
                    </button> 
                    <br/><br/>
                    <Link to="/signup">Don't have an account? Create Account</Link> 
                </div>
            </form>
        </div>
        <ToastContainer/>
        </>
    )
}

export default SignIn