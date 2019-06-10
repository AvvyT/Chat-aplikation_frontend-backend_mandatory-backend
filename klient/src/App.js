import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';

import Login from './components/Login';
import Chatroom from './components/Chatroom';
import Room from './components/Room';


function App() {

  return (

    <Router>
      <div className="App">

        <Route path="/" exact component={Login} />
        <Route path="/chatroom" component={Chatroom} />
        <Route path="/room/:id" component={Room} />

      </div>
    </Router>
  );
}

export default App;
