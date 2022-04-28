'user strict';
import path from 'path';

const loginPage = async(req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.render('../public/views/login.ejs')
    }
}

const loginCredentials = async(req, res) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    });
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


export { loginPage, loginCredentials, logout, checkAuthenticated, checkAuthorized }