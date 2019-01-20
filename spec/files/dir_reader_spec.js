const fs = require('fs');
const os = require('os');
const path = require('path');
const DirReader = require('../../src/util/dir_reader.js');
const del = require('del');

describe('Directory Reader', () => {
    let tmpDir;

    beforeAll(() => {
        tmpDir = fs.mkdtempSync(path.join(
            os.tmpdir(), 'dir_reader_test'));
    });

    afterAll(async () => {
        await del([tmpDir], { force: true});
    });

    it('should list predictions', () => {
        fs.mkdirSync(path.join(tmpDir, 'prognozy'));
        fs.mkdirSync(path.join(tmpDir, 'prognozy/CSV'));
        fs.mkdirSync(path.join(tmpDir, 'prognozy/CSV/poland'));
        fs.mkdirSync(path.join(tmpDir, 'prognozy/CSV/poland/2018'));
        fs.mkdirSync(path.join(tmpDir, 'prognozy/CSV/poland/2018/10'));
        fs.mkdirSync(path.join(tmpDir, 'prognozy/CSV/poland/2018/10/26'));
        fs.mkdirSync(path.join(tmpDir, 'prognozy/CSV/poland/2018/10/26/1'));
        fs.mkdirSync(path.join(tmpDir, 'prognozy/CSV/poland/2018/10/26/2'));
        fs.mkdirSync(path.join(tmpDir, 'prognozy/CSV/poland/2018/10/26/3'));

        const dirs = DirReader.recursivelyFindBottomDirs(
            path.join(tmpDir, 'prognozy/CSV/'));

        expect(dirs.length).toEqual(3);
    });
});