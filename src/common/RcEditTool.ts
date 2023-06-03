////////////////////////////////////////////////////////////////////////////////
// RtTool.ts
// 2021. 11. 25. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { Easings } from "./Easing";
import { IPoint } from "./Point";
import { RcControl } from "./RcControl";
import { RcObject } from "./RcObject";
import { RtDirection } from "./Types";
import { Utils } from "./Utils";

const DRAG_THRESHOLD = 3;
const DOUBLE_TAP_THRESHOLD = 300;

/** @internal */
export class RcEditTool {
    
    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // static members
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _control: RcControl;
    private _touchElement: Element;
    private _moveElement: Element;
    private _draggable: boolean;
    private _dragTracker: DragTracker;
    private _touchX: number;
    private _touchY: number;
    private _prevX: number;
    private _prevY: number;
    protected _touches: {x: number, y: number, t: number}[] = [];
    protected _tapped = 0;
    private _firstTime = 0;
    private _secondTime = 0;
    private _longTimer: any;
    protected _primaryId: number;
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(control: RcControl) {
        this._control = control;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    get control(): RcControl {
        return this._control;
    }

    /**
     * drag tracker
     */
    get dragTracker(): DragTracker {
        return this._dragTracker;
    }
    setDragTracker(value: DragTracker) {
        if (value != this._dragTracker) {
            if (this._dragTracker) {
                this._dragTracker.cancel();
            }
            this._dragTracker = value;
        }
    }

    get dragging(): boolean {
        return this._dragTracker && this._dragTracker.dragging;
    }

    touchX(): number {
        return this._touchX;
    }

    touchY(): number {
        return this._touchY;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    pointerDown(ev: PointerEvent): boolean {
        if (!ev.isPrimary) {
            return;
        }
        clearTimeout(this._longTimer);
        this._primaryId = ev.pointerId;

        const dom = this._touchElement = Utils.cast(ev.target, Element);
        if (!dom) return;

        let p: {x: number, y: number};

        this._draggable = true;

        p = this.$_pointerToPoint(ev);

        if (this._dragTracker) {
            this.$_stopDragTracker(dom, p.x, p.y);
        }
        this._prevX = p.x;
        this._prevY = p.y;

        if (this._tapped === 0) {
            this._firstTime = ev.timeStamp;
            this._touchX = p.x;
            this._touchY = p.y;
        } else {
            this._secondTime = ev.timeStamp;
        }

        this._touches = [{x: p.x, y: p.y, t: ev.timeStamp}];

        return this._doPointerDown(dom);
    }

    protected _stopEvent(ev: Event): void {
        ev.cancelable && ev.preventDefault();
        ev.stopImmediatePropagation();
    }

    private $_doDrag(ev: PointerEvent, dom: Element, x: number, y: number): boolean {
        if (!this.$_drag(dom, this._prevX, this._prevY, x, y)) {
            this.$_stopDragTracker(dom, x, y, true);
            this._stopEvent(ev);
            return true;
        }
    }


    private $_startMove(ev: PointerEvent, dom: Element, x: number, y: number): void {
        clearTimeout(this._longTimer);
        this._tapped = 0;

        if (this.$_startDrag(dom, this._prevX, this._prevY, x, y)) {
            this._clearTouchEffects();

            if (x !== this._prevX || y !== this._prevY) {
                this.$_doDrag(ev, dom, x, y);
            } else {
                this._stopEvent(ev);
            }
        }
    }

    pointerMove(ev: PointerEvent): void {
        if (ev.target instanceof HTMLTextAreaElement) return;

        // 버튼이 눌리지 않은 상태에서 move는 일단 체크하지 않는다. 필요한 UI가 생기면 그때추가하자.
        // iphone 6은 safari의 버전이 낮아서 Pointer-Event가 표준이 아니다.
        if (ev.buttons >= 1 || (ev.buttons === 0 && ev.button === 0 && ev.pointerId === this._primaryId)) {
            const {x, y} = this.$_pointerToPoint(ev);
            const dragging = this.dragging;
            // 왜 ev.target 대신 elementFromPoint를 사용했지? testing(jsdom)에서는 elementFromPoint가 미지원.
            // ev.target에 toucheStart의 target과 동일해서 그랬던가?
            const dom = ev.target as Element;//this.$_elementFromTouch(ev, null);

            if (x < 0 || x >= this._control.dom().offsetWidth || y < 0 || y >= this._control.dom().offsetHeight) {
                dragging && this.$_stopDragTracker(dom, x, y, true);
            } else if (dragging) {
                this.$_doDrag(ev, dom, x, y);
            } else if (!this._dragTracker && Math.abs(this._prevX - x) > DRAG_THRESHOLD || Math.abs(this._prevY - y) > DRAG_THRESHOLD) {
                this.$_startMove(ev, dom, x, y);
            } else if (this._dragTracker && !dragging) {
                this.$_startMove(ev, dom, x, y);
            }

            this._prevX = x;
            this._prevY = y;
            this._touches.push({x, y, t: ev.timeStamp});

            this._doPointerMove(dom);
        }

        if (this.dragging) {
            this._stopEvent(ev);
        }
    }

    // up시점에 click인지 다른 gesture인지 구분할수 있는 방법은 아래와 같이 tapped를 이용해도 된다.
    // 또하나는 down/move에서 touches에 위치를 저장했기 때문에 touches의 처음과 마지막의 위치를 비교해서 일정수준이 벗어나면 gesture로 판단하고 
    // 그렇지 않으면 click으로 판단해도 된다.
    // 현재 방식을 유지하고 문제가 된다면 위치를 비교하는 방식으로 변경한다.
    pointerUp(ev: PointerEvent): void {
        const dom = Utils.cast(ev.target, Element);

        clearTimeout(this._longTimer);
        this._clearTouchEffects();

        if (ev.isPrimary || this._primaryId === ev.pointerId) {
            if ((!this._dragTracker || this._dragTracker.canSwipe()) && this._draggable && this.$_checkSwipe(dom, ev)) {
                this._tapped = 0;
            } else {
                const {x, y} = this.$_pointerToPoint(ev);
                let elt  = ev.target as Element;// this.$_elementFromTouch(ev, null);

                if (dom && dom.contains(elt)) elt = dom;

                if (this.dragging) {
                    this._tapped = 0;
                    this.$_stopDragTracker(elt, x, y);
                    
                } else if (this._tapped === 0) {
                    this._tapped = 1;
                    // this._doTap(elt, this._touchX, this._touchY, x, y);
                } else if (this._tapped === 1) {
                    if (ev.timeStamp - this._firstTime < DOUBLE_TAP_THRESHOLD) {
                        this._tapped = 0;
                        // this._doDoubleTap(elt, this._touchX, this._touchY, x, y);
                    } else {
                        this._firstTime = this._secondTime;
                        this._touchX = this._prevX;
                        this._touchY = this._prevY;
                        // this._doTap(elt, this._touchX, this._touchY, x, y);
                    }
                }
            }
        } else if (this.dragging) {
            this.$_stopDragTracker(dom, this._prevX, this._prevY);
        }

        this._dragTracker = null;

        // TODO
        // if (this._doPointerUp(dom)) {
        //     // 여기서 끝내지 않으면 (복수 리스트가 존재할 때) 다른 리스트 컨트롤에서 클릭 이벤트가 발생한다. (Why?)
        //     this._stopEvent(ev);
        // }
    }

    pointerCancel(ev: PointerEvent): void {
        clearTimeout(this._longTimer);
        this._clearTouchEffects();
        this._doPointerCancel(ev);
    }

    pointerLeave(ev: PointerEvent): void {
        clearTimeout(this._longTimer);
        this._clearTouchEffects();
        this._doPointerLeave(ev);
    }

    touchMove(ev: TouchEvent): boolean {
        if (ev.target instanceof HTMLTextAreaElement) return true;
        
        return this._doTouchMove(ev, Utils.cast(ev.target, Element));
    }
    // touchLeave(ev: TouchEvent): void {
    //     console.log('LEAVE');
    //     clearTimeout(this._longTimer);
    //     this._clearTouchEffects();

    //     if (this.dragging) {
    //         const dom = Utils.cast(ev.target, Element);

    //         this.$_stopDragTracker(dom, this._prevX, this._prevY);
    //     }
    // }

    click(ev: PointerEvent): void {
        const dom = Utils.cast(ev.target, Element);
        if (!dom) return;
        this._doClick(ev, dom);
    }

    dblClick(ev: MouseEvent): void {
        const dom = Utils.cast(ev.target, Element);
        if (!dom) return;

        // doTap()에서 호출한다.
        this._doDblClick(dom);
    }

    keyPress(ev: KeyboardEvent): void {
        this._doKeyPress(ev);
    }

    wheel(ev: WheelEvent): void {
        if (this._doWheel(ev)) {
            this._stopEvent(ev);
        };
    }
    requestDrag(request: DragRequest): void {
        const tracker = this.getTrackerFromRequest(request);
        tracker && this.setDragTracker(tracker);
    }

    getTrackerFromRequest(request: DragRequest): DragTracker {
        return;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected _setDraggable(value: boolean): void {
        this._draggable = value;
    }

    protected _doClick(ev: PointerEvent, dom: Element): void {}
    protected _doDblClick(dom: Element): void {}
    protected _doPointerDown(dom: Element): boolean { return true; }
    protected _doPointerMove(dom: Element): void {}
    protected _doPointerUp(dom: Element): boolean { return true; }
    protected _doPointerCancel(ev: PointerEvent) {return}
    protected _doPointerLeave(ev: PointerEvent) {return}

    protected _doTouchMove(ev: TouchEvent, dom: Element): boolean {
        return true;
    }

    // protected _doTap(dom: Element, xStart: number, yStart: number, x: number, y: number): void {
    // }

    // protected _doDoubleTap(dom: Element, xStart: number, yStart: number, x: number, y: number): void {
    // }

    protected _doLongPressed(dom: Element, x: number, y: number): void {
    }

    protected _doKeyPress(ev: KeyboardEvent): void {
    }

    protected _doWheel(ev: WheelEvent): boolean {
        return true;
    }

    protected _doSwipe(dom: Element, prevTracker: DragTracker, dir: RtDirection, duration: number, distance: number): boolean {
        return false;
    }

    protected _getDragTracker(dom: Element, dx: number, dy: number): DragTracker {
        return null;
    }

    private $_startDrag(dom: Element, xStart: number, yStart: number, x: number, y: number): boolean {
        if (!this._dragTracker && this._draggable) {
            this.setDragTracker(this._getDragTracker(dom, x - xStart, y - yStart));
        }
        if (this._dragTracker) {
            return this._dragTracker.start(dom, xStart, yStart, x, y);
        }
        return false;
    }

    private $_drag(dom: Element, xPrev: number, yPrev: number,  x: number, y: number): boolean {
        return this._dragTracker.drag(dom, xPrev, yPrev, x, y);
    }

    private $_stopDragTracker(dom: Element, x: number, y: number, canceled = false): void {
        if (this.dragging) {
            if (canceled) {
                this._dragTracker.cancel();
            } else {
                this._dragTracker.drop(null, x, y);
            }
            this._dragTracker = null;
        }
    }

    private $_pointerToPoint(event: PointerEvent): IPoint {
        const r = this._control.dom().getBoundingClientRect();
        const x = event.pageX - r.left;
        const y = event.pageY - r.top;
        return {x, y};
    }

    // private $_elementFromTouch(ev: TouchEvent, touch: Touch): Element {
    //     let dom: Element;

    //     if (document.elementFromPoint) {
    //         const x = touch.clientX; 
    //         const y = touch.clientY;
    //         dom = document.elementFromPoint(x, y);
    //     } else {
    //         dom = ev.target as Element;
    //     }
    //     return dom;
    // }



    private $_checkSwipe(dom: Element, event: PointerEvent): boolean {
        const touches = this._touches;
        const count = touches.length;
        if (count < 2) return;

        const t2 = touches[count - 1];
        let t1 = touches[count - 2];

        if (t2.t - t1.t <= 100) {
            for (let i = count - 3; i >= 0; i--) {
                t1 = touches[i];
                if (t2.t - t1.t > 100) {
                    break;
                }
            }
        }

        const x1 = t1.x;
        const y1 = t1.y;
        const x2 = t2.x;
        const y2 = t2.y;
        const d = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
        const dt = Math.max(16, t2.t - t1.t);
        const v = d / dt;
        const vMin = 0.1;
        const friction = 0.998;

        if (v > vMin) {
            const tracker = this._dragTracker;
            const duration = Math.log(vMin / v) / Math.log(friction);
            const distance = v * (1 - Math.pow(friction, duration + 1)) / (1 - friction);
            let a = Math.round(Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI);
            let dir: RtDirection;

            if (a < 0) {
                a = 360 + a;
            }

            if (a > 45 && a <= 135) {
                dir = RtDirection.DOWN;
            } else if (a > 135 && a <= 225) {
                dir = RtDirection.LEFT;
            } else if (a > 225 && a <= 315) {
                dir = RtDirection.UP;
            } else {
                dir = RtDirection.RIGHT;
            }
            
            if (this.dragging) {
                if (tracker.swipe(dir, duration * 1.6, distance * 1.3)) {
                    return true;
                }
                this.$_stopDragTracker(dom, this._prevX, this._prevY);
            }
            return this._doSwipe(dom, tracker, dir, duration * 1.6, distance * 1.3);
        }
        return false;
    }

    /**
     * 터치 시작 시점에 실행한 설정 등을 이 후 touch 이벤트가 발생하면 초기화한다.
     * ex) touch feedback, ...
     *     iphone 메시지 편집 창에서 touch 하면 행을 선택하고 이 후 다른 이벤트가 발생하면 선택을 해제한다.
     */
    protected _clearTouchEffects(): void {
    }
}

export abstract class DragRequest extends RcObject {
}

export abstract class DragTracker extends RcObject {
	
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _control: RcControl;
    private _dragging = false;

    //-------------------------------------------------------------------------
    // constructors
    //-------------------------------------------------------------------------
    constructor(control: RcControl) {
        super();

        this._control = control;
    }

	//-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    get control(): RcControl {
        return this._control;
    }

    /** dragging */
    get dragging(): boolean {
        return this._dragging;
    }

    /** startWhenCreated */
    get startWhenCreated(): boolean {
        return false;
    }

    get cursor(): string {
        return;
    }

	//-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    canSwipe(): boolean {
        return false;
    }

    start(eventTarget: Element, xStart: number, yStart: number, x: number, y: number): boolean {
        this.cancel();
        if (this._doStart(eventTarget, xStart, yStart, x, y)) {
            // console.log('DRAG START')
            this._dragging = true;
            this._showFeedback(x, y);
            return true;
        }
        return false;
    }

    drag(eventTarget: Element, xPrev: number, yPrev: number, x: number, y: number): boolean {
        if (this._dragging) {
            if (this._doDrag(eventTarget, xPrev, yPrev, x, y)) {
                this._moveFeedback(x, y);
                return true;
            }
        }
        return false;
    }

    cancel(): void {
        if (this._dragging) {
            try {
                this._dragging = false;
                this._doCanceled();
            } finally {
                this.end();
            }
        }
    }

    drop(eventTarget: HTMLElement, x: number, y: number): void {
        if (this._dragging) {
            try {
                this._dragging = false;
                if (this._canAccept(eventTarget, x, y)) {
                    this._doCompleted(eventTarget, x, y);
                } else {
                    this._doCanceled();
                }
            } finally {
                this.end(x, y);
            }
        }
    }

    swipe(dir: RtDirection, duration: number, distance: number): boolean {
        if (this._doSwipe(dir, duration, distance)) {
            this.end();
            return true;
        }
    }

    end(x = -1, y = -1): void {
        try {
            this._dragging = false;
            this._hideFeedback();
        } finally {
            this._doEnded(x, y);
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected _doSwipe(dir: RtDirection, duration: number, distance: number): boolean {
        return false;
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

    protected abstract _doDrag(eventTarget: Element, xPrev: number, yPrev: number, x: number, y: number): boolean;

    protected _doCanceled(): void {
    }

    protected _canAccept(eventTarget: Element, x: number, y: number): boolean {
        return true;
    }

    protected _doCompleted(eventTarget: Element, x: number, y: number): void {
    }

    protected _doEnded(x = -1, y = -1): void {
    }
}

export type FlingHandler = (delta: number, step: number) => boolean;

export class FlingScroller extends RcObject {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    // private _easing = Easings.outExpo;
    private _easing = Easings.outQuint;
    // private _easing = Easings.scroll;
    private _started: number;
    private _stopped = false;
    private _prev: number;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(public distance: number, public duration: number, public threshold: number, public handler: FlingHandler, public endHandler?: () => void, public startHandler?: () => void) {
        super();
    }

    protected _doDestory(): void {
        this.stop();
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    private $_handler(): void {
        try {
            const t = +new Date();
            const elapsed = t - this._started;

            if (elapsed > this.duration) {
                this.stop();
            } else if (elapsed > 0) {
                const e = this._easing(elapsed / this.duration);
                const d = this.distance * (e - this._prev);

                if (d < this.threshold) {
                    this.stop();
                } else {
                    if (this.handler(d, elapsed / this.duration) === true) {
                        this.stop();
                    } else {
                        this._prev = e;
                    }
                }
            }
            if (!this._stopped) {
                requestAnimationFrame(this.$_handler.bind(this));
            }
        } catch (err) {
            this.stop();
            throw err;
        }
    }

    run(): FlingScroller {
        this.stop();
        this._started = +new Date();
        this._stopped = false;
        this._prev = 0;

        requestAnimationFrame(this.$_handler.bind(this));
        this.startHandler?.();
        return this;
    }

    stop(): boolean {
        if (!this._stopped) {
            this._stopped = true;
            this.endHandler?.();
            return true;
        }
    }
}