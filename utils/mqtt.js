'use strict';
import mqtt from 'mqtt';
import { parseMessage, calculateValue } from './DBC';
import Data from '../models/dataModel';
import { sendLiveData } from './websocket';

const mqttServer = '127.0.0.1:1883';
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
        const rawData = parseMessage(message.toString());
        const calculatedValues = rawData.map(canData => calculateValue(canData));

        // TODO: send calculatedValues to client via websocket
        sendLiveData(calculatedValues);
        await Data.create(rawData);

    } catch (error) {
        console.log("message is corrupted!");
        console.log(error);
        // sendDebugMessage({ error: error, received: message.toString('hex') });
    }
});

export default client;