'use strict';
// server.js
import express from 'express';
import loginRoute from './routes/loginRoute.js';
import webRoute from './routes/webRoute.js';
import connectMongo from './db/db.js';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import path from 'path';

dotenv.config();

const port = 3000;

/*
const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/login', loginRoute);
app.use('/', webRoute);

app.listen(port, () => { console.log(`app listen on port ${port}`); });

*/
(async() => {
    try {
        const conn = await connectMongo();
        if (conn) {
            console.log('Connected successfully.');
        } else {
            throw new Error('db not connected');
        }
        const app = express();
        app.set('view engine', 'ejs');

        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());
        app.use(bodyParser.raw());
        app.use(express.static(path.join(__dirname, 'public')));

        app.use('/login', loginRoute);
        app.use('/', webRoute);

        app.listen(port, () => { console.log(`app listen on port ${port}`); });

    } catch (e) {
        console.log('server error: ' + e.message);
    }
})();