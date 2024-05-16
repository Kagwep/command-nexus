import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Scroll from 'react-scroll';
import '../css/Header.scss';
import '../css/Navbar.scss';
import logo from '../assets/images/logo.png'
import { useAppContext } from "../providers/AppProvider";

const Navbar = () => {

    const { address, connection, handleConnetWalletBtnClick, contract,handleWalletDisconnect,disconnectWallet} = useAppContext()


    const [toggleMenu, setToggleMenu] = useState(false);
    const [toggleLang, setToggleLang] = useState(false);
    const [toggleMenuScroll, setToggleMenuScroll] = useState(false);
    const [toggleSkewMenu, settoggleSkewMenu] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const ScrollLink = Scroll.Link;
    const handleToggleMenu = () =>{
        setToggleMenu(!toggleMenu);
        settoggleSkewMenu(!toggleSkewMenu);
    };

    const handleToggleLangContainer = () =>{
        setToggleLang(!toggleLang);
    };
    

    document.addEventListener('scroll', ()=>{
        if (window.scrollY > 600) {
            setToggleMenuScroll(true);
        }else{
            setToggleMenuScroll(false);
        }
    });

    const handleDisconnect = () => {
        // Perform the logic to disconnect the wallet here
        // For example: disconnectWallet();
        console.log('Disconnecting wallet...');
        // Close the modal after performing the disconnect action
        setShowModal(false);
        disconnectWallet();
      };

    return (
        <div className="nav-container m-auto">
            <nav className="navbar">
                <Link to="/" className="logo">
                    <img src={logo} alt="Logo" className="logo"/>
                </Link>
                <div className={`menu-toggle ${toggleMenu ? 'is-active':''} 
                ${toggleMenuScroll ? 'scrolled':''} ${toggleSkewMenu ? 'active':''}`} 
                id="mobile-menu" onClick={handleToggleMenu}>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                </div>
                <ul className={`nav-menu ${toggleMenu ? 'active showMenu':''}`}>
    
                    <li>
                        <Link to="/marketplace"  className='nav-links'>
                            Marketplace
                        </Link>
                    </li>
                    <li>
                        <Link to="/battle-room"  className='nav-links'>
                            Battle Room
                        </Link>
                    </li>
                    <li>
                        <Link to="/leader-board"  className='nav-links'>
                            Leader Board
                        </Link>
                    </li>
                    <li>
                        <Link to="/profiles"  className='nav-links'>
                            Profiles
                        </Link>
                    </li>
{/* 
                    <div className="container-sponsor-inside-nav-menu">
                        <Link to="#">
                            <img src={XboxIcon} alt=""/>
                        </Link>
                        <Link to="#">
                            <img src={Steam} alt=""/>
                        </Link>

                    </div> */}

                </ul>

                <div className="lang-container">
                    <div className="current-lang">
                        <span className="current-lang__name">ENG</span> 
                        <span className="current-lang__toggle" onClick={handleToggleLangContainer}>
                            <i className="uil uil-angle-down"></i>
                        </span>
                    </div>
                    <div className={`lang-option ${toggleLang ? 'active' : ''}`}>
                        <span className="lang-russ">RUS</span>
                        <span className="lang-fra">FRA</span>
                        <span className="lang-deu">DEU</span>
                    </div>
                </div>

                <div>
                    {connection ? (
                        <>
                            {/* <p>Connected Account: {account}</p> */}
                            <button onClick={() => {setShowModal(true); handleDisconnect();}} className="bg-amber-500 hover:bg-amber-300 text-white text-xl font-bold py-2 px-4 border border-amber-500 rounded">Disconnect Wallet</button>
                        </>
                    ) : (
                        <button onClick={handleConnetWalletBtnClick} className="bg-amber-600 hover:bg-amber-300 text-white text-xl font-bold py-2 px-4 border border-amber-700 rounded">Connect Wallet</button>
                    )}
                    {/* Your React component content here */}
                </div>

                {/* <div className="container-sponsor">
                    <Link to="#">
                        <img src={XboxIcon} alt=""/>
                    </Link>
                    <Link to="#">
                        <img src={Steam} alt=""/>
                    </Link>

                </div> */}


                


            </nav>
        </div>
    );   
}

export default Navbar;