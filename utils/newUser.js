'use strict';
import bcrypt from 'bcrypt';
import User from '../apollo/models/userModel';


/**
 * @brief Creates new user to database
 * @param {username: String, password: Sring} cred Credentials for new user
 * @returns {username: String, password: String, rights: Boolean, _id: String} mongoose model object that is saved to database, password is hashed.
 */
const newUser = async(cred) => {
    return new Promise(async(resolve) => {
        try {
            bcrypt.hash(cred.password, parseInt(process.env.SALT), async(err, hash) => {
                const admin = cred.admin || false;
                const result = await User.create({ username: cred.username, password: hash, rights: admin });
                resolve(result);
            });
        } catch (err) {
            console.log('newUser', err);
            return err;
        }
    });
}


/**
 * @brief hashes password and returns it.
 * @param {String} pwd new password 
 * @returns {String} hashed password
 */
const getNewPassword = async(pwd) => {
    return new Promise(async(resolve) => {
        try {
            bcrypt.hash(pwd, parseInt(process.env.SALT), async(err, hash) => {
                resolve(hash);
            });
        } catch (err) {
            console.log('newUser', err);
            return err;
        }
    });
}


export { newUser, getNewPassword };