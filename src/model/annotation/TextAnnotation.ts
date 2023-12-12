////////////////////////////////////////////////////////////////////////////////
// TextAnnotation.ts
// 2023. 11. 11. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isString } from "../../common/Common";
import { DatetimeFormatter } from "../../common/DatetimeFormatter";
import { NumberFormatter } from "../../common/NumberFormatter";
import { IRichTextDomain } from "../../common/RichText";
import { SVGStyleOrClass, _undef, isNull } from "../../common/Types";
import { Annotation } from "../Annotation";

/**
 * Text Annotation 모델.
 * 
 * @config chart.annotation[type=text]
 */
export class TextAnnotation extends Annotation {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    private _numberFormat: string;
    private _timeFormat: string;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _domain: IRichTextDomain = {
        callback: (target: any, param: string): string => {
            return this.chart.getParam(target, param);
        }
    };

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 표시할 텍스트.
     * 
     * @config 
     */
    text = 'Text';
    /**
     * 텍스트 배경 스타일.\
     * 경계 및 배경 색, padding 스타일을 지정할 수 있다.
     * 
     * @config
     */
    backgroundStyle: SVGStyleOrClass;
    /**
     * {@link text}에 동적으로 전달되는 값이 숫자일 때 사용되는 표시 형식.
     * 
     * @config
     */
    get numberFormat(): string {
        return this._numberFormat;
    }
    set numberFormat(value: string) {
        if (value !== this._numberFormat) {
            this._numberFormat = value;
            this._domain.numberFormatter = value ? NumberFormatter.getFormatter(value) : _undef;
        }
    }
    /**
     * {@link text}에 동적으로 전달되는 값이 Date일 때 사용되는 표시 형식.
     * 
     * @config
     */
    get timeFormat(): string {
        return this._timeFormat;
    }
    set timeFormat(value: string) {
        if (value !== this._timeFormat) {
            this._timeFormat = value;
            this._domain.timeFormatter = value ? DatetimeFormatter.getFormatter(value) : _undef;
        }
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    isVisible(): boolean {
        return this.visible && !isNull(this.text);
    }
    
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'text';
    }

    protected _doLoadSimple(source: any): boolean {
        if (isString(source)) {
            this.text = source;
            return true;
        }
        return super._doLoadSimple(source);
    }
}
