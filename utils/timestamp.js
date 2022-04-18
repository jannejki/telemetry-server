'use strict';

const getTimestamp = () => {
    const today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    let hr = today.getHours();
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


const checkTime = (i) => {
    if (i < 10) {
        i = "0" + i
    };
    return i;
}

export default getTimestamp;