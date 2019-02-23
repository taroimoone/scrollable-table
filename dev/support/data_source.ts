import {
    ScrollableTableDataSource,
    Dimension,
    TableCell
} from '../../src/index';

export class DataSource implements ScrollableTableDataSource {
    dim = new Dimension(50, 50);
    data: string[][] = [];

    constructor() {
        for (let c = 0; c < this.dim.col; c += 1) {
            const d: string[] = [];
            for (let r = 0; r < this.dim.row; r += 1) {
                d.push(`record-${c}-${r}`);
            }
            this.data.push(d);
        }
    }

    scrollableTableDimensions(): Dimension {
        return this.dim;
    }
    scrollableTableFixedHeaderCell(): TableCell {
        const cell = new TableCell('fixed-header');
        cell.root.textContent = 'fixed-header';
        return cell;
    }
    scrollableTableColumnHeaderCell(col: number): TableCell {
        const cell = new TableCell(`col-${col}`);
        cell.root.textContent = `col-${col}`;
        return cell;
    }
    scrollabelTableRowHeaderCell(row: number): TableCell {
        const cell = new TableCell(`row-${row}`);
        cell.root.textContent = `row-${row}`;
        return cell;
    }
    scrollabalTableRecordsCell(path: Dimension): TableCell {
        const cell = new TableCell(this.data[path.col][path.row]);
        cell.root.textContent = this.data[path.col][path.row];
        return cell;
    }
}
