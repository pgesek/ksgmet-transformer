const PredictionDir = require('../../src/files/prediction_dir.js');
const del = require('del');
const fs = require('fs');
const os = require('os');
const path = require('path');
const rewiremock = require('rewiremock/node');

describe('Prediction Directory', () => {
    let tmpDir;

    beforeEach(() => {
        tmpDir = fs.mkdtempSync(path.join(
            os.tmpdir(), 'dir_reader_test'));
    });

    afterEach(async () => {
        await del([tmpDir], { force: true});
    });

    it('should identifyPlEuPredictions', () => {
        const pl_pred_dir = new PredictionDir(
            'C:\\Users\\pgese_000\\AppData\\Local\\Temp\\' + 
            'ksgmet-transformer-fpama1\\' + 
            'pl_csv_2018_10_23.tar'
        );
        const eu_pred_dir = new PredictionDir(
            'C:\\Users\\pgese_000\\AppData\\Local\\Temp\\' + 
            'ksgmet-transformer-fpama1\\' + 
            'europe_long_csv_2018_10_23.tar'
        );

        expect(pl_pred_dir.isPl()).toEqual(true);
        expect(pl_pred_dir.isEurope()).toEqual(false);
        expect(eu_pred_dir.isPl()).toEqual(false);
        expect(eu_pred_dir.isEurope()).toEqual(true);
    });

    it('should list files', () => {
        const PredDirMocked = rewiremock.proxy('../../src/files/prediction_dir.js', () => ({
            '../../src/files/dir_reader.js': {
                'recursivelyFindBottomDirs': () => {
                    if (path.sep === '\\') {
                        return [ 
                            'C:\\test\\prognozy\\CSV\\poland\\2018\\7\\22\\1', 
                            'C:\\test\\prognozy\\CSV\\poland\\2018\\7\\22\\2'
                        ];
                    } else {
                        return [ 
                            '/home/test/prognozy/CSV/poland/2018/7/22/1', 
                            '/home/test/prognozy/CSV/poland/2018/7/22/2' 
                        ];
                    }
                }
            },
            '../../src/files/prediction.js': class {} 
        }));

        const predDir = new PredDirMocked();

        expect(predDir.listPredictions().length).toEqual(2);
    });

    it('should return existing prediction sub dir', () => {
        fs.mkdirSync(path.join(tmpDir, 'prognozy'));
        fs.mkdirSync(path.join(tmpDir, 'prognozy/CSV'));
        fs.mkdirSync(path.join(tmpDir, 'prognozy/CSV/poland'));
        fs.mkdirSync(path.join(tmpDir, 'prognozy/CSV/poland/2018'));
        fs.mkdirSync(path.join(tmpDir, 'prognozy/CSV/poland/2018/11'));
        fs.mkdirSync(path.join(tmpDir, 'prognozy/CSV/poland/2018/11/12'));
        fs.mkdirSync(path.join(tmpDir, 'prognozy/CSV/poland/2018/11/12/9'));
        
        const predictionDir = new PredictionDir(tmpDir);
        const prediction = predictionDir.getPredictionHandle('prognozy/CSV/poland/2018/11/12/9');

        expect(prediction).toBeTruthy();
        expect(prediction.dirPath).toEqual(path.join(tmpDir, 'prognozy/CSV/poland/2018/11/12/9'));
    });

    it('should return null for non-existent sub dir', () => {
        const predictionDir = new PredictionDir(tmpDir);
        const prediction = predictionDir.getPredictionHandle('prognozy/CSV/poland/2018/11/12/9');

        expect(prediction).toBeNull();
    });
});