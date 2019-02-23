# Install
```
$ npm i --save scrollable-table
```
# Usage
* in your data source implements. implement ScrollableTableDataSource interface
```typescript
// data source class
class YourDataSource implements ScrollableTableDataSource {
    dim = new Dimension(30, 50);
    recordData: HTMLElement[][] = [...]  // initialise it

    scrollableTableDimensions(): Dimension {
        // new Dimension(col, row);
        return this.dim;
    }
    scrollableTableFixedHeaderCell(): TableCell {
        // return TableCell instance of single text
        const cell = new TableCell('fixed-header');
        const e = document.createElement('div');
        e.textContent = 'fixed-header';
        cell.root = e;
        return cell;
    }
    scrollableTableColumnHeaderCell(col: number): TableCell {
        // return TableCell instance what you want
    }
    scrollabelTableRowHeaderCell(row: number): TableCell {
        // return TableCell instance what you want
    }
    scrollabalTableRecordsCell(path: Dimension): TableCell {
        // return TableCell instance from recordsData
        const cell = new TableCell(`record-${path.col}-${path.row}`);
        cell.root = this.recordData[path.col][path.row];
        return cell;
    }
}
```
* and then, use it
```typescript
const target = document.getElementById('table-target-div');
const dataSource = new YourDataSource();
const scollableTable = new ScrollableTable(target, dataSource);

scrollableTable.render();
```
* you can modify every time data source
```typescript
// initalize and first rendering
scrollableTable.render();

function someTrigger() {
    dataSource.data = [...] // change it
    scrollableTable.render(); // re-render
}

const btn = document.getElementById('change-table-button');
btn.addEventListener('click', () => someTrigger());
```