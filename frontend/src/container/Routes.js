import React, { Component } from 'react'
import PlayGround from './PlayGround';
import Menu from './Menu';
import { Redirect, BrowserRouter as Router, Route, Switch } from "react-router-dom";

class App extends React.Component {
    render(){ 
       return (
        <div>
            <Switch>
            <Route path="/" exact component={Menu} />
            <Route path="/playground" exact component={PlayGround} />
            
          </Switch>
            
        </div>
         
            
            
    );}
}

export default App;