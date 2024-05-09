import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import Scroll from 'react-scroll';
import logo from '../assets/images/logo.png'
import '../css/Footer.scss';


const Footer = () => {

    const ScrollLink = Scroll.Link;
    return (
        <footer>
            <div className="content-1">
                <ScrollLink to="main">
                    <img src={logo} alt="logo"/>
                </ScrollLink>

                <div className="site-map">
                    <ul className="site-map__list">
                        <li>
                            <ScrollLink to="main"
                                spy={true} 
                                smooth={true} 
                                duration={500}
                                >
                                Main
                            </ScrollLink>
                        </li>
                        <li><ScrollLink to="about"

                                spy={true} 
                                smooth={true} 
                                duration={500}
                                >
                                About
                            </ScrollLink>
                        </li>
                        <li>
                            <ScrollLink to="gamefeature"
                                spy={true} 
                                smooth={true} 
                                duration={500}
                                >
                                Game Feautures
                            </ScrollLink>
                        </li>
                        <li>
                            <ScrollLink to="systemrequirements"
                                spy={true} 
                                smooth={true} 
                                duration={500}>System Requirements
                            </ScrollLink>
                        </li>
                        <li>
                            <ScrollLink to="quotes"

                                spy={true} 
                                smooth={true} 
                                duration={500}>
                                Quotes
                            </ScrollLink>
                        </li>
                    </ul>
                </div>

                <span className="social-container">
                    <Link to="#" className="facebook-link">
                        <i className='bx bxl-facebook' ></i></Link>
                    <Link to="#" className="twitter-link">
                        <i className='bx bxl-twitter' ></i></Link>
                    <Link to="#" className="youtube-link">
                        <i className='bx bxl-youtube' ></i></Link>
                    <Link to="#" className="twitch-link">
                        <i className='bx bxl-twitch'></i></Link>
                </span>
            </div>
            <hr/>
            <div className="content-2">
                <span className="copiright">© 2024 Astro Arc Games, Inc. All Rights Reserved</span>
                <div className="author">
                    <span>
                        Made @ 
                        <span className="love"><i className="uil uil-heart"></i></span>by
                        <Link className="author-name" 
                            to="https://github.com/Kagwep">
                            command-nexus
                        </Link>
                    </span>
                </div>
                <div className="site-info">
                    <Link to="#">Privacy Policy</Link><Link to="#">| Terms of Services |</Link><Link to="#">Code of Conduct</Link>
                </div>
            </div>
        </footer>
    )
}

export default Footer