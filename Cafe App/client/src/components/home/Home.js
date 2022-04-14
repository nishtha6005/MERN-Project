import React,{useEffect} from "react";
import '../../images/bg.jpg'

function Home(){

    useEffect(()=>{
        document.title='Home'
    },[])

    const myStyle={
        backgroundImage:"url('https://doitd.com/wp-content/uploads/2020/06/doitd-Restaurant-table-booking-system.jpeg')",
        height:'100vh',
        marginTop:'-70px',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
    }

    return(
        <>
        <div style={myStyle}>
          <br/><br/>
            <h1 className="text-center text-white mt-5 ">Welcome to CafeApp!!!</h1>
        </div>
            
            
        </>
    )
}

export default Home