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

    const ref = useRef()
    const navigate = useNavigate()

    useEffect(()=>{
        document.title='Add Menu Items '
        const token = window.localStorage.getItem('bearer')
        if (token === null)
        {
            navigate('/signin')
        }
    },[])

    // CHANGE HANDLER FUNCTION
    const handleChange=e=>{
        let  {name,value}=e.target
        setMenu({
            ...menu,[name]:value
        })
        setErrors({
            ...errors,[name]:validate(name,value)
        })
    }

    // UPLOAD IMAGE
    const uploadImage=e=>{
        let {name, files}=e.target
        setMenu({
            ...menu,[name]:files[0]
        })
    }

    // INPUT FIELD VALIDATION
    const validate=(name,value)=>{
        let {itemName , price , description , image}=menu
        
        if(name === 'itemName' && value.trim().length ===0)
        {
            setHasError(true)
            return "Menu Item name cannot be empty"
        }
        else if(name === 'description' && value.trim().length ===0)
        {
            setHasError(true)
            return "Menu Item description cannot be empty"
        }
        else if(name === 'price' && value.trim().length ===0)
        {
            setHasError(true)
            return "Price name cannot be empty"
        }
        else
        {            
            setHasError(false)
        }
    }

    // ADD MENU ITEMS BUTTON CLICK HANDLER
    const addItem = e =>{
        e.preventDefault()
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

    // CANCLE BUTTON CLICK HANDLER
    const cancelHandler =e =>{
        setMenu({itemName:'',price:''})
        setErrors({})
    }

    return(
        <>
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