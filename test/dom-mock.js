import jsdomGlobal from "jsdom-global";
import fs from "fs";

jsdomGlobal("<!DOCTYPE html><html><head></head><body><div id='chart-control'></div></body></html>", 
    {
        url: "https://charting.wooritech.com/",
        referrer: "https://charting.wooritech.com/"
    }
);
// jsdom 기본 크기가 1024 * 728 이다. 
// portrait로 변경한다.
// window.resizeTo(1024, 1920); // Not impleneted.
window.innerWidth = 1024;
window.innerHeight = 1920;
window.alert = (s) => { console.log('ALERT:', s); }
// window.SVGSVGElement = window.HTMLDivElement;

const head = document.getElementsByTagName('head')[0];
const style = document.createElement("style");
const data = fs.readFileSync('web/realchart/styles/realreport-chart-style.css').toString();

style.innerHTML = data;
head.appendChild(style);

function toPix(size, def = 0) {
    let n = parseFloat(size);
    if (!isNaN(n)) {
        if (size.endsWith('em')) {
            return n * 10;
        } else if (!size.endsWith('px')) {
            debugger;
        }
        return n;
    }
    return def;
}

HTMLElement.prototype.animate = function() {}
Object.defineProperties(window.HTMLElement.prototype, {
    offsetTop: {
        get: function() { return parseFloat(this.style.top) || 0; }
    },
    offsetLeft: {
        get: function() { return parseFloat(this.style.left) || 0; }
    },
    offsetWidth: {
        get: function() { return parseFloat(this.style.width) || 0; }
    },
    offsetHeight: {
        get: function() { return parseFloat(this.style.height) || 0; }
    },
    clientWidth: { get: function() { return this.offsetWidth; } },
    clientHeight: { get: function() { return this.offsetHeight; } }
});
window.HTMLElement.prototype.getBoundingClientRect = function() {
    return {
        x: this.offsetLeft,
        y: this.offsetTop,
        left: this.offsetLeft,
        top: this.offsetTop,
        width: this.offsetWidth,
        height: this.offsetHeight
    }
};
Object.defineProperties(window.HTMLDivElement.prototype, {
    offsetWidth: {
        get: function() { 
            function getParentWidth(dom) {
                while (dom) {
                    const h = parseFloat(dom.style.height);
                    if (!Number.isNaN(h) || h.endsWith && !h.endsWith('%')) {
                        return h;
                    }
                    dom = dom.parentElement;
                }
            }

            let w = parseFloat(this.style.width);

            if (isNaN(w)) {
                const cs = window.getComputedStyle(this);

                w = 0;
                
                if (cs.display === 'flex' && cs.flexDirection === 'row') {// && cs.flexWrap !== 'wrap') {
                    Array.from(this.children).forEach(elt => {
                        w += elt.offsetWidth;
                    })
                    
                    const gap = parseFloat(cs.gap) || 0;
                    w += gap * (this.children.length - 1);
                } else if (this.children.length >= 1) {
                    w += this.children[0].offsetWidth;
                }
                w += (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0); 

            } else if (this.style.width.endsWith('%')) {
                return getParentWidth(this.parentElement) * w / 100;
            }
            return w || 0; 
        }
    },
    offsetHeight: {
        get: function() { 
            function getParentHeight(dom) {
                while (dom) {
                    const h = parseFloat(dom.style.height);
                    if (!Number.isNaN(h) || h.endsWith && !h.endsWith('%')) {
                        return h;
                    }
                    dom = dom.parentElement;
                }
            }

            let h = parseFloat(this.style.height);

            if (isNaN(h)) {
                const cs = window.getComputedStyle(this);

                h = 0;

                if (cs.display === 'flex' && cs.flexDirection === 'column') {// && cs.flexWrap !== 'wrap') {
                    Array.from(this.children).forEach(elt => {
                        h += elt.offsetHeight;
                    })
                    
                    const gap = parseFloat(cs.gap) || 0;
                    h += gap * (this.children.length - 1);
                } else if (cs.display === 'flex' && cs.flexDirection === 'row') {
                    Array.from(this.children).forEach(elt => {
                        h = Math.max(h, elt.offsetHeight);
                    })
                } else if (this.children.length >= 1) {
                    h += this.children[0].offsetHeight;
                }
                h += (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0); 
            } else if (this.style.height.endsWith('%')) {
                return getParentHeight(this.parentElement) * h / 100;
            }
            return h || 0; 
        }
    },
});
// <image>
Object.defineProperties(window.HTMLImageElement.prototype, {
    offsetWidth: {
        get: function() { return 50; }
    },
    offsetHeight: {
        get: function() { return 50; }
    },
});
const fontSizes = {
    smaller: 12,
    medium: 14,
    larger: 17
}
const spanProps = {
    offsetWidth: {
        get: function() { 
            let w = parseFloat(this.style.width);
            if (isNaN(w)) {
                const cs = window.getComputedStyle(this);
                w = fontSizes[cs.fontSize] || parseFloat(cs.fontSize) || 14;
                w = (this.textContent || '').length * w / 2;
                w += (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
            }
            return w;
        }
    },
    offsetHeight: {
        get: function() { 
            let h = parseFloat(this.style.height);
            if (isNaN(h)) {
                const cs = window.getComputedStyle(this);
                h = fontSizes[cs.fontSize] || parseFloat(cs.fontSize) || 14;
                h += (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
            }
            return h;
        }
    },
    clientWidth: { get: function() { return this.offsetWidth; } },
    clientHeight: { get: function() { return this.offsetHeight; } }
};
// <span>
Object.defineProperties(window.HTMLSpanElement.prototype, spanProps);
// <label>
Object.defineProperties(window.HTMLLabelElement.prototype, spanProps);

const selectProps = {
    // 브라우저가 기본 크기 스타일들을 설정한다. ex) 10em, 1em
    offsetWidth: {
        get: function() { return toPix(this.style.width, 110); }
    },
    offsetHeight: {
        get: function() { return toPix(this.style.height, 19); }
    },
    clientWidth: { get: function() { return this.offsetWidth; } },
    clientHeight: { get: function() { return this.offsetHeight; } }
}
// <select>
Object.defineProperties(window.HTMLSelectElement.prototype, selectProps);

const progressProps = {
    // 브라우저가 기본 크기 스타일들을 설정한다. ex) 10em, 1em
    offsetWidth: {
        get: function() { return toPix(this.style.width, 110); }
    },
    offsetHeight: {
        get: function() { return toPix(this.style.height, 11); }
    },
    clientWidth: { get: function() { return this.offsetWidth; } },
    clientHeight: { get: function() { return this.offsetHeight; } }
}
// <progress>
Object.defineProperties(window.HTMLProgressElement.prototype, progressProps);
// <meter>
Object.defineProperties(window.HTMLMeterElement.prototype, progressProps);

// <input>
const wInputs = {
    'checkbox': 13,
    'radio': 13
}
const hInputs = {
    'checkbox': 13,
    'radio': 13
}
Object.defineProperties(window.HTMLInputElement.prototype, {
    // 브라우저가 기본 크기 스타일들을 설정한다.
    offsetWidth: {
        get: function() { return toPix(this.style.width, wInputs[this.type]); }
    },
    offsetHeight: {
        get: function() { return toPix(this.style.height, hInputs[this.type]); }
    },
    clientWidth: { get: function() { return this.offsetWidth; } },
    clientHeight: { get: function() { return this.offsetHeight; } }
});
const buttonProps = {
    offsetWidth: {
        get: function() { 
            let w = parseFloat(this.style.width);
            let cs;

            if (isNaN(w)) {
                cs = window.getComputedStyle(this)
                const sz = fontSizes[cs.fontSize] || parseFloat(cs.fontSize) || 14;
                w = (this.textContent || '').length * sz / 2;
            }
            if (!cs) {
                cs = window.getComputedStyle(this);
            }
            w += parseFloat(cs.paddingLeft) || 0;
            w += parseFloat(cs.paddingRight) || 0;
            return w;
        }
    },
    offsetHeight: {
        get: function() { 
            let h = parseFloat(this.style.height);
            let cs;

            if (isNaN(h)) {
                cs = window.getComputedStyle(this);
                const sz = fontSizes[cs.fontSize] || parseFloat(cs.fontSize) || 14;
                h = sz;
            }
            if (!cs) {
                cs = window.getComputedStyle(this);
            }
            h += parseFloat(cs.paddingTop) || 0;
            h += parseFloat(cs.paddingBottom) || 0;
            return h;
        }
    },
    clientWidth: { get: function() { return this.offsetWidth; } },
    clientHeight: { get: function() { return this.offsetHeight; } }
};
// <button>
Object.defineProperties(window.HTMLButtonElement.prototype, buttonProps);

// window.SVGSVGElement.prototype.getBBox = function () {
//     return { x: 0, y: 0, width: 0, height: 0 }
// }
window.SVGElement.prototype.getBBox = function () {
    return { x: 0, y: 0, width: 0, height: 0 }
}

console.log('> DOM mock prepared for testing.');