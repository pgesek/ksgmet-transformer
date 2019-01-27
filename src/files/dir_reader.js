const fs = require('fs');
const path = require('path');

class DirReader {
    
    static recursivelyFindBottomDirs(dir) {
        let foundDirs = [];
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const filePath = path.join(dir, file);
            if (fs.lstatSync(filePath).isDirectory()) {
                const innerDirs = this.recursivelyFindBottomDirs(filePath);
                
                if (innerDirs.length > 0) {
                    foundDirs = foundDirs.concat(innerDirs);
                } else {
                    foundDirs.push(filePath);
                }
            }
        });

        return foundDirs;
    }
}

module.exports = DirReader;
