import React from "react";
import './NavBar.scss';
import userIcon from '../../assets/icons/user-icon.png';

export const NavBar = () => (
    <div className="nav-bar">
        <div className="nav-bar__menu-icon">☰</div>
        <div className="nav-bar__title">Item Locator</div>
        <div className="nav-bar__user-info">
            Hi, <span className="nav-bar__user-info__name">User</span>
            <img
                    className="nav-bar__user-info__icon"
                    src={userIcon} 
                    alt="user icon" 
            />
        </div>
    </div>
);