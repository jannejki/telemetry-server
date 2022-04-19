'use strict';

const WebSocket = require('ws');
let wss;

const startWs = (server) => {
    wss = new WebSocket.Server({ server: server });
    wss.on('connection', async function connection(ws) {
        console.log('A new Websocket- client Connected!');
        //FIXME: send real car status
        ws.send(JSON.stringify({ carStatus: false }));
    });
}

const sendLiveData = (rawData) => {
    let dataArray = [];
    for (let i in rawData) {
        let calculatedValue = dbcParser.calculateValue(rawData[i]);
        if (calculatedValue.error) throw calculatedValue;
        dataArray.push(calculatedValue);
    }
    wss.clients.forEach(function each(client) {
        client.send(JSON.stringify({ latestMessage: dataArray }));
    });
}

export { startWs, sendLiveData };