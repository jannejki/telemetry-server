'use strict';
import express from 'express';
import loginRoute from './routes/loginRoute.js';
import webRoute from './routes/webRoute.js';
import settingsRoute from './routes/settingsRoute.js';
import dataRoute from './routes/dataRoute.js';
import connectMongo from './db/db.js';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import path from 'path';
import flash from 'express-flash';
import session from 'express-session';
import passport from 'passport';
import mqtt from './utils/mqtt';
import { startWs } from './utils/websocket.js';

dotenv.config();

const port = 3000;

(async() => {
    try {
        const conn = await connectMongo();
        if (conn) {
            console.log('Connected to database!');
        } else {
            throw new Error('db not connected');
        }

        const app = express();
        app.set('view engine', 'ejs');
        app.use(express.static(path.join(__dirname, 'public')));
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());
        app.use(bodyParser.raw());
        app.use(passport.initialize())
        app.use(flash())
        app.use(session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false
        }))
        app.use(passport.session())

        app.use('/login', loginRoute);
        app.use('/', webRoute);
        app.use('/settings', settingsRoute);
        app.use('/data', dataRoute);

        const server = require('http').createServer(app);

        server.listen(port, () => {
            console.log(`Server listening port ${port}`);
        });
        startWs(server);

    } catch (e) {
        console.log('server error: ' + e.message);
    }
})();