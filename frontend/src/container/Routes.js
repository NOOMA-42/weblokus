import React from 'react'
import PlayGround from './PlayGround';
import Menu from './Menu';
import WebLokus from './PlayBoard' ;
import { Route } from "react-router-dom"

function App() {
    return (
        <>
            <Route path="/" exact component={Menu} />
            <Route path="/playground" component={PlayGround} />
            <Route exact path="/test" component={WebLokus} />
        </>  
    );
}

export default App;