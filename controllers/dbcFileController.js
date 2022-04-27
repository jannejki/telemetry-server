'use strict';

import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { loadDbcFile, getCanNames, getActiveFileName, hexDataToPhysicalData, parseMessage as parse, getDecodingRules } from '../utils/DBC.js';
import Settings from '../apollo/models/settingsModel.js';

const activeFileId = "625e5c7fd9444459f400f658";


(async() => {
    const settings = await Settings.findById(activeFileId);
    try {
        const loadedFile = await loadDbcFile(settings.activeDbc);
        if (loadedFile.error) throw loadedFile.error;
        console.log('[dbcFileCtrl] Active dbc-file:', loadedFile);
    } catch (err) {
        console.log('[dbcFileCtr] ', err);
    }
})();

// FIXME: upload files here
/*
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../db/dbcFiles');
    },
    filename: (req, file, cb) => {
        const { originalname } = file;
        cb(null, originalname);
    }
})

const upload = multer({ storage })

const saveFile = (req, res, next) => {
    try {
        upload.single(req.file);
        res.sendStatus(200);
    } catch (err) {
        console.log('error: ', err);
        res.sendStatus(500);
    }
}
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

const changeActiveFile = async(req, res) => {
    const fileName = req.query.filename;
    try {
        const activeFile = await loadDbcFile(fileName);
        if (activeFile.error) throw activeFile.error;

        await Settings.findByIdAndUpdate(activeFileId, { activeDbc: activeFile.activeDbc });
        res.sendStatus(204);

    } catch (error) {
        res.send(error).status(500);
    }
}

const loadCanList = (req, res) => {
    return getCanNames();
    //res.send({ canList: getCanNames() }).status(204);
}

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

const loadCanRules = (canID) => {
    const rules = getDecodingRules(canID);
    return rules;
}

const calculateValue = (rawData) => {
    const realValues = hexDataToPhysicalData(rawData);
    return realValues;
}

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

export { loadFileNames, changeActiveFile, loadCanList, deleteDbcFile, downloadDbcFile, calculateValue, parseMessage, loadCanRules }