'use strict';

import { Server } from 'socket.io';
import { calculateValue } from '../controllers/dbcFileController';

let io;
const startWs = (server) => {
    io = new Server(server);
    io.on('connection', (socket) => {
        sendCarStatus();
        socket.on('disconnect', () => {});
    });
}

const sendCarStatus = () => {
    io.emit('carStatus', { carStatus: false });
}

const sendLiveData = (parsedMessage) => {
    let dataArray = [];
    for (let i in parsedMessage) {
        let calculatedValue = calculateValue(parsedMessage[i]);
        if (!calculatedValue.error) dataArray.push(calculatedValue);
    }
    io.emit('live', { latestMessage: dataArray });
}

const sendDebugMessage = (msg) => {
    io.emit('debug', { debug: { message: msg }, carStatus: true });
}


export { startWs, sendLiveData, sendDebugMessage };