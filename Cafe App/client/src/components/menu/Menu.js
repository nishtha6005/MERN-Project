import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Menu(){
    const [items,setItems] = useState([])
    const [username,setUSername] = useState('')
    const [totalRecords, setTotalRecords] = useState(0)
    const recordsPerPage = 2

    const navigate = useNavigate();

    useEffect(()=>{
        document.title='Menu Items '
        // axios.get('http://localhost:8000/menu/all',
        // {
        //     headers:{
        //         authorization:`Bearer ${window.localStorage.getItem('bearer')}`
        //     }
        // })
        // .then(res=>{
        //     setItems(res.data.items)
        //     setUSername(res.data.user.username)

        // })
        // .catch(error=>{
        //     console.log(error)
        //     navigate('/signin')
        // })
        const token = window.localStorage.getItem('bearer')
        if (token === null)
        {
            navigate('/signin')
        }
        getMenuItems()
    },[])

    const getMenuItems=()=>{
        axios.get(`http://localhost:8000/menu/user/get/0`,
        {
            headers:{
                authorization:`Bearer ${window.localStorage.getItem('bearer')}`
            }
        })
        .then(res=>{
            console.log(res.data.length, typeof res.data.length)
            setItems(res.data.items)
            setUSername(res.data.user.username)
            setTotalRecords(res.data.length)
        })
        .catch(error=>{
            console.log(error)
            navigate('/signin')
        })
    }

    //PAGINATION HANDLER FUNCTION
    const handlepageCountChange=index=>{
        // const skip = index*recordsPerPage
        axios.get(`http://localhost:8000/menu/user/get/${index}`,
        {
            headers:{
                authorization:`Bearer ${window.localStorage.getItem('bearer')}`
            }
        })
        .then(res=>{
            console.log(res.data.length, typeof res.data.length)
            setItems(res.data.items)
            setTotalRecords(res.data.length)
        })
        .catch(error=>{
            console.log(error)
            navigate('/signin')
        })
    }

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
        <div className="row">
            <div className="col-md-5 m-auto">
                {[...Array(Math.ceil(totalRecords / recordsPerPage))].map((a, idx) => (
                    <button key={idx} className="btn btn-primary m-2" onClick={()=>handlepageCountChange(idx*recordsPerPage)}>{idx + 1}</button>
                ))}
            </div>
        </div>

        </>
    )
}

export default Menu