import React from 'react'
import Navbar from '../Navbar';
import '../../css/App.scss';
import ProfileHeader from '../ProfileHeader';
import Footer from '../Footer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';
import MarketplaceHero from '../MarketplaceHero';
import Steps from '../Steps/Steps';
import CTA from '../CTA/CTA';
import Banners from '../Banners/Banners';

const MarketplacePage = () => {
  return (
    <div>
        <Navbar />
           < MarketplaceHero />
           <Steps /> 
           <Banners />
           <CTA />
        <Footer />
    </div>
  )
}

export default MarketplacePage