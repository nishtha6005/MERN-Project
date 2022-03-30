import axios from 'axios'
import React,{useState, useEffect, useRef}from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddMenu(){
    const [menu,setMenu]=useState({
        itemName:'',price:'',description:'',image:''
    })
    const [hasError,setHasError]=useState(true)
    const [errors,setErrors]=useState({})
    // const[alert,setAlert]=useState({
    //     hasAlert:false,alertMsg:'',alertType:''
    // })

    const ref = useRef()
    const navigate = useNavigate()

    useEffect(()=>{
        document.title='Add Menu Items '
        
        // const timer = setTimeout(() => {
        //     setAlert({hasAlert:false,alertMsg:'',alertType:''});
        //   }, 3000);
        
        const token = window.localStorage.getItem('bearer')
        if (token === null)
        {
            navigate('/signin')
        }
        // return () => clearTimeout(timer);
    },[])

    const handleChange=e=>{
        let  {name,value}=e.target
        setMenu({
            ...menu,[name]:value
        })
        setErrors({
            ...errors,[name]:validate(name,value)
        })
    }

    const uploadImage=e=>{
        let {name, files}=e.target
        setMenu({
            ...menu,[name]:files[0]
        })
        console.log(name,files[0])
    }

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

    const addItem = e =>{
        e.preventDefault()
        // let {itemName,price}=menu
        let formData = new FormData()
        formData.append('image',menu.image)
        formData.append('itemName',menu.itemName)
        formData.append('description',menu.description)
        formData.append('price',menu.price)
        if(!menu.itemName.trim() || !menu.price.trim())
        {
            toast.error("Please fill out all the fields",{
                position: "top-center",
                autoClose: 3000,
            })
        }
        // else if(errors==={})
        // {
        //     console.log("ERROR 2",errors)
        //     setAlert({hasAlert:true,alertMsg:'Please enter valid data',alertType:'alert-danger'})
        //     setErrors({})
        // }
        else
        {
            axios.post('http://localhost:8000/menu/add',formData,
            {
                headers:{
                    authorization:`Bearer ${window.localStorage.getItem('bearer')}`
                }
            })
            .then(res=>{
                toast.success("Menu item added successfully",{
                    position: "top-center",
                    autoClose: 3000,
                })
                ref.current.value=''
                setMenu({itemName:'',price:'',description:''})
            })
            .catch(error=>{
                console.log(error)
                navigate('/signin')
            })
        }
    }

    const cancelHandler =e =>{
        setMenu({itemName:'',price:''})
        setErrors({})
    }

    return(
        <>
        {/* <br/>
        <div className='row'>
            <div className='col-md-4'></div>
            <div className='col-md-4'>
                {
                    alert.hasAlert && 
                        <div className ={`alert ${alert.alertType} text-center`} role="alert">
                            {alert.alertMsg}
                        </div>
                }   
            </div>
            <div className='col-md-4'></div>
        </div> */}

        <div className='box-model'>
            <h2 className='m-3'>Add Menu-Item</h2>
            <form method='post'>
                <div className='form-group'>
                    <input 
                        type='text' 
                        className='form-control' 
                        placeholder='Enter Menu-Item Name' 
                        name='itemName' 
                        required
                        value={menu.itemName} 
                        onChange={(e)=>handleChange(e)} 
                    />
                    <p className='text-danger'>{errors.itemName}</p>
                </div>
                <div className='form-group'>
                    <input 
                        type='text' 
                        className='form-control' 
                        placeholder='Enter Description' 
                        name='description' 
                        required
                        value={menu.description} 
                        onChange={(e)=>handleChange(e)} 
                    />
                    <p className='text-danger'>{errors.description}</p>
                </div>
                <div className='form-group'>
                    <input 
                        type='number' 
                        className='form-control' 
                        placeholder='Enter Menu-Item Price' 
                        name='price' 
                        required 
                        value={menu.price} 
                        onChange={(e)=>handleChange(e)}
                    />
                    <p className='text-danger'>{errors.price}</p>
                </div>
                <div className='form-group'>
                    <input 
                        type='file' 
                        className='form-control' 
                        accept="image/*"
                        placeholder='Upload Image' 
                        name='image' 
                        ref={ref}
                        encType="multipart/form-data"
                        onChange={(e)=>uploadImage(e)} 
                    />
                    <p></p>
                </div>
                <div className='form-group'>
                    <button 
                        type="submit" 
                        className="btn btn-success btn-block mx-4" 
                        disabled={hasError}
                        onClick={(e)=>addItem(e)}> Add Item
                    </button>
                    <button 
                        type="reset" 
                        className="btn btn-danger btn-block mx-4"
                        onClick={(e)=>cancelHandler(e)}> Cancel
                    </button>
                </div>
            </form>
        </div>
        <ToastContainer/>
        </>
    )
}

export default AddMenu