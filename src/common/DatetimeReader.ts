
////////////////////////////////////////////////////////////////////////////////
// DatetimeFormatter.ts
// 2022. 08. 26. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021-2022 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { locale } from "./RcLocale";
import { throwFormat } from "./Types";
import { Utils } from "./Utils";

const SEPARATORS = "./-: ";

export class DatetimeReader {
	
    //-------------------------------------------------------------------------
    // property fields
	//-------------------------------------------------------------------------
	private _format: string = null;
	private _baseYear = 2000;
	private _patterns: {c: string, p: number, len: number}[] = [];
	private _amText = "AM";
	private _pmText = "PM";

    //-------------------------------------------------------------------------
    // fields
	//-------------------------------------------------------------------------
	//-------------------------------------------------------------------------
    // constructors
    //-------------------------------------------------------------------------
	constructor(format: string) {
		format && (this.format = format);
	}

	//-------------------------------------------------------------------------
    // properties
	//-------------------------------------------------------------------------
	/** format */
	get format(): string {
		return this._format;
	}
	set format(value: string) {
		if (value != this._format) {
			if (!value) {
				throwFormat(locale.invalidDateFormat, value);
			}
			this._format = value;
			this.parseFormat(value);
		}
	}

	/** baseYear */
	get baseYear(): number {
		return this._baseYear;
	}
	set baseYear(value: number) {
		if (value != this._baseYear) {
			this._baseYear = value;
		}
	}

	/** amText */
	get amText(): string {
		return this._amText;
	}
	set amText(value: string) {
		if (value != this._amText) {
			this._amText = value;
		}
	}

	/** pmText */
	get pmText(): string {
		return this._pmText;
	}
	set pmText(value: string) {
		if (value != this._pmText) {
			this._pmText = value;
		}
	}

	//-------------------------------------------------------------------------
    // methods
	//-------------------------------------------------------------------------
	parse(str: string): Date {
		try {
			let y = 0;
			let m = 1;
			let d = 1;
			let h = 0;
			let n = 0;
			let s = 0;
			let S = 0;
			let am = 0;
			let pm = 0;
			let len = this._patterns.length;
			let p = 0;
			const strlen = str.length;

			for (let i = 0; i < len && p < strlen; i++) {
				const pattern = this._patterns[i];
				const c = pattern.c;
				let l = pattern.len;

				switch (c) {
					case "y":
						y = parseInt(str.substr(p, l));
						break;
					case "M":
						m = parseInt(str.substr(p, l));
						break;
					case "d":
						d = parseInt(str.substr(p, l));
						break;
					case "a":
						if (this._amText && str.indexOf(this._amText, p) == p) {
							am = 12;
							l = this._amText.length;
						} else if (this._pmText && str.indexOf(this._pmText, p) == p) {
							pm = 12;
							l = this._pmText.length;
						} else {
							return null;
						}
						break;
					case "H":
                    case 'h':
						h = parseInt(str.substring(p, p + l));
						break;
					case "m":
						n = parseInt(str.substring(p, p + l));
						break;
                    case "S":
                    case "s":
						s = parseInt(str.substring(p, p + l));
						break;
					default:
						if (SEPARATORS.indexOf(str.charAt(p)) < 0) {
							return null;
						}
						break;
				}
				p += l;
			}

            if (y < 100) {
                y += this._baseYear;
            }
            if (am > 0) {
                if (h == 12) {
                    h = 0;
                }
            } else if (pm > 0 && h < 12) {
                h += 12;
            }

            return new Date(y, m - 1, d, h, n, s, S);

        } catch (err) {
            return null;
        }
    }

	//-------------------------------------------------------------------------
    // internal members
	//-------------------------------------------------------------------------
	private parseFormat(format: string): void {
		const s = format;
		const len = s.length;
		let i = 0;
		let p: number;
		let c: string;
		let l: number;
		
        this._patterns = [];

		while (i < len) {
			p = i;
			c = s.charAt(i);

			if (Utils.isWhiteSpace(c)) {
				i++;
				while (i < len && Utils.isWhiteSpace(s.charAt(i))) {
					i++;
				}
				this._patterns.push({ c: " ", p: p, len: i - p });
			} else {
				l = 0;
				switch (c) {
					case "y":
						l = this.getPattern(s, i, c);
						if (l != 4 && l != 2) throwFormat(locale.invalidDateFormat, s);
						break;
					case "M":
					case "d":
					case "H":
					case "h":
					case "m":
					case "s":
						l = this.getPattern(s, i, c);
						if (l != 2) throwFormat(locale.invalidDateFormat, s);
						break;
					case "S":
						l = this.getPattern(s, i, c);
						if (l != 3) throwFormat(locale.invalidDateFormat, s);
						break;
					case "a":
					case ".":
					case "/":
					case "-":
					case ":":
						l = this.getPattern(s, i, c);
						if (l != 1) throwFormat(locale.invalidDateFormat, s);
						break;
					default:
						throwFormat(locale.invalidDateFormat, s);
				}

				if (l > 0) {
					this._patterns.push({ c: c, p: i, len: l });
					i += l;
				}
			}
		}
	}

	private getPattern(str: string, i: number, c: string): number {
		let len: number = 1;

		while (++i < str.length && str.charAt(i) == c) {
			len++;
		}
		return len;
	}
}
