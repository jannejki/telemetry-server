'use strict';

import { Server } from 'socket.io';
import dataPointModel from '../apollo/models/dataPointModel';
import { calculateValue } from '../controllers/dbcFileController';
import passport from 'passport';

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

let carStatus = false;
let statusTimeout = undefined;
let io;

const startWs = (server, session) => {
    io = new Server(server);

    io.use(wrap(session));
    io.use(wrap(passport.initialize()));
    io.use(wrap(passport.session()));

    io.use((socket, next) => {
        if (socket.request.user) {
            next();
        } else {
            next(new Error('unauthorized'))
        }
    });

    io.on('connection', async(socket) => {
        sendCarStatus();
        socket.on('disconnect', () => {});
    });
}


const sendCarStatus = async() => {
    io.emit('carStatus', { carStatus });
}

const sendLiveData = (parsedMessage) => {
    carStatus = true;

    if (statusTimeout != undefined) {
        clearTimeout(statusTimeout);
    }
    statusTimeout = setTimeout((() => {
        carStatus = false;
        sendCarStatus();
    }), 10000);


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