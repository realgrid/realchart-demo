////////////////////////////////////////////////////////////////////////////////
// DatetimeFormatter.ts
// 2021. 12. 07. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { locale } from "./RcLocale";
import { throwFormat } from "./Types";
import { Utils } from "./Utils";

const $$_DT_DATE_TOKENS = [
	"yy", "yyyy",
	"M", "MM",
	"d", "dd",
    'WW', 'W', 'w', 'ww',
	"a",
	"H", "HH", "h", "hh",
	"m", "mm",
	"s", "ss",
	"S", "SS", "SSS"
];
const $$_DT_DATE_SEPARATORS = [
	".", "/", "-", ":"
];
const U_0 = "0".charCodeAt(0);
const U_9 = "9".charCodeAt(0);
const U_Z = "Z".charCodeAt(0);
const L_Z = "z".charCodeAt(0);
const U_A = "A".charCodeAt(0);
const L_A = "a".charCodeAt(0);
const U_Y = "Y".charCodeAt(0);
const L_Y = "y".charCodeAt(0);
const U_M = "M".charCodeAt(0);
const L_M = "m".charCodeAt(0);
const U_W = 'W'.charCodeAt(0);
const L_W = 'w'.charCodeAt(0);
const U_D = "D".charCodeAt(0);
const L_D = "d".charCodeAt(0);
const U_H = "H".charCodeAt(0);
const L_H = "h".charCodeAt(0);
const U_S = "S".charCodeAt(0);
const L_S = "s".charCodeAt(0);

const pad = function (v: number): string {
	return (v < 10) ? "0" + v : String(v);
}
const pad3 = function (v: number): string {
	return (v < 10) ? "00" + v : (v < 100) ? "0" : String(v);
}

/**
 * @internal
 *
 */
export class DatetimeFormatter {
	
    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // static members
	//-------------------------------------------------------------------------
    private static readonly Formatters: { [key: string]: DatetimeFormatter } = {};
    
    static getFormatter(format: string): DatetimeFormatter {
        let f = DatetimeFormatter.Formatters[format];
        if (!f) {
            DatetimeFormatter.Formatters[format] = f = new DatetimeFormatter(format);
        }
        return f;
    }
    
    static get Default(): DatetimeFormatter {
        return DatetimeFormatter.getFormatter(locale.dateFormat);
    }

    //-------------------------------------------------------------------------
    // property fields
	//-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
	//-------------------------------------------------------------------------
	private _format: string;
	private _baseYear = 2000;
	private _preserveTime = false;
	private _tokens: string[];
	private _hasAmPm = false;
	private _formatString: string = "";


	//-------------------------------------------------------------------------
    // constructors
    //-------------------------------------------------------------------------
	constructor(format: string) {
		this.formatString = format;
	}

	//-------------------------------------------------------------------------
    // properties
	//-------------------------------------------------------------------------
	/** format */
	get format(): string {
		return this._format;
	}

	/** formatString */
	get formatString(): string {
		return this._formatString;
	}
	set formatString(value: string) {
		value = value || locale.dateFormat;
		if (value != this._formatString) {
			this._tokens = [];
			this.parse(value);
			this._formatString = value;
		}
	}


	//-------------------------------------------------------------------------
    // methods
	//-------------------------------------------------------------------------
	toStr(date: Date, startOfWeek: number) {
		if (!this._tokens) {
			return "";
		}

		const tokens = this._tokens;
		let s = "";

		for (var i = 0, cnt = tokens.length; i < cnt; i++) {
			var t = tokens[i];
			var len = t.length;
			switch (t.charCodeAt(0)) {
				case L_Y:
					s += len > 2 ? date.getFullYear() : pad(date.getFullYear() % 100);
					break;
				case U_M:
					s += len > 1 ? pad(date.getMonth() + 1) : (date.getMonth() + 1);
					break;
				case L_D:
					s += len > 1 ? pad(date.getDate()) : date.getDate();
					break;
                case U_W:
                    s += len > 1 ? pad(Utils.weekOfYear(date, startOfWeek)) : Utils.weekOfMonth(date, startOfWeek, true);
                    break;
                case L_W:
                    s += len > 1 ? Utils.long_week_days[date.getDay()] : Utils.week_days[date.getDay()];
                    break;
				case U_H:
					s += len > 1 ? pad(date.getHours()) : date.getHours();
					break;
				case L_H:
					if (this._hasAmPm) {
						let h = date.getHours();
						if (h == 0) {
							h = 12
						} else if (h > 12) {
							h = h - 12;
						}
						s += len > 1 ? pad(h) : h;
					} else {
						s += len > 1 ? pad(date.getHours()) : date.getHours();
					}
					break;
				case L_M:
					s += len > 1 ? pad(date.getMinutes()) : date.getMinutes();
					break;
				case L_S:
					s += len > 1 ? pad(date.getSeconds()) : date.getSeconds();
					break;
				case L_A:
				case U_A:
					if (date.getHours() < 12) {
						s += locale.am;
					} else {
						s += locale.pm
					}
					break;
				case U_S:
                    let v = date.getMilliseconds();
                    if (len == 3) s += pad3(v);
                    else if (len == 2) s += pad(v);
                    else s += v.toString().substr(0, len);
					break;
				/*
				 case U_Y:
				 break;
				 case U_D:
				 s += day of year
				 break;
				 */
				default:
					s += t;
			}
		}
		return s;
	}

	//-------------------------------------------------------------------------
    // internal members
	//-------------------------------------------------------------------------
	private parseDateFormatTokens(format: string): string[] {
		var tokens: string[] = [];

		if (format) {
			const str = format.trim();
			const len = str.length;
			let i = 0;

			while (i < len) {
				let tok = str.charAt(i);
				if ($$_DT_DATE_SEPARATORS.indexOf(tok) >= 0) {
					tokens.push(tok);
					i++;
				} else {
					let p = i++;
					while (i < len && str.charAt(i) == tok) {
						i++;
					}
					tok = str.substring(p, i);
					if ($$_DT_DATE_TOKENS.indexOf(tok) < 0) {
						let c = tok.charCodeAt(0);
						if (c >= U_A && c <= U_Z || c >= L_A && c <= L_Z) {
							throwFormat(locale.invalidDateFormat, format);
						}
					}
					tokens.push(tok);
				}

				if (i < len && Utils.isWhiteSpace(tok = str.charAt(i))) {
					tokens.push(tok);
					while (i < len && Utils.isWhiteSpace(str.charAt(i))) {
						i++;
					}
				}
			}
		}
		return tokens;
	};

	private parse(fmt: string) {
		if (fmt) {
			this._format = fmt || locale.dateFormat;
			this._tokens = this.parseDateFormatTokens(this._format);
			this._hasAmPm = this._tokens.indexOf("a") >= 0 || this._tokens.indexOf("A") >= 0;
		}
	};
}
