'use strict';
import { calculateValue as calculate } from './dbcFileController';
import dataValueModel from '../apollo/models/dataValueModel';
import dataPointModel from '../apollo/models/dataPointModel';

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
        const realDatas = calculate(msg);
        const dataValueModels = await Promise.all(
            realDatas.map(async(data) => {
                const result = await dataValueModel.create({ hexValue: data.hexData, decValue: data.data, unit: data.unit });
                return result._id;
            })
        );
        await dataPointModel.create({ CAN: msg.canID, DLC: msg.DLC, data: dataValueModels, timestamp: msg.timestamp });
    });
}

export { getHistory, calculateValue, saveData };