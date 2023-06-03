////////////////////////////////////////////////////////////////////////////////
// TextFormatter.ts
// 2021. 12. 07. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

const DUMMY_PATTERN = /(.*)/;
const DUMMY_REPLACE = "$1";
const spliter = new RegExp(';(?=(?:[^"]*"[^"]*")*(?![^"]*"))');

/**
 * @internal
 * 
 * 값이 문자형일 때 텍스트 변경 형식.
 * 세미콜론(;)으로 구분되는 형식. 두개의 문자열은 각각 String.prototype.replace의 매개변수가 된다.
 * 예) 사업자번호: '(\\d{3})(\\d{2})(\\d{5});$1-$2-$3'
 */
export class TextFormatter {
	
    //-------------------------------------------------------------------------
    // static members
	//-------------------------------------------------------------------------
    private static readonly Formatters: { [key: string]: TextFormatter } = {};
    
    static getFormatter(format: string): TextFormatter {
        let f = TextFormatter.Formatters[format];
        if (!f) {
            TextFormatter.Formatters[format] = f = new TextFormatter(format);
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
	private _pattern = DUMMY_PATTERN;
	private _replace = DUMMY_REPLACE;

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
	toStr(text: string): string {
        return text && text.replace(this._pattern, this._replace);
    }

	//-------------------------------------------------------------------------
    // internal members
	//-------------------------------------------------------------------------
	$_parse(fmt: string): void {
        if (fmt) {
			const arr = fmt.trim().split(spliter);
			
            if (arr.length > 1) {
                let p = arr[0].trim();
                let f = arr[1].trim();
			
				if (p && f) {
                    if (p.charAt(0) == '"') {
                        p = p.substr(1, p.length - 2);
                    }
                    if (p) {
                        if (f.charAt(0) == '"') {
                            f = p.substr(1, f.length - 2);
                        }
                        if (f) {
                            this._pattern = new RegExp(p, arr[2] || '');
                            this._replace = f;
                        }
                    }
                }
            }
        }
    }
}
