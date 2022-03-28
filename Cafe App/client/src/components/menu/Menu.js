import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Menu(){
    const [items,setItems] = useState([])
    const [username,setUSername] = useState('')

    const navigate = useNavigate();

    useEffect(()=>{
        document.title='Menu Items '
        axios.get('http://localhost:8000/menu/all',
        {
            headers:{
                authorization:`Bearer ${window.localStorage.getItem('bearer')}`
            }
        })
        .then(res=>{
            setItems(res.data.items)
            setUSername(res.data.user.username)

        })
        .catch(error=>{
            console.log(error)
            navigate('/signin')
        })
    },[])

    return(
        <>
        <div className='row'>
            <h1 className='text-center text-secondary'>Welcome to CafeApp {username}!</h1>
            {
                items.map((item,index)=>{
                    return(
                        <>
                            { 
                                item.isAvailable === true  &&     
                                <div className='col-md-3' key={index}>
                                    <div 
                                        className='card' 
                                        style={{width: "300px", height:"290px",margin:"30px"}}>
                                        
                                        <img src={`http://localhost:8000/public/images/${item.image}`} 
                                            className="card-img" 
                                            alt="Menu Item" 
                                            height="150px"
                                        />
                                        {/* <hr/> */}
                                        <div className='card-body'>
                                            <h5 className="card-title mt-2">{item.itemName}</h5>
                                            <p className="card-text text-justify">{item.description}</p>
                                            <h5 className="card-text text-danger">Price : &#8377;{item.price}</h5>
                                        </div>
                                        
                                    </div>
                                </div>
                            }
                        </>
                    ) 
                })
            }
        </div>

        </>
    )
}

export default Menu