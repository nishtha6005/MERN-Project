import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Menu(){

    const [items,setItems] = useState([])
    const [username,setUSername] = useState('')
    const [totalRecords, setTotalRecords] = useState(0)
    const recordsPerPage = 4

    const navigate = useNavigate();

    useEffect(()=>{
        document.title='Menu Items '
        const token = window.localStorage.getItem('bearer')
        if (token === null)
        {
            navigate('/signin')
        }
        getMenuItems()
    },[])

    // GET MENU ITEMS 
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

    // SEARCH MENU ITEMS BY THEIR NAMES
    const searchItems=(e)=>{
        console.log(typeof e.target.value.trim())
        if(e.target.value.trim())
        {
            axios.get(`http://localhost:8000/menu/search?menu=${e.target.value}`,
            {
                headers:{
                    authorization:`Bearer ${window.localStorage.getItem('bearer')}`
                }
            })
            .then(res=>{
                setItems(res.data.search)
                setTotalRecords(res.data.length)
            })
            .catch(err=>{
                console.log(err)
            })
        }
        else
        {
            getMenuItems()
        }
    }

    return(
        <>
        <div className='row my-4'>
            <h1 className='text-center text-secondary'>Welcome to CafeApp {username}!</h1>
            {/* SEARCH BAR */}
            <div className='text-center m-2'>
                <input 
                    type='text' 
                    name='search' 
                    className='input-control px-2'
                    aria-label="Search "
                    size='40'
                    placeholder=' Search Menu Items By Name' 
                    onKeyUp={(e)=>searchItems(e)}
                />
            </div>
            {
                items.map((item,index)=>{
                    return(
                        <>
                        { 
                            item.isAvailable === true  &&     
                            <div className='col-md-3' key={index}>
                                <div className='card' 
                                    style={{width: "300px", height:"290px",margin:"30px"}}>                                        
                                    <img src={`http://localhost:8000/public/images/${item.image}`} 
                                        className="card-img" 
                                        alt="Menu Item" 
                                        height="150px"
                                    />
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
        
        {/* PAGINATION BUTTONS */}
        { 
            Number(totalRecords) <= Number(recordsPerPage) && 
            <div className="row">
                <div className="col-md-5 m-auto">
                    {
                        [...Array(Math.ceil(totalRecords / recordsPerPage))]
                        .map((val, idx) => (
                            <button className="btn btn-primary m-2" key={idx}
                                onClick={()=>handlepageCountChange(idx*recordsPerPage)}> {idx + 1}
                            </button>
                        ))
                    } 
                </div>
            </div>
        }
    </>
    )
}

export default Menu