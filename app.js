'use strict';
import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import path from 'path';
import flash from 'express-flash';
import session from 'express-session';
import passport from 'passport';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageDisabled } from "apollo-server-core";

import loginRoute from './routes/loginRoute.js';
import webRoute from './routes/webRoute.js';
import settingsRoute from './routes/settingsRoute.js';
import dataRoute from './routes/dataRoute.js';
import connectMongo from './db/db.js';
import startMQTT from './utils/mqtt';
import { startWs } from './utils/websocket.js';
import typeDefs from './apollo/schemas/schemaIndex';
import resolvers from './apollo/resolvers/resolverIndex';
import { activateDBC } from './controllers/dbcFileController.js';

dotenv.config();
const port = 3000;

const middlewareSession = session(({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

(async () => {
    try {
        const conn = await connectMongo();
        if (conn) {
            console.log('Connected to database!');
        } else {
            throw new Error('db not connected');
        }

        // express app
        const app = express();
        app.set('view engine', 'ejs');
        app.use(express.static(path.join(__dirname, 'public')));
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());
        app.use(bodyParser.raw());
        app.use(passport.initialize());
        app.use(flash());
        app.use(middlewareSession);

        app.use(passport.session());
        app.use('/login', loginRoute);
        app.use('/', webRoute);
        app.use('/settings', settingsRoute);
        app.use('/data', dataRoute);


        // Apollo graphql server
        const apolloServer = new ApolloServer({
            typeDefs,
            resolvers,
            plugins: [
                ApolloServerPluginLandingPageDisabled()
            ],
            context: async ({ req, res }) => {
                if (process.env.NODE_ENV === 'development') {
                    return { user: true };
                } else {
                    const user = req.user || false;
                    return { user };
                }
            },
        });

        await apolloServer.start();
        apolloServer.applyMiddleware({ app });


        // Server
        const server = require('http').createServer(app);
        server.listen(port, () => {
            console.log(`Server listening port ${port}`);
        });

        // websocket
        startWs(server, middlewareSession);

        // MQTT
        startMQTT();

        // DBC
        activateDBC();

    } catch (e) {
        console.log('server error: ' + e.message);
    }
})();