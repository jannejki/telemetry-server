'user strict';
import path from 'path';

const loginPage = async (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.render('../public/views/login.ejs')
    }
}


const loginCredentials = async (req, res) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    });
}


const logout = async (req, res) => {
    req.logOut();
    res.redirect('/');
}

/**
 * @brief Checks if user is logged in
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns next() if user is logged in, otherwise redirects client to /login
 */
const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}


/**
 * @brief Checks if user has admin rights
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns next() if user has admin rights, otherwise sends http status 401 (unauthorized)
 */
const checkAuthorized = (req, res, next) => {
    process.env.ADMIN = process.env.ADMIN || 'TRUE';
    if (process.env.ADMIN == 'TRUE') {
        if (req.isAuthenticated() && req.user.rights) {
            return next();
        } else {
            res.sendStatus(401);
        }
    } else {
        return next();
    }
}


export { loginPage, loginCredentials, logout, checkAuthenticated, checkAuthorized }