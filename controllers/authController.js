'use strict';
import jwt from 'jsonwebtoken';

const login = (req, res) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user) {
            res.sendStatus(403);
            return;
        }

        req.login(user, { session: false }, (err) => {
            if (err) {
                res.sendStatus(403);
                return;
            }

            const token = jwt.sign(req.user, 'whatever');
            res.json({ message: 'welcome', user: req.user, token });
        });

    })(req, res);
};


const logout = (req, res) => {
    req.logout();
    res.redirect('/');
}

export { login, logout };