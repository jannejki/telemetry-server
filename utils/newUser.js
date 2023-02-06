'use strict';
import bcrypt from 'bcrypt';
import User from '../apollo/models/userModel';


/**
 * @brief Creates new user to database
 * @param {username: String, password: Sring} cred Credentials for new user
 * @returns {username: String, password: String, rights: Boolean, _id: String} mongoose model object that is saved to database, password is hashed.
 */
const newUser = async (cred) => {
    return new Promise(async (resolve, reject) => {
        bcrypt.hash(cred.PASSWORD, parseInt(process.env.SALT), async (err, hash) => {
            try {
                const privilege = cred.rights ? 'admin' : 'user';
                const result = await User.create({ NAME: cred.NAME, PASSWORD: hash, PRIVILEGE: privilege });
                resolve(result);
            } catch (err) {
                reject(err);
            }
        });

    });
}


/**
 * @brief hashes password and returns it.
 * @param {String} pwd new password 
 * @returns {String} hashed password
 */
const getNewPassword = async (pwd) => {
    return new Promise(async (resolve) => {
        try {
            bcrypt.hash(pwd, parseInt(process.env.SALT), async (err, hash) => {
                resolve(hash);
            });
        } catch (err) {
            console.log('getNewPassword error: ', err);
            return err;
        }
    });
}


export { newUser, getNewPassword };