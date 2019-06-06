import React, {useEffect, useState} from 'react';
import axios from 'axios';



function Room() {
    const [room, updateRoom] = useState(false);

    useEffect(() => {
        axios
            .get("/chatrooms/")
            .then(response => {
                console.log(response.data.chatrooms);
                updateRoom(true);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    return (
        <div>
            <h1>Room {room.name}</h1>
            <p>Room side...</p>
        </div>
    );
}

export default Room;