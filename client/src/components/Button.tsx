
import React, { useContext } from 'react'
import '../css/Button.scss';
import { Link } from 'react-router-dom';

interface ButtonProps {
    text:string;
    type:string;
    link_text:string;
}

const Button:React.FC<ButtonProps> = ({ text, type, link_text }) => {
    
    if (type === 'price-button'){
        return (
            <Link to={link_text}>
            <button className="btn price-button text-slate-100">
                <span>{text}</span>
                
            </button> 
            </Link>
        )
    } else{
        return (
            <Link to={link_text}>
            <button className="btn normal-button text-slate-100">
                <span>{text}</span>
            </button>
            </Link>
        )
    }
}

export default Button;