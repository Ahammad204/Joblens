import React from 'react';
import Banner from '../Banner/Banner';
import Hilight from '../Highlight/Hilight';
import CallToAction from '../CallToAction/CallToAction';
import Category from '../Category/Category';
import ContactUs from '../ContactUs/ContactUs';


const Home = () => {
    return (
        <>
           <Banner></Banner>
            {/* <Hilight></Hilight> */}
            <Category></Category>
            <CallToAction></CallToAction>
           <ContactUs></ContactUs>
        </>
    );
};

export default Home;