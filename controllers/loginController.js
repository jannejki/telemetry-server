'user strict';
import { newUser as createNewUSer } from '../utils/newUser.js';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const loginPage = async(req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.render('login.ejs')
    }
}

const loginCredentials = async(req, res) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    });
}

const newUser = async(req, res) => {
    res.render('newUser');
}

const addNewUser = async(req, res) => {
    try {
        await createNewUser(req.body);
        res.sendStatus(200);
    } catch (err) {
        console.log('addNewUser', err);
        res.sendStatus(500);
    }
}

const logout = async(req, res) => {
    console.log("logout");
    req.logOut();
    res.redirect('/');
}

const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

const checkAuthorized = (req, res, next) => {
    if (req.isAuthenticated() && req.user.rights) {
        return next();
    } else {
        res.sendStatus(401);
    }
}


export { loginPage, loginCredentials, newUser, logout, addNewUser, checkAuthenticated, checkAuthorized }