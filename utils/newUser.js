import bcrypt from 'bcrypt';
import User from '../models/userModel';

const newUser = async(cred) => {
    try {
        bcrypt.hash(cred.password, parseInt(process.env.SALT), function(err, hash) {
            const admin = cred.admin || false;
            const newUser = new User({ username: cred.username, password: hash, rights: admin });
            newUser.save();
        });
        return true;
    } catch (err) {
        console.log('newUser', err);
        return false;
    }
}

export default newUser;