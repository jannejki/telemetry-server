import bcrypt from 'bcrypt';
import User from '../apollo/models/userModel';

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