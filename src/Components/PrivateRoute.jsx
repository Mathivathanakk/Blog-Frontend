import { useSelector } from "react-redux";
import React from 'react';
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
    const {currentuser}=useSelector((state)=>state.user)
    return currentuser ? < Outlet/>:<Navigate to='/signin'/>
       
};

export default PrivateRoute;