////////////////////////////////////////////////////////////////////////////////
// Tester.ts
// 22020. 08. 10. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2020 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import * as fs from 'fs';
import { PADDING_ZERO } from '../src/common/Types';

function loadJson(path: string): any {
    if (!path.endsWith('.json')) path += '.json';
    const lines = fs.readFileSync(path).toString();
    const data = JSON.parse(lines);
    return data;
}

function loadFile(path: string): any {
    const s = fs.readFileSync(path).toString();
    return s;
}

// class TestDataListner implements IListDataListener {
//     valueUpdated = 0;
//     rowUpdated = 0;
//     rowsUpdated = 0;
//     rowAdded = 0;
//     rowsAdded = 0;
//     cleared = 0;
//     rowDeleted = 0;
//     rowsDeleted = 0;
//     rangeDeleted = 0;
//     rowMoved = 0;
//     rowsMoved = 0;
//     countChanged = 0;
//     changed = 0;

//     clear(): void {
//         this.valueUpdated = this.rowUpdated = this.rowsUpdated =
//         this.rowAdded = this.rowsAdded = 
//         this.rowDeleted = this.rowsDeleted = this.rangeDeleted = this.cleared =
//         this.rowMoved = this.rowsMoved =
//         this.countChanged = this.changed = 0;
//     }

//     onDataValueUpdated(data: ListData, row: number, field: string, value: any, oldValue: any): void {
//         this.valueUpdated++;
//     }
//     onDataRowUpdated(data: ListData, row: number): void {
//         this.rowUpdated++;
//     }
//     onDataRowsUpdated(data: ListData, rows: number[]): void {
//         this.rowsUpdated++;
//     }
//     onDataRowAdded(data: ListData, row: number): void {
//         this.rowAdded++;
//     }
//     onDataRowsAdded(data: ListData, row: number, count: number): void {
//         this.rowsAdded++;
//     }
//     onDataCleared(data: ListData): void {
//         this.cleared++;
//     }
//     onDataRowDeleted(data: ListData, row: number): void {
//         this.rowDeleted++;
//     }
//     onDataRowsDeleted(data: ListData, rows: number[]): void {
//         this.rowsDeleted++;
//     }
//     onDataRangeDeleted(data: ListData, row: number, count: number): void {
//         this.rangeDeleted++;
//     }
//     onDataRowMoved(data: IDataView, from: number, to: number): void {
//         this.rowMoved++;
//     }
//     onDataRowsMoved(data: IDataView, from: number, count: number, to: number): void {
//         this.rowsMoved++;
//     }
//     onDataCountChanged(data: ListData, newCount: number, oldCount: number): void {
//         this.countChanged++;
//     }
//     onDataChanged(data: ListData): void {
//         this.changed++;
//     }
// }

// interface ITestRenderer {
//     testRender(): void;
// }

// export class Tester {

//     //-------------------------------------------------------------------------
//     // consts
//     //-------------------------------------------------------------------------
//     static readonly LIST_CONTROL_ID = 'list-control';

//     //-------------------------------------------------------------------------
//     // static members
//     //-------------------------------------------------------------------------
//     static rotateScreen(control: ListControl): void {
//         const w = window.innerWidth;
//         (window as any)['innerWidth'] = window.innerHeight;
//         (window as any)['innerHeight'] = w;
//         if (control) {
//             const container = document.getElementById(this.LIST_CONTROL_ID) as HTMLDivElement;
//             container.style.width = control.height() + 'px';
//             container.style.height = control.width() + 'px';
//             control['_screenOrientation'] = (control['$_getScreenOrientation']());
//             Dom.resize(control['_dom'], control.height(), control.width());
//             control['$_checkOrientation']();
//         }
//     }

//     static prepareTimer(steps = 10): void {
//         Utils.setInterval = function (handler: () => void, interval: number): any {
//             const handle: any = {
//                 active: true,
//                 step: 0
//             };
//             handle.runner = function () {
//                 while (handle.active && handle.step < 1) {
//                     handler();
//                     handle.step += 1 / steps;
//                 }
//                 handler();
//             };
//             return handle;
//         }
//         Utils['runInterval'] = function (handle: any): void {
//             handle.runner();
//         }
//         Utils.clearInterval = function (handle: any): void {
//             if (handle) {
//                 handle.active = false;
//             }
//         }
//     }

//     static createDataListener(data: ListData): TestDataListner {
//         const listener = new TestDataListner();
//         data.addListener(listener);
//         return listener;
//     }

//     static createListControl(data?: ListData, width?: number, height?: number): TestListControl {
//         const container = document.getElementById(this.LIST_CONTROL_ID) as HTMLDivElement;
//         container.style.width = (width || 500) + 'px';
//         container.style.height = (height || 700) + 'px';
//         const control = new TestListControl(document, container);
//         control['_dom'].style.width = (width || 500) + 'px';
//         control['_dom'].style.height = (height || 700) + 'px';
//         if (data) control.setData(data);
//         return control;
//     }

//     static createListControlD(data?: RtDataSource, width?: number, height?: number): TestListControlD {
//         const container = document.getElementById(this.LIST_CONTROL_ID) as HTMLDivElement;
//         container.style.width = (width || 500) + 'px';
//         container.style.height = (height || 700) + 'px';
//         const control = new TestListControlD(document, container);
//         control['$_c']['_dom'].style.width = (width || 500) + 'px';
//         control['$_c']['_dom'].style.height = (height || 700) + 'px';
//         if (data) control.data = data;
//         return control;
//     }

//     // /web에 있는 json 파일 데이터를 읽어들인다.
//     static loadWebJsonData(name: string, callback?: (row: any) => void): any[] {
//         const data = loadJson('web/realtouch/data/' + name);

//         if (callback) {
//             for (let row of data) {
//                 callback(row);
//             }
//         }
//         return data;
//     }

//     // /test/asset/data 에 있는 json 파일 데이터를 읽어들인다.
//     static loadJsonData(name: string, callback?: (row: any) => void): any[] {
//         const data = loadJson('test/asset/data/' + name);

//         if (callback) {
//             for (let row of data) {
//                 callback(row);
//             }
//         }
//         return data;
//     }
//     static loadFileData(name: string, callback?: (row: any) => void): any {
//         const data = loadFile('test/asset/data/' + name);

//         if (callback) {
//             for (let row of data) {
//                 callback(row);
//             }
//         }
//         return data;
//     }

//     static sampleRows(sample: any, count: number): any[] {
//         const rows: any = [];

//         for (let i = 0; i < count; i++) {
//             const row = {};
//             for (let p in sample) {
//                 row[p] = sample[p] + (i + 1);
//             }
//             rows.push(row);
//         }
//         return rows;
//     }

//     // test/asset/templates 에 있는 json 파일 데이터를 읽어들인다.
//     static loadTemplate(name: string): any {
//         return loadJson('test/asset/templates/' + name );
//     }

//     // 숫자가 format된 문자열을 숫자로.
//     static toNum(s: string | null): number {
//         return s ? parseFloat(s.replace(/\,/g, '')) : NaN;
//     }

//     static checkSorting(dv: ListDataView, field: string): void {
//         const opt = dv.getSortOption(field);
//         let prev = dv.getValue(0, field, true);

//         for (let i = 1; i < dv.rowCount(); i++) {
//             const v = dv.getValue(i, field, true);

//             if (opt.dir === RtSortDirection.DESCENDING) {
//                 if (v > prev) throw new Error('Invalid sorting: ' + v + ' > ' + prev);
//             } else {
//                 if (v < prev) throw new Error('Invalid sorting: ' + v + ' < ' + prev);
//             }
//             prev = v;
//         }
//     }

//     static createMouseEvent(event: string, button = 0): MouseEvent {
//         const init = {
//             bubbles: true,  // 이걸 해야 dom 이벤트가 control에서 잡힌다.
//             cancelable: true,
//             button: button,
//         };
//         return new MouseEvent(event, init)
//     }

//     static createTouchEvent(event: string, touch?: any): TouchEvent {
//         const init: TouchEventInit = {
//             bubbles: true,  // 이걸 해야 dom 이벤트가 control에서 잡힌다.
//             cancelable: true,
//         };
//         if (touch) {
//             init.touches = [touch];
//             init.changedTouches = [touch];
//         }
//         return new TouchEvent(event, init)
//     }

//     // !! jsdom이 PointerEvent를 지원하지 않는다.
//     static createPointerEvent(event: string, dom: Element, dx = 0, dy = 0): any {
//         const r = dom.getBoundingClientRect();
//         return {
//             type: event,
//             target: dom,
//             isPrimary: true,
//             buttons: 1,
//             pageX: r.x + document.body.scrollLeft + dx,
//             pageY: r.y + document.body.scrollTop + dy,
//             preventDefault: function () {},
//             stopImmediatePropagation: function () {}
//         };
//     }

//     static click_dom(renderer: ITestRenderer, dom: Element, button = 0): void {
//         // if (dom) {
//         //     Tester.touch(renderer, dom);

//         //     const ev = Tester.createMouseEvent('click', button);
//         //     dom.dispatchEvent(ev);
//         //     renderer.testRender();
//         // }
//         if (dom) {
//             Tester.touch(renderer, dom);
//             Tester.move(renderer, dom, 0, 0);
//             Tester.up(renderer, dom);

//             // jsdom이 mouse click 이벤트는 지원한다.
//             const ev = Tester.createMouseEvent('click', button);
//             dom.dispatchEvent(ev);
//             renderer.testRender();

//             // const ev = Tester.createPointerEvent('click', dom);
//             // (renderer as TestListControl).activeTool().click(ev);
//             // renderer.testRender();
//         }
//     }

//     static touch(renderer: ITestRenderer, dom: Element): void {
//         // if (dom) {
//         //     const r = dom.getBoundingClientRect();
//         //     const x = r.left + r.width / 2;
//         //     const y = r.top + r.height / 2;
//         //     let touch = {pageX: x, pageY: y, target: dom, identifier: 1};
//         //     const ev = Tester.createTouchEvent('touchstart', touch);
//         //     dom.dispatchEvent(ev);
//         //     renderer.testRender();
//         // }
//         if (dom) {
//             const ev = Tester.createPointerEvent('pointerdown', dom);
//             (renderer as TestListControl).activeTool().pointerDown(ev);
//             renderer.testRender();
//         }
//     }

//     static move(renderer: ITestRenderer, dom: Element, dx: number, dy: number): void {
//         // const r = dom.getBoundingClientRect();
//         // const x = r.left + r.width / 2;
//         // const y = r.top + r.height / 2;
//         // let touch = {pageX: x + dx, pageY: y + dy, target: dom, identifier: 1};
//         // let ev = Tester.createTouchEvent('touchmove', touch);
//         // dom.dispatchEvent(ev);
//         // renderer.testRender();

//         if (dom) {
//             const ev = Tester.createPointerEvent('pointermove', dom, dx, dy);
//             (renderer as TestListControl).activeTool().pointerMove(ev);
//             renderer.testRender();
//         }
//     }

//     static up(renderer: ITestRenderer, dom: Element): void {
//         if (dom) {
//             const ev = Tester.createPointerEvent('pointerup', dom);
//             (renderer as TestListControl).activeTool().pointerUp(ev);
//             renderer.testRender();
//         }
//     }

//     static drag(renderer: ITestRenderer, dom: Element, dx: number, dy: number): void {
//         // if (dom) {
//         //     const r = dom.getBoundingClientRect();
//         //     const x = r.left + r.width / 2;
//         //     const y = r.top + r.height / 2;
//         //     let touch = {pageX: x, pageY: y, target: dom, identifier: 1};
//         //     let ev = Tester.createTouchEvent('touchstart', touch);
//         //     dom.dispatchEvent(ev);
//         //     renderer.testRender();

//         //     touch = {pageX: x + dx, pageY: y + dy, target: dom, identifier: 1};
//         //     ev = Tester.createTouchEvent('touchmove', touch);
//         //     dom.dispatchEvent(ev);
//         //     renderer.testRender();

//         //     touch = {pageX: x + dx, pageY: y + dy, target: dom, identifier: 1};
//         //     ev = Tester.createTouchEvent('touchend', touch);
//         //     dom.dispatchEvent(ev);
//         //     renderer.testRender();
//         // }

//         if (dom) {
//             Tester.touch(renderer, dom);
//             Tester.move(renderer, dom, dx, dy);
//             Tester.up(renderer, dom);
//         }
//     }

//     static renderContext(obj: {row: number, gindex?: number, field?: string, layout?: SimpleLayoutChild, value: any}): IRenderContext {
//         const ctx: IRenderContext = {
//             doc: document,
//             row: obj.row,
//             gindex: obj.gindex,
//             layout: obj.layout,
//             field: () => obj.field,
//             value: () => obj.value,
//             align: () => RtHorizontalAlign.LEFT,
//             tag: () => void 0,
//             manager: () => void 0,
//             createElement: (tag: string) => void 0,
//             useImage: (src: string) => void 0,
//             getImageSize: (src: string) => void 0,
//             getIcon: (iconSet: string, iconName: string) => void 0,
//             inflate: (ps: RtParamString) => void 0,
        
//             textFormatter: () => void 0,
//             booleanFormatter: () => void 0,
//             numberFormatter: () => void 0,
//             dateFormatter: () => void 0,
//             lineSepReg: () => void 0,
        
//             needMeasureRenderer() { return true; },
//             _expWidth: NaN,
//             _expHeight: NaN,
//             _padding: PADDING_ZERO,
//         };
//         return ctx;
//     }
// }

// export class TestEvents {
//     click = 0;
//     touchStart = 0;
//     touchMove = 0;
//     touchEnd = 0;
//     touchCancel = 0;
//     touchLeave = 0;

//     clear(): void {
//         this.click = 0;
//     }
// }

// export class TestListControl extends ListControl {

//     //-------------------------------------------------------------------------
//     // static members
//     //-------------------------------------------------------------------------
//     //-------------------------------------------------------------------------
//     // fields
//     //-------------------------------------------------------------------------
//     events = new TestEvents();

//     //-------------------------------------------------------------------------
//     // constructor
//     //-------------------------------------------------------------------------
//     constructor(document: Document, container: string | HTMLDivElement, listMode = RtRenderMode.DEFAULT) {
//         super(document, container, listMode);

//         this._setTesting();
//         RendererImplPool.setTesting();
//         this['_rendererPool'].setTesting();
//     }
    
//     //-------------------------------------------------------------------------
//     // testing methods
//     //-------------------------------------------------------------------------
//     testRender(force = false): TestListControl {
//         if (force || this['_dirty']) {
//             this._render();
//         }
//         return this;
//     }

//     testRowView(row: number): ListRowView {
//         return this.listView().bodyView().getItemView(row) as ListRowView;        
//     }

//     testLayoutView(view: ListItemView): ListLayoutView<ListLayout> {
//         return view.layoutView() as ListLayoutView<ListLayout>;
//     }

//     testText(view: SimpleLayoutView<any>): string | null {
//         const span = view.dom.getElementsByClassName(TextRendererImpl.SPAN_CLASS)[0] as HTMLSpanElement;
//         return span.textContent;
//     }
    
//     //-------------------------------------------------------------------------
//     // testing events
//     //-------------------------------------------------------------------------
//     test_click_dom(dom: Element, button = 0): void {
//         Tester.click_dom(this, dom, button);
//     }

//     test_click_id(row: number, id: string, button = 0): void {
//         this.test_click_dom(this.findElement(row, id), button);
//     }

//     test_click_view(view: RtElement): void {
//         this.test_click_dom(view.dom);
//     }

//     test_touch(dom: Element): void {
//         Tester.touch(this, dom);
//     }

//     test_move(dom: Element, dx: number, dy: number): void {
//         Tester.move(this, dom, dx, dy);
//     }

//     test_long_press(dom: Element): void {
//         const r = dom.getBoundingClientRect();
//         const x = r.left + r.width / 2;
//         const y = r.top + r.height / 2;
//         this.activeTool['_doLongPressed'](dom, x, y);
//     }

//     test_drag(dom: Element, dx: number, dy: number): void {
//         Tester.drag(this, dom, dx, dy);
//     }
    
//     //-------------------------------------------------------------------------
//     // overriden members
//     //-------------------------------------------------------------------------
//     width(): number {
//         return parseFloat(this['_dom'].style.width);
//     }

//     height(): number {
//         return parseFloat(this['_dom'].style.height);
//     }

//     protected _doClick(event: MouseEvent): void {
//         this.events.click++;
//     }

//     protected _doTouchStart(event: TouchEvent): boolean {
//         this.events.touchStart++;
//         return false;
//     }

//     // protected _doTouchMove(event: TouchEvent): void {
//     //     this.events.touchMove++;
//     // }

//     protected _doTouchEnd(event: TouchEvent): void {
//         this.events.touchEnd++;
//     }

//     protected _doTouchCancel(event: TouchEvent): void {
//         this.events.touchCancel++;
//     }

//     protected _doTouchLeave(event: TouchEvent): void {
//         this.events.touchLeave++;
//     }
// }

// export class TestListControlD extends RtListControl {

//     //-------------------------------------------------------------------------
//     // fields
//     //-------------------------------------------------------------------------
//     //-------------------------------------------------------------------------
//     // constructor
//     //-------------------------------------------------------------------------
//     constructor(document: Document, container: string | HTMLDivElement) {
//         super(document, container);

//         this['$_c']['_setTesting']();
//         RendererImplPool.setTesting();
//     }

//     //-------------------------------------------------------------------------
//     // properties
//     //-------------------------------------------------------------------------
//     get control(): ListControl {
//         return this['$_c'];
//     }

//     get listView(): ListView {
//         return this.control.listView();
//     }

//     get bodyView(): ListBodyView {
//         return this.listView.bodyView();
//     }

//     //-------------------------------------------------------------------------
//     // methods
//     //-------------------------------------------------------------------------
//     activeTool(): RtEditTool {
//         return this['$_c'].activeTool();
//     }

//     testRender(force = false): TestListControlD {
//         const c = this['$_c'];

//         if (force || c['_dirty']) {
//             c['_render']();
//         }
//         return this;
//     }

//     scrollBy(delta: number): void {
//         const c = this['$_c'];
//         c.scrollBy(delta);   
//     }

//     fling(distance: number, duration: number): void {
//         const c = this['$_c'];
//         c.fling(distance, duration);
//     }

//     getBodyRowViews(): ListRowView[] {
//         const c = this['$_c'];
//         const bodyView = c.listView().bodyView();
//         const rvs:ListRowView[] = [];

//         for (let i = 0; i < bodyView.itemViewCount(); i++) {
//             const v = bodyView.getItemView(i);
//             if (v instanceof ListRowView) {
//                 rvs.push(v);
//             }
//         }
//         return rvs;
//     }

//     getBodyRows(): number[] {
//         return this.getBodyRowViews().map(rv => rv.row());
//     }
    
//     //-------------------------------------------------------------------------
//     // testing events
//     //-------------------------------------------------------------------------
//     test_click_dom(dom: Element, button = 0): void {
//         Tester.click_dom(this, dom, button);
//     }

//     test_click_id(row: number, id: string, button = 0): void {
//         const c = this['$_c'];

//         this.test_click_dom(c.findElement(row, id), button);
//     }

//     test_click_view(view: RtElement): void {
//         this.test_click_dom(view.dom);
//     }

//     test_touch(dom: Element): void {
//         Tester.touch(this, dom);
//     }

//     test_long_press(dom: Element): void {
//         const c = this['$_c'];

//         const r = dom.getBoundingClientRect();
//         const x = r.left + r.width / 2;
//         const y = r.top + r.height / 2;
//         c.activeTool['_doLongPressed'](dom, x, y);
//     }

//     test_drag(dom: Element, dx: number, dy: number): void {
//         Tester.drag(this, dom, dx, dy);
//     }

//     test_swipe(dom: Element, dir: 'left' | 'right' | 'top' | 'bottom'): void {
//         this.activeTool()['swipeDir'] = dir;
//         Tester.drag(this, dom, 1, 1);
//         this.activeTool()['swipeDir'] = void 0;
//     }

//     test_click_rowbar(row: number): void {
//     }
// }

// RtEditTool.prototype['$_checkSwipe'] = function (dom, event): boolean {
//     const dir = this['swipeDir'];
//     const duration = 1472;
//     const distance = 902;

//     if (this.dragging) {
//         if (this._dragTracker.swipe(dir)) {
//             return true;
//         }
//         this.$_stopDragTracker(dom, this._prevX, this._prevY);
//     }
//     return dir && this._doSwipe(dom, this._dragTracker, dir, duration * 1.6, distance * 1.3);
// }