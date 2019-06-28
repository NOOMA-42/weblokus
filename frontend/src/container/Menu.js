import React from 'react'
import { Link } from "react-router-dom"
function Menu (){
    return (
        <>
            <Link to="playground">Play or Return </Link>
            <Link to="ranking">ranking</Link>
        </>  
    );
}

export default Menu;