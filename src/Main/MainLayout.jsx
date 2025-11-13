import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../componet/Shared/Navbar/Navbar';

const MainLayout = () => {
    return (
        <>
            <Navbar></Navbar>
            <Outlet></Outlet>
        </>
    );
};

export default MainLayout;