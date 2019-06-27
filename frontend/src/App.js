import React from 'react'
import PlayGround from './PlayGround';
import Menu from './Menu';
import { Route } from "react-router-dom"

function App() {
    return (
        <>
            <Route path="/" exact component={Menu} />
            <Route path="/playground" component={PlayGround} />
        </>  
    );
}

export default App;