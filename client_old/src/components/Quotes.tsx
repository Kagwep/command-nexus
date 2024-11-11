import React from 'react'
import Button from './Button';
import CardTestimonial from './CardTestimonial';
import { Testimonial_1, Testimonial_2, Testimonial_3 } from '../utils/Images';
import '../css/Quotes.scss';


const Quotes = () => {
    const button_info = {
        text: 'Read more testimonials',
        link_text: '', 
        type: 'normal-button' 
    }
    return (
        <section className="quotes-section" id="quotes">
            <div className="quotes-section__left">
                <h4 className="display-2">What people think?</h4>
                
                <h1 className="display-1 glitch-overlay" data-content="PRESS QUOTES">
                    <span>PRESS QUOTES</span>
                </h1>
                <div className="text">
                    <p>
                    Immerse yourself in the world of command-nexus and Web 3. Our mission is to craft an experience that captivates you, ensuring you engage with it daily. We are committed to refining our command-nexus services, listening to your feedback, and integrating cutting-edge Web 3 technology to enhance your gaming journey. Join us as we create a product that not only satisfies your gaming desires but also embraces the decentralized and interactive nature of Web 3.
                    </p>
                </div>
                <Button {...button_info}/>
            </div>
            <div className="quotes-section__right">
            <CardTestimonial testimonial={{
                img_src: Testimonial_1,
                img_name: 'evan img',
                name: 'EVAN LAHTI',
                code_name: 'Web 3 Enthusiast',
                content: 'command-nexus and Web 3 – a perfect blend for immersive gameplay. A highlight of my gaming experience!',
                date: 'December 18, 2023'
            }}/>

            <CardTestimonial testimonial={{
                img_src: Testimonial_2,
                img_name: 'jada img',
                name: 'JADA GRIFFIN',
                code_name: 'Streaming Expert',
                content: 'command-nexus, the next big thing in the world of streaming and survival games. A game-changer!',
                date: 'December 21, 2023'
            }}/>

            <CardTestimonial testimonial={{
                img_src: Testimonial_3,
                img_name: 'aaron img',
                name: 'Aaron Williams',
                code_name: 'Tech Critic',
                content: "command-nexus's integration with Web 3 is revolutionary. An entertaining and decentralized gaming experience!",
                date: 'December 24, 2023'
            }}/>
                
            </div>
        </section>
    )
}

export default Quotes