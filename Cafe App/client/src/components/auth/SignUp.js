import axios from 'axios'
import React, { useState,useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SignUp(){
    const [user,setUser]=useState({
        username:'',email:'',password:'',confirmPassword:''
    })
    const [hasError,setHasError]=useState(true)
    const [errors,setErrors]=useState({})

    const navigate = useNavigate()

    useEffect(()=>{
        document.title='Sign Up'
    })

    // CHANGE HANDLER FUNCTION
    const handleChange=e=>{
        let {name,value}=e.target
        setUser({...user,[name]:value})
        setErrors({
            ...errors,[name]:validate(name,value)
        })
    }

    // INPUT FIELD VALIDATION 
    const validate=(name,value)=>{
        if(name==='username' && !/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(value))
        {
            setHasError(true)
            return 'Enter Valid Username. Username length must be at least 6 characters'
        }
        if(name==='email' && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value.toLowerCase()))
        {
            setHasError(true)
            return 'Enter Valid Email'
        }
        if(name === 'password' && !/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(value))
        {
            setHasError(true)
            return "Minimum password length should be 8 characters. Password must have at least one special symbol, digit, one uppercase and one lowercase letter."
        }
        if(name==='confirmPassword' && user.password != value)
        {
            setHasError(true)
            return "Password did not match"
        }
        else
        {
            setHasError(false)
        }
    }

    // SIGN UP FUNCTION
    const signupHandler=e=>{
        e.preventDefault()
        let {username,email,password,confirmPassword} = user
        if(! username|| ! email|| ! password|| ! confirmPassword)
        {
            toast.error("Please fill out all the fields",{
                position: "top-center",
                autoClose: 3000,
            })
        }
        else
        {
            axios.post('http://localhost:8000/auth/signup',user)
            .then(res=>{
                console.log(res.status)
                if (res.status===200)
                {
                    toast.success(`Registration Successfull`,{
                        position: "top-center",
                        autoClose: 3000,
                    })   
                    setUser({username:'',email:'',password:'',confirmPassword:''})
                }
            })
            .catch(err=>{
                toast.error("User Already Exists",{
                    position: "top-center",
                    autoClose: 3000,
                })
                setUser({username:'',email:'',password:'',confirmPassword:''})
            })
        }
    }

    return(
        <>
        <div className='box-model'>
            <h2>Create Account</h2>
            <Link to='/signin' >Already a user? Login</Link><br/><br/>
            <form method='post'>
                <div className='form-group'>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Enter Username"  
                        name='username' 
                        required
                        value={user.username} 
                        onChange={(e)=>handleChange(e)}
                    />
                    <p className='text-danger'>{errors.username}</p>
                </div>
                <div className='form-group'>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Enter Email"  
                        name='email' 
                        required
                        value={user.email} 
                        onChange={(e)=>handleChange(e)}
                    />
                    <p className='text-danger '>{errors.email}</p>
                </div>
                <div className='form-group'>
                    <input 
                        type="password" 
                        className="form-control" 
                        placeholder="Enter Password"  
                        name='password' 
                        required
                        value={user.password} 
                        onChange={(e)=>handleChange(e)}
                    />
                    <p className='text-danger'>{errors.password}</p>
                </div>
                <div className='form-group'>
                    <input 
                        type="password" 
                        className="form-control" 
                        placeholder="Confirm password"  
                        name='confirmPassword' 
                        required
                        value={user.confirmPassword} 
                        onChange={(e)=>handleChange(e)}
                    />
                    <p className='text-danger '>{errors.confirmPassword}</p>
                </div>
                <div className="form-group">
                    <button 
                        type="submit" 
                        className="btn btn-success btn-block mx-4" 
                        disabled={hasError}
                        onClick={(e)=>signupHandler(e)}> Sign up 
                    </button>
                    <button 
                        type="reset" 
                        className="btn btn-danger btn-block mx-4" 
                        onClick={(e)=>setUser({})}> Cancel
                    </button>
                </div>
            </form>
        </div>
        <ToastContainer/>
        </>
    )
}

export default SignUp