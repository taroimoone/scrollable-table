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
    //     dataSource.dim = new Dimension(30, 20);
    //     dataSource.data = [];
    //     for (let c = 0; c < dataSource.dim.col; c += 1) {
    //         const d: string[] = [];
    //         for (let r = 0; r < dataSource.dim.row; r += 1) {
    //             d.push(`record-${c}-${r}`);
    //         }
    //         dataSource.data.push(d);
    //     }
    //     sclTbl.render();
    // };
};
