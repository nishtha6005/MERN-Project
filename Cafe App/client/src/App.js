import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import ListMenu from './components/menu/ListMenu';
import Navbar from './components/navbar/Navbar';
import Home from './components/home/Home';
import AddMenu from './components/menu/AddMenu';
import Error404 from './components/error/Error404';
import Menu from './components/menu/Menu';
import SignOut from './components/auth/SignOut';

function App() {
  return (
    <>
    <BrowserRouter>
        <Navbar/>
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/signin' element={<SignIn/>}/>
            <Route path='/signup' element={<SignUp/>}/>
            <Route path='/signout' element={<SignOut/>}/>
            <Route path='/menu-items' element={<Menu/>}/>
            <Route path='/admin' element={<ListMenu/>}/>
            <Route path='/admin/add-menu' element={<AddMenu/>} />
            <Route path='/*' element={<Error404/>}/>
        </Routes>
    </BrowserRouter>
    
    </>
  );
}

export default App;
