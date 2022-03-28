import axios from "axios";
import React,{useEffect} from "react";
import {useNavigate} from 'react-router-dom'

function SignOut(){

    const navigate = useNavigate()

    useEffect(()=>{
        // axios.get("http://localhost:8000/auth/signout")
        // .then(res=>{
        //     navigate('/')
        // })
        // .catch(err=>{
        //     console.log(err)
        // })

        window.localStorage.clear('bearer')
        navigate('/')
    })

    return(
        <>
        </>
    )
}

export default SignOut