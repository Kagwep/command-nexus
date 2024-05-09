import React from 'react'
import SliderAbout from './SliderAbout';
import '../css/About.scss';



const About = () => {
    return (
        <section className="about-section" id="about">
            <div className="about-section__left">
                <h4 className="display-2">WHAT IS Command Nexus?</h4>
       
                
                <h5 className="display-1 glitch-overlay" data-content="SOCIAL BATTLE">
                    <span>A Strategy Game</span>
                </h5>
            
                <div className="text-container about-text-info">
                    <p>
                    <strong>"Command Nexus: Tactical War"</strong> is a cutting-edge web-based strategy game that challenges players to dominate a fictional world through tactical prowess and strategic foresight. Leveraging advanced <em>Babylon.js</em> technology, the game delivers an immersive 3D experience, where every decision impacts the balance of power.
                    </p>
                    <p>
                    Players begin with control over a base of operations and must expand their influence by managing resources, building armies, and deploying units strategically across diverse terrains. From dense forests to sprawling deserts, each environment presents unique strategic challenges and opportunities.
                    </p>
                    <p>
                    The game incorporates Web3 technology, allowing players to mint, own, and trade NFTs that represent unique banners and special units, enhancing their strategic options and providing real-world economic value. A dynamic leaderboard tracks player progress, offering rewards and recognition for top strategists.
                    </p>
                    <p>
                    "Command Nexus: Tactical War" not only fosters competitive play but also builds a community of strategists who can share insights, trade assets, and collaborate or compete in ongoing global conflicts.
                    </p>
                </div>
            </div>
            <div className="about-section__right">
                <SliderAbout/>
            </div>
        </section>
    )
}

export default About