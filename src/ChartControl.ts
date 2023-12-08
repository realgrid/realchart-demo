////////////////////////////////////////////////////////////////////////////////
// ChartControl.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isObject } from "./common/Common";
import { RcControl, RcElement } from "./common/RcControl";
import { IRect } from "./common/Rectangle";
import { Align } from "./common/Types";
import { ImageExporter } from "./export/ImageExporter";
import { Axis } from "./model/Axis";
import { Chart, ExportOptions, ExportType, IChartEventListener } from "./model/Chart";
import { ChartItem } from "./model/ChartItem";
import { DataPoint } from "./model/DataPoint";
import { Series } from "./model/Series";
import { ChartPointerHandler } from "./tool/PointerHandler";
import { ChartView } from "./view/ChartView";

export class ChartControl extends RcControl implements IChartEventListener {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _model: Chart;
    private _chartView: ChartView;
    private _menuButton: HTMLDivElement;
    private _contextmenu: HTMLDivElement;
    private _menuList: HTMLUListElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, container: string | HTMLDivElement) {
        super(doc, container);

        this.addElement(this._chartView = new ChartView(doc));

        this.setPointerHandler(new ChartPointerHandler(this));
    }

    //-------------------------------------------------------------------------
    // IChartEventListener
    //-------------------------------------------------------------------------
    onModelChanged(chart: Chart, item: ChartItem): void {
        this.invalidateLayout();
    }

    onVisibleChanged(chart: Chart, item: ChartItem): void {
        // if (item instanceof Series) {
            this.invalidateLayout();
        // }
    }

    onPointVisibleChanged(chart: Chart, series: Series, point: DataPoint): void {
        this.invalidateLayout();
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * chart model.
     */
    get model(): Chart {
        return this._model;
    }
    set model(value: Chart) {
        if (value !== this._model) {
            if (this._model) {
                this._model.assets.unregister(this.doc(), this);
                this._model.removeListener(this);
            }
            this._model = value;
            if (this._model) {
                this._model.addListener(this);
                this._model.assets.register(this.doc(), this);
            }
            this.invalidateLayout();
        }
    }

    chartView(): ChartView {
        return this._chartView;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    load(config: any, loadAnimation = false): void {
        this.loaded = !loadAnimation; 
        this.clearAssetDefs();
        this.model = new Chart(config);
    }

    refresh(now: boolean): void {
        if (now) {
            this._render();
        } else {
            this.invalidateLayout();
        }
    }

    scroll(axis: Axis, pos: number): void {
        this._chartView.getAxis(axis)?.scroll(pos);
    }

    isMenuButton(dom: Element): boolean {
        return dom.isEqualNode(this._menuButton);
    }

    isMenuItem(dom: Element): boolean {
        return !dom.isEqualNode(this._menuList) && this._menuList.contains(dom);
    }

    onMenuClick(dom: Element): void {
        const contextmenu = this._contextmenu;
        if (contextmenu) {
            contextmenu.style.display = contextmenu.style.display === 'none' ? 'block' : 'none';
        }
    }

    onMenuItemClick(dom: Element): void {
        const type = dom.id;
        const {fileName, includeScrollbar, includeNavigator, includeZoomButton} = this._model.export;
        switch(type) {
            case ExportType.PNG:
            case ExportType.JPEG:
                new ImageExporter().export(this.dom(), {type, fileName, includeScrollbar, includeNavigator, includeZoomButton});
                break;
            default:
                break;
        }
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    useImage(src: string): void {
    }

    protected _doRender(bounds: IRect): void {
        const model = this._model;
        const view = this._chartView;
        
        this.clearTemporaryDefs();

        if (model) {
            this.setData('theme', model.options.theme, true);
            this.setData('palette', model.options.palette);

            if (model.export.visible) {
                this._menuButton ? this.$_layoutContextMenu(model.export) : this.$_initExportMenu(model.export);
            }
        }
        view.measure(this.doc(), model, bounds.width, bounds.height, 1);
        view.setRect(bounds);
        view.layout();
    }

    protected _doRenderBackground(elt: HTMLDivElement, root: RcElement, width: number, height: number): void {
        if (this._model) {
            const style: any = this._model.options.style;

            if (isObject(style)) {
                for (const p in style) {
                    if (p.startsWith('padding')) {
                        root.setStyle(p, style[p]);
                    } else {
                        elt.style[p] = style[p];
                    }
                }
            }
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_initExportMenu(options: ExportOptions): void {
        const doc = this.doc();
        const dom = this.dom();
        
        const contextmenuButton = this._menuButton = doc.createElement('div');
        contextmenuButton.classList.add('rct-contextmenu-button');
        contextmenuButton.style.position = 'absolute';

        const contextmenu = this._contextmenu = doc.createElement('div');
        contextmenu.classList.add('rct-contextmenu');
        contextmenu.style.position = 'absolute';
        contextmenu.style.display = 'none';
        contextmenu.style.right = '0px';

        const menuList = this._menuList = doc.createElement('ul');
        menuList.classList.add('rct-contextmenu-list');
        
        contextmenu.appendChild(menuList);
        contextmenuButton.appendChild(contextmenu);
        dom.appendChild(contextmenuButton);

        this.$_layoutContextMenu(options);
    }

    private $_layoutContextMenu(options: ExportOptions): void {
        const doc = this.doc();
        const dom = this.dom();
        const rect = dom.getBoundingClientRect();
        const contextmenuButton = this._menuButton;
        const contextmenu = this._contextmenu;

        contextmenuButton.style.top = options.offsetY + 'px';
        contextmenuButton.style.left = rect.width - options.width + options.offsetX + 'px';
        contextmenuButton.style.width = options.width + 'px';
        contextmenuButton.style.height = options.height + 'px';
        contextmenuButton.style.backgroundImage = options.imageUrl || '';

        contextmenu.style.top = options.height + 'px';

        this._menuList.innerHTML = '';
        options.type.forEach((type) => {
            const menuItem = doc.createElement('li');
            menuItem.classList.add('rct-contextmenu-item');
            menuItem.id = type;
            menuItem.textContent = `Download ${type.toUpperCase()}`;
            this._menuList.appendChild(menuItem);
        });
    }
}
