'user strict';
import passport from 'passport';
import bcrypt from 'bcrypt';
import User from '../models/userModel';

const loginPage = async(req, res) => {
    console.log('loginPage');
    res.render('login.ejs')
}

const loginCredentials = async(req, res) => {
    console.log('loginCred', req.body);
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
    console.log('addNewUser', req.body);

    bcrypt.hash(req.body.password, process.env.SALT, function(err, hash) {
        const newUser = new User({ username: req.body.username, password: hash });
        newUser.save();

    });

    res.sendStatus(200);
}

const logout = async(req, res) => {
    console.log("logout");
    req.logOut();
    res.redirect('/');
}

export { loginPage, loginCredentials, newUser, logout, addNewUser }