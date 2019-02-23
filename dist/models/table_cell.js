import { ScrollableTable } from '../scrollable_table';
var TableCell = /** @class */ (function () {
    function TableCell(key) {
        this.key = key;
        this.root = document.createElement('div');
        this.root.classList.add(ScrollableTable.prefix + "-cell");
        this.root.dataset.key = key;
    }
    return TableCell;
}());
export { TableCell };
//# sourceMappingURL=table_cell.js.map