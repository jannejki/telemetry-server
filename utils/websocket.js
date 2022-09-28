'use strict';
import { Server } from 'socket.io';
import dataPointModel from '../apollo/models/dataPointModel';
import { calculateValue } from '../controllers/dbcFileController';
import passport from 'passport';

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

let carStatus = false;
let statusTimeout = undefined;
let io;

/**
 * @brief Starts websocket server
 * @param {*} server where the websocket is started 
 * @param {*} session express-session for websocket authentication
 */
const startWs = (server, session) => {
    io = new Server(server);

    io.use(wrap(session));
    io.use(wrap(passport.initialize()));
    io.use(wrap(passport.session()));

    // websocket authentication
    io.use((socket, next) => {
        if (socket.request.user) {
            next();
        } else {
            next(new Error('unauthorized'))
        }
    });

    io.on('connection', async (socket) => {
        sendCarStatus();
        socket.on('disconnect', () => { });
    });
}


/**
 * @brief sends car status to client.
 */
const sendCarStatus = async () => {
    io.emit('carStatus', { carStatus });
}


/**
 * @brief Calculates hexadecimal data to real physical value from param parsedMessage and then sends value array to 'live' channel on websocket 
 * @param {[{canID: String, DLC: Number, data: String, timestamp: String}]} parsedMessage Array of message objects
 */
const sendLiveData = (parsedMessage) => {
    let dataArray = [];
    for (let i in parsedMessage) {
        let calculatedValue = calculateValue(parsedMessage[i]);
        if (!calculatedValue.error) dataArray.push(calculatedValue);
    }
    io.emit('live', { latestMessage: dataArray });
}


/**
 * @biref sends hexadecimal strings to 'debug' channel on ws 
 * @param {String} msg hexadecimal string that car has sent
 */
const sendDebugMessage = (msg) => {
    carStatus = true;

    // If car has not sent anything in 10 seconds,
    // change car status to false
    if (statusTimeout != undefined) {
        clearTimeout(statusTimeout);
    }
    statusTimeout = setTimeout((() => {
        carStatus = false;
        sendCarStatus();
    }), 10000);

    io.emit('debug', { debug: { message: msg }, carStatus: true });
}


export { startWs, sendLiveData, sendDebugMessage };