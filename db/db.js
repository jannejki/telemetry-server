import mariadb from 'mariadb';
let pool;
let conn;

const db = {
    connect: async () => {
        try {
            pool = mariadb.createPool({host: process.env.DB_HOST, user: process.env.DB_USER, password:process.env.DB_PWD, database: process.env.DB_NAME, connectionLimit: 5});
            conn = await pool.getConnection();
            return conn;
        }catch(error) {
            console.log(error);
            return false;
        }
    },

    query: (sql) => {
        return new Promise(async (resolve, reject) => {
            // regex query to remove spaces where there are two or more in a row and new lines
            const someText = sql.replace(/(\r\n|\n|\r|\s\s+)/gm, " ");
            try {
                const result = await conn.query(sql);
                delete result.meta;
                resolve(result);
            } catch (error) {
                const msg = _customErrorMessage(error);
                reject(msg);
            }
        });
    },

    columns: (table) => {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await conn.query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${table}'`);
                delete result.meta;
                resolve(result);
            } catch (error) {
                const msg = _customErrorMessage(error);
                reject(msg);
            }
        });
    }
}

export default db;

//===============================================================//
//---------------------private functions-------------------------//
//===============================================================//
const _customErrorMessage = (error) => {
    const userErrors = [1054, 1146, 1064];
    if (userErrors.includes(error.errno)) {
        return { mariadb: { mariadb_err_code: error.errno, mariadb_err: error.code }, http_status: 400, status: 123, message: error.text, debug: error }
    } else {
        return { mariadb: { mariadb_err_code: error.errno, mariadb_err: error.code }, http_status: 500, status: 232,  message: error.text, debug: error }
    }
}