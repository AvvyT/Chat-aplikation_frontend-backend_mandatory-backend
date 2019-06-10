import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { login$ } from '../store';
import io from "socket.io-client";
const socket = io('http://localhost:3001');

// ** Skriver man i ett specifikt rum ska meddelandet endast visa i rummet.
// ** Chatten ska ha stöd för real-time meddelanden (rekommenderar socket.io).
// ** Meddelanden ska sparas långsiktigt (i en eller flera filer),när startars servern ska allt vara kvar.


function Room() {
    const [message, updateMessage] = useState("");
    const [messages, updateMessages] = useState([]);
    const [room, updateRoom] = useState('');
    const [users, updateUsers] = useState([]);


    // splitta pathname med / så att vi kan separera ut rum id
    const pathSplit = window.location.pathname.split('/');
    // nu har vi en array med 3 delar där sista är vårat id så vi tar ut det
    //console.log(pathSplit);

    const roomId = pathSplit[2];

    useEffect(() => {
        axios
            .get('/room/' + roomId)
            .then(response => {
                console.log(response.data);
                updateRoom(response.data.name);
                updateMessages(response.data.messages);
            })
            .catch(error => {
                console.log(error);
            })
    }, []);

    // new message is sent to the server
    socket.on('message', function (data) {
        // console.log(data);
        messages.push(data);
        updateMessages(messages);
    });

    const sendMessage = (e) => {
        e.preventDefault();
        // ** Varje meddelande har info om vem som skrev det.

        let messageData = { content: message, sender: login$.value, roomId };
        axios
            .post(`/room/${roomId}`, { messageData })
            .then(_ => updateMessage(""))
            .catch(err => console.log(err));

        // ** Varje rum ska ha en lista på alla användare som har skrivit något tidigare.
        const copUsers = [...users];
        const userIdx = copUsers.findIndex(user => user.toLowerCase() === login$.value.toLowerCase());
        if (userIdx === -1) {
            copUsers.push(login$.value);
            updateUsers(copUsers);
        }

        updateMessage('');
    }
    //console.log(messages);

    return (
        <div>
            <h1 style={{ color: 'purple' }}>{room} room</h1>

            {messages.map((message) => (
                <div key={message.id} style={{ border: '1.5px solid blue', width: '350px', borderRadius: '7px', marginBottom: '12px' }}>
                    <h2 style={{ color: '#ff00ff' }}>{message.sender}</h2>
                    <p style={{ color: 'lightgreen' }}> {message.content}</p>
                </div>
            ))}
            <div style={{ position: 'absolute', left: '0', top: '0' }}>
                <h2 style={{ color: 'lightgreen' }}>Users-list</h2>

                {users.map(user => (
                    <p style={{ color: '#FFF0F5' }} key={user}>{user}</p>
                ))}

            </div>
            <form onSubmit={sendMessage}>
                <input minLength={1}
                    maxLength={200}
                    style={{ fontSize: '22px' }}
                    type="text"
                    placeholder=' Type a message..'
                    value={message}
                    onChange={e => {
                        updateMessage(e.target.value);
                    }} />
                <br /><br />
                <button type='submit'
                    style={{ fontSize: '22px', borderRadius: '7px', borderColor: '#ff00ff' }}
                >Send</button>
            </form>

        </div>
    );
}

export default Room;