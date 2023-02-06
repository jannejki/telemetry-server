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
    req.logOut((e) => {
        console.log('logout: ', e);
    });

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
    if (process.env.ADMIN === 'FALSE') {
        return next();
    } else if (req.isAuthenticated() && req.user.PRIVILEGE == 'admin') {
        return next();
    } else {
        res.sendStatus(401);
    }
}


export { loginPage, loginCredentials, logout, checkAuthenticated, checkAuthorized }