'use strict';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { loadDbcFile, getCanNames, getActiveFileName, hexDataToPhysicalData, parseMessage as parse, getDecodingRulesFromDBC } from '../models/DBC.js';


const activateDBC = async () => {
    // use fs to read settings.conf
    fs.readFile(path.join(__dirname, '../settings.json'), 'utf8', async (err, data) => {
        try {
            if (err) {
                const settings = { ACTIVE_DBC: "" };
                fs.writeFile(path.join(__dirname, '../settings.json'), JSON.stringify(settings), (err) => {
                    if (err) throw err;
                    console.log('[dbcFileCtrl] Settings file created');
                });

            } else {
                const settings = JSON.parse(data);
                const loadedFile = await loadDbcFile(settings.ACTIVE_DBC);
                if (loadedFile.error) throw loadedFile.error;
                console.log('[dbcFileCtrl] Active dbc-file:', loadedFile);
            }
        } catch (err) {
            console.log('[dbcFileCtrl] ', err);
        }
    });
}

/**
 * @brief gets file names from ../db/dbcFiles and sends array of them to client
 * @param {*} req 
 * @param {*} res 
 */
const loadFileNames = async (req, res) => {
    fs.readdir(path.join(__dirname, '../db/dbcFiles'), function (err, files) {
        //handling error
        if (err) {
            return console.log('[dbcFileCtrl] Unable to scan directory: ' + err);
        }
        const fileArray = [];

        //listing all files using forEach
        files.forEach(function (file) {
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
const changeActiveFile = async (req, res) => {
    const fileName = req.query.filename;
    try {
        const activeFile = await loadDbcFile(fileName);
        if (activeFile.error) throw activeFile.error;
        // update settings.json file
        fs.readFile(path.join(__dirname, '../settings.json'), 'utf8', async (err, data) => {
            if (err) {
                // create settings.json file
                const settings = { ACTIVE_DBC: fileName };

                fs.writeFile(path.join(__dirname, '../settings.json'), JSON.stringify(settings), (err) => {
                    if (err) throw err;
                    console.log('[dbcFileCtrl] Settings file created');
                });

                throw err;
            } else {
                const settings = JSON.parse(data);
                settings.ACTIVE_DBC = fileName;
                fs.writeFile(path.join(__dirname, '../settings.json'), JSON.stringify(settings), (err) => {
                    if (err) throw err;
                    console.log('[dbcFileCtrl] Active dbc-file changed to:', fileName);
                });
            }
        });
        res.sendStatus(204);


    } catch (error) {
        console.log('changeActiveFile error: ', error);
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
        console.log('deleteDbcFile error: ', err);
    }
}


/**
 * @brief Gets decoding rules for param canID
 * @param {String} canID  
 * @returns {[{ name: String, startBit: Number, length: Number, endian: Number, scale: Number, offset: Number, min: Number, max: Number, unit: Number }]} Decoding rules found from .dbc file
 */
const loadCanRules = (canID) => {
    return [];
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

    res.download(filePath, fileName, function (err) {
        if (err) {
            console.log('downloadDbcFile err:', err);
            // Handle error, but keep in mind the response may be partially-sent
            // so check res.headersSent
        } else {
            // decrement a download credit, etc.
            console.log('downloadDbcFile success');
        }
    })
}


export { activateDBC, loadFileNames, changeActiveFile, loadCanList, deleteDbcFile, downloadDbcFile, calculateValue, parseMessage, loadCanRules }