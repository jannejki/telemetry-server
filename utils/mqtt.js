'use strict';
import mqtt from 'mqtt';
import { saveData } from '../controllers/dataController';
import { parseMessage, calculateValue } from '../controllers/dbcFileController';
import { sendLiveData, sendDebugMessage } from './websocket';


process.env.NODE_ENV = process.env.NODE_ENV || 'development';
let clientId;


if (process.env.NODE_ENV == 'development') {
    clientId = 'laptop';
} else {
    clientId = 'server1';
}


const mqttServer = '152.70.178.116:1883';
const client = mqtt.connect(`mqtt:${mqttServer}`, { clientId });


// connecting to mqtt broker
client.on('connect', function() {
    console.log('connected to MQTT broker!');
});


// subscribe topic
client.subscribe("messages");


// receive MQTT messages
client.on('message', async function(topic, message, packet) {
    let msg;

    // Car sends hexadecimal bytes, development sends strings
    if (process.env.NODE_ENV == 'development') {
        msg = message.toString();
    } else {
        msg = message.toString('hex');
    }

    try {
        const parsedMessage = parseMessage(msg);
        sendLiveData(parsedMessage);
        await saveData(parsedMessage);
        sendDebugMessage({ error: null, received: msg });
    } catch (error) {
        console.log("message is corrupted!", error);
        sendDebugMessage({ error: error, received: msg });
    }
});


export default client;