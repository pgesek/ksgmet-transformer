function calcTimeDimId(hour, minute) {
    if (hour < 0 || hour > 23) {
        throw 'Invalid hour: ' + hour;
    }
    if (minute < 0 || minute > 59) {
        throw 'Invalid minutes: ' + minute;
    }

    return (hour * 60) + minute + 1;
}

module.exports = calcTimeDimId;
