/** type of table dimension */
var Dimension = /** @class */ (function () {
    function Dimension(col, row) {
        this.col = col;
        this.row = row;
    }
    Object.defineProperty(Dimension.prototype, "det", {
        get: function () {
            return this.row * this.col;
        },
        enumerable: true,
        configurable: true
    });
    return Dimension;
}());
export { Dimension };
//# sourceMappingURL=dimension.js.map