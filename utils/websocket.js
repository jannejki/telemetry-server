'use strict';

import { Server } from 'socket.io';
import dataPointModel from '../apollo/models/dataPointModel';
import { calculateValue } from '../controllers/dbcFileController';

let io;
const startWs = (server) => {
    io = new Server(server);
    io.on('connection', async(socket) => {
        const result = await dataPointModel.find().sort({ _id: -1 }).limit(1);
        const latestMessage = new Date(result[0].timestamp);
        const now = new Date();

        if (Math.abs(now.getTime() - latestMessage.getTime()) > 5000) {
            sendCarStatus(true);
        } else {
            sendCarStatus(false);
        }

        socket.on('disconnect', () => {});
    });
}

const sendCarStatus = async() => {
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