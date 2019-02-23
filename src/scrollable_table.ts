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

        this.recordsDiv.addEventListener('scroll', ev => this.setScrolls());

        root.appendChild(this.rootDiv);

        this.dataSource = dataSource;
    }

    /** rendering table. call when changed something of data source */
    render() {
        this.removeCells();
        this.addCells();
        this.editFixedHeaderCell();
        this.editColumnHeaderCells();
        this.editRowHeaderCells();
        this.editRecordCells();
        this.resizeCell();
    }

    /** remove cell div to fit dimension */
    protected removeCells() {
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

    /** add cell div to fit dimension */
    protected addCells() {
        const dim = this.dataSource.scrollableTableDimensions();
        for (let r = 1; r <= dim.row; r += 1) {
            if (r <= this.rowHeaderDiv.childElementCount) continue;
            this.rowHeaderDiv.appendChild(this.cell());
        }
        for (let c = 1; c <= dim.col; c += 1) {
            if (c <= this.columnHeaderDiv.childElementCount) continue;
            this.columnHeaderDiv.appendChild(this.cell());
        }
        for (let d = 1; d <= dim.det; d += 1) {
            if (d <= this.recordsDiv.childElementCount) continue;
            this.recordsDiv.appendChild(this.cell());
        }
    }

    /** edit one fixed-header cell */
    protected editFixedHeaderCell() {
        const e = this.fixedHeaderDiv.children[0] as HTMLElement;
        const cell = this.dataSource.scrollableTableFixedHeaderCell();
        if (e === undefined) {
            this.fixedHeaderDiv.appendChild(cell.render());
        } else if (e.dataset.key !== cell.key) {
            this.fixedHeaderDiv.replaceChild(cell.render(), e);
        }
    }

    /** edit column-header cells */
    protected editColumnHeaderCells() {
        const dim = this.dataSource.scrollableTableDimensions();
        for (let c = 0; c < dim.col; c += 1) {
            const e = this.columnHeaderDiv.children[c] as HTMLElement;
            if (e === undefined) continue;
            e.style.gridColumn = `${c + 1}`;
            e.style.msGridColumn = `${c + 1}`;
            const cell = this.dataSource.scrollableTableColumnHeaderCell(c);
            if (e.dataset.key !== cell.key) {
                cell.render().style.gridColumn = `${c + 1}`;
                cell.render().style.msGridColumn = `${c + 1}`;
                this.columnHeaderDiv.replaceChild(cell.render(), e);
            }
        }
    }

    /** edit row-header cells */
    protected editRowHeaderCells() {
        const dim = this.dataSource.scrollableTableDimensions();
        for (let r = 0; r < dim.row; r += 1) {
            const e = this.rowHeaderDiv.children[r] as HTMLElement;
            if (e === undefined) continue;
            e.style.gridRow = `${r + 1}`;
            e.style.msGridRow = `${r + 1}`;
            const cell = this.dataSource.scrollabelTableRowHeaderCell(r);
            if (e.dataset.key !== cell.key) {
                cell.render().style.gridRow = `${r + 1}`;
                cell.render().style.msGridRow = `${r + 1}`;
                this.rowHeaderDiv.replaceChild(cell.render(), e);
            }
        }
    }

    /** edit record cells */
    protected editRecordCells() {
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
                    cell.render().style.gridColumn = `${c + 1}`;
                    cell.render().style.msGridColumn = `${c + 1}`;
                    cell.render().style.gridRow = `${r + 1}`;
                    cell.render().style.msGridRow = `${r + 1}`;
                    this.recordsDiv.replaceChild(cell.render(), e);
                }
            }
        }
    }

    /** resize cells to use grid */
    protected resizeCell() {
        const dim = this.dataSource.scrollableTableDimensions();
        this.columnHeaderDiv.style.msGridColumns = '';
        this.columnHeaderDiv.style.gridTemplateColumns = '';
        this.rowHeaderDiv.style.msGridRows = '';
        this.rowHeaderDiv.style.gridTemplateRows = '';

        this.recordsDiv.style.msGridColumns = '';
        this.recordsDiv.style.msGridRows = '';
        this.recordsDiv.style.gridTemplate = '';

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
        this.setScrolls();
    }

    protected setScrolls() {
        this.columnHeaderDiv.scrollLeft = this.recordsDiv.scrollLeft;
        this.rowHeaderDiv.scrollTop = this.recordsDiv.scrollTop;
    }

    /** create cell */
    protected cell(): HTMLElement {
        const e = document.createElement('div');
        e.classList.add(`${ScrollableTable.prefix}-cell`);
        return e;
    }
}
