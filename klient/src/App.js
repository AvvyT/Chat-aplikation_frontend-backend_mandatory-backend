import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import './App.css';
//import io from "socket.io-client";

import Login from './components/Login';
import Chatroom from './components/Chatroom';
import Room from './components/Room';


//let currentId = 0;
/*let messages = [];

function generateNewId() { // ge en unic id till my-message
  const rv = `my-message-${currentId}`;
  currentId += 1;
  return rv;
}*/

function App() {

  // Connect to the server
  //this.server = io("http://ec2-13-53-66-202.eu-north-1.compute.amazonaws.com:3000");

  //  a list - allMessages on the server
  /*this.server.on("messages", data => {
      for (let message of data) {
  
        this.addMessage(message);
      }
    });
  
     function addMessage(event) {
      messages = { messages: [...state.messages, event] };
    }*/

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
