'use strict';
import path from 'path';


const index = async(req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/index.html'));
}


const live = async(req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/live.html'));
}


const history = async(req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/history.html'));
}


const converter = async(req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/converter.html'));
}


const settings = async(req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/settings.html'));
}


const users = async(req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/users.html'));
}

/**
 * @brief Creates new user from req.body 
 * @param {*} req 
 * @param {*} res 
 */
const addNewUser = async(req, res) => {
    try {
        await createNewUser(req.body);
        res.sendStatus(200);
    } catch (err) {
        console.log('addNewUser', err);
        res.sendStatus(500);
    }
}


export { index, live, history, converter, settings, users, addNewUser }