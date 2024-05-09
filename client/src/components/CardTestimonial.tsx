import React from 'react'
import { Link } from 'react-router-dom';
import '../css/CardTestimonial.scss';

interface testimonial {
    img_src: string;
    img_name: string;
    name: string;
    code_name: string;
    content: string;
    date: string;
}

interface CardTestimonialtestimonial {
    testimonial:testimonial;
}

const CardTestimonial:React.FC<CardTestimonialtestimonial> = (testimonial) => {
    return (
        <div className="card-testimonial">
            <div className="card-testimonial__head">
                <div className="testimonial-img">
                    <img src={testimonial.testimonial.img_src} alt={testimonial.testimonial.img_name}/>
                </div>
                <div className="testimonial-perfil">
                    <span className="testimonial-perfil__name">{testimonial.testimonial.name}</span>
                    <span className="testimonial-perfil__code_name">{testimonial.testimonial.code_name}</span>
                </div>
                <Link className="share-twitter-link" to="#"><i className='bx bxl-twitter'></i></Link>
            </div>
            <div className="card-testimonial__body">
                <p>{testimonial.testimonial.content}</p>
            </div>
            <div className="card-testimonial__date">
                <span>{testimonial.testimonial.date}</span>
            </div>
        </div>
    )
}

export default CardTestimonial