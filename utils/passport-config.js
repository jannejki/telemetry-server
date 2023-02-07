'use strict';
import User from '../apollo/models/userModel';
import bcrypt from 'bcrypt';
import { getNewPassword } from './newUser';


/**
 * @brief Checks if entered username is found from database and then checks if passwords match
 * @param {String} username entered username
 * @param {String} password entered password
 * @param {Function} done callback
 * @returns 
 */
const localStrategy = async (username, password, done) => {
    try {
        const users = await User.find({ NAME: username });

        if (users.length == 0) {
            return done(null, false, { message: 'User or password wrong!' });
        }
        
        if (await bcrypt.compare(password, users[0].PASSWORD)) {
            users[0].PASSWORD = undefined;
            return done(null, users[0]);
        } else {
            return done(null, false, { message: 'User or password wrong!' })
        }
    } catch (e) {
        return done(e);
    }
}


/**
 * @brief Serialises user
 * @param {{_id: String, username: String, rights: Boolean}} user object that has logged in
 * @param {function} done callback
 * @returns callback
 */
const serialize = (user, done) => {
    return done(null, user);
};


/**
 * @brief Deserializes user. checks if user is found from database, then deletes password from the object before cb
 * @param {{_id: String, username: String, rights: Boolean}} user object that has logged in
 * @param {Function} done callback
 * @returns callback
 */
const deserialize = (async (user, done) => {
    const foundUser = await User.find({ID: user.ID});
    foundUser[0].PASSWORD = undefined;
    return done(null, foundUser[0]);
})


export { localStrategy, serialize, deserialize }