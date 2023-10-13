////////////////////////////////////////////////////////////////////////////////
// CircleGauge.ts
// 2023. 09. 26. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { IPercentSize, RtPercentSize, calcPercent, parsePercentSize } from "../../common/Types";
import { IChart } from "../Chart";
import { ChartItem } from "../ChartItem";
import { CircularGauge, Gauge, GaugeGroup, GaugeItemPosition, GaugeScale, GuageRangeBand, ICircularGaugeExtents, IGaugeValueRange, ValueGauge } from "../Gauge";

export abstract class CircleGaugeRim extends ChartItem {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    private _ranges: IGaugeValueRange[];

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _runRanges: IGaugeValueRange[];

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(public gauge: CircleGauge) {
        super(gauge.chart, true);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 값 범위 목록.
     * 범위별로 다른 스타일을 적용할 수 있다.
     * 
     * @config
     */
    get ranges(): IGaugeValueRange[] {
        return this.$_internalRanges()?.slice(0);
    }
    set ranges(value: IGaugeValueRange[]) {
        if (value !== this._ranges) {
            this._ranges = value;
            this._runRanges = null;
        }
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    isRanged(): boolean {
        const ranges = this.$_internalRanges();
        return ranges && ranges.length > 0;
    }

    rangeCount(): number {
        const ranges = this.$_internalRanges();
        return ranges ? ranges.length : 0;
    }

    getRange(value: number): IGaugeValueRange | undefined {
        const ranges = this.$_internalRanges();

        if (ranges) {
            for (const r of ranges) {
                if (value >= r.fromValue && value < r.toValue) {
                    return r;
                }
            }
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_internalRanges(): IGaugeValueRange[] {
        if (!this._runRanges) {
            this._runRanges = ValueGauge.buildRanges(this._ranges, this.gauge.minValue, this.gauge.maxValue);
        }
        return this._runRanges;
    }
}

export class CircleGaugeBackRim extends CircleGaugeRim {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    private _segmentThickness: RtPercentSize;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _thickDim: IPercentSize;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(gauge: CircleGauge) {
        super(gauge);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * segment 두께.
     * 픽셀 단위 크기나, 게이지 원호 두께에 대한 상대 크기로 지정할 수 있다.
     * 
     * @config
     */
    get segmentThickness(): RtPercentSize {
        return this._segmentThickness;
    }
    set segmentThickness(value: RtPercentSize) {
        if (value !== this._segmentThickness) {
            this._segmentThickness = value;
            this._thickDim = parsePercentSize(this.segmentThickness, true);
        }
    }

    /**
     * segement 사이의 간격.
     */
    segmentGap = 0;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getSegmentThickness(domain: number): number {
        return calcPercent(this._thickDim, domain, domain);
    }
    
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
}

export class CircleGaugeValueRim extends CircleGaugeRim {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    private _thickness: RtPercentSize;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _thickDim: IPercentSize;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(gauge: CircleGauge) {
        super(gauge);

        this.thickness = '100%';
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 테두리 굵기.
     * 픽셀 단위의 크기나, {@link CircularGauge.radius}와 {@link CircularGauge.innerRadius}로 결정된 원호 굵기에 대한 상대적 크기로 지정할 수 있다.
     * 예) 지정하지 않거나 '100%'로 지정하면 게이지 원호 굵기와 동일하게 표시된다.
     * 
     * @config
     */
    get thickness(): RtPercentSize {
        return this._thickness;
    }
    set thickness(value: RtPercentSize) {
        if (value !== this._thickness) {
            this._thickness = value;
            this._thickDim = parsePercentSize(this.thickness, true);    
        }
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getThickness(domain: number): number {
        return calcPercent(this._thickDim, domain, domain);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
}

export class CircleGaugeValueMarker extends ChartItem {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(gauge: CircleGauge) {
        super(gauge.chart, false);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
}

export class CircleGaugeHand extends ChartItem {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    private _radius: RtPercentSize;
    private _length: RtPercentSize;
    private _offset: RtPercentSize;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _radiusDim: IPercentSize;
    private _lengthDim: IPercentSize;
    private _offsetDim: IPercentSize;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(gauge: CircleGauge) {
        super(gauge.chart, false);

        this.radius = 3;
        this.length = '100%';
        this.offset = 0;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 게이지 중심쪽의 바늘 반지름.
     * 픽셀 단위 크기나, 게이지 원호 반지름에 대한 상대 크기로 지정할 수 있다.
     * 
     * @config
     */
    get radius(): RtPercentSize {
        return this._radius;
    }
    set radius(value: RtPercentSize) {
        if (value !== this._radius) {
            this._radius = value;
            this._radiusDim = parsePercentSize(value, true);
        }
    }

    /** 
     * 바늘 길이.
     * 픽셀 단위 크기나, 게이지 원호 반지름에 대한 상대 크기로 지정할 수 있다.
     * 
     * @config
     */
    get length(): RtPercentSize {
        return this._length;
    }
    set length(value: RtPercentSize) {
        if (value !== this._length) {
            this._length = value;
            this._lengthDim = parsePercentSize(value, true);
        }
    }

    /**
     * 바늘 중심과 게이지 중심 사이의 간격.
     * 픽셀 단위 크기나, 게이지 원호 반지름에 대한 상대 크기로 지정할 수 있다.
     * 
     * @config
     */
    get offset(): RtPercentSize {
        return this._offset;
    }
    set offset(value: RtPercentSize) {
        if (value !== this._offset) {
            this._offset = value;
            this._offsetDim = parsePercentSize(value, true);
        }
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getExtents(domain: number): {radius: number, length: number, offset: number} {
        return {
            radius: calcPercent(this._radiusDim, domain, 0),
            length: calcPercent(this._lengthDim, domain, 0),
            offset: calcPercent(this._offsetDim, domain, 0)
        };
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
}

export class CircleGaugePin extends ChartItem {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    private _radius: RtPercentSize;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _radiusDim: IPercentSize;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(gauge: CircleGauge) {
        super(gauge.chart, false);

        this.radius = 5;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 핀 반지름.
     * 픽셀 단위 크기나, 게이지 원호 반지름에 대한 상대 크기로 지정할 수 있다.
     * 
     * @config
     */
    get radius(): RtPercentSize {
        return this._radius;
    }
    set radius(value: RtPercentSize) {
        if (value !== this._radius) {
            this._radius = value;
            this._radiusDim = parsePercentSize(value, true);
        }
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getRadius(domain: number): number {
        return calcPercent(this._radiusDim, domain, 0);
    }
}

export class CircleGaugeScale extends GaugeScale {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    stepPixels = 92;

    protected _getStepMultiples(step: number): number[] {
        //return [1, 2, 2.5, 5, 10];
        return [1, 3, 6, 12];
    }
}

/**
 * 게이지 모델.
 * 
 * @config chart.gauge[type='circle']
 */
export class CircleGauge extends CircularGauge {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart) {
        super(chart);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 게이지 본체 주변이나 내부에 값 영역들을 구분해서 표시하는 band의 모델.
     * 
     * @config
     */
    bandRim = new GuageRangeBand(this);
    /**
     * 스케일 모델.
     * 
     * @config
     */
    scaleRim = new CircleGaugeScale(this, false);
    /**
     * 게이지 배경 원호 테두리 설정 모델.
     * 
     * @config
     */
    rim = new CircleGaugeBackRim(this);
    /**
     * 게이지의 값 원호 테두리 설정 모델.
     * 
     * @config
     */
    valueRim = new CircleGaugeValueRim(this);
    marker = new CircleGaugeValueMarker(this);
    /**
     * 게이지 바늘 설정 모델.
     * 
     * @config
     */
    hand = new CircleGaugeHand(this);
    /**
     * 게이지 중앙에 표시되는 핀 설정 모델.
     * 
     * @config
     */
    pin = new CircleGaugePin(this);

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'circle';
    }

    getExtents(gaugeSize: number): ICircularGaugeExtents {
        const exts = super.getExtents(gaugeSize);
        const scaleRim = this.scaleRim;
        const bandRim = this.bandRim;
        let outer = exts.radius;

        if (bandRim.visible) {
            if (bandRim.position === GaugeItemPosition.DEFAULT) {
                const thick = bandRim.thickness + bandRim.gap;

                outer += thick;
                exts.band = outer;
            }
        }

        if (scaleRim.visible) {
            if (scaleRim.position === GaugeItemPosition.DEFAULT) {
                const thick = Math.max(1, scaleRim.tick.length || 0) + scaleRim.gap;
            
                outer += thick;
                exts.scale = outer;
            }
        }
        return exts;
    }
}

export class CircleGaugeGroup extends GaugeGroup<CircleGauge> {
}