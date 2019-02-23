import { DataSource } from './support/index';
import { ScrollableTable, Dimension } from '../src/index';
import './index.scss';

window.onload = () => {
    const root = document.getElementById('tbl-root');
    if (root === null) return;
    const dataSource = new DataSource();
    const sclTbl = new ScrollableTable(root, dataSource);
    sclTbl.render();

    // root.onclick = () => {
    //     dataSource.dim = new Dimension(60, 70);
    //     dataSource.data = [];
    //     for (let c = 0; c < dataSource.dim.col; c += 1) {
    //         const da: HTMLElement[] = [];
    //         for (let r = 0; r < dataSource.dim.row; r += 1) {
    //             const d = document.createElement('div');
    //             d.innerHTML = `record-${c}-${r}---tooooooolong`;
    //             if (r === 2 && c === 1) {
    //                 d.innerHTML = `<div>aaa</div><div>uuu</div>`;
    //             }
    //             da.push(d);
    //         }
    //         dataSource.data.push(da);
    //     }
    //     sclTbl.render();
    // };
};
