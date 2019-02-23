import '../src.scss';
import { Dimension } from './models/index';
var ScrollableTable = /** @class */ (function () {
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
    function ScrollableTable(root, dataSource) {
        var _this = this;
        this.rootDiv = document.createElement('div');
        this.rootDiv.id = ScrollableTable.prefix + "-root";
        this.fixedHeaderDiv = document.createElement('div');
        this.fixedHeaderDiv.className = "\n        " + ScrollableTable.prefix + "-area " + ScrollableTable.prefix + "-fixed-header";
        this.rootDiv.appendChild(this.fixedHeaderDiv);
        this.columnHeaderDiv = document.createElement('div');
        this.columnHeaderDiv.className = "\n        " + ScrollableTable.prefix + "-area " + ScrollableTable.prefix + "-column-header";
        this.rootDiv.appendChild(this.columnHeaderDiv);
        this.rowHeaderDiv = document.createElement('div');
        this.rowHeaderDiv.className = "\n        " + ScrollableTable.prefix + "-area " + ScrollableTable.prefix + "-row-header";
        this.rootDiv.appendChild(this.rowHeaderDiv);
        this.recordsDiv = document.createElement('div');
        this.recordsDiv.className = "\n        " + ScrollableTable.prefix + "-area " + ScrollableTable.prefix + "-records";
        this.rootDiv.appendChild(this.recordsDiv);
        this.recordsDiv.addEventListener('scroll', function (ev) {
            _this.columnHeaderDiv.scrollLeft = _this.recordsDiv.scrollLeft;
            _this.rowHeaderDiv.scrollTop = _this.recordsDiv.scrollTop;
        });
        root.appendChild(this.rootDiv);
        this.dataSource = dataSource;
    }
    ScrollableTable.prototype.render = function () {
        this.removeCells();
        this.addCells();
        this.editFixedHeaderCell();
        this.editColumnHeaderCells();
        this.editRowHeaderCells();
        this.editRecordCells();
        this.msResize();
    };
    ScrollableTable.prototype.removeCells = function () {
        var dim = this.dataSource.scrollableTableDimensions();
        while (dim.col < this.columnHeaderDiv.childElementCount) {
            var last = this.columnHeaderDiv.lastChild;
            if (last === null)
                break;
            this.columnHeaderDiv.removeChild(last);
        }
        while (dim.row < this.rowHeaderDiv.childElementCount) {
            var last = this.rowHeaderDiv.lastChild;
            if (last === null)
                break;
            this.rowHeaderDiv.removeChild(last);
        }
        while (dim.det < this.recordsDiv.childElementCount) {
            var last = this.recordsDiv.lastChild;
            if (last === null)
                break;
            this.recordsDiv.removeChild(last);
        }
    };
    ScrollableTable.prototype.addCells = function () {
        var dim = this.dataSource.scrollableTableDimensions();
        for (var r = 1; r <= dim.row; r += 1) {
            if (r <= this.rowHeaderDiv.childElementCount)
                continue;
            this.rowHeaderDiv.appendChild(this.cell(undefined, r));
        }
        for (var c = 1; c <= dim.col; c += 1) {
            if (c <= this.columnHeaderDiv.childElementCount)
                continue;
            this.columnHeaderDiv.appendChild(this.cell(c));
        }
        for (var d = 1; d <= dim.det; d += 1) {
            if (d <= this.recordsDiv.childElementCount)
                continue;
            this.recordsDiv.appendChild(this.cell());
        }
    };
    ScrollableTable.prototype.editFixedHeaderCell = function () {
        var e = this.fixedHeaderDiv.children[0];
        var cell = this.dataSource.scrollableTableFixedHeaderCell();
        if (e === undefined) {
            this.fixedHeaderDiv.appendChild(cell.root);
        }
        else if (e.dataset.key !== cell.key) {
            this.columnHeaderDiv.replaceChild(cell.root, e);
        }
    };
    ScrollableTable.prototype.editColumnHeaderCells = function () {
        var dim = this.dataSource.scrollableTableDimensions();
        for (var c = 0; c < dim.col; c += 1) {
            var e = this.columnHeaderDiv.children[c];
            if (e === undefined)
                continue;
            e.style.gridColumn = "" + (c + 1);
            e.style.msGridColumn = "" + (c + 1);
            var cell = this.dataSource.scrollableTableColumnHeaderCell(c);
            if (e.dataset.key !== cell.key) {
                cell.root.style.gridColumn = "" + (c + 1);
                cell.root.style.msGridColumn = "" + (c + 1);
                this.columnHeaderDiv.replaceChild(cell.root, e);
            }
        }
    };
    ScrollableTable.prototype.editRowHeaderCells = function () {
        var dim = this.dataSource.scrollableTableDimensions();
        for (var r = 0; r < dim.row; r += 1) {
            var e = this.rowHeaderDiv.children[r];
            if (e === undefined)
                continue;
            e.style.gridRow = "" + (r + 1);
            e.style.msGridRow = "" + (r + 1);
            var cell = this.dataSource.scrollabelTableRowHeaderCell(r);
            if (e.dataset.key !== cell.key) {
                cell.root.style.gridRow = "" + (r + 1);
                cell.root.style.msGridRow = "" + (r + 1);
                this.rowHeaderDiv.replaceChild(cell.root, e);
            }
        }
    };
    ScrollableTable.prototype.editRecordCells = function () {
        var dim = this.dataSource.scrollableTableDimensions();
        for (var c = 0; c < dim.col; c += 1) {
            for (var r = 0; r < dim.row; r += 1) {
                var e = this.recordsDiv.children[c * dim.row + r];
                if (e === undefined)
                    continue;
                e.style.gridRow = "" + (r + 1);
                e.style.msGridRow = "" + (r + 1);
                e.style.gridColumn = "" + (c + 1);
                e.style.msGridColumn = "" + (c + 1);
                var path = new Dimension(c, r);
                var cell = this.dataSource.scrollabalTableRecordsCell(path);
                if (e.dataset.key !== cell.key) {
                    cell.root.style.gridRow = "" + (r + 1);
                    cell.root.style.msGridRow = "" + (r + 1);
                    cell.root.style.gridColumn = "" + (c + 1);
                    cell.root.style.msGridColumn = "" + (c + 1);
                    this.recordsDiv.replaceChild(cell.root, e);
                }
            }
        }
    };
    ScrollableTable.prototype.msResize = function () {
        var dim = this.dataSource.scrollableTableDimensions();
        var maxColumnWidthes = [];
        for (var c = 0; c < dim.col; c += 1) {
            var record = this.recordsDiv.children[c * dim.row];
            var column = this.columnHeaderDiv.children[c];
            if (record === undefined || column === undefined)
                continue;
            var m = Math.max(record.getBoundingClientRect().width, column.getBoundingClientRect().width);
            maxColumnWidthes.push(m);
        }
        var maxRowHeights = [];
        for (var r = 0; r < dim.row; r += 1) {
            var record = this.recordsDiv.children[r];
            var row = this.rowHeaderDiv.children[r];
            if (record === undefined || row === undefined)
                continue;
            var m = Math.max(record.getBoundingClientRect().height, row.getBoundingClientRect().height);
            maxRowHeights.push(m);
        }
        var gridCol = "" + maxColumnWidthes.map(function (v) { return v + "px"; }).join(' ');
        var gridRow = "" + maxRowHeights.map(function (v) { return v + "px"; }).join(' ');
        this.columnHeaderDiv.style.msGridColumns = gridCol;
        this.columnHeaderDiv.style.gridTemplateColumns = gridCol;
        this.rowHeaderDiv.style.msGridRows = gridRow;
        this.rowHeaderDiv.style.gridTemplateRows = gridRow;
        this.recordsDiv.style.msGridColumns = gridCol;
        this.recordsDiv.style.msGridRows = gridRow;
        this.recordsDiv.style.gridTemplate = gridRow + " / " + gridCol;
    };
    ScrollableTable.prototype.cell = function (c, r) {
        var e = document.createElement('div');
        e.classList.add(ScrollableTable.prefix + "-cell");
        if (c) {
            e.style.gridColumn = "" + c;
            e.style.msGridColumn = "" + c;
        }
        if (r) {
            e.style.gridRow = "" + r;
            e.style.msGridRow = "" + r;
        }
        return e;
    };
    ScrollableTable.prefix = 'scrollable-table';
    return ScrollableTable;
}());
export { ScrollableTable };
//# sourceMappingURL=scrollable_table.js.map