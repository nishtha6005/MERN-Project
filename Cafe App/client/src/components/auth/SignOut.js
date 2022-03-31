import React,{useEffect} from "react";
import {useNavigate} from 'react-router-dom'

function SignOut(){

    const navigate = useNavigate()

    useEffect(()=>{
        window.localStorage.clear('bearer')
        navigate('/')
    })

    return(
        <>
        </>
    )

}

export default SignOut