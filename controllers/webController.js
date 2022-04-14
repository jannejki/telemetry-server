'use strict';
import path from 'path';

const index = async(req, res) => {
    console.log('index');
    res.sendFile(path.join(__dirname, '../public/html/index.html'));
}

const live = async(req, res) => {
    console.log({ msg: 'live' });
    res.sendFile(path.join(__dirname, '../public/html/live.html'));
}

const history = async(req, res) => {
    console.log({ msg: 'history' });
    res.sendFile(path.join(__dirname, '../public/html/history.html'));
}

const converter = async(req, res) => {
    console.log({ msg: 'converter' });
    res.sendFile(path.join(__dirname, '../public/html/converter.html'));
}

const settings = async(req, res) => {
    console.log({ msg: 'settings' });
    res.sendFile(path.join(__dirname, '../public/html/settings.html'));
}

export { index, live, history, converter, settings }