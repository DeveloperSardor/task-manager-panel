import React from 'react';
import "./Navbar.css"
import img from "../../assets/imgs/minepictures.jpg"
const navbar = ({ searchQuery, setSearchQuery }) => {
    const managerData = JSON.parse(localStorage.getItem("managerData"));
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    return (
        <nav className='navbar'>
            <div className="navbar-wrapper d-flex">
            <div className='serachWrapNavbar'>
                <input type="text" value={searchQuery} onChange={e=> setSearchQuery(e.target.value)} placeholder='Vazifalarni qidirish'/>
            </div>
            <div className='profilSettingNavbar'>
                        {/* <span><i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i></span> */}
                    <div className='navimg'><img src={`${BACKEND_URL}/${managerData?.img}`} alt="rasm" /></div>
            </div>
            </div>
        </nav>
    );
};

export default navbar;