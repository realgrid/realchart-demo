////////////////////////////////////////////////////////////////////////////////
// RcControl.ts
// 2021. 11. 25. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { RcObject } from "./RcObject";
import { Align, ISides, Path, SVGStyleOrClass, _undef, getCssProp, isNull, pixel, throwFormat } from "./Types";
import { Dom } from "./Dom";
import { locale } from "./RcLocale";
import { SVGNS, isObject, isString, pickProp, assign } from "./Common";
import { Utils } from "./Utils";
import { IRect } from "./Rectangle";
import { ISize } from "./Size";
import { IPoint } from "./Point";
import { $_lc } from "./LicChecker";

export interface IPointerHandler {
    handleDown(ev: PointerEvent): void;
    handleUp(ev: PointerEvent): void;
    handleMove(ev: PointerEvent): void;
    handleClick(ev: PointerEvent): void;
    handleDblClick(ev: PointerEvent): void;
    handleWheel(ev: WheelEvent): void;
}

/** 
 * @internal
 *
 * Control base.
 */
export abstract class RcControl extends RcObject {//} RcWrappableObject {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly CLASS_NAME = 'rct-control';
    static readonly SHADOW_FILTER = 'rr-chart-shadow-filter';

    //-------------------------------------------------------------------------
    // static members
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    static _animatable = true;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _container: HTMLDivElement;
    private _dom: HTMLDivElement;
    private _htmlRoot: HTMLDivElement;
    private _svg: SVGSVGElement;
    private _defs: SVGDefsElement;
    // private _back: RcElement;
    private _root: RootElement;

    private _pointerHandler: IPointerHandler;

    private _inited = false;
    private _testing = false;
    private _dirty = true;
    private _requestTimer: any;
    // private _invalidElements: RcElement[] = [];
    private _toAnimation = 0;
    private _invalidateLock = false;
    private _lockDirty = false;
    private _cssVars = {};

    loaded = false;
    _padding: ISides;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, container: string | HTMLDivElement, className?: string) {
        super();

        let lc = "$$LicenseCheck";
        lc == "1" && $_lc();

        if (!doc && container instanceof HTMLDivElement) {
            doc = container.ownerDocument;
        }
        this.$_initControl(doc || document, container, className || RcControl.CLASS_NAME);
        this._resigterEventHandlers(this._dom);
        this._inited = true;
        this.invalidate(true);
    }

    protected _doDestory(): void {
        this._unresigterEventHandlers(this._dom);
        Dom.remove(this._dom);
        this._dom = null;
        this._container = null;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    isInited(): boolean {
        return this._inited;
    }

    isTesting(): boolean {
        return this._testing;
    }

    doc(): Document {
        return this._dom.ownerDocument;
    }

    dom(): HTMLElement {
        return this._dom;
    }

    svg(): SVGSVGElement {
        return this._svg;
    }

    width(): number {
        return this._container.offsetWidth;
    }

    height(): number {
        return this._container.offsetHeight;
    }

    contentWidth(): number {
        return this.width() - this._padding.left - this._padding.right;
    }

    contentHeight(): number {
        return this.height() - this._padding.top - this._padding.bottom;
    }

    clipContainer(): SVGElement {
        return this._defs;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    setData(data: string, value: any, container?: boolean): void {
        if (!isNull(value)) {
            this._root.dom.dataset[data] = value;
            if (container) {
                this._dom.dataset[data] = value;
            }
        } else {
            delete this._root.dom.dataset[data];
            if (container) {
                delete this._dom.dataset[data];
            }
        }
    }

    clearDefs(): void {
        Dom.clearChildren(this._defs);
    }

    private $_clearDefs(key: string): void {
        const childs = this._defs.children;

        for (let i = childs.length - 1; i >= 0; i--) {
            if (childs[i].hasAttribute(key)) {
                childs[i].remove();
            }
        }
    }

    clearAssetDefs(): void {
        this.$_clearDefs(RcElement.ASSET_KEY);
    }

    clearTemporaryDefs(): void {
        this.$_clearDefs(RcElement.TEMP_KEY);
    }

    appendDom(elt: HTMLElement): void {
        elt && this._htmlRoot.append(elt);
    }

    addElement(elt: RcElement): void {
        elt && this._root.add(elt);
    }

    setPointerHandler(handler: IPointerHandler): void {
        this._pointerHandler = handler;
    }

    invalidate(force = false): void {
        if (force || !this._invalidateLock && !this._dirty && this._inited) {
            this._dirty = true;
            if (!this._requestTimer && !this._testing) {
                this.$_requestRender();
            }
        } else if (this._invalidateLock /* && !_lockDirty */) {
            this._lockDirty = true;
        }
    }

    invalidateLayout(force = false): void {
        this.invalidate(force);
    }

    setLock(): void {
        this._invalidateLock = true;
    }

    releaseLock(validate = true): void {
        if (this._invalidateLock) {
            this._invalidateLock = false;
        }
        // lock 중에 invalidate()가 호출됐었다면
        if (this._lockDirty && validate) {
            this.invalidate();
        } 
        this._lockDirty = false;
    }

    lock(func: (control: RcControl) => void): void {
        this.setLock();
        try {
            func(this);
        } finally {
            this.releaseLock();
        }
    }   

    silentLock(func: (control: RcControl) => void): void {
        this.setLock();
        try {
            func(this);
        } finally {
            this.releaseLock(false);
        }
    }   

    getBounds(): DOMRect {
        return this._dom.getBoundingClientRect();
    }

    setAnimation(to?: number): void {
        this._toAnimation = to || 0;
    }

    fling(distance: number, duration: number): void {
    }

    getCssVar(name: string): string {
        let v = this._cssVars[name];
        
        if (name in this._cssVars) {
            return this._cssVars[name];
        } else {
            v = getComputedStyle(this._root.dom).getPropertyValue(name);
            this._cssVars[name] = v;
        }
        return v;
    }

    /**
     * defs에 직사각형 clipPath를 등록한다.
     */
    clipBounds(x = NaN, y = NaN, width = NaN, height = NaN, rd = 0): ClipRectElement {
        const clip = new ClipRectElement(this.doc(), x, y, width, height, rd, rd);

        this._defs.appendChild(clip.dom);
        return clip;
    }

    clipRect(r: IRect): ClipRectElement {   
        return this.clipBounds(r.x, r.y, r.width, r.height);
    }

    clipCircle(): ClipCircleElement {   
        const clip = new ClipCircleElement(this.doc());

        this._defs.appendChild(clip.dom);
        return clip;
    }

    clipPath(): ClipPathElement {
        const clip = new ClipPathElement(this.doc());

        this._defs.appendChild(clip.dom);
        return clip;
    }

    addDef(element: Element): void {
        this._defs.appendChild(element);
    }

    removeDef(element: Element | string): void {
        if (isString(element)) {
            for (const elt in this._defs.children) {
                if ((elt as any) instanceof Element && (elt as any).id === element) {
                    element = elt;
                    break;
                }
            }
        }
        element instanceof Element && this._defs.removeChild(element);
    }

    containerToElement(element: RcElement, x: number, y: number): IPoint {
        const cr = this._container.getBoundingClientRect();
        // getBoundingClientRect()는 element에 overflow된 내용이 있는 경우 그것까지 포함된다.
        // 각 element별 정확한 bounds를 리턴하는 것을 참조하도록 한다. (ex. BodyView)
        const br = element.getBounds();

        return { x: x - br.x + cr.x, y: y - br.y + cr.y };
    }

    svgToElement(element: RcElement, x: number, y: number): IPoint {
        const cr = this._svg.getBoundingClientRect();
        const br = element.getBounds();

        return { x: x - br.x + cr.x, y: y - br.y + cr.y };
    }

    elementToSvg(element: RcElement, x: number, y: number): IPoint {
        const cr = this._svg.getBoundingClientRect();
        const br = element.getBounds();

        return { x: x + br.x - cr.x, y: y + br.y - cr.y };
    }

    // // TODO: svg 크기에서 '%'제거
    // //       svg 복사본 생성: 외부 스타일 내부로 가져오기
    // test(canvas: HTMLCanvasElement): void {
    //     const svg = this._svg.outerHTML;
    //     const image = new Image();
    //     const ctx = canvas.getContext("2d");

    //     document.body.appendChild(image);

    //     image.width = 850;
    //     image.height = 550;
    //     // image.src = `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svg)))}`;
    //     // image.src = `data:image/svg+xml;base64,${window.btoa(encodeURIComponent(svg))}`;
    //     image.src = `data:image/svg+xml;charset=utf-8,&lt;${svg}`;
    //     image.onload = () => {
    //         ctx.drawImage(image, 0, 0);
    //     };
    // }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected _setTesting(): void {
        this._testing = true;
        (RcElement as any).TESTING = true;
    }

    protected _setSize(w: number, h: number): void {
        if (!isNaN(w)) {
            this._container.style.width = w + 'px';
            // this._dom.style.width = isNaN(w) ? '100%' : w + 'px';
        }
        if (!isNaN(h)) {
            this._container.style.height = h + 'px';
            // this._dom.style.height = isNaN(h) ? '100%' : h + 'px';  // 왜 이렇게 했지?
        }
    }

    private $_addListener(node: Node, event: string, handler: any): void {
        node.addEventListener(event, handler);
    }

    protected _resigterEventHandlers(dom: HTMLElement): void {
        window.addEventListener('resize', this._windowResizeHandler);

        this.$_addListener(dom, "click", this._clickHandler);
        this.$_addListener(dom, "dblclick", this._dblClickHandler);
        // this.$_addListener(dom, "touchstart", this._touchStartHandler);
        this.$_addListener(dom, "touchmove", this._touchMoveHandler);
        this.$_addListener(dom, "pointerdown", this._pointerDownHandler);
        this.$_addListener(dom, "pointermove", this._pointerMoveHandler);
        this.$_addListener(dom, "pointerup", this._pointerUpHandler);
        this.$_addListener(dom, "pointercancel", this._pointerCancelHandler);
        this.$_addListener(dom, "pointerleave", this._pointerLeaveHandler);
        // this.$_addListener(dom, "touchleave", this._touchLeaveHandler);
        this.$_addListener(dom, "keypress", this._keyPressHandler);
        this.$_addListener(dom, "wheel", this._wheelHandler);
    }

    protected _unresigterEventHandlers(dom: HTMLElement): void {
        window.removeEventListener('resize', this._windowResizeHandler);

        dom.removeEventListener("click", this._clickHandler);
        dom.removeEventListener("dblclick", this._dblClickHandler);

        // dom.removeEventListener("touchstart", this._touchStartHandler);
        dom.removeEventListener("touchmove", this._touchMoveHandler);
        dom.removeEventListener("pointerdown", this._pointerDownHandler);
        dom.removeEventListener("pointermove", this._pointerMoveHandler);
        dom.removeEventListener("pointerup", this._pointerUpHandler);
        dom.removeEventListener("pointercancel", this._pointerCancelHandler);
        dom.removeEventListener("pointerleave", this._pointerLeaveHandler);
        // dom.removeEventListener("touchleave", this._touchLeaveHandler);
        dom.removeEventListener("keypress", this._keyPressHandler);
        dom.removeEventListener("wheel", this._wheelHandler);
    }

    // container div의 'rtc-renderers' 자식들을 사용할 수 있도록 한다.
    protected _prepareRenderers(dom: HTMLElement): void {
    }

    private $_initControl(document: Document, container: string | HTMLDivElement, className: string): void {
        if (this._inited) return;

        if (container instanceof HTMLDivElement) {
            this._container = container;
        } else {
            this._container = document.getElementById(container) as HTMLDivElement;
        }
        if (!(this._container instanceof HTMLDivElement)) {
            throwFormat(locale.invalidOuterDiv, container);
        }

        const doc = this._container.ownerDocument;
        const dom = this._dom = doc.createElement('div');

        assign(dom.style, {
            position: 'relative',
            width: '100%',
            height: '100%',  
            boxSizing: 'border-box',
            overflow: 'hidden',
            "-webkit-touch-callout": "none",
            "-webkit-user-select": "none",
            "user-select": "none",
            "-webkit-tap-highlight-color": "rgba(0, 0, 0, 0)"
        })
        dom.className = className;
        this._container.appendChild(dom);

        // svg
        const svg = this._svg = doc.createElementNS(SVGNS, 'svg');
        svg.classList.add('rct-svg');
        svg.style.setProperty('overflow', 'visible', 'important');
        svg.setAttribute('width', '100%');// contentDiv.clientWidth + 'px');
        svg.setAttribute('height', '100%');//contentDiv.clientHeight + 'px');

        const desc = doc.createElement('desc');
        // desc.textContent = 'Created by RealChart v$Version'; // sourcemap, rollup issue
        desc.textContent = 'Created by RealChart v0.9.31';
        svg.appendChild(desc);

        const defs = this._defs = doc.createElementNS(SVGNS, 'defs');
        this._initDefs(doc, defs);
        svg.appendChild(defs);
        dom.appendChild(svg);

        // this._back = new RcElement(doc, '', 'rect');
        // svg.appendChild(this._back.dom);
        // this._back.setStyle('fill', 'lightgray');

        this._root = new RootElement(this);
        svg.appendChild(this._root['_dom']);

        // html root
        this._htmlRoot = doc.createElement('div');
        dom.appendChild(this._htmlRoot);
        assign(this._htmlRoot.style, {
            position: 'absolute'
        });
    }

    protected _initDefs(doc: Document, defs: SVGElement): void {
        let filter = doc.createElementNS(SVGNS, 'filter');
        const ds = doc.createElementNS(SVGNS, 'feDropShadow'); 

        filter.setAttribute('id', RcControl.SHADOW_FILTER);
        ds.setAttribute('dx', '1');
        ds.setAttribute('dy', '1');
        ds.setAttribute('flood-olor', '#000');
        ds.setAttribute('flood-opacity', '0.75');
        ds.setAttribute('stdDeviation', '1.5');

        filter.appendChild(ds);
        defs.appendChild(filter);
    }

    protected _render(): void {
        this.$_render();
    }

    // private $_invalidateElement(elt: RcElement): void {
    //     this._invalidElements.push(elt);
    //     this.invalidate();
    // }

    private $_requestRender(): void {
        if (window.requestAnimationFrame) {
            this._requestTimer = window.requestAnimationFrame(() => this.$_render());
        } else {
            setTimeout(() => {
                this.$_render();
            }, 0);
        }
    }

    updateNow(): void {
        this.$_render();
    }

    private $_render(): void {
        // animation 중이면 종료 후에 다시 그리도록 한다.
        if (+new Date() <= this._toAnimation) {
            this.$_requestRender();
            return;
        }

        Utils.LOGGING && console.time('render chart');
        try {
            this._doBeforeRender();

            const cr = this._dom.getBoundingClientRect();
            const sr = this._svg.getBoundingClientRect();
            const w = this._svg.clientWidth;
            const h = this._svg.clientHeight;

            // this._back.resize(w, h);

            assign(this._htmlRoot.style, {
                left: pixel(sr.left - cr.left),
                top: pixel(sr.top - cr.top)
            });
            this._doRenderBackground(this._container.firstElementChild as HTMLDivElement, this._root, w, h);

            const p = this._padding = Dom.getPadding(this._root.dom);

            this._doRender({x: p.left, y: p.top, width: w - p.left - p.right, height: h - p.top - p.bottom});

        } finally {
            this.loaded = true;
            this._dirty = false;
            this._requestTimer = null;
            // this._invalidElements.forEach(elt => elt.validate());
            // this._invalidElements = [];
            this._doAfterRender();
            Utils.LOGGING && console.timeEnd('render chart');
        }
    }

    protected abstract _doRender(bounds: IRect): void;
    protected _doBeforeRender(): void {}
    protected _doAfterRender(): void {}
    protected _doRenderBackground(elt: HTMLDivElement, root: RcElement, width: number, height: number): void {}

    //-------------------------------------------------------------------------
    // event handlers
    //-------------------------------------------------------------------------
    protected _windowResizeHandler = (event: Event) => {
        this._windowResized();
    }

    protected _windowResized(): void {
        this.invalidateLayout();
    }

    toOffset(event: any): any {
        //const r = event.target.getBoundingClientRect();
        const r = this._container.getBoundingClientRect();
        event.pointX = event.clientX - r.left;
        event.pointY = event.clientY - r.top;
        return event;
    }

    private _clickHandler = (ev: PointerEvent) => {
        this._pointerHandler && this._pointerHandler.handleClick(this.toOffset(ev));
    }

    private _dblClickHandler = (ev: PointerEvent) => {
        this._pointerHandler && this._pointerHandler.handleDblClick(this.toOffset(ev));
    }

    private _touchMoveHandler = (ev: TouchEvent) => {
    }

    private _pointerDownHandler = (ev: PointerEvent) => {
        this._dom.setPointerCapture(ev.pointerId);
        this._pointerHandler && this._pointerHandler.handleDown(this.toOffset(ev));
    }

    private _pointerMoveHandler = (ev: PointerEvent) => {
        this._pointerHandler && this._pointerHandler.handleMove(this.toOffset(ev));
    }

    private _pointerUpHandler = (ev: PointerEvent) => {
        this._dom.releasePointerCapture(ev.pointerId);
        this._pointerHandler && this._pointerHandler.handleUp(this.toOffset(ev));
    }

    private _pointerCancelHandler = (ev: PointerEvent) => {
    }

    private _pointerLeaveHandler = (ev: PointerEvent) => {
    }

    private _keyPressHandler = (ev: KeyboardEvent) => {
    }

    private _wheelHandler = (ev: WheelEvent) => {
    }
}

const TEXT_ALIGN = 'textAlign';

// export type RtControlOrWrapper = RcControl | RcWrapper<RcControl>;

/**
 * @internal
 * 
 * RcContainer 구성 요소. 
 * SVGElement들로 구현된다.
 */
export class RcElement extends RcObject {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static DEBUGGING = false;
    static TESTING = false;
    static ASSET_KEY = '_asset_';
    // static CLIP_KEY = '_clip_';
    static TEMP_KEY = '_temp_';

    //-------------------------------------------------------------------------
    // static members
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    private _visible = true;
    private _x: number;
    private _y: number;
    private _width: number;
    private _height: number;
    private _zIndex = 0;
    private _tx: number;
    private _ty: number;
    private _scaleX = 1;
    private _scaleY = 1;
    private _rotation = 0;
    private _originX: number;
    private _originY: number;
    private _matrix: number[];

    protected _styleName: string;
    protected _styles: any = {};
    protected _styleDirty = false;

    tag: any;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _dom: SVGElement;
    private _parent: RcElement;
    removing: boolean;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName: string, tag: string = _undef) {
        super();

        this._dom = doc.createElementNS(SVGNS, tag || 'g');
        (this._styleName = styleName || '') && this.setAttr('class', this._styleName);
    }

    protected _doDestory(): void {
        this.remove();
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    get doc(): Document {
        return this._dom.ownerDocument;
    }

    get dom(): SVGElement {
        return this._dom;
    }

    get parent(): RcElement {
        return this._parent;
    }

    get control(): RcControl {
        return this._parent && this._parent.control;
    }

    get zIndex(): number {
        return this._zIndex;
    }
    set zIndex(value: number) {
        if (value !== this._zIndex) {
            this._zIndex = value;
            // TODO: dom들의 위치를 변경한다.
        }
    }

    get x(): number {
        return this._x;
    }
    set x(value: number) {
        if (value !== this._x) {
            this._x = value;
            this.setAttr('x', this._x);
        }
    }

    get tx(): number {
        return this._tx;
    }

    get y(): number {
        return this._y;
    }
    set y(value: number) {
        if (value !== this._y) {
            this._y = value;
            this.setAttr('y', this._y);
        }
    }

    get ty(): number {
        return this._ty;
    }

    get width(): number {
        return this._width;
    }
    set width(value: number) {
        if (value !== this._width) {
            this._width = value;
            this.setAttr('width', isNaN(value) ? '' : value);
        }
    }

    get height(): number {
        return this._height;
    }
    set height(value: number) {
        if (value !== this._height) {
            this._height = value;
            this.setAttr('height', isNaN(value) ? '' : value);
        }
    }

    /**
     * visible
     */
    get visible(): boolean {
        return this._visible;
    }
    set visible(value: boolean) {
        this.setVis(value);
    }
    setVis(value: boolean): boolean {
        if (value !== this._visible) {
            this._visible = value;
            if (this._dom) {
                this._dom.style.display = this._visible ? '' : 'none';
            }
        }
        return this._visible;
    }

    /**
     * rotation
     */
    get rotation(): number {
        return this._rotation;
    }
    set rotation(value: number) {
        if (value != this._rotation) {
            this._rotation = value;
            this._updateTransform();
        }
    }
    setRotation(originX: number, originY: number, rotation: number): RcElement {
        if (originX !== this._originX || originY !== this._originY || rotation !== this._rotation) {
            this._originX = originX;
            this._originY = originY;;
            this._rotation = rotation;
            this._updateTransform();
        }
        return this;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getStyle(prop: string): string {
        return window.getComputedStyle(this._dom).getPropertyValue(prop);
    }

    hasStyle(className: string): boolean {
        return this.dom.classList.contains(className);
    }

    add(child: RcElement): RcElement {
        if (child && child._parent !== this) {
            child._parent = this;
            this._dom.appendChild(child._dom);
            child._doAttached(this);
        }
        return child;
    }

    insertChild(child: RcElement, before: RcElement): RcElement {
        if (child && child._parent !== this) {
            child._parent = this;
            this._dom.insertBefore(child._dom, before._dom);
            child._doAttached(this);
        }
        return child;
    }

    insertAfter(child: RcElement, after: RcElement): RcElement {
        if (child && child._parent !== this) {
            child._parent = this;
            if (after._dom.nextSibling) {
                this._dom.insertBefore(child._dom, after._dom.nextSibling);
            } else {
                this._dom.appendChild(child._dom);
            }
            child._doAttached(this);
        }
        return child;
    }

    insertFirst(child: RcElement): RcElement {
        if (child && child._parent !== this) {
            child._parent = this;
            this._dom.insertBefore(child._dom, this._dom.firstChild);
            child._doAttached(this);
        }
        return child;
    }

    appendElement(doc: Document, tag: string): SVGElement {
        const elt = doc.createElementNS(SVGNS, tag);
        this._dom.appendChild(elt);
        return elt;
    }   

    insertElement(doc: Document, tag: string, before: Node): SVGElement {
        const elt = doc.createElementNS(SVGNS, tag);
        this._dom.insertBefore(elt, before);
        return elt;
    }   

    remove(): RcElement {
        if (this._parent) {
            this._parent._dom.removeChild(this._dom);
            this._parent = null;
            this._doDetached(this);
        }
        return this;
    }

    getAttr(attr: string): any {
        return this._dom.getAttribute(attr);
    }

    setAttr(attr: string, value: any): RcElement {
        this._dom.setAttribute(attr, value);
        return this;
    }

    setAttrEx(attr: string, value: any): RcElement {
        isNull(value) ? this._dom.removeAttribute(attr) : this._dom.setAttribute(attr, value);
        return this;
    }

    setAttrs(attrs: any): RcElement {
        for (let attr in attrs) {
            this._dom.setAttribute(attr, attrs[attr]);
        }
        return this;
    }

    setAttrsEx(attrs: any): RcElement {
        for (let attr in attrs) {
            const v = attrs[attr];
            isNull(v) ? this._dom.removeAttribute(attr) : this._dom.setAttribute(attr, v);
        }
        return this;
    }

    unsetAttr(attr: string): RcElement {
        this._dom.removeAttribute(attr);
        return this;
    }

    getBounds(): DOMRect {
        return this._dom.getBoundingClientRect();
    }

    setBounds(x: number, y: number, width: number, height: number): RcElement {
        this.trans(x, y);
        this.resize(width, height);
        return this;
    }

    setRect(rect: IRect): RcElement {
        this.trans(rect.x, rect.y);
        this.resize(rect.width, rect.height);
        return this;
    }

    getRect(): IRect {
        return {x: this._tx, y: this._ty, width: this.width, height: this.height };
    }

    getSize(): ISize {
        return { width: this.width, height: this.height };
    }

    getBBox(): IRect {
        return (this._dom as SVGGraphicsElement).getBBox();
    }

    controlToElement(x: number, y: number): IPoint {
        return this.control.containerToElement(this, x, y);
    }

    svgToElement(x: number, y: number): IPoint {
        return this.control.svgToElement(this, x, y);
    }

    elementToSvg(x: number, y: number): IPoint {
        return this.control.elementToSvg(this, x, y);
    }

    move(x: number, y: number): RcElement {
        this.x = x;
        this.y = y;
        return this;
    }

    setPos(x: number, y: number): void {
        this._x = x;
        this._y = y;
    }

    isDomAnimating(): boolean {
        return this._dom.getAnimations().length > 0;
    }

    rotate(angle: number): RcElement {
        if (angle !== this._rotation) {
            this._rotation = angle;
            this._updateTransform();
        }
        return this;
    }

    internalRotate(angle: number): void {
        this._rotation = angle;
    }

    scale(s: number): RcElement {
        if (this._scaleX !== s || this._scaleY !== s) {
            this._scaleX = this._scaleY = s;
            this._updateTransform();
        }
        return this;
    }

    trans(x: number, y: number): RcElement {
        if (x !== this._tx || y !== this._ty) {
            if (Utils.isValidNumber(x)) this._tx = x;
            if (Utils.isValidNumber(y)) this._ty = y;
            this._updateTransform();
        }
        return this;
    }

    transp(p: IPoint): RcElement {
        return this.trans(p.x, p.y);
    }

    transEx(x: number, y: number, duration = 0, invalidate = true): RcElement {
        x = Utils.isNumber(x) ? x : this._tx;
        y = Utils.isNumber(y) ? y : this._ty;

        if (x !== this._tx || y !== this._ty) {
            if (duration > 0) {
                const ani = this._dom.animate([
                    { transform: `translate(${this._tx}px,${this._ty}px)` },
                    { transform: `translate(${x}px,${y}px)` }
                ], {
                    duration: duration,
                    fill: 'none'
                });
                if (invalidate) {
                    ani.addEventListener('finish', () => this.control?.invalidateLayout());
                }
            }
            this._tx = x;
            this._ty = y;
            this._updateTransform();
        }
        return this;
    }

    transX(x: number): RcElement {
        if (x !== this._tx) {
            if (Utils.isValidNumber(x)) {
                this._tx = x;
                this._updateTransform();
            }
        }
        return this;
    }

    transY(y: number): RcElement {
        if (y !== this._ty) {
            if (Utils.isValidNumber(y)) {
                this._ty = y;
                this._updateTransform();
            }
        }
        return this;
    }

    resize(width: number, height: number, attr = true): RcElement {
        if (width !== this._width) {
            this._width = Math.max(0, width);
            attr &&  this.setAttrEx('width', this._width);
        }
        if (height !== this._height) {
            this._height = Math.max(0, height);
            attr && this.setAttrEx('height', this._height);
        }
        return this;
    }

    appendDom(dom: Node): Node {
        dom && this._dom.appendChild(dom);
        return dom;
    }

    insertDom(dom: Node, before: Node): Node {
        dom && this._dom.insertBefore(dom, before);
        return dom;
    }

    clearDom(): void {
        const dom = this._dom;
        let child: Node;

        while (child = dom.lastChild) {
            dom.removeChild(child);
        }
    }

    internalClearStyles(): void {
        const css = (this.dom as SVGElement | HTMLElement).style;

        for (let p in this._styles) {
            css.removeProperty(getCssProp(p));
        }
        this._styles = {};
    }

    clearStyles(): boolean {
        const css = (this.dom as SVGElement | HTMLElement).style;
        let changed = false;

        for (let p in this._styles) {
            css.removeProperty(getCssProp(p));
            changed = true;
        }
        
        this._styles = {};
        if (changed) this._styleDirty = true;
        return changed;
    }

    clearStyle(props: string[]): boolean {
        let changed = false;

        if (props) {
            const css = (this.dom as SVGElement | HTMLElement).style;

            for (let p of props) {
                if (p in this._styles) {
                    css.removeProperty(getCssProp(p));
                    delete this._styles[p];
                    changed = true;
                }                
            }
            if (changed) this._styleDirty = true;
        }
        return changed;
    }

    internalSetStyles(styles: any): void {
        if (styles) {
            const css = (this.dom as SVGElement | HTMLElement).style;

            for (let p in styles) {
                css[p] = this._styles[p] = styles[p];
            }
        }
    }

    setStyles(styles: any): boolean {
        let changed = false;

        if (styles) {
            const css = (this.dom as SVGElement | HTMLElement).style;

            for (let p in styles) {
                // if (!(p in BACK_STYLES) && this._styles[p] !== styles[p]) {
                if (this._styles[p] !== styles[p]) {
                    css[p] = this._styles[p] = styles[p];
                    changed = true;
                }
            }
            if (changed) this._styleDirty = true;
        }
        return changed;
    }

    resetStyles(styles: any): boolean {
        const r = this.clearStyles();
        return this.setStyles(styles) || r;        
    }

    protected _resetClass(): void {
        this._styleName ? this.setAttr('class', this._styleName) : this.unsetAttr('class');
    }

    clearStyleAndClass(): void {
        this.clearStyles();
        this._resetClass();
    }

    internalClearStyleAndClass(): void {
        this.internalClearStyles();
        this._resetClass();
    }

    setStyleOrClass(style: SVGStyleOrClass): void {
        if (isString(style)) {
            this._resetClass();
            style && this._dom.classList.add(style);
        } else {
            this.resetStyles(style);
        }
    }

    internalSetStyleOrClass(style: SVGStyleOrClass): void {
        if (isString(style)) {
            this._dom.classList.add(style);
        } else {
            this.internalSetStyles(style);
        }
    }

    addStyleOrClass(style: SVGStyleOrClass): void {
        if (isString(style)) {
            style && this._dom.classList.add(style);
        } else if (isObject(style)) {
            this.setStyles(style);
        }
    }

    setClass(value: string): void {
        this.setAttr('class', value);
    }

    setStyle(prop: string, value: string): boolean {
        let changed = false;

        //if (!(prop in BACK_STYLES) && value !== this._styles[prop]) {
        if (value !== this._styles[prop]) {
            changed = this._styleDirty = true;
            this._styles[prop] = value;
            (this.dom as SVGElement | HTMLElement).style[prop] = value;
        }
        return changed;
    }

    internalSetStyle(prop: string, value: string): void {
        if (value !== this._styles[prop]) {
            this._styles[prop] = value;
            (this.dom as SVGElement | HTMLElement).style[prop] = value;
        }
    }

    setColor(color: string): void {
        (this.dom as SVGElement | HTMLElement).style['fill'] = 
        (this.dom as SVGElement | HTMLElement).style['stroke'] = 
        this._styles['fill'] = 
        this._styles['stroke'] = color;
    }

    setFill(color: string): void {
        (this.dom as SVGElement | HTMLElement).style['fill'] = 
        this._styles['fill'] = color;
    }

    setStroke(color: string): void {
        (this.dom as SVGElement | HTMLElement).style['stroke'] = 
        this._styles['stroke'] = color;
    }

    setTransparent(important: boolean): void {
        (this.dom as SVGElement | HTMLElement).style.setProperty('fill', 'transparent', important ? 'important' : '');
        (this.dom as SVGElement | HTMLElement).style.setProperty('stroke', 'none', important ? 'important' : '');
    }

    textAlign(): Align {
        return this._styles[TEXT_ALIGN];
    }

    setData(data: string, value?: string): void {
        this.dom.dataset[data] = pickProp(value, '');
    }

    unsetData(data: string): void {
        delete this.dom.dataset[data];
    }

    setBoolData(data: string, value: boolean): void {
        if (value) {
            this.dom.dataset[data] = '';
        } else {
            delete this.dom.dataset[data];
        }
    }

    removeLater(delay: number, callback?: (v: RcElement) => void): RcElement {
        if (this._parent) {
            if (delay > 0) {
                const ani = this._dom.animate([
                    {},
                    { opacity: 0}
                ], {
                    duration: delay,
                    fill: 'none'
                });
                ani && ani.addEventListener('finish', () => {
                    this.remove();
                    callback?.(this);
                });
            } else {
                this.remove();
            }
        }
        return this;
    }

    hide(delay: number): RcElement {
        if (this._parent) {
            if (delay > 0) {
                const ani = this._dom.animate([
                    {},
                    { opacity: 0}
                ], {
                    duration: delay,
                    fill: 'none'
                });
                ani && ani.addEventListener('finish', () => {
                    this.setVis(false);
                });
            } else {
                this.setVis(false);
            }
        }
        return this;
    }

    // TODO
    // fadeout(removeDelay: number, startOpacity: number): RcElement {
    //     return this;
    // }

    clipRect(x: number, y: number, width: number, height: number, rd = 0): ClipRectElement {
        const cr = this.control.clipBounds(x, y, width, height, rd);

        this.setClip(cr);
        return cr;
    }

    setClip(cr?: ClipElement | string): void {
        if (cr) {
            this.setAttr('clip-path', 'url(#' + (cr['id'] || cr) + ')');
        } else {
            this.unsetAttr('clip-path');
        }
    }

    setTemporary(): RcElement {
        this.setAttr(RcElement.TEMP_KEY, 1);
        return this;
    }

    setCursor(cursor: string): void {
        this._dom.style.cursor = cursor;
    }

    ignorePointer(): void {
        this._dom.style.pointerEvents = 'none';
    }

    contains(dom: Element): boolean {
        return this._dom.contains(dom);
    }

    front(siblings: RcElement[], group?: RcElement[]): void {
        if (!this.parent) return;

        const p = this.parent._dom;
        const dom = this._dom;
        const len = siblings.length;

        if (group) {
            const last = group.sort((v1, v2) => siblings.indexOf(v1) - siblings.indexOf(v2))[group.length - 1];
            if (this !== last) {
                dom.remove();
                if (last === siblings[len - 1]) {
                    p.appendChild(dom);
                } else {
                    p.insertBefore(dom, siblings[siblings.indexOf(last) + 1].dom)
                }
            }
        } else {
            if (len > 1 && this !== siblings[len - 1]) {
                dom.remove();
                p.appendChild(dom);
            }
        }
    }

    back(siblings: RcElement[]): void {
        if (!this.parent) return;

        const len = siblings.length;

        if (len > 1) {
            const i = siblings.indexOf(this);
        
            this._dom.remove();
            if (i < siblings.length - 1) {
                this.parent.dom.insertBefore(this._dom, siblings[i + 1].dom);
            } else {
                this.parent.dom.appendChild(this._dom);
            }
        }
    }

    invalidate(): void {
        this.control.invalidateLayout();
    }

    sort(children: RcElement[]): void {
        children.forEach(v => this._dom.appendChild(v._dom));
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected _testing(): boolean {
        return RcElement.TESTING;
    }

    protected _doAttached(parent: RcElement) {
    }

    protected _doDetached(parent: RcElement) {
    }

    protected _updateTransform(): void {
        this._dom.setAttribute('transform', this.getTransform());
    }

    getTransform(): string {
        const dom = this._dom;
        let tx = this._tx;
        let ty = this._ty;

        // translate
        let tf = [];

        if (Utils.isValidNumber(tx) || Utils.isValidNumber(ty)) {
            tx = tx || 0;
            ty = ty || 0;
            tf = ['translate(' + tx + ',' + ty + ')'];
        }

        // matrix
        if (Utils.isNotEmpty(this._matrix)) {
            tf.push('matrix(' + this._matrix.join(',') + ')');
        }
        
        // rotation
        if (this._rotation) {
            tf.push('rotate(' + this._rotation + ' ' +
            Utils.pick(this._originX, dom.getAttribute('x'), 0) +
            ' ' +
            Utils.pick(this._originY, dom.getAttribute('y') || 0) + ')');
        }

        // scale
        const sx = Utils.getNumber(this._scaleX, 1);
        const sy = Utils.getNumber(this._scaleY, 1);
        if (sx !== 1 || sy !== 1) {
            tf.push('scale(' + sx + ' ' + sy + ')');
        }

        if (tf.length) {
            return tf.join(' ');
        }
        return '';
    }
}

export class LayerElement extends RcElement {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName: string) {
        super(doc, styleName, 'g');
    }
}

class RootElement extends RcElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _control: RcControl;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(control: RcControl) {
        super(control.doc(), 'rct-root');

        this._control = control;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    get control(): RcControl {
        return this._control;
    }
}

export abstract class ClipElement extends RcElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _id: string;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, _undef, 'clipPath');

        const id = this._id = Utils.uniqueKey() + '-';
        this.setAttr('id', id);
        // this.setAttr(RcElement.CLIP_KEY, 1);
    }

	//-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    get id(): string {
        return this._id;
    }
}

export class ClipRectElement extends ClipElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _rect: RcElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, x = NaN, y = NaN, width = NaN, height = NaN, rx = 0, ry = 0) {
        super(doc);

        const rect = this._rect = new RcElement(doc, null, 'rect');
        rect.setAttr('fill', 'none');
        rx > 0 && rect.setAttr('rx', String(rx));
        ry > 0 && this.dom.setAttribute('rx', String(ry));
        if (!isNaN(x)) {
            rect.setBounds(x, y, width, height);
        }
        this.add(rect);
    }

	//-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    setBounds(x: number, y: number, w: number, h: number): RcElement {
        //this._rect.setBounds(x, y, w, h);
        // this._rect.setAttr('transform', '');
        this._rect.move(x, y);
        this._rect.resize(w, h);
        return this;
    }

    resize(width: number, height: number, attr?: boolean): RcElement {
        // super.resize(width, height);
        this._rect.resize(width, height);
        return this;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    get x(): number {
        return this._rect.x;
    }
    set x(value: number) {
        this._rect.x = value;
    }
    
    get y(): number {
        return this._rect.y;
    }
    set y(value: number) {
        this._rect.y = value;
    }

    get width(): number {
        return this._rect.width;
    }
    set width(value: number) {
        this._rect.width = value;
    }
    
    get height(): number {
        return this._rect.height;
    }
    set height(value: number) {
        this._rect.height = value;
    }
}

export class PathElement extends RcElement {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // static members
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _path: string;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName: string = void 0, path: Path = void 0) {
        super(doc, styleName, 'path');

        path && this.setPath(path);
    }

	//-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    path(): string {
        return this._path;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    setPath(path: Path): PathElement {
        const p = isString(path) ? path : path.join(' ');

        if (p !== this._path) {
            this.setAttr('d', this._path = p);
        }
        return this;
    }
    
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
}

export class ClipPathElement extends ClipElement {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // static members
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _path: PathElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc);

        this._path = new PathElement(doc);
        this.add(this._path);
    }

	//-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    setPath(path: Path): void {
        this._path.setPath(path);
    }
}

export class ClipCircleElement extends ClipElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _circle: RcElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc);

        this.add(this._circle = new RcElement(doc, null, 'circle'));
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    setCircle(cx: number, cy: number, radius: number) {
        this._circle.setAttrs({
            cx: cx, 
            cy: cy,
            r: radius
        });
    }
}

export abstract class DragTracker {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    dragging = false;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    start(eventTarget: Element, xStart: number, yStart: number, x: number, y: number): boolean {
        this.cancel();
        if (this._doStart(eventTarget, xStart, yStart, x, y)) {
            this.dragging = true;
            this._showFeedback(x, y);
            return true;
        }
        return false;
    }

    drag(eventTarget: Element, xPrev: number, yPrev: number, x: number, y: number): boolean {
        if (this.dragging) {
            if (this._doDrag(eventTarget, xPrev, yPrev, x, y)) {
                this._moveFeedback(x, y);
                return true;
            }
        }
        return false;
    }

    cancel(): void {
        if (this.dragging) {
            try {
                this.dragging = false;
                this._doCanceled();
            } finally {
                this.end(-1, -1);
            }
        }
    }

    drop(target: Element, x: number, y: number): void {
        if (this.dragging) {
            try {
                this.dragging = false;
                if (this._canAccept(target, x, y)) {
                    this._doCompleted(target, x, y);
                } else {
                    this._doCanceled();
                }
            } finally {
                this.end(x, y);
            }
        }
    }

    end(x: number, y: number): void {
        try {
            this.dragging = false;
            this._hideFeedback();
        } finally {
            this._doEnded(x, y);
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected _canAccept(target: Element, x: number, y: number): boolean {
        return true;
    }

    protected _showFeedback(x: number, y: number): void {
    }

    protected _moveFeedback(x: number, y: number): void {
    }

    protected _hideFeedback(): void {
    }

    protected _doStart(eventTarget: Element, xStart: number, yStart: number, x: number, y: number): boolean {
        return true;
    }

    protected abstract _doDrag(target: Element, xPrev: number, yPrev: number, x: number, y: number): boolean;

    protected _doCanceled(): void {
    }

    protected _doCompleted(target: Element, x: number, y: number): void {
    }

    protected _doEnded(x: number, y: number): void {
    }
}
