import { TableCell, Dimension } from '../models/index';

/**
 * You should implement this of using scrollabe table
 */
export interface ScrollableTableDataSource {
    /**
     * Decide table dimension
     * @return Dimension of table
     * @example
     * return { row: 5, col: 20 };
     */
    scrollableTableDimensions(): Dimension;
    /**
     * Decide fixed header cell content
     * @return table cell of one fixed header
     */
    scrollableTableFixedHeaderCell(): TableCell;
    /**
     * Decide column header cell contents
     * @param col column number
     */
    scrollableTableColumnHeaderCell(col: number): TableCell;
    /**
     * Decide row header cell contents
     * @param row row number
     */
    scrollabelTableRowHeaderCell(row: number): TableCell;
    /**
     * Decide records cell contents
     * @param path path to cell
     * @return table cell of path
     * @example
     * const cell = new TableCell(); // TableCell extends Element
     * cell.textContent = `${data[path.row][path.col]}`;
     * return cell;
     */
    scrollabalTableRecordsCell(path: Dimension): TableCell;
}
