////////////////////////////////////////////////////////////////////////////////
// Rectangle.ts
// 2023. 01. 04. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021-2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ISize } from './Size';
import { isNull } from './Types';
import { Utils } from './Utils';

export interface IRect {
	x: number;
	y: number;
	width: number;
	height: number;
}

export function toSize(r: IRect): ISize {
    return { width: r.width, height: r.height };
}

export const equalsRect = function (r1: IRect, r2: IRect): boolean {
    if (r1 === r2) return true;
    if (r1 && r2) {
        return r1.x === r2.x && r1.y === r2.y && r1.width === r2.width && r1.height === r2.height;
    }
    return false;
}

export function isValidRect(r: IRect): boolean {
	return !isNaN(r.x) && !isNaN(r.y) && !isNaN(r.width) && !isNaN(r.height);
}

export const intersectsRect = function (r1: IRect, r2: IRect): boolean {
	return !(r1.y >= r2.y + r2.height || r2.y >= r1.y + r1.height || r1.x >= r2.x + r1.width || r2.x >= r1.x + r1.width);
}

/** @internal */
export class Rectangle {
	
    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // static members
    //-------------------------------------------------------------------------
	static readonly Empty = new Rectangle();
	static Temp = new Rectangle();
	static create(x: any, y?: number, width?: number, height?: number): Rectangle {
        if (Utils.isObject(x)) {
			return new Rectangle(x.x, x.y, x.width, x.height);
        } else if (isNull(y)) {
			return new Rectangle(x, x, x, x);
		} else if (isNull(width)) {
			return new Rectangle(x, y, x, y);
		} else {
			return new Rectangle(x, y, width, height);
		}
	}

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // constructors
    //-------------------------------------------------------------------------
    constructor(public x = 0, public y = 0, public width = 0, public height = 0) {
    }

	//-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /** left */
    get left(): number {
        return this.x;
    }
    set left(value: number) {
		const dx = value - this.x;
		this.x += dx;
		this.width -= dx;
    }

    /** right */
    get right(): number {
		return this.x + this.width;
    }
    set right(value: number) {
		const dx = value - (this.x + this.width);
		this.width += dx;
    }

    /** top */
    get top(): number {
        return this.y;
    }
    set top(value: number) {
		const dy = value - this.y;
		this.y += dy;
		this.height -= dy;
    }

    /** bottom */
    get bottom(): number {
		return this.y + this.height;
    }
    set bottom(value: number) {
		const dy = value - (this.y + this.height);
		this.height += dy;
    }

    /** isEmpty */
    get isEmpty(): boolean {
		return this.width === 0 || this.height === 0;
	}

	get isValid(): boolean {
		return isValidRect(this);
	}

	//-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    clone(): Rectangle {
        return new Rectangle(this.x, this.y, this.width, this.height);
    }

    getInner(): Rectangle {
		return new Rectangle(0, 0, this.width, this.height);
    }
    
	equals(r: Rectangle): boolean {
		return r === this
			|| r && this.x === r.x && this.y === r.y && this.width === r.width && this.height === r.height;
	}

    leftBy(delta: number): Rectangle {
		this.x += delta;
		this.width -= delta;
		return this;
    }
    
    rightBy(delta: number): Rectangle {
		this.width += delta;
		return this;
	}

    topBy(delta: number): Rectangle {
		this.y += delta;
		this.height -= delta;
		return this;
	}

    bottomBy(delta: number): Rectangle {
		this.height += delta;
		return this;
    }
    
    shrink(dx: number, dy: number): Rectangle {
		this.width -= dx;
		this.height -= dy;
		return this;
    }
    
	expand(dx: number, dy: number): Rectangle {
		this.width += dx;
		this.height += dy;
		return this;
    }
    
	contains(x: number, y: number): boolean {
		return x >= this.x && x <= this.x + this.width
			&& y >= this.y && y <= this.y + this.height;
	}

	setEmpty(): Rectangle {
		this.width = this.height = 0;
		return this;
    }

    move(x = 0, y = 0): Rectangle {
        this.x = x;
        this.y = y;
        return this;
    }
    
	set(x: number, y: number, width: number, height: number): Rectangle {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		return this;
    }

    setWidth(value: number): Rectangle {
        this.width = value;
        return this;
    }
    
	copy(r: Rectangle): Rectangle {
		this.x = r.x;
		this.y = r.y;
		this.width = r.width;
		this.height = r.height;
		return this;
    }
    
	copyHorz(r: Rectangle): Rectangle {
		this.x = r.x;
		this.width = r.width;
		return this;
    }
    
	copyVert(r: Rectangle): Rectangle {
		this.y = r.y;
		this.height = r.height;
		return this;
    }
    
	inflate(left: number = 0, top?: number, right?: number, bottom?: number): Rectangle {
		top = top !== undefined ? top : left;
		right = right !== undefined ? right : left;
		bottom = bottom !== undefined ? bottom : top;
		if (left) this.left = this.x - left;
		if (top) this.top = this.y - top;
		if (right) this.right = this.right + right;
		if (bottom) this.bottom = this.bottom + bottom;
		return this;
    }
    
	offset(dx: number, dy: number): Rectangle {
		this.x += dx;
		this.y += dy;
		return this;
    }
    
	round(): Rectangle {
		const r = this.clone();
		r.x >>>= 0;
		r.y >>>= 0;
		r.width >>>= 0;
		r.height >>>= 0;
		return r;
    }
    
	union(r: Rectangle): Rectangle {
        const r2 = this.clone();
        
		r2.left = Math.min(this.x, r.x);
		r2.right = Math.max(this.right, r.right);
		r2.top = Math.min(this.y, r.y);
		r2.bottom = Math.max(this.bottom, r.bottom);
		return r2;
    }
    
	normalize(): Rectangle {
		if (this.width < 0) {
			this.x -= this.width;
			this.width *= -1;
		}
		if (this.height < 0) {
			this.y -= this.height;
			this.height *= -1;
		}
		return this;
	}

	//-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
	toString(): string {
		return "{x: " + this.x + ", y: " + this.y + ", width: " + this.width + ", height: " + this.height + "}";
    }

	//-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
}
