const express = require("express");
const http = require('http');
const app = express();
const rooms = require("./rooms.json");
//const usersnames = require("./usersnames.json");
const uuid = require('uuid/v1');
const fs = require("fs");

/* --------*Conect to server*--------- */
const server = http.createServer(app);
// Pass a http.Server instance to the listen method
const io = require('socket.io')(server);

// The server should start listening
server.listen(3001, function () {
    console.log('listening-requests on port', 3001);
});

app.use(express.json()); // Sparar datan i req.body

let user;
let chatrooms = [];

function generateNewId() { // ge en unic id till my-message
    return uuid();
}
console.log(generateNewId());


app.get('/', function (req, res) {
    if (!req.body) return res.status(500).end();
    res.status(200).json({ chatrooms });
});

app.get("/chatrooms", (_, res) => {
    console.log(rooms);

    res.status(200).send(rooms);
});

app.get('/room/:id', (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(400).end(); //  Bad Request
        return;
    }
    const room = rooms.chatrooms.find(room => room.id === id);
    if (room) {
        res.json(room);
    } else {
        res.status(404).end(); // clientErr Not Found
    }
});

// make new room
app.post('/chatrooms', function (req, res) {
    if (!req.body) res.status(400).send('Bad Request');
    const body = req.body;
    const name = body.name;

    // - alla rum ska ha ett unikt namn.
    const roomIdx = rooms.chatrooms.findIndex(room => room.name.toLowerCase() === name.toLowerCase());
    console.log("post index:" + roomIdx);

    // -udvika skicka tomt namn
    if (name.length === 0) {
        res.status(406).send("You most write a name"); // Not Acceptable
        return;
    }
    // -1 betyder att rummet inte finns i rooms.chatrooms
    // -1 får man alltid när man FindIndex metoden inte hittar det man letar efter i arrayen
    // t.ex 2 betyder att det fanns ett rum med samma namn på index 2 i rooms.chatrooms
    if (roomIdx !== -1) {
        // roomIdx är inte -1. Detta betyder att rummet redan finns 
        res.status(409).end(console.log("The name alredy exists!")); // Conflict
        return;
    }
    let room = {
        id: generateNewId(),
        name: body.name,
        messages: []
    };
    rooms.chatrooms.push(room);

    let json = JSON.stringify(rooms);
    console.log('string-data:...' + json);

    fs.writeFile('rooms.json', json, (err) => {
        if (err) {
            res.status(500).end();
            return;
        }
        console.log('Data written to file');
    });
    console.log('This is after the write call');

    res.status(201).end(); // Created
});

// make new message
app.post("/room/:id", (req, res) => {
    let body = req.body.messageData;

    if (!body || !body.content || !body.sender) {
        res.status(400).end();
        return;
    }

    //rooms id
    const id = req.params.id;

    //skapar ny meddelande
    let message = {
        id: generateNewId(),
        sender: body.sender,
        content: body.content
    };

    let room = rooms.chatrooms.find(room => room.id === id);
    room.messages.push(message);

    fs.writeFile('rooms.json', JSON.stringify(rooms), (err) => {
        if (err) {
            res.status(500).end();
            return;
        }
        console.log('Data written efter newMessege');
        io.emit('message', message);
        res.status(201).send(message); // Created
    });
});

app.post("/login", (req, res) => {
    let body = req.body;

    if (body.user) {
        user = body.user;
        res.status(200).send(user);
    } else {
        res.status(401).end(); // Unauthorized
    }
});

app.delete("/chatrooms/:id", (req, res) => {
    const id = req.params.id;

    if (!id) {
        res.status(400).end(); // klientErr-Bad Request
        return;
    }

    const roomIdx = rooms.chatrooms.findIndex(room => room.id === id);
    console.log("delete index:" + roomIdx);

    if (roomIdx !== -1) {
        rooms.chatrooms.splice(roomIdx, 1);
    }
    // save file
    let json = JSON.stringify(rooms);
    console.log('delete: string-data:...' + json);

    fs.writeFile('rooms.json', json, (err) => {
        if (err) {
            res.status(500).end();
            return;
        }
        console.log('Data written efter delete:');
    });
    res.status(204).end(); // No Content
});



/* // Handle connection
io.on('connection', function (socket) {
    console.log("Connected succesfully to the socket ..." + socket);


    socket.on('message', function (message) {
        console.log('incomming message: ' + message)
        socket.emit('message', message);
    });
}); */

