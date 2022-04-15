'use strict';
import express from 'express';
import LocalStrategy from 'passport-local';
import passport from 'passport';
import { loginCredentials, loginPage, logout, newUser, addNewUser } from '../controllers/loginController';
import { localStrategy as local, serialize, deserialize } from '../utils/passport-config';

passport.use(new LocalStrategy(local));
passport.serializeUser(serialize);
passport.deserializeUser(deserialize);

const router = express.Router();

router.get('/', loginPage);

router.post('/', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/newUser', newUser);
router.post('/newUser', addNewUser);
router.get('/logout', logout);

export default router;