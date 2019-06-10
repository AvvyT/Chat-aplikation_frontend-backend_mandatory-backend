import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { login$ } from '../store';


function Chatroom() {
    const [rooms, updateRooms] = useState([]);
    const [newRoom, updateNewRoom] = useState([]);

    const onChangeRoom = (e) => updateNewRoom(e.target.value);

    useEffect(() => {
        getRooms();
    }, []);

    const getRooms = () => {
        axios
            .get("/chatrooms")
            .then(response => {
                console.log(response.data);
                updateRooms(response.data.chatrooms);
            })
            .catch(error => {
                console.log(error);
            });
    }

    // ** Man ska kunna skapa och ta bort rum.
    const createRoom = (e) => {
        e.preventDefault();
        let name = newRoom;

        axios.post('/chatrooms', { name })
            .then((response) => {
                console.log(response);
                getRooms();
            })
            .catch((error) => {
                console.log(error);
            })
        updateNewRoom('');
    }

    const handleDelete = (id) => {

        axios.delete(`/chatrooms/${id}`)
            .then((response) => {
                getRooms();
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            })
    }


    return (
        <div>
            <h1 style={{ color: 'purple' }}>Choose room or create new Room!</h1>
            <h2>Hello {login$.value}!</h2>
            <div>
                <form onSubmit={createRoom} >
                    <input maxLength={11}
                        style={{ fontSize: '22px' }}
                        type="text"
                        placeholder=' Write room name..'
                        value={newRoom}
                        onChange={e => {
                            onChangeRoom(e);
                        }} />
                    <br /><br />
                    <button type='submit'
                        style={{ fontSize: '22px', borderRadius: '7px', borderColor: '#ff00ff' }}
                    >Save</button>
                </form>
            </div>

            <div>
                <ul>
                    {rooms.map((room) => (
                        <li style={{ listStyleType: 'none', color: '#FFF0F5' }} key={room.id}>
                            <Link to={`/room/${room.id}`} style={{ color: '#ff00ff' }}>{room.name}</Link>
                            <button style={{
                                marginLeft: '5px', color: 'red', fontSize: '20px', borderRadius: '50%'
                            }}
                                onClick={() => handleDelete(room.id)}
                            >x</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Chatroom;