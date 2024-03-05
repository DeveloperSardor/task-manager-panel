import { Route, Routes } from 'react-router-dom';
import HomePage from '../pages/Home/Home';
import Chats from '../pages/Chats/Chats';
import Login from '../pages/Login/Login';
import Users from '../pages/Users/Users';
const index = () => {
    return (
        <>
            <Routes>
                <Route path='/' element={< HomePage />} />
                <Route path='/workers' element={< Users />} />
                <Route path='/login' element={< Login />} />     
                <Route path='/chat/:id' element={< Chats />} />
            </Routes>
        </>  
    );
};

export default index;