////////////////////////////////////////////////////////////////////////////////
// PathElement.ts
// 2023. 06. 03. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021-2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { PathElement } from '../RcControl';
import { _undefined } from '../Types';
import { Utils } from '../Utils';
import { SvgShapes } from './SvgShape';

export interface ILine {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

const equalsLine = function (line1: ILine, line2: ILine): boolean {
    if (line1 == line2) return true;
    if (line1 && line2) {
        return line1.x1 === line2.x1 && line1.x2 === line2.x2 && line1.y1 === line2.y1 && line1.y2 === line2.y2;
    }
    return false;
}

export class LineElement extends PathElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName: string = _undefined, line: ILine = _undefined) {
        super(doc, styleName);

        this.setAttr('shapeRendering', 'cripsEdges');
        line && this.setLine(line);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    setLine(x1: ILine | number, y1?: number, x2?: number, y2?: number): void {
        if (Utils.isNumber(x1)) {
            this.setPath(SvgShapes.line(x1, y1, x2, y2));
        } else if (x1) {
            this.setPath(SvgShapes.line(x1.x1, x1.y1, x1.x2, x1.y2));
        }
    }

    setVLine(x: number, y1: number, y2: number): void {
        this.setPath(SvgShapes.line(x, y1, x, y2));
    }

    setVLineC(x: number, y1: number, y2: number): void {
        // const w = parseFloat(this.getStyle('stroke-width'));

        // if (!isNaN(w)) {
        //     x = Math.round(x) - (w % 2 / 2);
        // }
        this.setPath(SvgShapes.line(x, y1, x, y2));
    }

    setHLine(y: number, x1: number, x2: number): void {
        this.setPath(SvgShapes.line(x1, y, x2, y));
    }

    setHLineC(y: number, x1: number, x2: number): void {
        // const w = parseFloat(this.getStyle('stroke-width'));
        
        // if (!isNaN(w)) {
        //     y = Math.round(y) - (w % 2 / 2);
        // }
        this.setPath(SvgShapes.line(x1, y, x2, y));
    }
}

export class LineElementEx extends PathElement {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    private _line: ILine;

    //-------------------------------------------------------------------------
    // constructors
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName = _undefined, line: ILine = _undefined) {
        super(doc, null, styleName);

        this.setLine(line);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /** line */
    get line(): ILine {
        return this._line;
    }
    set line(value: ILine) {
        if (!equalsLine(value, this._line)) {
            this._line = value;
            this.$_render();
        }
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    updateLine(newLine: ILine): void {
        if (!equalsLine(newLine, this._line)) {
                this.line = newLine;
        }
    }

    updateVLine(x: number, y1: number, y2: number): void {
        this.updateLine({x1: x, y1: y1, x2: x, y2: y2});
    }

    updateHLine(y: number, x1: number, x2: number): void {
        this.updateLine({x1: x1, y1: y, x2: x2, y2: y});
    }

    updateVLineC(x: number, y1: number, y2: number): void {
        // const w = parseFloat(this.getStyle('stroke-width'));

        // if (!isNaN(w)) {
        //     x = Math.round(x) - (w % 2 / 2);
        // }
        this.updateLine({x1: x, y1: y1, x2: x, y2: y2});
    }

    updateHLineC(y: number, x1: number, x2: number, animate = false): void {
        // const w = parseFloat(this.getStyle('stroke-width'));

        // if (!isNaN(w)) {
        //     y = Math.round(y) - (w % 2 / 2);
        // }
        this.updateLine({x1: x1, y1: y, x2: x2, y2: y});
    }

    setLine(x1: ILine | number, y1?: number, x2?: number, y2?: number): void {
        if (Utils.isNumber(x1)) {
            this.$_update(x1, y1, x2, y2);
        } else if (x1) {
            this.updateLine(x1);
        }
    }

    setVLine(x: number, y1: number, y2: number): void {
        this.$_update(x, y1, x, y2);
    }

    setVLineC(x: number, y1: number, y2: number): void {
        // const w = parseFloat(this.getStyle('stroke-width'));

        // if (!isNaN(w)) {
        //     x = Math.round(x) - (w % 2 / 2);
        // }
        this.$_update(x, y1, x, y2);
    }

    setHLine(y: number, x1: number, x2: number): void {
        this.$_update(x1, y, x2, y);
    }

    setHLineC(y: number, x1: number, x2: number): void {
        // const w = parseFloat(this.getStyle('stroke-width'));

        // if (!isNaN(w)) {
        //     y = Math.round(y) - (w % 2 / 2);
        // }
        this.$_update(x1, y, x2, y);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_update(x1: number, y1: number, x2: number, y2: number): void {
        this.line = { x1: x1, y1: y1, x2: x2, y2: y2 };
    }

    private $_render(): void {
        const line = this._line;
        if (line) {
            this.setPath(SvgShapes.line(line.x1, line.y1, line.x2, line.y2));
        }
    }
}


export class ArcElement extends PathElement {

    //-------------------------------------------------------------------------
    // constructors
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName: string, cx: number, cy: number, r: number, start: number, end: number) {
        super(doc, styleName, SvgShapes.arc(cx, cy, r, r, start, end));
    }
}
