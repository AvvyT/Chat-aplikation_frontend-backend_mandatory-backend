const express = require("express");
const http = require('http');
const app = express();

const server = http.createServer(app);
// Pass a http.Server instance to the listen method
const io = require('socket.io').listen(server);

// The server should start listening
server.listen(3001, function () {
    console.log('listening-requests on port', 3001);
});

app.use(express.json()); // Sparar datan i req.body

let user;
let chatrooms = [];
let currentId = 0;

function generateNewId() { // ge en unic id till my-message
    const rv = `my-message-${currentId}`;
    currentId += 1;
    return rv;
}


app.get('/', function (req, res) {
    if (!req.body) return res.status(500).end();
    res.status(200).json({ chatrooms });
});

app.get('/chatrooms/:id', (req, res) => {
    const id = parseInt(generateNewId(req.params.id));
    if (!id) {
        res.status(400).end(); //  Bad Request
        return;
    }
    const room = chatrooms.find(room => room.id === id);
    if (room) {
        res.json(room);
    } else {
        res.status(404).end(); // clientErr Not Found
    }
});

// make one room
app.post('/chatrooms', function (req, res) {
    if (!req.body) res.status(400).send('Bad Request');
    const body = req.body;

    let room = {
        id: generateNewId(),
        name: body.name,
        allMessages: []
    };
    chatrooms.push(room);

    res.status(201).json(room); // Created
});

// make new message
app.post("/chatrooms/:id/message", (req, res) => {
    const id = parseInt(generateNewId(req.params.id));
    let body = req.body;

    for (let idx in chatrooms) {
        if (chatrooms[idx].id === id) {
            let message = {
                from: user,
                value: body.value,
                id: generateNewId()
            };

            chatrooms[idx].allMessages.push(message);
            res.status(201).send(message); // Created
            return;
        }
    }
    res.status(404).end(); // clientErr Not Found
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




// Handle connection
io.on('connection', function (socket) {
    console.log("Connected succesfully to the socket ...");

    let messages = [
        { title: 'The cure of the Sadness is to play Videogames', date: '04.10.2016' },
    ];

    // Send news on the socket
    socket.emit('message', messages);
});

const PORT = 8080;
app.listen(PORT, function () {
    console.log('listening on', PORT);
});