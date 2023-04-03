// Node server which will handle socket io connection.

// On port 5000 our server will run
const io = require("socket.io")(7000, {

    cors: {
        origin: [
            "http://192.168.0.112:8080",
            "http://localhost:8080"
        ]
    }
});


// Store all the users who are into the chatroom: 
const usersInChatRoom = {};


// Listening for multiple connections. This function will run every single time a client connects to our Server and will give a SOCKET INSTANCE for each client.
io.on("connection", (socket) => {

    console.log(`Connected with ID: ${socket.id}`);   // Unique ID for each client connection
    

    // When new user joins:
    socket.on('newUserJoined', (newUser) => {

        console.log("\n\n");
        console.log("New user joined:", newUser);
        usersInChatRoom[socket.id] = newUser
        console.log(usersInChatRoom);
        socket.broadcast.emit('userJoined', newUser);
    });


    // When user sends a message:
    socket.on('sendMessagetoallClients', (userMessage) => {

        // Emit that client message to all the other clients:
        socket.broadcast.emit('receive', {user: usersInChatRoom[socket.id], message: userMessage});
    });


    // When User leaves th chatroom:
    socket.on("leaveChatRoom", () => {

        socket.broadcast.emit('exit', {user: usersInChatRoom[socket.id]});
        delete usersInChatRoom[socket.id];
    });
    
});
