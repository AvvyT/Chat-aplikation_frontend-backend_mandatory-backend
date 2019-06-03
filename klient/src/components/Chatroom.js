import React, { useState, useEffect } from 'react';
//import { Link } from "react-router-dom";
import axios from 'axios';
import { Redirect } from "react-router-dom";

function Chatroom() {
    const [room, updateRoom] = useState('room');
    const [inlogadRoom, updateInlogadroom] = useState(false);

    const onChangeRoom = (e) => updateRoom(e.target.value);

    const handleRoom = (status) => {
        updateInlogadroom(!status.inlogadRoom);
    }

    useEffect(() => {
        axios
            .get("/chatrooms")
            .then(response => {
                console.log(response.data);
                updateRoom(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

   /*  if (!inlogadRoom) {
        return <Redirect to="/room" />;
    } */

    return (
        <div>
            <h1>Choose room or create new Room!</h1>

            <h2>Hello {room.data}!</h2>

            <p>Chatroom side...</p>
        </div>
    );
}

export default Chatroom;