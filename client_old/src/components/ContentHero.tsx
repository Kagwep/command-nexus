import React, { useEffect } from 'react';
import Button from './Button';
import '../css/ContentHero.scss';



const ContentHero = () => {
    const button_info = {
        text: 'Play now',
        link_text: '/play', 
        type: 'price-button' 
    }


    return (
    <div data-aos="fade-up"> 
        <div className="hero-content">
            <h1 className="hero-content__title-1 glitch-overlay" data-content="COMMAND YOUR NEXUS">
                <span>
                     Every Move Shapes the Battlefield
                </span>
            </h1>
            {/* Uncomment and use the following if you prefer a simpler heading without effects:
            <h1 className="hero-content__title-1">
                COMMAND YOUR NEXUS
            </h1> */}
            <h4 className="hero-content__title-2">Strategize your approach, conquer strategic assets, and assert dominance over your adversaries with every command at <span className='text-green-900'>Nexus</span>.</h4>
            <Button {...button_info}/>
        </div>
    </div>

    )
}

export default ContentHero;