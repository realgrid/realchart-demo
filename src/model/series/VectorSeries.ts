////////////////////////////////////////////////////////////////////////////////
// VectorSeries.ts
// 2023. 08. 01. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum, pickProp, pickProp3, assign, maxv, incv } from "../../common/Common";
import { PathElement, RcElement } from "../../common/RcControl";
import { IAxis } from "../Axis";
import { DataPoint } from "../DataPoint";
import { Series } from "../Series";

/**
 * [y, length, angle]
 * [x, y, length, angle]
 */
export class VectorSeriesPoint extends DataPoint {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    length: any;
    angle: any;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    lengthValue: number;
    angleValue: number;

    _len: number;
    _off: number; 

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _assignTo(proxy: any): any {
        return assign(super._assignTo(proxy), {
            length: this.length,
            angle: this.angle,
            lengthValue: this.lengthValue,
            angleValue: this.angleValue
        });
    }

    protected _valuesChangd(): boolean {
        return this.length !== this._prev.length || this.angle !== this._prev.angle || super._valuesChangd();
    }

    protected _readArray(series: VectorSeries, v: any[]): void {
        if (v.length <= 2) {
            this.isNull = true;
        } else {
            const d = v.length > 3 ? 1 : 0;

            if (d > 0) {
                this.x = v[pickNum(series.xField, 0)];
            }
            this.y = v[pickNum(series.yField, 0 + d)];
            this.length = v[pickNum(series.lengthField, 1 + d)];
            this.angle = v[pickNum(series.angleField, 2 + d)];
        }
    }

    protected _readObject(series: VectorSeries, v: any): void {
        super._readObject(series, v);

        this.length = pickProp(v[series.lengthField], v.length);
        this.angle = pickProp(v[series.angleField], v.angle);
        this.y = pickProp3(series._yFielder(v), v.y, v.value);
    }

    protected _readSingle(v: any): void {
        super._readSingle(v);

        this.length = this.angle = this.y;
    }

    parse(series: VectorSeries): void {
        super.parse(series);

        this.isNull ||= isNaN(this.lengthValue) || isNaN(this.angleValue);
    }

    initValues(): void {
        this.lengthValue = parseFloat(this.length);
        this.angleValue = parseFloat(this.angle);
    }

    initPrev(axis: IAxis, prev: any): void {
        prev.yValue = this.yValue;
        prev.lengthValue = 0.001;
    }

    applyValueRate(prev: any, vr: number): void {
        // yValue는 series.collectValues()에서 한다.
        this.lengthValue = incv(prev.lengthValue, this.lengthValue, vr);
    }
}

/**
 * vector 화살표 회전 중심.
 */
export enum VectorOrigin {
    /**
     * 데이터포인트 (x, y) 위치가 vector 화살표의 중점이 되게 회전한다.
     * 
     * @config
     */
    CENTER = 'center',
    /**
     * 데이터포인트 (x, y) 위치가 vector 화살표의 시작점이 되게 회전한다.
     * 
     * @config
     */
    START = 'start',
    /**
     * 데이터포인트 (x, y) 위치가 vector 화살표의 끝점이 되게 회전한다.
     * 
     * @config
     */
    END = 'end'
}

/**
 * 화살 머리 종류.
 */
export enum ArrowHead {
    /**
     * 머리를 따로 표시하지 않는다.
     * 
     * @config
     */
    NONE = 'none',
    /**
     * 닫힌 삼각형.
     * 
     * @config
     */
    CLOSE = 'close',
    /**
     * 열린 삼각형.
     * 
     * @config
     */
    OPEN = 'open',
}

/**
 * Vector 시리즈.<br/>
 * x, y로 지정된 데이터포인트에 길이과 방향을 갖는 화살표를 표시한다.<br/><br/>
 * 
 * {@link data}는 아래 형식들로 전달할 수 있다.<br/>
 * [주의] 데이터포인트 구성에 필요한 모든 값을 제공하지 않으면 null이 된다.
 * 
 * ###### 단일 값 및 값 배열
 * |형식|설명|
 * |---|---|
 * |y|단일 숫자면 low, y값. x 값은 순서에 따라 자동 결정.|
 * |[]|빈 배열이면 null. x 값은 순서에 따라 자동 결정.|
 * |[y, length, angle]|형식 설명 순서대로 값 결정. x 값은 데이터포인트 순서에 따라 자동 결정.|
 * |[x, y, length, angle]|형깃 설명 순서대로 값 결정.<br/> 또는 {@link xField} 속성이 숫자이면 x값, {@link yField}는 y값,<br/> {@link lengthField}는 length값, {@link angleField}는 angle값,<br/>.|
 *
 * ###### json 배열
 * |Series 속성|설명|
 * |---|---|
 * |{@link xField}|속성 값, 또는 'x', 'name', 'label' 속성들 중 순서대로 값이 설정된 것이 x 값이 된다.|
 * |{@link yField}|속성 값, 또는 'y', 'value' 속성들 중 순서대로 값이 설정된 것이 y 값이 된다.|
 * |{@link lengthField}|속성 값, 또는 'length' 속성 값이 length 값이 된다.|
 * |{@link angleField}|속성 값, 또는 'angle' 속성 값이 angle 값이 된다.|
 * 
 * @config chart.series[type=vector]
 */
export class VectorSeries extends Series {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * json 객체나 배열로 전달되는 데이터포인트 정보에서 길이(length) 값을 지정하는 속성명이나 인덱스.<br/>
     * undefined이면, data point의 값이 array일 때는 항목 수가 3이상이면 1, 아니면 0, 객체이면 'length'.
     * 
     * @config
     */
    lengthField: string;
    /**
     * json 객체나 배열로 전달되는 데이터포인트 정보에서 각도(angle) 값을 지정하는 속성명이나 인덱스.<br/>
     * undefined이면, data point의 값이 array일 때는 항목 수가 3이상이면 2, 아니면 1, 객체이면 'angle'.
     * 
     * @config
     */
    angleField: string;
    /**
     * vector 화살표 회전 중심.
     */
    origin = VectorOrigin.CENTER;
    /**
     * 최대 길이.
     * 
     * @config
     */
    maxLength = 20;
    /**
     * 시작 각도.
     * 12시 위치가 0도.
     * 
     * @config
     */
    startAngle = 0;
    /**
     * 화살 머리 타입.
     * 
     * @config
     */
    arrowHead = ArrowHead.CLOSE;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'vector';
    }

    protected _createPoint(source: any): DataPoint {
        return new VectorSeriesPoint(source);
    }

    protected _doLoad(src: any): void {
        super._doLoad(src);
    }

    protected _doPrepareRender(): void {
        super._doPrepareRender();

        const pts = this._runPoints as VectorSeriesPoint[];

        if (pts.length > 0) {
            const len = this.maxLength;
            const org = this.origin;
            const max = pts.map(p => p.length).reduce((r, c) => maxv(r, c));
    
            pts.forEach(p => {
                const f = p.length / max;
                
                p._len = f * len;

                switch (org) {
                    case VectorOrigin.START:
                        p._off = -p._len / 2;
                        break;
                    case VectorOrigin.END:
                        p._off = p._len / 2;
                        break;
                    default:
                        p._off = 0;
                        break;
                }
            });
        }
    }

    protected _createLegendMarker(doc: Document, size: number): RcElement {
        const w = 2 / 10;
        const h = 3 / 10;
        const body = 0.6;//1 / 2;
        const off = size * 0.7;
        const pts = [
            0, -h * size,
            -w * size, -h * size,
            0, -body * size,
            w * size, -h * size,
            0, -h * size,
            0, body * size
        ];
        const path = ['M', pts[0], pts[1] + off];
        for (let i = 2; i < pts.length; i += 2) {
            path.push('L', pts[i], pts[i + 1] + off);
        }
        const elt = new PathElement(doc, Series.LEGEND_MARKER, path);
        elt.setStyle('strokeWidth', '2px');
        elt.rotation = 30;
        return elt;
    }
}