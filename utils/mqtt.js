'use strict';
import mqtt from 'mqtt';
import { parseMessage } from './DBC';

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
        const test = message.toString();
        const rawData = parseMessage(test);
        //sendLiveData(rawData);
        //saveData(rawData);
        //sendDebugMessage({ error: null, received: message.toString('hex') });
        console.log(rawData);
    } catch (error) {
        console.log("message is corrupted!");
        console.log(error);
        //   sendDebugMessage({ error: error, received: message.toString('hex') });
    }
});

export default client;