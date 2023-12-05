////////////////////////////////////////////////////////////////////////////////
// ElementPool.ts
// 2020. 10. 23. created by dataludi
// -----------------------------------------------------------------------------
// Copyright (c) 2020 Dataludi Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { GroupElement } from "./impl/GroupElement";
import { RcElement } from "./RcControl";
import { RcObject } from "./RcObject";

export type Visitor<T extends RcElement> = (element: T, index?: number, count?: number) => void;

/** @internal */
export class ElementPool<T extends RcElement> extends RcObject {
	
    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // static members
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    removeDelay = 0;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _owner: RcElement;
    private _creator: { new (doc: Document, styleName?: string): T };
    private _pool: T[] = [];
    private _views: T[] = [];
    private _removes: T[] = [];
    private _styleName: string;

    //-------------------------------------------------------------------------
    // constructors
    //-------------------------------------------------------------------------
    constructor(owner: RcElement, creator: { new (doc: Document, styleName?: string): T }, styleName?: string, removeDelay = 0) {
        super();

        this._owner = owner;
        this._creator = creator;
        this._styleName = styleName;
        this.removeDelay = removeDelay;
    }

    protected _doDestory(): void {
        this.freeAll();
        this._owner = null;
        this._creator = null;

        super._doDestory();
    }

	//-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    get isEmpty(): boolean {
        return this._views.length === 0;
    }

    get count(): number {
        return this._views.length;
    }

    get first(): T {
        return this._views[0];
    }

    get last(): T {
        return this._views[this._views.length - 1];
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    get(index: number): T {
        return this._views[index];
    }

    getAll(): T[] {
        return this._views.slice();
    }

    _internalItems(): T[] {
        return this._views;
    }

    elementOf(dom: Element): T {
        for (let v of this._views) {
            if (v.dom.contains(dom)) return v;
        }
    }

    find(matcher: (v: T) => boolean): T {
        return this._views.find(matcher);
    }

    setRemoveDelay(v: number): ElementPool<T> {
        this.removeDelay = v;
        return this;
    }

    removeLater(v: RcElement, duration: number): void {
        const i = this._views.indexOf(v as any);

        if (i >= 0) {
            v.removeLater(duration, v => {
                this._pool.push(v as any);
            });
            this._views.splice(i, 1);
        }
    }

    private $_create(doc: Document, index = -1, count = 0): T {
        let v = this._pool.pop();
        
        if (!v) {
            v = new this._creator(doc, this._styleName);
        }
        this._owner.add(v);
        return v;
    }

    prepare(count: number, visitor?: Visitor<T>, initor?: Visitor<T>): ElementPool<T> {
        const doc = this._owner.doc;
        const pool = this._pool;
        const views = this._views;

        // // TODO: 왜 이런 일이 발생하지?
        // for (let v of views) {
        //     if (!v.parent) {
        //         this._owner.add(v);
        //     }
        // }

        while (views.length > count) {
            pool.push(views.pop().remove() as T);
        }

        while (views.length < count) {
            const v = this.$_create(doc);
            views.push(v);
            initor?.(v, views.length - 1, count);
        }

        visitor && this.forEach(visitor);
        return this;
    }

    /**
     * 기존 view를 재활용하도록 한다.
     * objProp가 설정되지 않으면 objs의 개별 obj 자체외 비교한다.
     */
    reprepare(viewProp: string, objs: RcObject[], objProp: string, cleaner?: Visitor<T>, initor?: Visitor<T>, visitor?: Visitor<T>): ElementPool<T> {
        const doc = this._owner.doc;
        const pool = this._pool;
        const oldViews = this._views;
        const views: T[] = [];

        for (let i = this._removes.length - 1; i >= 0; i--) {
            if (!this._removes[i].parent) {
                const v = this._removes.splice(i, 1)[0];
                pool.push(v);
            }
        }

        for (let i = 0, cnt = objs.length; i < cnt; i++) {
            const obj = objs[i];
            let found = -1;

            if (viewProp) {
                for (let i = 0, cnt = oldViews.length; i < cnt; i++) {
                    const oldKey = oldViews[i][viewProp];
    
                    if (objProp && oldKey === obj[objProp] || !objProp && oldKey === obj) {
                        views.push(oldViews[i]);
                        found = i;
                        break;
                    }
                }
            }

            if (found >= 0) {
                const v = oldViews.splice(found, 1)[0];
                if (!v.parent) this._owner.add(v);
            } else {
                const v = this.$_create(doc, i, cnt);
                views.push(v);
                initor?.(v, i, cnt);
            }
        }
    
        for (let i = 0, cnt = oldViews.length; i < cnt; i++) {
            const v = oldViews[i];

            if (v.removing) {
                //views.push(v);
            } else {
                if (this.removeDelay > 0) {
                    //pool.push(v.removeLater(true, this.removeDelay) as T);
                    this._removes.push(v.removeLater(this.removeDelay) as T);
                } else {
                    pool.push(v.remove() as T);
                }
                cleaner?.(v, i, cnt);
            }
        }

        this._views = views;
        // Utils.log('pool views', this._views.length);
        visitor && this.forEach(visitor);
        return this;
    }

    borrow(): T {
        const elt = this._pool.pop() || new this._creator(this._owner.doc, this._styleName);

        this._owner.add(elt);
        return elt;
    }

    free(element: T, removeDelay = 0): void {
        if (element) {
            if (removeDelay > 0) {
                element.removeLater(removeDelay);
            } else {
                element.remove();
            }
            this._pool.push(element);

            const i = this._views.indexOf(element);
            if (i >= 0) {
                this._views.splice(i, 1);
            }
        }
    }

    freeAll(elements?: T[], removeDelay = 0): void {
        elements = elements || this._views;
        for (let i = elements.length - 1; i >= 0; i--) {
            this.free(elements[i], removeDelay);
        }
    }

    // fadeout(element: T, removeDelay: number, startOpacity?: number): void {
    //     if (element) {
    //         element.fadeout(removeDelay, startOpacity);
    //         this._pool.push(element);

    //         const i = this._views.indexOf(element);
    //         if (i >= 0) {
    //             this._views.splice(i, 1);
    //         }
    //     }
    // }

    forEach(visitor: (v: T, i?: number, count?: number) => void): void {
        const views = this._views;

        for (let i = 0, cnt = views.length; i < cnt; i++) {
            visitor(views[i], i, cnt);
        }
    }

    visit(visitor: (v: T, i: number, count: number) => boolean): boolean {
        const cnt = this._views.length;
        let i = 0;

        for (; i < cnt; i++) {
            if (visitor(this._views[i], i, cnt) === false) {
                break;
            }
        }
        return i === cnt;
    }

    sort(compare: (v1: T, v2: T) => number): ElementPool<T> {
        this._views = this._views.sort(compare);
        return this;
    }

    map(callback: (v: T) => any): any[] {
        return this._views.map(callback);
    }


    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
}
