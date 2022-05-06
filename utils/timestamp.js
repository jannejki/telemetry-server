'use strict';

/**
 * @brief Gets timestamp from the time that function is called
 * @returns {String} timestamp "2022-04-09 09:02:012"
 */
const getTimestamp = () => {
    const today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    let hr = today.getHours() + 2;
    let min = today.getMinutes();
    let sec = today.getSeconds();
    let ms = today.getMilliseconds();

    month = checkTime(month);
    day = checkTime(day);
    hr = checkTime(hr);
    min = checkTime(min);
    sec = checkTime(sec);
    ms = checkTime(ms);

    let timestamp = year + "-" + month + "-" + day + " " + hr + ":" + min + ":" + sec + "." + ms;
    return timestamp;
}


/**
 * @Brief adds 0 in front of param i if i < 10
 * @param {Number} i Value that needs to be checked
 * @returns {String} param i but added 0 in front if i < 10
 */
const checkTime = (i) => {
    if (i < 10) {
        i = "0" + i
    };
    return i;
}


export default getTimestamp;