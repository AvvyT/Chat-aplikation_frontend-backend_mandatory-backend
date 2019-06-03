import React, { useState } from 'react';
import axios from 'axios';
import { Redirect } from "react-router-dom";
import { updateLogin } from '../store';

function Login() {
    // Deklarera flera tillståndsvariabler
    const [username, updateUsername] = useState('');
    const [logad, updateLogad] = useState(false);


    const onChange = (e) => updateUsername(e.target.value);
    const focus = (e) => e.target.select();

    const handleLogin = (e) => {
        e.preventDefault();

        axios.post("/login", { user: username })
            .then(response => {
                console.log(response);
                updateLogin(true);
            })
            .catch((error) => {
                console.log(error);
            })
        updateLogad(true);
        updateUsername('');
    }

    return logad ? (
        <Redirect to="/chatroom" />) :
        (<div className='App'>

            <h1>React Instant Rooms-Chat</h1>
            <h2>Login</h2>
            <input maxLength={11}
                style={{ fontSize: '22px' }}
                type="text"
                placeholder=' Write user name..'
                value={username}
                onClick={focus}
                onChange={e => {
                    updateUsername(e.target.value);
                    onChange(e);
                }}
                required />
            <br />
            <button type='submit'
                style={{ fontSize: '22px', borderRadius: '7px' }}
                onClick={handleLogin} >Login</button>
        </div>
        );
}

export default Login;