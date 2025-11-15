import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../componet/Shared/Navbar/Navbar';
import Footer from '../componet/Shared/Footer/Footer';

const MainLayout = () => {
    return (
        <>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
        </>
    );
};

export default MainLayout;