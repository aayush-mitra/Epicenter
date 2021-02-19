const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const UserSchema = require('./models/UserSession');
const Conversation = require('./models/Conversation');


const users = require('./routes/api/users');
const conversations = require('./routes/api/conversations');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "http://138.68.12.208",
    methods: ["GET", "POST"]
  }
});

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Mongo
const db = require('./config/keys').mongoURI;
mongoose
    .connect(db)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err))

app.use(express.static("public", {}));

app.use('/api/users', users);
app.use('/api/conversations', conversations);

let port = process.env.PORT || 80;

io.on("connection", (socket) => {
    console.log('new client connected');
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        
    });

    socket.on('conversation-created', () => {
        socket.broadcast.emit("refresh-convo");
    })

    socket.on('message-sent', (roomId) => {
        io.in(roomId).emit('refresh-convo')
    })
});

app.get('/', (req, res) => {
    res.send('hello world');
})

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});