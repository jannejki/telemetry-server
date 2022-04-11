'use strict';
import path from 'path';

const index = async(req, res) => {
    console.log('index');
    res.sendFile(path.join(__dirname, '../public/index.html'));
}

const live = async(req, res) => {
    console.log({ msg: 'live' });
    res.sendFile(path.join(__dirname, '../public/live.html'));
}

const history = async(req, res) => {
    console.log({ msg: 'history' });
    res.sendFile(path.join(__dirname, '../public/history.html'));
}

const converter = async(req, res) => {
    console.log({ msg: 'converter' });
    res.sendFile(path.join(__dirname, '../public/converter.html'));
}

const settings = async(req, res) => {
    console.log({ msg: 'settings' });
    res.sendFile(path.join(__dirname, '../public/settings.html'));
}

export { index, live, history, converter, settings }