import React, {useEffect,useState} from "react";
import { Link, useLocation } from 'react-router-dom'

function Navbar(){
    // const [bearer,setbearer]=useState('')
    // const [isAdmin, setIsAdmin]=useState()

    var isAdmin = window.localStorage.getItem("admin")
    console.log(isAdmin)
    
    useEffect(()=>{
        // var isAdmin = window.localStorage.getItem("admin")
        // const token = window.localStorage.getItem("bearer")
        // const admin = window.localStorage.getItem("admin")
        // console.log("admin", admin)
        // console.log("bearer", token)
        // setbearer(token)
        // setIsAdmin(admin)
    })

    
    return(
        <>
            <nav className="navbar navbar-expand-md navbar-dark bg-dark">
                <div className="container-fluid">
                <Link className="navbar-brand mx-3" to="/"><h3>Cafe App</h3></Link>
                <button 
                    className="navbar-toggler ms-auto" 
                    type="button" 
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseNavbar">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="navbar-collapse collapse" id="collapseNavbar">
                    <ul className="navbar-nav ms-auto">  
                        <li className="nav-item">
                            <Link 
                                className="nav-link" 
                                to="/" 
                                data-bs-target="#myModal" 
                                data-bs-toggle="modal">Home
                            </Link>
                        </li>
                        {
                            isAdmin === 'true' &&
                            <>
                                <li className="nav-item">
                                    <Link 
                                        className="nav-link" 
                                        to="/admin/add-menu" 
                                        data-bs-target="#myModal" 
                                        data-bs-toggle="modal">Add Menu
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link 
                                        className="nav-link" 
                                        to="/admin" 
                                        data-bs-target="#myModal" 
                                        data-bs-toggle="modal">All Menus
                                    </Link>
                                </li>
                            </>
                        }
                        {
                            isAdmin === 'false' &&
                            <li className="nav-item">
                                <Link 
                                    className="nav-link" 
                                    to="/menu-items"
                                    data-bs-target="#myModal" 
                                    data-bs-toggle="modal">Menu
                                </Link>
                            </li> 
                        }
                                                
                        {
                            isAdmin == null ?
                            // bearer === null || bearer === '' ?
                            <li className="nav-item">
                                <Link 
                                    className="nav-link" 
                                    to="/signin" 
                                    data-bs-target="#myModal" 
                                    data-bs-toggle="modal">Sign In
                                </Link>
                            </li>
                            :
                            <li className="nav-item">
                                <Link 
                                    className="nav-link" 
                                    to="/signout" 
                                    data-bs-target="#myModal" 
                                    data-bs-toggle="modal">Sign Out
                                </Link>
                            </li>
                        }
                    
                    </ul>
                </div>
                </div>
            </nav>
            
        </>
    )

}

export default Navbar