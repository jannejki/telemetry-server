import db from '../db/db.js';

// check that params are valid column names from table
const checkParams = async (params, table) => {
    try {

        const cols = await db.columns(table);
        const json = {};

        for (let col of cols) {
            if (params[col.COLUMN_NAME]) {
                json[col.COLUMN_NAME] = params[col.COLUMN_NAME];
            }
        }
        return json;
    } catch (error) {
        throw error;
    }
}

export default checkParams;