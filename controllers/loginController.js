'user strict';
import passport from 'passport';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
//import createNewUser from process.env.NEWUSER;

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

    if (process.env.NODE_ENV === 'production') {
        res.sendStatus(401);
    } else {
        (async() => (await
            import ('../utils/newUser.js')).default(req.body))();
    }
}

const logout = async(req, res) => {
    console.log("logout");
    req.logOut();
    res.redirect('/');
}

export { loginPage, loginCredentials, newUser, logout, addNewUser }