const S3PredictionCollection = require('../../src/s3/s3_prediction_collection')
const s3PredictionDir = require('../../src/s3/s3_prediction_dir')


describe('S3 prediction collection', () => {
    
    const predCollection = new S3PredictionCollection([
        new s3PredictionDir(null, '2018_04_04_02', 2),
        new s3PredictionDir(null, '2018_04_04_02', -3),
        new s3PredictionDir(null, '2018_04_04_02', 8),
        new s3PredictionDir(null, '2018_04_04_02', -7),
        new s3PredictionDir(null, '2018_04_04_02', 16),
        new s3PredictionDir(null, '2018_04_04_02', 0),
    ]);

    it('should check if has actual', () => {
        expect(predCollection.hasActual(4)).toBeTruthy();
        expect(predCollection.hasActual(-7)).toBeTruthy();
        expect(predCollection.hasActual(-8)).toBeFalsy();
    });

    it('should return predictable dirs', () => {
        const dirs = predCollection.getPredsWeCanVerify(4);
        expect(dirs.map(dir => dir.predLength)).toEqual(
            [2, 8, 16]);
    });
});