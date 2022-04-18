'use strict';
// server.js
import express from 'express';
import loginRoute from './routes/loginRoute.js';
import webRoute from './routes/webRoute.js';
import settingsRoute from './routes/settingsRoute.js';
import connectMongo from './db/db.js';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import path from 'path';
import flash from 'express-flash';
import session from 'express-session';
import passport from 'passport';
import mqtt from './utils/mqtt';

dotenv.config();

const port = 3000;

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

        app.listen(port, () => { console.log(`app listen on port ${port}`); });
    } catch (e) {
        console.log('server error: ' + e.message);
    }
})();