'use strict';
import { calculateValue as calculate } from './dbcFileController';
import dataValueModel from '../apollo/models/dataValueModel';
import dataPointModel from '../apollo/models/dataPointModel';


/**
 * @deprecated
 * @param {*} req 
 * @param {*} res 
 */
const getHistory = (req, res) => {
    console.log('getHistory');
    res.sendStatus(204);
}

/**
 * @brief Calculates queried hexadecimal string to real physical value
 * @param {*} req 
 * @param {*} res 
 */
const calculateValue = (req, res) => {
    console.log('dataController');
    let values = calculate(req.query);
    res.send({ value: values }).status(204);
}

/**
 * @brief Saves messages from car to database
 * @param {[{canID: String, DLC: Number, data: String, timestamp: String}]} parsedMessage Array of message objects
 */
const saveData = async(parsedMessage) => {
    parsedMessage.forEach(async(msg) => {
        const realDatas = calculate(msg);

        // saves dataValue objects to database
        const dataValueModels = await Promise.all(
            realDatas.map(async(data) => {
                const result = await dataValueModel.create({ hexValue: data.hexData, decValue: data.data, unit: data.unit });
                return result._id;
            })
        );

        // Saves datapoint to database that has dataValue objects as a data-field's value
        await dataPointModel.create({ CAN: msg.canID, DLC: msg.DLC, data: dataValueModels, timestamp: msg.timestamp });
    });
}


export { getHistory, calculateValue, saveData };