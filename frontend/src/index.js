import React from "react";
import ReactDOM from "react-dom" ;
import Routes from './container/Routes' ;
import 'bootstrap/dist/css/bootstrap.min.css' ;
import "index.scss";
import { BrowserRouter } from "react-router-dom"

ReactDOM.render(<BrowserRouter><Routes/></BrowserRouter>,  document.getElementById("root"));