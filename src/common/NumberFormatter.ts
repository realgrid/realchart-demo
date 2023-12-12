////////////////////////////////////////////////////////////////////////////////
// NumberFormatter.ts
// 2022. 03. 06. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021-2022 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

const ZERO = '0'.charCodeAt(0);
const SHARP = '#'.charCodeAt(0);
const COMMA = ','.charCodeAt(0);
const SIGN = 's'.charCodeAt(0);
const ABS = 'a'.charCodeAt(0);

/**
 * @internal 
 * 
 * 'as,0.0#'
 * NOTE: 'a'는 bigint에 사용할 수 없다.
 * 
 * //TODO: ',' 자리에 다른 문자(ex. space)를 표시할 수 있도록 한다.
 * //TODO: Intl.NumberFormat 사용할 것. toLocaleString()할 때마다 이 객체가 생성되는 듯.
 */
export class NumberFormatter {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly DEFAULT_FORMAT = "";

	//-------------------------------------------------------------------------
    // static members
	//-------------------------------------------------------------------------
    private static readonly Formatters: { [key: string]: NumberFormatter } = {};
    
    static getFormatter(format: string): NumberFormatter {
        let f = NumberFormatter.Formatters[format];
        if (!f) {
            NumberFormatter.Formatters[format] = f = new NumberFormatter(format);
        }
        return f;
    }
    
    static get Default(): NumberFormatter {
        return NumberFormatter.getFormatter(NumberFormatter.DEFAULT_FORMAT);
    }

	//-------------------------------------------------------------------------
    // fields
	//-------------------------------------------------------------------------
	private _format: string;
	private _options: any;

	//-------------------------------------------------------------------------
    // constructors
    //-------------------------------------------------------------------------
	constructor(format: string) {
		format = format.trim();
        this._options = format ? this.$_parse(this._format = format) : {useGrouping: false};
	}

	//-------------------------------------------------------------------------
    // properties
	//-------------------------------------------------------------------------
	get format(): string {
		return this._format;
	}

	//-------------------------------------------------------------------------
    // methods
	//-------------------------------------------------------------------------
	toStr(value: number | bigint): string {
		return value.toLocaleString(undefined, this._options);
	}

	//-------------------------------------------------------------------------
    // internal members
	//-------------------------------------------------------------------------
	private $_parse(s: string): object {
		const len = s.length;

		if (len > 0) {
			const options: any = {
				useGrouping: false,
				minimumIntegerDigits: 0,
				minimumFractionDigits: 0,
				maximumFractionDigits: 0,
			};
			let p = s.indexOf('.');

			if (p >= 0) {
				let i = p + 1;
				while (i < len) {
					if (s.charCodeAt(i) === ZERO) {
						options.minimumFractionDigits++;
						i++;
					} else {
						break;
					}
				}
				options.maximumFractionDigits = options.minimumFractionDigits;
				while (i < len) {
					if (s.charCodeAt(i) === SHARP) {
						options.maximumFractionDigits++;
						i++;
					} else {
						break;
					}
				}
				p = p - 1;
			} else {
				p = len - 1;
			}

			let i = p;
            
			while (i >= 0) {
				if (s.charCodeAt(i) === ZERO) {
					options.minimumIntegerDigits++;
					i--;
				} else {
					break;
				}
			}

			while (i >= 0) {
				const c = s.charCodeAt(i--);
				if (c === COMMA) {
					options.useGrouping = true;
					break;
				}
			}

			i = p;
			while (i >= 0) {
				const c = s.charCodeAt(i--);
				if (c === SIGN) {
					options.signDisplay = 'always';
					break;
				}
			}

			if (!options.signDisplay) {
				i = p;
				while (i >= 0) {
					const c = s.charCodeAt(i--);
					if (c === ABS) {
						options.signDisplay = 'never';
						break;
					}
				}
			}

			options.minimumIntegerDigits = Math.max(1, options.minimumIntegerDigits);
            if (!options.maximumFractionDigits) delete options.maximumFractionDigits;
			return options;
		}
	}
}
