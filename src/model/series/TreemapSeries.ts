////////////////////////////////////////////////////////////////////////////////
// TreemapSeries.ts
// 2023. 08. 01. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { Color } from "../../common/Color";
import { toStr } from "../../common/Types";
import { DataPoint } from "../DataPoint";
import { IPlottingItem, Series } from "../Series";

export class TreemapSeriesPoint extends DataPoint {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    id: string;
    group: string;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _readArray(series: TreemapSeries, v: any[]): void {
        super._readArray(series, v);

        this.id = toStr(v[parseInt(series.idField)]);
        this.group = toStr(v[parseInt(series.groupField)]);
    }

    protected _readObject(series: TreemapSeries, v: any): void {
        super._readObject(series, v);

        this.id = toStr(v[series.idField]);
        this.group = toStr(v[series.groupField]);
    }
}

interface IArea {
    x: number, 
    y: number,
    width: number;
    height: number;
}

export class TreeNode {
    parent: TreeNode;
    children: TreeNode[];
    index: number;
    value: number;
    x: number;
    y: number;
    width: number;
    height: number;

    _color: Color;

    constructor(public point: TreemapSeriesPoint) {}

    getArea(): IArea {
        return {x: this.x, y: this.y, width: this.width, height: this.height};
    }

    setArea(x: number, y: number, w: number, h: number): void {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }

    getTotal(): number {
        return this.children.reduce((a, c) => a + c.value, 0);
    }
}

export enum TreemapAlgorithm {
    /**
     * 최대한 정사각형에 가까운 비율을 유지한다.
     * <br>
     * 줄마다 배치 방향을 바꾼다.
     * 사용자가 크기를 비교하기에 유리하다.
     */
    SQUARIFY = 'squarify',
    /**
     * 최대한 정사각형에 가까운 비율을 유지한다.
     * <br>
     * 같은 방향을 유지하면 배치한다.
     */
    STRIP = 'strip',
    /**
     * 수평/수직 한 쪽 방향으로 나눈다.
     * <br>
     * level이 바뀌면 방향을 바꾼다.
     */
    SLICE = 'slice',
    /**
     * 방향을 번갈아 가면서 나눈다.
     */
    SLICE_DICE = 'sliceDice'
}

/**
 * 1. 본래 하드 드라이브의 파일 분포 상태를 표시하기 위해 고안됨.
 * 2. node & link 스타일의 전통적 표시 방식은 공간을 많이 필요로 한다.
 * 3. 일정 표시 공간을 100% 사용한다.
 * 4. 초기 공간을 재귀적으로 나누어 가면서 구성한다.
 * 
 * // TODO: grouping된 data 설정 가능하도록 한다. data[{data:[]}, {data:[]}]
 * 
 * @config chart.series[type=treemap]
 */
export class TreemapSeries extends Series {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    idField = 'id';
    groupField = 'group';
    algorithm = TreemapAlgorithm.SQUARIFY;
    /**
     * 수직, 수평으로 방향을 바꾸어 가며 배치한다.
     */
    alternate = true;
    /**
     * 시작 방향.
     * <br>
     * 지정하지 않으면 ploting 영역의 너비/높이 비율 기준으로 정해진다.
     */
    startDir: 'vertical' | 'horizontal';

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _roots: TreeNode[];
    _leafs: TreeNode[];
    private _map: {[id: string]: TreeNode} = {};

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    buildMap(width: number, height: number): TreeNode[] {

        function visit(node: TreeNode): void {
            if (node.children) {
                let sum = 0;

                node.children.forEach((node, i) => {
                    visit(node);
                    sum += node.value;
                })
                node.value = sum;
                node.children = node.children.sort((n1, n2) => n2.value - n1.value);
                node.children.forEach((node, i) => {
                    node.index = i;
                });
            } else {
                leafs.push(node);
                node.value = node.point ? node.point.yValue : 0;
            }
        }

        const vertical = this.startDir === 'vertical' || height > width;
        const leafs = this._leafs = [];

        this._roots.forEach((node, i) => {
            visit(node);
        });

        this._roots = this._roots.sort((n1, n2) => n2.value - n1.value);
        this._roots.forEach((node, i) => {
            node.index = i;
        });

        (this[this.algorithm] || this.squarify).call(this, this._roots, width, height, vertical);
        return this._leafs;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'treemap';
    }

    needAxes(): boolean {
        return false;
    }

    canMixWith(other: IPlottingItem): boolean {
        return false;
    }

    protected _createPoint(source: any): DataPoint {
        return new TreemapSeriesPoint(source);
    }

    getLabeledPoints(): DataPoint[] {
        return this._leafs.map(node => node.point);
    }

    protected _doPrepareRender(): void {
        super._doPrepareRender();

        this._roots = this.$_buildTree(this._runPoints as TreemapSeriesPoint[]);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_buildTree(pts: TreemapSeriesPoint[]): TreeNode[] {
        const roots: TreeNode[] = [];
        const list = [];
        const map = this._map;

        pts.forEach(p => {
            if (p.id || !p.isNull) {
                const node = new TreeNode(p);

                if (p.id) {
                    map[p.id] = node;
                } 
                if (p.group) {
                    list.push(node);
                } else {
                    roots.push(node);
                }
            }
        })

        for (let i = list.length - 1; i >= 0; i--) {
            const node = list[i];
            const g = map[node.point.group];

            if (node.parent = g) {
                if (!g.children) g.children = [];
                g.children.push(node);
                if (node.children) list.splice(i, 1);
            } else {
                roots.push(node);
                list.splice(i, 1);
            }
        };
        return roots;
    }

    private $_squarifyRow(nodes: TreeNode[], area: IArea, dir: number, total: number): number {
        const totalArea = area.width * area.height;
        const w = area.width;
        const h = area.height;
        let x = area.x;
        let y = area.y;
        let prevRate = Number.MAX_VALUE;
        let sum = 0;
        const list: TreeNode[] = [];

        while (nodes.length > 0) {
            let node: TreeNode;
            let wNode: number;
            let hNode: number;
            let pArea: number;
            let rate: number;

            node = nodes.shift();
            sum += node.value;
            pArea = sum * totalArea / total;

            if (dir === 1) {
                wNode = pArea / h;
                hNode = h * node.value / sum;
            } else {
                hNode = pArea / w;
                wNode = w * node.value / sum;
            }
            rate = Math.max(wNode / hNode, hNode / wNode);

            if (nodes.length > 0 && rate > prevRate) {
                nodes.unshift(node);
                sum -= node.value;
                pArea = totalArea * sum / total;

                if (dir === 1) {
                    hNode = h;
                    wNode = pArea / hNode;
                } else {
                    wNode = w;
                    hNode = pArea / wNode;
                }

                list.forEach(node => {
                    if (dir === 1) {
                        node.setArea(x, y, wNode, h * node.value / sum);
                        y += node.height;
                    } else {
                        node.setArea(x, y, w * node.value / sum, hNode);
                        x += node.width;
                    }
                })

                if (dir === 1) {
                    area.x += wNode;
                    area.width -= wNode;
                } else {
                    area.y += hNode;
                    area.height -= hNode;
                }
                return total - sum;

            } else if (nodes.length === 0) {
                pArea = totalArea * sum / total;
                if (dir === 1) {
                    hNode = h;
                    wNode = pArea / hNode;
                } else {
                    wNode = w;
                    hNode = pArea / wNode;
                }

                list.push(node);
                list.forEach(node => {
                    if (dir === 1) {
                        node.setArea(x, y, wNode, h * node.value / sum);
                        y += node.height;
                    } else {
                        node.setArea(x, y, w * node.value / sum, hNode);
                        x += node.width;
                    }
                })
                return 0;

            } else {
                prevRate = rate;
                list.push(node);
            }
        }
    }

    private $_squarify(roots: TreeNode[], area: IArea, vertical: boolean, changeDir: boolean): void {
        const nodes = roots.slice(0);
        let dir = vertical ? 1 : 0;
        let sum = roots.reduce((a, c) => a + c.value, 0);

        do {
            sum = this.$_squarifyRow(nodes, area, dir, sum);
            if (changeDir) {
                dir = 1 - dir;
            }
        } while (sum > 0);

        roots.forEach(node => {
            if (node.children) {
                this.$_squarify(node.children, node.getArea(), !vertical, true);
            }
        })
    }

    private squarify(roots: TreeNode[], width: number, height: number, vertical: boolean): void {
        this.$_squarify(roots, {x: 0, y: 0, width, height}, vertical, true);
    }

    private strip(roots: TreeNode[], width: number, height: number, vertical: boolean): void {
        this.$_squarify(roots, {x: 0, y: 0, width, height}, vertical, false);
    }

    private $_sliceNext(node: TreeNode, area: IArea, dir: number, sum: number): void {
        node.x = area.x;
        node.y = area.y;

        if (dir === 1) { // vertical
            const h = area.height * node.value / sum;
            
            node.width = area.width;
            node.height = h;
            area.y += h;
            area.height -= h;
        } else {
            const w = area.width * node.value / sum;

            node.height = area.height;
            node.width = w;
            area.x += w;
            area.width -= w;
        }

        if (node.children) {
            this.$_slice(node.children, node.getArea(), dir === 0, true);
        }
    }

    private $_slice(roots: TreeNode[], area: IArea, vertical: boolean, changeDir: boolean): void {
        let sum = roots.reduce((a, c) => a + c.value, 0);
        let dir = vertical ? 1 : 0;

        roots.forEach(node => {
            this.$_sliceNext(node, area, dir, sum);
            sum -= node.value;
            if (changeDir) {
                dir = 1 - dir;
            }
        })
    }
    
    private slice(roots: TreeNode[], width: number, height: number, vertical: boolean): void {
        this.$_slice(roots, {x: 0, y: 0, width, height}, vertical, false);
    }

    private sliceDice(roots: TreeNode[], width: number, height: number, vertical: boolean): void {
        this.$_slice(roots, {x: 0, y: 0, width, height}, vertical, true);
    }
}