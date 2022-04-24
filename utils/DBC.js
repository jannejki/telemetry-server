import fs from 'fs';
import getTimestamp from './timestamp.js';
let dbcFile;
let dbcFileName;

/**
 * 
 * @param {String} wantedDbcFile 
 * @returns Name of the active dbcFile or { error } if not successful
 */
const loadDbcFile = (wantedDbcFile) => {
    return new Promise((resolve) => {
        fs.readFile('db/dbcFiles/' + wantedDbcFile, 'utf8', async(err, data) => {
            try {
                if (err) {
                    throw err;
                }

                dbcFile = data;
                dbcFileName = wantedDbcFile;
                resolve({ activeDbc: dbcFileName });
            } catch (err) {
                resolve({ error: err });
            }
        });
    })
}

/**
 * 
 * @returns {String} Name of the active dbc file
 */
const getActiveFileName = () => {
    return dbcFileName;
}

/**
 * 
 * @returns {array} CAN node names that are in the .dbc file
 */
const getCanNames = () => {
    let decodingRules = dbcFile.split("\nBO_ ");
    decodingRules.splice(0, 1);
    for (let i = 0; i < decodingRules.length; i++) {
        if (decodingRules[i].indexOf("\nCM_ ") !== -1) {
            let split = decodingRules[i].split("\nCM_ ");
            decodingRules[i] = split[0];
        }
        if (decodingRules[i].indexOf(" SG_ ") === -1) {
            decodingRules.splice(i, 1);
        }
    }

    let names = [];

    for (let i = 0; i < decodingRules.length; i++) {
        let split = decodingRules[i].split(" ");
        let name = split[1].slice(0, -1);
        names.push({ canID: split[0], name: name });
    }
    return names;
}

/**
 * 
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
 * 
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
 * 
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

/**
 * 
 * @param {{canID:String, data: String}} message Object that contains canID and data strings
 * @returns {array.<{canID: String, name: String, data: Number, unit: String, min: String, max: String }>}
 */
const hexDataToPhysicalData = (message) => {
    const rules = getDecodingRules(message.canID);

    let valueArray = [];
    //FIXME create better way to handle errors
    if (rules.error) {
        return rules;
    }

    // for each signal rule, calculate value
    rules.forEach(rule => {
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
        valueArray.push({ canID: message.canID, name: rule.name, hexData: message.data, data: value, unit: rule.unit, min: rule.min, max: rule.max })
    })
    return valueArray;
}

/**
 * @brief Gets decoding rules for selected CAN node from dbcFile
 * @param {String} canID
 * @returns {array<{ name: String, startBit: Number, length: Number, endian: Number, scale: Number, offset: Number, min: Number, max: Number, unit: Number }>}  
 */
const getDecodingRules = (canID) => {
    let index1, index2;
    let signalArray = [];

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
        if (signals.length === 0) throw "\nNo signal syntax for can ID: " + canID;

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
                unit: unit
            })
        })
        return signalArray;

    } catch (error) {
        console.log(error);
        // if something went wrong, return this
        return { error: error, value: undefined }
    }
}

/**
 * @brief Splits hexadecimal messages to json objects that contains canID, message length and data in hexadecimal value.
 * @param {String} message Hexadecimal string from car
 * @returns Array of json objects
 */
const parseMessage = (message) => {
    const byteArray = [];
    const messageArray = [];
    const timestamp = getTimestamp();

    for (let i = 0; i < message.length; i += 2) {
        byteArray.push([message[i], message[i + 1]]);
    }

    try {
        while (byteArray.length > 0) {
            let canID = (byteArray[0].concat(byteArray[1])).join("");
            canID = hexToBin(canID);
            canID = binToDec(canID);

            let dlc = byteArray[2].join("");
            dlc = hexToBin(dlc);
            dlc = binToDec(dlc);

            byteArray.splice(0, 3);

            let data = "";
            for (let i = 0; i < dlc; i++) {
                data += byteArray[0].join("").toUpperCase();;
                byteArray.splice(0, 1);
            }

            messageArray.push({ canID: canID.toString(), DLC: dlc, data: data, timestamp: timestamp });
        }
        return messageArray;
    } catch (error) {
        console.log(error);
        return ({ error: error })
    }
}

export { parseMessage, hexDataToPhysicalData, getCanNames, loadDbcFile, getActiveFileName }