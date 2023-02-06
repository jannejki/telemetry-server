'use strict';
import fs from 'fs';
import DBCMessage from '../utils/DBCMessage.js';
import getTimestamp from '../utils/timestamp.js';

let dbcFile;
let dbcFileName;
const ruleArray = [];


/**
 * @brief loads .dbc file to variable dbcFile for faster use
 * @param {String} wantedDbcFile 
 * @returns {{activeDbc: dbcFileName}} Name of the active dbcFile or { error } if not successful
 */
const loadDbcFile = (wantedDbcFile) => {
    return new Promise((resolve, reject) => {
        fs.readFile('db/dbcFiles/' + wantedDbcFile, 'utf8', async (err, data) => {
            try {
                if (err) {
                    throw err;
                }
                dbcFile = data;
                dbcFileName = wantedDbcFile;
                createDBCMessageObjectsFromDBCFile();
                resolve({ activeDbc: dbcFileName });
            } catch (err) {
                reject({ error: err });
            }
        });
    })
}


/**
 * @brief returns name of the active dbc file
 * @returns {String} Name of the active dbc file
 */
const getActiveFileName = () => {
    return dbcFileName;
}


/**
 * @brief Gets every CAN ID and CAN name from ruleArray
 * @returns {[{canID: String, name: String}]} Array of CAN IDs and names
 */
const getCanNames = () => {
    const names = [];

    ruleArray.forEach((rule) => {
        names.push({ canID: rule.CANID, name: rule.name })
    });

    return ruleArray;
}


/**
 * 
 * @param {{canID:String, data: String}} message Object that contains canID and data strings
 * @returns {[{canID: String, name: String, data: Number, unit: String, min: String, max: String }]} Physical values of message
 */
const hexDataToPhysicalData = (message) => {
    let rules = [];

    for (let msg of ruleArray) {
        if (msg.CANID == message.canID) {
            rules = msg.signals;
            break;
        }
    }

    let valueArray = [];

    rules.forEach(rule => {
        //FIXME create better way to handle error
        if (rule.error) {
            return rule;
        }
        let startBit = parseInt(rule.startBit);
        let length = parseInt(rule.length);

        // extract wanted bits from the message
        let binaryMessage = hexToBin(message.data)
        binaryMessage = binaryMessage.slice(startBit, (startBit + length));

        // create byte array 
        let binaryArray = binaryMessage.split("");
        let byteArray = [];

        while (binaryArray.length > 0) {
            let byte = [];

            for (let i = 0; i < 8; i++) {
                if (binaryArray[0] === undefined) {
                    byte[i] = 0;
                } else {
                    byte[i] = binaryArray[0];
                    binaryArray.shift();
                }
            }
            byteArray.push(byte);
        }

        // reverse bytes if message is little endian
        if (rule.endian == 1) {
            byteArray.reverse();
        }

        // create binaryString from the bytes
        let readyBinaryString = "";
        for (let byte in byteArray) {
            for (let bit in byteArray[byte]) {
                readyBinaryString = readyBinaryString + byteArray[byte][bit].toString();
            }
        }

        // turn binary string to decimal value
        let rawValue = binToDec(readyBinaryString);

        //calculate real physical value
        let value = parseFloat(rule.offset) + parseFloat(rule.scale) * rawValue;

        // push calculated value to array
        valueArray.push({
            canID: message.canID,
            name: rule.name,
            hexData: message.data,
            data: value,
            unit: rule.unit,
            min: rule.min,
            max: rule.max
        })
    })

    return valueArray;
}


/**
 * @brief Gets decoding rules for selected CAN node from dbcFile
 * @param {String} canID finds decoding rules for this CAN ID
 * @returns {[{ name: String, startBit: Number, length: Number, endian: Number, scale: Number, offset: Number, min: Number, max: Number, unit: Number }]} Decoding rules found from .dbc file
 */
const getDecodingRulesFromDBC = (canID) => {
    let index1, index2;
    let signalArray = [];
    const rows = dbcFile.split(/\r\n/);
    // Extract whole decoding rule of the wanted can ID
    try {

        index1 = dbcFile.indexOf("BO_ " + canID + " ");
        // throw error if there is no decoding rule found
        if (index1 === -1) throw "\nNo decoding rule found with can ID: " + canID;
        let split1 = dbcFile.slice(index1);
        index1 = split1.indexOf("\n\r");

        const decodingRule = split1.slice(0, (index1 - 1))
        let signals = decodingRule.split(" SG_ ");

        signals.shift();

        // throw error if there are no signals for can ID
        if (signals.length === 0) throw "No signal syntax for can ID: " + canID;

        // extract values for every signal
        signals.forEach(signal => {
            let splittedFromSpace = signal.split(" ");

            // extracting signal name
            const signalName = splittedFromSpace[0];

            //extracting bitStart, length and endian
            index1 = splittedFromSpace[2].indexOf("|");
            index2 = splittedFromSpace[2].indexOf("@");

            const bitStart = splittedFromSpace[2].slice(0, index1);
            const bitLength = splittedFromSpace[2].slice(index1 + 1, index2);
            const endian = splittedFromSpace[2].slice(index2 + 1);

            // extracting scale and offset
            index1 = splittedFromSpace[3].indexOf(",");
            index2 = splittedFromSpace[3].indexOf(")");

            const scale = splittedFromSpace[3].slice(1, index1);
            const offset = splittedFromSpace[3].slice(index1 + 1, index2);

            // extracting min and max
            index1 = splittedFromSpace[4].indexOf("|");
            index2 = splittedFromSpace[4].indexOf("]");

            const min = splittedFromSpace[4].slice(1, index1);
            const max = splittedFromSpace[4].slice(index1 + 1, index2);

            // extracting unit
            let unit = splittedFromSpace[5];

            while (unit.indexOf('"') !== -1) {
                unit = unit.replace('"', "");
            }

            // gets signal comments
            const commentRows = rows.filter((row) => {
                return row.startsWith("CM_ SG_ ");
            });

            const comments = [];
            commentRows.forEach((row) => {
                if (row.startsWith(`CM_ SG_ ${canID} ${signalName}`)) {
                    let msg = row.slice(row.indexOf(`"`) + 1, row.indexOf(`";`));
                    comments.push(msg);
                }
            })

            // pushing values to json array
            signalArray.push({
                name: signalName,
                startBit: bitStart,
                length: bitLength,
                endian: endian,
                scale: scale,
                offset: offset,
                min: min,
                max: max,
                unit: unit,
                comments: comments
            })
        })

        return signalArray;

    } catch (error) {
        console.log('getDecodingRulesFromDBC:', error);
        // if something went wrong, return this
        return [{ error: error, value: undefined }]
    }
}

/**
 * @brief Splits hexadecimal messages to json objects that contains canID, message length and data in hexadecimal value.
 * @param {String} message Hexadecimal string from car
 * @returns {[{canID: String, DLC: Number, data: String, timestamp: String}]} Array of the objects, each object holds indiviudal canID message from car
 */
const parseMessage = (message) => {
    const byteArray = [];
    const messageArray = [];
    const timestamp = getTimestamp();

    // Split message to bytes
    for (let i = 0; i < message.length; i += 2) {
        byteArray.push([message[i], message[i + 1]]);
    }

    try {
        while (byteArray.length > 0) {

            // get first two bytes from array and convert them to can ID 
            let canID = (byteArray[0].concat(byteArray[1])).join("");
            canID = parseInt(canID);
            // Get next byte for DLC (tells how long data part is)
            let dlc = byteArray[2].join("");
            dlc = hexToBin(dlc);
            dlc = binToDec(dlc);

            byteArray.splice(0, 3);

            // Get as many data bytes from message as dlc tells
            let data = "";

            for (let i = 0; i < dlc; i++) {
                data += byteArray[0].join("").toUpperCase();
                byteArray.splice(0, 1);
            }
            messageArray.push({ canID: canID.toString(), DLC: dlc, data: data, timestamp: timestamp });
        }
        return messageArray;
    } catch (error) {
        console.log('\n\nparseMessage error: ', error);
        return ({ error: error })
    }
}


export {
    parseMessage,
    hexDataToPhysicalData,
    getCanNames,
    loadDbcFile,
    getActiveFileName,
    getDecodingRulesFromDBC
}






//===============================================================//
//-----------------FUNTIONS ONLY FOR DBC.JS----------------------//
//===============================================================//
/**
 * @brief Creates DBCMessageObjects from dbc file and pushes them to ruleArray
 * @return nothing
 */
const createDBCMessageObjectsFromDBCFile = () => {
    if (ruleArray.length > 0) ruleArray.splice(0, ruleArray.length);

    const rows = dbcFile.split(/\r\n/);

    const messageRows = rows.filter((row) => {
        if (row.startsWith("BO_ ")) {
            return true;
        }
    })

    const commentRows = rows.filter((row) => {
        return row.startsWith("CM_ BO_ ");
    });

    messageRows.forEach((message) => {
        message = message.split(" ");
        let CANID;
        CANID = message[1];
        const HEXID = "0x" + decToHex(CANID);
        const name = message[2].slice(0, message[2].length - 1);
        const DLC = message[3];
        const TXNode = message[4];

        const comments = [];

        commentRows.forEach((row) => {
            if (row.startsWith(`CM_ BO_ ${CANID}`)) {
                let msg = row.slice(row.indexOf(`"`) + 1, row.indexOf(`";`));
                comments.push(msg);
            }
        })

        const obj = new DBCMessage(CANID, HEXID, name, DLC, TXNode, comments);
        obj.getSignals();

        ruleArray.push(obj);
    })
}


/**
 * @brief Converts hexadecimal value to binary value
 * @param {String} src hexadecimal value
 * @returns {String} binary value
 */
const hexToBin = (src) => {
    let mapping = {
        "0": "0000",
        "1": "0001",
        "2": "0010",
        "3": "0011",
        "4": "0100",
        "5": "0101",
        "6": "0110",
        "7": "0111",
        "8": "1000",
        "9": "1001",
        "A": "1010",
        "B": "1011",
        "C": "1100",
        "D": "1101",
        "E": "1110",
        "F": "1111"
    };

    let srcString = src.toString();
    let i;
    let returnString = "";

    for (i = 0; i < srcString.length; i++) {
        returnString += mapping[srcString[i]];
    }
    return returnString;
}


/**
 * @brief Converts binay value to decimal value
 * @param {String} src Binary value
 * @returns {String} Decimal value
 */
const binToDec = (src) => {
    let i;
    let n = 0;
    let srcString = src.toString();
    let returnNum = 0;

    for (i = srcString.length - 1; i >= 0; i--) {
        returnNum += srcString[i] * 2 ** n;
        n++;
    }
    return returnNum;
};


/**
 * @brief Converts binay value to hexadecimal value
 * @param {String} src Binary value 
 * @returns {String} Hexadecimal value
 */
const binToHex = (src) => {
    let mapping = {
        "0000": "0",
        "0001": "1",
        "0010": "2",
        "0011": "3",
        "0100": "4",
        "0101": "5",
        "0110": "6",
        "0111": "7",
        "1000": "8",
        "1001": "9",
        "1010": "A",
        "1011": "B",
        "1100": "C",
        "1101": "D",
        "1110": "E",
        "1111": "F"
    };

    let i;
    let srcString = src.toString();
    let returnString = "";
    let remainder = "";

    for (i = srcString.length; i >= 4; i -= 4) {
        if (i - 4 < srcString.length) {
            returnString = mapping[srcString.substr(i - 4, 4)] + returnString;
        }
    }

    if (i !== 0) {
        remainder = srcString.substr(0, i);

        while (remainder.length < 4) {
            remainder = "0" + remainder;
        }

        returnString = mapping[remainder] + returnString;
    }
    return returnString;
}


/**
 * @brief Converts decimal value to hexadecimal value
 * @param {String} src Decimal value 
 * @returns {String} Hexadecimal value
 */
const decToHex = (src) => {
    let mapping = {
        "0": "0",
        "1": "1",
        "2": "2",
        "3": "3",
        "4": "4",
        "5": "5",
        "6": "6",
        "7": "7",
        "8": "8",
        "9": "9",
        "10": "A",
        "11": "B",
        "12": "C",
        "13": "D",
        "14": "E",
        "15": "F"
    };

    let n = 0;
    let returnString = "";

    while (16 ** (n + 1) < src) {
        n++;
    }

    for (n; n >= 0; n--) {
        if (16 ** n <= src) {
            returnString += mapping[Math.floor(src / 16 ** n).toString()];
            src = src - Math.floor(src / 16 ** n) * (16 ** n);
        } else {
            returnString += "0";
        }
    }
    return returnString;
};
