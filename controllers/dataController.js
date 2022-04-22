'use strict';
import { calculateValue as calculate } from './dbcFileController';
import canNodeModel from '../models/canNodeModel';
import dataModel from '../models/dataModel';

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
        const node = await canNodeModel.findOne({ canID: msg.canID });

        if (node) {
            await dataModel.create({ canNode: node._id, DLC: msg.DLC, data: msg.data });
        }
    });
}

export { getHistory, calculateValue, saveData };