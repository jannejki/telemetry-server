import User from '../apollo/models/userModel';
import bcrypt from 'bcrypt';

const localStrategy = async(username, password, done) => {
    const users = await User.find({ username: username });

    if (users.length == 0) {
        console.log('no user');
        return done(null, false, { message: 'no user found!' });
    }

    try {
        if (await bcrypt.compare(password, users[0].password)) {
            return done(null, users[0]);
        } else {
            console.log('no users found')
            return done(null, false, { message: 'Wrong password' })
        }
    } catch (e) {
        return done(e);
    }
}

const serialize = (user, done) => {
    return done(null, user);
};

const deserialize = (async(id, done) => {
    return done(null, await User.findById(id._id));
})

export { localStrategy, serialize, deserialize }