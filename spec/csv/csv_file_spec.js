const CsvFile = require('../../src/csv/csv_file.js');

describe('Csv File', () => {
    
    it('should iterate cell by cell', () => {
        const file = new CsvFile('spec/test-files/test_data.csv');
        
        let cells = [];
        let cell;
        while (cell = file.nextCell()) {
            cells.push(cell);
        }

        expect(cells.length).toEqual(12);
        
        assertCell(cells[0], 10, 0, 0);
        assertCell(cells[1], 50, 1, 0);
        assertCell(cells[2], 22, 2, 0);
        assertCell(cells[3], 34.7, 3, 0);
        assertCell(cells[4], 11, 4, 0);
        assertCell(cells[5], 3, 5, 0);

        assertCell(cells[6], 2, 0, 1);
        assertCell(cells[7], 5.98, 1, 1);
        assertCell(cells[8], 4, 2, 1);
        assertCell(cells[9], 6, 3, 1);

        assertCell(cells[10], 2, 0, 2);
        assertCell(cells[11], 1, 1, 2);
    });

    function assertCell(cell, expectedVal, expectedX, expectedY) {
        expect(cell.value).toEqual(expectedVal);
        expect(cell.x).toEqual(expectedX);
        expect(cell.y).toEqual(expectedY);
    }
})