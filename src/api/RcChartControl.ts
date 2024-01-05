////////////////////////////////////////////////////////////////////////////////
// RcChartControl.ts
// 2023. 09. 15. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021-2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ChartControl } from "../ChartControl";
import { Annotation } from "../model/Annotation";
import { Axis } from "../model/Axis";
import { Body } from "../model/Body";
import { ChartItem } from "../model/ChartItem";
import { Gauge } from "../model/Gauge";
import { Legend } from "../model/Legend";
import { Series } from "../model/Series";
import { Subtitle, Title } from "../model/Title";
import { RcAnnotation, RcBody, RcChartAxis, RcChartGauge, RcChartObject, RcChartSeries, RcLegend, RcSubtitle, RcTitle } from "./RcChartModels";

function getObject(map: Map<any, any>, obj: ChartItem): RcChartObject {
    if (obj) {
        let p = map.get(obj);

        if (!p) {
            if (obj instanceof Series) {
                p = new (RcChartSeries as any)(obj);
            } else if (obj instanceof Axis) {
                p = new (RcChartAxis as any)(obj);
            } else if (obj instanceof Gauge) {
                p = new (RcChartGauge as any)(obj);
            } else if (obj instanceof Annotation) {
                p = new (RcAnnotation as any)(obj);
            } else if (obj instanceof Title) {
                p = new (RcTitle as any)(obj);
            } else if (obj instanceof Subtitle) {
                p = new (RcSubtitle as any)(obj);
            } else if (obj instanceof Legend) {
                p = new (RcLegend as any)(obj);
            } else if (obj instanceof Body) {
                p = new (RcBody as any)(obj);
            }
            map.set(obj, p);
        }
        return p;
    }
}

export interface RealChartExporter {
    // export: (options, type) => void;
    // print: (options) => void;
    render: (options: any) => void;
}

/**
 * RealChart 컨트롤.
 */
export class RcChartControl {

    private $_p: ChartControl;
    private _objects = new Map<ChartItem, RcChartObject>();
    private _proxy = {
        getChartObject: (model: any): object => {
            return getObject(this._objects, model);
        },
    };
    private _exporter: RealChartExporter;

    /** 
     * @internal 
     */
    private constructor(control: ChartControl) {
        this.$_p = control;
    }

    /**
     * 기존 설정 모델을 제거하고 새로운 설정으로 차트를 재구성한다.
     */
    load(config: any, animate?: boolean): void {
        this.$_p.load(config, animate);
        const model = this.$_p.model;
        model._proxy = this._proxy;

        const realChartExporter = window['RealChartExporter'];
        const exportVisible = model.exportOptions.visible;
        if (realChartExporter && exportVisible) {
            this._exporter = realChartExporter.render(this.$_p.doc(), this.$_p.dom(), model.exportOptions);
        };

        this._objects.clear();
    }
    /**
     * 차트를 다시 그린다.
     * 
     * @param now true로 지정하면 즉시 차트 SVG를 디시 구축한다.
     */
    render(now = false): void {
        this.$_p.refresh(now);
        this._exporter && this._exporter.render(this.$_p.model.exportOptions);
    }
    /**
     * 첫번째 x 축.
     */
    get xAxis(): RcChartAxis {
        return getObject(this._objects, this.$_p.model.xAxis as Axis) as RcChartAxis;
    }
    /**
     * name 매개변수가 문자열이면 지정한 이름의 x 축을,
     * 숫자이면 해당 index에 위치하는 x 축을 리턴한다.
     * 
     * @param name 이름이나 index
     * @returns 축 객체
     */
    getXAxis(name: string | number): RcChartAxis {
        return getObject(this._objects, this.$_p.model.getXAxis(name)) as RcChartAxis;
    }
    /**
     * 첫번째 y 축.
     */
    get yAxis(): RcChartAxis {
        return getObject(this._objects, this.$_p.model.yAxis as Axis) as RcChartAxis;
    }
    /**
     * name 매개변수가 문자열이면 지정한 이름의 y 축을,
     * 숫자이면 해당 index에 위치하는 y 축을 리턴한다.
     * 
     * @param name 이름이나 index
     * @returns 축 객체
     */
    getYAxis(name: string | number): RcChartAxis {
        return getObject(this._objects, this.$_p.model.getYAxis(name)) as RcChartAxis;
    }
    /**
     * 첫번째 시리즈.
     */
    get series(): RcChartSeries {
        return getObject(this._objects, this.$_p.model.firstSeries) as RcChartSeries;
    }
    /**
     * 시리즈 이름에 해당하는 시리즈 객체를 리턴한다.
     * 
     * @param name 시리즈 이름
     * @returns 시리즈 객체
     */
    getSeries(name: string): RcChartSeries {
        return getObject(this._objects, this.$_p.model.seriesByName(name)) as RcChartSeries;
    }
    /**
     * 첫번째 게이지.
     */
    get gauge(): RcChartGauge {
        return getObject(this._objects, this.$_p.model.firstGauge) as RcChartGauge;
    }
    /**
     * 게이지 이름에 해당하는 게이지 객체를 리턴한다.
     * 
     * @param name 게이지 이름
     * @returns 게이지 객체
     */
    getGauge(name: string): RcChartGauge {
        return getObject(this._objects, this.$_p.model.gaugeByName(name)) as RcChartGauge;
    }
    /**
     * Annotation 이름에 해당하는 Annotation 객체를 리턴한다.
     * 
     * @param name Annotation 이름
     * @returns Annotation 객체
     */
    getAnnotation(name: string): RcAnnotation {
        return getObject(this._objects, this.$_p.model.annotationByName(name)) as RcAnnotation;
    }
    /**
     * 차트 타이틀 모델.
     */
    get title(): RcTitle {
        return getObject(this._objects, this.$_p.model.title) as RcTitle;
    }
    /**
     * 차트 부제목 모델.
     */
    get subtitle(): RcSubtitle {
        return getObject(this._objects, this.$_p.model.subtitle) as RcSubtitle;
    }
    /**
     * 차트 범례 모델.
     */
    get legend(): RcLegend {
        return getObject(this._objects, this.$_p.model.legend) as RcLegend;
    }
    /**
     * split 모드가 아닐 때, 차트 시리즈들이 그려지는 plotting 영역 모델.
     */
    get body(): RcBody {
        return getObject(this._objects, this.$_p.model.legend) as RcBody;
    }
    /**
     * 
     * 기본 시리즈 종류.\
     * 시리즈에 type을 지정하지 않으면 이 속성 type의 시리즈로 생성된다.
     * 
     * @default 'bar'
     * @readonly
     */
    get type(): string {
        return this.$_p.model.type;
    }
    // set type(value: string) {
    //     if (value !== this.$_p.model.type) {
    //         this.$_p.model.type = value;
    //         this.$_p.invalidateLayout();
    //     }
    // }
    /**
     * 
     * 기본 게이지 종류.\
     * 게이지에 type을 지정하지 않으면 이 속성 type의 시리즈로 생성된다.
     * 
     * @default 'circle'
     * @readonly
     */
    get gaugeType(): string {
        return this.$_p.model.gaugeType;
    }
    // set gaugeType(value: string) {
    //     if (value !== this.$_p.model.gaugeType) {
    //         this.$_p.model.gaugeType = value;
    //         this.$_p.invalidateLayout();
    //     }
    // }
    /**
     * true면 x축과 y축을 뒤바꿔 표시한다.\
     * 즉, true면 x축이 수직, y축이 수평으로 배치된다.
     */
    get inverted(): boolean {
        return this.$_p.model.inverted;
    }
    // set inverted(value: boolean) {
    //     if (value !== this.$_p.model.inverted) {
    //         this.$_p.model.inverted = value;
    //         this.$_p.invalidateLayout();
    //     }
    // }
    /**
     * true면 차트가 {@link https://en.wikipedia.org/wiki/Polar_coordinate_system 극좌표계}로 표시된다.
     * 기본은 {@link https://en.wikipedia.org/wiki/Cartesian_coordinate_system 직교좌표계}이다.
     * 극좌표계일 때,
     * x축이 원호에, y축은 방사선에 위치하고, 아래의 제한 사항이 있다.
     * 1. x축은 첫번째 축 하나만 사용된다.
     * 2. axis.position 속성은 무시된다.
     * 3. chart, series의 inverted 속성이 무시된다.
     * 4. 극좌표계에 표시할 수 없는 series들은 표시되지 않는다.
     * 
     * @readonly
     */
    get polar(): boolean {
        return this.$_p.model.polar;
    }
    // set polar(value: boolean) {
    //     if (value !== this.$_p.model.polar) {
    //         this.$_p.model.polar = value;
    //         this.$_p.invalidateLayout();
    //     }
    // }

    scroll(axis: RcChartAxis, pos: number): void {
        this.$_p.scroll(axis.$_p as any, pos);
    }

    // exportImage(options?: ImageExportOptions) {
    //     new ImageExporter().export(this.$_p.dom(), options)
    // }
  
    setParam(param: string, value: any, redraw?: boolean): void {
        this.$_p.model?.setParam(param, value, redraw);
    }
}