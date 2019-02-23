import {
    ScrollableTableDataSource,
    Dimension,
    TableCell
} from '../../src/index';

export class DataSource implements ScrollableTableDataSource {
    dim = new Dimension(5, 5);
    data: HTMLElement[][] = [];

    constructor() {
        for (let c = 0; c < this.dim.col; c += 1) {
            const d: HTMLElement[] = [];
            for (let r = 0; r < this.dim.row; r += 1) {
                const e = document.createElement('div');
                e.textContent = `record-${c}-${r}`;
                e.classList.add('test-table-cell');
                d.push(e);
            }
            this.data.push(d);
        }
    }

    scrollableTableDimensions(): Dimension {
        return this.dim;
    }
    scrollableTableFixedHeaderCell(): TableCell {
        const cell = new TableCell('fixed-header');
        const e = document.createElement('div');
        e.textContent = 'fixed-header';
        cell.root = e;
        return cell;
    }
    scrollableTableColumnHeaderCell(col: number): TableCell {
        const cell = new TableCell(`col-${col}`);
        const e = document.createElement('div');
        e.textContent = `col-${col}`;
        cell.root = e;
        return cell;
    }
    scrollabelTableRowHeaderCell(row: number): TableCell {
        const cell = new TableCell(`row-${row}`);
        const e = document.createElement('div');
        e.textContent = `row-${row}`;
        cell.root = e;
        return cell;
    }
    scrollabalTableRecordsCell(path: Dimension): TableCell {
        const cell = new TableCell(`record-${path.col}-${path.row}`);
        cell.root = this.data[path.col][path.row];
        return cell;
    }
}
