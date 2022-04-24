'use strict';
import { calculateValue as calculate } from './dbcFileController';
import dataPointModel from '../models/dataPointModel';

const getHistory = (req, res) => {
    console.log('getHistory');
    res.sendStatus(204);
}

const calculateValue = (req, res) => {
    console.log('dataController');
    let values = calculate(req.query);
    res.send({ value: values }).status(204);
}

const saveData = async(parsedMessage) => {
    parsedMessage.forEach(async(msg) => {
        await dataPointModel.create({ CAN: msg.canID, DLC: msg.DLC, data: msg.data });
    });
}

export { getHistory, calculateValue, saveData };