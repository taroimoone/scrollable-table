import { ScrollableTableDataSource } from './interfaces/index';
import '../src.scss';
import { Dimension } from './models/index';

export class ScrollableTable {
    rootDiv: HTMLElement;
    fixedHeaderDiv: HTMLElement;
    columnHeaderDiv: HTMLElement;
    rowHeaderDiv: HTMLElement;
    recordsDiv: HTMLElement;

    dataSource: ScrollableTableDataSource;

    static prefix = 'scrollable-table';

    /**
     * Initialize scrollable table
     * @param root element of scrollable table root
     * @param dataSource data source class of scrollable table
     *
     * @example
     * const root = document.getElementById('some-root')!;
     * const dataSource = new class implements ScrollableTableDataSource {...}(); // or you can define own class
     * const scrollableTable = new ScrollableTable(root, dataSource);
     */
    constructor(root: HTMLElement, dataSource: ScrollableTableDataSource) {
        this.rootDiv = document.createElement('div');
        this.rootDiv.id = `${ScrollableTable.prefix}-root`;

        this.fixedHeaderDiv = document.createElement('div');
        this.fixedHeaderDiv.className = `
        ${ScrollableTable.prefix}-area ${ScrollableTable.prefix}-fixed-header`;
        this.rootDiv.appendChild(this.fixedHeaderDiv);

        this.columnHeaderDiv = document.createElement('div');
        this.columnHeaderDiv.className = `
        ${ScrollableTable.prefix}-area ${ScrollableTable.prefix}-column-header`;
        this.rootDiv.appendChild(this.columnHeaderDiv);

        this.rowHeaderDiv = document.createElement('div');
        this.rowHeaderDiv.className = `
        ${ScrollableTable.prefix}-area ${ScrollableTable.prefix}-row-header`;
        this.rootDiv.appendChild(this.rowHeaderDiv);

        this.recordsDiv = document.createElement('div');
        this.recordsDiv.className = `
        ${ScrollableTable.prefix}-area ${ScrollableTable.prefix}-records`;
        this.rootDiv.appendChild(this.recordsDiv);

        this.recordsDiv.addEventListener('scroll', ev => {
            this.columnHeaderDiv.scrollLeft = this.recordsDiv.scrollLeft;
            this.rowHeaderDiv.scrollTop = this.recordsDiv.scrollTop;
        });

        root.appendChild(this.rootDiv);

        this.dataSource = dataSource;
    }

    render() {
        this.removeCells();
        this.addCells();
        this.editFixedHeaderCell();
        this.editColumnHeaderCells();
        this.editRowHeaderCells();
        this.editRecordCells();
        this.msResize();
    }

    private removeCells() {
        const dim = this.dataSource.scrollableTableDimensions();
        while (dim.col < this.columnHeaderDiv.childElementCount) {
            const last = this.columnHeaderDiv.lastChild;
            if (last === null) break;
            this.columnHeaderDiv.removeChild(last);
        }
        while (dim.row < this.rowHeaderDiv.childElementCount) {
            const last = this.rowHeaderDiv.lastChild;
            if (last === null) break;
            this.rowHeaderDiv.removeChild(last);
        }
        while (dim.det < this.recordsDiv.childElementCount) {
            const last = this.recordsDiv.lastChild;
            if (last === null) break;
            this.recordsDiv.removeChild(last);
        }
    }

    private addCells() {
        const dim = this.dataSource.scrollableTableDimensions();
        for (let r = 1; r <= dim.row; r += 1) {
            if (r <= this.rowHeaderDiv.childElementCount) continue;
            this.rowHeaderDiv.appendChild(this.cell(undefined, r));
        }
        for (let c = 1; c <= dim.col; c += 1) {
            if (c <= this.columnHeaderDiv.childElementCount) continue;
            this.columnHeaderDiv.appendChild(this.cell(c));
        }
        for (let d = 1; d <= dim.det; d += 1) {
            if (d <= this.recordsDiv.childElementCount) continue;
            this.recordsDiv.appendChild(this.cell());
        }
    }

    private editFixedHeaderCell() {
        const e = this.fixedHeaderDiv.children[0] as HTMLElement;
        const cell = this.dataSource.scrollableTableFixedHeaderCell();
        if (e === undefined) {
            this.fixedHeaderDiv.appendChild(cell.root);
        } else if (e.dataset.key !== cell.key) {
            this.columnHeaderDiv.replaceChild(cell.root, e);
        }
    }

    private editColumnHeaderCells() {
        const dim = this.dataSource.scrollableTableDimensions();
        for (let c = 0; c < dim.col; c += 1) {
            const e = this.columnHeaderDiv.children[c] as HTMLElement;
            if (e === undefined) continue;
            e.style.gridColumn = `${c + 1}`;
            e.style.msGridColumn = `${c + 1}`;
            const cell = this.dataSource.scrollableTableColumnHeaderCell(c);
            if (e.dataset.key !== cell.key) {
                cell.root.style.gridColumn = `${c + 1}`;
                cell.root.style.msGridColumn = `${c + 1}`;
                this.columnHeaderDiv.replaceChild(cell.root, e);
            }
        }
    }

    private editRowHeaderCells() {
        const dim = this.dataSource.scrollableTableDimensions();
        for (let r = 0; r < dim.row; r += 1) {
            const e = this.rowHeaderDiv.children[r] as HTMLElement;
            if (e === undefined) continue;
            e.style.gridRow = `${r + 1}`;
            e.style.msGridRow = `${r + 1}`;
            const cell = this.dataSource.scrollabelTableRowHeaderCell(r);
            if (e.dataset.key !== cell.key) {
                cell.root.style.gridRow = `${r + 1}`;
                cell.root.style.msGridRow = `${r + 1}`;
                this.rowHeaderDiv.replaceChild(cell.root, e);
            }
        }
    }

    private editRecordCells() {
        const dim = this.dataSource.scrollableTableDimensions();
        for (let c = 0; c < dim.col; c += 1) {
            for (let r = 0; r < dim.row; r += 1) {
                const e = this.recordsDiv.children[
                    c * dim.row + r
                ] as HTMLElement;
                if (e === undefined) continue;
                e.style.gridRow = `${r + 1}`;
                e.style.msGridRow = `${r + 1}`;
                e.style.gridColumn = `${c + 1}`;
                e.style.msGridColumn = `${c + 1}`;
                const path = new Dimension(c, r);
                const cell = this.dataSource.scrollabalTableRecordsCell(path);
                if (e.dataset.key !== cell.key) {
                    cell.root.style.gridRow = `${r + 1}`;
                    cell.root.style.msGridRow = `${r + 1}`;
                    cell.root.style.gridColumn = `${c + 1}`;
                    cell.root.style.msGridColumn = `${c + 1}`;
                    this.recordsDiv.replaceChild(cell.root, e);
                }
            }
        }
    }

    private msResize() {
        const dim = this.dataSource.scrollableTableDimensions();
        const maxColumnWidthes: number[] = [];
        for (let c = 0; c < dim.col; c += 1) {
            const record = this.recordsDiv.children[c * dim.row] as HTMLElement;
            const column = this.columnHeaderDiv.children[c] as HTMLElement;
            if (record === undefined || column === undefined) continue;
            const m = Math.max(
                record.getBoundingClientRect().width,
                column.getBoundingClientRect().width
            );
            maxColumnWidthes.push(m);
        }

        const maxRowHeights: number[] = [];
        for (let r = 0; r < dim.row; r += 1) {
            const record = this.recordsDiv.children[r] as HTMLElement;
            const row = this.rowHeaderDiv.children[r] as HTMLElement;
            if (record === undefined || row === undefined) continue;
            const m = Math.max(
                record.getBoundingClientRect().height,
                row.getBoundingClientRect().height
            );
            maxRowHeights.push(m);
        }

        const gridCol = `${maxColumnWidthes.map(v => `${v}px`).join(' ')}`;
        const gridRow = `${maxRowHeights.map(v => `${v}px`).join(' ')}`;

        this.columnHeaderDiv.style.msGridColumns = gridCol;
        this.columnHeaderDiv.style.gridTemplateColumns = gridCol;
        this.rowHeaderDiv.style.msGridRows = gridRow;
        this.rowHeaderDiv.style.gridTemplateRows = gridRow;

        this.recordsDiv.style.msGridColumns = gridCol;
        this.recordsDiv.style.msGridRows = gridRow;
        this.recordsDiv.style.gridTemplate = `${gridRow} / ${gridCol}`;
    }

    private cell(c?: number, r?: number): HTMLElement {
        const e = document.createElement('div');
        e.classList.add(`${ScrollableTable.prefix}-cell`);
        if (c) {
            e.style.gridColumn = `${c}`;
            e.style.msGridColumn = `${c}`;
        }
        if (r) {
            e.style.gridRow = `${r}`;
            e.style.msGridRow = `${r}`;
        }
        return e;
    }
}
