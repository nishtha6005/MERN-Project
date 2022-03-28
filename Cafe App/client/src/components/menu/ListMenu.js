import React,{useState,useEffect, useRef} from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ListMenu(){
    const [items,setItems]=useState([])
    const [filteredItems,setFilteredItems]=useState([])
    const [selectedId, setSelectedId] = useState(0)
    const [updatedData, setUpdatetedData] = useState({
        price:'',isAvailable:'', itemName:'',description:'',image:''
    })
    const [hasError,setHasError]=useState(false)
    const [errors,setErrors]=useState({})
    
    // const [pagination,setPagination]=useState({
    //     recordsPerPage:1,totalRecords:0,pageCount: 0,
    // })
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

    const getMenuItems=()=>{
        axios.get('http://localhost:8000/menu/all',
        {
            headers:{
                authorization:`Bearer ${window.localStorage.getItem('bearer')}`
            }
        })
        .then(res=>{
            setItems(res.data.items)
            setFilteredItems(res.data.items)
            // setPagination({totalRecords:res.data.length})
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

    // const handlepageCountChange=index=>{
    //     setPagination({pageCount:index*pagination.recordsPerPage})
    // }

    // VALIDATION OF FIELDS
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

    // FUNCTION TO INSERT NEW ROW TO UPDATE MENU ITEMS DATA
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
        // ref.current = updatedData.image
        let formData = new FormData()
        formData.append('image',updatedData.image)
        formData.append('itemName',updatedData.itemName)
        formData.append('description',updatedData.description)
        formData.append('price',updatedData.price)
        formData.append('isAvailable',updatedData.isAvailable)
        axios.put(`http://localhost:8000/menu/update/${id}`, formData,
            // {
            //     itemName:updatedData.itemName,
            //     description:updatedData.description,
            //     price: updatedData.price,
            //     isAvailable: updatedData.isAvailable
            // },
            {
                headers:{
                    authorization:`Bearer ${window.localStorage.getItem('bearer')}`
                }
            }
        )
        .then(result => {
            toast.success("Menu item updated successfully",{
                position: "top-center",
                autoClose: 3000,
                // hideProgressBar: true,
                // pauseOnHover: false,
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

    const uploadImage=e=>{
        let {name, files}=e.target
        setUpdatetedData({
            ...updatedData,[name]:files[0]
        })
    }

    // SEARCH MENU ITEMS BY THEIR NAMES
    // const searchItems=e=>{
    //     e.preventDefault()
    //     setFilteredItems(
    //         items.filter(item=>{
    //             if(item.itemName.toLowerCase().indexOf(e.target.value.toLowerCase()) != -1)
    //             {
    //                 return true
    //             }
    //         })
    //     )
        
    // }

    const getDateTime=(datetime)=>{
        const date = new Date(datetime)
        return date.toLocaleString()
    }
    
    return(    
    <>
        <h2 className='text-center m-3'>List of Menu Items</h2>
        {/* <div className='text-center m-3'>
            <input 
                type='text' 
                name='search' 
                className='input-control'
                aria-label="Search"
                placeholder=' Search ' 
                onChange={(e)=>searchItems(e)}
            />
        </div> */}
        {
            filteredItems
            .sort((a, b) => {
                return getDateTime(b.menuCreatedTime) - getDateTime(a.menuCreatedTime);
            })
            .map((item,index)=>{
            return(
            <>                        
                { 
                    item.isDeleted === false  &&   
                    <div className='row' key={index} >
                        <div className='col-md-3'></div>
                        <div className='col-md-6' >
                            <div className='card mx-auto' 
                                style={{width: "600px", height:"480px",margin:"30px"}}>      

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
                                                {/* <p></p> */}
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
                                            <h6>Added Time : {getDateTime(item.menuCreatedTime)}</h6>
                                            <h6>Updated Time : {getDateTime(item.menuUpdateTime)}</h6>
                                            <h5 className="card-text text-danger">Price : &#8377;{item.price}</h5>
                                            <div className='form-group text-center'>
                                                <button className="btn btn-outline-warning mx-5 mt-1" 
                                                    onClick={() => edit(item)}> Update
                                                </button>
                                                <button className="btn btn-outline-danger mx-5 mt-1" 
                                                    onClick={() => deleteHandler(item._id)}> Delete
                                                </button>
                                            </div>
                                            
                                        </div>
                                    </>
                                }    
                            </div>
                        </div>
                        <div className='col-md-3'></div>
                    </div>
                }
            </>
            )})
        }
        
        {/* <div className='mx-5'>
        <table className='table table-striped '>
            <tbody>
                <tr>
                    <th>Item Name</th>
                    <th>Price</th>
                    <th>Is Available</th>
                    <th> Created Time</th>
                    <th> Updated Time</th>
                    <th>Update</th>
                    <th>Delete</th>
                </tr>
                {
                    filteredItems
                        .sort((a, b) => {
                            return b.menuCreatedTime - a.menuCreatedTime;
                        })
                        // .slice(pagination.pageCount,pagination.pageCount+pagination.recordsPerPage)
                        .map((item,index)=>{
                        return(
                            <>
                                {
                                    item.isDeleted === false && 
                                    <tr key={index}>
                                        <td>{item.itemName}</td>
                                        <td>{item.price}</td>
                                        <td>{item.isAvailable ? 'True' : 'False'}</td>
                                        <td>{item.menuCreatedTime}</td>
                                        <td>{item.menuUpdateTime}</td>
                                        <td>
                                            <button 
                                                className="btn btn-outline-warning" 
                                                onClick={() => edit(item._id,item.price,item.isAvailable)}> Update
                                            </button>
                                        </td>
                                        <td>
                                            <button 
                                                className="btn btn-outline-danger" 
                                                onClick={() => deleteHandler(item._id)}> Delete
                                            </button>
                                        </td>
                                    </tr>
                                }
                                {
                                    selectedId === item._id &&
                                    <tr key={item._id}>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            <input 
                                                type="number" 
                                                className="form-control" 
                                                placeholder="Enter price" 
                                                value={updatedData.price}
                                                name='price' 
                                                required
                                                onChange={(e)=>handleChange(e)}
                                            />
                                            <p className='text-danger'>{errors.price}</p>
                                        </td>
                                        <td>
                                            <div 
                                                className="form-group">
                                                <input 
                                                    type="checkbox" 
                                                    className="m-3" 
                                                    name='isAvailable' 
                                                    checked={updatedData.isAvailable}
                                                    onChange={(e)=>handleChange(e)}  
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            <button 
                                                className="btn btn-success" 
                                                disabled={hasError}
                                                onClick={() => updateHandler(item._id)}> Save
                                            </button>
                                        </td>
                                        <td></td>
                                    </tr>
                                }
                            </>
                        )
                    })
                }
            </tbody>
        </table>
        </div> */}
        {/* <div className="row">
            <div className="col-md-5 m-auto">
                {[...Array(Math.ceil(pagination.totalRecords / pagination.recordsPerPage))].map((a, idx) => (
                    <button key={idx} className="btn btn-primary mx-1" onClick={(idx) =>handlepageCountChange(idx)}>{idx + 1}</button>
                ))}
            </div>
        </div> */}
         {/* <div className="row">
            <div className="col-md-5 m-auto">
                { Array.from(Array(Math.ceil(pagination.totalRecords / pagination.recordsPerPage))).map((a, idx) => (
                    <button key={idx} className="btn btn-primary mx-1" onClick={(idx) =>handlepageCountChange(idx)}>{idx + 1}</button>
                ))}
            </div>
        </div>  */}
        <ToastContainer/>
        </>
    )
}

export default ListMenu