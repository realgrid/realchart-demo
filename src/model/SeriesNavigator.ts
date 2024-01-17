////////////////////////////////////////////////////////////////////////////////
// SeriesNavigator.ts
// 2023. 10. 18. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isObject, assign } from "../common/Common";
import { Axis } from "./Axis";
import { IChart } from "./Chart";
import { ChartItem } from "./ChartItem";
import { Series } from "./Series";

export class NavigiatorHandle extends ChartItem {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
}

export class NavigatorMask extends ChartItem {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
}

const SERIES = {
    'area': () => {
        return {
            type: 'area',
        };
    },
    'line': () => {
        return {
            type: 'line',
        };
    },
    'bar': () => {
        return {
            type: 'bar',
        };
    },
};

const AXES = {
    'category': () => {
        return {
            type: 'category',
        };
    },
    'linear': () => {
        return {
            type: 'linear',
        };
    },
    'time': () => {
        return {
            type: 'time',
        };
    },
    'log': () => {
        return {
            type: 'log',
        };
    }
}

const AXIS = {
    minPadding: 0,
    maxPadding: 0
}

/**
 * 시리즈 내비게이터 모델.<br/>
 * 내비게이터에 표시되는 시리즈는 기본적으로 'area' 시리즈로 표시되지만,
 * 'line', 'area', 'bar' 시리즈로 지정할 수도 있다.<br/>
 * 내비게이터의 x축 종류는 명시적으로 설정하지 않으면 소스 시리즈의 x축 type을 따라간다.
 * y축은 항상 'linear'로 생성된다.
 * 
 * @config chart.seriesNavigator
 */
export class SeriesNavigator extends ChartItem {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    private _thickness = 45;
    private _gap = 8;
    private _gapFar = 3;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _source: Series;
    _naviChart: IChart;

    _dataChanged = true;
    _vertical: boolean;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart) {
        super(chart, false);

        this.handle = new NavigiatorHandle(chart, true);
        this.mask = new NavigatorMask(chart, true);
        this.borderLine = new ChartItem(chart, true);
    }
    
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * Navigator 시리즈의 data나 축 범위를 제공하는 본 시리즈의 이름이나 index.
     * 
     * @config
     */
    source: string;
    /**
     * true로 지정하면 {@link source}로 지정한 원본 시리즈로부터 내비게이터 시리즈의 데이터포인트들을 생성할 때,
     * 원본 시리즈의 data로 지정된 값들을 사용하고, 내비게이터 시리즈의 yField를 원본과 다르게 지정할 수도 있다.<br/>
     * 기본값 false일 때는 이미 생성된 원본 데이터포인트의 x, y 값을 사용한다.
     * // #431
     * 
     * @config
     */
    usePointSource = false;
    handle: NavigiatorHandle;
    mask: NavigatorMask;
    borderLine: ChartItem;
    /**
     * Navigator에 표시되는 시리즈 모델<br/>
     * 기본적으로 'area' 시리즈로 표시되지만,
     * 'line', 'area', 'bar' 시리즈로 지정할 수도 있다.
     * data는 {@link source 원본}에서 가져온다.
     * 
     * @config
     */
    series: any;
    xAxis: any;
    yAxis: any;
    liveScroll = true;
    minSize = 0.05; // #244 #245
    /**
     * 네비게이터 두께.
     */
    get thickness(): number {
        return this._thickness;
    }
    set thickness(value: number) {
        this._thickness = +value || this._thickness;
    }
    /**
     * 네비게이터와 차트 본체 방향 사이의 간격.
     */
    get gap(): number {
        return this._gap;
    }
    set gap(value: number) {
        this._gap = +value || this._gap;
    }
    /**
     * 네비게이터와 차트 본체 반대 방향 사이의 간격.
     */
    get gapFar(): number {
        return this._gapFar;
    }
    set gapFar(value: number) {
        this._gapFar = +value || this._gapFar;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    isVisible(): boolean {
        return this.visible;
    }

    axisLen(): number {
        return (this._naviChart.xAxis as Axis).length();
    }

    axis(): Axis {
        return this._source._xAxisObj as Axis;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    private _config: any;
    private _axisType: string;

    protected _doLoad(src: any): void {
        super._doLoad(src);

        const config: any = {
        };

        // series
        if (isObject(src.series)) {
            let t = src.series.type;
            if (t !== 'area' && t !== 'line' && t !== 'bar') t = 'area';
            config.series = assign({}, src.series, (SERIES[t])());
        } else {
            config.series = SERIES['area']();
        }
        // x-axis
        if (isObject(src.xAxis)) {
            config.xAxis = assign({}, src.xAxis, (AXES[src.xAxis.type] || AXES['linear'])(), AXIS);
        } else {
            // config.xAxis = assign(AXES['linear'](), AXIS);
            config.xAxis = assign({}, AXIS);
        }

        // y-axis
        if (isObject(src.yAxis)) {
            config.yAxis = assign({}, src.yAxis, (AXES[src.yAxis.type] || AXES['linear'])(), AXIS);
        } else {
            config.yAxis = assign(AXES['linear'](), AXIS);
        }

        this._config = config;
        this._axisType = config.xAxis.type;

        // this._naviChart = this.chart._createChart(config);
    }

    protected _doPrepareRender(chart: IChart): void {
        const source = chart._getSeries().getSeries(this.source) || chart.firstSeries;

        // TODO: 데이터 변경
        if (source !== this._source) {
            this._source = source;

            if (!this._axisType) {
                this._config.xAxis.type = this._source._xAxisObj._type();
            }
            this._naviChart = this.chart._createChart(this._config);

            if (this.usePointSource) {
                this._naviChart.firstSeries._loadPoints(this._source.getPoints()['_points'].map(p => p.source));
            } else {
                this._naviChart.firstSeries._loadPoints(this._source.getPoints()['_points']);
            }
            // // this._naviChart.firstSeries._loadPoints(this._source.getPoints().getProxies());
            // this._naviChart.firstSeries._loadPoints(this._source.getPoints()['_points']);
            // // this._naviChart.firstSeries._loadPoints(this._source.getPoints()['_points'].map(p => p.source));
        }

        this._vertical = false;
        this._naviChart.prepareRender();
    }
}
