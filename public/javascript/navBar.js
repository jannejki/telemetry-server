// Creating Websocket
const socket = io();


// Websocket channels
const statusChannel = 'carStatus';
const debugChannel = 'debug';

// Global variable for timeout object
let timeout;

// Global variable for carStatus html-element
let carStatus = document.getElementById("carStatus");


// Event listener for messages
socket.on(statusChannel, (msg) => {

    // Checks if there is carStatus -value in message and it is true
    if (msg.carStatus) {
        carActive();
    } else {
        // if there is no carStatus value or it is false, change element class and text
        carNotActive();
    }
});


// Websocket that listens to debug channel
socket.on(debugChannel, (msg) => {
    carActive();
    if (document.getElementById('debug').checked) {
        // print received message to console
        console.log(msg);
    }
});


// Changes navigation bar status to online
const carActive = () => {
    // if timeout is on, clear it
    if (timeout != undefined) {
        clearTimeout(timeout);
    }

    // changing element class and text
    carStatus.setAttribute("class", "active");
    carStatus.innerHTML = "<p>Online</p>";

    // Setting a timeout to one minute.
    timeout = setTimeout(carNotActive, 60000);
}


// Changes navigation bar car status to offline
const carNotActive = () => {
    timeout = undefined;
    carStatus.setAttribute("class", "notActive");
    carStatus.innerHTML = "<p>Offline</p>";
}