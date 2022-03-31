import React,{useState,useEffect, useRef} from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ListMenu(){
    const [filteredItems,setFilteredItems]=useState([])
    const [selectedId, setSelectedId] = useState(0)
    const [updatedData, setUpdatetedData] = useState({
        price:'',isAvailable:'', itemName:'',description:'',image:''
    })
    const [totalRecords, setTotalRecords] = useState(0)
    const [hasError,setHasError]=useState(false)
    const [errors,setErrors]=useState({})

    const recordsPerPage = 3
    
    const ref = useRef()
    const navigate = useNavigate()

    useEffect(()=>{
        document.title='Menu Items List'
        const token = window.localStorage.getItem('bearer')
        if (token === null)
        {
            navigate('/signin')
        }
        getMenuItems()
    },[])

    // GET MENU ITEMS
    const getMenuItems=()=>{
        axios.get(`http://localhost:8000/menu/get/all/0`,
        {
            headers:{
                authorization:`Bearer ${window.localStorage.getItem('bearer')}`
            }
        })
        .then(res=>{
            setFilteredItems(res.data.items)
            setTotalRecords(res.data.length)
        })
        .catch(error=>{
            console.log(error)
            navigate('/signin')
        })
    }

    // CHANGE HANDLER FUNCTION
    const handleChange=e=>{
        let  {name,value,checked}=e.target
        if (name === 'isAvailable')
            setUpdatetedData({
                ...updatedData,[name]:checked
            })
        else
            setUpdatetedData({
                ...updatedData,[name]:value
            })

        setErrors({
            ...errors,[name]:validate(name,value)
        })
    }

    //PAGINATION HANDLER FUNCTION
    const handlepageCountChange=index=>{
        axios.get(`http://localhost:8000/menu/get/all/${index}`,
        {
            headers:{
                authorization:`Bearer ${window.localStorage.getItem('bearer')}`
            }
        })
        .then(res=>{
            console.log(res.data.length, typeof res.data.length)
            setFilteredItems(res.data.items)
            setTotalRecords(res.data.length)
        })
        .catch(error=>{
            console.log(error)
            navigate('/signin')
        })
    }

    // INPUT FIELD VALIDATION 
    const validate=(name,value)=>{
        if(name === 'itemName' && value.trim().length ===0)
        {
            setHasError(true)
            return "Menu Item name cannot be empty"
        }
        if(name === 'description' && value.trim().length ===0)
        {
            setHasError(true)
            return "Menu Item description cannot be empty"
        }
        if(name === 'price' && value.trim().length ===0)
        {
            setHasError(true)
            return "Price name cannot be empty"
        }
        else{
            setHasError(false)
        }
    }

    // FUNCTION TO ADD INPUT FILEDS TO UPDATE MENU ITEMS DATA
    const edit =(item)=>{
        setUpdatetedData({
            itemName:item.itemName,
            description:item.description,
            price:item.price,
            isAvailable:item.isAvailable,
            image:item.image
        })        
        selectedId === item._id ? setSelectedId(0) : setSelectedId(item._id)
    }

    // UPDATE HANDLER FUNCTION TO UPDATE MENU ITEMS DATA
    const updateHandler=(id)=>{
        let formData = new FormData()
        formData.append('image',updatedData.image)
        formData.append('itemName',updatedData.itemName)
        formData.append('description',updatedData.description)
        formData.append('price',updatedData.price)
        formData.append('isAvailable',updatedData.isAvailable)
        axios.put(`http://localhost:8000/menu/update/${id}`, formData,
            {
                headers:{
                    authorization:`Bearer ${window.localStorage.getItem('bearer')}`
                }
            }
        )
        .then(result => {
            toast.success("Menu item updated successfully",{
                position: "top-center",
                autoClose: 3000
            })
            setSelectedId(0)
            getMenuItems()
        })
        .catch(err=>{
            console.log(err.response.data)
        })
    }

    // DELETE HANDLER FUNCTION TO DELETE MENU ITEMS
    const deleteHandler=(id)=>{
        let ans = window.confirm("Are you sure you want to delete ?")
        if (ans) {
            axios.delete(`http://localhost:8000/menu/delete/${id}`,
                {
                    headers:{
                        authorization:`Bearer ${window.localStorage.getItem('bearer')}`
                    }
                }
            )
            .then(result => {
                toast.success("Menu item deleted successfully",{
                    position: "top-center",
                    autoClose: 3000,
                })
                getMenuItems()
            })
            .catch(err=>{
                console.log(err.response.data)
            })
        }
    }

    // UPLOAD IMAGE
    const uploadImage=e=>{
        let {name, files}=e.target
        setUpdatetedData({
            ...updatedData,[name]:files[0]
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
                setFilteredItems(res.data.search)
                setTotalRecords(res.data.length)
            })
            .catch(err=>{
                console.log(err)
            })
        }
        else{
            getMenuItems()
        }
    }

    // DROPDOWN SELECTION HANDLER FUNCTION
    const selectChangeHandle=e=>{
        let {name,value}=e.target
        if (value == 'all')
        {
            getMenuItems()
        }
        else
        {
            axios.get(`http://localhost:8000/menu/get/${value}/0`,{
            headers:{
                authorization:`Bearer ${window.localStorage.getItem('bearer')}`
            }
            })
            .then(res=>{
                setFilteredItems(res.data.items)
                setTotalRecords(res.data.length)
            })
            .catch(error=>{
                console.log(error)
                navigate('/signin')
            })
        }
        
    }

    return(    
    <>
        <h2 className='text-center m-3'>List of Menu Items</h2>
        <div className='row'>
            <div className='col-md-4'></div>
            <div className='col-md-4'>
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
            </div>
            <div className='col-md-4'>
                <select className=" dropdown m-2" onChange={(e)=>selectChangeHandle(e)} name='menu-items'>
                    <option value='select' selected disabled>Select Menu Items Type</option>
                    <option value='all'>All</option>
                    <option value='available-menu-items'>Available</option>
                    <option value='unavailable-menu-items'>Unavailable</option>
                </select>
            </div>
        </div>
        
        <div className='row'>
        {
            filteredItems
            .map((item,index)=>{
                return(
                <>            
                  { 
                    item.isDeleted === false  &&   
                    <>
                    <div className='col-md-4' key={index} >
                        <div className='card mx-auto' 
                            style={{width: "400px", height:"480px",margin:"15px"}}>      
                            
                            { 
                                selectedId === item._id ? 
                                <>
                                    <div className='mx-4'>
                                        <h4 className='text-center mt-2'>Update Menu Item</h4>
                                        <div className='form-group'>
                                            <label className="form-label" htmlFor='itemName'>
                                                <strong>Menu-Item Name</strong>
                                            </label>
                                            <input type='text'
                                                className='form-control' 
                                                name='itemName' 
                                                id='itemName'
                                                required
                                                value={updatedData.itemName} 
                                                onChange={(e)=>handleChange(e)} 
                                            />
                                            <p className='text-danger'>{errors.itemName}</p>
                                        </div>
                                        <div className='form-group'>
                                            <label className="form-label" htmlFor='description'>
                                                <strong>Menu-Item Description</strong>
                                            </label>
                                            <input type='text' 
                                                className='form-control'
                                                name='description' 
                                                id='description'
                                                required
                                                value={updatedData.description} 
                                                onChange={(e)=>handleChange(e)} 
                                            />
                                            <p className='text-danger'>{errors.description}</p>
                                        </div>
                                        <div className='form-group'>
                                            <label className="form-label" htmlFor='price'>
                                                <strong>Menu-Item Price</strong>
                                            </label>
                                            <input type='number' 
                                                className='form-control' 
                                                name='price' 
                                                id='price'
                                                required 
                                                value={updatedData.price} 
                                                onChange={(e)=>handleChange(e)}
                                            />
                                            <p className='text-danger'>{errors.price}</p>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor='isAvailable' >
                                                <strong>Available</strong>                                                        
                                            </label>
                                            <input type="checkbox" 
                                                className="mx-3" 
                                                name='isAvailable' 
                                                id='isAvailable'
                                                checked={updatedData.isAvailable}
                                                onChange={(e)=>handleChange(e)}  
                                            />
                                        </div>
                                        <div className='form-group'>
                                            <label className="form-label" htmlFor='image' >
                                                <strong> Menu Item Image</strong>                                                        
                                            </label>
                                            <input type='file' 
                                                className='form-control' 
                                                accept="image/*"
                                                placeholder='Upload Image' 
                                                name='image' 
                                                id='image'
                                                ref={ref}
                                                required={true}
                                                encType="multipart/form-data"
                                                onChange={(e)=>uploadImage(e)} 
                                            />
                                            <p></p>
                                        </div>
                                        <div className='form-group text-center'>
                                            <button className="btn btn-success m-2 px-5 py-2" 
                                                disabled={hasError}
                                                onClick={() => updateHandler(item._id)}> Save
                                            </button>
                                        </div>
                                    </div>
                                </>
                                :
                                <>
                                    <img src={`http://localhost:8000/public/images/${item.image}`} 
                                        className="card-img" 
                                        alt="Menu Item" 
                                        height="200px"
                                    />
                                    <div className='card-body'>
                                        <h5 className="card-title mt-2">{item.itemName}</h5>
                                        <p className="card-text text-justify">{item.description}</p>
                                        <h6>Available : {item.isAvailable ? 'Yes' : 'No'}</h6>
                                        <h5 className="card-text text-danger">Price : &#8377;{item.price}</h5>
                                        <div className='form-group text-center'>
                                            <button className="btn btn-outline-warning mx-5 mt-3" 
                                                onClick={() => edit(item)}> Update
                                            </button>
                                            <button className="btn btn-outline-danger mx-5 mt-3" 
                                                onClick={() => deleteHandler(item._id)}> Delete
                                            </button>
                                        </div>
                                    </div>
                                </>
                            }    
                        </div>
                    </div>
                    </>
                 }
            </>
            )
            })
        }
        </div>
        { 
            ! (Number(totalRecords) <= Number(recordsPerPage)) && 
            <div className="row">
                <div className="col-md-5 m-auto">
                    {[...Array(Math.ceil(totalRecords / recordsPerPage))].map((a, idx) => (
                        <button key={idx} className="btn btn-primary m-2" onClick={()=>handlepageCountChange(idx*recordsPerPage)}>{idx + 1}</button>
                    ))}
                </div>
            </div>
        }
        <ToastContainer/>
        </>
    )
}

export default ListMenu