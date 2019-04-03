function validateTarPath(path, additionalFilter) {
    if (!path) {
        return false;
    }

    const split = path.split('/');
    if (split.length !== 2) {
        return false;
    }

    const fileName = split[1];

    if (!fileName.endsWith('.tar.gz')) {
        return false;
    }

    if (additionalFilter && !additionalFilter(fileName)) {
        return false;
    }

    return true;
}

module.exports = validateTarPath;
