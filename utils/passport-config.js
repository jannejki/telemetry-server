'use strict';
import User from '../apollo/models/userModel';
import bcrypt from 'bcrypt';


/**
 * @brief Checks if entered username is found from database and then checks if passwords match
 * @param {String} username entered username
 * @param {String} password entered password
 * @param {Function} done callback
 * @returns 
 */
const localStrategy = async(username, password, done) => {
    const users = await User.find({ username: username });

    if (users.length == 0) {
        return done(null, false, { message: 'User or password wrong!' });
    }

    try {
        if (await bcrypt.compare(password, users[0].password)) {
            users[0].password = undefined;
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
const deserialize = (async(user, done) => {
    const foundUser = await User.findById(user._id);
    foundUser.password = undefined;
    return done(null, foundUser);
})


export { localStrategy, serialize, deserialize }