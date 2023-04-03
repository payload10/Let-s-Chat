// npm i socket.io-client <--- To install client socket

// This io is just a function that we can call to get an individual socket.
import {io} from "socket.io-client";


const personJoined = document.querySelector("#personJoined");
const messageInput = document.querySelector("#messageInput");
const sendButton = document.querySelector("#sendButton");
const chatScreen = document.querySelector("#chatScreen");
const form = document.querySelector("#form");
const leaveChat = document.querySelector("#leaveChat");
const joinScreen = document.querySelector("#joinScreen");
const inputUserName = document.querySelector("#inputUserName");
const joinButton = document.querySelector("#joinButton");
const header = document.querySelector("#header");
const main = document.querySelector("#main");
const footer = document.querySelector("#footer");

// Toggle chat screen after getting username:
//const newUser = inputUserName.value;

let newUser = prompt("Enter your name");

// Connect to our Server
const socket = io("http://192.168.0.112:7000");


// User Joined Functionality:
const appendUserJoined = (userJoinedMessage) => {

    // Create a div:
    const div = document.createElement("div");
    div.classList.add("flex");
    div.classList.add("flex-col");
    div.classList.add("gap-4");
    div.classList.add("justify-center");
    div.classList.add("items-center");

    // p inside div:
    const p = document.createElement("p");
    p.id = "personJoined";
    p.classList.add("text-sm");
    p.classList.add("md:text-lg");
    p.classList.add("font-semibold");
    p.classList.add("italic");
    p.classList.add("text-gray-400");
    p.innerText = userJoinedMessage;

    // Add p inside of div:
    div.append(p);

    // Add entire div into the chat screen:
    chatScreen.append(div);
};



// Message send Functioanlity to others:
const sendMessagetoAllClients = (username, message) => {

    // Create a div:
    const div = document.createElement("div");
    div.classList.add("flex");
    div.classList.add("flex-col");
    div.classList.add("justify-center");
    div.classList.add("items-center");
    div.classList.add("self-start");
    div.classList.add("mr-4");
    div.classList.add("ml-4");
    div.classList.add("pl-3");
    div.classList.add("pr-3");
    div.classList.add("pt-2");
    div.classList.add("pb-2");
    div.classList.add("md:ml-4");
    div.classList.add("md:mr-4");
    div.classList.add("md:pl-4");
    div.classList.add("md:pr-4");
    div.classList.add("md:pt-3");
    div.classList.add("md:pb-3");
    div.classList.add("w-max");
    div.classList.add("h-max");
    div.classList.add("shadow-xl");
    div.classList.add("rounded-lg");
    div.classList.add("bg-green-300");

    // p inside div (For Username):
    const p = document.createElement("p");
    p.classList.add("self-start");
    p.classList.add("text-xsm");
    p.classList.add("text-black");
    p.innerText = username;

    // h2 inside div (Actual Message from user):
    const h2 = document.createElement("h2");
    h2.classList.add("text-base");
    h2.classList.add("font-semibold");
    h2.classList.add("text-black");
    h2.classList.add("md:text-lg");
    h2.innerText = message;
    
    // Append p and h2 into div:
    div.append(p);
    div.append(h2);

    // Now, append div to the chat screen:
    chatScreen.append(div);
};


// Message send functionality to ourself:
const sendMessageToOurself = (message) => {

    console.log("inside sendMessageToOurself")
    // Create a div:
    const div = document.createElement("div");
    div.classList.add("flex");
    div.classList.add("flex-col");
    div.classList.add("justify-center");
    div.classList.add("items-center");
    div.classList.add("self-end");
    div.classList.add("justify-center");
    div.classList.add("mr-4");
    div.classList.add("pl-3");
    div.classList.add("pr-3");
    div.classList.add("pt-2");
    div.classList.add("pb-2");
    div.classList.add("md:mr-4");
    div.classList.add("md:pl-4");
    div.classList.add("md:pr-4");
    div.classList.add("md:pt-3");
    div.classList.add("md:pb-3");
    div.classList.add("w-max");
    div.classList.add("h-max");
    div.classList.add("shadow-xl");
    div.classList.add("rounded-lg");
    div.classList.add("bg-orange-200");

    // p inside div (For Username):
    const p = document.createElement("p");
    p.classList.add("self-start");
    p.classList.add("text-xsm");
    p.classList.add("text-black");
    p.innerText = "You";

    // h2 inside div (Actual Message from user):
    const h2 = document.createElement("h2");
    h2.classList.add("text-base");
    h2.classList.add("font-semibold");
    h2.classList.add("text-black");
    h2.classList.add("md:text-lg");
    h2.innerText = message;

    // Append p and h2 into div:
    div.append(p);
    div.append(h2);

    // Now, append div to the chat screen:
    chatScreen.append(div);
};


// Single Client connection:
socket.off('connect').on("connect", () => {

    // When user joins emit:
    socket.emit("newUserJoined", newUser);
    appendUserJoined(`You joined the chatroom`);

    // When other person joins the chat:
    socket.off('userJoined').on("userJoined", (newUser) => {

        if(newUser === "") {

            appendUserJoined(`Someone joined the chatroom`);

        } else {

            appendUserJoined(`${newUser} joined the chatroom`);
        }  
    });


    // Add event listener on form for sending a message:
    form.addEventListener("submit", (event) => {

        // Prevent page reload:
        event.preventDefault();
        const userMessage = messageInput.value;
        console.log(userMessage);

        // Emit message to server and display to ourself:
        sendMessageToOurself(userMessage);

        // Send our message to server and clear the input:
        socket.emit("sendMessagetoallClients", userMessage);
        messageInput.value = "";

        // Message from other users, that we need to listen for:
        socket.off('receive').on('receive', (data) => {

            sendMessagetoAllClients(data.user, data.message);
        });

    }, false);  


    // Leave Chat:
    leaveChat.addEventListener("click", (event) => {

        socket.emit("leaveChatRoom");
        appendUserJoined(`You left the chat`);

    }, false);

    // Left message when a user leaves:
    socket.off('exit').on('exit', (data) => {

        appendUserJoined(`${data.user} left the chat`);
    });
});
