
////////////////////////////////////////////////////////////////////////////////
// BooleanFormatter.ts
// 2021. 12. 07. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

const SPLITTER = /[;\:]/;

/**
 * @internal
 *
 * 'falseText;trueText'
 */
export class BooleanFormatter {
	
	//-------------------------------------------------------------------------
    // static members
	//-------------------------------------------------------------------------
    private static readonly Formatters: { [key: string]: BooleanFormatter } = {};
    
    static getFormatter(format: string): BooleanFormatter {
        let f = BooleanFormatter.Formatters[format];
        if (!f) {
            BooleanFormatter.Formatters[format] = f = new BooleanFormatter(format);
        }
        return f;
    }

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
	//-------------------------------------------------------------------------
	private _format: string;
	private _trueText: string;
	private _falseText: string;

	//-------------------------------------------------------------------------
    // constructors
    //-------------------------------------------------------------------------
	constructor(format: string) {
		this.$_parse(this._format = format);
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
	toStr(v: any): string {
		return v === true ? this._trueText : this._falseText;
	}

	//-------------------------------------------------------------------------
    // internal members
	//-------------------------------------------------------------------------
	private $_parse(format: string): void {
		this._falseText = this._trueText = null;
		
		if (format) {
			const arr = format.split(SPLITTER);

			this._falseText = arr[0];
			if (arr.length > 0) {
				this._trueText = arr[1];
			}
		}
	}
}
