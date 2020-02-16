import { CellConfig } from '../model/cell-config';

export class VideowallConfig {

    private _squareVideowallConfig: CellConfig[][];
    constructor(private plates: string[]) {
        this._squareVideowallConfig = this.squareVideowallConfigGenerator(plates);
    }

    private squareVideowallConfigGenerator(plates: string[]) {
        const numberOfPlates = plates.length;
        const maxColumns = Math.floor(Math.sqrt(numberOfPlates));
        const squareVideowallConfig = new Array(maxColumns);
        for (let columnIndex = 0; columnIndex < squareVideowallConfig.length; columnIndex++) {
            const row: CellConfig[] = new Array(maxColumns);
            for (let rowIndex = 0; rowIndex < row.length; rowIndex++) {
                const desiredPlateIndex = columnIndex * maxColumns + rowIndex;
                const cellConfig = {plateConfig: [{plate: plates[desiredPlateIndex]}]};
                const desiredRestPlateIndex = maxColumns * maxColumns + columnIndex * maxColumns + rowIndex;
                if (desiredRestPlateIndex < numberOfPlates) {
                    cellConfig.plateConfig.push({plate: plates[desiredRestPlateIndex]});
                }    
                row[rowIndex] = cellConfig;
            }
            squareVideowallConfig[columnIndex] = row;
        }
        return squareVideowallConfig;
    }

    get squareVideowallConfig() {
        return this._squareVideowallConfig;
    }
}