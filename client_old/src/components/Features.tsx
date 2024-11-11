import React from 'react'
import '../css/Features.scss';


const Features = () => {
    return (
        <section className="features-section" id="gamefeature">
            <div className="features-section__content-margin-right"></div>
            <div className="features-section__content">
                <h4 className="display-2">WHAT'S SO SPECIAL?</h4>
                <h1 className="display-1 glitch-overlay" data-content="FEATURES">
                    <span>FEATURES</span>
                </h1>

                <div className="features-accordion">
                    <div className="item-1">
                        <div className="features-accordion-title">
                            <button className="option option-1 activeted"></button>
                            <h2>ADVANCED STRATEGY</h2>
                        </div>
                        <div className="features-accordion-content">
                            <p>
                            Command Nexus: Tactical War elevates strategic gameplay by combining real-time decision-making with long-term tactical planning. Dominate the battlefield by capturing strategic assets and deploying cunning maneuvers to outwit your opponents.
                            </p>
                        </div>
                    </div>
                    <div className="item-2">
                        <div className="features-accordion-title">
                            <span className="option option-2"></span>
                            <h2>BUILD ALLIANCES, SHAPE OUTCOMES</h2>
                        </div>
                        <div className="features-accordion-content">
                            <p>
                            Engage in complex alliances with other commanders. Each alliance or rivalry you form influences the dynamic political landscape of the game, turning every match into a deeply immersive narrative experience.
                            </p>
                        </div>
                    </div>
                    <div className="item-3">
                        <div className="features-accordion-title">
                            <span className="option option-3"></span>
                            <h2>INTERACTIVE ENTERTAINMENT</h2>
                        </div>
                        <div className="features-accordion-content">
                            <p>
                            Delight in a game where every move can be spectated and influenced by an interactive audience. Players and spectators alike contribute to the thrilling atmosphere, making each session a spectacle of strategy and social interaction.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>

    )
}

export default Features