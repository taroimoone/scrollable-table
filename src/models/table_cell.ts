import { ScrollableTable } from '../scrollable_table';

export class TableCell {
    key: string;
    root: HTMLElement;
    constructor(key: string) {
        this.key = key;
        this.root = document.createElement('div');
        this.root.classList.add(`${ScrollableTable.prefix}-cell`);
        this.root.dataset.key = key;
    }
}
