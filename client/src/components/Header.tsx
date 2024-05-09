import React from 'react';
import Navbar from './Navbar';
import ContentHero from './ContentHero';
import ScrollDown from './ScrollDown';


const Header = () => {
  return (
      <header id="main">
          <div className="glitch">
            <div className="glitch__item"></div>
            <div className="glitch__item"></div>
            <div className="glitch__item"></div>
            <div className="glitch__item"></div>
            <div className="glitch__item"></div>
          </div>
          <Navbar/>
          <ContentHero/>
          <ScrollDown/>
      </header>
  );
}

export default Header;