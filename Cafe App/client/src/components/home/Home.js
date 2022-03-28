import React,{useEffect} from "react";

function Home(){

    useEffect(()=>{
        document.title='Home'
    },[])

    return(
        <>
            <h1 className="text-center mt-5 ">Welcome to CafeApp !!</h1>
        </>
    )
}

export default Home