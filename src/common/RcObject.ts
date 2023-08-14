////////////////////////////////////////////////////////////////////////////////
// RcObject.ts
// 2021. 11. 30. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isObject } from "./Common";

let $$_hash = 0;

/**
 * RealReport-Chart 라이브러리 클래스 모델의 최상위 base 클래스.
 * <br>
 * 
 * @see concepts.dev_guide 개발 가이드
 * @see concepts.about RealTouch 개요
 */
export abstract class RcObject {
    
    //-------------------------------------------------------------------------
    // static members
    //-------------------------------------------------------------------------
    static destroy(obj: RcObject): null {
        return obj && obj.destroy();
    }

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private $_hash: string;
    private $_destroyed = false;
    private $_destroying = false;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
	constructor(noHash?: boolean) {
        if (!noHash) {
            this.$_hash = String($$_hash++);
        }
	}

    /**
     * 객체가 소유한 참조 등을 해제하고 null을 리턴한다.
     * 
     * ```
     * list = lis.destroy();
     * ```
     * 
     * @returns null
     */
    destroy(): null {
        if (!this.$_destroyed && !this.$_destroying) {
            this.$_destroyed = true;
            this.$_destroying = true;
            this._doDestory();
        }
        return null;
    }
    
    protected _doDestory(): void {}

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    get destroying(): boolean {
        return this.$_destroying;
    }

    get hash(): string {
        return this.$_hash;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    public isMe(hash: string): boolean {
        return hash === this.$_hash;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    toString(): string {
        return this.constructor.name;
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    /**
     * @internal
     * 
     * template param으로부터 생성되는 값은 문자열일 수 있다.
     */
    toBool(v: any): boolean {
        return typeof v === 'string' ? v === 'true': v;
    }

    toNum(v: any, def: number = NaN): number {
        v = parseFloat(v);
        return isNaN(v) ? def : v;
    }
}

export abstract class RcWrappableObject extends RcObject {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    protected _wrapper: any;

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    wrapper(): any {
        return this._wrapper;
    }

    wrapperOrThis(): any {
        return this._wrapper || this;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    createWrapper<T>(clazz: { new(): T}): T {
        const w = this._wrapper = new clazz();
        w['$_c'] = this;
        return w;
    } 

    setWrapper<T>(wrapper: T): T {
        this._wrapper = wrapper;
        wrapper['$_c'] = this;
        return wrapper;
    } 

    isWrapper(w: any): boolean {
        return w === this._wrapper;
    }
}

export abstract class RcWrapper<T extends RcWrappableObject>  extends RcObject {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    protected $_c: T;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    protected _doDestory(): void {
        this.$_c = null;
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
}

export abstract class RcEventProvider<T> extends RcObject {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _listeners: T[] = [];

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    addListener(listener: T): void {
        if (listener && this._listeners.indexOf(listener) < 0) {
            this._listeners.push(listener);
        }
    }

    removeListener(listener: T): void {
        const i = this._listeners.indexOf(listener);
        if (i >= 0) {
            this._listeners.splice(i, 1);
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    /**
     * event로 지정한 함수가 정의된 모든 리스너에 대해 실행한다.
     * 리스너 scope으로 실행하고, 첫번째 매개변수로 이 객체가 전달된다.
     * 다만, 리스너들 중 하나라도 undefined가 아닌 값을 리턴하면,
     * 그 값을 리턴하면서 멈춘다.
     */
    protected _fireEvent(event: string, ...args: any[]): any {
        const arr = Array.prototype.slice.call(arguments, 0);
        arr[0] = this;

        for (const listener of this._listeners) {
            const func = listener[event];
            if (func) {
                const rslt = func.apply(listener, arr);
                if (rslt !== void 0) {
                    return rslt;
                }
            }
        }
    }
}

export interface IEventArgs {
}

/**
 * @internal
 * 
 * {@link RtListControl} 및 {@link RtDataSource} 이벤트 콜백 형식.
 * <br>
 * 여러 값이 포함된 단일 매개변수로 호출된다.
 */
export type RcEventHandler<T extends IEventArgs> = (args?: T) => void;
export type RcSimpleEventhandler = (arg: any) => void;