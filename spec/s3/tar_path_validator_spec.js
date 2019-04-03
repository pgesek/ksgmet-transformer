const validateTarPath = require('../../src/s3/tar_path_validator')
const plFilter = fileName => fileName.startsWith('pl_csv_');

describe('Tar path validator', () => {
    it('should reject non tar file', () => {
        const result = validateTarPath('11/ws.txt');
        expect(result).toBeFalsy();
    });

    it('should reject too many path elements', () => {
        const result = validateTarPath('11/13/ws.csv');
        expect(result).toBeFalsy();
    });

    it('should reject too little path elements', () => {
        const result = validateTarPath('pl.tar.gz');
        expect(result).toBeFalsy();
    });

    it('should reject with additional filter', () => {
        const result = validateTarPath('2019/14.tar.gz', plFilter);
        expect(result).toBeFalsy();
    });

    it('should accept without additional filter', () => {
        const result = validateTarPath('2019/14.tar.gz');
        expect(result).toBeTruthy();
    });

    it('should accept with additional filter', () => {
        const result = validateTarPath('2019/pl_csv_14.tar.gz', plFilter);
        expect(result).toBeTruthy();
    });
});