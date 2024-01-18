////////////////////////////////////////////////////////////////////////////////
// RcAnimation.ts
// 2023. 08. 07. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { cos, maxv, minv, pickNum } from "./Common";
import { PI, PI_2, fixnum, newObject } from "./Types";

// const pow = Math.pow;
// const sqrt = Math.sqrt;
// const sin = Math.sin;
// const cos = Math.cos;
// const PI = Math.PI;
// const c1 = 1.70158;
// const c2 = c1 * 1.525;
// const c3 = c1 + 1;
// const c4 = (2 * PI) / 3;
// const c5 = (2 * PI) / 4.5;
// const bounceOut = function (x: number): number {
// 	const n1 = 7.5625;
// 	const d1 = 2.75;

// 	if (x < 1 / d1) {
// 		return n1 * x * x;
// 	} else if (x < 2 / d1) {
// 		return n1 * (x -= 1.5 / d1) * x + 0.75;
// 	} else if (x < 2.5 / d1) {
// 		return n1 * (x -= 2.25 / d1) * x + 0.9375;
// 	} else {
// 		return n1 * (x -= 2.625 / d1) * x + 0.984375;
// 	}
// }

const Easings: any = {
    // inQuad(x: number) {
	// 	return x * x;
	// },
	// outQuad(x: number) {
	// 	return 1 - (1 - x) * (1 - x);
	// },
	// inOutQuad(x: number) {
	// 	return x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2;
	// },
	// inCubic(x: number) {
	// 	return x * x * x;
	// },
	// outCubic(x: number) {
	// 	return 1 - pow(1 - x, 3);
	// },
	// outCubic2(x: number) {
	// 	return 1 - pow(1 - x, 4);
	// },
	// inOutCubic(x: number) {
	// 	return x < 0.5 ? 4 * x * x * x : 1 - pow(-2 * x + 2, 3) / 2;
	// },
	// inQuart(x: number) {
	// 	return x * x * x * x;
	// },
	// outQuart(x: number) {
	// 	return 1 - pow(1 - x, 4);
	// },
	// inOutQuart(x: number) {
	// 	return x < 0.5 ? 8 * x * x * x * x : 1 - pow(-2 * x + 2, 4) / 2;
	// },
	// inQuint(x: number) {
	// 	return x * x * x * x * x;
	// },
	// outQuint(x: number) {
	// 	return 1 - pow(1 - x, 5);
	// },
	// inOutQuint(x: number) {
	// 	return x < 0.5 ? 16 * x * x * x * x * x : 1 - pow(-2 * x + 2, 5) / 2;
	// },
	// inSine(x: number) {
	// 	return 1 - cos((x * PI) / 2);
	// },
	// outSine(x: number) {
	// 	return sin((x * PI) / 2);
	// },
	inOutSine(x: number) {
		return -(cos(PI * x) - 1) / 2;
	},
	// inExpo(x: number) {
	// 	return x === 0 ? 0 : pow(2, 10 * x - 10);
	// },
	// outExpo(x: number) {
	// 	return x === 1 ? 1 : 1 - pow(2, -10 * x);
	// },
	// inOutExpo(x: number) {
	// 	return x === 0
	// 		? 0
	// 		: x === 1
	// 		? 1
	// 		: x < 0.5
	// 		? pow(2, 20 * x - 10) / 2
	// 		: (2 - pow(2, -20 * x + 10)) / 2;
	// },
	// inCirc(x: number) {
	// 	return 1 - sqrt(1 - pow(x, 2));
	// },
	// outCirc(x: number) {
	// 	return sqrt(1 - pow(x - 1, 2));
	// },
	// inOutCirc(x: number) {
	// 	return x < 0.5
	// 		? (1 - sqrt(1 - pow(2 * x, 2))) / 2
	// 		: (sqrt(1 - pow(-2 * x + 2, 2)) + 1) / 2;
	// },
	// inBack(x: number) {
	// 	return c3 * x * x * x - c1 * x * x;
	// },
	// outBack(x: number) {
	// 	return 1 + c3 * pow(x - 1, 3) + c1 * pow(x - 1, 2);
	// },
	// inOutBack(x: number) {
	// 	return x < 0.5
	// 		? (pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
	// 		: (pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
	// },
	// inElastic(x: number) {
	// 	return x === 0
	// 		? 0
	// 		: x === 1
	// 		? 1
	// 		: -pow(2, 10 * x - 10) * sin((x * 10 - 10.75) * c4);
	// },
	// outElastic(x: number) {
	// 	return x === 0
	// 		? 0
	// 		: x === 1
	// 		? 1
	// 		: pow(2, -10 * x) * sin((x * 10 - 0.75) * c4) + 1;
	// },
	// inOutElastic(x: number) {
	// 	return x === 0
	// 		? 0
	// 		: x === 1
	// 		? 1
	// 		: x < 0.5
	// 		? -(pow(2, 20 * x - 10) * sin((20 * x - 11.125) * c5)) / 2
	// 		: (pow(2, -20 * x + 10) * sin((20 * x - 11.125) * c5)) / 2 + 1;
	// },
	// inBounce(x: number) {
	// 	return 1 - bounceOut(1 - x);
	// },
	// outBounce: bounceOut,
	// inOutBounce(x: number) {
	// 	return x < 0.5  
	// 		? (1 - bounceOut(1 - 2 * x)) / 2
	// 		: (1 + bounceOut(2 * x - 1)) / 2;
    // },
}

export const createAnimation = function (dom: Element, styleProp: string, fromValue: any, toValue: any, duration: number, finishHandler: () => void): Animation {
    const frame1 = fromValue != null ? newObject(styleProp, fromValue) : {};
    const frame2 = newObject(styleProp, toValue);
    const ani = dom.animate([frame1, frame2], {
        duration: duration,
        fill: 'none'
    });
    ani && finishHandler && ani.addEventListener('finish', finishHandler);
    return ani;
}

export type RcAnimationEndHandler = (ani: RcAnimation) => void;

export abstract class RcAnimation {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly DURATION = 700;
    static readonly SHORT_DURATION = 300;

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    delay = 0;
    duration = RcAnimation.DURATION;
    easing = 'inOutSine';
    endHandler: RcAnimationEndHandler;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _easing: (x: number) => number;
    private _started: number;
    private _timer: any;
    private _handler = () => {
        const dt = +new Date() - this._started - this.delay;
        let rate = minv(1, maxv(0, fixnum(dt / this.duration)));

        if (this._easing) {
            rate = this._easing(rate);
        }

        try {
            if (!this._timer || !this._canUpdate() || this._doUpdate(rate) === false) {
                this._stop();
            }
        } finally {
            if (dt >= this.duration) {
                this._stop();
            } else if (this._started && this._timer) {
                window.requestAnimationFrame(this._handler)
            }
        }
    }

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    start(endHandler?: RcAnimationEndHandler): RcAnimation {
		if (endHandler) this.endHandler = endHandler;
        this._start(this.duration, this.delay, this.easing);
		return this;
    }

    stop(): void {
        this._stop();
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected _start(duration: number, delay = 0, easing: string = null): void {
        this._started && this._stop();

        this.duration = pickNum(duration, RcAnimation.DURATION);
        this.delay = delay || 0;
        this._easing = Easings[easing];
        this._doStart();
        this._started = +new Date();
        this._timer = setTimeout(() => this._stop(), this.duration * 1.2); // 안전 장치
        this._handler();
    }

    protected _stop(): void {
        if (this._started) {
            clearTimeout(this._timer);
            this._timer = null;
            this._started = null;
            this._doStop();
            this.endHandler?.(this);
        }
    }

    protected _doStart(): void {
    }

    protected _doStop(): void {
    }

    protected _canUpdate(): boolean {
        return true;
    }

    protected abstract _doUpdate(rate: number): boolean;
}