import React, { useState } from 'react';
import { Link } from "react-router-dom";
import Room from './Room';

let rooms = []; 
function Chatroom(props) {
    const [room, updateRoom] = useState('room');
    const [inlogadRoom, updateInlogadroom] = useState(false);

    const onChangeRoom = (e) => updateRoom(e.target.value);

    const handleRoom = (status) => {
        updateInlogadroom(!status.inlogadRoom);
    }


    return (
        <div>
            {/* {(!inlogadRoom) ? <Chatroom /> : <Room room={room} />} */}
            <h1>Choose room or create new Room!</h1>
            <h2>Hello {props.username}!</h2>
            <p>Chatroom side...</p>
        </div>
    );
}

export default Chatroom;