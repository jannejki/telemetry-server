'use strict';
import mqtt from 'mqtt';
import { saveData } from '../controllers/dataController';
import { parseMessage, calculateValue } from '../controllers/dbcFileController';
import { sendLiveData, sendDebugMessage } from './websocket';


process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const startMQTT = () => {

    const server = process.env.MQTT;
    const clientID = process.env.MQTT_CLIENT;
    const topic = process.env.MQTT_TOPIC;

    const client = mqtt.connect(server, { clientID });


    // connecting to mqtt broker
    client.on('connect', function() {
        console.log('connected to MQTT broker!');
    });


    // subscribe topic
    client.subscribe(topic);


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
}

export default startMQTT;
