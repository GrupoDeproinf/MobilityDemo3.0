import React from "react";
import './Card.scss';

const Card = (props) => {
    let className = `card-component ${props.className}`;
    return ( <div className={className}>{props.children}</div> )
}

export default Card;