/** type of table dimension */
export class Dimension {
    col: number;
    row: number;
    get det(): number {
        return this.row * this.col;
    }

    constructor(col: number, row: number) {
        this.col = col;
        this.row = row;
    }
}
