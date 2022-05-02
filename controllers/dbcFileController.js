'use strict';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { loadDbcFile, getCanNames, getActiveFileName, hexDataToPhysicalData, parseMessage as parse, getDecodingRules } from '../utils/DBC.js';
import Settings from '../apollo/models/settingsModel.js';


const activateDBC = async() => {

    try {
        // Load settings from database
        const settings = await Settings.findById(process.env.SETTINGS);
        // Load active dbc file
        const loadedFile = await loadDbcFile(settings.activeDbc);
        if (loadedFile.error) throw loadedFile.error;
        console.log('[dbcFileCtrl] Active dbc-file:', loadedFile);
    } catch (err) {
        console.log('[dbcFileCtr] ', err);
    }
}

/**
 * @brief gets file names from ../db/dbcFiles and sends array of them to client
 * @param {*} req 
 * @param {*} res 
 */
const loadFileNames = async(req, res) => {
    fs.readdir(path.join(__dirname, '../db/dbcFiles'), function(err, files) {
        //handling error
        if (err) {
            return console.log('[dbcFileCtrl] Unable to scan directory: ' + err);
        }
        const fileArray = [];

        //listing all files using forEach
        files.forEach(function(file) {
            if (path.extname(file) == '.dbc') {
                fileArray.push({ filename: file, using: file == getActiveFileName() });
            }
        });
        res.send({ files: fileArray }).status(204);
    });
}


/**
 * @brief Changes active dbc file and updates it to settings
 * @param {*} req 
 * @param {*} res 
 */
const changeActiveFile = async(req, res) => {
    const fileName = req.query.filename;
    console.log('changeACtive');
    try {
        const activeFile = await loadDbcFile(fileName);
        if (activeFile.error) throw activeFile.error;

        const settings = await Settings.findByIdAndUpdate(process.env.SETTINGS, { activeDbc: activeFile.activeDbc });
        if (settings == null) {
            const result = await Settings.create({ activeDbc: activeFile.activeDbc });
            console.log(result);
            res.status(201).send({ result });
        } else {
            res.sendStatus(204);
        }

    } catch (error) {
        console.log('error');
        res.send(error).status(500);
    }
}


/**
 * @biref Gets CAN names from active dbc file
 * @param {*} req 
 * @param {*} res 
 * @returns {[{canID: String, name: String}]} CAN names that are in active dbc file
 */
const loadCanList = (req, res) => {
    return getCanNames();
}


/**
 * @brief Deletes file from db/dbcFiles/ 
 * @param {*} req 
 * @param {*} res 
 */
const deleteDbcFile = (req, res) => {
    const path = 'db/dbcFiles/' + req.body.filename;
    try {
        fs.unlinkSync(path)
        res.sendStatus(204);
    } catch (err) {
        res.sendStatus(500);
        console.log(err);
    }
}


/**
 * @brief Gets decoding rules for param canID
 * @param {String} canID  
 * @returns {[{ name: String, startBit: Number, length: Number, endian: Number, scale: Number, offset: Number, min: Number, max: Number, unit: Number }]} Decoding rules found from .dbc file
 */
const loadCanRules = (canID) => {
    const rules = getDecodingRules(canID);
    return rules;
}


/**
 * @brief calculates raw Data to real values
 * @param {{canID:String, data: String}} rawData Object that contains canID and data strings
 * @returns {[{canID: String, name: String, data: Number, unit: String, min: String, max: String }]} Real values of message
 */
const calculateValue = (rawData) => {
    const realValues = hexDataToPhysicalData(rawData);
    return realValues;
}


/**
 * @brief Parses car message to array of CAN node messages
 * @param {String} carMessage hexadecimal string from car
 * @returns {[{canID: String, DLC: Number, data: String, timestamp: String}]} Array of the objects, each object holds individual canID message from car
 */
const parseMessage = (carMessage) => {
    const parsedMessages = parse(carMessage);
    return parsedMessages;
}


// FIXME: not working yet
const downloadDbcFile = (req, res) => {
    var filePath = "db/dbcFiles/" + req.query.filename; // Or format the path using the `id` rest param
    var fileName = req.query.filename; // The default name the browser will use
    console.log(filePath, fileName);

    res.download(filePath, fileName, function(err) {
        if (err) {
            console.log('download err:', err);
            // Handle error, but keep in mind the response may be partially-sent
            // so check res.headersSent
        } else {
            // decrement a download credit, etc.
            console.log('no errors');
        }
    })
}


export { activateDBC, loadFileNames, changeActiveFile, loadCanList, deleteDbcFile, downloadDbcFile, calculateValue, parseMessage, loadCanRules }