export class TableCell {
    key: string;
    root?: HTMLElement;
    constructor(key: string) {
        this.key = key;
    }

    render(): HTMLElement {
        if (this.root === undefined) {
            this.root = document.createElement('div');
        }
        this.root.dataset.key = this.key;
        return this.root;
    }
}
