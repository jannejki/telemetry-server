'use strict';
import { calculateValue as calculate } from './dbcFileController';

const getHistory = (req, res) => {
    console.log('getHistory');
    res.sendStatus(204);
}

const calculateValue = (req, res) => {
    console.log('dataController');
    let values = calculate(req.query);
    res.send({ value: values }).status(204);
}


export { getHistory, calculateValue, };