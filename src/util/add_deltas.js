const PREDICTED = '_predicted';
const ACTUAL = '_actual';
const DELTA = '_delta';

function addDeltas(obj) {
    let objCopy = {};
    objCopy = Object.assign(objCopy, obj);

    Object.keys(objCopy).forEach(key => {
        if (key.endsWith(PREDICTED)) {
            const predicted = objCopy[key];
            const actual = objCopy[key.replace(PREDICTED, ACTUAL)];

            if (predicted != null && actual != null) {
                const delta = Math.abs(predicted - actual);
                const deltaStr = Number.parseFloat(delta.toFixed(10)).toString();
                objCopy[key.replace(PREDICTED, DELTA)] = deltaStr;
            }
        }
    });

    return objCopy;
}

module.exports =addDeltas;
