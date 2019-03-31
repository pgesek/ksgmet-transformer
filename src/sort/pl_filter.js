function plFilter(s3File) {
    return s3File.fileName.startsWith('pl_csv_');
}

module.exports = plFilter;
