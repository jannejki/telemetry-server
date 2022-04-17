'use strict';

import multer from 'multer';
import fs from 'fs';
import path from 'path';
import DBCparser from '../utils/DBC.js';

const dbcParser = new DBCparser();
dbcParser.loadDbcFile('CAN0 (1).dbc');


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
            return console.log('Unable to scan directory: ' + err);
        }
        const fileArray = [];

        //listing all files using forEach
        files.forEach(function(file) {
            if (path.extname(file) == '.dbc') {
                fileArray.push({ filename: file, using: file == dbcParser.dbcFileName });
            }
        });

        res.send({ files: fileArray }).status(204);
    });
}

const changeActiveFile = async(req, res) => {
    const fileName = req.query.filename;
    try {
        // lets the dbcParser to load file to use
        dbcParser.loadDbcFile(fileName);

        // changes from database the active file. This is for the server to know what was the last 
        // file that was in use before restarting the server

        // FIXME: save active dbc filename to database 
        // await db("activeSettings").where({ name: "dbcFile" }).update({ status: fileName });
        res.sendStatus(204);
    } catch (error) {
        res.send(error).status(500);
    }
}

const loadCanList = (req, res) => {
    res.send({ canList: dbcParser.getCanNames() }).status(204);
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
            console.log('toimii');
        }
    })
}


export { loadFileNames, changeActiveFile, loadCanList, deleteDbcFile, downloadDbcFile }