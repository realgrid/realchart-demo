////////////////////////////////////////////////////////////////////////////////
// Color.ts
// 2023. 06. 03. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021-2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { Utils } from "./Utils";

/** @internal */
export class Color {
	
    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // static members
    //-------------------------------------------------------------------------
    static isBright(color: string): boolean {
        return new Color(color).isBright();
    }

    static getContrast(color: string, darkColor?: string, brightColor?: string): string {
        return new Color(color).getContrast(darkColor, brightColor);
    }

    // static interpolate(c1: number, c2: number, delta: number): number {
    //     const r1 = (c1 & 0xff0000) >> 16;
    //     const g1 = (c1 & 0xff00) >> 8;
    //     const b1 = c1 & 0xff;
    //     const r2 = (c2 & 0xff0000) >> 16;
    //     const g2 = (c2 & 0xff00) >> 8;
    //     const b2 = c2 & 0xff;

    //     const r = r1 + (r2 - r1) * delta;
    //     const g = g1 + (g2 - g1) * delta;
    //     const b = b1 + (b2 - b1) * delta;
    //     return (r << 16) + (g << 8) + b;
    // }

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private r = 0;
    private g = 0;
    private b = 0;
    private a = 1;

    //-------------------------------------------------------------------------
    // constructors
    //-------------------------------------------------------------------------
    constructor(color?: string) {
        if (color = color && color.trim()) {
            if (Utils.startsWith(color, 'rgb(') && Utils.endsWith(color, ')')) {
                this.$_parseRgb(color.substring(4, color.length - 1));
            } else if (Utils.startsWith(color, 'rgba(') && Utils.endsWith(color, ')')) {
                this.$_parseRgb(color.substring(5, color.length - 1));
            } else if (Utils.startsWith(color, '#')) {
                this.$_parseNumber(color.substr(1));
            }
        }
    }

	//-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    get rgba(): string {
        return "rgba(" + [this.r, this.g, this.b, this.a].join(',') + ")";
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    isBright(): boolean {
        const r = this.r * 0.299;
        const g = this.g * 0.587;
        const b = this.b * 0.114;
        // return r + g + b > 186;
        return r + g + b > 140;
        //return r + g + b > 150;
    }

    getContrast(darkColor: string, brightColor: string): string {
        return this.isBright() ? (darkColor || '#000000') : (brightColor || '#FFFFFF');
    }

    brighten(rate: number, color: Color = null): Color {
        color = color || new Color(null);
        color.r = Math.ceil(this.r + (255 - this.r) * rate);;
        color.g = Math.ceil(this.g + (255 - this.g) * rate);
        color.b = Math.ceil(this.b + (255 - this.b) * rate);
        color.a = this.a;
        return color
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
	toString(): string {
		return this.rgba;
	}

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_parseRgb(s: string): void {
        const arr = s.split(/\,\s*/);

        if (arr.length >= 3) {
            this.r = +arr[0];
            this.g = +arr[1];
            this.b = +arr[2];

            if (arr.length >= 4) {
                this.a = +arr[3];
            } else {
                this.a = 1;
            }
        }
    }

    private $_parseNumber(s: string): void {
        const len = s.length;
        let color: number;

        if (len > 6) {
            color = parseInt(s.substr(0, 6), 16);
            this.a = parseInt(s.substring(6), 16) / 0xff;
        } else if (len > 0) {
            if (len === 3) {
                s = s.charAt(0) + s.charAt(0) + s.charAt(1) + s.charAt(1) + s.charAt(2) + s.charAt(2);
            }
            color = parseInt(s, 16);
        }
        this.r = (color & 0xff0000) >> 16;
        this.g = (color & 0xff00) >> 8;
        this.b = color & 0xff;
    }
}
