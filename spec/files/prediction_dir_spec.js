const PredictionDir = require('../../src/files/prediction_dir.js');
const rewiremock = require('rewiremock/node');
const path = require('path');

describe('Predictdion Directory', () => {

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

        const pred_dir = new PredDirMocked();

        expect(pred_dir.listPredictions().length).toEqual(2);
    });
});