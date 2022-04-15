'user strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

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

const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}


export { loginPage, loginCredentials, newUser, logout, addNewUser, checkAuthenticated }