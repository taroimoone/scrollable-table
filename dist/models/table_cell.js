var TableCell = /** @class */ (function () {
    function TableCell(key) {
        this.key = key;
    }
    TableCell.prototype.render = function () {
        if (this.root === undefined) {
            this.root = document.createElement('div');
        }
        this.root.dataset.key = this.key;
        return this.root;
    };
    return TableCell;
}());
export { TableCell };
//# sourceMappingURL=table_cell.js.map