////////////////////////////////////////////////////////////////////////////////
// Sides.ts
// 2023. 07. 11. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021-2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum } from "./Common";
import { IRect } from "./Rectangle";

export interface ISides {
	left: number;
	right: number;
	top: number;
	bottom: number;
}

export const equalsSides = function (r1: ISides, r2: ISides): boolean {
    if (r1 === r2) return true;
    if (r1 && r2) {
        return r1.left === r2.left && r1.right === r2.right && r1.top === r2.top && r1.bottom === r2.bottom;
    }
    return false;
}

/** @internal */
export class Sides {
	
    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // static members
    //-------------------------------------------------------------------------
	static readonly Empty = Object.freeze(new Sides());
	static Temp = new Sides();
    static create(top: number, bottom?: number, left?: number, right?: number): Sides {
        if (!isNaN(left)) {
            return new Sides(top, bottom, left, right);
        } else if (!isNaN(bottom)) {
            return new Sides(top, top, bottom, bottom);
        } else {
            return new Sides(top, top, top, top);
        }
    }
    static createFrom(value: string): Sides {
        const vals = value.split(/\s*[\s,]+\s*/g);
        return this.create.call(null, ...vals.map(v => +v));
    }

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // constructors
    //-------------------------------------------------------------------------
    constructor(public top = 0, public bottom = 0, public left = 0, public right = 0) {
    }

	//-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
	//-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    clone(): Sides {
        return new Sides(this.top, this.bottom, this.left, this.right);
    }

    applyPadding(cs: CSSStyleDeclaration): Sides {
        this.left = pickNum(cs.paddingLeft, 0);
        this.right = pickNum(cs.paddingRight, 0);
        this.top = pickNum(cs.paddingTop, 0);
        this.bottom = pickNum(cs.paddingBottom, 0);
        return this;
    }

    applyMargin(cs: CSSStyleDeclaration): Sides {
        this.left = pickNum(cs.marginLeft, 0);
        this.right = pickNum(cs.marginRight, 0);
        this.top = pickNum(cs.marginTop, 0);
        this.bottom = pickNum(cs.marginBottom, 0);
        return this;
    }

    shrink(r: IRect): IRect {
        return {
            x: r.x + this.left,
            y: r.y + this.top,
            width: r.width - this.left - this.right,
            height: r.height - this.top - this.bottom
        };
    }

	//-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
	toString(): string {
		return "{top: " + this.top + ", bottom: " + this.bottom + ", left: " + this.left + ", right: " + this.right + "}";
    }

	//-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
}
