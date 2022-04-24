'use strict';
import mqtt from 'mqtt';
import { saveData } from '../controllers/dataController';
import { parseMessage, calculateValue } from '../controllers/dbcFileController';

import Data from '../models/dataModel';
import { sendLiveData, sendDebugMessage } from './websocket';

const mqttServer = '152.70.178.116:1883';
//const mqttServer = '127.0.0.1:1883';
const clientId = 'server';

const client = mqtt.connect(`mqtt:${mqttServer}`, { clientId });

// connecting to mqtt broker
client.on('connect', function() {
    console.log('connected to MQTT broker!');
});

// subscribe topic
client.subscribe("messages");

// receive MQTT messages
client.on('message', async function(topic, message, packet) {
    try {
        const parsedMessage = parseMessage(message.toString());
        console.log(parsedMessage);
        sendLiveData(parsedMessage);
        await saveData(parsedMessage);
        sendDebugMessage({ error: null, received: message.toString('hex') });
    } catch (error) {
        console.log("message is corrupted!");
        // console.log(error);
        sendDebugMessage({ error: error, received: message.toString('hex') });
    }
});

export default client;