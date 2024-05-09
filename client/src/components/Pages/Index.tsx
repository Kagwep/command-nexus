import React from 'react'
import Navbar from './Navbar';
import Hero from './Hero';
import CallToAction from './CallToAction';
import Footer from '../Footer';
import Header from '../Header';
import Features from '../Features';
import About from '../About';
import Requirement from '../Requirement';
import NewsletterSection from '../Newsletter';
import Quotes from '../Quotes';
import '../../css/App.scss';


const HomePage = () => {
  return (
        <>
          <Header />
          <About />  
          <Requirement/>
          <NewsletterSection/>
          <Footer/>
        </>
  );
}

export default HomePage;