import db from '../../db/db.js';
import checkParams from '../../utils/checkParams.js';

const user = {
    find: async (params = null) => {
        try {
            let SQL;
            if (params != null) {
                params = await checkParams(params, 'USERS');
                if (Object.keys(params).length < 1) return false;
                SQL = 'SELECT * FROM USERS';
                if (Object.keys(params).length > 0) SQL += ' WHERE ';

                let i = 0;
                for (const key in params) {
                    if (i > 0) SQL += ' AND ';
                    SQL += `${key} = '${params[key]}'`;
                    i++;
                }
            } else {
                SQL = 'SELECT * FROM USERS';
            }

            const result = await db.query(SQL);
            return result;
        } catch (error) {
            console.log('error in user.find');
            return error;
        }
    },

    create: async (params) => {
        try {
            params = await checkParams(params, 'USERS');
            if (Object.keys(params).length < 1) return false;

            let SQL = 'INSERT INTO USERS (';

            let i = 0;
            for (const key in params) {
                if (i > 0) SQL += ', ';
                SQL += key;
                i++;
            }

            SQL += ') VALUES (';

            i = 0;
            for (const key in params) {
                if (i > 0) SQL += ', ';
                SQL += `'${params[key]}'`;
                i++;
            }

            SQL += ')';
            const result = await db.query(SQL);
            if (result.affectedRows < 1) throw new Error('No rows affected');
            const createdUser = await user.find({ NAME: params.NAME });
            return createdUser[0];
        } catch (error) {
            throw error;
        }
    },

    delete: async (params) => {
        try {
            const userToDelete = await user.find(params);
            if(userToDelete.length < 1) throw new Error('No user found');
            params = await checkParams(params, 'USERS');
            if (Object.keys(params).length < 1) return false;

            let SQL = 'DELETE FROM USERS WHERE ';

            let i = 0;
            for (const key in params) {
                if (i > 0) SQL += ' AND ';
                SQL += `${key} = '${params[key]}'`;
                i++;
            }

            const result = await db.query(SQL);
            if (result.affectedRows < 1) throw new Error('No rows affected');
            return userToDelete[0];
        } catch (error) {
            throw error;
        }
    },


    edit: async (ID, params) => {

        const userToEdit = await user.find({ID});
        if(userToEdit.length != 1) throw new Error('No specific User found');

        try {
            params = await checkParams(params, 'USERS');
            if (Object.keys(params).length < 1) return false;

            let SQL = 'UPDATE USERS SET ';

            let i = 0;
            for (const key in params) {
                if (i > 0) SQL += ', ';
                SQL += `${key} = '${params[key]}'`;
                i++;
            }

            SQL += ' WHERE ID = ' + ID;
            const result = await db.query(SQL);
            if (result.affectedRows < 1) throw new Error('No rows affected');
            const editedUser = await user.find({ ID});
            return editedUser[0];
        } catch (error) {
    
            throw error;
        }
    }


}

export default user;

/*import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, unique: true },
    password: { type: String, required: true },
    rights: { type: Boolean, required: true }
});

export default mongoose.model('User', userSchema);*/