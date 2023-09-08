(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.RealChart = {}));
})(this, (function (exports) { 'use strict';

    let $$_hash = 0;
    class RcObject {
        static destroy(obj) {
            return obj && obj.destroy();
        }
        constructor(noHash) {
            this.$_destroyed = false;
            this.$_destroying = false;
            if (!noHash) {
                this.$_hash = String($$_hash++);
            }
        }
        destroy() {
            if (!this.$_destroyed && !this.$_destroying) {
                this.$_destroyed = true;
                this.$_destroying = true;
                this._doDestory();
            }
            return null;
        }
        _doDestory() { }
        get destroying() {
            return this.$_destroying;
        }
        get hash() {
            return this.$_hash;
        }
        isMe(hash) {
            return hash === this.$_hash;
        }
        toString() {
            return this.constructor.name;
        }
        toBool(v) {
            return typeof v === 'string' ? v === 'true' : v;
        }
        toNum(v, def = NaN) {
            v = parseFloat(v);
            return isNaN(v) ? def : v;
        }
    }
    class RcWrappableObject extends RcObject {
        wrapper() {
            return this._wrapper;
        }
        wrapperOrThis() {
            return this._wrapper || this;
        }
        createWrapper(clazz) {
            const w = this._wrapper = new clazz();
            w['$_c'] = this;
            return w;
        }
        setWrapper(wrapper) {
            this._wrapper = wrapper;
            wrapper['$_c'] = this;
            return wrapper;
        }
        isWrapper(w) {
            return w === this._wrapper;
        }
    }
    class RcEventProvider extends RcObject {
        constructor() {
            super(...arguments);
            this._listeners = [];
        }
        addListener(listener) {
            if (listener && this._listeners.indexOf(listener) < 0) {
                this._listeners.push(listener);
            }
        }
        removeListener(listener) {
            const i = this._listeners.indexOf(listener);
            if (i >= 0) {
                this._listeners.splice(i, 1);
            }
        }
        _fireEvent(event, ...args) {
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

    const SVGNS = 'http://www.w3.org/2000/svg';
    const isObject = function (v) { return v && typeof v === 'object' && !Array.isArray(v); };
    const isArray = Array.isArray;
    const isString = function (v) { return typeof v === 'string'; };
    const isNumber = function (v) { return typeof v === 'number'; };
    const isBoolean = function (v) { return typeof v === 'boolean'; };
    const isNone = function (v) { return v == null || isNaN(v); };
    const pickNum = function (v1, v2) {
        v1 = parseFloat(v1);
        return !isNaN(v1) ? v1 : parseFloat(v2);
    };
    const pickNum3 = function (v1, v2, v3) {
        let v = parseFloat(v1);
        if (!isNaN(v))
            return v;
        v = parseFloat(v2);
        return !isNaN(v) ? v : parseFloat(v3);
    };
    const pickProp = function (v1, v2) {
        return v1 !== void 0 ? v1 : v2;
    };
    const pickProp3 = function (v1, v2, v3) {
        return v1 !== void 0 ? v1 : v2 !== void 0 ? v2 : v3;
    };
    const pickProp4 = function (v1, v2, v3, v4) {
        return v1 !== void 0 ? v1 : v2 !== void 0 ? v2 : v3 != void 0 ? v3 : v4;
    };
    class RtDebug {
        static setDebugging(enabled = true) {
            this._debugging = enabled;
        }
        static debugging() {
            if (this._debugging) {
                debugger;
            }
        }
    }
    RtDebug._debugging = false;

    const Locales = {};
    Locales['ko'] = {
        dateFormat: 'yyyy.MM.dd',
        am: '오전',
        pm: '오후',
        notExistsDataField: '존재하지 않는 필드입니다: %1',
        notSpecifiedDataField: '하나 이상의 데이터필드가 설정돼야 합니다.',
        invalidFieldName: '잘못된 데이터필드 이름입니다: %1',
        invalidFieldIndex: '잘못된 데이터필드 index입니다: %1',
        invalidRowIndex: '잘못된 데이터행 index입니다: %1',
        canNotModifyData: '읽기 전용 데이터를 변경할 수 없습니다.',
        canNotModifyDeleted: '삭제 상태 행을 변경할 수 없습니다: %1',
        requiredField: '반드시 값을 지정해야 하는 필드입니다: %1',
        invalidValueInDomain: '값이 필드 값 도메인에 포함되지 않습니다: %1',
        invalidValueInRange: '값이 필드 값 범위에 포함되지 않습니다: %1',
        invalidToIndex: "잘못된 'to' index입니다.: %1",
        requireSourceData: '원본 data가 반드시 지정돼야 합니다.',
        requireFilterName: '필터 이름이 반드시 지정돼야 합니다.',
        alreadyEditing: '이미 데이터 편집 중입니다.',
        invalidDateFormat: '잘못된 시간 날짜 형식입니다: %1',
        invalidSizeValue: '잘못된 Size 값입니다: %1',
        invalidOuterDiv: '잘못된 외부 div 입니다: %1',
        canNotHorzGrouping: '수평 모드일 때 그룹핑할 수 없습니다.',
        dataMustSet: '데이터가 먼저 설정돼야 합니다.',
        requireGroupingInfos: '하나 이상의 행 그룹핑 정보가 설정돼야 합니다.',
        canNotRowGrouping: '데이터링크 view에 대해 행그룹핑 할 수 없습니다. dataGroupBy()를 사용하세요.',
        canNotDataGrouping: '데이터링크 view가 아니면 데이터그룹핑할 수 없습니다. rowGroupBy()를 사용하세요.',
        canNotHorzInGrouping: '그룹핑 상태일 때 수평모드로 변경할 수 없습니다.',
        unknownLayoutType: '잘못된 layout 종류입니다: %1',
        layoutMustSet: '레이아웃 모델이 반드시 설정돼야 합니다.',
        unknownItemViewType: '잘못된 item view 종류입니다: %1',
        requireCommandName: 'Command 이름이 지정돼야 합니다.',
        commandNameDuplicated: '이미 존재하는 command 이름입니다: %1',
        requireDataOrGroup: '데이터소스나 그룹 모델이 반드시 지정돼야 합니다.',
        requireTableName: '테이블모델의 이름이 지정돼야 합니다.',
        alreadyTableExists: '이미 존해하는 테이블모델입니다: %1',
        selectEditRowFirst: '수정하거나 삽입할 행을 먼저 선택하세요.',
    };
    Locales['en'] = {
        dateFormat: 'M/d/yyyy',
        am: 'AM',
        pm: 'PM',
        notExistsDataField: 'A data field is not exists: %1',
        notSpecifiedDataField: 'At least one datafield must be set.',
        invalidFieldName: 'Invalid field name: %1',
        invalidFieldIndex: 'Invalid field index: %1',
        invalidRowIndex: 'Invalid row index: %1',
        canNotModifyData: 'Can not modify a readonly data.',
        canNotModifyDeleted: 'Can not modify a deleted row: %1',
        requiredField: 'Required field: %1',
        invalidValueInDomain: 'The value is not int the domain: %1',
        invalidValueInRange: 'The value is not int the range: %1',
        invalidToIndex: "Invalid 'to' index: %1",
        requireSourceData: 'A source data must be set.',
        requireFilterName: 'A filter name must be set.',
        alreadyEditing: 'DataView is already editing.',
        invalidDateFormat: 'Invalid datetime format: %1',
        invalidSizeValue: 'Invalid size value: %1',
        invalidOuterDiv: 'Invalid outer div element: %1',
        canNotHorzGrouping: 'Can not row grouping in horz mode.',
        dataMustSet: 'A data must be set first.',
        requireGroupingInfos: 'At least one grouping info must be set.',
        canNotRowGrouping: 'Can not row grouping by data link view. use dataGroupBy().',
        canNotDataGrouping: 'Can not data grouping without data link view. rowGroupBy()를 사용하세요.',
        canNotHorzInGrouping: 'Can not change to horz mode while grouping',
        unknownLayoutType: 'Invalid layout: %1',
        layoutMustSet: 'A layout model must be set.',
        unknownItemViewType: 'Unknow item view type: %1',
        requireCommandName: 'Command name must be supplied.',
        commandNameDuplicated: 'Command name is already exists: %1',
        requireDataOrGroup: 'A data or group view must be set.',
        requireTableName: 'The name of table model is required.',
        alreadyTableExists: 'A table model is already exists: %1',
        selectEditRowFirst: 'First select the row you want to edit or insert.',
    };
    let _currLang = 'ko';
    let locale = Locales[_currLang];

    const _undefined = void 0;
    const PERCENT = '%'.charCodeAt(0);
    const ZWSP = '&#8203;';
    const ELLIPSIS = '\u2026';
    const ORG_ANGLE = -Math.PI / 2;
    const DEG_RAD = Math.PI * 2 / 360;
    const NUMBER_SYMBOLS = 'k,M,G,T,P,E';
    const NUMBER_FORMAT = '#,##0.#';
    const ceil = Math.ceil;
    function fixnum(value) {
        return parseFloat(value.toPrecision(12));
    }
    function toStr(value) {
        return value == null ? null : String(value);
    }
    function deg2rad(degree) {
        return degree * Math.PI * 2 / 360;
    }
    function pixel(v) {
        return v + 'px';
    }
    function isNull(v) {
        return v == null || Number.isNaN(v) || v === '';
    }
    function pad2(v) {
        return v < 10 ? `0${v}` : String(v);
    }
    function newObject(prop, value) {
        const obj = {};
        obj[prop] = value;
        return obj;
    }
    function parsePercentSize(sv, enableNull, def) {
        let fixed;
        let size;
        if (sv != null && !Number.isNaN(sv)) {
            if (!(fixed = !isNaN(size = +sv))) {
                const s = sv.trim();
                const c = s.charCodeAt(s.length - 1);
                if (c === PERCENT) {
                    size = s.length === 1 ? NaN : parseFloat(s);
                }
                if (isNaN(size)) {
                    if (enableNull) {
                        return null;
                    }
                    throwFormat(locale.invalidSizeValue, sv);
                }
            }
        }
        else if (enableNull) {
            return null;
        }
        else {
            size = def || 0;
            fixed = true;
        }
        return { size, fixed };
    }
    function parsePercentSize2(sv, def) {
        return parsePercentSize(sv, true) || parsePercentSize(def, false);
    }
    function calcPercent(size, domain) {
        return size ? (size.fixed ? size.size : size.size * domain / 100) : NaN;
    }
    class AssertionError extends Error {
    }
    const assert = function (predict, message) {
        if (!predict) {
            throw new AssertionError(message);
        }
    };
    var RtDirection;
    (function (RtDirection) {
        RtDirection["UP"] = "up";
        RtDirection["DOWN"] = "down";
        RtDirection["LEFT"] = "left";
        RtDirection["RIGHT"] = "right";
    })(RtDirection || (RtDirection = {}));
    const formatMessage = (str, value) => {
        return str.replace('%1', value);
    };
    const throwFormat = (format, value) => {
        throw new Error(formatMessage(format, value));
    };
    var Align;
    (function (Align) {
        Align["LEFT"] = "left";
        Align["CENTER"] = "center";
        Align["RIGHT"] = "right";
    })(Align || (Align = {}));
    var VerticalAlign;
    (function (VerticalAlign) {
        VerticalAlign["TOP"] = "top";
        VerticalAlign["MIDDLE"] = "middle";
        VerticalAlign["BOTTOM"] = "bottom";
    })(VerticalAlign || (VerticalAlign = {}));
    var SectionDir;
    (function (SectionDir) {
        SectionDir[SectionDir["LEFT"] = 0] = "LEFT";
        SectionDir[SectionDir["TOP"] = 1] = "TOP";
        SectionDir[SectionDir["BOTTOM"] = 2] = "BOTTOM";
        SectionDir[SectionDir["RIGHT"] = 3] = "RIGHT";
    })(SectionDir || (SectionDir = {}));
    const HORZ_SECTIONS = [SectionDir.LEFT, SectionDir.RIGHT];
    const VERT_SECTIONS = [SectionDir.TOP, SectionDir.BOTTOM];

    let _dom_id_ = 651212;
    class Dom {
        static getWin(doc) {
            return doc.defaultView || doc['parentWindow'];
        }
        static isVisible(elt) {
            return elt && elt.style.display !== 'none';
        }
        static setVisible(elt, visible, visibleStyle = '') {
            elt.style.display = visible ? (visibleStyle || '') : 'none';
            return visible;
        }
        static hide(elt) {
            elt.style.display = 'none';
        }
        static show(elt, visibleStyle = '') {
            elt.style.display = visibleStyle;
        }
        static addClass(elt, className) {
            if (className) {
                const classes = className.split(/\s+/g);
                classes.forEach(c => elt.classList.add(c));
            }
            return elt;
        }
        static removeClass(elt, className) {
            if (className) {
                const classes = className.split(/\s+/g);
                classes.forEach(c => elt.classList.remove(c));
            }
            return elt;
        }
        static getImageUrl(css) {
            const url = css.backgroundImage;
            if (url && url.startsWith('url("')) {
                return url.substring(5, url.length - 2);
            }
        }
        static getFocused() {
            const sel = document.getSelection();
            let node = sel.focusNode;
            while (node) {
                if (node instanceof HTMLElement)
                    return node;
                node = node.parentElement;
            }
        }
        static isAncestorOf(elt, child) {
            let p = child;
            while (p) {
                if (p == elt) {
                    return true;
                }
                p = p.parentElement;
            }
            return false;
        }
        static getOffset(elt) {
            const doc = elt.ownerDocument;
            const win = doc.defaultView;
            const box = elt.getBoundingClientRect();
            const body = doc.body;
            const docElem = doc.documentElement;
            const scrollTop = win.pageYOffset || docElem.scrollTop || body.scrollTop;
            const scrollLeft = win.pageXOffset || docElem.scrollLeft || body.scrollLeft;
            const clientTop = docElem.clientTop || body.clientTop || 0;
            const clientLeft = docElem.clientLeft || body.clientLeft || 0;
            const x = box.left + scrollLeft - clientLeft;
            const y = box.top + scrollTop - clientTop;
            return { x: Math.round(x), y: Math.round(y) };
        }
        static getSize(elt) {
            const r = elt.getBoundingClientRect();
            return { width: r.width, height: r.height };
        }
        static moveX(elt, x) {
            elt.style.left = x + 'px';
        }
        static moveY(elt, y) {
            elt.style.top = y + 'px';
        }
        static move(elt, x, y) {
            elt.style.left = x + 'px';
            elt.style.top = y + 'px';
        }
        static moveI(elt, x, y) {
            elt.style.left = (x >>> 0) + 'px';
            elt.style.top = (y >>> 0) + 'px';
        }
        static resize(elt, width, height) {
            elt.style.width = width + 'px';
            elt.style.height = height + 'px';
        }
        static resizeSVG(elt, width, height) {
            elt.setAttribute('viewBox', `0 0 ${width} ${height}`);
        }
        static setWidth(elt, width) {
            elt.style.width = width + 'px';
        }
        static setHeight(elt, height) {
            elt.style.height = height + 'px';
        }
        static getBrowserSize(elt) {
            const doc = elt ? elt.ownerDocument : document;
            const win = doc.defaultView;
            return {
                width: win.innerWidth || doc.documentElement.clientWidth || doc.body.clientWidth,
                height: win.innerHeight || doc.documentElement.clientHeight || doc.body.clientHeight
            };
        }
        static setRect(elt, r) {
            const style = elt.style;
            style.left = r.x + 'px';
            style.top = r.y + 'px';
            style.width = r.width + 'px';
            style.height = r.height + 'px';
        }
        static setBounds(elt, x, y, w, h) {
            const style = elt.style;
            style.left = x + 'px';
            style.top = y + 'px';
            style.width = w + 'px';
            style.height = h + 'px';
        }
        static setBoundsEx(elt, x, y, w, h) {
            const style = elt.style;
            !isNaN(x) && (style.left = x + 'px');
            !isNaN(y) && (style.top = y + 'px');
            !isNaN(x) && (style.width = w + 'px');
            !isNaN(x) && (style.height = h + 'px');
        }
        static getClientRect(elt) {
            const r = elt.getBoundingClientRect();
            r["cx"] = elt.offsetLeft;
            r["cy"] = elt.offsetTop;
            return r;
        }
        static getChildIndex(elt) {
            if (elt) {
                const parent = elt.parentNode;
                if (parent) {
                    const childs = parent.children;
                    for (let i = childs.length; i--;) {
                        if (childs[i] === elt) {
                            return i;
                        }
                    }
                }
            }
            return -1;
        }
        static clearChildren(parent) {
            let elt;
            while (elt = parent.lastChild) {
                parent.removeChild(elt);
            }
        }
        static clearElements(parent) {
            let elt;
            while (elt = parent.lastChild) {
                Dom.clearElements(elt);
                parent.removeChild(elt);
            }
        }
        static append(elt, child) {
            child.parentNode !== elt && elt.appendChild(child);
        }
        static addChild(elt, child) {
            if (elt && child && child.parentNode !== elt) {
                elt.appendChild(child);
                return true;
            }
            return false;
        }
        static removeChild(elt, child) {
            if (elt && child && child.parentNode === elt) {
                elt.removeChild(child);
                return true;
            }
            return false;
        }
        static removeChildren(elt, children) {
            children.forEach(child => {
                if (child instanceof Element) {
                    if (child.parentNode === elt) {
                        elt.removeChild(child);
                    }
                }
                else if (child && child.dom().parentNode == elt) {
                    elt.removeChild(child.dom());
                }
            });
        }
        static remove(elt) {
            const p = elt && elt.parentElement;
            p && p.removeChild(elt);
            return null;
        }
        static clearStyle(elt) {
            elt.style.cssText = '';
        }
        static htmlEncode(text) {
            return document.createElement('a').appendChild(document.createTextNode(text)).parentNode["innerHTML"];
        }
        static setData(elt, name, value) {
            if (value == null || value === '') {
                delete elt.dataset[name];
            }
            else {
                elt.dataset[name] = value;
            }
        }
        static toggleData(elt, name, value) {
            if (value) {
                elt.dataset[name] = '1';
            }
            else {
                delete elt.dataset[name];
            }
        }
        static getData(elt, name) {
            return elt.dataset[name];
        }
        static hasData(elt, name) {
            return elt.dataset[name] !== void 0;
        }
        static setVar(elt, name, value) {
            elt.style.setProperty(name, value);
        }
        static animate(elt, prop, from, to, duration = 150, fill = 'none') {
            const frame1 = {};
            const frame2 = {};
            frame1[prop] = from;
            frame2[prop] = to;
            return elt.animate([
                frame1, frame2
            ], {
                duration: duration,
                fill: fill
            });
        }
        static setAttr(elt, attr, value) {
            if (value != null && value !== '') {
                elt.setAttribute(attr, value);
            }
            else {
                elt.removeAttribute(attr);
            }
        }
        static setAttrs(elt, attrs) {
            for (const attr in attrs) {
                elt.setAttribute(attr, attrs[attr]);
            }
        }
        static getDomId() {
            return '-rtc-' + _dom_id_++;
        }
        static stopAnimation(ani) {
            if (ani) {
                try {
                    ani.finish();
                }
                catch (e) {
                    RtDebug.debugging();
                    console.error(e);
                }
            }
            return null;
        }
        static childByPath(dom, path) {
            let node = dom;
            if (path) {
                let i = 0;
                while (i < path.length) {
                    node = node.childNodes[path[i++]];
                }
            }
            return node;
        }
        static childByClass(parent, className) {
            return parent.getElementsByClassName(className)[0];
        }
        static setDisabled(dom, value) {
            this.setAttr(dom, 'disabled', value ? true : void 0);
        }
        static setImportantStyle(css, property, value) {
            css.setProperty(property, value, 'important');
        }
    }

    const __epoch = new Date().getTime();
    if (!Element.prototype.animate) {
        Element.prototype.animate = function (_) { };
    }
    const _isOpera = !!window["opera"] || navigator.userAgent.indexOf(' OPR/') >= 0;
    const _isChrome = !!window["chrome"] && !_isOpera;
    Object.prototype.toString.call(HTMLElement).indexOf('Constructor') > 0 || (!_isChrome && !_isOpera && navigator.userAgent.indexOf("Safari") >= 0);
    navigator.userAgent.toLocaleLowerCase().indexOf('samsungbrowser') >= 0;
    navigator.userAgent.toLocaleLowerCase().indexOf('miuibrowser') >= 0;
    const DBL_QUOTE_REP = /"([^"]*(?="))"/;
    const QUOTE_REP = /'([^']*(?='))'/;
    const DBL_QUOTE = '"'.charCodeAt(0);
    const QUOTE = "'".charCodeAt(0);
    class Utils {
        static now() {
            return +new Date();
        }
        static stopEvent(e, immediate = false) {
            if (e.preventDefault) {
                e.preventDefault();
                e.stopPropagation();
            }
            else {
                e.returnValue = false;
            }
            immediate && e.stopImmediatePropagation();
        }
        static getErrorStack(error) {
            const stack = error.stack;
            if (stack) {
                return stack.split('\n').map((line) => line + '<br/>');
            }
            return '';
        }
        static getBaseClassName(obj) {
            return Object.getPrototypeOf(obj.constructor).name;
        }
        static isObject(v) {
            return v && typeof v === 'object' && !isArray(v);
        }
        static assign(target, source) {
            this.isObject(source) && Object.assign(target, source);
        }
        static isValidObject(v) {
            if (this.isObject(v)) {
                for (let p in v) {
                    if (v.hasOwnProperty(p))
                        return true;
                }
            }
        }
        static copyObject(v) {
            if (v && typeof v === 'object' && !isArray(v)) {
                return Object.assign({}, v);
            }
        }
        static checkArray(v) {
            return isArray(v) ? v : void 0;
        }
        static makeArray(v, force = false) {
            if (v != null) {
                return isArray(v) ? v : [v];
            }
            else if (force) {
                return [];
            }
        }
        static makeNumArray(v) {
            if (isArray(v)) {
                return v.map(n => +n);
            }
            else {
                return v != null ? [+v] : [];
            }
        }
        static getIntArray(count, start = 0) {
            const arr = [];
            for (let i = start, end = start + count; i < end; i++) {
                arr.push(i);
            }
            return arr;
        }
        static isValueArray(arr) {
            if (isArray(arr)) {
                for (let i = arr.length - 1; i >= 0; i--) {
                    if (arr[i] != null && typeof arr[i] === 'object')
                        return false;
                }
                return true;
            }
            return false;
        }
        static toArray(v) {
            if (isArray(v))
                return v;
            if (v !== undefined && v !== null)
                return [v];
            return null;
        }
        static copyArray(v) {
            if (isArray(v))
                return v.slice(0);
            if (v !== undefined && v !== null)
                return [v];
            return undefined;
        }
        static push(arr, items) {
            if (items && items.length > 0) {
                for (let i = 0, n = items.length; i < n; i++) {
                    arr.push(items[i]);
                }
            }
        }
        static isDefined(v) {
            return v != null;
        }
        static isNotDefined(v) {
            return v == null;
        }
        static isNumber(value) {
            return typeof value === "number";
        }
        static isValidNumber(value) {
            return typeof value === 'number' && !isNaN(value) && isFinite(value);
        }
        static getNumber(v, def = 0) {
            const n = parseFloat(v);
            return isFinite(n) ? n : def;
        }
        static toNumber(value, def = 0) {
            return (isNaN(value) || value === null || value === '') ? def : +value;
        }
        static getEnumValues(type) {
            return Object.keys(type).map(key => type[key]);
        }
        static checkEnumValue(type, value, def) {
            const keys = Object.keys(type);
            for (let i = keys.length - 1; i >= 0; i--) {
                if (type[keys[i]] === value)
                    return value;
            }
            return def;
        }
        static compareText(s1, s2, ignoreCase = false) {
            s1 = s1 || '';
            s2 = s2 || '';
            if (ignoreCase) {
                s1 = s1.toLocaleLowerCase();
                s2 = s2.toLocaleLowerCase();
            }
            return s1 > s2 ? 1 : (s1 < s2) ? -1 : 0;
        }
        static getTimeF() {
            return new Date().getTime() / 1000;
        }
        static getTimer() {
            return new Date().getTime() - __epoch;
        }
        static isWhiteSpace(s) {
            return !s || !s.trim();
        }
        static pad(value, len, c) {
            len = Math.max(len || 2, 1);
            c = c || '0';
            return new Array(len - String(value).length + 1).join(c) + value;
        }
        static pad16(value, len, c) {
            len = Math.max(len || 2, 1);
            c = c || '0';
            return new Array(len - value.toString(16).length + 1).join(c) + value.toString(16);
        }
        static pick(...args) {
            const len = args.length;
            let v;
            for (let i = 0; i < len; i++) {
                v = args[i];
                if (v !== undefined && v !== null) {
                    return v;
                }
            }
            return undefined;
        }
        static pickNum(...args) {
            const len = args.length;
            for (let i = 0; i < len; i++) {
                if (!isNaN(args[i]) && args[i] !== null)
                    return args[i];
            }
            return NaN;
        }
        static included(value, ...args) {
            const len = args.length;
            for (let i = 0; i < len; i++) {
                if (args[i] == value) {
                    return true;
                }
            }
            return false;
        }
        static compareTextValue(v1, v2, caseSensitive, partialMatch) {
            if (v1 === v2) {
                return true;
            }
            let s1 = String(v1);
            let s2 = v2 == null ? undefined : String(v2);
            if (!s1 && !s2) {
                return true;
            }
            if (!s1 || !s2) {
                return false;
            }
            if (!caseSensitive) {
                s1 = s1.toLowerCase();
                s2 = s2.toLowerCase();
            }
            if (partialMatch) {
                return s2.indexOf(s1) >= 0;
            }
            else {
                return s1 == s2;
            }
        }
        static cast(obj, clazz) {
            return obj instanceof clazz ? obj : null;
        }
        static irandom(min, max) {
            if (max !== undefined) {
                const v1 = min >> 0;
                const v2 = max >> 0;
                return (Math.random() * (v2 - v1) + v1) >>> 0;
            }
            else {
                const v = min >> 0;
                return (Math.random() * v) >> 0;
            }
        }
        static irandomExcept(except, min, max) {
            if (except === 0 && min === 1 && isNaN(max)) {
                throw new Error(`Invalid irandom2`);
            }
            while (true) {
                const i = this.irandom(min, max);
                if (i !== except) {
                    return i;
                }
            }
        }
        static brandom() {
            return Math.random() > 0.5 ? true : false;
        }
        static srandom(min, max) {
            let s = '';
            const len = this.irandom(min, max);
            for (let i = 0; i < len; i++) {
                s += String.fromCharCode(this.irandom(97, 123));
            }
            return s;
        }
        static erandom(clazz) {
            const vals = Object.values(clazz);
            return vals[this.irandom(vals.length)];
        }
        static arandom(arr) {
            return arr[(Math.random() * arr.length) >> 0];
        }
        static iarandom(min, max, count) {
            const list = new Array();
            for (let i = min; i < max; i++) {
                list.push(i);
            }
            while (list.length > count) {
                list.splice(Utils.irandom(list.length), 1);
            }
            return list;
        }
        static alert(message) {
            window.alert(message);
        }
        static toInt(v, radix) {
            const n = parseInt(v, radix || 10);
            return isNaN(n) ? 0 : n;
        }
        static toFloat(v) {
            const n = parseFloat(v);
            return isNaN(n) ? 0 : n;
        }
        static toEven(v) {
            return (v & 1) ? v + 1 : v;
        }
        static hex(value, len = 2, c = "0") {
            len = Math.max(len || 2, 1);
            const s = value.toString(16);
            c = c || "0";
            return new Array(len - s.length + 1).join(c) + s;
        }
        static toStr(value) {
            if (Number.isNaN(value)) {
                return '';
            }
            else {
                return value == null ? '' : String(value);
            }
        }
        static extend(target, source) {
            target = target || {};
            for (let p in source) {
                target[p] = source[p];
            }
            return target;
        }
        static equalNumbers(a, b) {
            return isNaN(a) == isNaN(b) && !isNaN(a) && a == b;
        }
        static equalArrays(a, b) {
            if (a === b)
                return true;
            if (a == null || b == null)
                return false;
            const len = a.length;
            if (len != b.length)
                return false;
            for (let i = 0; i < len; ++i) {
                if (a[i] !== b[i])
                    return false;
            }
            return true;
        }
        static equalObjects(obj1, obj2) {
            if (obj1 === obj2)
                return true;
            if (!obj1 && !obj2)
                return true;
            if (!obj1 || !obj2)
                return false;
            for (var p in obj1) {
                if (obj1.hasOwnProperty(p)) {
                    if (obj1[p] !== obj2[p]) {
                        return false;
                    }
                }
            }
            for (var p in obj2) {
                if (obj2.hasOwnProperty(p)) {
                    if (obj1[p] !== obj2[p]) {
                        return false;
                    }
                }
            }
            return true;
        }
        static parseDate(date, defaultDate) {
            const d = new Date(date);
            return isNaN(d.getTime()) ? (defaultDate || new Date()) : d;
        }
        static isLeapYear(year) {
            return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
        }
        static incMonth(d, delta) {
            const day = d.getDate();
            d.setDate(1);
            d.setMonth(d.getMonth() + delta);
            d.setDate(Math.min(day, Utils.month_days[Utils.isLeapYear(d.getFullYear()) ? 1 : 0][d.getMonth()]));
            return d;
        }
        static minDate(d1, d2) {
            if (d1 !== null)
                return d1;
            if (d2 !== null)
                return d2;
            return d1.getTime() < d2.getTime() ? d1 : d2;
        }
        static maxDate(d1, d2) {
            if (d1 !== null)
                return d2;
            if (d2 !== null)
                return d1;
            return d1.getTime() > d2.getTime() ? d1 : d2;
        }
        static getTextLength2(s) {
            let b = 0, i = 0, c = 0;
            for (; c = s.charCodeAt(i++); b += c >> 7 ? 2 : 1)
                ;
            return b;
        }
        static getClassName(model) {
            function getFuncName(clazz) {
                let ret = clazz.toString();
                ret = ret.substring('function '.length);
                ret = ret.substring(0, ret.indexOf('('));
                return ret;
            }
            if (model && model.constructor) {
                return model.constructor.name || getFuncName(model.constructor);
            }
        }
        static isInteger(value) {
            if (Number.isInteger)
                return Number.isInteger(value);
            return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
        }
        static isEmpty(obj) {
            if (obj) {
                for (let p in obj) {
                    return false;
                }
            }
            return true;
        }
        static isNotEmpty(obj) {
            if (obj) {
                for (let p in obj) {
                    return true;
                }
            }
            return false;
        }
        static capitalize(s) {
            if (typeof s !== 'string')
                return '';
            const c = s.charAt(0);
            if (c >= 'A' && c <= 'Z')
                return s;
            return c.toUpperCase() + s.slice(1);
        }
        static uncapitalize(s) {
            if (typeof s !== 'string')
                return '';
            const c = s.charAt(0);
            if (c >= 'a' && c <= 'z')
                return s;
            return c.toLowerCase() + s.slice(1);
        }
        static labelize(s) {
            if (typeof s !== 'string')
                return '';
            const c = s.charAt(0);
            s = (c >= 'A' && c <= 'Z') ? s : (c.toUpperCase() + s.slice(1));
            let s2 = s.charAt(0);
            for (let i = 1; i < s.length; i++) {
                const c = s.charAt(i);
                if (c >= 'A' && c <= 'Z') {
                    s2 += ' ';
                }
                s2 += c;
            }
            return s2;
        }
        static deepClone(obj) {
            if (obj instanceof Date) {
                return new Date(obj);
            }
            else if (obj == null || typeof obj !== 'object') {
                return obj;
            }
            else {
                const result = isArray(obj) ? [] : {};
                for (let key of Object.keys(obj)) {
                    result[key] = Utils.deepClone(obj[key]);
                }
                return result;
            }
        }
        static getArray(length, value) {
            const arr = [];
            for (let i = 0; i < length; i++)
                arr.push(value);
            return arr;
        }
        static getNumArray(length, value = 0) {
            const arr = [];
            for (let i = 0; i < length; i++)
                arr.push(value);
            return arr;
        }
        static hasSetter(obj, prop) {
            while (obj) {
                const pd = Reflect.getOwnPropertyDescriptor(obj, prop);
                if (pd)
                    return pd.writable || !!pd.set;
                obj = Object.getPrototypeOf(obj);
            }
            return false;
        }
        static dataUriToBinary(dataUri) {
            const BASE64_MARKER = ';base64,';
            const base64Index = dataUri.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
            const base64 = dataUri.substring(base64Index);
            const raw = window.atob(base64);
            const rawLength = raw.length;
            const array = new Uint8Array(new ArrayBuffer(rawLength));
            for (let i = 0; i < rawLength; i++) {
                array[i] = raw.charCodeAt(i);
            }
            return array;
        }
        static assignProps(target, source) {
            let changed = false;
            if (source) {
                for (let p in source) {
                    if (source[p] !== target[p]) {
                        target[p] = source[p];
                        changed = true;
                    }
                }
            }
            return changed;
        }
        static assignStyleAndProps(target, source) {
            let changed = false;
            if (source) {
                for (let p in source) {
                    if (p === 'style') {
                        target[p] = source[p];
                        changed = true;
                    }
                    else if (target.hasOwnProperty(p)) {
                        target[p] = source[p];
                        changed = true;
                    }
                }
            }
            return changed;
        }
        static dedupe(list, comparer) {
            list = list.sort(comparer || ((n1, n2) => n1 > n2 ? 1 : n1 < n2 ? -1 : 0));
            for (let i = list.length - 1; i > 0; i--) {
                if (list[i] === list[i - 1]) {
                    list.splice(i, 1);
                }
            }
            return list;
        }
        static isUnique(list, comparer) {
            list = list.sort(comparer || ((n1, n2) => n1 > n2 ? 1 : n1 < n2 ? -1 : 0));
            for (let i = list.length - 1; i > 0; i--) {
                if (list[i] === list[i - 1]) {
                    return false;
                }
            }
            return true;
        }
        static sortNum(list) {
            return list.sort((n1, n2) => n1 - n2);
        }
        static logElapsed(message, runner) {
            const t = +new Date();
            runner();
            console.log(message, (+new Date() - t) + 'ms');
        }
        static clamp(v, min, max) {
            if (!isNaN(max))
                v = Math.min(v, max);
            if (!isNaN(min))
                v = Math.max(v, min);
            return v;
        }
        static splice(array, start, deleteCount, items) {
            const args = [start, deleteCount].concat(items);
            Array.prototype.splice.apply(array, args);
        }
        static makeIntArray(from, to) {
            const arr = new Array(Math.max(0, to - from));
            for (let i = from; i < to; i++) {
                arr[i - from] = i;
            }
            return arr;
        }
        static setInterval(handler, interval) {
            return setInterval(handler, interval);
        }
        static clearInterval(handle) {
            clearInterval(handle);
        }
        static isStringArray(value) {
            return isArray(value) && value.every(v => typeof v === 'string');
        }
        static isNumberArray(value) {
            return isArray(value) && value.every(v => typeof v === 'number');
        }
        static makeLineSeparator(pattern) {
            if (isArray(pattern)) {
                if (pattern.length > 0) {
                    let s = pattern[0];
                    for (let i = 1, n = pattern.length; i < n; i++) {
                        s += '|' + pattern[i];
                    }
                    return new RegExp(s, 'g');
                }
            }
            else if (pattern) {
                return new RegExp(pattern, 'g');
            }
        }
        static stripQuotes(s) {
            const c = s.charCodeAt(0);
            if (c === DBL_QUOTE) {
                s = s.replace(DBL_QUOTE_REP, "$1");
            }
            else if (c === QUOTE) {
                s = s.replace(QUOTE_REP, "$1");
            }
            return s;
        }
        static isDate(v) {
            return Object.prototype.toString.call(v) === '[object Date]';
        }
        static isValidDate(d) {
            return d.getTime() === d.getTime();
        }
        static asFunction(fn) {
            return typeof fn === 'function' ? fn : void 0;
        }
        static getFieldProp(field) {
            const p = field.indexOf('.');
            if (p >= 0) {
                return { field: field.substring(0, p), props: field.substring(p + 1).split('.') };
            }
        }
        static watch() {
            return new Stopwatch();
        }
        static startsWith(str, search) {
            if (str && search) {
                return str.indexOf(search) === 0;
            }
        }
        static endsWith(str, search) {
            if (str && search) {
                return str.indexOf(search, -str.length) === (str.length - search.length);
            }
        }
        static scaleNumber(value, symbols, force) {
            const abs = Math.abs(value);
            if (abs >= 1000) {
                let i = symbols.length - 1;
                while (i) {
                    const m = Math.pow(1000, i--);
                    const v = Math.pow(10, Math.log(abs) * Math.LOG10E);
                    if (m <= v && (force || (abs * 10) % m === 0)) {
                        return { value: value / m, symbol: symbols[i] };
                    }
                }
            }
        }
        static isNorth(angle, off = 0.1) {
            const a = Math.PI * 1.5;
            if (angle < 0)
                angle += Math.PI * 2;
            return angle >= a - off && angle <= a + off;
        }
        static isSouth(angle, off = 0.1) {
            const a = Math.PI * .5;
            return angle >= a - off && angle <= a + off;
        }
        static isLeft(angle) {
            return angle > Math.PI * .5 && angle < Math.PI * 1.5;
        }
    }
    Utils.week_days = [
        '일', '월', '화', '수', '목', '금', '토'
    ];
    Utils.month_days = [
        [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    ];
    Utils.uniqueKey = (function () {
        let hash = Math.random().toString(36).substring(2, 9) + '-';
        let id = 0;
        return function () {
            return 'rr-chart-' + hash + id++;
        };
    }());
    class Stopwatch {
        constructor() {
            this._started = +new Date();
        }
        elapsed(reset = false) {
            const e = +new Date() - this._started;
            reset && (this._started = +new Date());
            return e;
        }
        elapsedText(reset = false, suffix = 'ms.') {
            return this.elapsed(reset) + suffix;
        }
    }

    function toSize(r) {
        return { width: r.width, height: r.height };
    }
    function isValidRect(r) {
        return !isNaN(r.x) && !isNaN(r.y) && !isNaN(r.width) && !isNaN(r.height);
    }
    class Rectangle {
        static create(x, y, width, height) {
            if (Utils.isObject(x)) {
                return new Rectangle(x.x, x.y, x.width, x.height);
            }
            else if (isNull(y)) {
                return new Rectangle(x, x, x, x);
            }
            else if (isNull(width)) {
                return new Rectangle(x, y, x, y);
            }
            else {
                return new Rectangle(x, y, width, height);
            }
        }
        constructor(x = 0, y = 0, width = 0, height = 0) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        get left() {
            return this.x;
        }
        set left(value) {
            const dx = value - this.x;
            this.x += dx;
            this.width -= dx;
        }
        get right() {
            return this.x + this.width;
        }
        set right(value) {
            const dx = value - (this.x + this.width);
            this.width += dx;
        }
        get top() {
            return this.y;
        }
        set top(value) {
            const dy = value - this.y;
            this.y += dy;
            this.height -= dy;
        }
        get bottom() {
            return this.y + this.height;
        }
        set bottom(value) {
            const dy = value - (this.y + this.height);
            this.height += dy;
        }
        get isEmpty() {
            return this.width === 0 || this.height === 0;
        }
        get isValid() {
            return isValidRect(this);
        }
        clone() {
            return new Rectangle(this.x, this.y, this.width, this.height);
        }
        getInner() {
            return new Rectangle(0, 0, this.width, this.height);
        }
        equals(r) {
            return r === this
                || r && this.x === r.x && this.y === r.y && this.width === r.width && this.height === r.height;
        }
        leftBy(delta) {
            this.x += delta;
            this.width -= delta;
            return this;
        }
        rightBy(delta) {
            this.width += delta;
            return this;
        }
        topBy(delta) {
            this.y += delta;
            this.height -= delta;
            return this;
        }
        bottomBy(delta) {
            this.height += delta;
            return this;
        }
        shrink(dx, dy) {
            this.width -= dx;
            this.height -= dy;
            return this;
        }
        expand(dx, dy) {
            this.width += dx;
            this.height += dy;
            return this;
        }
        contains(x, y) {
            return x >= this.x && x <= this.x + this.width
                && y >= this.y && y <= this.y + this.height;
        }
        setEmpty() {
            this.width = this.height = 0;
            return this;
        }
        move(x = 0, y = 0) {
            this.x = x;
            this.y = y;
            return this;
        }
        set(x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            return this;
        }
        setWidth(value) {
            this.width = value;
            return this;
        }
        copy(r) {
            this.x = r.x;
            this.y = r.y;
            this.width = r.width;
            this.height = r.height;
            return this;
        }
        copyHorz(r) {
            this.x = r.x;
            this.width = r.width;
            return this;
        }
        copyVert(r) {
            this.y = r.y;
            this.height = r.height;
            return this;
        }
        inflate(left = 0, top, right, bottom) {
            top = top !== undefined ? top : left;
            right = right !== undefined ? right : left;
            bottom = bottom !== undefined ? bottom : top;
            if (left)
                this.left = this.x - left;
            if (top)
                this.top = this.y - top;
            if (right)
                this.right = this.right + right;
            if (bottom)
                this.bottom = this.bottom + bottom;
            return this;
        }
        offset(dx, dy) {
            this.x += dx;
            this.y += dy;
            return this;
        }
        round() {
            const r = this.clone();
            r.x >>>= 0;
            r.y >>>= 0;
            r.width >>>= 0;
            r.height >>>= 0;
            return r;
        }
        union(r) {
            const r2 = this.clone();
            r2.left = Math.min(this.x, r.x);
            r2.right = Math.max(this.right, r.right);
            r2.top = Math.min(this.y, r.y);
            r2.bottom = Math.max(this.bottom, r.bottom);
            return r2;
        }
        normalize() {
            if (this.width < 0) {
                this.x -= this.width;
                this.width *= -1;
            }
            if (this.height < 0) {
                this.y -= this.height;
                this.height *= -1;
            }
            return this;
        }
        toString() {
            return "{x: " + this.x + ", y: " + this.y + ", width: " + this.width + ", height: " + this.height + "}";
        }
    }
    Rectangle.Empty = new Rectangle();
    Rectangle.Temp = new Rectangle();

    var Shape;
    (function (Shape) {
        Shape["CIRCLE"] = "circle";
        Shape["DIAMOND"] = "diamond";
        Shape["RECTANGLE"] = "rectangle";
        Shape["SQUARE"] = "square";
        Shape["TRIANGLE"] = "triangle";
        Shape["ITRIANGLE"] = "itriangle";
        Shape["STAR"] = "star";
    })(Shape || (Shape = {}));
    const Shapes = Utils.getEnumValues(Shape);
    const SECTOR_ERROR = 0.001;
    class SvgShapes {
        static line(x1, y1, x2, y2) {
            return ['M', x1, y1, 'L', x2, y2];
        }
        static lines(pts) {
            let i = 0;
            const vals = ['M', pts[i], pts[i + 1]];
            for (; i < pts.length; i++) {
                vals.push('L', pts[i++], pts[i]);
            }
            vals.push('Z');
            return vals;
        }
        static box(x1, y1, x2, y2) {
            return [
                'M', x1, y1,
                'L', x2, y1,
                'L', x2, y2,
                'L', x1, y2,
                'Z'
            ];
        }
        static rect(r) {
            return this.rectangle(r.x, r.y, r.width, r.height);
        }
        static rectangle(x, y, width, height) {
            return [
                'M', x, y,
                'L', x + width, y,
                'L', x + width, y + height,
                'L', x, y + height,
                'Z'
            ];
        }
        static square(x, y, width, height) {
            const sz = Math.min(width, height);
            x += (width - sz) / 2;
            y += (height - sz) / 2;
            return [
                'M', x, y,
                'L', x + sz, y,
                'L', x + sz, y + sz,
                'L', x, y + sz,
                'Z'
            ];
        }
        static circle(cx, cy, rd) {
            return [
                'M',
                cx, cy,
                'm',
                rd, 0,
                'a',
                rd, rd, 0, 1, 1, -rd * 2, 0,
                'a',
                rd, rd, 0, 1, 1, rd * 2, 0
            ];
        }
        static arc(x, y, rx, ry, start, end) {
            const cosStart = Math.cos(start);
            const sinStart = Math.sin(start);
            const cosEnd = Math.cos(end -= SECTOR_ERROR);
            const sinEnd = Math.sin(end);
            const longArc = end - start - Math.PI < SECTOR_ERROR ? 0 : 1;
            const clockwise = 1;
            const path = [];
            path.push('M', x + rx * cosStart, y + ry * sinStart, 'A', rx, ry, 0, longArc, clockwise, x + rx * cosEnd, y + ry * sinEnd, 'Z');
            return path;
        }
        static sector(cx, cy, rx, ry, rInner, start, end, clockwise) {
            const circled = Math.abs(end - start - 2 * Math.PI) < SECTOR_ERROR;
            const long = end - start - Math.PI < SECTOR_ERROR ? 0 : 1;
            const x1 = Math.cos(start);
            const y1 = Math.sin(start);
            const x2 = Math.cos(end -= circled ? SECTOR_ERROR : 0);
            const y2 = Math.sin(end);
            const cw = clockwise ? 1 : 0;
            const innerX = rx * rInner;
            const innerY = ry * rInner;
            const path = [];
            path.push('M', cx + rx * x1, cy + ry * y1, 'A', rx, ry, 0, long, cw, cx + rx * x2, cy + ry * y2);
            if (circled) {
                path.push('M', cx + innerX * x2, cy + innerY * y2);
            }
            else {
                path.push('L', cx + innerX * x2, cy + innerY * y2);
            }
            path.push('A', innerX, innerY, 0, long, 1 - cw, cx + innerX * x1, cy + innerY * y1);
            path.push('Z');
            return path;
        }
        static diamond(x, y, w, h) {
            return [
                'M', x + w / 2, y,
                'L', x + w, y + h / 2,
                'L', x + w / 2, y + h,
                'L', x, y + h / 2,
                'Z'
            ];
        }
        static triangle(x, y, w, h) {
            return [
                'M', x + w / 2, y,
                'L', x + w, y + h,
                'L', x, y + h,
                'Z'
            ];
        }
        static itriangle(x, y, w, h) {
            return [
                'M', x, y,
                'L', x + w, y,
                'L', x + w / 2, y + h,
                'Z'
            ];
        }
        static star(x, y, w, h) {
            const cx = x + w / 2;
            const cy = y + h / 2;
            const rx = w / 2;
            const ry = h / 2;
            const rx2 = w / 4;
            const ry2 = h / 4;
            const a = Math.PI * 2 / 5;
            const a2 = a / 2;
            const path = [];
            let start = -Math.PI / 2;
            path.push('M', cx + rx * Math.cos(start), cy + ry * Math.sin(start));
            for (let i = 0; i < 5; i++) {
                path.push('L', cx + rx * Math.cos(start), cy + ry * Math.sin(start));
                path.push('L', cx + rx2 * Math.cos(start + a2), cy + ry2 * Math.sin(start + a2));
                start += a;
            }
            path.push('Z');
            return path;
        }
    }

    class RcControl extends RcWrappableObject {
        constructor(doc, container, className) {
            super();
            this._inited = false;
            this._testing = false;
            this._dirty = true;
            this._invalidElements = [];
            this._toAnimation = 0;
            this._invalidateLock = false;
            this._lockDirty = false;
            this._cssVars = {};
            this.loaded = false;
            this._windowResizeHandler = (event) => {
                this._windowResized();
            };
            this._clickHandler = (ev) => {
                this._pointerHandler && this._pointerHandler.handleClick(this.toOffset(ev));
            };
            this._dblClickHandler = (event) => {
            };
            this._touchMoveHandler = (ev) => {
            };
            this._pointerDownHandler = (ev) => {
            };
            this._pointerMoveHandler = (ev) => {
                this._pointerHandler && this._pointerHandler.handleMove(this.toOffset(ev));
            };
            this._pointerUpHandler = (ev) => {
            };
            this._pointerCancelHandler = (ev) => {
            };
            this._pointerLeaveHandler = (ev) => {
            };
            this._keyPressHandler = (ev) => {
            };
            this._wheelHandler = (ev) => {
            };
            if (!doc && container instanceof HTMLDivElement) {
                doc = container.ownerDocument;
            }
            this.$_initControl(doc || document, container, className || RcControl.CLASS_NAME);
            this._resigterEventHandlers(this._dom);
            this._inited = true;
            this.invalidate(true);
        }
        _doDestory() {
            this._unresigterEventHandlers(this._dom);
            Dom.remove(this._dom);
            this._dom = null;
            this._container = null;
        }
        isInited() {
            return this._inited;
        }
        isTesting() {
            return this._testing;
        }
        doc() {
            return this._dom.ownerDocument;
        }
        dom() {
            return this._dom;
        }
        width() {
            return this._container.offsetWidth;
        }
        height() {
            return this._container.offsetHeight;
        }
        clearDefs() {
            Dom.clearChildren(this._defs);
        }
        clearTemporaryDefs() {
            const defs = this._defs;
            const childs = defs.children;
            for (let i = 0; i < childs.length; i++) {
                if (childs[i].hasAttribute(RcElement.TEMP_KEY)) {
                    defs.removeChild(childs[i]);
                }
            }
        }
        appendDom(elt) {
            elt && this._htmlRoot.append(elt);
        }
        addElement(elt) {
            elt && this._root.add(elt);
        }
        removeElement(elt) {
            this._root.removeChild(elt);
        }
        setPointerHandler(handler) {
            this._pointerHandler = handler;
        }
        invalidate(force = false) {
            if (force || !this._invalidateLock && !this._dirty && this._inited) {
                this._dirty = true;
                if (!this._requestTimer && !this._testing) {
                    this.$_requestRender();
                }
            }
            else if (this._invalidateLock) {
                this._lockDirty = true;
            }
        }
        invalidateLayout(force = false) {
            this.invalidate(force);
        }
        setLock() {
            this._invalidateLock = true;
        }
        releaseLock(validate = true) {
            if (this._invalidateLock) {
                this._invalidateLock = false;
            }
            if (this._lockDirty && validate) {
                this.invalidate();
            }
            this._lockDirty = false;
        }
        lock(func) {
            this.setLock();
            try {
                func(this);
            }
            finally {
                this.releaseLock();
            }
        }
        silentLock(func) {
            this.setLock();
            try {
                func(this);
            }
            finally {
                this.releaseLock(false);
            }
        }
        getBounds() {
            return this._dom.getBoundingClientRect();
        }
        setAnimation(to) {
            this._toAnimation = to || 0;
        }
        fling(distance, duration) {
        }
        getCssVar(name) {
            let v = this._cssVars[name];
            if (name in this._cssVars) {
                return this._cssVars[name];
            }
            else {
                v = getComputedStyle(this._root.dom).getPropertyValue(name);
                this._cssVars[name] = v;
            }
            return v;
        }
        clipBounds(x = NaN, y = NaN, width = NaN, height = NaN, rd = 0) {
            const clip = new ClipElement(this.doc(), x, y, width, height, rd, rd);
            this._defs.appendChild(clip.dom);
            return clip;
        }
        clipRect(r) {
            return this.clipBounds(r.x, r.y, r.width, r.height);
        }
        clipPath() {
            const clip = new ClipPathElement(this.doc());
            this._defs.appendChild(clip.dom);
            return clip;
        }
        addDef(element) {
            this._defs.appendChild(element);
        }
        removeDef(element) {
            if (isString(element)) {
                for (const elt in this._defs.children) {
                    if (elt instanceof Element && elt.id === element) {
                        element = elt;
                        break;
                    }
                }
            }
            element instanceof Element && this._defs.removeChild(element);
        }
        containerToElement(element, x, y) {
            const cr = this._container.getBoundingClientRect();
            const br = element.dom.getBoundingClientRect();
            return { x: x + cr.x - br.x, y: y + cr.y - br.y };
        }
        _setTesting() {
            this._testing = true;
            RcElement.TESTING = true;
        }
        _setSize(w, h) {
            if (!isNaN(w)) {
                this._container.style.width = w + 'px';
            }
            if (!isNaN(h)) {
                this._container.style.height = h + 'px';
            }
        }
        $_addListener(node, event, handler) {
            node.addEventListener(event, handler);
        }
        _resigterEventHandlers(dom) {
            window.addEventListener('resize', this._windowResizeHandler);
            this.$_addListener(dom, "click", this._clickHandler);
            this.$_addListener(dom, "dblclick", this._dblClickHandler);
            this.$_addListener(dom, "touchmove", this._touchMoveHandler);
            this.$_addListener(dom, "pointerdown", this._pointerDownHandler);
            this.$_addListener(dom, "pointermove", this._pointerMoveHandler);
            this.$_addListener(dom, "pointerup", this._pointerUpHandler);
            this.$_addListener(dom, "pointercancel", this._pointerCancelHandler);
            this.$_addListener(dom, "pointerleave", this._pointerLeaveHandler);
            this.$_addListener(dom, "keypress", this._keyPressHandler);
            this.$_addListener(dom, "wheel", this._wheelHandler);
        }
        _unresigterEventHandlers(dom) {
            window.removeEventListener('resize', this._windowResizeHandler);
            dom.removeEventListener("click", this._clickHandler);
            dom.removeEventListener("dblclick", this._dblClickHandler);
            dom.removeEventListener("touchmove", this._touchMoveHandler);
            dom.removeEventListener("pointerdown", this._pointerDownHandler);
            dom.removeEventListener("pointermove", this._pointerMoveHandler);
            dom.removeEventListener("pointerup", this._pointerUpHandler);
            dom.removeEventListener("pointercancel", this._pointerCancelHandler);
            dom.removeEventListener("pointerleave", this._pointerLeaveHandler);
            dom.removeEventListener("keypress", this._keyPressHandler);
            dom.removeEventListener("wheel", this._wheelHandler);
        }
        _prepareRenderers(dom) {
        }
        $_initControl(document, container, className) {
            if (this._inited)
                return;
            if (container instanceof HTMLDivElement) {
                this._container = container;
            }
            else {
                this._container = document.getElementById(container);
            }
            if (!(this._container instanceof HTMLDivElement)) {
                throwFormat(locale.invalidOuterDiv, container);
            }
            const doc = this._container.ownerDocument;
            const dom = this._dom = doc.createElement('div');
            Object.assign(dom.style, {
                position: 'relative',
                width: '100%',
                height: '100%',
                boxSizing: 'border-box',
                overflow: 'hidden',
                padding: '20px',
                "-webkit-touch-callout": "none",
                "-webkit-user-select": "none",
                "user-select": "none",
                "-webkit-tap-highlight-color": "rgba(0, 0, 0, 0)"
            });
            dom.className = className;
            this._container.appendChild(dom);
            const svg = this._svg = doc.createElementNS(SVGNS, 'svg');
            svg.classList.add('rct-root');
            svg.style.setProperty('overflow', 'visible', 'important');
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '100%');
            const desc = doc.createElement('desc');
            desc.textContent = 'Created by RealChart 1.0.0';
            svg.appendChild(desc);
            const defs = this._defs = doc.createElementNS(SVGNS, 'defs');
            this._initDefs(doc, defs);
            svg.appendChild(defs);
            dom.appendChild(svg);
            this._root = new RootElement(this);
            svg.appendChild(this._root['_dom']);
            this._htmlRoot = doc.createElement('div');
            dom.appendChild(this._htmlRoot);
            Object.assign(this._htmlRoot.style, {
                position: 'absolute'
            });
        }
        _initDefs(doc, defs) {
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
        _render() {
            this.$_render();
        }
        $_invalidateElement(elt) {
            this._invalidElements.push(elt);
            this.invalidate();
        }
        $_requestRender() {
            if (window.requestAnimationFrame) {
                this._requestTimer = window.requestAnimationFrame(() => this.$_render());
            }
            else {
                setTimeout(() => {
                    this.$_render();
                }, 0);
            }
        }
        updateNow() {
            this.$_render();
        }
        $_render() {
            if (+new Date() <= this._toAnimation) {
                this.$_requestRender();
                return;
            }
            console.time('render chart');
            try {
                this._doBeforeRender();
                const cr = this._dom.getBoundingClientRect();
                const sr = this._svg.getBoundingClientRect();
                const w = this._svg.clientWidth;
                const h = this._svg.clientHeight;
                this._htmlRoot.style.left = (sr.left - cr.left) + 'px';
                this._htmlRoot.style.top = (sr.top - cr.top) + 'px';
                this._doRender({ x: 0, y: 0, width: w, height: h });
                this._doRenderBackground(this._container.firstElementChild, w, h);
            }
            finally {
                this.loaded = true;
                this._dirty = false;
                this._requestTimer = null;
                this._invalidElements = [];
                this._doAfterRender();
                console.timeEnd('render chart');
            }
        }
        _doBeforeRender() { }
        _doAfterRender() { }
        _doRenderBackground(elt, width, height) { }
        _windowResized() {
            this.invalidateLayout();
        }
        toOffset(event) {
            const r = this._container.getBoundingClientRect();
            event.pointX = event.clientX - r.left;
            event.pointY = event.clientY - r.top;
            return event;
        }
    }
    RcControl.CLASS_NAME = 'rct-control';
    RcControl.SHADOW_FILTER = 'rr-chart-shadow-filter';
    class RcElement extends RcObject {
        constructor(doc, styleName, tag = _undefined) {
            super();
            this._visible = true;
            this._zIndex = 0;
            this._scaleX = 1;
            this._scaleY = 1;
            this._rotation = 0;
            this._styles = {};
            this._styleDirty = false;
            this._dom = doc.createElementNS(SVGNS, tag || 'g');
            (this._styleName = styleName) && this.setAttr('class', styleName);
        }
        _doDestory() {
            this.remove();
        }
        get doc() {
            return this._dom.ownerDocument;
        }
        get dom() {
            return this._dom;
        }
        get parent() {
            return this._parent;
        }
        get control() {
            return this._parent && this._parent.control;
        }
        get zIndex() {
            return this._zIndex;
        }
        set zIndex(value) {
            if (value !== this._zIndex) {
                this._zIndex = value;
            }
        }
        get x() {
            return this._x;
        }
        set x(value) {
            if (value !== this._x) {
                this._x = value;
                this.setAttr('x', this._x);
            }
        }
        get tx() {
            return this._translateX;
        }
        get y() {
            return this._x;
        }
        set y(value) {
            if (value !== this._y) {
                this._y = value;
                this.setAttr('y', this._y);
            }
        }
        get ty() {
            return this._translateY;
        }
        get width() {
            return this._width;
        }
        set width(value) {
            if (value !== this._width) {
                this._width = value;
                this.setAttr('width', isNaN(value) ? '' : value);
            }
        }
        get height() {
            return this._height;
        }
        set height(value) {
            if (value !== this._height) {
                this._height = value;
                this.setAttr('height', isNaN(value) ? '' : value);
            }
        }
        get visible() {
            return this._visible;
        }
        set visible(value) {
            this.setVisible(value);
        }
        setVisible(value) {
            if (value !== this._visible) {
                this._visible = value;
                if (this._dom) {
                    this._dom.style.display = this._visible ? '' : 'none';
                }
            }
            return this._visible;
        }
        get rotation() {
            return this._rotation;
        }
        set rotation(value) {
            if (value != this._rotation) {
                this._rotation = value;
                this._updateTransform();
            }
        }
        setRotaion(originX, originY, rotation) {
            if (originX !== this._originX || originY !== this._originY || rotation !== this._rotation) {
                this._originX = originX;
                this._originY = originY;
                this._rotation = rotation;
                this._updateTransform();
            }
            return this;
        }
        getStyle(prop) {
            return window.getComputedStyle(this._dom).getPropertyValue(prop);
        }
        hasStyle(className) {
            return this.dom.classList.contains(className);
        }
        add(child) {
            if (child && child._parent !== this) {
                child._parent = this;
                this._dom.appendChild(child._dom);
                child._doAttached(this);
            }
            return child;
        }
        insertChild(child, before) {
            if (child && child._parent !== this) {
                child._parent = this;
                this._dom.insertBefore(child._dom, before._dom);
                child._doAttached(this);
            }
            return child;
        }
        insertFirst(child) {
            if (child && child._parent !== this) {
                child._parent = this;
                this._dom.insertBefore(child._dom, this._dom.firstChild);
                child._doAttached(this);
            }
            return child;
        }
        removeChild(child) {
            if (child && child._parent === this) {
                this._dom.removeChild(child._dom);
                child._parent = null;
                child._doDetached(this);
            }
        }
        remove() {
            this._parent && this._parent.removeChild(this);
            return this;
        }
        appendElement(doc, tag) {
            const elt = doc.createElementNS(SVGNS, tag);
            this._dom.appendChild(elt);
            return elt;
        }
        insertElement(doc, tag, before) {
            const elt = doc.createElementNS(SVGNS, tag);
            this._dom.insertBefore(elt, before);
            return elt;
        }
        getAttr(attr) {
            return this.dom.getAttribute(attr);
        }
        setAttr(attr, value) {
            this.dom.setAttribute(attr, value);
            return this;
        }
        setAttrs(attrs) {
            for (let attr in attrs) {
                this.dom.setAttribute(attr, attrs[attr]);
            }
            return this;
        }
        unsetAttr(attr) {
            this.dom.removeAttribute(attr);
            return this;
        }
        setBounds(x, y, width, height) {
            this.translate(x, y);
            this.resize(width, height);
            return this;
        }
        setRect(rect) {
            this.translate(rect.x, rect.y);
            this.resize(rect.width, rect.height);
            return this;
        }
        getRect() {
            return Rectangle.create(this._translateX, this._translateY, this.width, this.height);
        }
        getSize() {
            return { width: this.width, height: this.height };
        }
        getBBounds() {
            return this._dom.getBBox();
        }
        controlToElement(x, y) {
            return this.control.containerToElement(this, x, y);
        }
        move(x, y) {
            this.x = x;
            this.y = y;
            return this;
        }
        translate(x, y) {
            if (x !== this._translateX || y !== this._translateY) {
                if (Utils.isValidNumber(x))
                    this._translateX = x;
                if (Utils.isValidNumber(y))
                    this._translateY = y;
                this._updateTransform();
            }
            return this;
        }
        translateX(x) {
            if (x !== this._translateX) {
                if (Utils.isValidNumber(x))
                    this._translateX = x;
                this._updateTransform();
            }
            return this;
        }
        translateY(y) {
            if (y !== this._translateY) {
                if (Utils.isValidNumber(y))
                    this._translateY = y;
                this._updateTransform();
            }
            return this;
        }
        resize(width, height, attr = true) {
            if (width !== this._width) {
                attr && this.setAttr('width', this._width = width);
            }
            if (height !== this._height) {
                attr && this.setAttr('height', this._height = height);
            }
            return this;
        }
        appendDom(dom) {
            dom && this._dom.appendChild(dom);
            return dom;
        }
        insertDom(dom, before) {
            dom && this._dom.insertBefore(dom, before);
            return dom;
        }
        clearDom() {
            const dom = this._dom;
            let child;
            while (child = dom.lastChild) {
                dom.removeChild(child);
            }
        }
        clearStyles() {
            const css = this.dom.style;
            let changed = false;
            for (let p in this._styles) {
                css.removeProperty(p);
                changed = true;
            }
            this._styles = {};
            if (changed)
                this._styleDirty = true;
            return changed;
        }
        clearStyle(props) {
            let changed = false;
            if (props) {
                const css = this.dom.style;
                for (let p of props) {
                    if (p in this._styles) {
                        css.removeProperty(p);
                        delete this._styles[p];
                        changed = true;
                    }
                }
                if (changed)
                    this._styleDirty = true;
            }
            return changed;
        }
        setStyles(styles) {
            let changed = false;
            if (styles) {
                const css = this.dom.style;
                for (let p in styles) {
                    if (this._styles[p] !== styles[p]) {
                        css[p] = this._styles[p] = styles[p];
                        changed = true;
                    }
                }
                if (changed)
                    this._styleDirty = true;
            }
            return changed;
        }
        resetStyles(styles) {
            const r = this.clearStyles();
            return this.setStyles(styles) || r;
        }
        _resetClass() {
            this._styleName ? this.setAttr('class', this._styleName) : this.unsetAttr('class');
        }
        clearStyleAndClass() {
            this.clearStyles();
            this._resetClass();
        }
        setStyleOrClass(style) {
            if (isString(style)) {
                this._resetClass();
                style && this._dom.classList.add(style);
            }
            else {
                this.resetStyles(style);
            }
        }
        addStyleOrClass(style) {
            if (isString(style)) {
                style && this._dom.classList.add(style);
            }
            else if (isObject(style)) {
                this.setStyles(style);
            }
        }
        setStyleName(value) {
            this.setAttr('class', value);
        }
        setStyle(prop, value) {
            let changed = false;
            if (value !== this._styles[prop]) {
                changed = this._styleDirty = true;
                this._styles[prop] = value;
                this.dom.style[prop] = value;
            }
            return changed;
        }
        internalSetStyle(prop, value) {
            this._styles[prop] = value;
        }
        putStyles(styles, buff) {
            buff = buff || {};
            if (styles) {
                for (let p in styles) {
                    buff[p] = styles[p];
                }
            }
            return buff;
        }
        putStyle(prop, value, buff) {
            buff = buff || {};
            buff[prop] = value;
            return buff;
        }
        setData(data, value) {
            this.dom.dataset[data] = pickProp(value, '');
        }
        unsetData(data) {
            delete this.dom.dataset[data];
        }
        setBoolData(data, value) {
            if (value) {
                this.dom.dataset[data] = '';
            }
            else {
                delete this.dom.dataset[data];
            }
        }
        removeLater(moveToFirst = true, duration = 0.5) {
            return this;
        }
        fadeout(removeDelay, startOpacity) {
            return this;
        }
        clipRect(x, y, width, height, rd = 0) {
            const cr = this.control.clipBounds(x, y, width, height, rd);
            this.setClip(cr);
            return cr;
        }
        setClip(cr) {
            if (cr) {
                this.setAttr('clip-path', 'url(#' + (cr['id'] || cr) + ')');
            }
            else {
                this.unsetAttr('clip-path');
            }
        }
        setTemporary() {
            this.setAttr(RcElement.TEMP_KEY, 1);
            return this;
        }
        setCursor(cursor) {
            this._dom.style.cursor = cursor;
        }
        _testing() {
            return RcElement.TESTING;
        }
        _doAttached(parent) {
        }
        _doDetached(parent) {
        }
        _updateTransform() {
            const dom = this._dom;
            let tx = this._translateX;
            let ty = this._translateY;
            let tf = [];
            if (Utils.isValidNumber(tx) || Utils.isValidNumber(ty)) {
                tx = tx || 0;
                ty = ty || 0;
                tf = ['translate(' + tx + ',' + ty + ')'];
            }
            if (Utils.isNotEmpty(this._matrix)) {
                tf.push('matrix(' + this._matrix.join(',') + ')');
            }
            if (this._rotation) {
                tf.push('rotate(' + this._rotation + ' ' +
                    Utils.pick(this._originX, dom.getAttribute('x'), 0) +
                    ' ' +
                    Utils.pick(this._originY, dom.getAttribute('y') || 0) + ')');
            }
            const sx = Utils.getNumber(this._scaleX, 1);
            const sy = Utils.getNumber(this._scaleY, 1);
            if (sx !== 1 || sy !== 1) {
                tf.push('scale(' + sx + ' ' + sy + ')');
            }
            if (tf.length) {
                this._dom.setAttribute('transform', tf.join(' '));
            }
        }
    }
    RcElement.TESTING = false;
    RcElement.DEBUGGING = false;
    RcElement.TEMP_KEY = '_temp_';
    class LayerElement extends RcElement {
        constructor(doc, styleName) {
            super(doc, styleName, 'g');
        }
    }
    class RootElement extends RcElement {
        constructor(control) {
            super(control.doc(), null);
            this._control = control;
        }
        get control() {
            return this._control;
        }
    }
    class ClipElement extends RcElement {
        constructor(doc, x, y, width, height, rx = 0, ry = 0) {
            super(doc, _undefined, 'clipPath');
            const id = this._id = Utils.uniqueKey() + '-';
            this.setAttr('id', id);
            const rect = this._rect = new RcElement(doc, null, 'rect');
            rect.setAttr('fill', 'none');
            rx > 0 && rect.setAttr('rx', String(rx));
            ry > 0 && this.dom.setAttribute('rx', String(ry));
            if (!isNaN(x)) {
                rect.setBounds(x, y, width, height);
            }
            this.add(rect);
        }
        get id() {
            return this._id;
        }
        setBounds(x, y, w, h) {
            this._rect.move(x, y);
            this._rect.resize(w, h);
            return this;
        }
        get x() {
            return this._rect.x;
        }
        set x(value) {
            this._rect.x = value;
        }
        get y() {
            return this._rect.y;
        }
        set y(value) {
            this._rect.y = value;
        }
        get width() {
            return this._rect.width;
        }
        set width(value) {
            this._rect.width = value;
        }
        get height() {
            return this._rect.height;
        }
        set height(value) {
            this._rect.height = value;
        }
    }
    class PathElement extends RcElement {
        constructor(doc, styleName = void 0, path = void 0) {
            super(doc, styleName, 'path');
            path && this.setPath(path);
        }
        path() {
            return this._path;
        }
        setPath(path) {
            if (path !== this._path) {
                this._path = path;
                if (isString(path)) {
                    this.setAttr('d', path);
                }
                else {
                    this.setAttr('d', path.join(' '));
                }
            }
        }
        renderShape(shape, x, y, rd) {
            let path;
            switch (shape) {
                case 'squre':
                case 'diamond':
                case 'triangle':
                case 'itriangle':
                    path = SvgShapes[shape](x - rd, y - rd, rd * 2, rd * 2);
                    break;
                default:
                    path = SvgShapes.circle(x, y, rd);
                    break;
            }
            this.setPath(path);
        }
    }
    class ClipPathElement extends RcElement {
        constructor(doc) {
            super(doc, _undefined, 'clipPath');
            const id = this._id = Utils.uniqueKey() + '-';
            this.setAttr('id', id);
            this._path = new PathElement(doc);
            this.add(this._path);
        }
        get id() {
            return this._id;
        }
        setPath(path) {
            this._path.setPath(path);
        }
    }

    class AssetItem {
        constructor(source) {
            this.source = source;
        }
    }
    class Gradient extends AssetItem {
        _setStops(doc, elt) {
            const stop1 = doc.createElementNS(SVGNS, 'stop');
            const stop2 = doc.createElementNS(SVGNS, 'stop');
            const color = this.source.color;
            const alpha = isNull(this.source.opacity) ? 1 : this.source.opacity;
            const color1 = isArray(color) ? color[0] : color;
            const color2 = isArray(color) && color.length > 1 ? color[1] : 'white';
            const alpha1 = isArray(alpha) ? alpha[0] : alpha;
            const alpha2 = isArray(alpha) && alpha.length > 1 ? alpha[1] : alpha;
            elt.setAttribute('id', this.source.id);
            stop1.setAttribute('offset', '0');
            stop1.setAttribute('stop-color', color2);
            stop1.setAttribute('stop-opacity', alpha1);
            stop2.setAttribute('offset', '1');
            stop2.setAttribute('stop-color', color1);
            stop2.setAttribute('stop-opacity', alpha2);
            elt.appendChild(stop1);
            elt.appendChild(stop2);
        }
    }
    class LinearGradient extends Gradient {
        getEelement(doc) {
            const elt = doc.createElementNS(SVGNS, LinearGradient.TYPE);
            let { x1, x2, y1, y2 } = { x1: 0, x2: 0, y1: 0, y2: 0 };
            this._setStops(doc, elt);
            switch (this.source.dir) {
                case 'up':
                    y1 = 1;
                    break;
                case 'right':
                    x2 = 1;
                    break;
                case 'left':
                    x1 = 1;
                    break;
                default:
                    y2 = 1;
                    break;
            }
            elt.setAttribute('x1', x1);
            elt.setAttribute('y1', y1);
            elt.setAttribute('x2', x2);
            elt.setAttribute('y2', y2);
            return elt;
        }
    }
    LinearGradient.TYPE = 'linearGradient';
    class RadialGradient extends Gradient {
        getEelement(doc) {
            const src = this.source;
            const elt = doc.createElementNS(SVGNS, RadialGradient.TYPE);
            if (!isNull(src.cx)) {
                elt.setAttribute('cx', src.cx);
            }
            if (!isNull(src.cy)) {
                elt.setAttribute('cy', src.cy);
            }
            if (!isNull(src.rd)) {
                elt.setAttribute('rd', src.rd);
            }
            this._setStops(doc, elt);
            return elt;
        }
    }
    RadialGradient.TYPE = 'radialGradient';
    class AssetCollection {
        constructor() {
            this._items = [];
        }
        load(source) {
            this._items = [];
            if (isArray(source)) {
                source.forEach(src => {
                    let item = this.$_loadItem(src);
                    item && this._items.push(item);
                });
            }
            else if (isObject(source)) {
                let item = this.$_loadItem(source);
                item && this._items.push(item);
            }
        }
        register(doc, owner) {
            this._items.forEach(item => {
                owner.addDef(item.getEelement(doc));
            });
        }
        unregister(doc, owner) {
            this._items.forEach(item => {
                owner.removeDef(item.source.id);
            });
        }
        $_loadItem(src) {
            if (isObject(src) && src.type && src.id) {
                switch (src.type) {
                    case LinearGradient.TYPE:
                        return new LinearGradient(src);
                    case RadialGradient.TYPE:
                        return new RadialGradient(src);
                }
            }
        }
    }

    const ZERO = '0'.charCodeAt(0);
    const SHARP = '#'.charCodeAt(0);
    const COMMA = ','.charCodeAt(0);
    const SIGN = 's'.charCodeAt(0);
    const ABS = 'a'.charCodeAt(0);
    class NumberFormatter {
        static getFormatter(format) {
            let f = NumberFormatter.Formatters[format];
            if (!f) {
                NumberFormatter.Formatters[format] = f = new NumberFormatter(format);
            }
            return f;
        }
        static get Default() {
            return NumberFormatter.getFormatter(NumberFormatter.DEFAULT_FORMAT);
        }
        constructor(format) {
            format = format.trim();
            this._options = format ? this.$_parse(this._format = format) : { useGrouping: false };
        }
        get format() {
            return this._format;
        }
        toStr(value) {
            return value.toLocaleString(undefined, this._options);
        }
        $_parse(s) {
            const len = s.length;
            if (len > 0) {
                const options = {
                    useGrouping: false,
                    minimumIntegerDigits: 0,
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                };
                let p = s.indexOf('.');
                if (p >= 0) {
                    let i = p + 1;
                    while (i < len) {
                        if (s.charCodeAt(i) === ZERO) {
                            options.minimumFractionDigits++;
                            i++;
                        }
                        else {
                            break;
                        }
                    }
                    options.maximumFractionDigits = options.minimumFractionDigits;
                    while (i < len) {
                        if (s.charCodeAt(i) === SHARP) {
                            options.maximumFractionDigits++;
                            i++;
                        }
                        else {
                            break;
                        }
                    }
                    p = p - 1;
                }
                else {
                    p = len - 1;
                }
                let i = p;
                while (i >= 0) {
                    if (s.charCodeAt(i) === ZERO) {
                        options.minimumIntegerDigits++;
                        i--;
                    }
                    else {
                        break;
                    }
                }
                while (i >= 0) {
                    const c = s.charCodeAt(i--);
                    if (c === COMMA) {
                        options.useGrouping = true;
                        break;
                    }
                }
                i = p;
                while (i >= 0) {
                    const c = s.charCodeAt(i--);
                    if (c === SIGN) {
                        options.signDisplay = 'always';
                        break;
                    }
                }
                if (!options.signDisplay) {
                    i = p;
                    while (i >= 0) {
                        const c = s.charCodeAt(i--);
                        if (c === ABS) {
                            options.signDisplay = 'never';
                            break;
                        }
                    }
                }
                options.minimumIntegerDigits = Math.max(1, options.minimumIntegerDigits);
                return options;
            }
        }
    }
    NumberFormatter.DEFAULT_FORMAT = "";
    NumberFormatter.Formatters = {};

    const HEIGHT = '$_TH';
    const WIDTH = '$_TW';
    class Word {
        get type() {
            return '';
        }
        parse(str) {
            this.text = str;
            this._doParse(str);
            return this;
        }
        getText(target, callback) {
            const literals = this._literals;
            if (literals && callback) {
                let s = this.text;
                for (let i = 0; i < literals.length; i += 3) {
                    s = s.replace(literals[i], callback(target, literals[i + 1]));
                }
                return s;
            }
            return this.text;
        }
        prepareSpan(span, target, domain) {
            const s = this.getText(target, domain);
            span.textContent = s;
            return span;
        }
        _doParse(str) {
            this._literals = [];
            let x = 0;
            while (x < str.length) {
                const i = str.indexOf('${', x);
                if (i < 0)
                    break;
                const j = str.indexOf('}', i + 2);
                if (j < 0)
                    break;
                const s = str.substring(i, j + 1);
                const s2 = s.substring(2, s.length - 1);
                const k = s2.indexOf(':');
                if (k > 0) {
                    this._literals.push(s, s2.substring(0, k), s2.substr(k + 1));
                }
                else {
                    this._literals.push(s, s2, '');
                }
                x = j + 1;
            }
            if (this._literals.length == 0)
                this._literals = null;
            return this;
        }
    }
    class SpanWord extends Word {
        prepareSpan(span, target, domain) {
            const s = this.getText(target, domain);
            const x1 = s.indexOf('>') + 1;
            const x2 = s.indexOf('<', x1);
            this._doPrepare(span, s, x1, x2);
            return span;
        }
        _doPrepare(span, s, x1, x2) {
            span.textContent = s.substring(x1, x2);
            const i = s.indexOf('style=');
            if (i > 0 && i < x1) {
                const c = s[i + 6];
                const j = s.indexOf(c, i + 7);
                if (j > 0 && j < x1) {
                    span.setAttribute('style', s.substring(i + 7, j));
                }
            }
        }
    }
    class NormalWord extends SpanWord {
        get type() {
            return 't';
        }
    }
    class BoldWord extends SpanWord {
        get type() {
            return 'b';
        }
        _doPrepare(span, s, x1, x2) {
            super._doPrepare(span, s, x1, x2);
            span.setAttribute('class', 'rct-text-bold');
        }
    }
    class ItalicWord extends SpanWord {
        get type() {
            return 'i';
        }
        _doPrepare(span, s, x1, x2) {
            super._doPrepare(span, s, x1, x2);
            span.setAttribute('class', 'rct-text-italic');
        }
    }
    const Words = {
        't': NormalWord,
        'b': BoldWord,
        'i': ItalicWord
    };
    class SvgLine {
        get words() {
            return this._words.slice();
        }
        parse(s) {
            function addPlain(s) {
                const cnt = words.length;
                if (cnt > 0 && words[cnt - 1].type === '') {
                    words[cnt - 1].text += s;
                }
                else {
                    words.push(new Word().parse(s));
                }
            }
            const words = this._words = [];
            let x = 0;
            while (x < s.length) {
                const c = s[x];
                const c2 = s[x + 1];
                if (c == '<') {
                    let w;
                    if (c2 in Words) {
                        const i = s.indexOf('>', x + 2);
                        if (i >= 0) {
                            const s2 = '</' + c2 + '>';
                            const j = s.indexOf(s2, i + 1);
                            if (j >= 0) {
                                const s3 = s.substring(x, j + s2.length);
                                w = new Words[c2]().parse(s3);
                                x += s3.length;
                            }
                        }
                    }
                    if (w) {
                        this._words.push(w);
                    }
                    else {
                        addPlain(s.substring(x));
                        break;
                    }
                }
                else {
                    const i = s.indexOf('<', x + 1);
                    if (i >= 0) {
                        addPlain(s.substring(x, i));
                        x = i;
                    }
                    else {
                        addPlain(s.substring(x));
                        break;
                    }
                }
            }
            return this;
        }
        getText(target, domain) {
            let s = '';
            for (let w of this._words) {
                s += w.getText(target, domain);
            }
            return s;
        }
    }
    class SvgRichText {
        constructor(format) {
            this.lineHeight = 1;
            this.format = format;
        }
        get format() {
            return this._format;
        }
        set format(value) {
            if (value !== this._format) {
                this._format = value;
                value && this.$_parse(value);
            }
        }
        get lines() {
            return this._lines.slice();
        }
        build(view, target, domain) {
            const doc = view.doc;
            const hLine = pickNum(this.lineHeight, 1);
            let hMax = 0;
            const lines = this._lines;
            const cnt = lines.length;
            const firsts = [];
            view.clearDom();
            target = target || view;
            for (let i = 0; i < cnt; i++) {
                const line = lines[i];
                let h = 0;
                let first = null;
                for (let word of line.words) {
                    const span = word.prepareSpan(view.appendElement(doc, 'tspan'), target, domain);
                    const r = span.getBBox();
                    span[WIDTH] = r.width;
                    h = Math.max(h, span[HEIGHT] = r.height);
                    if (!first)
                        first = span;
                }
                firsts.push(first);
                line[HEIGHT] = h * hLine;
                hMax = Math.max(h, hMax);
            }
            for (let i = 1; i < firsts.length; i++) {
                const span = view.insertElement(doc, 'tspan', firsts[i]);
                const h = Math.ceil(view.getAscent(this._lines[i][HEIGHT]));
                span.setAttribute('x', '0');
                span.setAttribute('dy', h);
                span.innerHTML = ZWSP;
            }
            view.layoutText(hMax);
        }
        $_parse(fmt) {
            const lines = this._lines = [];
            if (fmt) {
                const strs = fmt.split(/<br.*?>|\r\n|\n/);
                for (let s of strs) {
                    lines.push(new SvgLine().parse(s));
                }
            }
        }
    }

    class ChartItem extends RcObject {
        constructor(chart, visible = true) {
            super();
            this.chart = chart;
            this._visible = visible;
        }
        get visible() {
            return this._visible;
        }
        set visible(value) {
            var _a;
            if (value !== this._visible) {
                this._visible = value;
                (_a = this.chart) === null || _a === void 0 ? void 0 : _a._visibleChanged(this);
            }
        }
        load(source) {
            if (!this._doLoadSimple(source)) {
                this._doLoad(source);
            }
            return this;
        }
        prepareRender() {
            this._doPrepareRender(this.chart);
        }
        _changed() {
            var _a;
            (_a = this.chart) === null || _a === void 0 ? void 0 : _a._modelChanged(this);
        }
        _doLoadSimple(source) {
            if (isBoolean(source)) {
                this.visible = source;
                return true;
            }
        }
        _getDefObjProps(prop) {
            return;
        }
        _doLoad(source) {
            for (const p in source) {
                let v = source[p];
                if (this._doLoadProp(p, v)) ;
                else if (isArray(v)) {
                    this[p] = v.slice(0);
                }
                else if (this[p] instanceof ChartItem) {
                    this[p].load(v);
                }
                else if (isObject(v)) {
                    this[p] = Object.assign({}, this._getDefObjProps(p), v);
                }
                else {
                    this[p] = v;
                }
            }
        }
        _doLoadProp(prop, value) {
            return false;
        }
        _doPrepareRender(chart) { }
    }
    var ChartTextEffect;
    (function (ChartTextEffect) {
        ChartTextEffect["NONE"] = "none";
        ChartTextEffect["OUTLINE"] = "outline";
        ChartTextEffect["BACKGROUND"] = "background";
    })(ChartTextEffect || (ChartTextEffect = {}));
    class ChartText extends ChartItem {
        constructor() {
            super(...arguments);
            this.effect = ChartTextEffect.NONE;
            this.autoContrast = true;
        }
    }
    class FormattableText extends ChartText {
        constructor(chart, visible) {
            super(chart, visible);
            this.offset = 2;
            this.numberSymbols = NUMBER_SYMBOLS;
            this.numberFormat = NUMBER_FORMAT;
        }
        get numberSymbols() {
            return this._numberSymbols;
        }
        set numberSymbols(value) {
            if (value !== this._numberSymbols) {
                this._numberSymbols = value;
                this._numSymbols = value && value.split(',');
            }
        }
        get numberFormat() {
            return this._numberFormat;
        }
        set numberFormat(value) {
            if (value !== this._numberFormat) {
                this._numberFormat = value;
                this._numberFormatter = value ? NumberFormatter.getFormatter(value) : null;
            }
        }
        get text() {
            return this._text;
        }
        set text(value) {
            if (value !== this._text) {
                this._text = value;
                if (value) {
                    if (!this._richTextImpl)
                        this._richTextImpl = new SvgRichText();
                    this._richTextImpl.format = value;
                }
                else {
                    this._richTextImpl = null;
                }
            }
        }
        buildSvg(view, target, callback) {
            this._richTextImpl.build(view, target, callback);
        }
        _doLoadSimple(source) {
            if (isString(source)) {
                this.text = source;
                return true;
            }
            return super._doLoadSimple(source);
        }
        $_getNumberText(value, useSymbols, forceSymbols) {
            if (Utils.isValidNumber(value)) {
                const sv = this._numSymbols && useSymbols && Utils.scaleNumber(value, this._numSymbols, forceSymbols);
                if (this._numberFormatter) {
                    if (sv) {
                        return this._numberFormatter.toStr(sv.value) + sv.symbol;
                    }
                    else {
                        return this._numberFormatter.toStr(value);
                    }
                }
                else if (sv) {
                    return sv.value + sv.symbol;
                }
                else {
                    return String(value);
                }
            }
            return 'NaN';
        }
        _getText(text, value, useSymbols, forceSymbols = false) {
            let s = text || this.$_getNumberText(value, useSymbols, forceSymbols) || value;
            if (this.prefix)
                s = this.prefix + s;
            if (this.suffix)
                s += this.suffix;
            return s;
        }
    }
    class BackgroundImage extends ChartItem {
    }

    class Crosshair extends ChartItem {
        constructor(axis) {
            super(axis.chart);
            this.axis = axis;
            this.showAlways = true;
            this.showLabel = true;
            this.visible = false;
        }
    }

    class AxisItem extends ChartItem {
        constructor(axis, visible = true) {
            super(axis === null || axis === void 0 ? void 0 : axis.chart, visible);
            this.axis = axis;
        }
    }
    class AxisLine extends AxisItem {
        constructor(axis) {
            super(axis, false);
        }
    }
    class AxisTitle extends AxisItem {
        constructor() {
            super(...arguments);
            this.gap = 5;
        }
        isVisible() {
            return this.visible && !isNull(this.text);
        }
        _doLoadSimple(source) {
            if (isString(source)) {
                this.text = source;
                return true;
            }
        }
    }
    class AxisGrid extends AxisItem {
        constructor(axis) {
            super(axis, null);
            this.circular = false;
            this.startVisible = true;
            this.endVisible = true;
        }
        isVisible() {
            return this.visible == null ? !this.axis._isX : this.visible;
        }
        getPoints(length) {
            const axis = this.axis;
            return this.axis._ticks.map(tick => axis.getPosition(length, tick.value, false));
        }
    }
    class AxisGuideLabel extends FormattableText {
        constructor(chart) {
            super(chart, true);
            this.align = Align.LEFT;
            this.verticalAlign = VerticalAlign.TOP;
        }
    }
    var AxisGuideType;
    (function (AxisGuideType) {
        AxisGuideType["LINE"] = "line";
        AxisGuideType["RANGE"] = "range";
        AxisGuideType["AREA"] = "area";
    })(AxisGuideType || (AxisGuideType = {}));
    class AxisGuide extends AxisItem {
        constructor(axis) {
            super(axis);
            this.front = true;
            this.zindex = 0;
            this.label = new AxisGuideLabel(axis.chart);
        }
    }
    class AxisGuideLine extends AxisGuide {
    }
    class AxisGuideRange extends AxisGuide {
    }
    class AxisTick extends AxisItem {
        constructor(axis) {
            super(axis);
            this.length = 7;
            this.margin = 3;
        }
    }
    var AxisLabelArrange;
    (function (AxisLabelArrange) {
        AxisLabelArrange["NONE"] = "none";
        AxisLabelArrange["ROTATE"] = "rotate";
        AxisLabelArrange["STEP"] = "step";
        AxisLabelArrange["ROWS"] = "rows";
    })(AxisLabelArrange || (AxisLabelArrange = {}));
    class AxisLabel extends FormattableText {
        constructor(axis) {
            super(axis && axis.chart, true);
            this.axis = axis;
            this.step = 0;
            this.startStep = 0;
            this.rows = 0;
            this.autoArrange = AxisLabelArrange.ROTATE;
            this.wrap = false;
            this.numberFormat = null;
        }
        getRotation() {
            return this.rotation || 0;
        }
    }
    var AxisPosition;
    (function (AxisPosition) {
        AxisPosition["NORMAL"] = "normal";
        AxisPosition["OPPOSITE"] = "opposite";
        AxisPosition["BASE"] = "base";
    })(AxisPosition || (AxisPosition = {}));
    class Axis extends ChartItem {
        constructor(chart, name) {
            super(chart);
            this.title = new AxisTitle(this);
            this.line = new AxisLine(this);
            this.grid = this._createGrid();
            this.guides = [];
            this.crosshair = new Crosshair(this);
            this._series = [];
            this._minPad = 0;
            this._maxPad = 0;
            this._values = [];
            this.position = AxisPosition.NORMAL;
            this.reversed = false;
            this.marginNear = 0;
            this.marginFar = 0;
            this.name = name;
            this.tick = this._createTickModel();
            this.label = this._createLabelModel();
        }
        isEmpty() {
            return this._series.length < 1;
        }
        getBaseValue() {
            return NaN;
        }
        disconnect() {
            this._series = [];
            this._values = [];
        }
        collectValues() {
            this._series.forEach(item => {
                item.collectValues(this, this._values);
            });
        }
        collectReferentsValues() {
            this._series.forEach(item => {
                item.pointValuesPrepared(this);
            });
        }
        prepareRender() {
            this._isHorz = this.chart.isInverted() ? !this._isX : this._isX;
            this._isOpposite = this.position === AxisPosition.OPPOSITE;
            this._doPrepareRender();
            const series = this._series;
            const vals = this._values;
            this._range = this._doCalcluateRange(vals);
            let sum = 0;
            let p = 0;
            series.forEach(item => {
                if (item.clusterable()) {
                    sum += pickNum(item.groupWidth, 1);
                }
            });
            series.forEach(item => {
                if (item.clusterable()) {
                    const w = pickNum(item.groupWidth, 1) / sum;
                    item.setCluster(w, p);
                    p += w;
                }
            });
        }
        buildTicks(length) {
            this._ticks = this._doBuildTicks(this._range.min, this._range.max, this._length = length);
        }
        calcPoints(length, phase) {
            this._ticks.forEach(t => t.pos = this.getPosition(length, t.value));
        }
        getLabelLength(length, value) {
            return this.getUnitLength(length, value);
        }
        getValue(value) {
            return value == null ? NaN : parseFloat(value);
        }
        parseValue(value) {
            return parseFloat(value);
        }
        contains(value) {
            return value >= this._range.min && value <= this._range.max;
        }
        _doLoadProp(prop, value) {
            if (prop === 'guide') {
                if (isArray(value))
                    this.$_loadGuides(value);
                else if (isObject(value))
                    this.$_loadGuides([value]);
                return true;
            }
        }
        _createGrid() {
            return new AxisGrid(this);
        }
        $_loadGuides(source) {
            for (let i = 0; i < source.length; i++) {
                const g = source[i];
                let guide;
                switch (g.type) {
                    case 'range':
                        guide = new AxisGuideRange(this);
                        break;
                    case 'line':
                    default:
                        guide = new AxisGuideLine(this);
                        break;
                }
                guide.load(g);
                this.guides.push(guide);
            }
        }
        _connect(series) {
            if (series && !this._series.includes(series)) {
                this._series.push(series);
            }
        }
        _doCalcluateRange(values) {
            let min = fixnum(Math.min(...values) || 0);
            let max = fixnum(Math.max(...values) || 0);
            return { min, max };
        }
    }
    class AxisCollection {
        constructor(chart, isX) {
            this._items = [];
            this._map = new Map();
            this.chart = chart;
            this.isX = isX;
        }
        get count() {
            return this._items.length;
        }
        get first() {
            return this._items[0];
        }
        get items() {
            return this._items.slice(0);
        }
        load(src) {
            const chart = this.chart;
            const items = this._items;
            if (isArray(src)) {
                src.forEach((s, i) => items.push(this.$_loadAxis(chart, s, i)));
            }
            else if (isObject(src)) {
                items.push(this.$_loadAxis(chart, src, 0));
            }
        }
        contains(axis) {
            return this._items.indexOf(axis) >= 0;
        }
        get(name) {
            if (isString(name)) {
                return this._map.get(name);
            }
            else {
                return this._items[name];
            }
        }
        disconnect() {
            this._items.forEach(axis => axis.disconnect());
        }
        collectValues() {
            this._items.forEach(axis => axis.collectValues());
        }
        collectReferentsValues() {
            this._items.forEach(axis => axis.collectReferentsValues());
        }
        prepareRender() {
            this._items.forEach(axis => axis.prepareRender());
        }
        buildTicks(length) {
            this._items.forEach(axis => axis.buildTicks(length));
        }
        connect(series) {
            const items = this._items;
            const a = this.isX ? series.xAxis : series.yAxis;
            let axis;
            if (isNumber(a) && a >= 0 && items.length) {
                axis = items[a];
            }
            else if (isString(a)) {
                axis = items.find(item => item.name === a);
            }
            if (!axis) {
                axis = items[0];
            }
            if (axis) {
                axis._connect(series);
            }
            return axis;
        }
        forEach(callback) {
            for (let i = 0, n = this._items.length; i < n; i++) {
                if (callback(this._items[i], i) === true)
                    break;
            }
        }
        $_loadAxis(chart, src, index) {
            let cls = chart._getAxisType(src.type);
            if (!cls) {
                let t;
                if (isArray(src.categories)) {
                    t = 'category';
                }
                else if (this.isX) {
                    for (const ser of chart._getSeries().items()) {
                        if (ser.canCategorized()) {
                            if (src.name && ser.xAxis === src.name) {
                                t = 'category';
                                break;
                            }
                            else if (isNumber(ser.xAxis) && ser.xAxis === index) {
                                t = 'category';
                                break;
                            }
                        }
                    }
                    if (!t && chart.first.canCategorized()) {
                        t = 'category';
                    }
                }
                else {
                    t = chart._getSeries().first.defaultYAxisType();
                }
                if (t) {
                    cls = chart._getAxisType(t);
                }
            }
            if (!cls) {
                cls = chart._getAxisType('linear');
            }
            const axis = new cls(chart, src.name);
            axis._isX = this.isX;
            axis.load(src);
            return axis;
        }
    }

    class Body extends ChartItem {
        constructor() {
            super(...arguments);
            this._guides = [];
            this._frontGuides = [];
            this.size = '90%';
            this.centerX = '50%';
            this.centerY = '50%';
            this.startAngle = 0;
            this.circular = true;
            this.image = new BackgroundImage(null);
        }
        getSize(width, height) {
            return calcPercent(this._sizeDim, Math.min(width, height));
        }
        getCenter(width, height) {
            return {
                cx: calcPercent(this._cxDim, width),
                cy: calcPercent(this._cyDim, height)
            };
        }
        getStartAngle() {
            return ORG_ANGLE + deg2rad(this.startAngle);
        }
        getPolar(series) {
            return this.chart._polar ? {
                start: this.getStartAngle(),
                cx: this._cx,
                cy: this._cy,
                rd: this._rd,
                deg: Math.PI * 2 / series._runPoints.length
            } : _undefined;
        }
        _doLoad(source) {
            super._doLoad(source);
            this._sizeDim = parsePercentSize(this.size, true) || { size: 90, fixed: false };
            this._cxDim = parsePercentSize(this.centerX, true) || { size: 50, fixed: false };
            this._cyDim = parsePercentSize(this.centerY, true) || { size: 50, fixed: false };
        }
        _doPrepareRender(chart) {
            super._doPrepareRender(chart);
            const guides = this._guides = [];
            const frontGuides = this._frontGuides = [];
            chart._getXAxes().forEach(axis => {
                axis.guides.forEach(g => {
                    g.front ? frontGuides.push(g) : guides.push(g);
                });
            });
        }
    }

    class LegendItem extends ChartItem {
        constructor(legend, source) {
            super(legend.chart);
            this.legend = legend;
            this.source = source;
        }
        text() {
            return this.source.legendLabel();
        }
    }
    var LegendPosition;
    (function (LegendPosition) {
        LegendPosition["BOTTOM"] = "bottom";
        LegendPosition["TOP"] = "top";
        LegendPosition["RIGHT"] = "right";
        LegendPosition["LEFT"] = "left";
        LegendPosition["PLOT"] = "plot";
        LegendPosition["SUBPLOT"] = "subplot";
    })(LegendPosition || (LegendPosition = {}));
    var LegendAlignBase;
    (function (LegendAlignBase) {
        LegendAlignBase["CHART"] = "chart";
        LegendAlignBase["PLOT"] = "plot";
    })(LegendAlignBase || (LegendAlignBase = {}));
    var LegendLayout;
    (function (LegendLayout) {
        LegendLayout["AUTO"] = "auto";
        LegendLayout["HORIZONTAL"] = "horizontal";
        LegendLayout["VERTICAL"] = "vertical";
    })(LegendLayout || (LegendLayout = {}));
    class Legend extends ChartItem {
        constructor(chart) {
            super(chart, void 0);
            this.position = LegendPosition.BOTTOM;
            this.layout = LegendLayout.AUTO;
            this.alignBase = LegendAlignBase.PLOT;
            this.left = 10;
            this.top = 10;
            this.gap = 6;
            this.itemGap = 8;
            this.markerGap = 4;
            this.visible = void 0;
        }
        items() {
            return this._items.slice(0);
        }
        isEmpty() {
            return !this._items || this._items.length < 1;
        }
        isVisible() {
            return this.visible || (this.visible !== false && this._items.length > 1);
        }
        getPosition() {
            return this._position;
        }
        getLayout() {
            if (this.layout === LegendLayout.AUTO && this._position !== LegendPosition.PLOT) {
                switch (this._position) {
                    case LegendPosition.BOTTOM:
                    case LegendPosition.TOP:
                        return LegendLayout.HORIZONTAL;
                    default:
                        return LegendLayout.VERTICAL;
                }
            }
            else {
                return this.layout;
            }
        }
        prepareRender() {
            this._items = this.$_collectItems();
        }
        getMaxWidth(domain) {
            return this._maxWidthDim ? calcPercent(this._maxWidthDim, domain) : domain;
        }
        getMaxHeight(domain) {
            return this._maxHeightDim ? calcPercent(this._maxHeightDim, domain) : domain;
        }
        _doLoad(src) {
            super._doLoad(src);
            this._maxWidthDim = parsePercentSize(this.maxWidth, true);
            this._maxHeightDim = parsePercentSize(this.maxHeight, true);
            this._position = Utils.checkEnumValue(LegendPosition, this.position, LegendPosition.BOTTOM);
        }
        $_collectItems() {
            return this.chart._getLegendSources().map(src => {
                return new LegendItem(this, src);
            });
        }
    }

    var LineType;
    (function (LineType) {
        LineType["DEFAULT"] = "default";
        LineType["SPLINE"] = "spline";
        LineType["STEP"] = "step";
    })(LineType || (LineType = {}));

    let __point_id__ = 0;
    class DataPoint {
        static swap(pts) {
            const list = [];
            for (let i = 0; i < pts.length; i++) {
                list.push({ xPos: pts[i].yPos, yPos: pts[i].xPos });
            }
            return list;
        }
        constructor(source) {
            this.pid = __point_id__++;
            this.visible = true;
            this.getValueOf = (traget, param) => {
                return this[param] || this.source[param];
            };
            this.source = source;
        }
        get yAbs() {
            return Math.abs(this.yValue);
        }
        get xAbs() {
            return Math.abs(this.xValue);
        }
        ariaHint() {
            return this.x + ', ' + this.yValue;
        }
        labelCount() {
            return 1;
        }
        getProp(fld) {
            if (isNone(this.source))
                return this.source;
            else
                return this.source[fld];
        }
        parse(series) {
            const v = this.source;
            if (isArray(v)) {
                this._readArray(series, v);
            }
            else if (isObject(v)) {
                this._readObject(series, v);
            }
            else {
                this._readSingle(v);
            }
        }
        getLabel(index) {
            return this.y;
        }
        swap() {
            const x = this.xPos;
            this.xPos = this.yPos;
            this.yPos = x;
        }
        _colorIndex() {
            return 2;
        }
        _readArray(series, v) {
            if (v == null) {
                this.isNull = true;
            }
            else {
                const f = +series.colorField;
                if (!isNaN(f)) {
                    this.color = v[f];
                }
                if (v.length > 1) {
                    this.x = v[pickNum(series.xField, 0)];
                    this.y = v[pickNum(series.yField, 1)];
                }
                else {
                    this.y = v[pickNum(series.yField, 0)];
                }
            }
        }
        _readObject(series, v) {
            if (v == null) {
                this.isNull = true;
            }
            else {
                this.x = pickProp4(v[series.xField], v.x, v.name, v.label);
                this.y = pickProp3(v[series.yField], v.y, v.value);
                this.color = pickProp(v[series.colorField], v.color);
            }
        }
        _readSingle(v) {
            this.y = v;
        }
    }
    class DataPointCollection {
        constructor(owner) {
            this._points = [];
            this._owner = owner;
        }
        get count() {
            return this._points.length;
        }
        isEmpty() {
            return this._points.length < 1;
        }
        get(index) {
            return this._points[index];
        }
        load(source) {
            if (isArray(source)) {
                this._points = this._owner.createPoints(source);
            }
            else {
                this._points = [];
            }
        }
        getProps(prop) {
            return this._points.map(p => p.getProp(prop));
        }
        getValues(axis) {
            return this._points.map(p => p[axis]);
        }
        forEach(callback) {
            for (let i = 0, n = this._points.length; i < n; i++) {
                if (callback(this._points[i], i) === true)
                    break;
            }
        }
        getPoints() {
            return this._points;
        }
    }

    class Tooltip extends ChartItem {
        constructor(series) {
            super(series.chart);
            this.series = series;
            this.text = '<b>${point.x}</b><br>${series}:<b> ${point.y}</b>';
            this.offset = 8;
            this.hideDelay = Tooltip.HIDE_DELAY;
            this.minWidth = 100;
            this.minHeight = 40;
        }
        getValue(point, param) {
            switch (param) {
                case 'series':
                case 'series.name':
                    return this.series.displayName();
                case 'point.x':
                    return point.x;
                case 'point':
                case 'point.y':
                    return point.y;
                default:
                    return param;
            }
        }
    }
    Tooltip.HIDE_DELAY = 700;

    var CategoryTickPosition;
    (function (CategoryTickPosition) {
        CategoryTickPosition["DEFAULT"] = "default";
        CategoryTickPosition["POINT"] = "point";
        CategoryTickPosition["EDGE"] = "edge";
    })(CategoryTickPosition || (CategoryTickPosition = {}));
    class CategoryAxisTick extends AxisTick {
        constructor() {
            super(...arguments);
            this.position = CategoryTickPosition.POINT;
            this.steps = 1;
            this.showLast = false;
        }
        getPosition() {
            if (this.position === CategoryTickPosition.POINT || this.position === CategoryTickPosition.EDGE) {
                return this.position;
            }
            else {
                return this.axis._isX ? CategoryTickPosition.POINT : CategoryTickPosition.EDGE;
            }
        }
    }
    class CategoryAxisLabel extends AxisLabel {
        getTick(v) {
            if (v != null) {
                return this._getText(v, v, false);
            }
            else {
                return '';
            }
        }
    }
    class CategoryAxisGrid extends AxisGrid {
        getPoints() {
            const apts = this.axis._pts;
            const n = this.axis._ticks.length;
            const pts = [];
            for (let i = 0; i < n; i++) {
                pts.push(apts[i + 2]);
            }
            return pts;
        }
    }
    class CategoryAxis extends Axis {
        constructor() {
            super(...arguments);
            this._map = {};
            this._catPad = 0;
            this.padding = 0;
            this.categoryPadding = 0.1;
        }
        getCategories() {
            return this._cats;
        }
        getWdith(length, category) {
            return 0;
        }
        axisMin() {
            return this._min;
        }
        axisMax() {
            return this._max;
        }
        categoryPad() {
            return this._catPad;
        }
        type() {
            return 'category';
        }
        _createGrid() {
            return new CategoryAxisGrid(this);
        }
        _createTickModel() {
            return new CategoryAxisTick(this);
        }
        _createLabelModel() {
            return new CategoryAxisLabel(this);
        }
        collectValues() {
            this.$_collectCategories(this._series);
            super.collectValues();
        }
        _doPrepareRender() {
            this._cats = [];
            this._weights = [];
            this._minPad = pickNum3(this.minPadding, this.padding, 0);
            this._maxPad = pickNum3(this.maxPadding, this.padding, 0);
            this._catPad = pickNum(this.categoryPadding, 0);
        }
        _doBuildTicks(min, max, length) {
            const label = this.label;
            let cats = this._cats = this._categories.map(cat => cat.c);
            let weights = this._weights = this._categories.map(cat => cat.w);
            const ticks = [];
            min = this._min = Math.floor(min);
            max = this._max = Math.ceil(max);
            while (cats.length <= max) {
                cats.push(String(cats.length));
                weights.push(1);
            }
            cats = this._cats = cats.slice(min, max + 1);
            weights = weights.slice(min, max + 1);
            const len = this._len = this._minPad + this._maxPad + weights.reduce((a, c) => a + c, 0);
            const pts = this._pts = [0];
            let p = this._minPad;
            for (let i = min; i <= max; i++) {
                weights[i - min];
                pts.push(p / len);
                p += weights[i - min];
            }
            pts.push(p / len);
            pts.push((p + this._maxPad) / len);
            for (let i = 1; i < pts.length - 2; i++) {
                const v = min + i - 1;
                ticks.push({
                    pos: NaN,
                    value: v,
                    label: label.getTick(cats[i - 1]),
                });
            }
            return ticks;
        }
        calcPoints(length, phase) {
            super.calcPoints(length, phase);
            const pts = this._pts;
            if (phase > 0) {
                for (let i = 0; i < pts.length; i++) {
                    pts[i] /= this._length;
                }
            }
            this._length = length;
            for (let i = 0; i < pts.length; i++) {
                pts[i] *= length;
            }
            const tick = this.tick;
            let markPoints;
            if (tick.getPosition() === CategoryTickPosition.EDGE) {
                markPoints = pts.slice(1, pts.length - 1);
            }
            else {
                markPoints = this._ticks.map(t => t.pos);
            }
            this._markPoints = markPoints;
        }
        getPosition(length, value, point = true) {
            value -= this._min;
            if (point)
                value += 0.5;
            const v = Math.floor(value);
            const p = this._pts[v + 1] + (this._pts[v + 2] - this._pts[v + 1]) * (value - v);
            return this.reversed ? length - p : p;
        }
        getUnitLength(length, value) {
            const v = Math.floor(value - this._min);
            return (this._pts[v + 2] - this._pts[v + 1]);
        }
        getValue(value) {
            if (isNumber(value)) {
                return value;
            }
            else {
                return this._map[value];
            }
        }
        $_collectCategories(series) {
            const categories = this.categories;
            const cats = this._categories = [];
            if (isArray(categories) && categories.length > 0) {
                this._len = 0;
                categories.forEach(cat => {
                    let w = cat == null ? 1 : pickNum(cat.weight, 1);
                    let c;
                    if (cat == null)
                        c = null;
                    else if (isString(cat))
                        c = cat;
                    else
                        c = cat.name || cat.label;
                    this._len += w;
                    cats.push({ c, w });
                });
            }
            else {
                if (isArray(series)) {
                    for (const ser of series) {
                        const cats2 = ser.collectCategories(this);
                        for (const c of cats2) {
                            if (!cats.find(cat => cat.c === c)) {
                                cats.push({ c, w: 1 });
                            }
                        }
                    }
                }
            }
            this._map = {};
            cats.forEach((cat, i) => this._map[cat.c] = i);
        }
    }

    var PointItemPosition;
    (function (PointItemPosition) {
        PointItemPosition["AUTO"] = "auto";
        PointItemPosition["INSIDE"] = "inside";
        PointItemPosition["OUTSIDE"] = "outside";
        PointItemPosition["HEAD"] = "head";
        PointItemPosition["FOOT"] = "foot";
        PointItemPosition["INSIDE_FIRST"] = "insideFirst";
        PointItemPosition["OUTSIDE_FIRST"] = "outsideFirst";
    })(PointItemPosition || (PointItemPosition = {}));
    class DataPointLabel extends FormattableText {
        constructor(chart) {
            super(chart, false);
            this.position = PointItemPosition.AUTO;
            this.offset = 4;
        }
        getText(value) {
            if (Utils.isValidNumber(value)) {
                let s = this._getText(null, value, Math.abs(value) > 1000, true);
                return s;
            }
            return value;
        }
    }
    var TrendType;
    (function (TrendType) {
        TrendType["LINEAR"] = "linear";
        TrendType["LOGARITHMIC"] = "logarithmic";
        TrendType["POLYNOMIAL"] = "polynomial";
        TrendType["POWER"] = "power";
        TrendType["EXPONENTIAL"] = "exponential";
        TrendType["MOVING_AVERAGE"] = "movingAverage";
    })(TrendType || (TrendType = {}));
    class MovingAverage {
    }
    const _movingAverage = {
        interval: 5,
        type: 'simple'
    };
    class Trendline extends ChartItem {
        constructor(series) {
            super(series.chart);
            this.series = series;
            this.type = TrendType.LINEAR;
            this.lineType = LineType.DEFAULT;
            this.movingAverage = new MovingAverage();
            this.visible = false;
        }
        _doPrepareRender(chart) {
            (this['$_' + this.type] || this.$_linear).call(this, this.series._runPoints, this._points = []);
        }
        _getDefObjProps(prop) {
            if (prop === 'movingAverage')
                return _movingAverage;
        }
        $_linear(pts, list) {
            const len = pts.length;
            if (len > 1) {
                let sx = 0;
                let sy = 0;
                let sxx = 0;
                let syy = 0;
                let sxy = 0;
                pts.forEach(p => {
                    sx += p.xValue;
                    sy += p.yValue;
                    sxx += p.xValue * p.xValue;
                    syy += p.yValue + p.yValue;
                    sxy += p.xValue * p.yValue;
                });
                const slope = ((len * sxy) - (sx * sy)) / (len * sxx - (sx * sx));
                const intercept = (sy - slope * sx) / len;
                list.push({ x: pts[0].xValue, y: slope * pts[0].xValue + intercept });
                list.push({ x: pts[len - 1].xValue, y: slope * pts[len - 1].xValue + intercept });
            }
        }
        $_logarithmic(pts, list) {
        }
        $_polynomial(pts, list) {
        }
        $_power(pts, list) {
        }
        $_exponential(pts, list) {
        }
        $_movingAverage(pts, list) {
            const ma = this.movingAverage;
            const length = pts.length;
            const interval = Math.max(1, Math.min(length, ma.interval));
            let index = interval - 1;
            while (index <= length) {
                index = index + 1;
                const slice = pts.slice(index - interval, index);
                const sum = slice.reduce((a, c) => a + c.yValue, 0);
                if (index <= length) {
                    list.push({ x: pts[index - 1].xValue, y: sum / interval });
                }
            }
        }
    }
    class Series extends ChartItem {
        static _loadSeries(chart, src, defType) {
            let cls = chart._getSeriesType(src.type);
            if (!cls) {
                cls = chart._getSeriesType(defType || chart.type);
            }
            const ser = new cls(chart, src.name);
            ser.load(src);
            return ser;
        }
        constructor(chart, name) {
            super(chart);
            this.index = -1;
            this.zOrder = 0;
            this.clipped = false;
            this.name = name;
            this.pointLabel = new DataPointLabel(chart);
            this.trendline = new Trendline(this);
            this.tooltip = new Tooltip(this);
            this._points = new DataPointCollection(this);
        }
        getPoints() {
            return this._points;
        }
        getLabeledPoints() {
            return this._points.getPoints();
        }
        getVisiblePoints() {
            return this._points.getPoints();
        }
        isEmpty() {
            return this._points.isEmpty();
        }
        needAxes() {
            return true;
        }
        canCategorized() {
            return false;
        }
        defaultYAxisType() {
            return 'linear';
        }
        clusterable() {
            return false;
        }
        displayName() {
            return this.label || this.name;
        }
        legendColor() {
            return this._calcedColor;
        }
        legendLabel() {
            return this.label || this.name;
        }
        legendVisible() {
            return this.visible;
        }
        ignoreAxisBase(axis) {
            return false;
        }
        canMixWith(other) {
            return true;
        }
        getBaseValue(axis) {
            return NaN;
        }
        canMinPadding(axis) {
            return true;
        }
        canMaxPadding(axis) {
            return true;
        }
        hasMarker() {
            return false;
        }
        setShape(shape) { }
        _createPoint(source) {
            return new DataPoint(source);
        }
        createPoints(source) {
            return source.map((s, i) => {
                const p = this._createPoint(s);
                p.index = i;
                p.parse(this);
                p.isNull || (p.isNull = s == null || p.y == null);
                return p;
            });
        }
        getXStart() {
            let s = this._xAxisObj.parseValue(this.xStart);
            if (!isNaN(s))
                return s;
            return this._xAxisObj.parseValue(this.chart.xStart);
        }
        getXStep() {
            return pickNum(this.xStep, this.chart.xStep);
        }
        getValue(point, axis) {
            const pv = point.source;
            if (pv != null) {
                const fld = this._getField(axis);
                pv[fld];
            }
            else {
                return NaN;
            }
        }
        prepareRender() {
            this._calcedColor = void 0;
            this._xAxisObj = this.group ? this.group._xAxisObj : this.chart._connectSeries(this, true);
            this._yAxisObj = this.group ? this.group._yAxisObj : this.chart._connectSeries(this, false);
            this._runPoints = this._points.getPoints();
            this._doPrepareRender();
        }
        collectCategories(axis) {
            if (axis instanceof CategoryAxis) {
                let fld = axis.categoryField;
                if (fld != null) {
                    return this._points.getProps(fld);
                }
                else {
                    return this._points.getValues(axis === this._xAxisObj ? 'x' : 'y').filter(v => isString(v));
                }
            }
        }
        collectValues(axis, vals) {
            if (axis === this._xAxisObj) {
                let x = this.getXStart() || 0;
                const xStep = this.getXStep() || 1;
                this._runPoints.forEach((p, i) => {
                    let val = axis.getValue(p.x);
                    if (isNaN(val)) {
                        val = x;
                        x += xStep;
                    }
                    if (!isNaN(val)) {
                        p.xValue = val;
                        vals && vals.push(val);
                    }
                    else {
                        p.isNull = true;
                    }
                });
            }
            else {
                this._runPoints.forEach((p, i) => {
                    if (p.isNull) {
                        p.y = p.yGroup = NaN;
                    }
                    else {
                        let val = p.y == null ? NaN : axis.getValue(p.y);
                        if (!isNaN(val)) {
                            p.yGroup = p.yValue = val;
                            vals && vals.push(val);
                        }
                        else {
                            p.yGroup = 0;
                        }
                        p.isNull = isNaN(p.yValue);
                    }
                });
                if (vals) {
                    this._minValue = Math.min(...vals);
                    this._maxValue = Math.max(...vals);
                }
            }
        }
        pointValuesPrepared(axis) {
            if (this._referents) {
                this._referents.forEach(r => r.reference(this, axis));
            }
        }
        reference(other, axis) {
        }
        isVisible(point) {
            return this._xAxisObj.contains(point.x) && this._yAxisObj.contains(point.y);
        }
        getLegendSources(list) {
            list.push(this);
        }
        getLabelPosition(p) {
            return p;
        }
        getLabelOff(off) {
            return off;
        }
        referBy(ref) {
            if (ref) {
                if (!this._referents) {
                    this._referents = [ref];
                }
                else if (this._referents.indexOf(ref) < 0) {
                    this._referents.push(ref);
                }
            }
        }
        _referOtherSeries(series) {
            return true;
        }
        _getField(axis) {
            return axis === this._xAxisObj ? this.xField : this.yField;
        }
        _colorByPoint() {
            return false;
        }
        _doLoad(src) {
            super._doLoad(src);
            const data = this._loadData(src);
            if (isArray(data) && data.length > 0) {
                this._doLoadPoints(data);
            }
        }
        _loadData(src) {
            const data = src[this.dataProp || 'data'];
            return data;
        }
        _doLoadPoints(src) {
            this._points.load(src);
        }
        _doPrepareRender() {
            let color;
            let colors;
            if (this.pointColors === false) {
                color = this.color;
            }
            else if (isArray(this.pointColors)) {
                colors = this.pointColors;
            }
            else if (this._colorByPoint()) {
                colors = this.chart.colors;
            }
            else {
                color = this.color;
            }
            this._runPoints.forEach((p, i) => {
                if (!p.color && colors) {
                    p.color = color || colors[i % colors.length];
                }
            });
        }
        prepareAfter() {
            this.trendline.visible && this.trendline.prepareRender();
        }
    }
    class PlottingItemCollection {
        constructor(chart) {
            this._map = {};
            this._items = [];
            this._visibles = [];
            this._series = [];
            this._visibleSeries = [];
            this.chart = chart;
        }
        get first() {
            return this._items[0];
        }
        get firstSeries() {
            return this._series[0];
        }
        get firstVisible() {
            return this._visibles[0];
        }
        get firstVisibleSeries() {
            return this._visibleSeries[0];
        }
        isEmpty() {
            return !this._items.find(item => !item.isEmpty());
        }
        items() {
            return this._items.slice(0);
        }
        visibles() {
            return this._visibles.slice(0);
        }
        series() {
            return this._series.slice(0);
        }
        visibleSeries() {
            return this._visibleSeries.slice(0);
        }
        needAxes() {
            if (this._visibles.find(item => item.needAxes())) {
                return true;
            }
            return this._visibleSeries.length === 0;
        }
        get(name) {
            return this._map[name];
        }
        getLegendSources() {
            const legends = [];
            this._items.forEach(ser => ser.getLegendSources(legends));
            return legends;
        }
        load(src) {
            const chart = this.chart;
            const items = this._items = [];
            const series = this._series = [];
            const map = this._map = {};
            if (isArray(src)) {
                src.forEach((s, i) => {
                    items.push(this.$_loadItem(chart, s, i));
                });
            }
            else if (isObject(src)) {
                items.push(this.$_loadItem(chart, src, 0));
            }
            items.forEach((item, i) => {
                item.index = i;
                if (item instanceof SeriesGroup) {
                    series.push(...item.series);
                }
                else if (item instanceof Series) {
                    series.push(item);
                }
            });
            series.forEach(ser => {
                if (ser.name)
                    map[ser.name] = ser;
                for (const ser2 of this._series) {
                    if (ser2 !== ser) {
                        if (!ser.canMixWith(ser2)) {
                            throw new Error('동시에 표시할 수 없는 시리즈들입니다: ' + ser._type() + ', ' + ser2._type());
                        }
                        if (ser._referOtherSeries(ser2)) {
                            break;
                        }
                    }
                }
            });
        }
        prepareRender() {
            const visibles = this._visibleSeries = [];
            let iShape = 0;
            this._series.forEach(ser => {
                ser.visible && visibles.push(ser);
                if (ser.hasMarker()) {
                    ser.setShape(Shapes[iShape++ % Shapes.length]);
                }
            });
            const nCluster = this._visibleSeries.filter(ser => ser.clusterable()).length;
            this._visibleSeries.forEach((ser, i) => {
                if (ser instanceof ClusterableSeries) {
                    ser._single = nCluster === 1;
                }
            });
            this._visibles = this._items.filter(item => item.visible);
            this._visibles.forEach(item => item.prepareRender());
        }
        prepareAfter() {
            this._visibles.forEach(item => item.prepareAfter());
        }
        $_loadItem(chart, src, index) {
            let cls = isArray(src.children || src.series) && (chart._getGroupType(src.type) || chart._getGroupType(chart.type));
            if (cls) {
                const g = new cls(chart);
                g.load(src);
                return g;
            }
            cls = chart._getSeriesType(src.type) || chart._getSeriesType(chart.type);
            const ser = new cls(chart, src.name || `Series ${index + 1}`);
            ser.load(src);
            ser.index = index;
            return ser;
        }
    }
    var MarerVisibility;
    (function (MarerVisibility) {
        MarerVisibility["DEFAULT"] = "default";
        MarerVisibility["VISIBLE"] = "visible";
        MarerVisibility["HIDDEN"] = "hidden";
    })(MarerVisibility || (MarerVisibility = {}));
    class SeriesMarker extends ChartItem {
        constructor(series) {
            super(series.chart);
            this.series = series;
            this.radius = 3;
        }
    }
    class WidgetSeries extends Series {
        needAxes() {
            return false;
        }
    }
    class RadialSeries extends WidgetSeries {
        constructor() {
            super(...arguments);
            this.startAngle = 0;
            this.centerX = 0;
            this.centerY = 0;
        }
        getSize(width, height) {
            return calcPercent(this._sizeDim, Math.min(width, height));
        }
        _doLoad(src) {
            super._doLoad(src);
            this._sizeDim = parsePercentSize(this.size, true) || { size: 80, fixed: false };
        }
    }
    class ClusterableSeries extends Series {
        constructor() {
            super(...arguments);
            this._clusterWidth = 1;
            this._clusterPos = 0;
            this._childWidth = 1;
            this._childPos = 0;
            this._pointPad = 0;
            this.groupWidth = 1;
            this.pointWidth = 1;
        }
        getPointWidth(length) {
            const g = this.group;
            let w = length;
            if (g) {
                w *= g._clusterWidth;
                w *= 1 - g.groupPadding * 2;
                w *= this._childWidth;
            }
            else {
                w *= this._clusterWidth;
            }
            w *= 1 - this._pointPad * 2;
            return w;
        }
        getPointPos(length) {
            const g = this.group;
            let w = length;
            let p = 0;
            if (g) {
                p = w * g._clusterPos;
                w *= g._clusterWidth;
                p += w * g.groupPadding;
                w -= w * g.groupPadding * 2;
                p += w * this._childPos;
                w *= this._childWidth;
            }
            else {
                p = w * this._clusterPos;
                w *= this._clusterWidth;
            }
            p += w * this._pointPad;
            return p;
        }
        getLabelPosition(p) {
            return p === PointItemPosition.AUTO ? PointItemPosition.OUTSIDE_FIRST : p;
        }
        clusterable() {
            return true;
        }
        setCluster(width, pos) {
            this._clusterWidth = width;
            this._clusterPos = pos;
        }
        _doPrepareRender() {
            super._doPrepareRender();
            this._pointPad = isNaN(this.pointPadding) ? (this._single ? 0.25 : this.group ? 0.1 : 0.2) : this.pointPadding;
        }
    }
    class BasedSeries extends ClusterableSeries {
        constructor() {
            super(...arguments);
            this.baseValue = 0;
            this.nullAsBase = false;
        }
        _doPrepareRender() {
            super._doPrepareRender();
            this._base = pickNum(this._getGroupBase(), this._yAxisObj.getBaseValue());
        }
        getBaseValue(axis) {
            return axis === this._yAxisObj ? this._base : NaN;
        }
        _getGroupBase() {
            return this.baseValue;
        }
    }
    class RangedSeries extends ClusterableSeries {
        collectValues(axis, vals) {
            super.collectValues(axis, vals);
            if (axis === this._yAxisObj) {
                this._runPoints.forEach((p) => {
                    const v = this._getBottomValue(p);
                    vals && !isNaN(v) && vals.push(v);
                });
            }
        }
    }
    var SeriesGroupLayout;
    (function (SeriesGroupLayout) {
        SeriesGroupLayout["DEFAULT"] = "default";
        SeriesGroupLayout["OVERLAP"] = "overlap";
        SeriesGroupLayout["STACK"] = "stack";
        SeriesGroupLayout["FILL"] = "fill";
    })(SeriesGroupLayout || (SeriesGroupLayout = {}));
    class SeriesGroup extends ChartItem {
        constructor() {
            super(...arguments);
            this.layoutMax = 100;
            this.index = -1;
            this._series = [];
            this._visibles = [];
            this.layout = SeriesGroupLayout.DEFAULT;
        }
        get series() {
            return this._series.slice(0);
        }
        needAxes() {
            return true;
        }
        isEmpty() {
            return this._series.length < 1;
        }
        canCategorized() {
            return true;
        }
        defaultYAxisType() {
            return 'linear';
        }
        clusterable() {
            return false;
        }
        getBaseValue(axis) {
            return NaN;
        }
        _type() {
            return this._seriesType();
        }
        collectValues(axis, vals) {
            if (this._visibles.length > 0) {
                if (axis === this._visibles[0]._yAxisObj) {
                    switch (this.layout) {
                        case SeriesGroupLayout.STACK:
                            this.$_collectStack(axis, vals);
                            break;
                        case SeriesGroupLayout.FILL:
                            this.$_collectFill(axis, vals);
                            break;
                        case SeriesGroupLayout.DEFAULT:
                        case SeriesGroupLayout.OVERLAP:
                            this.$_collectValues(axis, vals);
                            break;
                    }
                }
                else {
                    this.$_collectValues(axis, vals);
                }
            }
        }
        pointValuesPrepared(axis) {
            this._series.forEach(ser => ser.pointValuesPrepared(axis));
        }
        collectCategories(axis) {
            let cats = [];
            this._visibles.forEach(ser => cats = cats.concat(ser.collectCategories(axis)));
            return cats;
        }
        ignoreAxisBase(axis) {
            for (const ser of this._visibles) {
                if (ser.ignoreAxisBase(axis))
                    return true;
            }
        }
        getLegendSources(list) {
            list.push(...this._series);
        }
        canMinPadding(axis) {
            return true;
        }
        canMaxPadding(axis) {
            return this.layout !== SeriesGroupLayout.FILL;
        }
        getVisiblePoints() {
            const pts = [];
            this._visibles.forEach(ser => pts.push(...ser.getVisiblePoints()));
            return pts;
        }
        _doLoadProp(prop, value) {
            if (prop === 'children' || prop === 'series') {
                this.$_loadSeries(this.chart, value);
                return true;
            }
        }
        prepareRender() {
            this._visibles = this._series.filter(ser => ser.visible);
            super.prepareRender();
        }
        _doPrepareRender(chart) {
            const series = this._visibles.sort((s1, s2) => (s1.zOrder || 0) - (s2.zOrder || 0));
            this._xAxisObj = this.chart._connectSeries(this, true);
            this._yAxisObj = this.chart._connectSeries(this, false);
            if (series.length > 0) {
                series.forEach(ser => ser.prepareRender());
                this._doPrepareSeries(series);
            }
        }
        prepareAfter() {
            this._visibles.forEach(ser => ser.prepareAfter());
        }
        _doPrepareSeries(series) { }
        $_loadSeries(chart, src) {
            const type = this._seriesType();
            if (isArray(src)) {
                src.forEach((s, i) => this.$_add(Series._loadSeries(chart, s, type)));
            }
            else if (isObject(src)) {
                this.$_add(Series._loadSeries(chart, src, type));
            }
        }
        $_add(series) {
            if (this._canContain(series)) {
                this._series.push(series);
                series.group = this;
                series.index = this._series.length - 1;
            }
            else {
                throw new Error('이 그룹에 포함될 수 없는 시리즈입니다: ' + series);
            }
        }
        $_collectValues(axis, vals) {
            this._visibles.forEach(ser => {
                ser.collectValues(axis, vals);
            });
        }
        $_collectPoints(axis) {
            const series = this._visibles;
            const map = this._stackPoints = new Map();
            series.forEach(ser => {
                ser.collectValues(axis, null);
            });
            series[0]._runPoints.forEach(p => {
                map.set(p.xValue, [p]);
            });
            for (let i = 1; i < series.length; i++) {
                series[i]._runPoints.forEach(p => {
                    const pts = map.get(p.xValue);
                    if (pts) {
                        pts.push(p);
                    }
                    else {
                        map.set(p.xValue, [p]);
                    }
                });
            }
            return map;
        }
        $_collectStack(axis, vals) {
            const base = this.getBaseValue(axis);
            const map = this.$_collectPoints(axis);
            if (!isNaN(base)) {
                for (const pts of map.values()) {
                    let v = pts[0].yValue || 0;
                    let prev = v >= base ? 0 : -1;
                    let nprev = v < base ? 0 : -1;
                    pts[0].yGroup = pts[0].yValue || 0;
                    for (let i = 1; i < pts.length; i++) {
                        v = pts[i].yValue || 0;
                        if (v >= base) {
                            if (prev >= 0) {
                                pts[i].yGroup = pts[prev].yGroup + v;
                            }
                            prev = i;
                        }
                        else {
                            if (nprev >= 0) {
                                pts[i].yGroup = pts[nprev].yGroup + v;
                            }
                            nprev = i;
                        }
                    }
                    if (prev >= 0) {
                        vals.push(pts[prev].yGroup);
                    }
                    if (nprev >= 0) {
                        vals.push(pts[nprev].yGroup);
                    }
                }
            }
            else {
                for (const pts of map.values()) {
                    pts[0].yGroup = pts[0].yValue || 0;
                    for (let i = 1; i < pts.length; i++) {
                        pts[i].yGroup = pts[i - 1].yGroup + (pts[i].yValue || 0);
                    }
                    vals.push(pts[pts.length - 1].yGroup);
                }
            }
        }
        $_collectFill(axis, vals) {
            const base = this.getBaseValue(axis);
            const max = this.layoutMax || 100;
            const map = this.$_collectPoints(axis);
            if (!isNaN(base)) {
                for (const pts of map.values()) {
                    let sum = 0;
                    for (const p of pts) {
                        sum += Math.abs(p.yValue) || 0;
                    }
                    let prev = 0;
                    let nprev = 0;
                    for (const p of pts) {
                        p.yValue = (p.yValue || 0) / sum * max;
                        if (p.yValue < base) {
                            nprev = p.yGroup = (p.yValue || 0) + nprev;
                        }
                        else {
                            prev = p.yGroup = (p.yValue || 0) + prev;
                        }
                    }
                    vals.push(nprev, prev);
                }
            }
            else {
                for (const pts of map.values()) {
                    let sum = 0;
                    for (const p of pts) {
                        sum += p.yValue || 0;
                    }
                    let prev = 0;
                    for (const p of pts) {
                        prev = p.yGroup = (p.yValue || 0) / sum * max + prev;
                    }
                    vals.push(max);
                }
            }
        }
    }
    class ConstraintSeriesGroup extends SeriesGroup {
        collectValues(axis, vals) {
            super.collectValues(axis, vals);
            if (axis === this._yAxisObj) {
                const vals2 = this._doConstraintYValues(this._visibles);
                vals.length = 0;
                vals.push(...vals2);
            }
        }
    }
    class ClustrableSeriesGroup extends SeriesGroup {
        constructor() {
            super(...arguments);
            this._clusterWidth = 1;
            this._clusterPos = 0;
            this.groupWidth = 1;
            this.groupPadding = 0.1;
        }
    }

    class Title extends ChartItem {
        constructor() {
            super(...arguments);
            this.text = 'Title';
            this.align = Align.CENTER;
        }
        isVisible() {
            return this.visible && !isNull(this.text);
        }
        _doLoadSimple(source) {
            if (isString(source)) {
                this.text = source;
                return true;
            }
        }
    }
    var SubtitlePosition;
    (function (SubtitlePosition) {
        SubtitlePosition["BOTTOM"] = "bottom";
        SubtitlePosition["RIGHT"] = "right";
        SubtitlePosition["LEFT"] = "left";
        SubtitlePosition["TOP"] = "top";
    })(SubtitlePosition || (SubtitlePosition = {}));
    class Subtitle extends Title {
        constructor() {
            super(...arguments);
            this.position = SubtitlePosition.BOTTOM;
            this.verticalAlign = VerticalAlign.BOTTOM;
            this.text = '';
        }
    }

    class ContinuousAxisTick extends AxisTick {
        constructor() {
            super(...arguments);
            this.stepPixels = 72;
            this.integral = false;
        }
        buildSteps(length, base, min, max) {
            let pts;
            if (Array.isArray(this.steps)) {
                pts = this.steps.slice(0);
            }
            else if (this.stepCount > 0) {
                pts = this._getStepsByCount(this.stepCount, base, min, max);
            }
            else if (this.stepSize > 0) {
                pts = this._getStepsBySize(this.stepSize, base, min, max);
            }
            else if (this.stepPixels > 0) {
                pts = this._getStepsByPixels(length, this.stepPixels, base, min, max);
            }
            else {
                pts = [min, max];
            }
            return pts;
        }
        _getStepsByCount(count, base, min, max) {
            if (min > base) {
                min = base;
                base = NaN;
            }
            else if (max < base) {
                max = base;
                base = NaN;
            }
            isNaN(base) && this.integral;
            const len = max - min;
            let step = len / (count - 1);
            const scale = Math.pow(10, Math.floor(Math.log10(step)));
            const steps = [];
            step = this._step = Math.ceil(step / scale) * scale;
            if (!isNaN(base)) {
                assert(min < base && max > base, "base error");
                count = Math.max(3, count);
                while (true) {
                    const n = ceil((base - min) / step) + ceil((max - base) / step) + 1;
                    if (n > count) {
                        step += scale;
                    }
                    else {
                        break;
                    }
                }
                min = base - ceil((base - min) / step) * step;
            }
            else {
                if (min > Math.floor(min / scale) * scale) {
                    min = Math.floor(min / scale) * scale;
                }
                else if (min < Math.ceil(min / scale) * scale) {
                    min = Math.ceil(min / scale) * scale;
                }
            }
            steps.push(min);
            for (let i = 1; i < count; i++) {
                steps.push(fixnum(steps[i - 1] + step));
            }
            return steps;
        }
        _getStepsBySize(size, base, min, max) {
            const steps = [];
            let v;
            if (!isNaN(base)) {
                steps.push(v = base);
                while (v > min) {
                    steps.unshift(v -= size);
                }
                v = base;
                while (v < max) {
                    steps.push(v += size);
                }
            }
            else {
                steps.push(v = min);
                while (v < max) {
                    steps.push(v += size);
                }
            }
            this._step = size;
            return steps;
        }
        _getStepMultiples(step) {
            return [1, 2, 2.5, 5, 10];
        }
        _getStepsByPixels(length, pixels, base, min, max) {
            const steps = [];
            const len = max - min;
            if (len === 0) {
                return steps;
            }
            if (min >= base) {
                min = base;
            }
            else if (max <= base) {
                max = base;
            }
            let count = Math.floor(length / pixels) + 1;
            let step = len / (count - 1);
            const scale = Math.pow(10, Math.floor(Math.log10(step)));
            const multiples = this._getStepMultiples(step);
            let v;
            step = step / scale;
            if (multiples) {
                if (step > multiples[0]) {
                    let i = 0;
                    for (; i < multiples.length - 1; i++) {
                        if (step > multiples[i] && step < multiples[i + 1]) {
                            step = multiples[i + 1];
                            break;
                        }
                    }
                    if (i >= multiples.length) {
                        debugger;
                        step = multiples[multiples.length - 1];
                    }
                }
                else {
                    step = multiples[0];
                }
            }
            step *= scale;
            if (!isNaN(base)) {
                assert(min <= base && max >= base, "base error");
                count = Math.max(3, count);
                while (true) {
                    const n = ceil((base - min) / step) + ceil((max - base) / step) + 1;
                    if (n > count) {
                        step += scale;
                    }
                    else {
                        break;
                    }
                }
                min = base - ceil((base - min) / step) * step;
            }
            else {
                if (min > Math.floor(min / step) * step) {
                    min = Math.floor(min / step) * step;
                }
                else if (min < Math.ceil(min / step) * step) {
                    min = Math.ceil(min / step) * step;
                }
            }
            this._step = step;
            steps.push(fixnum(v = min));
            while (v < max) {
                steps.push(fixnum(v += step));
            }
            return steps;
        }
    }
    class ContinuousAxisLabel extends AxisLabel {
        constructor() {
            super(...arguments);
            this.useSymbols = true;
        }
        getTick(v) {
            return this._getText(null, v, this.useSymbols && this.axis.tick._step > 100);
        }
    }
    class AxisBreak extends AxisItem {
        constructor() {
            super(...arguments);
            this.enabled = true;
            this.size = '30%';
            this.space = 12;
        }
        getSize(domain) {
            return calcPercent(this._sizeDim, domain);
        }
        _doLoad(source) {
            super._doLoad(source);
            this.space = pickNum(this.space, 0);
            this._sizeDim = parsePercentSize(this.size, false);
        }
    }
    var AxisFit;
    (function (AxisFit) {
        AxisFit["DEFAULT"] = "default";
        AxisFit["TICK"] = "tick";
        AxisFit["VALUE"] = "value";
    })(AxisFit || (AxisFit = {}));
    class ContinuousAxis extends Axis {
        constructor() {
            super(...arguments);
            this.nullable = true;
            this.padding = 0.05;
            this.startFit = AxisFit.DEFAULT;
            this.endFit = AxisFit.DEFAULT;
            this.breaks = [];
        }
        getBaseValue() {
            return this.baseValue;
        }
        axisMin() {
            return this._min;
        }
        axisMax() {
            return this._max;
        }
        hasBreak() {
            return !!this._runBreaks;
        }
        runBreaks() {
            return this._runBreaks && this._runBreaks.slice(0);
        }
        getStartFit() {
            return this.startFit === AxisFit.DEFAULT ? (this._isX ? AxisFit.VALUE : AxisFit.TICK) : this.startFit;
        }
        getEndFit() {
            return this.endFit === AxisFit.DEFAULT ? (this._isX ? AxisFit.VALUE : AxisFit.TICK) : this.endFit;
        }
        contains(value) {
            return !isNaN(value);
        }
        _createTickModel() {
            return new ContinuousAxisTick(this);
        }
        _createLabelModel() {
            return new ContinuousAxisLabel(this);
        }
        _doLoadProp(prop, value) {
            if (prop === 'break') {
                this.$_loadBreaks(value);
                return true;
            }
            return super._doLoadProp(prop, value);
        }
        $_findBaseAxis() {
            if (this.tickBase != null) {
                const base = (this._isX ? this.chart._getXAxes() : this.chart._getYAxes()).get(this.tickBase);
                if (base) {
                    if (base instanceof ContinuousAxis) {
                        base.tickBase = void 0;
                        this._baseAxis = base;
                    }
                }
            }
        }
        _doPrepareRender() {
            this._hardMin = this.min;
            this._hardMax = this.max;
            this._base = parseFloat(this.baseValue);
            this._unitLen = NaN;
            this.$_findBaseAxis();
        }
        _doBuildTicks(calcedMin, calcedMax, length) {
            const tick = this.tick;
            let { min, max } = this._adjustMinMax(this._calcedMin = calcedMin, this._calcedMax = calcedMax);
            let base = this._base;
            if (isNaN(base) && min < 0 && max > 0) {
                base = 0;
            }
            let steps = tick.buildSteps(length, base, min, max);
            const ticks = [];
            if (!isNaN(this.strictMin) || this.getStartFit() === AxisFit.VALUE) {
                if (steps.length > 1 && min > steps[0]) {
                    steps = steps.slice(1);
                }
            }
            else if (steps.length > 2 && steps[1] <= min) {
                steps.slice(1);
            }
            else {
                min = Math.min(min, steps[0]);
            }
            if (!isNaN(this.strictMax) || this.getEndFit() === AxisFit.VALUE) {
                if (max < steps[steps.length - 1] && steps.length > 1) {
                    steps.pop();
                }
            }
            else if (steps.length > 2 && steps[steps.length - 2] > max) {
                steps.pop();
            }
            else {
                max = Math.max(max, steps[steps.length - 1]);
            }
            this._setMinMax(min, max);
            if (min !== max) {
                if (this._runBreaks) {
                    steps = this.$_getBrokenSteps(this._runBreaks, length, min, max);
                }
                for (let i = 0; i < steps.length; i++) {
                    const tick = this._createTick(length, steps[i]);
                    ticks.push(tick);
                }
            }
            return ticks;
        }
        _getTickLabel(value) {
            return this.label.getTick(value) || String(value);
        }
        _createTick(length, step) {
            return {
                pos: NaN,
                value: step,
                label: this._getTickLabel(step)
            };
        }
        calcPoints(length, phase) {
            super.calcPoints(length, phase);
            this._markPoints = this._ticks.map(t => t.pos);
        }
        $_buildBrokenSteps(sect) {
            const tick = this.tick;
            const steps = tick.buildSteps(sect.len, void 0, sect.from, sect.to);
            return steps;
        }
        $_getBrokenSteps(breaks, len, min, max) {
            let p = 0;
            let start = min;
            const steps = [start];
            const sects = this._sects = [];
            len -= breaks.reduce((a, c) => a + c.space, 0);
            breaks.forEach(br => {
                const sz = br.getSize(len);
                const sect = {
                    from: start,
                    to: br.from,
                    pos: p,
                    len: sz
                };
                p += sz;
                sects.push(sect, br._sect = {
                    from: br.from,
                    to: br.to,
                    pos: p,
                    len: br.space
                });
                p += br.space;
                const steps2 = this.$_buildBrokenSteps(sect);
                steps2.forEach(s => {
                    if (s > sect.from && s <= sect.to) {
                        steps.push(s);
                    }
                });
                if (br.space > 0) {
                    steps.push(br.to);
                }
            });
            const last = breaks[breaks.length - 1];
            if (max > last.to) {
                const sect = {
                    from: last.to,
                    to: max,
                    pos: p,
                    len: this._length - p
                };
                sects.push(sect);
                const steps2 = this.$_buildBrokenSteps(sect);
                steps2.forEach(s => {
                    if (s > sect.from && s <= sect.to) {
                        steps.push(s);
                    }
                });
            }
            this._lastSect = sects[sects.length - 1];
            return steps;
        }
        getPosition(length, value) {
            if (this._runBreaks) {
                const sect = this._sects.find(s => value < s.to) || this._lastSect;
                const p = sect.len * (value - sect.from) / (sect.to - sect.from);
                return (this.reversed ? length - p : p) + sect.pos;
            }
            else {
                const p = length * (value - this._min) / (this._max - this._min);
                return this.reversed ? length - p : p;
            }
        }
        getUnitLength(length, value) {
            if (isNaN(this._unitLen)) {
                this._unitLen = this.$_calcUnitLength(length);
            }
            return this._unitLen;
        }
        getLabelLength(length, value) {
            return Math.floor(length / this._ticks.length);
        }
        _adjustMinMax(min, max) {
            this._minBased = this._maxBased = false;
            this._series.forEach(ser => {
                const base = ser.getBaseValue(this);
                if (!isNaN(base)) {
                    if (isNaN(this._hardMin) && base <= min) {
                        min = base;
                        this._minBased = true;
                    }
                    else if (isNaN(this._hardMax) && base >= max) {
                        max = base;
                        this._maxBased = true;
                    }
                }
                if (!this._minBased && !ser.canMinPadding(this)) {
                    this._minBased = true;
                }
                if (!this._maxBased && !ser.canMaxPadding(this)) {
                    this._maxBased = true;
                }
            });
            let minPad = 0;
            let maxPad = 0;
            if (!isNaN(this.strictMin)) {
                min = this.strictMin;
            }
            else {
                if (this._hardMin < min) {
                    min = this._hardMin;
                }
                if (!this._minBased) {
                    minPad = pickNum3(this.minPadding, this.padding, 0);
                }
            }
            if (!isNaN(this.strictMax)) {
                max = this.strictMax;
            }
            else {
                if (this._hardMax > max) {
                    max = this._hardMax;
                }
                if (!this._maxBased) {
                    maxPad = pickNum3(this.maxPadding, this.padding, 0);
                }
            }
            let len = Math.max(0, max - min);
            min -= len * (this._minPad = minPad);
            max += len * (this._maxPad = maxPad);
            return { min, max };
        }
        _setMinMax(min, max) {
            this._min = min;
            this._max = max;
        }
        $_calcUnitLength(length) {
            const pts = [];
            this._series.forEach(ser => {
                if (ser.visible && ser.clusterable()) {
                    pts.push(...ser.getVisiblePoints());
                }
            });
            const isX = this._isX;
            const vals = pts.map(p => isX ? p.xValue : p.yValue).sort();
            let min = vals[1] - vals[0];
            for (let i = 2; i < vals.length; i++) {
                min = Math.min(vals[i] - vals[i - 1]);
            }
            length *= min / (this._max - this._min);
            return this._unitLen = pickNum(length, 1);
        }
        $_loadBreak(source) {
            if (isObject(source) && 'from' in source && 'to' in source) {
                return new AxisBreak(this).load(source);
            }
        }
        $_loadBreaks(source) {
            if (isArray(source)) {
                for (let src of source) {
                    const br = this.$_loadBreak(src);
                    br && this.breaks.push(br);
                }
            }
            else if (source) {
                const br = this.$_loadBreak(source);
                br && this.breaks.push(br);
            }
            this.$_mergeBreaks();
        }
        $_mergeBreaks() {
            function intersects(br1, br2) {
                return br2.from < br1.to;
            }
            function merge(br1, br2) {
                br1.to = br2.to;
            }
            const breaks = this.breaks.sort((b1, b2) => b1.from - b2.from).filter(b => b.to > b.from);
            this._runBreaks = null;
            if (breaks.length > 0) {
                const runs = this._runBreaks = [];
                runs.push(Object.assign(new AxisBreak(this), breaks[0]));
                for (let i = 1; i < breaks.length; i++) {
                    const r = runs[runs.length - 1];
                    const b = breaks[i];
                    if (intersects(r, b)) {
                        merge(r, b);
                    }
                    else {
                        runs.push(Object.assign(new AxisBreak(this), b));
                    }
                }
            }
        }
    }
    class LinearAxis extends ContinuousAxis {
        type() {
            return 'linear';
        }
        _adjustMinMax(min, max) {
            const v = super._adjustMinMax(min, max);
            const series = this._series;
            if (series.length === 1 && series[0] instanceof SeriesGroup && series[0].layout === SeriesGroupLayout.FILL) {
                v.max = series[0].layoutMax;
            }
            return v;
        }
    }

    class LogAxisTick extends ContinuousAxisTick {
    }
    class LogAxis extends ContinuousAxis {
        type() {
            return 'log';
        }
        _createTickModel() {
            return new LogAxisTick(this);
        }
        _doCalcluateRange(values) {
            const v = super._doCalcluateRange(values);
            v.min = Math.log10(v.min);
            v.max = Math.log10(v.max);
            return v;
        }
        _createTick(length, step) {
            return super._createTick(length, Math.pow(10, step));
        }
        getPosition(length, value) {
            value = value > 0 ? Math.log10(value) : 0;
            return super.getPosition(length, value);
        }
    }

    const time_scales = [
        1,
        1000,
        60 * 1000,
        60 * 60 * 1000,
        24 * 60 * 60 * 1000,
        7 * 24 * 60 * 60 * 1000,
        28 * 24 * 60 * 60 * 1000,
        364 * 24 * 60 * 60 * 1000
    ];
    const time_multiples = [
        [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500],
        [1, 2, 5, 10, 15, 30],
        [1, 2, 3, 4, 6, 8, 12],
        [1, 2, 3, 4, 6, 12],
        [1, 2],
        [1, 2],
        [1, 2, 3, 4, 6]
    ];
    class TimeAxisTick extends ContinuousAxisTick {
        _getStepMultiples(step) {
            for (let i = 0; i < 7; i++) {
                if (step >= time_scales[i] && step < time_scales[i + 1] / 2) {
                    this.scale = i;
                    return time_multiples[i];
                }
            }
            this.scale = 7;
        }
        buildSteps(length, base, min, max) {
            const steps = super.buildSteps(length, base, min, max);
            return steps;
        }
        _getStepsByPixels(length, pixels, base, min, max) {
            const steps = [];
            const len = max - min;
            if (len === 0) {
                return steps;
            }
            const axis = this.axis;
            let count = Math.floor(length / this.stepPixels) + 1;
            let step = Math.max(1, Math.floor(len / (count - 1)));
            const multiples = this._getStepMultiples(step);
            const scale = time_scales[this.scale];
            step = step / scale;
            if (multiples) {
                if (step > multiples[0]) {
                    let i = 0;
                    for (; i < multiples.length - 1; i++) {
                        if (step > multiples[i] && step < multiples[i + 1]) {
                            step = multiples[i + 1];
                            break;
                        }
                    }
                    if (i >= multiples.length) {
                        debugger;
                        step = multiples[multiples.length - 1];
                    }
                }
                else {
                    step = multiples[0];
                }
            }
            const minDate = axis.date(min);
            const maxDate = axis.date(max);
            let dt = minDate;
            let t;
            if (this.scale === 7) {
                let y = dt.getFullYear();
                step = Math.ceil(step);
                dt = new Date(y, 0);
                if (dt < minDate) {
                    y += step;
                    dt = new Date(y, 0);
                }
                do {
                    steps.push(+dt);
                    y += step;
                    dt = new Date(y, 0);
                } while (dt <= maxDate);
            }
            else if (this.scale === 6) {
                let y = dt.getFullYear();
                let m = dt.getMonth();
                step = Math.ceil(step);
                dt = new Date(y, m);
                if (dt < minDate) {
                    m += step;
                    dt = new Date(y, m);
                }
                do {
                    steps.push(+dt);
                    m += step;
                    dt = new Date(y, m);
                } while (dt <= maxDate);
            }
            else if (this.scale === 4 || this.scale === 5) {
                let y = dt.getFullYear();
                let m = dt.getMonth();
                let d = dt.getDate();
                step = Math.ceil(step);
                dt = new Date(y, m, d);
                if (dt < minDate) {
                    d += step;
                    dt = new Date(y, m, d);
                }
                do {
                    steps.push(+dt);
                    d += step * (this.scale === 5 ? 7 : 1);
                    dt = new Date(y, m, d);
                } while (dt <= maxDate);
            }
            else {
                step *= scale;
                switch (this.scale) {
                    case 3:
                        dt.setMinutes(0);
                    case 2:
                        dt.setSeconds(0);
                    case 1:
                        dt.setMilliseconds(0);
                        break;
                }
                t = dt.getTime();
                if (t < min) {
                    t += step;
                }
                do {
                    steps.push(t);
                    t += step;
                } while (t <= max);
            }
            return steps;
        }
    }
    class TimeAxis extends ContinuousAxis {
        constructor(chart, name) {
            super(chart, name);
            this._offset = new Date().getTimezoneOffset() * 60 * 1000;
            this.utc = true;
            this.baseValue = NaN;
        }
        type() {
            return 'time';
        }
        _createTickModel() {
            return new TimeAxisTick(this);
        }
        _adjustMinMax(min, max) {
            const v = super._adjustMinMax(min, max);
            return v;
        }
        _doBuildTicks(min, max, length) {
            const ticks = super._doBuildTicks(min, max, length);
            ticks.forEach((tick, i) => {
                tick.label = this.$_getLabel(tick.value, i);
            });
            return ticks;
        }
        parseValue(value) {
            if (!isNaN(value)) {
                return +value;
            }
            else if (isString(value)) {
                return new Date(value).getTime();
            }
        }
        date(value) {
            return new Date(value);
        }
        $_getLabel(value, index) {
            const d = this.date(value);
            switch (this.tick.scale) {
                case 7:
                    return `${d.getFullYear()}`;
                case 6:
                    if (index === 0 || d.getMonth() === 0) {
                        return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;
                    }
                    else {
                        return `${d.getMonth() + 1}`;
                    }
                case 5:
                case 4:
                    if (index === 0 || d.getDate() === 1) {
                        return `${d.getMonth() + 1}-${pad2(d.getDate())}`;
                    }
                    else {
                        return `${d.getDate()}`;
                    }
                case 3:
                    if (index === 0 || d.getHours() === 0) {
                        return `${d.getDate()} ${pad2(d.getHours())}:00`;
                    }
                    else {
                        return `${pad2(d.getHours())}:00`;
                    }
                case 2:
                    return `${d.getMinutes()}`;
                case 1:
                    return `${d.getSeconds()}`;
                case 0:
                    return String(value);
            }
        }
    }

    class BarRangeSeriesPoint extends DataPoint {
        labelCount() {
            return 2;
        }
        getLabel(index) {
            return index === 1 ? this.lowValue : this.yValue;
        }
        _readArray(series, v) {
            const d = v.length > 2 ? 1 : 0;
            this.low = v[pickNum(series.lowField, 0 + d)];
            this.y = v[pickNum(series.yField, 1 + d)];
            if (d > 0) {
                this.x = v[pickNum(series.xField, 0)];
            }
        }
        _readObject(series, v) {
            super._readObject(series, v);
            this.low = pickProp(v[series.lowField], v.low);
            this.y = pickProp3(v[series.yField], v.y, v.value);
        }
        _readSingle(v) {
            super._readSingle(v);
            this.low = this.y;
        }
        parse(series) {
            super.parse(series);
            this.lowValue = parseFloat(this.low);
        }
    }
    class BarRangeSeries extends RangedSeries {
        _type() {
            return 'barrange';
        }
        _createPoint(source) {
            return new BarRangeSeriesPoint(source);
        }
        _getBottomValue(p) {
            return p.lowValue;
        }
    }

    class BarSeriesPoint extends DataPoint {
    }
    class BarSeries extends BasedSeries {
        constructor() {
            super(...arguments);
            this.borderRaidus = 0;
        }
        _type() {
            return 'bar';
        }
        canCategorized() {
            return true;
        }
        _createPoint(source) {
            return new BarSeriesPoint(source);
        }
        _getGroupBase() {
            return this.group ? this.group.baseValue : this.baseValue;
        }
    }
    class BarSeriesGroup extends ClustrableSeriesGroup {
        constructor() {
            super(...arguments);
            this.baseValue = 0;
        }
        _seriesType() {
            return 'bar';
        }
        _canContain(ser) {
            return ser instanceof BarSeries;
        }
        clusterable() {
            return true;
        }
        setCluster(width, pos) {
            this._clusterWidth = width;
            this._clusterPos = pos;
        }
        getBaseValue(axis) {
            return axis._isX ? NaN : pickNum(this.baseValue, axis.getBaseValue());
        }
        _doPrepareSeries(series) {
            if (this.layout === SeriesGroupLayout.DEFAULT) {
                const sum = series.length > 1 ? series.map(ser => ser.pointWidth).reduce((a, c) => a + c, 0) : series[0].pointWidth;
                let x = 0;
                series.forEach(ser => {
                    ser._childWidth = ser.pointWidth / sum;
                    ser._childPos = x;
                    x += ser._childWidth;
                });
            }
            else if (this.layout === SeriesGroupLayout.STACK) ;
        }
    }

    class LineSeriesPoint extends DataPoint {
    }
    class LineSeriesMarker extends SeriesMarker {
        constructor() {
            super(...arguments);
            this.radius = 4;
            this.firstVisible = MarerVisibility.DEFAULT;
            this.lastVisible = MarerVisibility.DEFAULT;
            this.minVisible = MarerVisibility.DEFAULT;
            this.maxVisible = MarerVisibility.DEFAULT;
        }
    }
    class LineSeriesBase extends Series {
        constructor() {
            super(...arguments);
            this.marker = new LineSeriesMarker(this);
            this.nullAsBase = false;
        }
        getShape() {
            return this.marker.shape || this._shape;
        }
        _createPoint(source) {
            return new LineSeriesPoint(source);
        }
        hasMarker() {
            return true;
        }
        setShape(shape) {
            this._shape = shape;
        }
    }
    var LineStepDirection;
    (function (LineStepDirection) {
        LineStepDirection["FORWARD"] = "forward";
        LineStepDirection["BACKWARD"] = "backward";
    })(LineStepDirection || (LineStepDirection = {}));
    class LineSeries extends LineSeriesBase {
        constructor() {
            super(...arguments);
            this.lineType = LineType.DEFAULT;
            this.stepDir = LineStepDirection.FORWARD;
            this.connectNullPoints = false;
            this.baseValue = 0;
        }
        _type() {
            return 'line';
        }
        getLineType() {
            return this.lineType;
        }
    }
    class AreaSeriesPoint extends LineSeriesPoint {
    }
    class AreaSeries extends LineSeries {
        _type() {
            return 'area';
        }
        _createPoint(source) {
            return new AreaSeriesPoint(source);
        }
        _doPrepareRender() {
            super._doPrepareRender();
            this._base = pickNum(this.baseValue, this._yAxisObj.getBaseValue());
        }
        getBaseValue(axis) {
            return axis._isX ? NaN : this._base;
        }
    }
    class AreaRangeSeriesPoint extends AreaSeriesPoint {
        parse(series) {
            super.parse(series);
            this.y = this.high = pickProp(this.high, this.low);
            this.lowValue = parseFloat(this.low);
            this.highValue = this.yValue = parseFloat(this.high);
            this.isNull || (this.isNull = isNaN(this.lowValue));
        }
        _readArray(series, v) {
            const d = v.length > 2 ? 1 : 0;
            this.low = v[pickNum(series.lowField, 0 + d)];
            this.high = v[pickNum(series.highField, 1 + d)];
            if (d > 0) {
                this.x = v[pickNum(series.xField, 0)];
            }
        }
        _readObject(series, v) {
            super._readObject(series, v);
            this.low = pickProp(v[series.lowField], v.low);
            this.high = pickProp(v[series.lowField], v.high);
        }
        _readSingle(v) {
            super._readSingle(v);
            this.low = this.y;
        }
    }
    class AreaRangeSeries extends LineSeriesBase {
        constructor() {
            super(...arguments);
            this.curved = false;
        }
        _type() {
            return 'arearange';
        }
        _createPoint(source) {
            return new AreaRangeSeriesPoint(source);
        }
        getLineType() {
            return this.curved ? LineType.SPLINE : LineType.DEFAULT;
        }
        collectValues(axis, vals) {
            super.collectValues(axis, vals);
            if (vals && axis === this._yAxisObj) {
                this._runPoints.forEach((p) => !p.isNull && vals.push(p.lowValue));
            }
        }
    }
    class LineSeriesGroup extends SeriesGroup {
        constructor() {
            super(...arguments);
            this.baseValue = 0;
        }
        _seriesType() {
            return 'line';
        }
        _canContain(ser) {
            return ser instanceof LineSeries;
        }
        getBaseValue(axis) {
            return axis === this._yAxisObj ? pickNum(this.baseValue, axis.getBaseValue()) : NaN;
        }
    }
    class AreaSeriesGroup extends SeriesGroup {
        constructor() {
            super(...arguments);
            this.baseValue = 0;
        }
        _seriesType() {
            return 'area';
        }
        _canContain(ser) {
            return ser instanceof AreaSeries;
        }
        getBaseValue(axis) {
            return axis === this._yAxisObj ? pickNum(this.baseValue, axis.getBaseValue()) : NaN;
        }
    }

    class BellCurveSeriesPoint extends AreaSeriesPoint {
    }
    class BellCurveSeries extends AreaSeries {
        constructor() {
            super(...arguments);
            this.sigmas = 3;
            this.pointsInSigma = 5;
            this.curved = false;
        }
        _type() {
            return 'bellcurve';
        }
        getLineType() {
            return this.curved ? LineType.SPLINE : LineType.DEFAULT;
        }
        _createPoint(source) {
            return new BellCurveSeriesPoint(source);
        }
        _loadData(src) {
            const data = super._loadData(src);
            if (isArray(data)) {
                return this.$_loadTable(data);
            }
        }
        _referOtherSeries(series) {
            if (this._points.isEmpty() && (series.name === this.source || series.index === this.source)) {
                series.referBy(this);
                return true;
            }
        }
        reference(other, axis) {
            if (!axis._isX) {
                const vals = other._runPoints.map(p => p.yValue).filter(v => !isNaN(v));
                const pts = this.$_loadTable(vals);
                this._doLoadPoints(pts);
                this._runPoints = this._points.getPoints();
                this.collectValues(this._xAxisObj, this._xAxisObj._values);
                this.collectValues(this._yAxisObj, this._yAxisObj._values);
            }
        }
        $_loadTable(vals) {
            const len = vals.length;
            if (len < 1) {
                return;
            }
            const sum = vals.reduce((a, c) => a + c, 0);
            const mean = sum / len;
            const stdv = Math.sqrt(vals.reduce((a, c) => a + Math.pow(c - mean, 2)) / (len - 1));
            const step = stdv / this.pointsInSigma;
            const min = mean - this.sigmas * stdv;
            const max = mean + this.sigmas * stdv;
            let sigma = mean;
            const pts2 = [];
            pts2.push(this.$_getDenstiy(mean, stdv, sigma));
            while (sigma > min) {
                sigma -= step;
                pts2.unshift(this.$_getDenstiy(mean, stdv, sigma));
            }
            sigma = mean;
            while (sigma < max) {
                sigma += step;
                pts2.push(this.$_getDenstiy(mean, stdv, sigma));
            }
            return pts2;
        }
        $_getDenstiy(mean, stdv, sigma) {
            const dist = sigma - mean;
            const y = Math.exp(-(dist * dist) / (2 * stdv * stdv)) / (stdv * Math.sqrt(2 * Math.PI));
            return {
                x: sigma,
                y: y
            };
        }
    }

    class BoxPlotSeriesPoint extends DataPoint {
        labelCount() {
            return 2;
        }
        getLabel(index) {
            return index === 0 ? this.yValue : this.minValue;
        }
        _readArray(series, v) {
            const d = v.length > 5 ? 1 : 0;
            this.min = v[pickNum(series.minField, 0 + d)];
            this.low = v[pickNum(series.lowField, 1 + d)];
            this.mid = v[pickNum(series.midField, 2 + d)];
            this.high = v[pickNum(series.highField, 3 + d)];
            this.y = v[pickNum(series.yField, 4 + d)];
            if (d > 0) {
                this.x = v[pickNum(series.xField, 0)];
            }
        }
        _readObject(series, v) {
            super._readObject(series, v);
            this.min = pickProp(v[series.minField], v.min);
            this.low = pickProp(v[series.lowField], v.low);
            this.mid = pickProp(v[series.midField], v.mid);
            this.high = pickProp(v[series.highField], v.high);
            this.y = pickProp3(v[series.yField], v.y, v.value);
        }
        _readSingle(v) {
            super._readSingle(v);
            this.min = this.low = this.mid = this.high = this.y;
        }
        parse(series) {
            super.parse(series);
            this.minValue = parseFloat(this.min);
            this.lowValue = parseFloat(this.low);
            this.midValue = parseFloat(this.mid);
            this.highValue = parseFloat(this.high);
            this.isNull || (this.isNull = isNaN(this.minValue) || isNaN(this.lowValue) || isNaN(this.midValue) || isNaN(this.highValue));
        }
    }
    class BoxPlotSeries extends RangedSeries {
        _type() {
            return 'boxplot';
        }
        _createPoint(source) {
            return new BoxPlotSeriesPoint(source);
        }
        _getBottomValue(p) {
            return p.minValue;
        }
    }

    class BubbleSeriesPoint extends DataPoint {
        getLabel(index) {
            return this.z;
        }
        parse(series) {
            super.parse(series);
            this.zValue = parseFloat(this.z);
        }
        _readArray(series, v) {
            const d = v.length > 2 ? 1 : 0;
            this.y = v[pickNum(series.yField, 0 + d)];
            this.z = v[pickNum(series.zProp, 1 + d)];
            if (d > 0) {
                this.x = v[pickNum(series.xField, 0)];
            }
        }
        _readObject(series, v) {
            super._readObject(series, v);
            this.z = pickProp(v[series.zProp], v.z);
        }
        _readSingle(v) {
            super._readSingle(v);
            this.z = this.y;
        }
    }
    class BubbleSeriesMarker extends SeriesMarker {
    }
    var BubbleSizeMode;
    (function (BubbleSizeMode) {
        BubbleSizeMode["WIDTH"] = "width";
        BubbleSizeMode["AREA"] = "area";
    })(BubbleSizeMode || (BubbleSizeMode = {}));
    class BubbleSeries extends Series {
        constructor(chart, name) {
            super(chart, name);
            this.sizeMode = BubbleSizeMode.AREA;
            this.minSize = 8;
            this.maxSize = '20%';
            this.colorByPoint = false;
            this.marker = new BubbleSeriesMarker(this);
        }
        getPxMinMax(len) {
            return {
                min: calcPercent(this._minDim, len),
                max: calcPercent(this._maxDim, len)
            };
        }
        getRadius(value, pxMin, pxMax) {
            let r = (value - this._zMin) / (this._zMax - this._zMin);
            if (this.sizeMode == BubbleSizeMode.AREA) {
                r = Math.sqrt(r);
            }
            r = Math.ceil(pxMin + r * (pxMax - pxMin)) / 2;
            return r;
        }
        _type() {
            return 'bubble';
        }
        ignoreAxisBase(axis) {
            return true;
        }
        _createPoint(source) {
            return new BubbleSeriesPoint(source);
        }
        _colorByPoint() {
            return this.colorByPoint;
        }
        load(src) {
            super.load(src);
            this._minDim = parsePercentSize(this.minSize, true);
            this._maxDim = parsePercentSize(this.maxSize, true);
            return this;
        }
        _doPrepareRender() {
            super._doPrepareRender();
            this._zMin = Number.MAX_VALUE;
            this._zMax = Number.MIN_VALUE;
            this._runPoints.forEach((p) => {
                this._zMin = Math.min(this._zMin, p.zValue);
                this._zMax = Math.max(this._zMax, p.zValue);
            });
        }
    }

    class BumpSeriesGroup extends ConstraintSeriesGroup {
        _type() {
            return 'bump';
        }
        _seriesType() {
            return 'line';
        }
        _canContain(ser) {
            return ser instanceof LineSeries;
        }
        _doConstraintYValues(series) {
            const map = {};
            series.forEach(ser => {
                ser._runPoints.forEach(p => {
                    const x = p.xValue;
                    let pts = map[x];
                    if (pts) {
                        pts.push(p);
                    }
                    else {
                        map[x] = [p];
                    }
                });
            });
            for (const x in map) {
                const pts = map[x].sort((p1, p2) => p1.yValue - p2.yValue);
                for (let i = pts.length - 1; i >= 0; i--) {
                    pts[i].yValue = pts[i].yGroup = i;
                }
            }
            return Utils.makeIntArray(0, series.length);
        }
    }

    class CandlestickSeriesPoint extends DataPoint {
        parse(series) {
            super.parse(series);
            this.lowValue = parseFloat(this.low);
            this.openValue = parseFloat(this.open);
            this.closeValue = parseFloat(this.close);
            this.highValue = parseFloat(this.high);
            this.isNull || (this.isNull = isNaN(this.lowValue) || isNaN(this.openValue) || isNaN(this.closeValue));
        }
        _readArray(series, v) {
            const d = v.length > 4 ? 1 : 0;
            this.low = v[pickNum(series.lowField, 0 + d)];
            this.open = v[pickNum(series.openField, 1 + d)];
            this.close = v[pickNum(series.closeField, 2 + d)];
            this.y = this.high = v[pickNum(series.highField, 3 + d)];
            if (d > 0) {
                this.x = v[pickNum(series.xField, 0)];
            }
        }
        _readObject(series, v) {
            super._readObject(series, v);
            this.low = pickProp(v[series.lowField], v.row);
            this.open = pickProp(v[series.openField], v.open);
            this.close = pickProp(v[series.closeField], v.close);
            this.high = pickProp(v[series.highField], v.high);
            if (!isNaN(this.high))
                this.y = this.high;
            else if (!isNaN(this.y))
                this.high = this.y;
        }
        _readSingle(v) {
            super._readSingle(v);
            this.low = this.close = this.open = this.high = this.y;
        }
    }
    class CandlestickSeries extends RangedSeries {
        _type() {
            return 'candlestick';
        }
        canCategorized() {
            return true;
        }
        _createPoint(source) {
            return new CandlestickSeriesPoint(source);
        }
        _getBottomValue(p) {
            return p.lowValue;
        }
    }

    class DumbbellSeriesMarker extends SeriesMarker {
        constructor() {
            super(...arguments);
            this.radius = 4;
            this.shape = Shape.CIRCLE;
        }
    }
    class DumbbellSeriesPoint extends DataPoint {
        labelCount() {
            return 2;
        }
        getLabel(index) {
            return index === 0 ? this.lowValue : this.yValue;
        }
        _readArray(series, v) {
            const d = v.length > 2 ? 1 : 0;
            this.low = v[pickNum(series.lowField, 0 + d)];
            this.y = v[pickNum(series.yField, 1 + d)];
            if (d > 0) {
                this.x = v[pickNum(series.xField, 0)];
            }
        }
        _readObject(series, v) {
            super._readObject(series, v);
            this.low = pickProp(v[series.lowField], v.low);
            this.y = pickProp3(v[series.yField], v.y, v.value);
        }
        _readSingle(v) {
            super._readSingle(v);
            this.low = this.y;
        }
        parse(series) {
            super.parse(series);
            this.lowValue = parseFloat(this.low);
        }
    }
    class DumbbellSeries extends ClusterableSeries {
        constructor() {
            super(...arguments);
            this.marker = new DumbbellSeriesMarker(this);
        }
        _type() {
            return 'dumbbell';
        }
        canCategorized() {
            return true;
        }
        _createPoint(source) {
            return new DumbbellSeriesPoint(source);
        }
        _doPrepareRender() {
            super._doPrepareRender();
            const radius = this.marker.radius;
            const shape = this.marker.shape;
            this._runPoints.forEach((p) => {
                p.radius = radius;
                p.shape = shape;
            });
        }
        collectValues(axis, vals) {
            super.collectValues(axis, vals);
            if (vals && axis === this._yAxisObj) {
                this._runPoints.forEach(p => {
                    const v = p.lowValue;
                    !isNaN(v) && vals.push(v);
                });
            }
        }
    }

    class EqualizerSeriesPoint extends DataPoint {
    }
    class EqualizerSeries extends BasedSeries {
        constructor() {
            super(...arguments);
            this.segmentSize = 10;
            this.segmentGap = 4;
            this.segmented = false;
            this.backSegments = false;
        }
        getSegmentSize(domain) {
            return calcPercent(this._segmentDim, domain);
        }
        _type() {
            return 'equalizer';
        }
        canCategorized() {
            return true;
        }
        _createPoint(source) {
            return new EqualizerSeriesPoint(source);
        }
        _doLoad(src) {
            super._doLoad(src);
            this._segmentDim = parsePercentSize(this.segmentSize, false);
        }
    }

    class ErrorBarSeriesPoint extends DataPoint {
        labelCount() {
            return 2;
        }
        getLabel(index) {
            return index === 1 ? this.lowValue : this.yValue;
        }
        _readArray(series, v) {
            const d = v.length > 2 ? 1 : 0;
            this.low = v[pickNum(series.lowField, 0 + d)];
            this.y = v[pickNum(series.yField, 1 + d)];
            if (d > 0) {
                this.x = v[pickNum(series.xField, 0)];
            }
        }
        _readObject(series, v) {
            super._readObject(series, v);
            this.low = pickProp(v[series.lowField], v.low);
            this.y = pickProp3(v[series.yField], v.y, v.value);
        }
        _readSingle(v) {
            super._readSingle(v);
            this.low = this.y;
        }
        parse(series) {
            super.parse(series);
            this.lowValue = parseFloat(this.low);
            this.isNull || (this.isNull = isNaN(this.lowValue));
        }
    }
    class ErrorBarSeries extends RangedSeries {
        constructor() {
            super(...arguments);
            this.pointPadding = 0.3;
        }
        _type() {
            return 'errorbar';
        }
        clusterable() {
            return false;
        }
        _createPoint(source) {
            return new ErrorBarSeriesPoint(source);
        }
        _getBottomValue(p) {
            return p.lowValue;
        }
    }

    class FunnelSeriesPoint extends DataPoint {
    }
    class FunnelSeries extends WidgetSeries {
        constructor(chart, name) {
            super(chart, name);
            this.width = FunnelSeries.DEF_WIDTH;
            this.height = FunnelSeries.DEF_HEIGHT;
            this.neckWidth = FunnelSeries.DEF_NECK_WIDTH;
            this.neckHeight = FunnelSeries.DEF_NECK_WIDTH;
            this.reversed = false;
        }
        getSize(plotWidth, plotHeight) {
            return {
                width: calcPercent(this._widthDim, plotWidth),
                height: calcPercent(this._heightDim, plotHeight)
            };
        }
        getNeckSize(plotWidth, plotHeight) {
            return {
                width: calcPercent(this._neckWidthDim, plotWidth),
                height: calcPercent(this._neckHeightDim, plotHeight)
            };
        }
        _type() {
            return 'funnel';
        }
        _colorByPoint() {
            return true;
        }
        _createPoint(source) {
            return new FunnelSeriesPoint(source);
        }
        load(src) {
            super.load(src);
            this._widthDim = parsePercentSize2(this.width, FunnelSeries.DEF_WIDTH);
            this._heightDim = parsePercentSize2(this.height, FunnelSeries.DEF_HEIGHT);
            this._neckWidthDim = parsePercentSize2(this.neckWidth, FunnelSeries.DEF_NECK_WIDTH);
            this._neckHeightDim = parsePercentSize2(this.neckHeight, FunnelSeries.DEF_NECK_HEIGHT);
            return this;
        }
        prepareAfter() {
            super.prepareAfter();
            const pts = this._runPoints;
            let sum = 0;
            let y = 0;
            pts.forEach(p => {
                sum += p.yValue;
            });
            const cnt = pts.length;
            let i = 0;
            for (; i < cnt - 1; i++) {
                const p = pts[i];
                const h = fixnum(p.yValue / sum);
                p.yRate = h * 100;
                p.yPos = y;
                p.height = h;
                y += h;
            }
            pts[i].yPos = y;
            pts[i].height = 1 - y;
        }
    }
    FunnelSeries.DEF_WIDTH = '85%';
    FunnelSeries.DEF_HEIGHT = '90%';
    FunnelSeries.DEF_NECK_WIDTH = '30%';
    FunnelSeries.DEF_NECK_HEIGHT = '25%';

    class HeatmapSeriesPoint extends DataPoint {
        parse(series) {
            super.parse(series);
            this.heatValue = parseFloat(this.heat);
            this.isNull || (this.isNull = isNaN(this.heatValue));
        }
        _readArray(series, v) {
            const d = v.length > 2 ? 1 : 0;
            this.y = v[pickNum(series.yField, 0 + d)];
            this.heat = v[pickNum(series.heatField, 1 + d)];
            if (d > 0) {
                this.x = v[pickNum(series.xField, 0)];
            }
        }
        _readObject(series, v) {
            super._readObject(series, v);
            this.heat = pickProp(v[series.heatField], v.color);
        }
        _readSingle(v) {
            super._readSingle(v);
        }
        getLabel(index) {
            return this.heat;
        }
    }
    class HeatmapSeries extends Series {
        getColor(value) {
            return;
        }
        _type() {
            return 'heatmap';
        }
        canMixWith(other) {
            return false;
        }
        canCategorized() {
            return true;
        }
        defaultYAxisType() {
            return 'category';
        }
        _createPoint(source) {
            return new HeatmapSeriesPoint(source);
        }
        _doPrepareRender() {
            super._doPrepareRender();
            this._heatMin = Number.MAX_VALUE;
            this._heatMax = Number.MIN_VALUE;
            this._runPoints.forEach(p => {
                if (!isNaN(p.heatValue)) {
                    this._heatMin = Math.min(this._heatMin, p.heatValue);
                    this._heatMax = Math.max(this._heatMax, p.heatValue);
                }
            });
        }
    }

    class HistogramSeriesPoint extends DataPoint {
        parse(series) {
            super.parse(series);
            const v = this.source;
            this.min = v.min;
            this.max = v.max;
        }
    }
    var BinsNumber;
    (function (BinsNumber) {
        BinsNumber["SQURE_ROOT"] = "squreRoot";
        BinsNumber["STURGES"] = "struges";
        BinsNumber["RICE"] = "rice";
    })(BinsNumber || (BinsNumber = {}));
    const binsNumberFunc = {
        'squreRoot': function (length) {
            return Math.ceil(Math.sqrt(length));
        },
        'struges': function (length) {
            return Math.ceil(Math.log(length) * Math.LOG2E);
        },
        'rice': function (length) {
            return Math.ceil(2 * Math.pow(length, 1 / 3));
        },
    };
    class HistogramSeries extends Series {
        constructor() {
            super(...arguments);
            this.binsNumber = BinsNumber.SQURE_ROOT;
            this.baseValue = 0;
        }
        getBinCount(length) {
            const w = pickNum(this.binWidth, 0);
            if (w > 0) {
                return length / w;
            }
            const cnt = pickNum(this.binsNumber, 0);
            if (cnt < 1) {
                return binsNumberFunc[this.binsNumber || BinsNumber.SQURE_ROOT](length);
            }
        }
        _type() {
            return 'histogram';
        }
        ignoreAxisBase(axis) {
            return axis === this._xAxisObj;
        }
        _createPoint(source) {
            return new HistogramSeriesPoint(source);
        }
        _doLoadPoints(src) {
            function getValue(v) {
                let y;
                if (isArray(v)) {
                    y = v[pickNum(this.yField, 0)];
                }
                else if (isObject(v)) {
                    y = pickProp3(v[this.yField], v.y, v.value);
                }
                else {
                    y = v;
                }
                return parseFloat(y);
            }
            const pts = [];
            let sample = [];
            for (let i = 0; i < src.length; i++) {
                const v = getValue(src[i]);
                if (!isNaN(v)) {
                    sample.push(v);
                }
            }
            if (sample.length > 0) {
                sample = sample.sort((v1, v2) => v1 - v2);
                if (this.minValue < sample[0]) {
                    sample.unshift(this.minValue);
                }
                if (this.maxValue > sample[sample.length - 1]) {
                    sample.push(this.maxValue);
                }
                const len = sample.length;
                const min = sample[0];
                const max = sample[len - 1];
                const count = this.getBinCount(len);
                const interval = this._binInterval = (max - min) / count;
                let n = 0;
                let x = min;
                let x2 = x + interval;
                for (let i = 0; i < count; i++) {
                    let f = 0;
                    if (i == count - 1) {
                        f = len - n;
                    }
                    else {
                        while (n < len && (sample[n] < x2)) {
                            f++;
                            n++;
                        }
                    }
                    pts.push({
                        x: x,
                        y: f,
                        min: x,
                        max: (i === count - 1) ? max : x2
                    });
                    x = x2;
                    x2 = x + interval;
                }
            }
            super._doLoadPoints(pts);
        }
        collectValues(axis, vals) {
            super.collectValues(axis, vals);
            if (vals) {
                if (axis === this._xAxisObj) {
                    vals.push(this._runPoints[this._runPoints.length - 1].max);
                }
                else if (axis === this._yAxisObj) {
                    vals.push(this._base);
                }
            }
        }
        _doPrepareRender() {
            super._doPrepareRender();
            this._base = pickNum(this.baseValue, this._yAxisObj.getBaseValue());
        }
        getBaseValue(axis) {
            return axis === this._yAxisObj ? this._base : NaN;
        }
    }

    class LollipopSeriesMarker extends SeriesMarker {
        constructor() {
            super(...arguments);
            this.radius = 4;
            this.shape = Shape.CIRCLE;
        }
    }
    class LollipopSeriesPoint extends DataPoint {
    }
    class LollipopSeries extends BasedSeries {
        constructor() {
            super(...arguments);
            this.marker = new LollipopSeriesMarker(this);
        }
        _type() {
            return 'lollipop';
        }
        canCategorized() {
            return true;
        }
        getLabelOff(off) {
            return off + this.marker.radius;
        }
        _createPoint(source) {
            return new LollipopSeriesPoint(source);
        }
        _doPrepareRender() {
            super._doPrepareRender();
            const radius = this.marker.radius;
            const shape = this.marker.shape;
            this._runPoints.forEach((p) => {
                p.radius = radius;
                p.shape = shape;
            });
        }
    }

    class OhlcSeriesPoint extends CandlestickSeriesPoint {
    }
    class OhlcSeries extends CandlestickSeries {
        _type() {
            return 'ohlc';
        }
        _createPoint(source) {
            return new OhlcSeriesPoint(source);
        }
    }

    class ParetoSeriesPoint extends DataPoint {
        parse(series) {
            super.parse(series);
            this.xValue = this.x;
            this.yValue = this.y;
        }
    }
    class ParetoSeries extends LineSeriesBase {
        constructor() {
            super(...arguments);
            this.curved = false;
        }
        _type() {
            return 'pareto';
        }
        getLineType() {
            return this.curved ? LineType.SPLINE : LineType.DEFAULT;
        }
        _createPoint(source) {
            return new ParetoSeriesPoint(source);
        }
        _referOtherSeries(series) {
            if (series.name === this.source || series.index === this.source) {
                series.referBy(this);
                return true;
            }
        }
        reference(other, axis) {
            if (!axis._isX) {
                this.$_loadPoints(other._runPoints);
                this.collectValues(this._xAxisObj, this._xAxisObj._values);
                this.collectValues(this._yAxisObj, this._yAxisObj._values);
            }
        }
        $_loadPoints(pts) {
            const list = [];
            const sum = pts.reduce((a, c) => a + pickNum(c.yValue, 0), 0);
            let acc = 0;
            pts.forEach(p => {
                if (!p.isNull) {
                    list.push({
                        x: p.xValue,
                        y: acc += p.yValue * 100 / sum
                    });
                }
            });
            this._doLoadPoints(list);
            this._runPoints = this._points.getPoints();
        }
    }

    class PieSeriesPoint extends DataPoint {
        constructor() {
            super(...arguments);
            this.sliced = false;
            this.startAngle = 0;
            this.angle = 0;
        }
        get endAngle() {
            return this.startAngle + this.angle;
        }
        legendColor() {
            return this._calcedColor;
        }
        legendLabel() {
            return this.x;
        }
        legendVisible() {
            return this.visible;
        }
        parse(series) {
            super.parse(series);
            this.sliced = this.source.sliced;
        }
    }
    class PieSeries extends RadialSeries {
        constructor() {
            super(...arguments);
            this.groupSize = 1;
            this.innerSize = 0;
            this.sliceOffset = '7%';
            this.labelDistance = 25;
            this.exclusive = true;
            this.sliceDuration = 300;
            this.borderRadius = 0;
        }
        getInnerRadius(rd) {
            const dim = this._innerDim;
            return dim ? dim.size / (dim.fixed ? rd : 100) : 0;
        }
        getSliceOffset(rd) {
            return this._sliceDim ? calcPercent(this._sliceDim, rd) : 0;
        }
        getLabelPosition() {
            const p = this.pointLabel.position;
            return p === PointItemPosition.AUTO ? PointItemPosition.INSIDE : p;
        }
        _type() {
            return 'pie';
        }
        _colorByPoint() {
            return true;
        }
        _createPoint(source) {
            return new PieSeriesPoint(source);
        }
        getLegendSources(list) {
            this._runPoints.forEach(p => {
                list.push(p);
            });
        }
        _doLoad(src) {
            super._doLoad(src);
            this._innerDim = parsePercentSize(this.innerSize, true);
            this._sliceDim = parsePercentSize(this.sliceOffset, true);
        }
        _doPrepareRender() {
            super._doPrepareRender();
            this._groupPos = NaN;
        }
    }
    class PieSeriesGroup extends SeriesGroup {
        constructor() {
            super(...arguments);
            this.polarSize = '80%';
            this.innerSize = 0;
        }
        getPolarSize(width, height) {
            return calcPercent(this._polarDim, Math.min(width, height));
        }
        getInnerRadius(rd) {
            const dim = this._innerDim;
            return dim ? dim.size / (dim.fixed ? rd : 100) : 0;
        }
        _seriesType() {
            return 'pie';
        }
        needAxes() {
            return false;
        }
        _canContain(ser) {
            return ser instanceof PieSeries;
        }
        _doLoad(source) {
            super._doLoad(source);
            this._polarDim = parsePercentSize(this.polarSize, true) || { size: 80, fixed: false };
            this._innerDim = parsePercentSize(this.innerSize, true);
        }
        _doPrepareSeries(series) {
            if (this.layout === SeriesGroupLayout.STACK || this.layout === SeriesGroupLayout.FILL) {
                const sum = series.map(ser => ser.groupSize).reduce((a, c) => a + pickNum(c, 1), 0);
                let p = 0;
                series.forEach((ser) => {
                    ser._groupPos = p;
                    p += ser._groupSize = pickNum(ser.groupSize, 1) / sum;
                });
            }
        }
    }

    class ScatterSeriesPoint extends DataPoint {
    }
    class ScatterSeriesMarker extends SeriesMarker {
        constructor() {
            super(...arguments);
            this.radius = 5;
        }
    }
    class ScatterSeries extends Series {
        constructor(chart, name) {
            super(chart, name);
            this.jitterX = 0;
            this.jitterY = 0;
            this.marker = new ScatterSeriesMarker(this);
        }
        _type() {
            return 'scatter';
        }
        ignoreAxisBase(axis) {
            return true;
        }
        _createPoint(source) {
            return new ScatterSeriesPoint(source);
        }
    }

    class TreemapSeriesPoint extends DataPoint {
        _readArray(series, v) {
            super._readArray(series, v);
            this.id = toStr(v[parseInt(series.idField)]);
            this.group = toStr(v[parseInt(series.groupField)]);
        }
        _readObject(series, v) {
            super._readObject(series, v);
            this.id = toStr(v[series.idField]);
            this.group = toStr(v[series.groupField]);
        }
    }
    class TreeNode {
        constructor(point) {
            this.point = point;
        }
        getArea() {
            return { x: this.x, y: this.y, width: this.width, height: this.height };
        }
        setArea(x, y, w, h) {
            this.x = x;
            this.y = y;
            this.width = w;
            this.height = h;
        }
        getTotal() {
            return this.children.reduce((a, c) => a + c.value, 0);
        }
    }
    var TreemapAlgorithm;
    (function (TreemapAlgorithm) {
        TreemapAlgorithm["SQUARIFY"] = "squarify";
        TreemapAlgorithm["STRIP"] = "strip";
        TreemapAlgorithm["SLICE"] = "slice";
        TreemapAlgorithm["SLICE_DICE"] = "sliceDice";
    })(TreemapAlgorithm || (TreemapAlgorithm = {}));
    class TreemapSeries extends Series {
        constructor() {
            super(...arguments);
            this.idField = 'id';
            this.groupField = 'group';
            this.algorithm = TreemapAlgorithm.SQUARIFY;
            this.alternate = true;
            this._map = {};
        }
        buildMap(width, height) {
            function visit(node) {
                if (node.children) {
                    let sum = 0;
                    node.children.forEach((node, i) => {
                        visit(node);
                        sum += node.value;
                    });
                    node.value = sum;
                    node.children = node.children.sort((n1, n2) => n2.value - n1.value);
                    node.children.forEach((node, i) => {
                        node.index = i;
                    });
                }
                else {
                    leafs.push(node);
                    node.value = node.point ? node.point.yValue : 0;
                }
            }
            const vertical = this.startDir === 'vertical' || height > width;
            const leafs = this._leafs = [];
            this._roots.forEach((node, i) => {
                visit(node);
            });
            this._roots = this._roots.sort((n1, n2) => n2.value - n1.value);
            this._roots.forEach((node, i) => {
                node.index = i;
            });
            (this[this.algorithm] || this.squarify).call(this, this._roots, width, height, vertical);
            return this._leafs;
        }
        _type() {
            return 'treemap';
        }
        needAxes() {
            return false;
        }
        canMixWith(other) {
            return false;
        }
        _createPoint(source) {
            return new TreemapSeriesPoint(source);
        }
        getLabeledPoints() {
            return this._leafs.map(node => node.point);
        }
        _doPrepareRender() {
            super._doPrepareRender();
            this._roots = this.$_buildTree(this._runPoints);
        }
        $_buildTree(pts) {
            const roots = [];
            const list = [];
            const map = this._map;
            pts.forEach(p => {
                if (p.id || !p.isNull) {
                    const node = new TreeNode(p);
                    if (p.id) {
                        map[p.id] = node;
                    }
                    if (p.group) {
                        list.push(node);
                    }
                    else {
                        roots.push(node);
                    }
                }
            });
            for (let i = list.length - 1; i >= 0; i--) {
                const node = list[i];
                const g = map[node.point.group];
                if (node.parent = g) {
                    if (!g.children)
                        g.children = [];
                    g.children.push(node);
                    if (node.children)
                        list.splice(i, 1);
                }
                else {
                    roots.push(node);
                    list.splice(i, 1);
                }
            }
            return roots;
        }
        $_squarifyRow(nodes, area, dir, total) {
            const totalArea = area.width * area.height;
            const w = area.width;
            const h = area.height;
            let x = area.x;
            let y = area.y;
            let prevRate = Number.MAX_VALUE;
            let sum = 0;
            const list = [];
            while (nodes.length > 0) {
                let node;
                let wNode;
                let hNode;
                let pArea;
                let rate;
                node = nodes.shift();
                sum += node.value;
                pArea = sum * totalArea / total;
                if (dir === 1) {
                    wNode = pArea / h;
                    hNode = h * node.value / sum;
                }
                else {
                    hNode = pArea / w;
                    wNode = w * node.value / sum;
                }
                rate = Math.max(wNode / hNode, hNode / wNode);
                if (nodes.length > 0 && rate > prevRate) {
                    nodes.unshift(node);
                    sum -= node.value;
                    pArea = totalArea * sum / total;
                    if (dir === 1) {
                        hNode = h;
                        wNode = pArea / hNode;
                    }
                    else {
                        wNode = w;
                        hNode = pArea / wNode;
                    }
                    list.forEach(node => {
                        if (dir === 1) {
                            node.setArea(x, y, wNode, h * node.value / sum);
                            y += node.height;
                        }
                        else {
                            node.setArea(x, y, w * node.value / sum, hNode);
                            x += node.width;
                        }
                    });
                    if (dir === 1) {
                        area.x += wNode;
                        area.width -= wNode;
                    }
                    else {
                        area.y += hNode;
                        area.height -= hNode;
                    }
                    return total - sum;
                }
                else if (nodes.length === 0) {
                    pArea = totalArea * sum / total;
                    if (dir === 1) {
                        hNode = h;
                        wNode = pArea / hNode;
                    }
                    else {
                        wNode = w;
                        hNode = pArea / wNode;
                    }
                    list.push(node);
                    list.forEach(node => {
                        if (dir === 1) {
                            node.setArea(x, y, wNode, h * node.value / sum);
                            y += node.height;
                        }
                        else {
                            node.setArea(x, y, w * node.value / sum, hNode);
                            x += node.width;
                        }
                    });
                    return 0;
                }
                else {
                    prevRate = rate;
                    list.push(node);
                }
            }
        }
        $_squarify(roots, area, vertical, changeDir) {
            const nodes = roots.slice(0);
            let dir = vertical ? 1 : 0;
            let sum = roots.reduce((a, c) => a + c.value, 0);
            do {
                sum = this.$_squarifyRow(nodes, area, dir, sum);
                if (changeDir) {
                    dir = 1 - dir;
                }
            } while (sum > 0);
            roots.forEach(node => {
                if (node.children) {
                    this.$_squarify(node.children, node.getArea(), !vertical, true);
                }
            });
        }
        squarify(roots, width, height, vertical) {
            this.$_squarify(roots, { x: 0, y: 0, width, height }, vertical, true);
        }
        strip(roots, width, height, vertical) {
            this.$_squarify(roots, { x: 0, y: 0, width, height }, vertical, false);
        }
        $_sliceNext(node, area, dir, sum) {
            node.x = area.x;
            node.y = area.y;
            if (dir === 1) {
                const h = area.height * node.value / sum;
                node.width = area.width;
                node.height = h;
                area.y += h;
                area.height -= h;
            }
            else {
                const w = area.width * node.value / sum;
                node.height = area.height;
                node.width = w;
                area.x += w;
                area.width -= w;
            }
            if (node.children) {
                this.$_slice(node.children, node.getArea(), dir === 0, true);
            }
        }
        $_slice(roots, area, vertical, changeDir) {
            let sum = roots.reduce((a, c) => a + c.value, 0);
            let dir = vertical ? 1 : 0;
            roots.forEach(node => {
                this.$_sliceNext(node, area, dir, sum);
                sum -= node.value;
                if (changeDir) {
                    dir = 1 - dir;
                }
            });
        }
        slice(roots, width, height, vertical) {
            this.$_slice(roots, { x: 0, y: 0, width, height }, vertical, false);
        }
        sliceDice(roots, width, height, vertical) {
            this.$_slice(roots, { x: 0, y: 0, width, height }, vertical, true);
        }
    }

    class VectorSeriesPoint extends DataPoint {
        _readArray(series, v) {
            const d = v.length > 3 ? 1 : 0;
            this.y = v[pickNum(series.yField, 0 + d)];
            this.length = v[pickNum(series.lengthField, 1 + d)];
            this.angle = v[pickNum(series.angleField, 2 + d)];
            if (d > 0) {
                this.x = v[pickNum(series.xField, 0)];
            }
        }
        _readObject(series, v) {
            super._readObject(series, v);
            this.length = pickProp(v[series.lengthField], v.length);
            this.angle = pickProp(v[series.angleField], v.angle);
            this.y = pickProp3(v[series.yField], v.y, v.value);
        }
        _readSingle(v) {
            super._readSingle(v);
            this.length = this.angle = this.y;
        }
        parse(series) {
            super.parse(series);
            this.lengthValue = parseFloat(this.length);
            this.angleValue = parseFloat(this.angle);
            this.isNull || (this.isNull = isNaN(this.lengthValue) || isNaN(this.angleValue));
        }
    }
    var VectorOrigin;
    (function (VectorOrigin) {
        VectorOrigin["CENTER"] = "center";
        VectorOrigin["START"] = "start";
        VectorOrigin["END"] = "end";
    })(VectorOrigin || (VectorOrigin = {}));
    var ArrowHead;
    (function (ArrowHead) {
        ArrowHead["NONE"] = "none";
        ArrowHead["CLOSE"] = "close";
        ArrowHead["OPEN"] = "open";
    })(ArrowHead || (ArrowHead = {}));
    class VectorSeries extends Series {
        constructor() {
            super(...arguments);
            this.origin = VectorOrigin.CENTER;
            this.maxLength = 20;
            this.startAngle = 0;
            this.arrowHead = ArrowHead.CLOSE;
        }
        _type() {
            return 'vector';
        }
        ignoreAxisBase(axis) {
            return true;
        }
        _createPoint(source) {
            return new VectorSeriesPoint(source);
        }
        _doLoad(src) {
            super._doLoad(src);
        }
        _doPrepareRender() {
            super._doPrepareRender();
            const pts = this._runPoints;
            if (pts.length > 0) {
                const len = this.maxLength;
                const org = this.origin;
                const max = pts.map(p => p.length).reduce((r, c) => Math.max(r, c));
                pts.forEach(p => {
                    const f = p.length / max;
                    p._len = f * len;
                    switch (org) {
                        case VectorOrigin.START:
                            p._off = p._len / 2;
                            break;
                        case VectorOrigin.END:
                            p._off = p._len / 2;
                            break;
                        default:
                            p._off = 0;
                            break;
                    }
                });
            }
        }
    }

    class WaterfallSeriesPoint extends DataPoint {
        constructor() {
            super(...arguments);
            this.low = 0;
        }
        parse(series) {
            super.parse(series);
            this._isSum = this.source.isSum === true;
            this._intermediate = this.source.intermediate;
            if (this._isSum)
                this.y = 0;
            this.save = this.y;
        }
    }
    class WaterfallSeries extends RangedSeries {
        constructor(chart, name) {
            super(chart, name);
        }
        _type() {
            return 'waterfall';
        }
        canCategorized() {
            return true;
        }
        _createPoint(source) {
            return new WaterfallSeriesPoint(source);
        }
        _doPrepareRender() {
            super._doPrepareRender();
            const pts = this._runPoints;
            if (pts.length < 1)
                return;
            let p = pts[0];
            let yPrev = p.y = p._isSum ? 0 : p.y;
            let prev = yPrev;
            let total = yPrev;
            let sum = yPrev;
            let low = 0;
            let v;
            let y;
            for (let i = 1, cnt = pts.length; i < cnt; i++) {
                p = pts[i];
                if (p._isSum) {
                    const pPrev = pts[i - 1];
                    const inter = p._intermediate === true || i < cnt - 1 && p._intermediate !== false;
                    const v = p.save = p.y = inter ? sum : total;
                    p.yGroup = p.yValue = p.y;
                    if (inter) {
                        if (sum < 0) {
                            low = pPrev.low;
                            y = low - v;
                        }
                        else {
                            y = pPrev.y;
                            low = y - v;
                        }
                    }
                    else {
                        low = pts[0].low;
                        y = low + v;
                    }
                    sum = 0;
                }
                else {
                    v = p.y;
                    if (v < 0) {
                        if (prev < 0) {
                            y = yPrev + prev;
                            low = y + v;
                        }
                        else {
                            y = yPrev;
                            low = y + v;
                        }
                    }
                    else {
                        if (prev < 0) {
                            low = yPrev;
                            y = low + v;
                        }
                        else {
                            low = yPrev;
                            y = low + v;
                        }
                    }
                    sum += v;
                    total += v;
                }
                prev = p.y;
                p.y = yPrev = y;
                p.low = low;
            }
        }
        _getBottomValue(p) {
            p.y = p.save;
            return NaN;
        }
    }

    const group_types = {
        'bar': BarSeriesGroup,
        'line': LineSeriesGroup,
        'area': AreaSeriesGroup,
        'pie': PieSeriesGroup,
        'bargroup': BarSeriesGroup,
        'linegroup': LineSeriesGroup,
        'areagroup': AreaSeriesGroup,
        'piegroup': PieSeriesGroup,
        'bump': BumpSeriesGroup
    };
    const series_types$1 = {
        'area': AreaSeries,
        'arearange': AreaRangeSeries,
        'bar': BarSeries,
        'barrange': BarRangeSeries,
        'bellcurve': BellCurveSeries,
        'boxplot': BoxPlotSeries,
        'bubble': BubbleSeries,
        'candlestick': CandlestickSeries,
        'dumbbell': DumbbellSeries,
        'equalizer': EqualizerSeries,
        'errorbar': ErrorBarSeries,
        'funnel': FunnelSeries,
        'heatmap': HeatmapSeries,
        'histogram': HistogramSeries,
        'line': LineSeries,
        'lollipop': LollipopSeries,
        'ohlc': OhlcSeries,
        'pareto': ParetoSeries,
        'pie': PieSeries,
        'scatter': ScatterSeries,
        'treemap': TreemapSeries,
        'vector': VectorSeries,
        'waterfall': WaterfallSeries,
    };
    const axis_types = {
        'category': CategoryAxis,
        'linear': LinearAxis,
        'time': TimeAxis,
        'date': TimeAxis,
        'log': LogAxis
    };
    class Credits extends ChartItem {
        constructor() {
            super(...arguments);
            this.text = 'RealChart v1.0';
            this.url = 'http://realgrid.com';
            this.floating = false;
            this.align = Align.RIGHT;
            this.verticalAlign = VerticalAlign.BOTTOM;
            this.offsetX = 2;
            this.offsetY = 1;
        }
    }
    class ChartOptions extends ChartItem {
        constructor() {
            super(...arguments);
            this.polar = false;
            this.animatable = true;
            this.xStart = 0;
            this.xStep = 1;
            this.axisGap = 8;
            this.credits = new Credits(null);
        }
    }
    class Chart extends RcEventProvider {
        constructor(source) {
            super();
            this.type = 'bar';
            this._assets = new AssetCollection();
            this._options = new ChartOptions(this);
            this._title = new Title(this);
            this._subtitle = new Subtitle(this);
            this._legend = new Legend(this);
            this._series = new PlottingItemCollection(this);
            this._xAxes = new AxisCollection(this, true);
            this._yAxes = new AxisCollection(this, false);
            this._body = new Body(this);
            source && this.load(source);
            this._polar = this.options.polar === true;
        }
        startAngle() {
            return this.body.getStartAngle();
        }
        get xStart() {
            return +this._options.xStart;
        }
        get xStep() {
            return +this._options.xStep;
        }
        get xStepUnit() {
            return;
        }
        animatable() {
            return this._options.animatable !== false;
        }
        get assets() {
            return this._assets;
        }
        get options() {
            return this._options;
        }
        get title() {
            return this._title;
        }
        get subtitle() {
            return this._subtitle;
        }
        get first() {
            return this._series.first;
        }
        get firstSeries() {
            return this._series.firstSeries;
        }
        get legend() {
            return this._legend;
        }
        get xAxis() {
            return this._xAxes.first;
        }
        get yAxis() {
            return this._yAxes.first;
        }
        get body() {
            return this._body;
        }
        needAxes() {
            return this._series.needAxes();
        }
        _getSeries() {
            return this._series;
        }
        _getXAxes() {
            return this._xAxes;
        }
        _getYAxes() {
            return this._yAxes;
        }
        isInverted() {
            return !this._polar && this._inverted;
        }
        isEmpty() {
            return this._series.isEmpty();
        }
        seriesByName(series) {
            return this._series.get(series);
        }
        axisByName(axis) {
            return this._xAxes.get(axis) || this._yAxes.get(axis);
        }
        containsAxis(axis) {
            return this._xAxes.contains(axis) || this._yAxes.contains(axis);
        }
        getAxes(dir) {
            const xAxes = this._xAxes.items;
            const yAxes = this._yAxes.items;
            let axes;
            if (this.isInverted()) {
                switch (dir) {
                    case SectionDir.LEFT:
                        axes = xAxes.filter(a => !a._isOpposite);
                        break;
                    case SectionDir.RIGHT:
                        axes = xAxes.filter(a => a._isOpposite);
                        break;
                    case SectionDir.BOTTOM:
                        axes = yAxes.filter(a => !a._isOpposite);
                        break;
                    case SectionDir.TOP:
                        axes = yAxes.filter(a => a._isOpposite);
                        break;
                }
            }
            else {
                switch (dir) {
                    case SectionDir.LEFT:
                        axes = yAxes.filter(a => !a._isOpposite);
                        break;
                    case SectionDir.RIGHT:
                        axes = yAxes.filter(a => a._isOpposite);
                        break;
                    case SectionDir.BOTTOM:
                        axes = xAxes.filter(a => !a._isOpposite);
                        break;
                    case SectionDir.TOP:
                        axes = xAxes.filter(a => a._isOpposite);
                        break;
                }
            }
            return axes || [];
        }
        _getLegendSources() {
            return this._series.getLegendSources();
        }
        load(source) {
            ['type', 'inverted'].forEach(prop => {
                if (prop in source) {
                    this[prop] = source[prop];
                }
            });
            this._assets.load(source.assets);
            this._options.load(source.options);
            this._title.load(source.title);
            this._subtitle.load(source.subtitle);
            this._legend.load(source.legend);
            this._series.load(source.series);
            this._xAxes.load(source.xAxes || source.xAxis || {});
            this._yAxes.load(source.yAxes || source.yAxis || {});
            this._body.load(source.plot);
            this._inverted = this.inverted;
        }
        _connectSeries(series, isX) {
            return isX ? this._xAxes.connect(series) : this._yAxes.connect(series);
        }
        prepareRender() {
            this._xAxes.disconnect();
            this._yAxes.disconnect();
            this._series.prepareRender();
            this._xAxes.collectValues();
            this._yAxes.collectValues();
            this._xAxes.collectReferentsValues();
            this._yAxes.collectReferentsValues();
            this._xAxes.prepareRender();
            this._yAxes.prepareRender();
            this._series.prepareAfter();
            this._legend.prepareRender();
        }
        layoutAxes(width, height, inverted, phase) {
            this._xAxes.buildTicks(inverted ? height : width);
            this._yAxes.buildTicks(inverted ? width : height);
            this.$_calcAxesPoints(width, height, inverted, 0);
        }
        calcAxesPoints(width, height, inverted) {
            this.$_calcAxesPoints(width, height, inverted, 1);
        }
        $_calcAxesPoints(width, height, inverted, phase) {
            let len = inverted ? height : width;
            this._xAxes.forEach(axis => {
                axis.calcPoints(len, phase);
            });
            len = inverted ? width : height;
            this._yAxes.forEach(axis => {
                axis.calcPoints(len, phase);
            });
        }
        update() {
        }
        _getGroupType(type) {
            return group_types[type];
        }
        _getSeriesType(type) {
            return series_types$1[String(type).toLowerCase()];
        }
        _getAxisType(type) {
            return axis_types[String(type).toLowerCase()];
        }
        getAxesGap() {
            return this._options.axisGap || 0;
        }
        _visibleChanged(item) {
            this._fireEvent('onVisibleChanged', item);
        }
        _modelChanged(item) {
        }
    }

    class ChartPointerHandler {
        constructor(chart) {
            this._chart = chart;
        }
        handleMove(ev) {
            const x = ev.pointX;
            const y = ev.pointY;
            const body = this._chart.chartView().bodyView();
            body.pointerMoved(body.controlToElement(x, y), ev.target);
        }
        handleClick(ev) {
            const chart = this._chart.chartView();
            const elt = ev.target;
            let credit;
            let legend;
            let series;
            if (legend = chart.legendByDom(elt)) {
                legend.source.visible = !legend.source.visible;
            }
            else if (series = chart.seriesByDom(elt)) {
                series.clicked(elt);
            }
            else if (credit = chart.creditByDom(elt)) {
                credit.clicked(elt);
            }
        }
        handleDblClick(ev) {
        }
        handleWheel(ev) {
        }
    }

    class Point {
        static empty() {
            return new Point();
        }
        static create(x = 0, y = 0) {
            return new Point(x, y);
        }
        constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
        }
        get isEmpty() {
            return this.x === 0 || this.y === 0;
        }
        clone() {
            return new Point(this.x, this.y);
        }
        equals(sz) {
            return sz === this
                || sz && this.x === sz.x && this.y === sz.y;
        }
        setEmpty() {
            this.x = this.y = 0;
            return this;
        }
        set(x, y) {
            this.x = x;
            this.y = y;
            return this;
        }
        round() {
            const pt = this.clone();
            pt.x >>>= 0;
            pt.y >>>= 0;
            return pt;
        }
        toString() {
            return "{x: " + this.x + ", y: " + this.y + "}";
        }
    }

    class Size {
        static empty() {
            return new Size();
        }
        static create(w = 0, h = 0) {
            return new Size(w, h);
        }
        constructor(width = 0, height = 0) {
            this.width = width;
            this.height = height;
        }
        get isEmpty() {
            return this.width === 0 || this.height === 0;
        }
        clone() {
            return new Size(this.width, this.height);
        }
        equals(sz) {
            return sz === this
                || sz && this.width === sz.width && this.height === sz.height;
        }
        setEmpty() {
            this.width = this.height = 0;
            return this;
        }
        set(width, height) {
            this.width = width;
            this.height = height;
            return this;
        }
        round() {
            const sz = this.clone();
            sz.width >>>= 0;
            sz.height >>>= 0;
            return sz;
        }
        toString() {
            return "{width: " + this.width + ", height: " + this.height + "}";
        }
    }
    Size.EMPTY = new Size();

    class GroupElement extends RcElement {
        constructor(doc, styleName = _undefined) {
            super(doc, styleName, 'g');
            this._doInitChildren(doc);
        }
        _movable() {
            return false;
        }
        setAttr(attr, value) {
            if (!GroupElement.IGNORE_ATTRS.hasOwnProperty(attr)) {
                super.setAttr(attr, value);
            }
            return this;
        }
        _doInitChildren(doc) {
        }
    }
    GroupElement.IGNORE_ATTRS = {
        width: '',
        height: ''
    };

    class Color {
        static isBright(color) {
            return new Color(color).isBright();
        }
        static getContrast(color, darkColor, brightColor) {
            return new Color(color).getContrast(darkColor, brightColor);
        }
        static interpolate(c1, c2, delta) {
            const r1 = (c1 & 0xff0000) >> 16;
            const g1 = (c1 & 0xff00) >> 8;
            const b1 = c1 & 0xff;
            const r2 = (c2 & 0xff0000) >> 16;
            const g2 = (c2 & 0xff00) >> 8;
            const b2 = c2 & 0xff;
            const r = r1 + (r2 - r1) * delta;
            const g = g1 + (g2 - g1) * delta;
            const b = b1 + (b2 - b1) * delta;
            return (r << 16) + (g << 8) + b;
        }
        constructor(color) {
            this.r = 0;
            this.g = 0;
            this.b = 0;
            this.a = 1;
            if (color = color && color.trim()) {
                if (Utils.startsWith(color, 'rgb(') && Utils.endsWith(color, ')')) {
                    this.$_parseRgb(color.substring(4, color.length - 1));
                }
                else if (Utils.startsWith(color, 'rgba(') && Utils.endsWith(color, ')')) {
                    this.$_parseRgb(color.substring(5, color.length - 1));
                }
                else if (Utils.startsWith(color, '#')) {
                    this.$_parseNumber(color.substr(1));
                }
            }
        }
        get rgba() {
            return "rgba(" + [this.r, this.g, this.b, this.a].join(',') + ")";
        }
        isBright() {
            const r = this.r * 0.299;
            const g = this.g * 0.587;
            const b = this.b * 0.114;
            return r + g + b > 140;
        }
        getContrast(darkColor, brightColor) {
            return this.isBright() ? (darkColor || '#000000') : (brightColor || '#FFFFFF');
        }
        brighten(rate, color = null) {
            color = color || new Color(null);
            color.r = Math.ceil(this.r + (255 - this.r) * rate);
            color.g = Math.ceil(this.g + (255 - this.g) * rate);
            color.b = Math.ceil(this.b + (255 - this.b) * rate);
            color.a = this.a;
            return color;
        }
        toString() {
            return this.rgba;
        }
        $_parseRgb(s) {
            const arr = s.split(/\,\s*/);
            if (arr.length >= 3) {
                this.r = +arr[0];
                this.g = +arr[1];
                this.b = +arr[2];
                if (arr.length >= 4) {
                    this.a = +arr[3];
                }
                else {
                    this.a = 1;
                }
            }
        }
        $_parseNumber(s) {
            const len = s.length;
            let color;
            if (len > 6) {
                color = parseInt(s.substr(0, 6), 16);
                this.a = parseInt(s.substring(6), 16) / 0xff;
            }
            else if (len > 0) {
                if (len === 3) {
                    s = s.charAt(0) + s.charAt(0) + s.charAt(1) + s.charAt(1) + s.charAt(2) + s.charAt(2);
                }
                color = parseInt(s, 16);
            }
            this.r = (color & 0xff0000) >> 16;
            this.g = (color & 0xff00) >> 8;
            this.b = color & 0xff;
        }
    }

    var TextAnchor;
    (function (TextAnchor) {
        TextAnchor["START"] = "start";
        TextAnchor["MIDDLE"] = "middle";
        TextAnchor["END"] = "end";
    })(TextAnchor || (TextAnchor = {}));
    var TextLayout;
    (function (TextLayout) {
        TextLayout["TOP"] = "top";
        TextLayout["MIDDLE"] = "middle";
        TextLayout["BOTTOM"] = "bottom";
    })(TextLayout || (TextLayout = {}));
    var TextOverflow;
    (function (TextOverflow) {
        TextOverflow["TRUNCATE"] = "truncate";
        TextOverflow["WRAP"] = "wrap";
        TextOverflow["ELLIPSIS"] = "ellipsis";
    })(TextOverflow || (TextOverflow = {}));
    class TextElement extends RcElement {
        constructor(doc, styleName = _undefined) {
            super(doc, styleName, 'text');
            this._layout = TextLayout.TOP;
            this._overflow = TextOverflow.WRAP;
            this._dirty = true;
            this._text = '';
            this.setAttr('text-anchor', 'middle');
        }
        get text() {
            return this._text;
        }
        set text(value) {
            value = value || '';
            if (value !== this._text) {
                this._dirty = true;
                this.dom.textContent = this._text = value;
                this.layoutText();
            }
        }
        get anchor() {
            return this.getAttr('text-anchor');
        }
        set anchor(value) {
            if (value !== this.anchor) {
                this.setAttr('text-anchor', value);
            }
        }
        get layout() {
            return this._layout;
        }
        set layout(value) {
            if (value !== this._layout) {
                this._layout = value;
                this.layoutText();
            }
        }
        get overflow() {
            return this._overflow;
        }
        set overflow(value) {
            if (value !== this._overflow) {
                this._overflow = value;
                this.layoutText();
            }
        }
        get svg() {
            return this.dom.innerHTML;
        }
        set svg(value) {
            value = value || '';
            this.dom.innerHTML = value;
        }
        get opacity() {
            return this.getAttr('fill-opacity');
        }
        set opacity(value) {
            this.setAttr('fill-opacity', value);
        }
        getAscent(height) {
            return 0.75 * height;
        }
        layoutText(lineHeight) {
            const r = this.getBBounds();
            const ascent = this.getAscent(isNaN(lineHeight) ? r.height : lineHeight);
            let y;
            switch (this._layout) {
                case TextLayout.MIDDLE:
                    y = Math.floor(ascent / 2);
                    break;
                case TextLayout.BOTTOM:
                    y = ascent - r.height;
                    break;
                default:
                    y = Math.ceil(ascent);
                    break;
            }
            this.setAttr('y', y);
        }
        isFitIn(bounds) {
            return this.calcWidth() >= bounds;
        }
        calcWidth() {
            const len = this._text.length;
            return len && this.dom.getSubStringLength(0, len);
        }
        calcRangeWidth(start = 0, end = Number.MAX_SAFE_INTEGER) {
            start = Math.max(0, start);
            end = Math.min(this._text.length, end);
            return end > start ? this.dom.getSubStringLength(start, end - start) : 0;
        }
        truncate(bounds, ellipsis) {
            let s = this._text;
            if (!s)
                return;
            const span = this.dom;
            let x1 = 0;
            let x2 = s.length;
            let x;
            do {
                x = Math.ceil((x1 + x2) / 2);
                const w = span.getSubStringLength(0, x);
                if (w > bounds) {
                    x2 = x - 1;
                }
                else {
                    x1 = x;
                }
            } while (x1 < x2);
            this.text = s.substring(0, x1) + ELLIPSIS;
            while (x1 > 0 && this.calcWidth() > bounds) {
                this.text = s.substring(0, --x1) + ELLIPSIS;
            }
        }
        setContrast(target, darkStyle, brightStyle) {
            this.setStyleOrClass(Color.isBright(getComputedStyle(target).fill) ? darkStyle : brightStyle);
            return this;
        }
        clearDom() {
            super.clearDom();
            this._dirty = true;
        }
        setStyles(styles) {
            let changed = super.setStyles(styles);
            if (changed) {
                this.layoutText();
            }
            return changed;
        }
        setStyle(prop, value) {
            let changed = super.setStyle(prop, value);
            if (changed) {
                this.layoutText();
            }
            return changed;
        }
        getBBounds() {
            if (this._dirty || this._styleDirty) {
                this._bounds = this.dom.getBBox();
                this._dirty = this._styleDirty = false;
            }
            return this._bounds;
        }
        getBBoundsTest() {
            if (this._dirty || this._styleDirty) {
                this._bounds = {
                    x: this.x,
                    y: this.y,
                    width: 100,
                    height: 30
                };
                this._dirty = this._styleDirty = false;
            }
            return this._bounds;
        }
    }

    class LineElement extends PathElement {
        constructor(doc, styleName = _undefined, line = _undefined) {
            super(doc, styleName);
            this.setAttr('shapeRendering', 'cripsEdges');
            line && this.setLine(line);
        }
        setLine(x1, y1, x2, y2) {
            if (Utils.isNumber(x1)) {
                this.setPath(SvgShapes.line(x1, y1, x2, y2));
            }
            else if (x1) {
                this.setPath(SvgShapes.line(x1.x1, x1.y1, x1.x2, x1.y2));
            }
        }
        setVLine(x, y1, y2) {
            this.setPath(SvgShapes.line(x, y1, x, y2));
        }
        setVLineC(x, y1, y2) {
            this.setPath(SvgShapes.line(x, y1, x, y2));
        }
        setHLine(y, x1, x2) {
            this.setPath(SvgShapes.line(x1, y, x2, y));
        }
        setHLineC(y, x1, x2) {
            this.setPath(SvgShapes.line(x1, y, x2, y));
        }
    }

    class Sides {
        static create(top, bottom, left, right) {
            if (!isNaN(left)) {
                return new Sides(top, bottom, left, right);
            }
            else if (!isNaN(bottom)) {
                return new Sides(top, top, bottom, bottom);
            }
            else {
                return new Sides(top, top, top, top);
            }
        }
        static createFrom(value) {
            const vals = value.split(/\s*[\s,]+\s*/g);
            return this.create.call(null, ...vals.map(v => +v));
        }
        constructor(top = 0, bottom = 0, left = 0, right = 0) {
            this.top = top;
            this.bottom = bottom;
            this.left = left;
            this.right = right;
        }
        clone() {
            return new Sides(this.top, this.bottom, this.left, this.right);
        }
        applyPadding(cs) {
            this.left = pickNum(cs.paddingLeft, 0);
            this.right = pickNum(cs.paddingRight, 0);
            this.top = pickNum(cs.paddingTop, 0);
            this.bottom = pickNum(cs.paddingBottom, 0);
            return this;
        }
        applyMargin(cs) {
            this.left = pickNum(cs.marginLeft, 0);
            this.right = pickNum(cs.marginRight, 0);
            this.top = pickNum(cs.marginTop, 0);
            this.bottom = pickNum(cs.marginBottom, 0);
            return this;
        }
        shrink(r) {
            return {
                x: r.x + this.left,
                y: r.y + this.top,
                width: r.width - this.left - this.right,
                height: r.height - this.top - this.bottom
            };
        }
        toString() {
            return "{top: " + this.top + ", bottom: " + this.bottom + ", left: " + this.left + ", right: " + this.right + "}";
        }
    }
    Sides.Empty = Object.freeze(new Sides());
    Sides.Temp = new Sides();

    class RectElement extends RcElement {
        static create(doc, styleName, x, y, width, height, r = 0) {
            return new RectElement(doc, styleName, {
                x: x,
                y: y,
                width: width,
                height: height,
                r: r
            });
        }
        constructor(doc, styleName = _undefined, rect = _undefined) {
            super(doc, styleName, 'rect');
            this.rect = rect;
            this.setAttr('shapeRendering', 'cripsEdges');
        }
        get rect() {
            return this._rect && Object.assign({}, this._rect);
        }
        set rect(value) {
            if (value !== this._rect) {
                this._rect = value && Object.assign({}, value);
                if (value) {
                    this.setRect(value);
                    let rx = value.rx || value.r;
                    let ry = value.ry || value.r;
                    rx > 0 && this.dom.setAttribute('rx', String(rx));
                    ry > 0 && this.dom.setAttribute('rx', String(ry));
                }
            }
        }
        setBounds(x, y, width, height, r = 0) {
            this.rect = { x, y, width, height, r };
            return this;
        }
        setBox(x, y, width, height) {
            if (height < 0) {
                this.rect = { x, y: y + height, width, height: -height };
            }
            else {
                this.rect = { x, y, width, height };
            }
        }
        setRadius(value) {
            if (value > 0) {
                if (this._rect) {
                    this._rect.rx = this._rect.ry = value;
                }
                this.dom.setAttribute('rx', String(value));
                this.dom.setAttribute('ry', String(value));
            }
        }
    }
    class BoxElement extends PathElement {
        constructor(doc, styleName = _undefined) {
            super(doc, styleName);
        }
        setBox(x1, y1, x2, y2) {
            this.setPath(SvgShapes.box(x1, y1, x2, y2));
            return this;
        }
    }

    class ChartElement extends RcElement {
        constructor(doc, styleName = _undefined) {
            super(doc, styleName, 'g');
            if (RcElement.DEBUGGING) {
                this.add(this._debugRect = new RectElement(doc, 'rct-debug'));
                this._debugRect.setAttr('pointerEvents', 'none');
            }
        }
        chart() {
            return this.model.chart;
        }
        measure(doc, model, hintWidth, hintHeight, phase) {
            this.setStyleOrClass(model.style);
            if (model !== this.model) {
                this.model = model;
                this._doModelChanged();
            }
            const sz = this._doMeasure(doc, this.model, hintWidth, hintHeight, phase);
            this.mw = sz.width;
            this.mh = sz.height;
            return sz;
        }
        layout(param) {
            this._doLayout(param);
            if (RcElement.DEBUGGING) {
                if (!this._debugRect) {
                    this.insertFirst(this._debugRect = new RectElement(this.doc, 'rct-debug'));
                }
                if (this.width > 1 && this.height > 1) {
                    this._debugRect.setRect(this._getDebugRect());
                }
            }
            else if (this._debugRect) {
                this._debugRect.remove();
                this._debugRect = null;
            }
            return this;
        }
        resizeByMeasured() {
            this.resize(this.mw, this.mh);
            return this;
        }
        _getDebugRect() {
            return {
                x: 0,
                y: 0,
                width: this.width,
                height: this.height
            };
        }
        _invalidate() {
            var _a;
            (_a = this.control) === null || _a === void 0 ? void 0 : _a.invalidateLayout();
        }
        _doModelChanged() {
        }
    }
    class BoundableElement extends ChartElement {
        constructor(doc, styleName, backStyle) {
            super(doc, styleName);
            this._margins = new Sides();
            this._paddings = new Sides();
            this.add(this._background = new RectElement(doc, backStyle));
        }
        _getDebugRect() {
            return this._margins.shrink(super._getDebugRect());
        }
        measure(doc, model, hintWidth, hintHeight, phase) {
            this.setStyleOrClass(model.style);
            if (model !== this.model) {
                this.model = model;
                this._doModelChanged();
            }
            this._setBackgroundStyle(this._background);
            const cs = getComputedStyle(this.dom);
            const csBack = getComputedStyle(this._background.dom);
            const padding = this._paddings;
            const margin = this._margins;
            padding.applyPadding(csBack);
            this._borderRadius = parseFloat(csBack.borderRadius) || 0;
            margin.applyMargin(cs);
            const sz = this._doMeasure(doc, model, hintWidth, hintHeight, phase);
            sz.height += margin.top + margin.bottom + padding.top + padding.bottom;
            sz.width += margin.left + margin.right + padding.left + padding.right;
            this.mw = sz.width;
            this.mh = sz.height;
            return sz;
        }
        layout(param) {
            super.layout(param);
            const margin = this._margins;
            this._background.setBounds(margin.left + this._getBackOffset(), margin.top, this.width - margin.left - margin.right, this.height - margin.top - margin.bottom, this._borderRadius);
            return this;
        }
        _getBackOffset() {
            return 0;
        }
    }

    class AxisTitleView extends BoundableElement {
        constructor(doc) {
            super(doc, AxisTitleView.TITLE_CLASS, 'rct-axis-title-background');
            this.add(this._textView = new TextElement(doc));
        }
        _setBackgroundStyle(back) {
            back.setStyleOrClass(this.model.backgroundStyle);
        }
        _getBackOffset() {
            return -this.width / 2;
        }
        _doMeasure(doc, model, hintWidth, hintHeight, phase) {
            this.rotation = 0;
            this._textView.text = model.text;
            return toSize(this._textView.getBBounds());
        }
        _doLayout(isHorz) {
            const padding = this._paddings;
            const margin = this._margins;
            if (!isHorz) {
                this.setRotaion(0, this.height / 2, this.model.axis.position === AxisPosition.OPPOSITE ? 90 : 270);
            }
            this._textView.translateY(margin.top + padding.top);
        }
        layout(param) {
            super.layout(param);
            if (this._debugRect) {
                this._debugRect.setBounds(-this.width / 2, 0, this.width, this.height);
            }
            return this;
        }
    }
    AxisTitleView.TITLE_CLASS = 'rct-axis-title';
    class AxisTickMarkView extends ChartElement {
        constructor(doc) {
            super(doc, AxisView.TICK_CLASS);
            this.add(this._lineView = new LineElement(doc));
        }
        _doMeasure(doc, model, hintWidth, hintHeight, phase) {
            return Size.create(hintWidth, hintHeight);
        }
        _doLayout(param) {
            if (this.model.axis._isHorz) {
                this._lineView.setVLineC(0, 0, this.height);
            }
            else {
                this._lineView.setHLineC(0, 0, this.width);
            }
        }
    }
    class AxisLabelElement extends TextElement {
        constructor() {
            super(...arguments);
            this.index = -1;
            this.col = 0;
            this.row = 0;
            this.tickWidth = 0;
        }
        get rotatedWidth() {
            const d = this.rotation * DEG_RAD;
            const r = this.getBBounds();
            return Math.abs(Math.sin(d) * r.height) + Math.abs(Math.cos(d) * r.width);
        }
        get rotatedHeight() {
            const d = this.rotation * DEG_RAD;
            const r = this.getBBounds();
            return Math.abs(Math.cos(d) * r.height) + Math.abs(Math.sin(d) * r.width);
        }
    }
    class AxisView extends ChartElement {
        constructor(doc) {
            super(doc, AxisView.AXIS_CLASS);
            this._markViews = [];
            this._labelViews = [];
            this.add(this._lineView = new LineElement(doc, AxisView.LINE_CLASS));
            this.add(this._titleView = new AxisTitleView(doc));
            this.add(this._markContainer = new RcElement(doc, 'rct-axis-tick-marks'));
            this.add(this._labelContainer = new RcElement(doc, 'rct-axis-tick-labels'));
        }
        checkHeight(doc, width, height) {
            const m = this.model;
            let h = m.tick.visible ? m.tick.length : 0;
            if (this.$_prepareLabels(doc, m)) {
                h += this.$_measureLabelsHorz(m, this._labelViews, width);
            }
            if (this._titleView.visible = m.title.isVisible()) {
                h += this._titleView.measure(doc, m.title, width, height, 1).height;
                h += m.title.gap;
            }
            return h;
        }
        checkWidth(doc, width, height) {
            const m = this.model;
            let w = m.tick.visible ? m.tick.length : 0;
            if (this.$_prepareLabels(doc, m)) {
                w += this.$_measureLabelsVert(this._labelViews);
            }
            if (this._titleView.visible = m.title.isVisible()) {
                w += this._titleView.measure(doc, m.title, width, height, 1).height;
                w += m.title.gap;
            }
            return w;
        }
        prepareGuides(doc, container, frontContainer) {
            let guides = this.model.guides.filter(g => !g.front);
            container.addAll(doc, guides);
            guides = this.model.guides.filter(g => g.front);
            frontContainer.addAll(doc, guides);
        }
        _doMeasure(doc, model, hintWidth, hintHeight, phase) {
            const horz = model._isHorz;
            const titleView = this._titleView;
            const labelViews = this._labelViews;
            let sz = 0;
            this._lineView.visible = model.line.visible;
            this._markLen = model.tick.length || 0;
            if (this._markLen > 0) {
                sz += model.tick.margin || 0;
            }
            sz += this._markLen;
            if (this.$_prepareTickMarks(doc, model)) {
                this._markViews.forEach(v => v.measure(doc, model.tick, hintWidth, hintHeight, phase));
            }
            if (this.$_prepareLabels(doc, model)) {
                if (horz) {
                    sz += this._labelSize = this.$_measureLabelsHorz(model, labelViews, hintWidth);
                }
                else {
                    sz += this._labelSize = this.$_measureLabelsVert(labelViews);
                }
            }
            else {
                this._labelSize = 0;
            }
            if (titleView.visible) {
                sz += titleView.mh;
                sz += model.title.gap || 0;
            }
            return Size.create(horz ? hintWidth : sz, horz ? sz : hintHeight);
        }
        _doLayout() {
            const model = this.model;
            const horz = model._isHorz;
            const opp = model._isOpposite;
            const ticks = model._ticks;
            const markPts = model._markPoints;
            const titleView = this._titleView;
            const labelViews = this._labelViews;
            const markLen = this._markLen;
            const w = this.width;
            const h = this.height;
            if (this._lineView.visible) {
                if (horz) {
                    this._lineView.setHLine(opp ? h : 0, 0, w);
                }
                else {
                    this._lineView.setVLine(opp ? 0 : w, 0, h);
                }
            }
            if (this._markContainer.visible) {
                if (horz) {
                    this._markViews.forEach((v, i) => {
                        v.resize(1, markLen);
                        v.layout().translate(markPts[i], opp ? h - markLen : 0);
                    });
                }
                else {
                    this._markViews.forEach((v, i) => {
                        v.resize(markLen, 1);
                        v.layout().translate(opp ? 0 : w - markLen, h - markPts[i]);
                    });
                }
            }
            const len = markLen + (model.tick.margin || 0);
            if (this._labelContainer.visible) {
                if (horz) {
                    this.$_layoutLabelsHorz(labelViews, ticks, opp, w, h, len);
                }
                else {
                    this.$_layoutLabelsVert(labelViews, ticks, opp, w, h, len);
                }
            }
            if (titleView.visible) {
                const labelSize = this._labelSize;
                const gap = model.title.gap || 0;
                titleView.resizeByMeasured().layout(horz);
                if (horz) {
                    const y = opp ? 0 : len + labelSize + gap;
                    titleView.translate(w / 2, y);
                }
                else {
                    const x = opp ? len + labelSize + gap + titleView.height / 2 : w - len - labelSize - gap - titleView.height / 2;
                    titleView.translate(x, (h - titleView.height) / 2);
                }
            }
        }
        $_prepareTickMarks(doc, m) {
            const container = this._markContainer;
            if (container.visible = m.tick.visible) {
                const pts = m._markPoints;
                const nMark = pts.length;
                const views = this._markViews;
                while (views.length < nMark) {
                    const v = new AxisTickMarkView(doc);
                    container.add(v);
                    views.push(v);
                }
                while (views.length > nMark) {
                    views.pop().remove();
                }
                return true;
            }
        }
        $_prepareLabels(doc, m) {
            const container = this._labelContainer;
            if (container.visible = m.label.visible) {
                const ticks = m._ticks;
                const nTick = ticks.length;
                const views = this._labelViews;
                while (views.length < nTick) {
                    const t = new AxisLabelElement(doc, 'rct-axis-label');
                    t.anchor = TextAnchor.START;
                    container.add(t);
                    views.push(t);
                }
                while (views.length > nTick) {
                    views.pop().remove();
                }
                views.forEach((v, i) => {
                    v.value = ticks[i].value;
                    v.text = ticks[i].label;
                });
                return views.length;
            }
            return 0;
        }
        $_getRows(views) {
            return 2;
        }
        $_getStep(view) {
            return 2;
        }
        $_measureLabelsHorz(axis, views, width) {
            const m = axis.label;
            let step = m.step >> 0;
            let rows = m.rows >> 0;
            let rotation = m.rotation % 360;
            let overlapped = false;
            let sz;
            if (step > 0 || rows > 0 || rotation > 0 || rotation < 0) ;
            else {
                for (let i = 0; i < views.length - 1; i++) {
                    const w = axis.getLabelLength(width, views[i].value);
                    if (views[i].getBBounds().width >= w) {
                        overlapped = true;
                        break;
                    }
                }
                if (overlapped) {
                    switch (m.autoArrange) {
                        case AxisLabelArrange.ROTATE:
                            rotation = -45;
                            break;
                        case AxisLabelArrange.ROWS:
                            rows = this.$_getRows(views);
                            break;
                        case AxisLabelArrange.STEP:
                            step = this.$_getStep(views);
                            break;
                    }
                    overlapped = false;
                }
            }
            if (step > 1) {
                const start = Math.max(0, m.startStep || 0);
                views.forEach(v => v.index = -1);
                for (let i = start; i < views.length; i += step) {
                    views[i].index = i;
                }
                views.forEach(v => v.setVisible(v.index >= 0));
                views = views.filter(v => v.visible);
            }
            else {
                views.forEach((v, i) => {
                    v.index = i;
                    v.setVisible(true);
                });
            }
            if (rows > 1) {
                views.forEach((v, i) => v.row = i % rows);
                this._labelRowPts = [];
            }
            else {
                views.forEach(v => v.row = 0);
                this._labelRowPts = [0];
            }
            if (overlapped) {
                rotation = -45;
            }
            else {
                rotation = rotation || 0;
            }
            views.forEach(v => {
                v.rotation = rotation;
            });
            if (rows > 1) {
                const pts = this._labelRowPts;
                for (let i = 0; i < rows; i++) {
                    pts.push(0);
                }
                if (!isNaN(rotation) && rotation != 0) {
                    views.forEach(v => {
                        pts[v.row] = Math.max(pts[v.row], v.rotatedHeight);
                    });
                }
                else {
                    views.forEach(v => {
                        pts[v.row] = Math.max(pts[v.row], v.getBBounds().height);
                    });
                }
                pts.unshift(0);
                for (let i = 2; i < pts.length; i++) {
                    pts[i] += pts[i - 1];
                }
                return pts[pts.length - 1];
            }
            else {
                if (!isNaN(rotation) && rotation != 0) {
                    sz = views[0].rotatedHeight;
                    for (let i = 1; i < views.length; i++) {
                        sz = Math.max(sz, views[i].rotatedHeight);
                    }
                }
                else {
                    sz = views[0].getBBounds().height;
                    for (let i = 1; i < views.length; i++) {
                        sz = Math.max(sz, views[i].getBBounds().height);
                    }
                }
            }
            return sz;
        }
        $_measureLabelsVert(views) {
            let sz = views[0].getBBounds().width;
            for (let i = 1; i < views.length; i++) {
                sz = Math.max(sz, views[i].getBBounds().width);
            }
            return sz;
        }
        $_layoutLabelsHorz(views, ticks, opp, w, h, len) {
            const pts = this._labelRowPts;
            views.forEach(v => {
                if (v.visible) {
                    const rot = v.rotation;
                    const a = rot * DEG_RAD;
                    const r = v.getBBounds();
                    const ascent = Math.floor(v.getAscent(r.height));
                    let x = ticks[v.index].pos;
                    let y = opp ? (h - len - r.height - pts[v.row]) : (len + pts[v.row]);
                    if (rot < -15 && rot >= -90) {
                        v.anchor = TextAnchor.END;
                        x += -Math.sin(a) * ascent / 2 - 1;
                        y += Math.cos(a) * ascent - ascent;
                    }
                    else if (rot > 15 && rot <= 90) {
                        v.anchor = TextAnchor.START;
                        x -= Math.sin(a) * ascent / 2 - 1;
                        y += Math.cos(a) * ascent - ascent;
                    }
                    else {
                        v.anchor = TextAnchor.MIDDLE;
                    }
                    v.translate(x, y);
                }
            });
        }
        $_layoutLabelsVert(views, ticks, opp, w, h, len) {
            const x = opp ? len : w - len;
            views.forEach((v, i) => {
                if (v.visible) {
                    const r = v.getBBounds();
                    const x2 = opp ? x : x - r.width;
                    v.translate(x2, h - ticks[i].pos - r.height / 2);
                }
            });
        }
    }
    AxisView.AXIS_CLASS = 'rct-axis';
    AxisView.LINE_CLASS = 'rct-axis-line';
    AxisView.TICK_CLASS = 'rct-axis-tick-mark';

    class ElementPool extends RcObject {
        constructor(owner, creator, styleName, removeDelay = 0) {
            super();
            this.removeDelay = 0;
            this._pool = [];
            this._views = [];
            this._removes = [];
            this._owner = owner;
            this._creator = creator;
            this._styleName = styleName;
            this.removeDelay = removeDelay;
        }
        _doDestory() {
            this._owner = null;
            this._creator = null;
            super._doDestory();
        }
        get isEmpty() {
            return this._views.length === 0;
        }
        get count() {
            return this._views.length;
        }
        get first() {
            return this._views[0];
        }
        get last() {
            return this._views[this._views.length - 1];
        }
        get(index) {
            return this._views[index];
        }
        getAll() {
            return this._views.slice();
        }
        elementOf(dom) {
            for (let v of this._views) {
                if (v.dom.contains(dom))
                    return v;
            }
        }
        $_create(doc, index = -1, count = 0) {
            let v = this._pool.pop();
            if (!v) {
                v = new this._creator(doc, this._styleName);
            }
            this._owner.add(v);
            return v;
        }
        prepare(count, visitor, initor) {
            const doc = this._owner.doc;
            const pool = this._pool;
            const views = this._views;
            while (views.length > count) {
                pool.push(views.pop().remove());
            }
            while (views.length < count) {
                const v = this.$_create(doc);
                views.push(v);
                initor === null || initor === void 0 ? void 0 : initor(v, views.length - 1, count);
            }
            visitor && this.forEach(visitor);
            return this;
        }
        reprepare(viewProp, objs, objProp, cleaner, initor, visitor) {
            const doc = this._owner.doc;
            const pool = this._pool;
            const oldViews = this._views;
            const views = [];
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
                    if (!v.parent)
                        this._owner.add(v);
                }
                else {
                    const v = this.$_create(doc, i, cnt);
                    views.push(v);
                    initor === null || initor === void 0 ? void 0 : initor(v, i, cnt);
                }
            }
            for (let i = 0, cnt = oldViews.length; i < cnt; i++) {
                const v = oldViews[i];
                if (v.removing) ;
                else {
                    if (this.removeDelay > 0) {
                        this._removes.push(v.removeLater(false, this.removeDelay));
                    }
                    else {
                        pool.push(v.remove());
                    }
                    cleaner === null || cleaner === void 0 ? void 0 : cleaner(v, i, cnt);
                }
            }
            this._views = views;
            visitor && this.forEach(visitor);
            return this;
        }
        borrow() {
            const elt = this._pool.pop() || new this._creator(this._owner.doc, this._styleName);
            this._owner.add(elt);
            return elt;
        }
        free(element, removeDelay = 0) {
            if (element) {
                if (removeDelay > 0) {
                    element.removeLater(false, removeDelay);
                }
                else {
                    element.remove();
                }
                this._pool.push(element);
                const i = this._views.indexOf(element);
                if (i >= 0) {
                    this._views.splice(i, 1);
                }
            }
        }
        freeAll(elements, removeDelay = 0) {
            for (let elt of elements) {
                this.free(elt, removeDelay);
            }
        }
        fadeout(element, removeDelay, startOpacity) {
            if (element) {
                element.fadeout(removeDelay, startOpacity);
                this._pool.push(element);
                const i = this._views.indexOf(element);
                if (i >= 0) {
                    this._views.splice(i, 1);
                }
            }
        }
        forEach(visitor) {
            const views = this._views;
            for (let i = 0, cnt = views.length; i < cnt; i++) {
                visitor(views[i], i, cnt);
            }
        }
        visit(visitor) {
            const cnt = this._views.length;
            let i = 0;
            for (; i < cnt; i++) {
                if (visitor(this._views[i], i, cnt) === false) {
                    break;
                }
            }
            return i === cnt;
        }
        find(visitor) {
            const views = this._views;
            for (let i = 0, cnt = views.length; i < cnt; i++) {
                if (visitor(views[i]))
                    return views[i];
            }
        }
        sort(compare) {
            this._views = this._views.sort(compare);
            return this;
        }
        map(callback) {
            return this._views.map(callback);
        }
    }

    const _num = function (v) {
        return isNaN(v) ? 0 : v;
    };
    class PathBuilder {
        constructor() {
            this._path = [];
        }
        length() {
            return this._path.length;
        }
        isEmpty() {
            return this._path.length === 0;
        }
        clear() {
            this._path = [];
            return this;
        }
        end(close = false) {
            close && this._path.push('Z');
            return this._path.join(' ');
        }
        close(clear) {
            const s = this.end(true);
            clear && this.clear();
            return s;
        }
        move(x, y) {
            if (isNumber(x)) {
                this._path.push('M', _num(x), _num(y));
            }
            else {
                this._path.push('M', _num(x.x), _num(x.y));
            }
            return this;
        }
        moveBy(x, y) {
            if (isNumber(x)) {
                this._path.push('m', _num(x), _num(y));
            }
            else {
                this._path.push('m', _num(x.x), _num(x.y));
            }
            return this;
        }
        line(x, y) {
            if (isNumber(x)) {
                this._path.push('L', _num(x), _num(y));
            }
            else {
                this._path.push('L', _num(x.x), _num(x.y));
            }
            return this;
        }
        curve(cx1, cy1, cx2, cy2, x, y) {
            this._path.push('C', cx1, cy1, cx2, cy2, x, y);
            return this;
        }
        quad(x1, y1, x2, y2) {
            if (isNumber(x1)) {
                this._path.push('Q', x1, y1, x2, y2);
            }
            else {
                this._path.push('Q', x1.x1, x1.y1, x1.x2, x1.y2);
            }
            return this;
        }
        rect(x, y, width, height) {
            this._path.push('M', x, y, 'l', width, 0, 'l', 0, height, 'l', -width, 0);
            return this;
        }
        lines(...pts) {
            if (isNumber(pts[0])) {
                for (let i = 0; i < pts.length; i += 2) {
                    this._path.push('L', _num(pts[i]), _num(pts[i + 1]));
                }
            }
            else {
                for (let i = 0; i < pts.length; i++) {
                    this._path.push('L', _num(pts[i].x), _num(pts[i].y));
                }
            }
            return this;
        }
        polygon(...pts) {
            this.lines(...pts);
            this._path.push('Z');
            return this;
        }
        getMove(p = 0, remove = true) {
            if (p < this._path.length && this._path[p] === 'M') {
                const pt = { x: this._path[p + 1], y: this._path[p + 2] };
                remove && this._path.splice(p, 3);
                return pt;
            }
        }
        getLine(p = 0, remove = true) {
            if (p < this._path.length && this._path[p] === 'L') {
                const pt = { x: this._path[p + 1], y: this._path[p + 2] };
                remove && this._path.splice(p, 3);
                return pt;
            }
        }
        getQuad(p = 0, remove = true) {
            if (p < this._path.length && this._path[p] === 'Q') {
                const pt = {
                    x1: this._path[p + 1],
                    y1: this._path[p + 2],
                    x2: this._path[p + 3],
                    y2: this._path[p + 4],
                };
                remove && this._path.splice(p, 5);
                return pt;
            }
        }
        getPoints(p, count, remove = true) {
            const pts = [];
            while (p < this._path.length && pts.length < count) {
                if (p < this._path.length && (this._path[p] === 'M' || this._path[p] === 'L')) {
                    pts.push({ x: this._path[p + 1], y: this._path[p + 2] });
                    remove && this._path.splice(p, 3);
                }
                else {
                    break;
                }
            }
            return pts;
        }
    }

    class ImageElement extends RcElement {
        constructor(doc, styleName) {
            super(doc, styleName, 'image');
            this._dirty = true;
            this.setAttr('preserveAspectRatio', 'none');
        }
        get url() {
            return this.getAttr('href');
        }
        set url(value) {
            if (value !== this.url) {
                this._dirty = true;
                value ? this.setAttr('href', value) : this.unsetAttr('href');
            }
        }
        setImage(url, width, height) {
            if (url) {
                this.setAttr('href', url);
                this.resize(width, height);
                return true;
            }
            return false;
        }
        getBBounds() {
            if (this._dirty) {
                this._bounds = this.dom.getBBox();
                this._dirty = false;
            }
            return this._bounds;
        }
        _doSizeChanged() {
            this._dirty = true;
        }
    }

    class LabelElement extends GroupElement {
        constructor(doc, styleName = _undefined) {
            super(doc);
            this.add(this._text = new TextElement(doc, styleName));
            this._text.anchor = TextAnchor.START;
        }
        get text() {
            return this._text.text;
        }
        get anchor() {
            return this._text.anchor;
        }
        setText(s) {
            this._outline && (this._outline.text = s);
            this._text.text = s;
            return this;
        }
        setSvg(s) {
            this._text.svg = s;
            return this;
        }
        setModel(doc, model, contrastTarget) {
            var _a, _b, _c, _d;
            const e = model.effect;
            this._model = model;
            this._text.setStyleOrClass(model.style);
            if (e === ChartTextEffect.BACKGROUND) {
                (_a = this._outline) === null || _a === void 0 ? void 0 : _a.remove();
                if (!this._back) {
                    this._back = new RectElement(doc, 'rct-label-background');
                }
                this.insertFirst(this._back);
                this._back.setStyleOrClass(model.backgroundStyle);
            }
            else if (e === ChartTextEffect.OUTLINE) {
                (_b = this._back) === null || _b === void 0 ? void 0 : _b.remove();
                if (!this._outline) {
                    this._outline = new TextElement(doc);
                    this._outline.anchor = TextAnchor.START;
                }
                this.insertFirst(this._outline);
                this._outline.setStyleOrClass(model.style);
            }
            else {
                (_c = this._back) === null || _c === void 0 ? void 0 : _c.remove();
                (_d = this._outline) === null || _d === void 0 ? void 0 : _d.remove();
            }
            return this;
        }
        setContrast(target) {
            if (target && this._model.autoContrast) {
                this._text.setContrast(target, this._model.darkStyle || 'rct-label-dark', this._model.brightStyle || 'rct-label-bright');
            }
            if (this._outline && this._outline.parent) {
                const color = Color.getContrast(getComputedStyle(this._text.dom).fill);
                this._outline.setStyles({
                    fill: color,
                    stroke: color,
                    strokeWidth: '2px'
                });
            }
            return this;
        }
        layout() {
            if (this._back && this._back.parent) {
                const cs = getComputedStyle(this._back.dom);
                const r = this._text.getBBounds();
                const left = parseFloat(cs.paddingLeft) || 0;
                const top = parseFloat(cs.paddingTop) || 0;
                this._back.setBounds(-left, -top, r.width + left + (parseFloat(cs.paddingRight) || 0), r.height + top + (parseFloat(cs.paddingBottom) || 0), 3);
            }
            return this;
        }
    }

    const pow = Math.pow;
    const sqrt = Math.sqrt;
    const sin = Math.sin;
    const cos = Math.cos;
    const PI = Math.PI;
    const c1 = 1.70158;
    const c2 = c1 * 1.525;
    const c3 = c1 + 1;
    const c4 = (2 * PI) / 3;
    const c5 = (2 * PI) / 4.5;
    const bounceOut = function (x) {
        const n1 = 7.5625;
        const d1 = 2.75;
        if (x < 1 / d1) {
            return n1 * x * x;
        }
        else if (x < 2 / d1) {
            return n1 * (x -= 1.5 / d1) * x + 0.75;
        }
        else if (x < 2.5 / d1) {
            return n1 * (x -= 2.25 / d1) * x + 0.9375;
        }
        else {
            return n1 * (x -= 2.625 / d1) * x + 0.984375;
        }
    };
    const Easings = {
        inQuad(x) {
            return x * x;
        },
        outQuad(x) {
            return 1 - (1 - x) * (1 - x);
        },
        inOutQuad(x) {
            return x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2;
        },
        inCubic(x) {
            return x * x * x;
        },
        outCubic(x) {
            return 1 - pow(1 - x, 3);
        },
        outCubic2(x) {
            return 1 - pow(1 - x, 4);
        },
        inOutCubic(x) {
            return x < 0.5 ? 4 * x * x * x : 1 - pow(-2 * x + 2, 3) / 2;
        },
        inQuart(x) {
            return x * x * x * x;
        },
        outQuart(x) {
            return 1 - pow(1 - x, 4);
        },
        inOutQuart(x) {
            return x < 0.5 ? 8 * x * x * x * x : 1 - pow(-2 * x + 2, 4) / 2;
        },
        inQuint(x) {
            return x * x * x * x * x;
        },
        outQuint(x) {
            return 1 - pow(1 - x, 5);
        },
        inOutQuint(x) {
            return x < 0.5 ? 16 * x * x * x * x * x : 1 - pow(-2 * x + 2, 5) / 2;
        },
        inSine(x) {
            return 1 - cos((x * PI) / 2);
        },
        outSine(x) {
            return sin((x * PI) / 2);
        },
        inOutSine(x) {
            return -(cos(PI * x) - 1) / 2;
        },
        inExpo(x) {
            return x === 0 ? 0 : pow(2, 10 * x - 10);
        },
        outExpo(x) {
            return x === 1 ? 1 : 1 - pow(2, -10 * x);
        },
        inOutExpo(x) {
            return x === 0
                ? 0
                : x === 1
                    ? 1
                    : x < 0.5
                        ? pow(2, 20 * x - 10) / 2
                        : (2 - pow(2, -20 * x + 10)) / 2;
        },
        inCirc(x) {
            return 1 - sqrt(1 - pow(x, 2));
        },
        outCirc(x) {
            return sqrt(1 - pow(x - 1, 2));
        },
        inOutCirc(x) {
            return x < 0.5
                ? (1 - sqrt(1 - pow(2 * x, 2))) / 2
                : (sqrt(1 - pow(-2 * x + 2, 2)) + 1) / 2;
        },
        inBack(x) {
            return c3 * x * x * x - c1 * x * x;
        },
        outBack(x) {
            return 1 + c3 * pow(x - 1, 3) + c1 * pow(x - 1, 2);
        },
        inOutBack(x) {
            return x < 0.5
                ? (pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
                : (pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
        },
        inElastic(x) {
            return x === 0
                ? 0
                : x === 1
                    ? 1
                    : -pow(2, 10 * x - 10) * sin((x * 10 - 10.75) * c4);
        },
        outElastic(x) {
            return x === 0
                ? 0
                : x === 1
                    ? 1
                    : pow(2, -10 * x) * sin((x * 10 - 0.75) * c4) + 1;
        },
        inOutElastic(x) {
            return x === 0
                ? 0
                : x === 1
                    ? 1
                    : x < 0.5
                        ? -(pow(2, 20 * x - 10) * sin((20 * x - 11.125) * c5)) / 2
                        : (pow(2, -20 * x + 10) * sin((20 * x - 11.125) * c5)) / 2 + 1;
        },
        inBounce(x) {
            return 1 - bounceOut(1 - x);
        },
        outBounce: bounceOut,
        inOutBounce(x) {
            return x < 0.5
                ? (1 - bounceOut(1 - 2 * x)) / 2
                : (1 + bounceOut(2 * x - 1)) / 2;
        },
    };
    const createAnimation = function (dom, styleProp, toValue, duration, finishHandler) {
        const frame = newObject(styleProp, toValue);
        const ani = dom.animate([{}, frame], {
            duration: duration,
            fill: 'none'
        });
        ani && finishHandler && ani.addEventListener('finish', finishHandler);
        return ani;
    };
    class RcAnimation {
        constructor() {
            this.delay = 0;
            this.duration = RcAnimation.DURATION;
            this.easing = 'inOutSine';
            this._handler = () => {
                const dt = +new Date() - this._started - this.delay;
                let rate = Math.min(1, Math.max(0, fixnum(dt / this.duration)));
                if (this._easing) {
                    rate = this._easing(rate);
                }
                try {
                    if (!this._doUpdate(rate)) {
                        this._stop();
                    }
                }
                finally {
                    if (dt >= this.duration) {
                        this._stop();
                    }
                    else if (this._started) {
                        window.requestAnimationFrame(this._handler);
                    }
                }
            };
        }
        start() {
            this._start(this.duration, this.delay, this.easing);
        }
        _start(duration, delay = 0, easing = null) {
            this._stop();
            this.duration = pickNum(duration, RcAnimation.DURATION);
            this.delay = delay || 0;
            this._easing = Easings[easing];
            this._doStart();
            this._started = +new Date();
            this._timer = setTimeout(() => this._stop(), this.duration * 1.2);
            this._handler();
        }
        _stop() {
            if (this._started) {
                clearTimeout(this._timer);
                this._timer = null;
                this._started = null;
                this._doStop();
            }
        }
        _doStart() {
        }
        _doStop() {
        }
    }
    RcAnimation.DURATION = 700;
    RcAnimation.SHORT_DURATION = 300;

    class SeriesAnimation {
        static slide(series, options) {
            new SlideAnimation(series, options);
        }
        static fadeIn(series) {
            new StyleAnimation(series, { prop: 'opacity', start: '0', end: '1' });
        }
        static grow(series) {
            new GrowAnimation(series);
        }
        constructor(series, options) {
            const ani = this._createAnimation(series, options);
            if (ani instanceof Animation) {
                ani.addEventListener('finish', () => {
                    series._animationFinished(ani);
                });
                series._animationStarted(ani);
            }
        }
    }
    class StyleAnimation extends SeriesAnimation {
        constructor(series, options) {
            super(series, options);
        }
        _createAnimation(v, options) {
            const start = {};
            const end = {};
            start[options.prop] = options.start;
            end[options.prop] = options.end;
            return v.dom.animate([
                start, end
            ], {
                duration: RcAnimation.DURATION,
                fill: 'none'
            });
        }
    }
    class SlideAnimation extends SeriesAnimation {
        constructor(series, options) {
            super(series, options);
        }
        _createAnimation(v, options) {
            const cr = this.$_clipRect(v);
            let ani;
            switch (options && options.from) {
                case 'top':
                    ani = this.$_top(v, cr, options);
                    break;
                case 'bottom':
                    ani = this.$_bottom(v, cr, options);
                    break;
                case 'right':
                    ani = this.$_right(v, cr, options);
                    break;
                default:
                    ani = this.$_left(v, cr, options);
                    break;
            }
            ani.addEventListener('finish', () => {
                cr.dom.remove();
            });
            return ani;
        }
        $_aniOptions(options) {
            return {
                duration: RcAnimation.DURATION,
                fill: 'none'
            };
        }
        $_clipRect(v) {
            return v.clipRect(-v.width * .1, -v.height * .1, v.width * 1.2, v.height * 1.2)
                .setTemporary();
        }
        $_left(v, cr, options) {
            return cr.dom.firstElementChild.animate([
                { width: '0' },
                { width: pixel(v.width) }
            ], this.$_aniOptions(options));
        }
        $_right(v, cr, options) {
            return cr.dom.firstElementChild.animate([
                { transform: `translateX(${v.width}px)` },
                { transform: '' }
            ], this.$_aniOptions(options));
        }
        $_top(v, cr, options) {
            return cr.dom.firstElementChild.animate([
                { height: '0' },
                { height: pixel(v.height) }
            ], this.$_aniOptions(options));
        }
        $_bottom(v, cr, options) {
            return cr.dom.firstElementChild.animate([
                { transform: `translateY(${v.height}px)` },
                { transform: '' }
            ], this.$_aniOptions(options));
        }
    }
    class PointAnimation extends RcAnimation {
        constructor(series) {
            super();
            this._series = series;
            this.start();
        }
        _doStop() {
            this._series = null;
        }
    }
    class GrowAnimation extends PointAnimation {
        _doUpdate(rate) {
            if (this._series.parent) {
                this._series.setViewRate(rate);
                return true;
            }
        }
        _doStop() {
            if (this._series.parent) {
                this._series.setViewRate(NaN);
            }
            super._doStop();
        }
    }

    class PointLabelView extends LabelElement {
        constructor(doc) {
            super(doc, 'rct-point-label');
            this.moving = false;
        }
    }
    class PointLabelContainer extends GroupElement {
        constructor(doc) {
            super(doc, 'rct-series-labels');
            this._labels = [new ElementPool(this, PointLabelView), new ElementPool(this, PointLabelView)];
            this._maps = [];
            this.setStyle('pointerEvents', 'none');
        }
        clear() {
            this._labels[0].prepare(0);
            this._labels[1].prepare(0);
        }
        prepareLabel(doc, view, index, p, model) {
            if (view.setVisible(p.visible && !p.isNull)) {
                const richFormat = model.text;
                const styles = model.style;
                view.point = p;
                view.setModel(doc, model, null);
                if (richFormat) {
                    model.buildSvg(view._text, model, p.getValueOf);
                    view.setStyles(styles);
                    if (view._outline) {
                        model.buildSvg(view._outline, model, p.getValueOf);
                    }
                }
                else {
                    view.setText(model.getText(p.getLabel(index)))
                        .setStyles(styles);
                }
            }
        }
        prepare(doc, model) {
            const labels = this._labels;
            const points = model.getLabeledPoints();
            const pointLabel = model.pointLabel;
            if (pointLabel.visible) {
                const maps = this._maps;
                labels[0].prepare(points.length);
                labels[1].prepare(points.length);
                maps[0] = {};
                maps[1] = {};
                points.forEach((p, i) => {
                    for (let j = 0; j < p.labelCount(); j++) {
                        const label = labels[j].get(i);
                        if (label.setVisible(!p.isNull)) {
                            this.prepareLabel(doc, label, j, p, pointLabel);
                            maps[j][p.pid] = label;
                        }
                    }
                });
                this.setStyleOrClass(pointLabel.style);
            }
            else {
                this.clear();
            }
        }
        get(point, index) {
            const map = this._maps[index];
            return map && map[point.pid];
        }
        borrow(index) {
            return this._labels[index].borrow();
        }
        free(index, view, removeDelay = 0) {
            if (view) {
                this._labels[index].free(view, removeDelay);
            }
        }
    }
    class PointLabelLine extends GroupElement {
        constructor(doc) {
            super(doc);
            this.add(this._line = new PathElement(doc));
        }
        setLine(line) {
            this._line.setPath(line);
        }
    }
    class PointLabelLineContainer extends GroupElement {
        constructor(doc) {
            super(doc, 'rct-point-label-lines');
            this._lines = new ElementPool(this, PointLabelLine);
        }
        prepare(model) {
            const lines = this._lines;
            const points = model.getPoints();
            const pointLabel = model.pointLabel;
            if (pointLabel.visible) {
                const map = this._map = {};
                lines.prepare(points.count).forEach((line, i) => {
                    const p = points.get(i);
                    if (line.visible = p.visible) ;
                    map[p.pid] = line;
                });
            }
            else {
                lines.prepare(0);
            }
        }
        get(point) {
            return this._map[point.pid];
        }
    }
    class PointContainer extends LayerElement {
        constructor() {
            super(...arguments);
            this.inverted = false;
        }
        invert(v, height) {
            if (v !== this.inverted) {
                if (this.inverted = v) {
                    this.setAttr('transform', `translate(0,${height}) rotate(90) scale(-1,1)`);
                }
                else {
                    this.setAttr('transform', '');
                }
            }
            return this.inverted;
        }
    }
    class SeriesView extends ChartElement {
        constructor(doc, styleName) {
            super(doc, 'rct-series ' + styleName);
            this._inverted = false;
            this._animatable = true;
            this._viewRate = NaN;
            this.add(this._pointContainer = new PointContainer(doc, 'rct-series-points'));
            this.add(this._labelContainer = new PointLabelContainer(doc));
        }
        invertable() {
            return true;
        }
        getClipContainer() {
            return this._pointContainer;
        }
        setViewRate(rate) {
            if ((!isNaN(rate) || !isNaN(this._viewRate)) && rate !== this._viewRate) {
                this._viewRate = rate;
                if (isNaN(rate)) {
                    this.control.invalidateLayout();
                }
                else {
                    this._doViewRateChanged(rate);
                }
            }
        }
        setPosRate(rate) {
        }
        _doViewRateChanged(rate) {
        }
        _setChartOptions(inverted, animatable) {
            this._inverted = inverted;
            this._animatable = animatable;
        }
        _animationStarted(ani) {
            if (this._labelContainer && this._labelContainer.visible) {
                this._labelContainer.setVisible(false);
            }
        }
        _animationFinished(ani) {
            this._invalidate();
        }
        pointByDom(elt) {
            return this._getPointPool().elementOf(elt);
        }
        clicked(elt) {
            const view = this.pointByDom(elt);
            view && this._doPointClicked(view);
        }
        _doPointClicked(view) {
        }
        _getColor() {
            return this.model._calcedColor;
        }
        _doMeasure(doc, model, hintWidth, hintHeight, phase) {
            this.setClip(void 0);
            this.setData('index', model.index);
            this.setBoolData('pointcolors', model._colorByPoint());
            this._visPoints = model._runPoints.filter(p => p.visible);
            this._prepareSeries(doc, model);
            !this._lazyPrepareLabels() && this._labelContainer.prepare(doc, model);
            this.setStyleOrClass(model.style);
            if (model.color) {
                this.internalSetStyle('fill', model.color);
                this.internalSetStyle('stroke', model.color);
            }
            this.model._calcedColor = getComputedStyle(this.dom).fill;
            if (model.trendline.visible) {
                if (!this._trendLineView) {
                    this.add(this._trendLineView = new PathElement(doc, 'rct-series-trendline'));
                }
                this._trendLineView.setVisible(true);
            }
            else if (this._trendLineView) {
                this._trendLineView.setVisible(false);
            }
            return Size.create(hintWidth, hintHeight);
        }
        _doLayout() {
            this._labelViews();
            this._renderSeries(this.width, this.height);
            if (this._trendLineView && this._trendLineView.visible) {
                this.$_renderTrendline();
            }
            this._afterRender();
            this._animatable && this._runShowEffect(!this.control.loaded);
        }
        _setPointIndex(v, p) {
            v.setData('index', p.index);
        }
        _labelViews() {
            this._labelContainer.setVisible(this.model.pointLabel.visible && !this._animating());
            return this._labelContainer.visible && this._labelContainer;
        }
        _getViewRate() {
            return pickNum(this._viewRate, 1);
        }
        _animating() {
            return !isNaN(this._viewRate);
        }
        _lazyPrepareLabels() { return false; }
        _afterRender() { }
        _getShowAnimation() { return; }
        _runShowEffect(firstTime) {
        }
        $_renderTrendline() {
            const m = this.model;
            const xAxis = m._xAxisObj;
            const yAxis = m._yAxisObj;
            const pts = m.trendline._points.map(pt => ({ x: xAxis.getPosition(xAxis._length, pt.x), y: yAxis._length - yAxis.getPosition(yAxis._length, pt.y) }));
            const sb = new PathBuilder();
            sb.move(pts[0].x, pts[0].y);
            sb.lines(...pts);
            this._trendLineView.setPath(sb.end(false));
        }
        _layoutLabel(info) {
            let { inverted, x, y, hPoint, labelView, labelOff } = info;
            const below = hPoint < 0;
            const r = labelView.getBBounds();
            let inner = true;
            if (inverted) {
                y -= r.height / 2;
            }
            else {
                x -= r.width / 2;
            }
            switch (info.labelPos) {
                case PointItemPosition.INSIDE:
                    if (inverted) {
                        x -= hPoint / 2 + labelOff;
                    }
                    else {
                        y += (hPoint - r.height) / 2 + labelOff;
                    }
                    break;
                case PointItemPosition.HEAD:
                    if (inverted) {
                        if (below) {
                            x += r.width - labelOff;
                        }
                        else {
                            x -= r.width + labelOff;
                        }
                    }
                    else {
                        if (below) {
                            y -= r.height + labelOff;
                        }
                        else {
                            y += labelOff;
                        }
                    }
                    break;
                case PointItemPosition.FOOT:
                    if (inverted) {
                        if (below) {
                            x -= hPoint + r.width + labelOff;
                        }
                        else {
                            x -= hPoint - labelOff;
                        }
                    }
                    else {
                        if (below) {
                            y += hPoint + labelOff;
                        }
                        else {
                            y += hPoint - r.height - labelOff;
                        }
                    }
                    break;
                case PointItemPosition.OUTSIDE:
                default:
                    if (inverted) {
                        if (below) {
                            x -= r.width + labelOff;
                        }
                        else {
                            x += labelOff;
                        }
                    }
                    else {
                        if (below) {
                            y += labelOff;
                        }
                        else {
                            y -= r.height + labelOff;
                        }
                    }
                    inner = false;
                    break;
            }
            labelView.setContrast(inner && info.pointView.dom);
            labelView.layout().translate(x, y);
        }
    }
    SeriesView.POINT_CLASS = 'rct-point';
    SeriesView.DATA_FOUCS = 'focus';
    class BoxPointElement extends PathElement {
        constructor(doc) {
            super(doc, SeriesView.POINT_CLASS);
            this.labelViews = [];
        }
    }
    let BarElement$6 = class BarElement extends BoxPointElement {
        layout(x, y) {
            this.setPath(SvgShapes.rect({
                x: x - this.wPoint / 2,
                y,
                width: this.wPoint,
                height: -this.hPoint
            }));
        }
    };
    class ClusterableSeriesView extends SeriesView {
        constructor() {
            super(...arguments);
            this._labelInfo = {};
        }
        _prepareSeries(doc, model) {
            this._preparePointViews(doc, model, this._visPoints);
        }
        _renderSeries(width, height) {
            this._pointContainer.invert(this._inverted, height);
            this._layoutPointViews(width, height);
        }
        _runShowEffect(firstTime) {
            firstTime && SeriesAnimation.grow(this);
        }
        _doViewRateChanged(rate) {
            this._layoutPointViews(this.width, this.height);
        }
    }
    class BoxedSeriesView extends ClusterableSeriesView {
        _layoutPointViews(width, height) {
            const series = this.model;
            const inverted = this._inverted;
            const vr = this._getViewRate();
            const labels = series.pointLabel;
            const labelViews = this._labelViews();
            const xAxis = series._xAxisObj;
            const yAxis = series._yAxisObj;
            const wPad = xAxis instanceof CategoryAxis ? xAxis.categoryPad() * 2 : 0;
            const yLen = inverted ? width : height;
            const xLen = inverted ? height : width;
            const yOrg = inverted ? 0 : height;
            const yMin = yAxis.getPosition(yLen, yAxis.axisMin());
            const base = series.getBaseValue(yAxis);
            const yBase = pickNum(yAxis.getPosition(yLen, base), yMin);
            const based = !isNaN(base);
            const info = labelViews && Object.assign(this._labelInfo, {
                inverted,
                labelPos: series.getLabelPosition(labels.position),
                labelOff: series.getLabelOff(labels.offset)
            });
            this._getPointPool().forEach((pv, i) => {
                const p = pv.point;
                if (pv.setVisible(!p.isNull)) {
                    const wUnit = xAxis.getUnitLength(xLen, p.xValue) * (1 - wPad);
                    const wPoint = series.getPointWidth(wUnit);
                    const yVal = yAxis.getPosition(yLen, p.yValue);
                    const hPoint = (yVal - yBase) * vr;
                    let x;
                    let y;
                    this._setPointIndex(pv, p);
                    x = xAxis.getPosition(xLen, p.xValue) - wUnit / 2;
                    y = yOrg;
                    p.xPos = x += series.getPointPos(wUnit) + wPoint / 2;
                    if (based && yBase !== yMin) {
                        p.yPos = y -= yAxis.getPosition(yLen, p.yGroup * vr);
                    }
                    else {
                        p.yPos = y -= yAxis.getPosition(yLen, p.yGroup) * vr;
                    }
                    this._layoutPointView(pv, i, x, y + hPoint, wPoint, hPoint);
                    if (info && (info.labelView = labelViews.get(p, 0))) {
                        if (inverted) {
                            y = xLen - xAxis.getPosition(xLen, p.xValue) + wUnit / 2;
                            x = yOrg;
                            p.yPos = y -= series.getPointPos(wUnit) + wPoint / 2;
                            if (based) {
                                p.xPos = x += yAxis.getPosition(yLen, p.yGroup) * vr;
                            }
                            else {
                                p.xPos = x += yAxis.getPosition(yLen, p.yGroup * vr);
                            }
                        }
                        info.pointView = pv;
                        info.x = x;
                        info.y = y;
                        info.wPoint = wPoint;
                        info.hPoint = hPoint;
                        this._layoutLabel(info);
                    }
                }
            });
        }
    }
    class RangedSeriesView extends ClusterableSeriesView {
        _layoutPointViews(width, height) {
            const series = this.model;
            const inverted = series.chart.isInverted();
            const vr = this._getViewRate();
            const labels = series.pointLabel;
            const labelViews = this._labelViews();
            const xAxis = series._xAxisObj;
            const yAxis = series._yAxisObj;
            const wPad = xAxis instanceof CategoryAxis ? xAxis.categoryPad() * 2 : 0;
            const yLen = inverted ? width : height;
            const xLen = inverted ? height : width;
            const org = inverted ? 0 : height;
            const info = labelViews && Object.assign(this._labelInfo, {
                inverted,
                labelPos: series.getLabelPosition(labels.position),
                labelOff: series.getLabelOff(labels.offset)
            });
            this._getPointPool().forEach((pv, i) => {
                const p = pv.point;
                if (pv.setVisible(!p.isNull)) {
                    const wUnit = xAxis.getUnitLength(xLen, p.xValue) * (1 - wPad);
                    const wPoint = series.getPointWidth(wUnit);
                    const yVal = yAxis.getPosition(yLen, p.yValue);
                    const hPoint = (yVal - yAxis.getPosition(yLen, this._getLowValue(p))) * vr;
                    let x = xAxis.getPosition(xLen, p.xValue) - wUnit / 2;
                    let y = org;
                    p.xPos = x += series.getPointPos(wUnit) + wPoint / 2;
                    p.yPos = y -= yAxis.getPosition(yLen, p.yGroup) * vr;
                    this._setPointIndex(pv, p);
                    this._layoutPointView(pv, i, x, y, wPoint, hPoint);
                    if (labelViews) {
                        if (inverted) {
                            y = xLen - xAxis.getPosition(xLen, p.xValue) + wUnit / 2;
                            x = org;
                            p.yPos = y -= series.getPointPos(wUnit) + wPoint / 2;
                            p.xPos = x += yAxis.getPosition(yLen, p.yGroup) * vr;
                        }
                        info.pointView = pv;
                        info.hPoint = hPoint;
                        info.x = x;
                        info.y = y;
                        if (info.labelView = labelViews.get(p, 0)) {
                            info.hPoint = hPoint;
                            this._layoutLabel(info);
                        }
                        if (info.labelView = labelViews.get(p, 1)) {
                            if (inverted)
                                info.x -= hPoint;
                            else
                                info.y += hPoint;
                            info.hPoint = -hPoint;
                            this._layoutLabel(info);
                        }
                    }
                }
            });
        }
    }

    class LineMarkerView extends PathElement {
        constructor(doc) {
            super(doc, SeriesView.POINT_CLASS);
        }
    }
    class LineContainer extends RcElement {
        constructor() {
            super(...arguments);
            this.inverted = false;
        }
        invert(v, height) {
            if (v !== this.inverted) {
                if (this.inverted = v) {
                    this.dom.style.transform = `translate(${height}px, ${height}px) rotate(-90deg) scale(1, -1)`;
                }
                else {
                    this.dom.style.transform = ``;
                }
            }
            return this.inverted;
        }
    }
    class LineSeriesBaseView extends SeriesView {
        constructor(doc, styleName) {
            super(doc, styleName);
            this._needBelow = false;
            this.insertFirst(this._lineContainer = new LineContainer(doc, 'rct-line-series-lines'));
            this._lineContainer.add(this._line = new PathElement(doc, 'rct-line-series-line'));
            this._markers = new ElementPool(this._pointContainer, LineMarkerView);
        }
        getClipContainer() {
            return null;
        }
        _getPointPool() {
            return this._markers;
        }
        _prepareSeries(doc, model) {
            this.$_prepareMarkers(this._visPoints);
        }
        _renderSeries(width, height) {
            const series = this.model;
            this._lineContainer.invert(this._inverted, height);
            series instanceof LineSeries && this._prepareBelow(series, width, height);
            this._layoutMarkers(this._visPoints, width, height);
            this._layoutLines(this._visPoints);
        }
        _runShowEffect(firstTime) {
            function getFrom(self) {
                const reversed = self.model._xAxisObj.reversed;
                if (self._inverted) {
                    return reversed ? 'top' : 'bottom';
                }
                else {
                    return reversed ? 'right' : 'left';
                }
            }
            if (this._polar) {
                firstTime && SeriesAnimation.grow(this);
            }
            else {
                firstTime && SeriesAnimation.slide(this, { from: getFrom(this) });
            }
        }
        _doViewRateChanged(rate) {
            this._layoutMarkers(this._visPoints, this.width, this.height);
            this._layoutLines(this._visPoints.slice());
        }
        _markersPerPoint() {
            return 1;
        }
        _prepareBelow(series, w, h) {
            const control = this.control;
            series._yAxisObj;
            let lowLine = this._lowLine;
            this._needBelow = series.belowStyle && series._minValue < series.baseValue;
            if (this._needBelow) {
                if (!lowLine) {
                    this._lineContainer.insertChild(lowLine = this._lowLine = new PathElement(this.doc), this._line);
                    this._upperClip = control.clipBounds();
                    this._lowerClip = control.clipBounds();
                }
                this._line.setClip(this._upperClip);
                lowLine.setClip(this._lowerClip);
                return true;
            }
            else {
                lowLine === null || lowLine === void 0 ? void 0 : lowLine.setClip();
                this._line.setClip();
            }
        }
        $_resetClips(w, h, base, inverted) {
            const reversed = this.model._yAxisObj.reversed;
            const x = 0;
            const y = 0;
            let clip;
            if (clip = this._upperClip) {
                if (inverted) {
                    if (reversed) {
                        clip.setBounds(x, h - base, h, w);
                    }
                    else {
                        clip.setBounds(x, h - w, h, w - base);
                    }
                }
                else {
                    if (reversed) {
                        clip.setBounds(x, y + base, w, h - base);
                    }
                    else {
                        clip.setBounds(x, y, w, base);
                    }
                }
            }
            if (clip = this._lowerClip) {
                if (this._inverted) {
                    if (reversed) {
                        clip.setBounds(x, h - w, h, w - base);
                    }
                    else {
                        clip.setBounds(x, h - base, h, w);
                    }
                }
                else {
                    if (reversed) {
                        clip.setBounds(x, y, w, base);
                    }
                    else {
                        clip.setBounds(x, y + base, w, h - base);
                    }
                }
            }
        }
        $_prepareMarkers(points) {
            const series = this.model;
            const marker = series.marker;
            if (this._pointContainer.visible = marker.visible) {
                const mpp = this._markersPerPoint();
                const count = points.length;
                this._markers.prepare(count * mpp, (mv, i) => {
                    const n = i % count;
                    const p = points[n];
                    if (!p.isNull) {
                        mv.point = p;
                    }
                });
            }
        }
        _layoutMarker(mv, x, y) {
            const series = this.model;
            const marker = series.marker;
            const p = mv.point;
            const s = p.shape || series.getShape();
            const sz = mv._radius = pickNum(p.radius, marker.radius);
            let path;
            switch (s) {
                case Shape.SQUARE:
                case Shape.RECTANGLE:
                case Shape.DIAMOND:
                case Shape.TRIANGLE:
                case Shape.ITRIANGLE:
                case Shape.STAR:
                    x -= sz;
                    y -= sz;
                    path = SvgShapes[s](0, 0, sz * 2, sz * 2);
                    break;
                default:
                    path = SvgShapes.circle(0, 0, sz);
                    break;
            }
            mv.translate(x, y);
            mv.setPath(path);
        }
        _layoutMarkers(pts, width, height) {
            const series = this.model;
            const markerStyle = series.marker.style;
            const needBelow = series instanceof LineSeries && this._needBelow;
            const base = needBelow ? series.baseValue : NaN;
            const inverted = this._inverted;
            const polar = this._polar = series.chart.body.getPolar(series);
            const vr = this._getViewRate();
            const vis = series.marker.visible;
            const labels = series.pointLabel;
            const labelOff = labels.offset;
            const labelViews = this._labelViews();
            const xAxis = series._xAxisObj;
            const yAxis = series._yAxisObj;
            const yLen = inverted ? width : height;
            const xLen = inverted ? height : width;
            const yOrg = height;
            for (let i = 0, cnt = pts.length; i < cnt; i++) {
                const p = pts[i];
                let px;
                let py;
                if (polar) {
                    const a = polar.start + i * polar.deg;
                    const y = yAxis.getPosition(polar.rd, p.yGroup) * vr;
                    px = p.xPos = polar.cx + y * Math.cos(a);
                    py = p.yPos = polar.cy + y * Math.sin(a);
                }
                else {
                    px = p.xPos = xAxis.getPosition(xLen, p.xValue);
                    py = p.yPos = yOrg - yAxis.getPosition(yLen, p.yGroup);
                    if (inverted) {
                        px = yAxis.getPosition(yLen, p.yGroup);
                        py = yOrg - xAxis.getPosition(xLen, p.xValue);
                    }
                }
                const mv = this._markers.get(i);
                const lv = labelViews && labelViews.get(p, 0);
                if (mv && mv.setVisible(!p.isNull)) {
                    this._layoutMarker(mv, px, py);
                    if (lv) {
                        const r = lv.getBBounds();
                        lv.visible = true;
                        lv.translate(px - r.width / 2, py - r.height - labelOff - (vis ? mv._radius : 0));
                    }
                    if (needBelow && p.yValue < base) {
                        mv.setStyleOrClass(series.belowStyle);
                    }
                    else {
                        markerStyle && mv.setStyleOrClass(markerStyle);
                    }
                }
                else if (lv) {
                    lv.visible = false;
                }
            }
        }
        _layoutLines(pts) {
            const series = this.model;
            const needBelow = series instanceof LineSeries && this._needBelow;
            const sb = new PathBuilder();
            let i = 0;
            let s;
            while (i < pts.length) {
                const p = pts[i++];
                if (!p.isNull) {
                    sb.move(p.xPos, p.yPos);
                    break;
                }
            }
            this._linePts = pts;
            if (i < pts.length - 1) {
                this._buildLines(pts, i, sb);
                this._line.setPath(s = sb.end(this._polar));
                this._line.clearStyleAndClass();
                this._line.setStyle('stroke', series.color);
                this._line.addStyleOrClass(series.style);
                Dom.setImportantStyle(this._line.dom.style, 'fill', 'none');
                if (needBelow) {
                    const axis = series._yAxisObj;
                    const base = series.baseValue;
                    if (this._inverted) {
                        this.$_resetClips(this.width, this.height, axis.getPosition(this.width, base), true);
                    }
                    else {
                        this.$_resetClips(this.width, this.height, this.height - axis.getPosition(this.height, base), false);
                    }
                    this._lowLine.setPath(s);
                    this._lowLine.clearStyleAndClass();
                    this._lowLine.setStyle('stroke', series.color);
                    this._lowLine.addStyleOrClass(series.style);
                    this._lowLine.addStyleOrClass(series.belowStyle);
                    Dom.setImportantStyle(this._lowLine.dom.style, 'fill', 'none');
                }
            }
        }
        _buildLines(pts, from, sb) {
            const m = this.model;
            const t = m.getLineType();
            if (t === LineType.SPLINE) {
                this._drawCurve(pts, from - 1, sb);
            }
            else if (m instanceof LineSeries && t === LineType.STEP) {
                this._drawStep(pts, from, sb, m.stepDir);
            }
            else {
                this._drawLine(pts, from, sb);
            }
        }
        _drawLine(pts, from, sb) {
            const len = pts.length;
            let i = from;
            while (i < len) {
                if (pts[i].isNull) {
                    do {
                        i++;
                    } while (i < len && pts[i].isNull);
                    if (i < len) {
                        sb.move(pts[i].xPos, pts[i].yPos);
                        i++;
                    }
                }
                else {
                    sb.line(pts[i].xPos, pts[i].yPos);
                    i++;
                }
            }
        }
        _drawCurve(pts, from, sb) {
            const len = pts.length;
            let i;
            if (pts && pts.length > 1) {
                let start = from;
                i = from;
                while (i < len) {
                    if (pts[i].isNull) {
                        if (i - 1 > start) {
                            this.$_drawCurve(pts, start, i - 1, sb);
                        }
                        do {
                            i++;
                        } while (i < len && pts[i].isNull);
                        start = i;
                        if (i < len) {
                            sb.move(pts[i].xPos, pts[i].yPos);
                            i++;
                        }
                    }
                    else {
                        i++;
                    }
                }
                if (i - 1 > start) {
                    this.$_drawCurve(pts, start, i - 1, sb);
                }
            }
        }
        $_drawCurve(pts, start, end, sb) {
            let p = start;
            if (Math.abs(end - start) === 1) {
                sb.line(pts[p + 1].xPos, pts[p + 1].yPos);
                return;
            }
            const tension = 0.23;
            const tLeft = { x: 0, y: 0 };
            const tRight = { x: 0, y: 0 };
            const v1 = { x: 0, y: 0 };
            const v2 = { x: pts[p + 1].xPos - pts[p].xPos, y: pts[p + 1].yPos - pts[p].yPos };
            const p1 = { x: 0, y: 0 };
            const p2 = { x: 0, y: 0 };
            const mp = { x: 0, y: 0 };
            let tan = { x: 0, y: 0 };
            let len = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
            v2.x /= len;
            v2.y /= len;
            let tFactor = (pts[p + 1].xPos - pts[p].xPos);
            let prevX = pts[p].xPos;
            let prevY = pts[p].yPos;
            for (++p; p != end; p++) {
                v1.x = -v2.x;
                v1.y = -v2.y;
                v2.x = pts[p + 1].xPos - pts[p].xPos;
                v2.y = pts[p + 1].yPos - pts[p].yPos;
                len = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
                v2.x /= len;
                v2.y /= len;
                if (v2.x < v1.x) {
                    tan.x = v1.x - v2.x;
                    tan.y = v1.y - v2.y;
                }
                else {
                    tan.x = v2.x - v1.x;
                    tan.y = v2.y - v1.y;
                }
                const tlen = Math.sqrt(tan.x * tan.x + tan.y * tan.y);
                tan.x /= tlen;
                tan.y /= tlen;
                if (v1.y * v2.y >= 0) {
                    tan = { x: 1, y: 0 };
                }
                tLeft.x = -tan.x * tFactor * tension;
                tLeft.y = -tan.y * tFactor * tension;
                if (p === start + 1) {
                    sb.quad(pts[p].xPos + tLeft.x, pts[p].yPos + tLeft.y, pts[p].xPos, pts[p].yPos);
                }
                else {
                    p1.x = prevX + tRight.x;
                    p1.y = prevY + tRight.y;
                    p2.x = pts[p].xPos + tLeft.x;
                    p2.y = pts[p].yPos + tLeft.y;
                    mp.x = (p1.x + p2.x) / 2;
                    mp.y = (p1.y + p2.y) / 2;
                    sb.quad(p1.x, p1.y, mp.x, mp.y);
                    sb.quad(p2.x, p2.y, pts[p].xPos, pts[p].yPos);
                }
                tFactor = (pts[p + 1].xPos - pts[p].xPos);
                tRight.x = tan.x * tFactor * tension;
                tRight.y = tan.y * tFactor * tension;
                prevX = pts[p].xPos;
                prevY = pts[p].yPos;
            }
            sb.quad(prevX + tRight.x, prevY + tRight.y, pts[p].xPos, pts[p].yPos);
        }
        _drawStep(pts, from, sb, dir) {
            const len = pts.length;
            let i = from;
            while (i < len) {
                if (pts[i].isNull) {
                    do {
                        i++;
                    } while (i < len && pts[i].isNull);
                    if (i < len) {
                        sb.move(pts[i].xPos, pts[i].yPos);
                        i++;
                    }
                }
                else {
                    if (dir === LineStepDirection.BACKWARD) {
                        sb.line(pts[i - 1].xPos, pts[i].yPos);
                        sb.line(pts[i].xPos, pts[i].yPos);
                    }
                    else {
                        sb.line(pts[i].xPos, pts[i - 1].yPos);
                        sb.line(pts[i].xPos, pts[i].yPos);
                    }
                    i++;
                }
            }
        }
    }
    class LineSeriesView extends LineSeriesBaseView {
        constructor(doc) {
            super(doc, LineSeriesView.CLASS);
        }
    }
    LineSeriesView.CLASS = 'rct-line-series';

    class AreaRangeSeriesView extends LineSeriesBaseView {
        constructor(doc) {
            super(doc, 'rct-area-range');
            this.insertFirst(this._areaContainer = new LineContainer(doc, 'rct-arearange-series-areas'));
            this._areaContainer.add(this._area = new PathElement(doc, 'rct-arearange-series-area'));
            this._lineContainer.add(this._lowerLine = new PathElement(doc, 'rct-areanrange-series-line'));
            Dom.setImportantStyle(this._lowerLine.dom.style, 'fill', 'none');
        }
        _markersPerPoint() {
            return 2;
        }
        _renderSeries(width, height) {
            this._areaContainer.invert(this.model.chart.isInverted(), height);
            super._renderSeries(width, height);
        }
        _layoutMarkers(pts, width, height) {
            super._layoutMarkers(pts, width, height);
            const series = this.model;
            const inverted = this._inverted;
            const yAxis = series._yAxisObj;
            const yLen = inverted ? width : height;
            const yOrg = height;
            for (let i = 0, cnt = pts.length; i < cnt; i++) {
                const p = pts[i];
                p.yLow = yOrg - yAxis.getPosition(yLen, p.lowValue);
            }
            if (series.marker.visible) {
                const markers = this._markers;
                for (let i = 0, cnt = pts.length; i < cnt; i++) {
                    const p = pts[i];
                    const mv = markers.get(i + cnt);
                    let x;
                    let y;
                    if (p.isNull) {
                        mv.visible = false;
                    }
                    else {
                        mv.visible = true;
                        if (inverted) {
                            x = yAxis.getPosition(yLen, p.lowValue);
                            y = markers.get(i).ty;
                        }
                        else {
                            x = p.xPos;
                            y = p.yLow;
                        }
                        this._layoutMarker(mv, x, y);
                    }
                }
            }
        }
        _layoutLines(points) {
            super._layoutLines(points);
            const lowPts = points.map(p => {
                return { xPos: p.xPos, yPos: p.yLow, isNull: p.isNull };
            });
            const pts = lowPts.slice().reverse();
            const sb = new PathBuilder();
            let i = 0;
            while (i < pts.length && pts[i].isNull) {
                i++;
            }
            sb.move(pts[i].xPos, pts[i].yPos);
            this._buildLines(pts, i + 1, sb);
            this._lowerLine.setPath(sb.end(false));
            this._lowerLine.setStyle('stroke', this.model.color);
            this.$_layoutArea(this._area, this._linePts, pts);
        }
        $_layoutArea(area, pts, lowPts) {
            const sb = new PathBuilder();
            let i = 0;
            while (i < pts.length && pts[i].isNull) {
                i++;
            }
            const len = pts.length;
            let start = i++;
            let end;
            let pts2;
            let lowPts2;
            while (i < len) {
                if (pts[i].isNull) {
                    end = i;
                    if (end > start) {
                        pts2 = pts.slice(start, end);
                        lowPts2 = lowPts.slice(len - end, len - start);
                        sb.move(pts2[0].xPos, pts2[0].yPos);
                        this._buildLines(pts2, 1, sb);
                        sb.line(lowPts2[0].xPos, lowPts2[0].yPos);
                        this._buildLines(lowPts2, 1, sb);
                    }
                    while (i < len && pts[i].isNull) {
                        i++;
                    }
                    start = i;
                }
                else {
                    i++;
                }
            }
            if (i > start) {
                end = i;
                pts2 = pts.slice(start, end);
                lowPts2 = lowPts.slice(len - end, len - start);
                sb.move(pts2[0].xPos, pts2[0].yPos);
                this._buildLines(pts2, 1, sb);
                sb.line(lowPts2[0].xPos, lowPts2[0].yPos);
                this._buildLines(lowPts2, 1, sb);
            }
            area.setPath(sb.end());
        }
    }

    class AreaSeriesView extends LineSeriesBaseView {
        constructor(doc, className) {
            super(doc, className || 'rct-area-series');
            this._lineContainer.insertFirst(this._area = new PathElement(doc, 'rct-area-series-area'));
        }
        _layoutLines(pts) {
            super._layoutLines(pts);
            if (this._polar) {
                this._layoutPolar(this._area, pts);
            }
            else {
                this._layoutArea(this._area, pts);
            }
        }
        _prepareBelow(series, w, h) {
            var _a;
            let lowArea = this._lowArea;
            this._area.setStyle('fill', this.model.color);
            (_a = this._lowArea) === null || _a === void 0 ? void 0 : _a.setStyle('fill', this.model.color);
            if (super._prepareBelow(series, w, h)) {
                if (!lowArea) {
                    this._lineContainer.insertChild(lowArea = this._lowArea = new PathElement(this.doc, 'rct-area-series-area'), this._area);
                }
                this._area.setClip(this._upperClip);
                lowArea.setClip(this._lowerClip);
                return true;
            }
            else {
                lowArea === null || lowArea === void 0 ? void 0 : lowArea.setClip();
                this._area.setClip();
            }
        }
        _layoutMarkers(pts, width, height) {
            super._layoutMarkers(pts, width, height);
            const yAxis = this.model._yAxisObj;
            const yOrg = height;
            for (let i = 0, cnt = pts.length; i < cnt; i++) {
                const p = pts[i];
                p.yLow = yOrg - yAxis.getPosition(height, p.yGroup - p.yValue);
            }
        }
        _layoutArea(area, pts) {
            const series = this.model;
            const lowArea = this._needBelow ? this._lowArea : void 0;
            const g = series.group;
            const inverted = series.chart.isInverted();
            const yAxis = series._yAxisObj;
            const len = inverted ? this.width : this.height;
            const base = series.getBaseValue(yAxis);
            const yMin = this.height - yAxis.getPosition(len, pickNum(base, yAxis.axisMin()));
            const sb = new PathBuilder();
            let i = 0;
            let s;
            while (i < pts.length && pts[i].isNull) {
                i++;
            }
            if (g && (g.layout === SeriesGroupLayout.STACK || g.layout === SeriesGroupLayout.FILL)) {
                const iSave = i;
                sb.move(pts[i].xPos, pts[i].yLow);
                sb.line(pts[i].xPos, pts[i].yPos);
                i++;
                while (i < pts.length) {
                    sb.line(pts[i].xPos, pts[i].yPos);
                    i++;
                }
                i = pts.length - 1;
                sb.line(pts[i].xPos, pts[i].yLow);
                while (i >= iSave) {
                    sb.line(pts[i].xPos, pts[i].yLow);
                    i--;
                }
            }
            else {
                sb.move(pts[i].xPos, yMin);
                sb.line(pts[i].xPos, pts[i].yPos);
                this._buildLines(pts, i + 1, sb);
                const path = sb._path;
                i = 6;
                while (i < path.length) {
                    if (path[i] === 'M') {
                        path.splice(i, 0, 'L', path[i - 2], yMin);
                        i += 3;
                        path.splice(i, 0, 'M', path[i + 1], yMin);
                        path[i + 3] = 'L';
                        i += 6;
                    }
                    else if (path[i] === 'Q') {
                        i += 4;
                    }
                    else {
                        i += 3;
                    }
                }
                sb.line(path[path.length - 2], yMin);
            }
            area.setPath(s = sb.end());
            area.clearStyleAndClass();
            area.setStyle('fill', series.color);
            area.addStyleOrClass(series.style);
            if (lowArea) {
                lowArea.setPath(s);
                lowArea.clearStyleAndClass();
                lowArea.setStyle('fill', series.color);
                lowArea.setStyleOrClass(series.style);
                lowArea.setStyleOrClass(series.belowStyle);
            }
        }
        _layoutPolar(area, pts) {
            const series = this.model;
            const g = series.group;
            const yAxis = series._yAxisObj;
            const base = yAxis instanceof LinearAxis ? series.getBaseValue(yAxis) : NaN;
            const len = this.height;
            yAxis.getPosition(len, Utils.isNotEmpty(base) ? base : yAxis.axisMax());
            const sb = new PathBuilder();
            if (g && (g.layout === SeriesGroupLayout.STACK || g.layout === SeriesGroupLayout.FILL)) {
                sb.move(pts[0].xPos, pts[0].yLow);
                sb.line(pts[0].xPos, pts[0].yPos);
                for (let i = 1; i < pts.length; i++) {
                    sb.line(pts[i].xPos, pts[i].yPos);
                }
                sb.line(pts[pts.length - 1].xPos, pts[pts.length - 1].yLow);
                for (let i = pts.length - 1; i >= 0; i--) {
                    sb.line(pts[i].xPos, pts[i].yLow);
                }
                area.setPath(sb.end());
            }
            else {
                sb.move(pts[0].xPos, pts[0].yPos);
                for (let i = 1; i < pts.length; i++) {
                    sb.line(pts[i].xPos, pts[i].yPos);
                }
                area.setPath(sb.end());
            }
            area.clearStyleAndClass();
            area.setStyle('fill', series.color);
            area.addStyleOrClass(series.style);
        }
    }

    class BarRangeSeriesView extends RangedSeriesView {
        constructor(doc) {
            super(doc, 'rct-barrange-series');
            this._bars = new ElementPool(this._pointContainer, BarElement$6);
        }
        _getPointPool() {
            return this._bars;
        }
        _preparePointViews(doc, model, points) {
            this._bars.prepare(points.length, (v, i) => {
                v.point = points[i];
                points[i].color && v.setStyle('fill', points[i].color);
            });
        }
        _getLowValue(p) {
            return p.lowValue;
        }
        _layoutPointView(bar, i, x, y, wPoint, hPoint) {
            bar.wPoint = wPoint;
            bar.hPoint = hPoint;
            bar.layout(x, y + hPoint);
        }
    }

    class SectorElement extends PathElement {
        static create(doc, styleName, x, y, rx, ry, start, angle, clockwise = true) {
            return new SectorElement(doc, styleName, {
                cx: x,
                cy: y,
                rx: rx,
                ry: ry,
                innerRadius: 0,
                start: start,
                angle: angle,
                clockwise: clockwise
            });
        }
        static createInner(doc, styleName = '', x, y, rx, ry, innerRadius, start, angle, clockwise = true) {
            return new SectorElement(doc, styleName, {
                cx: x,
                cy: y,
                rx: rx,
                ry: ry,
                innerRadius: innerRadius,
                start: start,
                angle: angle,
                clockwise: clockwise
            });
        }
        constructor(doc, styleName = _undefined, shape = _undefined) {
            super(doc, styleName);
            this.cx = 0;
            this.cy = 0;
            this.rx = 0;
            this.ry = 0;
            this.innerRadius = 0;
            this.start = 0;
            this.angle = 0;
            this.clockwise = true;
            this.rate = 1;
            shape && this._assignShape(shape);
            this.setAttr('role', 'img');
        }
        equals(shape) {
            return shape.cx === this.cx &&
                shape.cy === this.cy &&
                shape.rx === this.rx &&
                shape.ry === this.ry &&
                shape.innerRadius === this.innerRadius &&
                shape.start === this.start &&
                shape.angle === this.angle &&
                shape.clockwise === this.clockwise;
        }
        setSector(shape) {
            this._assignShape(shape);
        }
        _getShape() {
            return {
                cx: this.cx,
                cy: this.cy,
                rx: this.rx,
                ry: this.ry,
                innerRadius: this.innerRadius,
                start: this.start,
                angle: this.angle,
                clockwise: this.clockwise
            };
        }
        _assignShape(shape) {
            this.cx = shape.cx;
            this.cy = shape.cy;
            this.rx = shape.rx;
            this.ry = shape.ry;
            this.innerRadius = shape.innerRadius;
            this.start = shape.start;
            this.angle = shape.angle;
            this.clockwise = shape.clockwise;
            this._updateShape();
        }
        _updateShape() {
            this.setPath(SvgShapes.sector(this.cx, this.cy, this.rx * this.rate, this.ry * this.rate, this.innerRadius || 0, this.start, this.start + this.angle, this.clockwise));
        }
    }

    class BarSectorView extends SectorElement {
        constructor(doc) {
            super(doc, SeriesView.POINT_CLASS);
        }
    }
    class BarSeriesView extends BoxedSeriesView {
        constructor(doc) {
            super(doc, 'rct-bar-series');
            this._labelInfo = {};
        }
        _getPointPool() {
            return this.chart()._polar ? this._sectors : this._bars;
        }
        _preparePointViews(doc, model, points) {
            if (model.chart._polar) {
                this.$_parepareSectors(doc, model, this._visPoints);
            }
            else {
                this.$_parepareBars(doc, model, this._visPoints);
            }
        }
        _layoutPointViews(width, height) {
            if (this.model.chart._polar) {
                this.$_layoutSectors();
            }
            else {
                super._layoutPointViews(width, height);
            }
        }
        _layoutPointView(view, i, x, y, wPoint, hPoint) {
            view.wPoint = wPoint;
            view.hPoint = hPoint;
            view.layout(x, y);
        }
        $_parepareBars(doc, model, points) {
            const style = model.style;
            if (!this._bars) {
                this._bars = new ElementPool(this._pointContainer, BarElement$6);
            }
            this._bars.prepare(points.length, (v, i) => {
                const p = v.point = points[i];
                v.setStyleOrClass(style);
                p.color && v.setStyle('fill', p.color);
            });
        }
        $_parepareSectors(doc, model, points) {
            const style = model.style;
            if (!this._sectors) {
                this._sectors = new ElementPool(this._pointContainer, BarSectorView);
            }
            this._sectors.prepare(points.length, (v, i) => {
                const p = v.point = points[i];
                v.setStyleOrClass(style);
                p.color && v.setStyle('fill', p.color);
            });
        }
        $_layoutSectors() {
            const series = this.model;
            const vr = this._getViewRate();
            const labels = series.pointLabel;
            const labelViews = this._labelViews();
            const body = series.chart.body;
            const xAxis = series._xAxisObj;
            const yAxis = series._yAxisObj;
            const polar = body.getPolar(series);
            const labelInfo = labelViews && Object.assign(this._labelInfo, {
                labelPos: series.getLabelPosition(labels.position),
                labelOff: series.getLabelOff(labels.offset)
            });
            this._sectors.forEach((view, i) => {
                const p = view.point;
                const y = yAxis.getPosition(polar.rd, p.yGroup) * vr;
                const wUnit = xAxis.getUnitLength(Math.PI * 2, p.xValue);
                const wPoint = series.getPointWidth(wUnit);
                view.setSector({
                    cx: polar.cx,
                    cy: polar.cy,
                    rx: y,
                    ry: y,
                    start: polar.start + i * polar.deg,
                    angle: wPoint,
                    clockwise: true
                });
                if (labelViews && (labelInfo.labelView = labelViews.get(p, 0))) {
                    const a = view.start + view.angle;
                    const x = view.cx + view.rx / 2 * Math.cos(a);
                    const y = view.cy + view.ry / 2 * Math.sin(a);
                    const r = labelInfo.labelView.getBBounds();
                    labelInfo.labelView._text.anchor = TextAnchor.MIDDLE;
                    labelInfo.labelView.translate(x - r.width / 2, y - r.height / 2);
                }
            });
        }
    }

    class BellCurveSeriesView extends AreaSeriesView {
        constructor(doc) {
            super(doc, 'rct-bellcurve-series');
        }
    }

    class BoxView extends GroupElement {
        constructor(doc) {
            super(doc, SeriesView.POINT_CLASS + ' rct-boxplot-point');
        }
        layout() {
            const p = this.point;
            const w = this.width;
            const h = this.height;
            const len = p.yValue - p.minValue;
            const x = w / 2;
            let y = 0;
            const yLow = y + h - h * (p.lowValue - p.minValue) / len;
            const yHigh = y + h - h * (p.highValue - p.minValue) / len;
            const hBox = h * (p.highValue - p.lowValue) / len;
            p.color && this._box.setStyle('fill', p.color);
            this._stemUp.setVLine(x, y, yHigh);
            this._stemDown.setVLine(x, yLow, h);
            this._min.setHLine(y, w / 4, w * 3 / 4);
            this._max.setHLine(y + h, w / 4, w * 3 / 4);
            this._box.setBox(0, yHigh, w, hBox);
            this._mid.setHLine(y + h - h * (p.midValue - p.minValue) / len, 0, w);
        }
        _doInitChildren(doc) {
            this.add(this._stemUp = new LineElement(doc, 'rct-boxplot-point-stem'));
            this.add(this._stemDown = new LineElement(doc, 'rct-boxplot-point-stem'));
            this.add(this._box = new RectElement(doc, 'rct-boxplot-point-box'));
            this.add(this._mid = new LineElement(doc, 'rct-boxplot-point-mid'));
            this.add(this._min = new LineElement(doc, 'rct-boxplot-point-min'));
            this.add(this._max = new LineElement(doc, 'rct-boxplot-point-max'));
        }
    }
    class BoxPlotSeriesView extends RangedSeriesView {
        constructor(doc) {
            super(doc, 'rct-boxplot-series');
            this._boxes = new ElementPool(this._pointContainer, BoxView);
        }
        _getPointPool() {
            return this._boxes;
        }
        _getLowValue(p) {
            return p.minValue;
        }
        _layoutPointView(box, i, x, y, wPoint, hPoint) {
            box.setBounds(x - wPoint / 2, y, wPoint, hPoint);
            box.layout();
        }
        _preparePointViews(doc, model, points) {
            this._boxes.prepare(points.length, (box, i) => {
                box.point = points[i];
            });
        }
    }

    let MarkerView$1 = class MarkerView extends PathElement {
        constructor(doc) {
            super(doc, SeriesView.POINT_CLASS);
        }
    };
    class BubbleSeriesView extends SeriesView {
        constructor(doc) {
            super(doc, 'rct-bubble-series');
            this._markers = new ElementPool(this._pointContainer, MarkerView$1);
        }
        _getPointPool() {
            return this._markers;
        }
        invertable() {
            return false;
        }
        _prepareSeries(doc, model) {
            this.$_prepareMarkser(this._visPoints);
        }
        _renderSeries(width, height) {
            this.$_layoutMarkers(width, height);
        }
        _runShowEffect(firstTime) {
            firstTime && SeriesAnimation.grow(this);
        }
        _doViewRateChanged(rate) {
            this.$_layoutMarkers(this.width, this.height);
        }
        $_prepareMarkser(points) {
            const series = this.model;
            const zAxis = series._xAxisObj._length < series._yAxisObj._length ? series._xAxisObj : series._yAxisObj;
            const len = zAxis._length;
            const marker = series.marker;
            const style = marker.style;
            const count = points.length;
            const { min, max } = series.getPxMinMax(len);
            this._markers.prepare(count, (m, i) => {
                const p = m.point = points[i];
                p.radius = series.getRadius(p.zValue, min, max);
                p.shape = marker.shape;
                style && m.setStyleOrClass(style);
                p.color && m.setStyle('fill', p.color);
            });
        }
        $_layoutMarkers(width, height) {
            const series = this.model;
            const inverted = this._inverted;
            const vr = this._getViewRate();
            const labels = series.pointLabel;
            labels.offset;
            const labelViews = this._labelViews();
            const xAxis = series._xAxisObj;
            const yAxis = series._yAxisObj;
            const yLen = inverted ? width : height;
            const xLen = inverted ? height : width;
            const yOrg = height;
            let labelView;
            let r;
            this._markers.forEach((mv, i) => {
                const p = mv.point;
                if (mv.setVisible(!p.isNull && !isNaN(p.zValue))) {
                    const sz = p.radius * vr;
                    let path;
                    let x;
                    let y;
                    x = p.xPos = xAxis.getPosition(xLen, p.xValue);
                    y = p.yPos = yOrg - yAxis.getPosition(yLen, p.yValue);
                    if (inverted) {
                        x = yAxis.getPosition(yLen, p.yGroup);
                        y = yOrg - xAxis.getPosition(xLen, p.xValue);
                    }
                    path = SvgShapes.circle(0, 0, sz);
                    mv.setPath(path);
                    mv.translate(x, y);
                    this._setPointIndex(mv, p);
                    if (labelViews && (labelView = labelViews.get(p, 0))) {
                        labelView.setContrast(mv.dom);
                        labelView.layout();
                        r = labelView.getBBounds();
                        if (labelView.setVisible(r.width <= p.radius)) {
                            labelView.translate(x - r.width / 2, y - r.height / 2);
                        }
                    }
                }
            });
        }
    }

    let StickView$1 = class StickView extends GroupElement {
        constructor(doc) {
            super(doc, SeriesView.POINT_CLASS);
        }
        layout() {
            const p = this.point;
            const w = this.width;
            const h = this.height;
            const len = p.highValue - p.lowValue;
            const x = 0;
            let y = 0;
            const yOpen = y + h - h * (Math.min(p.openValue, p.closeValue) - p.lowValue) / len;
            const yClose = y + h - h * (Math.max(p.openValue, p.closeValue) - p.lowValue) / len;
            const yBox = Math.min(yClose, yOpen);
            const hBox = Math.max(1, Math.abs(yOpen - yClose));
            const fall = p.close < p.open;
            this._body.setStyle('fill', fall ? '' : p.color);
            this._wickUpper.setVLine(x, y, yClose);
            this._wickLower.setVLine(x, yOpen, h);
            this._body.setBox(-w / 2, yBox, w, hBox);
            this._body.setStyleName(fall ? 'rct-candlestick-point-fall' : '');
        }
        _doInitChildren(doc) {
            this.add(this._wickUpper = new LineElement(doc, 'rct-candlestick-point-wick'));
            this.add(this._wickLower = new LineElement(doc, 'rct-candlestick-point-wick'));
            this.add(this._body = new RectElement(doc));
        }
    };
    class CandlestickSeriesView extends RangedSeriesView {
        constructor(doc) {
            super(doc, 'rct-candlestick-series');
            this._sticks = new ElementPool(this._pointContainer, StickView$1);
        }
        _getPointPool() {
            return this._sticks;
        }
        _getLowValue(p) {
            return p.lowValue;
        }
        _preparePointViews(doc, model, points) {
            this._sticks.prepare(points.length, (box, i) => {
                box.point = points[i];
            });
        }
        _layoutPointView(box, i, x, y, wPoint, hPoint) {
            box.setBounds(x, y, wPoint, hPoint);
            box.layout();
        }
    }

    let BarElement$5 = class BarElement extends GroupElement {
        constructor(doc) {
            super(doc, SeriesView.POINT_CLASS);
            this.add(this._line = new LineElement(doc));
            this.add(this._hmarker = new PathElement(doc, 'rct-dumbbell-point-marker'));
            this.add(this._lmarker = new PathElement(doc, 'rct-dumbbell-point-marker'));
        }
        layout(inverted) {
            const h = this.point.hPoint;
            if (inverted) {
                this._line.setHLineC(0, 0, h);
                this._hmarker.renderShape(this.point.shape, 0, 0, this.point.radius);
                this._lmarker.renderShape(this.point.shape, h, 0, this.point.radius);
            }
            else {
                this._line.setVLineC(0, 0, h);
                this._hmarker.renderShape(this.point.shape, 0, 0, this.point.radius);
                this._lmarker.renderShape(this.point.shape, 0, h, this.point.radius);
            }
            return this;
        }
    };
    class DumbbellSeriesView extends SeriesView {
        constructor(doc) {
            super(doc, 'rct-dumbbell-series');
            this._labelInfo = {};
        }
        _getPointPool() {
            return this._bars;
        }
        _prepareSeries(doc, model) {
            this.$_parepareBars(doc, model, this._visPoints);
        }
        _renderSeries(width, height) {
            this.$_layoutBars(width, height);
        }
        _runShowEffect(firstTime) {
            firstTime && SeriesAnimation.grow(this);
        }
        _doViewRateChanged(rate) {
            this.$_layoutBars(this.width, this.height);
        }
        $_parepareBars(doc, model, points) {
            const style = model.style;
            if (!this._bars) {
                this._bars = new ElementPool(this._pointContainer, BarElement$5);
            }
            this._bars.prepare(points.length, (v, i) => {
                v.point = points[i];
                v.setStyleOrClass(style);
                v.point.color && v.setStyle('fill', v.point.color);
            });
        }
        $_layoutBars(width, height) {
            const series = this.model;
            const inverted = series.chart.isInverted();
            const vr = this._getViewRate();
            const labels = series.pointLabel;
            const labelOff = labels.offset;
            const labelViews = this._labelViews();
            const xAxis = series._xAxisObj;
            const yAxis = series._yAxisObj;
            const wPad = xAxis instanceof CategoryAxis ? xAxis.categoryPad() * 2 : 0;
            const yLen = inverted ? width : height;
            const xLen = inverted ? height : width;
            const org = inverted ? 0 : height;
            this._bars.forEach((bar, i) => {
                const p = bar.point;
                if (bar.setVisible(!p.isNull)) {
                    const wUnit = xAxis.getUnitLength(xLen, p.xValue) * (1 - wPad);
                    const wPoint = series.getPointWidth(wUnit);
                    const yVal = yAxis.getPosition(yLen, p.yValue);
                    const hPoint = Math.abs(yAxis.getPosition(yLen, p.lowValue) - yVal) * vr;
                    let labelView;
                    let x;
                    let y;
                    if (inverted) {
                        y = xLen - xAxis.getPosition(xLen, p.xValue);
                        x = org;
                    }
                    else {
                        x = xAxis.getPosition(xLen, p.xValue);
                        y = org;
                    }
                    if (inverted) {
                        p.yPos = y += series.getPointPos(wUnit) - wPoint / 2;
                        p.xPos = x += yAxis.getPosition(yLen, p.yGroup) * vr;
                        x -= hPoint;
                    }
                    else {
                        p.xPos = x += series.getPointPos(wUnit) - wPoint / 2;
                        p.yPos = y -= yAxis.getPosition(yLen, p.yGroup) * vr;
                    }
                    p.hPoint = hPoint;
                    bar.layout(inverted).translate(x, y);
                    if (labelViews) {
                        if (labelView = labelViews.get(p, 1)) {
                            const r = labelView.getBBounds();
                            if (inverted) {
                                labelView.translate(x + hPoint + labelOff + p.radius, y - r.height / 2);
                            }
                            else {
                                labelView.translate(x - r.width / 2, y - r.height - labelOff - p.radius);
                            }
                        }
                        if (labelView = labelViews.get(p, 0)) {
                            const r = labelView.getBBounds();
                            if (inverted) {
                                labelView.translate(x - r.width - labelOff - p.radius, y - r.height / 2);
                            }
                            else {
                                labelView.translate(x - r.width / 2, y + hPoint + labelOff + p.radius);
                            }
                        }
                    }
                }
            });
        }
    }

    let BarElement$4 = class BarElement extends GroupElement {
        constructor(doc) {
            super(doc, SeriesView.POINT_CLASS);
            this._backs = new ElementPool(this, PathElement);
            this._segments = new ElementPool(this, PathElement);
            this._decimal = 0;
        }
        prepareSegments(backs, total, count, decimal, backStyle) {
            this._decimal = decimal;
            this._backs
                .prepare(backs ? total : 0)
                .forEach((v, i) => {
                v.setStyleName(backStyle);
            });
            this._segments
                .prepare(Math.round(count))
                .forEach((v, i) => {
            });
        }
        layout(pts, x, y) {
            const w = this.wPoint;
            const h = this.hPoint;
            const m = h < 0 ? Math.max : Math.min;
            x -= w / 2;
            if (h < 0) {
                pts = pts.map(p => -p);
            }
            this._backs.forEach((step, i) => {
                step.setPath(SvgShapes.rectangle(0, y - pts[i * 2], w, m(-1, (pts[i * 2] - pts[i * 2 + 1]))));
            });
            this._segments.forEach((step, i, count) => {
                if (i === count - 1 && this._decimal > 0) {
                    step.setPath(SvgShapes.rectangle(x, y - pts[i * 2], w, h < 0 ? m(1, this._decimal) : m(-1, -this._decimal)));
                }
                else {
                    step.setPath(SvgShapes.rectangle(x, y - pts[i * 2], w, m(-1, (pts[i * 2] - pts[i * 2 + 1]))));
                }
            });
        }
    };
    class EqualizerSeriesView extends BoxedSeriesView {
        constructor(doc) {
            super(doc, 'rct-equalizer-series');
            this._bars = new ElementPool(this._pointContainer, BarElement$4);
        }
        _getPointPool() {
            return this._bars;
        }
        _preparePointViews(doc, model, points) {
            this.$_parepareBars(points);
        }
        _layoutPointViews(width, height) {
            const len = (this._inverted ? width : height) * this._getViewRate();
            this.$_buildSegments(this.model, len);
            super._layoutPointViews(width, height);
        }
        _layoutPointView(view, i, x, y, wPoint, hPoint) {
            view.wPoint = wPoint;
            view.hPoint = hPoint;
            view.layout(this._pts, x, y);
        }
        $_parepareBars(points) {
            this._bars.prepare(points.length, (v, i) => {
                v.point = points[i];
                v.point.color && v.setStyle('fill', v.point.color);
            });
        }
        $_buildSegments(series, len) {
            const backs = series.backSegments;
            const max = series._yAxisObj.axisMax();
            const segmented = series.segmented;
            const gap = series.segmentGap || 0;
            const pts = this._pts = [];
            let y = 0;
            let sz;
            let cnt;
            if (series.maxCount > 0) {
                cnt = series.maxCount;
            }
            else {
                cnt = Math.round(len / (series.getSegmentSize(len) + gap / 2));
            }
            sz = (len - gap * (cnt - 1)) / cnt;
            while (pts.length < cnt * 2) {
                pts.push(y, y + sz);
                y += sz + gap;
            }
            pts[pts.length - 1] = len;
            const total = pts.length / 2;
            this._bars.forEach(bar => {
                const p = bar.point;
                if (bar.setVisible(!p.isNull)) {
                    const v = p.yValue / max;
                    let n = -1;
                    let decimal = 0;
                    for (let i = 0; i < total - 1; i++) {
                        if (v >= pts[i * 2] / len && v < pts[(i + 1) * 2] / len) {
                            n = i + 1;
                            if (!segmented && v < pts[i * 2 + 1] / len) {
                                decimal = v * len - pts[i * 2];
                            }
                            else {
                                decimal = sz;
                            }
                            break;
                        }
                    }
                    if (n < 0) {
                        n = total;
                        decimal = sz;
                    }
                    bar.prepareSegments(backs, total, n, decimal, series.backStyle);
                }
            });
        }
    }

    let BarElement$3 = class BarElement extends GroupElement {
        constructor(doc) {
            super(doc, SeriesView.POINT_CLASS);
            this.add(this._stem = new LineElement(doc));
            this.add(this._whiskerUp = new LineElement(doc));
            this.add(this._whiskerDown = new LineElement(doc));
        }
        layout() {
            const w = this.width;
            const h = this.height;
            const x = w / 2;
            this._stem.setVLine(x, 0, h);
            this._whiskerUp.setHLine(0, 0, w);
            this._whiskerDown.setHLine(h, 0, w);
        }
    };
    class ErrorBarSeriesView extends RangedSeriesView {
        constructor(doc) {
            super(doc, 'rct-errorbar-series');
            this._bars = new ElementPool(this._pointContainer, BarElement$3);
        }
        _getPointPool() {
            return this._bars;
        }
        _getLowValue(p) {
            return p.lowValue;
        }
        _preparePointViews(doc, model, points) {
            this._bars.prepare(points.length, (v, i) => {
                v.point = points[i];
                points[i].color && v.setStyle('stroke', points[i].color);
            });
        }
        _layoutPointView(box, i, x, y, wPoint, hPoint) {
            box.setBounds(x - wPoint / 2, y, wPoint, hPoint);
            box.layout();
        }
    }

    class FunnelSegment extends PathElement {
        constructor(doc) {
            super(doc, SeriesView.POINT_CLASS);
        }
    }
    class FunnelSeriesView extends SeriesView {
        constructor(doc) {
            super(doc, 'rct-funnel-series');
            this._segments = new ElementPool(this._pointContainer, FunnelSegment);
        }
        _getPointPool() {
            return this._segments;
        }
        _prepareSeries(doc, model) {
            this.$_prepareSegments(this._visPoints);
        }
        _renderSeries(width, height) {
            this.$_layoutSegments(width, height);
        }
        _runShowEffect(firstTime) {
            firstTime && SeriesAnimation.slide(this, { from: this.model.reversed ? 'bottom' : 'top' });
        }
        $_prepareSegments(points) {
            const count = points.length;
            this._segments.prepare(count, (m, i) => {
                const p = points[i];
                m.point = p;
                p.color && m.setStyle('fill', p.color);
            });
        }
        $_layoutSegments(width, height) {
            function getPosAt(y) {
                if (reversed) {
                    return x1 + (xNeck - x1) * (yEnd - y) / (yEnd - yNeck);
                }
                else {
                    return x1 + (xNeck - x1) * (y - y1) / (yNeck - y1);
                }
            }
            const series = this.model;
            series.pointLabel;
            const labelViews = this._labelViews();
            const reversed = series.reversed;
            const sz = series.getSize(width, height);
            const szNeck = series.getNeckSize(width, height);
            const builder = new PathBuilder();
            const x1 = (width - sz.width) / 2;
            const y1 = (height - sz.height) / 2;
            const yEnd = y1 + sz.height;
            const xMid = x1 + sz.width / 2;
            const pNeck = sz.height - szNeck.height;
            const yNeck = reversed ? yEnd - pNeck : y1 + pNeck;
            const xNeck = x1 + (sz.width - szNeck.width) / 2;
            let labelView;
            this._segments.forEach((seg) => {
                const p = seg.point;
                if (seg.setVisible(!p.isNull)) {
                    const start = p.yPos * sz.height;
                    const end = (p.yPos + p.height) * sz.height;
                    const y = reversed ? (yEnd - start) : y1 + start;
                    const y2 = reversed ? (yEnd - end) : y1 + end;
                    let x;
                    let x2;
                    let x3;
                    let x4;
                    if (start >= pNeck) {
                        x = xNeck;
                        x2 = x + szNeck.width;
                        builder.move(x, y).lines(x2, y, x2, y2, x, y2);
                    }
                    else if (end < pNeck) {
                        x = getPosAt(y);
                        x2 = x + (xMid - x) * 2;
                        x3 = getPosAt(y2);
                        x4 = x3 + (xMid - x3) * 2;
                        builder.move(x, y).lines(x2, y, x4, y2, x3, y2);
                    }
                    else {
                        x = getPosAt(y);
                        x2 = x + (xMid - x) * 2;
                        x3 = xNeck;
                        x4 = x3 + szNeck.width;
                        builder.move(x, y).lines(x2, y, x4, yNeck, x4, y2, x3, y2, x3, yNeck);
                    }
                    const path = builder.close(true);
                    seg.setPath(path);
                    p.xPos = xMid;
                    p.yPos = y + (y2 - y) / 2;
                    if (labelViews && (labelView = labelViews.get(p, 0))) {
                        const r = labelView.getBBounds();
                        labelView.translate(xMid - r.width / 2, y + ((y2 - y) - r.height) / 2);
                    }
                }
            });
        }
    }

    class CellView extends RectElement {
        constructor(doc) {
            super(doc, SeriesView.POINT_CLASS);
        }
    }
    class HeatmapSeriesView extends SeriesView {
        constructor(doc) {
            super(doc, 'rct-heatmap-series');
            this._cells = new ElementPool(this._pointContainer, CellView);
        }
        _getPointPool() {
            return this._cells;
        }
        _prepareSeries(doc, model) {
            this.$_parepareCells(this._visPoints);
        }
        _renderSeries(width, height) {
            this._pointContainer.invert(this._inverted, height);
            this.$_layoutCells(width, height);
        }
        _runShowEffect(firstTime) {
            firstTime && SeriesAnimation.slide(this);
        }
        $_parepareCells(points) {
            this._cells.prepare(points.length, (v, i) => {
                v.point = points[i];
            });
        }
        $_layoutCells(width, height) {
            const series = this.model;
            const inverted = series.chart.isInverted();
            const labels = series.pointLabel;
            labels.offset;
            const labelViews = this._labelViews();
            const xAxis = series._xAxisObj;
            const yAxis = series._yAxisObj;
            const yLen = inverted ? width : height;
            const xLen = inverted ? height : width;
            const color = new Color(this._getColor());
            this._cells.forEach(cell => {
                const p = cell.point;
                if (cell.setVisible(!p.isNull)) {
                    const wUnit = xAxis.getUnitLength(xLen, p.xValue);
                    const wPoint = wUnit;
                    const hUnit = yAxis.getUnitLength(yLen, p.yValue);
                    const hPoint = hUnit;
                    const org = inverted ? 0 : height;
                    let x;
                    let y;
                    let labelView;
                    x = (p.xPos = xAxis.getPosition(xLen, p.xValue)) - wUnit / 2;
                    y = (p.yPos = org - yAxis.getPosition(yLen, p.yValue)) - hUnit / 2;
                    cell.setBounds(x, y, wPoint, hPoint);
                    cell.setStyle('fill', color.brighten(1 - p.heatValue / series._heatMax).toString());
                    if (labelViews && (labelView = labelViews.get(p, 0))) {
                        const r = labelView.getBBounds();
                        if (inverted) {
                            y = xLen - xAxis.getPosition(xLen, p.xValue);
                            x = org;
                            y -= r.height / 2;
                            x += yAxis.getPosition(yLen, p.yValue) - r.width / 2;
                        }
                        else {
                            x += (wPoint - r.width) / 2;
                            y += (hPoint - r.height) / 2;
                        }
                        labelView.translate(x, y);
                    }
                }
            });
        }
    }

    let BarElement$2 = class BarElement extends BoxPointElement {
        layout(x, y) {
            this.setPath(SvgShapes.rect({
                x: x - this.wPoint / 2,
                y,
                width: this.wPoint,
                height: -this.hPoint
            }));
        }
    };
    class HistogramSeriesView extends ClusterableSeriesView {
        constructor(doc) {
            super(doc, 'rct-histogram-series');
            this._bars = new ElementPool(this._pointContainer, BarElement$2);
        }
        _getPointPool() {
            return this._bars;
        }
        _preparePointViews(doc, model, points) {
            this.$_parepareBars(doc, points);
        }
        _layoutPointView(bar, i, x, y, wPoint, hPoint) {
            bar.wPoint = wPoint;
            bar.hPoint = hPoint;
            bar.layout(x, y);
        }
        _layoutPointViews(width, height) {
            const series = this.model;
            const inverted = this._inverted;
            const vr = this._getViewRate();
            const labels = series.pointLabel;
            const labelViews = this._labelViews();
            const xAxis = series._xAxisObj;
            const yAxis = series._yAxisObj;
            const yLen = inverted ? width : height;
            const xLen = inverted ? height : width;
            const yBase = yAxis.getPosition(yLen, series.getBaseValue(yAxis));
            const org = inverted ? 0 : height;
            const info = labelViews && Object.assign(this._labelInfo, {
                inverted,
                labelPos: series.getLabelPosition(labels.position),
                labelOff: series.getLabelOff(labels.offset)
            });
            this._getPointPool().forEach((pointView, i) => {
                const p = pointView.point;
                const x1 = xAxis.getPosition(xLen, p.min);
                const x2 = xAxis.getPosition(xLen, p.max);
                const yVal = yAxis.getPosition(yLen, p.yValue);
                const w = (x2 - x1) + (x2 > x1 ? -1 : 1);
                const h = yVal - yBase;
                let x = x1 + (x2 - x1) / 2;
                let y = org;
                p.xPos = x;
                p.yPos = y -= yVal;
                this._layoutPointView(pointView, i, x, y + h, w, h * vr);
                if (info && (info.labelView = labelViews.get(p, 0))) {
                    if (inverted) {
                        y = xLen - x;
                        x = org;
                        p.yPos = y;
                        p.xPos = x += yAxis.getPosition(yLen, p.yGroup);
                    }
                    info.pointView = pointView;
                    info.x = x;
                    info.y = y;
                    info.wPoint = w;
                    info.hPoint = h;
                    this._layoutLabel(info);
                }
            });
        }
        $_parepareBars(doc, points) {
            this._bars.prepare(points.length, (v, i) => {
                v.point = points[i];
            });
        }
        $_layoutBars(width, height) {
            const xAxis = this.model._xAxisObj;
            const yAxis = this.model._yAxisObj;
            const y = this.height;
            const vr = this._getViewRate();
            this._bars.forEach((bar, i) => {
                const p = bar.point;
                const x1 = xAxis.getPosition(width, p.min);
                const x2 = xAxis.getPosition(width, p.max);
                const x = x1 + (x2 - x1) / 2;
                const h = yAxis.getPosition(height, bar.point.yValue) * vr;
                const w = Math.max(1, x2 - x1 - 1);
                p.xPos = x;
                p.yPos = y - h;
                bar.wPoint = w;
                bar.hPoint = h;
                bar.layout(x, y);
            });
        }
    }

    let BarElement$1 = class BarElement extends GroupElement {
        constructor(doc) {
            super(doc, SeriesView.POINT_CLASS);
            this.add(this._line = new LineElement(doc));
            this.add(this._marker = new PathElement(doc, 'rct-lollipop-point-marker'));
        }
        layout() {
            this._line.setVLineC(0, 0, this.height);
            this._marker.renderShape(this.point.shape, 0, 0, this.point.radius);
        }
    };
    class LollipopSeriesView extends BoxedSeriesView {
        constructor(doc) {
            super(doc, 'rct-lollipop-series');
        }
        _getPointPool() {
            return this._bars;
        }
        _preparePointViews(doc, model, points) {
            this.$_parepareBars(doc, model, points);
        }
        _layoutPointView(view, i, x, y, wPoint, hPoint) {
            view.setBounds(x, y - hPoint, 0, hPoint);
            view.layout();
        }
        $_parepareBars(doc, model, points) {
            const style = model.style;
            if (!this._bars) {
                this._bars = new ElementPool(this._pointContainer, BarElement$1);
            }
            this._bars.prepare(points.length, (v, i) => {
                v.point = points[i];
                points[i].color && v.setStyle('fill', points[i].color);
                style && v.setStyleOrClass(style);
            });
        }
    }

    class StickView extends GroupElement {
        constructor(doc) {
            super(doc, SeriesView.POINT_CLASS);
        }
        layout() {
            const p = this.point;
            const w = this.width;
            const h = this.height;
            const len = p.highValue - p.lowValue;
            const x = 0;
            const x1 = -w / 2;
            let y = 0;
            const yOpen = y + h - h * (Math.min(p.openValue, p.closeValue) - p.lowValue) / len;
            const yClose = y + h - h * (Math.max(p.openValue, p.closeValue) - p.lowValue) / len;
            this._back.setBox(x1, 0, w, h);
            this._tickOpen.setHLine(yOpen, x1, x);
            this._tickClose.setHLine(yClose, x, this.width);
            this._bar.setVLine(x, y, y + h);
            this._bar.setStyleName(p.close < p.open ? 'rct-ohlc-point-bar-fall' : 'rct-ohlc-point-bar');
        }
        _doInitChildren(doc) {
            this.add(this._tickOpen = new LineElement(doc, 'rct-ohlc-point-tick'));
            this.add(this._tickClose = new LineElement(doc, 'rct-ohlc-point-tick'));
            this.add(this._bar = new LineElement(doc));
            this.add(this._back = new RectElement(doc, 'rct-ohlc-point-back'));
            Dom.setImportantStyle(this._back.dom.style, 'fill', 'transparent');
        }
    }
    class OhlcSeriesView extends RangedSeriesView {
        constructor(doc) {
            super(doc, 'rct-ohlc-series');
            this._sticks = new ElementPool(this._pointContainer, StickView);
        }
        _getPointPool() {
            return this._sticks;
        }
        _getLowValue(p) {
            return p.lowValue;
        }
        _preparePointViews(doc, model, points) {
            this.$_prepareSticks(points);
        }
        _layoutPointView(view, index, x, y, wPoint, hPoint) {
            view.setBounds(x, y, wPoint, hPoint);
            view.layout();
        }
        $_prepareSticks(points) {
            this._sticks.prepare(points.length, (box, i) => {
                box.point = points[i];
            });
        }
        $_layoutSticks(width, height) {
            const series = this.model;
            this._inverted;
            const vr = this._getViewRate();
            const labels = series.pointLabel;
            const labelOff = labels.offset;
            const labelViews = this._labelViews();
            const xAxis = series._xAxisObj;
            const yAxis = series._yAxisObj;
            const yOrg = this.height;
            this._sticks.forEach((box, i) => {
                const p = box.point;
                if (box.setVisible(!p.isNull)) {
                    const wUnit = xAxis.getUnitLength(width, p.xValue);
                    const wPoint = series.getPointWidth(wUnit);
                    const x = (p.xPos = xAxis.getPosition(width, p.xValue)) - wPoint / 2;
                    const y = p.yPos = yOrg - yAxis.getPosition(height, p.yValue) * vr;
                    const w = wPoint;
                    const h = Math.abs(yOrg - yAxis.getPosition(height, p.lowValue) - y) * vr;
                    let view;
                    box.setBounds(x, y, w, h);
                    box.layout();
                    if (labelViews && (view = labelViews.get(p, 0))) {
                        const r = view.getBBounds();
                        view.translate(x + (w - r.width) / 2, y - r.height - labelOff);
                    }
                }
            });
        }
    }

    class ParetoSeriesView extends LineSeriesBaseView {
        constructor(doc) {
            super(doc, 'rct-pareto-series');
        }
    }

    class CircleElement extends RcElement {
        constructor(doc, styleName, cx, cy, radius) {
            super(doc, styleName, 'circle');
            if (typeof cx === 'number') {
                this.setCircle(cx, cy, radius);
            }
        }
        setCircle(cx, cy, radius) {
            this.setAttrs({
                cx: cx,
                cy: cy,
                r: radius
            });
        }
    }

    class SectorView extends SectorElement {
        constructor(doc) {
            super(doc, SeriesView.POINT_CLASS);
        }
        setSectorEx(labels, lines, newSector, animate = false) {
            let animated = false;
            if (animate) {
                animated = true;
            }
            else {
                this._assignShape(newSector);
            }
            return animated;
        }
    }
    class PieSeriesView extends SeriesView {
        constructor(doc) {
            super(doc, 'rct-pie-series');
            this._sectors = new ElementPool(this._pointContainer, SectorView, null, 0.5);
            this._cx = 0;
            this._cy = 0;
            this._rd = 0;
            this._rdInner = 0;
            this._slicedOff = 0;
            this.add(this._circle = new CircleElement(doc));
            this._circle.setStyles({
                stroke: '#aaa',
                fill: 'none',
                strokeDasharray: '2'
            });
            this.add(this._lineContainer = new PointLabelLineContainer(doc));
        }
        _getPointPool() {
            return this._sectors;
        }
        _prepareSeries(doc, model) {
            this.$_prepareSectors(this._visPoints);
            this._lineContainer.prepare(model);
        }
        _renderSeries(width, height) {
            if (!isNaN(this.model._groupPos)) {
                this.$_calcGroup(width, height);
            }
            else {
                this.$_calcNormal(width, height);
            }
            this.$_layoutSectors(this._visPoints, width, height);
        }
        $_calcNormal(width, height) {
            const sz = this.model.getSize(width, height);
            this._rd = Math.floor(sz / 2);
            this._rdInner = this.model.getInnerRadius(this._rd);
        }
        $_calcGroup(width, height) {
            const m = this.model;
            const g = m.group;
            const sz = Math.floor(g ? g.getPolarSize(width, height) / 2 : m.getSize(width, height) / 2);
            const szInner = g ? g.getInnerRadius(sz) * sz : m.getInnerRadius(sz);
            const len = sz - szInner;
            this._rd = szInner + (m._groupPos + m._groupSize) * len;
            this._rdInner = (szInner + m._groupPos * len) / this._rd;
        }
        _runShowEffect(firstTime) {
            firstTime && SeriesAnimation.grow(this);
        }
        _doPointClicked(view) {
        }
        $_prepareSectors(points) {
            const count = points.length;
            this._sectors.prepare(count, (sector, i) => {
                const p = points[i];
                sector.point = p;
                sector.setAttr('aria-label', p.ariaHint());
                p.color && sector.setStyle('fill', p.color);
                p._calcedColor = getComputedStyle(sector.dom).fill;
            });
        }
        $_calcAngles(points) {
            const vr = this._getViewRate();
            const sum = points.filter(p => p.visible && !p.isNull).map(p => p.yValue).reduce((a, c) => a + c, 0);
            let start = ORG_ANGLE + deg2rad(this.model.startAngle);
            points.forEach(p => {
                p.yRate = p.yValue / sum;
                p.startAngle = start;
                start += p.angle = p.yRate * Math.PI * 2 * vr;
            });
        }
        $_layoutSectors(points, width, height) {
            const series = this.model;
            series._colorByPoint();
            const vr = this._getViewRate();
            const cx = this._cx = Math.floor(width / 2);
            const cy = this._cy = Math.floor(height / 2);
            const rd = this._rd;
            const rdInner = this._rdInner;
            const labels = series.pointLabel;
            const labelInside = series.getLabelPosition();
            labels.offset;
            const labelViews = this._labelViews();
            const lineViews = this._lineContainer;
            const sliceOff = this._slicedOff = series.getSliceOffset(rd) * vr;
            let labelView;
            if (this._circle.visible = this._sectors.isEmpty) {
                this._circle.setCircle(this._cx, this._cy, this._rd);
            }
            this.$_calcAngles(points);
            this._sectors.forEach((sector) => {
                const p = sector.point;
                if (!p.isNull) {
                    const start = p.startAngle;
                    let dx = 0;
                    let dy = 0;
                    if (p.sliced) {
                        const a = start + p.angle / 2;
                        dx += Math.cos(a) * sliceOff;
                        dy += Math.sin(a) * sliceOff;
                    }
                    const a = p.startAngle + p.angle / 2;
                    p.xPos = cx + Math.cos(a) * (sliceOff + rd * 0.7);
                    p.yPos = cy + Math.sin(a) * (sliceOff + rd * 0.7);
                    sector.setSectorEx(labelViews, null, {
                        cx: cx + dx,
                        cy: cy + dy,
                        rx: rd,
                        ry: rd,
                        innerRadius: rdInner,
                        start: start,
                        angle: p.angle,
                        clockwise: true
                    }, false);
                    this._setPointIndex(sector, p);
                    if (labelViews && (labelView = labelViews.get(p, 0))) {
                        const line = lineViews.get(p);
                        if (labelInside) {
                            line.visible = false;
                            this.$_layoutLabelInner(p, labelView, 0, 0, p.sliced ? sliceOff : 0);
                        }
                        else {
                            line.visible = true;
                            this.$_layoutLabel(p, labelView, line, 0, 0, p.sliced ? sliceOff : 0);
                        }
                        labelView.setContrast(labelInside && sector.dom);
                    }
                }
            });
        }
        $_layoutLabel(p, view, line, off, dist, sliceOff) {
            const r = view.getBBounds();
            const a = p.startAngle + p.angle / 2;
            const isLeft = Utils.isLeft(a);
            let cx = this._cx;
            let cy = this._cy;
            let rd = this._rd + dist * 0.8;
            let dx = Math.cos(a) * sliceOff;
            let dy = Math.sin(a) * sliceOff;
            let x1 = cx + Math.cos(a) * this._rd;
            let y1 = cy + Math.sin(a) * this._rd;
            let x2 = cx + Math.cos(a) * rd;
            let y2 = cy + Math.sin(a) * rd;
            let x3;
            if (isLeft) {
                x3 = x2 - dist * 0.2;
            }
            else {
                x3 = x2 + dist * 0.2;
            }
            if (line) {
                line.visible = true;
                line.move(x1, y1);
                line.setLine(new PathBuilder().move(0, 0).quad(x2 - x1, y2 - y1, x3 - x1, y2 - y1).end());
                !view.moving && line.translate(x1 + dx, y1 + dy);
            }
            if (isLeft) {
                x3 -= r.width + off;
                y2 -= r.height / 2;
            }
            else {
                x3 += off;
                y2 -= r.height / 2;
            }
            view.move(x3, y2);
            !view.moving && view.layout().translate(x3 + dx, y2 + dy);
        }
        $_layoutLabelInner(p, view, off, dist, sliceOff) {
            const r = view.getBBounds();
            const a = p.startAngle + p.angle / 2;
            let x = this._cx + Math.cos(a) * (sliceOff + this._rd * 0.7);
            let y = this._cy + Math.sin(a) * (sliceOff + this._rd * 0.7);
            view.layout().translate(x - r.width / 2, y - r.height / 2);
        }
        _doViewRateChanged(rate) {
            this.$_layoutSectors(this._visPoints, this.width, this.height);
        }
    }

    class MarkerView extends PathElement {
        constructor(doc) {
            super(doc, SeriesView.POINT_CLASS);
        }
    }
    class ScatterSeriesView extends SeriesView {
        constructor(doc) {
            super(doc, 'rct-scatter-series');
            this._markers = new ElementPool(this._pointContainer, MarkerView);
        }
        _getPointPool() {
            return this._markers;
        }
        invertable() {
            return false;
        }
        _prepareSeries(doc, model) {
            this.$_prepareMarkers(this._visPoints);
        }
        _renderSeries(width, height) {
            this.$_layoutMarkers(width, height);
        }
        _runShowEffect(firstTime) {
            firstTime && SeriesAnimation.slide(this);
        }
        $_prepareMarkers(points) {
            const series = this.model;
            const color = series.color;
            series.marker;
            const count = points.length;
            this._pointContainer.setStyle('fill', color);
            this._markers.prepare(count, (m, i) => {
                const p = points[i];
                m.point = p;
            });
        }
        $_layoutMarkers(width, height) {
            const series = this.model;
            const inverted = this._inverted;
            const marker = series.marker;
            const labels = series.pointLabel;
            labels.offset;
            const labelViews = this._labelViews();
            const xAxis = series._xAxisObj;
            const yAxis = series._yAxisObj;
            const yLen = inverted ? width : height;
            const xLen = inverted ? height : width;
            const yOrg = height;
            let labelView;
            let r;
            this._markers.forEach((mv, i) => {
                const p = mv.point;
                if (mv.setVisible(!p.isNull)) {
                    const s = marker.shape;
                    const sz = marker.radius;
                    let path;
                    let x;
                    let y;
                    x = p.xPos = xAxis.getPosition(xLen, p.xValue);
                    y = p.yPos = yOrg - yAxis.getPosition(yLen, p.yValue);
                    if (inverted) {
                        x = yAxis.getPosition(yLen, p.yGroup);
                        y = yOrg - xAxis.getPosition(xLen, p.xValue);
                    }
                    switch (s) {
                        case 'square':
                        case 'diamond':
                        case 'triangle':
                        case 'itriangle':
                            path = SvgShapes[s](0 - sz, 0 - sz, sz * 2, sz * 2);
                            break;
                        default:
                            path = SvgShapes.circle(0, 0, sz);
                            break;
                    }
                    mv.setPath(path);
                    mv.translate(x, y);
                    this._setPointIndex(mv, p);
                    if (labelViews && (labelView = labelViews.get(p, 0))) {
                        r = labelView.getBBounds();
                        labelView.translate(x - r.width / 2, y - r.height / 2);
                    }
                }
            });
        }
    }

    class NodeView extends PathElement {
        constructor(doc) {
            super(doc, SeriesView.POINT_CLASS);
        }
        get point() {
            return this.node.point;
        }
        render() {
            this.setPath(SvgShapes.rect(this.node));
        }
    }
    class TreemapSeriesView extends SeriesView {
        constructor(doc) {
            super(doc, 'rct-treemap-series');
            this._nodeViews = new ElementPool(this._pointContainer, NodeView);
        }
        _lazyPrepareLabels() {
            return true;
        }
        _getPointPool() {
            return this._nodeViews;
        }
        _prepareSeries(doc, model) {
        }
        _renderSeries(width, height) {
            const series = this.model;
            series.pointLabel;
            const labelViews = this._labelViews();
            const nodes = series.buildMap(width, height);
            const color = new Color(series._calcedColor);
            let labelView;
            labelViews.prepare(this.doc, series);
            this._nodeViews.prepare(nodes.length, (v, i, count) => {
                const m = nodes[i];
                const g = m.parent;
                let c = color;
                if (g) {
                    if (!g._color && g.point.color) {
                        c = g._color = new Color(g.point.color);
                    }
                    else if (g._color) {
                        c = g._color;
                    }
                }
                v.node = m;
                v.setStyle('fill', c.brighten(m.index / count).toString());
                v.render();
                m.point.xPos = m.x + m.width / 2;
                m.point.yPos = m.y + m.height / 2;
                if (labelViews && (labelView = labelViews.get(m.point, 0))) {
                    const r = labelView.getBBounds();
                    if (labelView.setVisible(m.width >= r.height && m.height >= r.height)) {
                        labelView.translate(m.x + m.width / 2 - r.width / 2, m.y + m.height / 2 - r.height / 2);
                    }
                }
            });
        }
        _runShowEffect(firstTime) {
            firstTime && new SlideAnimation(this);
        }
    }

    class ArrowView extends PathElement {
        constructor(doc) {
            super(doc, SeriesView.POINT_CLASS);
        }
        layout(headType, rotation, inverted) {
            const len = this.point._len;
            const off = this.point._off;
            const body = 1 / 2;
            let pts;
            switch (headType) {
                case ArrowHead.NONE:
                    pts = [
                        0, -body * len,
                        0, body * len
                    ];
                    break;
                case ArrowHead.OPEN:
                    const w2 = 1.5 / 10;
                    const h2 = 4.5 / 10;
                    const h3 = 2 / 10;
                    pts = [
                        0, -h2 * len,
                        -w2 * len, -h3 * len,
                        0, -body * len,
                        w2 * len, -h3 * len,
                        0, -h2 * len,
                        0, body * len
                    ];
                    break;
                default:
                    const w = 1 / 10;
                    const h = 3 / 10;
                    pts = [
                        0, -h * len,
                        -w * len, -h * len,
                        0, -body * len,
                        w * len, -h * len,
                        0, -h * len,
                        0, body * len
                    ];
                    break;
            }
            const path = ['M', pts[0], pts[1] + off];
            for (let i = 2; i < pts.length; i += 2) {
                path.push('L', pts[i], pts[i + 1] + off);
            }
            this.rotation = rotation;
            this.setPath(path);
        }
    }
    class VectorSeriesView extends SeriesView {
        constructor(doc) {
            super(doc, 'rct-vector-series');
            this._arrows = new ElementPool(this._pointContainer, ArrowView);
        }
        _getPointPool() {
            return this._arrows;
        }
        _prepareSeries(doc, model) {
            this.$_prepareArrows(this._visPoints);
        }
        _renderSeries(width, height) {
            const series = this.model;
            const start = series.startAngle;
            const head = series.arrowHead;
            const xAxis = series._xAxisObj;
            const yAxis = series._yAxisObj;
            this._arrows.forEach(v => {
                const p = v.point;
                if (v.setVisible(!p.isNull)) {
                    const x = p.xPos = xAxis.getPosition(this.width, p.xValue);
                    const y = p.yPos = this.height - yAxis.getPosition(this.height, p.yValue);
                    v.translate(x, y);
                    v.layout(head, p.angleValue + start, false);
                }
            });
        }
        _runShowEffect(firstTime) {
            firstTime && SeriesAnimation.fadeIn(this);
        }
        $_prepareArrows(pts) {
            this._arrows.prepare(pts.length, (v, i) => {
                v.point = pts[i];
            });
        }
    }

    class BarElement extends BoxPointElement {
        layout(x, y) {
            this.setPath(SvgShapes.rect({
                x: x - this.wPoint / 2,
                y,
                width: this.wPoint,
                height: -this.hPoint
            }));
        }
    }
    class WaterfallSeriesView extends RangedSeriesView {
        constructor(doc) {
            super(doc, 'rct-waterfall-series');
            this._bars = new ElementPool(this._pointContainer, BarElement);
            this.add(this._lineContainer = new LayerElement(doc, 'rct-waterfall-series-lines'));
            this._lines = new ElementPool(this._lineContainer, LineElement);
        }
        _getPointPool() {
            return this._bars;
        }
        _getLowValue(p) {
            return p.low;
        }
        _preparePointViews(doc, model, points) {
            this.$_parepareBars(doc, points);
        }
        _layoutPointView(view, i, x, y, wPoint, hPoint) {
            const p = view.point;
            view.wPoint = wPoint;
            view.hPoint = hPoint;
            y += hPoint;
            view.layout(x, y);
            if (i > 0) {
                const line = this._lines.get(i - 1);
                const y2 = p._isSum ? y - hPoint : p.y >= 0 ? y : y - hPoint;
                line.setHLine(y2, this._xPrev + this._wPrev / 2, x - wPoint / 2);
            }
            this._xPrev = x;
            this._wPrev = wPoint;
        }
        _layoutPointViews(width, height) {
            if (this._inverted) {
                this._lineContainer.dom.style.transform = `translate(0px, ${height}px) rotate(90deg) scale(-1, 1)`;
            }
            else {
                this._lineContainer.dom.style.transform = '';
            }
            super._layoutPointViews(width, height);
        }
        $_parepareBars(doc, points) {
            this._bars.prepare(points.length, (v, i) => {
                const p = points[i];
                v.point = p;
                v.setStyleOrClass(p._isSum ? 'rct-waterfall-point-sum' : p.y < 0 ? 'rct-waterfall-point-negative' : '');
            });
            this._lines.prepare(points.length - 1, (v, i) => {
                v.visible = !points[i].isNull && !points[i + 1].isNull;
            });
        }
    }

    const series_types = {
        'area': AreaSeriesView,
        'arearange': AreaRangeSeriesView,
        'bar': BarSeriesView,
        'barrange': BarRangeSeriesView,
        'bellcurve': BellCurveSeriesView,
        'boxplot': BoxPlotSeriesView,
        'bubble': BubbleSeriesView,
        'candlestick': CandlestickSeriesView,
        'dumbbell': DumbbellSeriesView,
        'equalizer': EqualizerSeriesView,
        'errorbar': ErrorBarSeriesView,
        'funnel': FunnelSeriesView,
        'heatmap': HeatmapSeriesView,
        'histogram': HistogramSeriesView,
        'line': LineSeriesView,
        'lollipop': LollipopSeriesView,
        'ohlc': OhlcSeriesView,
        'pareto': ParetoSeriesView,
        'pie': PieSeriesView,
        'scatter': ScatterSeriesView,
        'treemap': TreemapSeriesView,
        'vector': VectorSeriesView,
        'waterfall': WaterfallSeriesView,
    };
    class AxisGridView extends ChartElement {
        constructor(doc) {
            super(doc, 'rct-axis-grid');
            this._lines = new ElementPool(this, LineElement);
        }
        _doMeasure(doc, model, hintWidth, hintHeight, phase) {
            this._pts = model.getPoints(model.axis._isHorz ? hintWidth : hintHeight);
            this._lines.prepare(this._pts.length, (line) => {
            });
            return Size.create(hintWidth, hintHeight);
        }
        _doLayout() {
            const axis = this.model.axis;
            const w = this.width;
            const h = this.height;
            const pts = this._pts;
            if (axis._isHorz) {
                this._lines.forEach((line, i) => {
                    line.setVLineC(pts[i], 0, h);
                });
            }
            else {
                this._lines.forEach((line, i) => {
                    line.setHLineC(h - pts[i], 0, w);
                });
            }
        }
    }
    class AxisBreakView extends RcElement {
        constructor(doc) {
            super(doc, 'rct-axis-break');
            this.add(this._mask = new PathElement(doc));
        }
        setModel(model) {
            this._model = model;
        }
        layout(width, height) {
            const m = this._model;
            const pb = new PathBuilder();
            pb.rect(0, 0, width, m._sect.len);
            this._mask.setPath(pb.end());
        }
    }
    class AxisGuideView extends RcElement {
        constructor(doc) {
            super(doc, 'rct-axis-guide');
            this.add(this._label = new TextElement(doc, 'rct-axis-guide-label'));
        }
        vertical() {
            return this.model.axis._isHorz;
        }
        prepare(model) {
            this.model = model;
            this._label.text = model.label.text;
            this._label.setStyles(model.label.style);
        }
    }
    class AxisGuideLineView extends AxisGuideView {
        constructor(doc) {
            super(doc);
            this.insertFirst(this._line = new LineElement(doc, 'rct-axis-guide-line'));
        }
        prepare(model) {
            super.prepare(model);
            this._line.setStyles(model.style);
        }
        layout(width, height) {
            const m = this.model;
            const label = m.label;
            const labelView = this._label;
            let x;
            let y;
            let anchor;
            let layout;
            if (this.vertical()) {
                const p = m.axis.getPosition(width, m.value, true);
                this._line.setVLineC(p, 0, height);
                switch (label.align) {
                    case Align.CENTER:
                        x = p;
                        anchor = TextAnchor.MIDDLE;
                        break;
                    case Align.RIGHT:
                        x = p;
                        anchor = TextAnchor.START;
                        break;
                    default:
                        x = p;
                        anchor = TextAnchor.END;
                        break;
                }
                switch (label.verticalAlign) {
                    case VerticalAlign.BOTTOM:
                        y = height;
                        layout = TextLayout.BOTTOM;
                        break;
                    case VerticalAlign.MIDDLE:
                        y = height / 2;
                        layout = TextLayout.MIDDLE;
                        break;
                    default:
                        y = 0;
                        layout = TextLayout.TOP;
                        break;
                }
            }
            else {
                const p = height - m.axis.getPosition(height, m.value, true);
                this._line.setHLineC(p, 0, width);
                switch (label.align) {
                    case Align.CENTER:
                        x = width / 2;
                        anchor = TextAnchor.MIDDLE;
                        break;
                    case Align.RIGHT:
                        x = width;
                        anchor = TextAnchor.END;
                        break;
                    default:
                        x = 0;
                        anchor = TextAnchor.START;
                        break;
                }
                switch (label.verticalAlign) {
                    case VerticalAlign.BOTTOM:
                        y = p + 1;
                        layout = TextLayout.TOP;
                        break;
                    case VerticalAlign.MIDDLE:
                        y = p;
                        layout = TextLayout.MIDDLE;
                        break;
                    default:
                        y = p - labelView.getBBounds().height;
                        layout = TextLayout.TOP;
                        break;
                }
            }
            labelView.anchor = anchor;
            labelView.layout = layout;
            labelView.translate(x, y);
        }
    }
    class AxisGuideRangeView extends AxisGuideView {
        constructor(doc) {
            super(doc);
            this.insertFirst(this._box = new BoxElement(doc, 'rct-axis-guide-range'));
        }
        prepare(model) {
            super.prepare(model);
        }
        layout(width, height) {
            const m = this.model;
            const label = this._label;
            if (this.vertical()) {
                const x1 = m.axis.getPosition(width, m.start, true);
                const x2 = m.axis.getPosition(width, m.end, true);
                let x;
                let y;
                let anchor;
                let layout;
                switch (m.label.align) {
                    case Align.CENTER:
                        x = x + (x2 - x1) / 2;
                        anchor = TextAnchor.MIDDLE;
                        break;
                    case Align.RIGHT:
                        x = x2;
                        anchor = TextAnchor.END;
                        break;
                    default:
                        x = x1;
                        anchor = TextAnchor.START;
                        break;
                }
                switch (m.label.verticalAlign) {
                    case VerticalAlign.BOTTOM:
                        y = height;
                        layout = TextLayout.BOTTOM;
                        break;
                    case VerticalAlign.MIDDLE:
                        y = height / 2;
                        layout = TextLayout.MIDDLE;
                        break;
                    default:
                        y = 0;
                        layout = TextLayout.TOP;
                        break;
                }
                label.anchor = anchor;
                label.layout = layout;
                label.translate(x, y);
                this._box.setBox(x1, 0, x2, height);
            }
            else {
                const y1 = height - this.model.axis.getPosition(height, Math.min(m.start, m.end), true);
                const y2 = height - this.model.axis.getPosition(height, Math.max(m.start, m.end), true);
                let x;
                let y;
                let anchor;
                let layout;
                switch (m.label.align) {
                    case Align.CENTER:
                        x = width / 2;
                        anchor = TextAnchor.MIDDLE;
                        break;
                    case Align.RIGHT:
                        x = width;
                        anchor = TextAnchor.END;
                        break;
                    default:
                        x = 0;
                        anchor = TextAnchor.START;
                        break;
                }
                switch (m.label.verticalAlign) {
                    case VerticalAlign.BOTTOM:
                        y = y1;
                        layout = TextLayout.BOTTOM;
                        break;
                    case VerticalAlign.MIDDLE:
                        y = y2 + (y1 - y2) / 2;
                        layout = TextLayout.MIDDLE;
                        break;
                    default:
                        y = y2;
                        layout = TextLayout.TOP;
                        break;
                }
                label.anchor = anchor;
                label.layout = layout;
                label.translate(x, y);
                this._box.setBox(0, y2, width, y1);
            }
        }
    }
    class AxisGuideContainer extends LayerElement {
        constructor() {
            super(...arguments);
            this._linePool = [];
            this._rangePool = [];
            this._views = [];
        }
        prepare() {
            const views = this._views;
            for (let i = views.length - 1; i >= 0; i--) {
                const v = views.pop();
                v.remove();
                if (v instanceof AxisGuideRangeView) {
                    this._rangePool.push(v);
                }
                else {
                    this._linePool.push(v);
                }
            }
            assert(views.length === 0, 'GuideContainer.prepare');
        }
        addAll(doc, guides) {
            guides.forEach(g => {
                if (g instanceof AxisGuideRange) {
                    let v = this._rangePool.pop() || new AxisGuideRangeView(doc);
                    this.add(v);
                    v.prepare(g);
                    this._views.push(v);
                }
                else if (g instanceof AxisGuideLine) {
                    let v = this._linePool.pop() || new AxisGuideLineView(doc);
                    this.add(v);
                    v.prepare(g);
                    this._views.push(v);
                }
            });
        }
        add(child) {
            this._views.push(child);
            return super.add(child);
        }
    }
    class CrosshairLineView extends LineElement {
        constructor(doc) {
            super(doc, 'rct-crosshair-line');
            this.setStyle('pointerEvents', 'none');
        }
        setModel(model) {
            if (model != this._model) {
                this._model = model;
            }
        }
        layout(x, y, width, height) {
            if (this._model.axis._isHorz) {
                this.setVLine(x, 0, height);
            }
            else {
                this.setHLine(y, 0, width);
            }
        }
    }
    class BodyView extends ChartElement {
        constructor(doc, owner) {
            super(doc, BodyView.BODY_CLASS);
            this._gridViews = new Map();
            this._breakViews = [];
            this._seriesViews = [];
            this._seriesMap = new Map();
            this._focused = null;
            this._owner = owner;
            this.add(this._background = new RectElement(doc, 'rct-plot-background'));
            this.add(this._image = new ImageElement(doc, 'rct-plot-image'));
            this.add(this._gridContainer = new LayerElement(doc, 'rct-grids'));
            this.add(this._guideContainer = new AxisGuideContainer(doc, 'rct-guides'));
            this.add(this._seriesContainer = new LayerElement(doc, 'rct-series-container'));
            this.add(this._axisBreakContainer = new LayerElement(doc, 'rct-axis-breaks'));
            this.add(this._frontGuideContainer = new AxisGuideContainer(doc, 'rct-front-guides'));
            this.add(this._feedbackContainer = new LayerElement(doc, 'rct-feedbacks'));
            this._crosshairLines = new ElementPool(this._feedbackContainer, CrosshairLineView);
        }
        prepareGuideContainers() {
            this._guideContainer.prepare();
            this._frontGuideContainer.prepare();
        }
        pointerMoved(p, target) {
            const w = this.width;
            const h = this.height;
            this._crosshairLines.forEach(v => {
                if (v.setVisible(p.x >= 0 && p.x < w && p.y >= 0 && p.y < h)) {
                    v.layout(p.x, p.y, w, h);
                }
            });
            if (target instanceof SVGElement && (target.classList.contains(SeriesView.POINT_CLASS) || target.parentElement instanceof SVGElement && target.parentElement.classList.contains(SeriesView.POINT_CLASS))) {
                for (let i = this._seriesViews.length - 1; i >= 0; i--) {
                    const p = this._seriesViews[i].pointByDom(target);
                    if (p) {
                        this.$_setFocused(this._seriesViews[i].model, p);
                        break;
                    }
                }
            }
            else {
                this.$_setFocused(null, null);
            }
        }
        $_setFocused(series, p) {
            if (p != this._focused) {
                if (this._focused) {
                    this._focused.unsetData(SeriesView.DATA_FOUCS);
                }
                this._focused = p;
                if (this._focused) {
                    this._focused.setData(SeriesView.DATA_FOUCS);
                    this._owner.showTooltip(series, p.point);
                }
                else {
                    this._owner.hideTooltip();
                }
                return true;
            }
        }
        seriesByDom(elt) {
            return this._seriesViews.find(v => v.dom.contains(elt));
        }
        _doMeasure(doc, model, hintWidth, hintHeight, phase) {
            const chart = model.chart;
            this._background.setStyleOrClass(model.style);
            this.$_prepareSeries(doc, chart._getSeries().visibleSeries());
            this._seriesViews.forEach((v, i) => {
                v.measure(doc, this._series[i], hintWidth, hintHeight, phase);
            });
            this._polar = chart._polar;
            if (!this._polar) {
                this.$_prepareGrids(doc, chart);
                for (const axis of this._gridViews.keys()) {
                    this._gridViews.get(axis).measure(doc, axis.grid, hintWidth, hintHeight, phase);
                }
                this.$_prepareAxisBreaks(doc, chart);
                this.$_preppareCrosshairs(doc, chart);
            }
            return Size.create(hintWidth, hintHeight);
        }
        _doLayout() {
            const w = this.width;
            const h = this.height;
            const img = this._image;
            this._background.resize(w, h);
            if (img.setVisible(img.setImage(this.model.image.url, w, h))) {
                img.setStyleOrClass(this.model.image.style);
            }
            this._seriesViews.forEach(v => {
                this._owner.clipSeries(v.getClipContainer(), 0, 0, w, h, v.invertable());
                v.resize(w, h);
                v.layout();
            });
            if (!this._polar) {
                for (const v of this._gridViews.values()) {
                    v.resize(w, h);
                    v.layout();
                }
                this._breakViews.forEach(v => {
                    v.translate(0, h - v._model._sect.pos - v._model._sect.len);
                    v.layout(w, h);
                });
                [this._guideContainer, this._frontGuideContainer].forEach(c => {
                    c._views.forEach(v => v.layout(w, h));
                });
            }
        }
        $_createSeriesView(doc, series) {
            return new series_types[series._type()](doc);
        }
        $_prepareGrids(doc, chart) {
            const needAxes = chart.needAxes();
            const container = this._gridContainer;
            const views = this._gridViews;
            for (const axis of views.keys()) {
                if (!needAxes || !chart.containsAxis(axis) || !axis.grid.isVisible()) {
                    views.get(axis).remove();
                    views.delete(axis);
                }
            }
            [chart._getXAxes(), chart._getYAxes()].forEach(axes => axes.forEach(axis => {
                if (needAxes && axis.grid.isVisible() && !views.has(axis)) {
                    const v = new AxisGridView(doc);
                    views.set(axis, v);
                    container.add(v);
                }
            }));
        }
        $_prepareSeries(doc, series) {
            const container = this._seriesContainer;
            const inverted = this.model.chart.isInverted();
            const animatable = this.model.chart.animatable();
            const map = this._seriesMap;
            const views = this._seriesViews;
            for (const ser of map.keys()) {
                if (series.indexOf(ser) < 0) {
                    map.delete(ser);
                }
            }
            this._series = series;
            views.forEach(v => v.remove());
            views.length = 0;
            series.forEach(ser => {
                const v = map.get(ser) || this.$_createSeriesView(doc, ser);
                v._setChartOptions(inverted, animatable);
                container.add(v);
                map.set(ser, v);
                views.push(v);
            });
        }
        $_prepareAxisBreaks(doc, chart) {
            const container = this._axisBreakContainer;
            const views = this._breakViews;
            const breaks = [];
            [chart._getXAxes(), chart._getYAxes()].forEach(axes => axes.forEach(axis => {
                if (axis instanceof LinearAxis) {
                    breaks.push(...(axis.runBreaks() || []));
                }
            }));
            while (views.length < breaks.length) {
                const view = new AxisBreakView(doc);
                container.add(view);
                views.push(view);
            }
            while (views.length > breaks.length) {
                views.pop().remove();
            }
            views.forEach((v, i) => v.setModel(breaks[i]));
        }
        $_preppareCrosshairs(doc, chart) {
            const views = this._crosshairLines;
            const hairs = [];
            [chart._getXAxes(), chart._getYAxes()].forEach(axes => axes.forEach(axis => {
                axis.crosshair.visible && hairs.push(axis.crosshair);
            }));
            views.prepare(hairs.length, (v, i) => {
                v.setModel(hairs[i]);
            });
        }
    }
    BodyView.BODY_CLASS = 'rct-plot';

    class LegendItemView extends ChartElement {
        constructor(doc) {
            super(doc, 'rct-legend-item');
            this.add(this._marker = RectElement.create(doc, 'rct-legend-item-marker', 0, 0, 12, 12, 6));
            this.add(this._label = new TextElement(doc, 'rct-legend-item-label'));
            this._label.anchor = TextAnchor.START;
        }
        _doMeasure(doc, model, intWidth, hintHeight, phase) {
            Dom.setData(this._label.dom, 'hidden', model.source.visible ? '' : 1);
            Dom.setData(this._marker.dom, 'hidden', model.source.visible ? '' : 1);
            this._label.text = model.text();
            const sz = toSize(this._label.getBBounds());
            this._gap = pickNum(model.legend.markerGap, 0);
            return Size.create(this._marker.width + this._gap + sz.width, Math.max(this._marker.height, sz.height));
        }
        _doLayout() {
            this._marker.translate(0, (this.height - this._marker.height) / 2);
            this._label.translate(this._marker.width + this._gap, (this.height - this._label.getBBounds().height) / 2);
        }
    }
    class LegendView extends BoundableElement {
        constructor(doc) {
            super(doc, LegendView.LEGEND_CLASS, 'rct-legend-background');
            this._itemViews = new ElementPool(this, LegendItemView);
        }
        legendByDom(dom) {
            const v = this._itemViews.elementOf(dom);
            return v && v.model;
        }
        _setBackgroundStyle(back) {
            back.setStyleOrClass(this.model.backgroundStyles);
        }
        _getDebugRect() {
            const r = super._getDebugRect();
            const gap = pickNum(this.model.gap, 0);
            if (gap !== 0) {
                switch (this.model.getPosition()) {
                    case LegendPosition.BOTTOM:
                        r.y += gap;
                        r.height -= gap;
                        break;
                }
            }
            return r;
        }
        _doMeasure(doc, model, hintWidth, hintHeight, phase) {
            const items = model.items();
            const vertical = this._vertical = model.getLayout() === LegendLayout.VERTICAL;
            const itemGap = model.itemGap;
            const views = this._itemViews;
            let w = 0;
            let h = 0;
            if (vertical) {
                hintHeight = model.getMaxHeight(hintHeight);
            }
            else {
                hintWidth = model.getMaxWidth(hintWidth);
            }
            this.$_prepareItems(doc, items);
            views.forEach((v, i) => {
                const sz = v.measure(doc, items[i], hintWidth, hintHeight, phase);
                if (vertical) {
                    w = Math.max(w, sz.width);
                    h += sz.height;
                }
                else {
                    h = Math.max(h, sz.height);
                    w += sz.width;
                }
            });
            if (vertical) {
                h += (views.count - 1) * itemGap;
                w += pickNum(model.gap, 0);
            }
            else {
                w += (views.count - 1) * itemGap;
                h += pickNum(model.gap, 0);
                if (w > hintWidth) {
                    debugger;
                }
            }
            return Size.create(w, h);
        }
        _doLayout() {
            const vertical = this._vertical;
            const model = this.model;
            const gap = model.itemGap;
            const margin = this._margins;
            const pad = this._paddings;
            let x = margin.left + pad.left;
            let y = margin.top + pad.top;
            if (model.position === LegendPosition.BOTTOM) {
                y += pickNum(model.gap, 0);
            }
            else if (model.position === LegendPosition.RIGHT) {
                x += pickNum(model.gap, 0);
            }
            this._itemViews.forEach(v => {
                v._marker.setStyle('fill', v.model.source.legendColor());
                v.resizeByMeasured().layout();
                v.translate(x, y);
                if (vertical) {
                    y += v.height + gap;
                }
                else {
                    x += v.width + gap;
                }
            });
        }
        $_prepareItems(doc, items) {
            this._itemViews.prepare(items.length);
        }
    }
    LegendView.LEGEND_CLASS = 'rct-legend';

    class PolarAxisTickMarkView extends RcElement {
        constructor(doc) {
            super(doc, 'rct-polar-axis-tick-mark');
            this.add(this._lineView = new CircleElement(doc));
        }
        layout() {
        }
    }
    class PolarAxisView extends RcElement {
        constructor(doc, styleName) {
            super(doc, styleName);
            this.add(this._markContainer = new LayerElement(doc, 'rct-polar-axis-markers'));
            this._markViews = new ElementPool(this._markContainer, PolarAxisTickMarkView);
            this.add(this._gridContainer = new RcElement(doc, 'rct-polar-axis-grids'));
            this.add(this._labelContainer = new LayerElement(doc, 'rct-polar-axis-labels'));
            this._labelViews = new ElementPool(this._labelContainer, TextElement);
        }
        prepare(doc, model) {
            this._model = model;
            this._markLen = model.tick.length;
            this.$_prepareTickMarks(doc, model);
            this.$_prepareLabels(doc, model);
            this._doPrepare(model, model._ticks);
        }
        layout(other, cx, cy, rd) {
            const ticks = this._model._ticks;
            this._doLayout(this._model, cx, cy, rd, ticks, other);
            return this;
        }
        $_prepareTickMarks(doc, m) {
            this._markViews.prepare(m._ticks.length);
        }
        $_prepareLabels(doc, m) {
            const ticks = m._ticks;
            this._labelViews.prepare(ticks.length, (view, i) => {
                view.text = ticks[i].label;
            }, view => {
                view.anchor = TextAnchor.START;
            });
        }
    }
    class PolarXAxisView extends PolarAxisView {
        constructor(doc) {
            super(doc, 'rct-polar-xaxis');
            this._gridLines = new ElementPool(this._gridContainer, LineElement, 'rct-polar-xaxis-grid-line');
            this.add(this._lineView = new CircleElement(doc, 'rct-polar-xaxis-line'));
            this._lineView.setStyle('fill', 'none');
        }
        _doPrepare(model, ticks) {
            this._gridLines.prepare(ticks.length);
            this._lineView.visible = model.line.visible;
        }
        _doLayout(axis, cx, cy, rd, ticks, other) {
            const start = axis.chart.startAngle();
            this._gridLines.forEach((view, i) => {
                const tick = ticks[i];
                const p = tick.pos * Math.PI * 2;
                const x = cx + Math.cos(start + p) * rd;
                const y = cy + Math.sin(start + p) * rd;
                view.setLine(cx, cy, x, y);
            });
            const rd2 = rd + axis.tick.length;
            this._labelViews.forEach((view, i) => {
                const tick = ticks[i];
                view.anchor = TextAnchor.MIDDLE;
                view.layout = TextLayout.MIDDLE;
                view.text = tick.label;
                const r = view.getBBounds();
                const p = tick.pos * Math.PI * 2;
                const x = cx + Math.cos(start + p) * (rd2 + r.width / 2);
                const y = cy + Math.sin(start + p) * (rd2 + r.height / 2);
                view.translate(x, y);
            });
            this._lineView.setCircle(cx, cy, rd);
        }
    }
    class PolarYAxisView extends PolarAxisView {
        constructor(doc) {
            super(doc, 'rct-polar-yaxis');
            this._gridLines = new ElementPool(this._gridContainer, CircleElement, 'rct-polar-yaxis-grid-line');
            this.add(this._lineView = new LineElement(doc, 'rct-polar-yaxis-line'));
        }
        _doPrepare(model, ticks) {
            this._gridLines.prepare(ticks.length, null, v => {
                v.setStyle('fill', 'none');
            });
            this._lineView.visible = model.line.visible;
        }
        _doLayout(axis, cx, cy, rd, ticks, other) {
            this._gridLines.forEach((view, i) => {
                const tick = ticks[i];
                view.setCircle(cx, cy, tick.pos);
            });
            this._labelViews.forEach((view, i) => {
                const tick = ticks[i];
                view.anchor = TextAnchor.END;
                view.layout = TextLayout.MIDDLE;
                view.text = tick.label;
                view.translate(cx - 4, cy - tick.pos);
            });
            this._lineView.setVLine(cx, cy, cy - rd);
        }
    }
    class PolarBodyView extends BodyView {
        constructor() {
            super(...arguments);
            this._yAxisViews = [];
        }
        _doMeasure(doc, model, hintWidth, hintHeight, phase) {
            const chart = model.chart;
            const sz = super._doMeasure(doc, model, hintWidth, hintHeight, phase);
            this.$_prepareAxes(doc, chart.xAxis, chart._getYAxes().items);
            return sz;
        }
        _doLayout() {
            const m = this.model;
            const sz = m.getSize(this.width, this.height);
            const rd = m._rd = m.getSize(this.width, this.height) / 2;
            const { cx, cy } = m.getCenter(this.width, this.height);
            m._cx = cx;
            m._cy = cy;
            this._seriesViews.forEach(v => {
                v.resize(sz, sz);
                v.layout();
            });
            this._xAxisView.layout(m.chart.yAxis, cx, cy, rd);
            this._yAxisViews.forEach(v => {
                v.layout(null, cx, cy, rd);
            });
        }
        $_prepareAxes(doc, xAxis, yAxes) {
            if (!this._axisContainer) {
                this.add(this._axisContainer = new RcElement(doc, 'rct-polar-axes'));
                this._axisContainer.add(this._xAxisView = new PolarXAxisView(doc));
            }
            this._xAxisView.prepare(doc, xAxis);
            const views = this._yAxisViews;
            while (views.length < yAxes.length) {
                const view = new PolarYAxisView(doc);
                this._axisContainer.add(view);
                views.push(view);
            }
            while (views.length > yAxes.length) {
                views.pop().remove();
            }
            views.forEach((v, i) => v.prepare(doc, yAxes[i]));
        }
    }

    class TitleView extends BoundableElement {
        constructor(doc, isSub) {
            super(doc, isSub ? TitleView.SUBTITLE_CLASS : TitleView.TITLE_CLASS, isSub ? 'rct-subtitle-background' : 'rct-title-background');
            this.add(this._textView = new TextElement(doc));
            this._textView.anchor = TextAnchor.START;
        }
        _setBackgroundStyle(back) {
            back.setStyleOrClass(this.model.backgroundStyle);
        }
        _doMeasure(doc, model, hintWidth, hintHeight, phase) {
            this._textView.text = this.model.text;
            return toSize(this._textView.getBBounds());
        }
        _doLayout() {
            this._textView.translate(this._margins.left + this._paddings.left, this._margins.top + this._paddings.top);
            this._textView.layoutText();
        }
    }
    TitleView.TITLE_CLASS = 'rct-title';
    TitleView.SUBTITLE_CLASS = 'rct-subtitle';

    class TooltipView extends RcElement {
        constructor(doc) {
            super(doc, 'rct-tooltip');
            this._textCallback = (point, param) => {
                return this._model.getValue(point, param);
            };
            this._hideHandler = () => {
                this.$_hide();
                this._hideTimer = void 0;
            };
            this.add(this._back = new PathElement(doc, 'rct-tooltip-back'));
            this.add(this._textView = new TextElement(doc, 'rct-tooltip-text'));
            this._back.setAttr('filter', 'url(#' + RcControl.SHADOW_FILTER + ')');
            this._textView.anchor = TextAnchor.START;
            this._richText = new SvgRichText();
            this._richText.lineHeight = 1.2;
            this.hide(true, false);
        }
        show(model, point, x, y, animate) {
            this._model = model;
            this._textView;
            this._richText.format = model.text;
            this._richText.build(this._textView, point, this._textCallback);
            const r = this._textView.getBBounds();
            const w = Math.max(model.minWidth || 0, r.width + 8 * 2);
            const h = Math.max(model.minHeight || 0, r.height + 6 * 2);
            const pb = new PathBuilder();
            pb.rect(0, 0, w, h);
            this._back.setPath(pb.end(true));
            this._textView.translate((w - r.width) / 2, (h - r.height) / 2);
            const tx = this.tx;
            const ty = this.ty;
            if (model.series.chart.isInverted()) {
                this.translate(x + model.offset, y - h / 2);
            }
            else {
                this.translate(x - w / 2, y - h - model.offset);
            }
            if (this._hideTimer) {
                clearTimeout(this._hideTimer);
                this._hideTimer = void 0;
            }
            if (this.getStyle('visibility') === 'visible') {
                this.dom.animate([
                    { transform: `translate(${tx}px,${ty}px)` },
                    { transform: `translate(${this.tx}px,${this.ty}px)` }
                ], {
                    duration: 300,
                    fill: 'none'
                });
            }
            else {
                this.setStyle('visibility', 'visible');
            }
        }
        hide(force, animate) {
            if (force) {
                if (this._hideTimer) {
                    clearTimeout(this._hideTimer);
                    this._hideTimer = void 0;
                }
                this.$_hide();
            }
            else if (!this._hideTimer) {
                this._hideTimer = setTimeout(this._hideHandler, this._model ? this._model.hideDelay : Tooltip.HIDE_DELAY);
            }
        }
        $_hide() {
            createAnimation(this.dom, 'opacity', 0, 200, () => {
                this.setStyle('visibility', 'hidden');
            });
        }
    }

    class SectionView extends GroupElement {
        measure(doc, chart, hintWidth, hintHeight, phase) {
            const sz = this._doMeasure(doc, chart, hintWidth, hintHeight, phase);
            this.mw = sz.width;
            this.mh = sz.height;
            return sz;
        }
        resizeByMeasured() {
            this.resize(this.mw, this.mh);
            return this;
        }
        layout(param) {
            this._doLayout(param);
            return this;
        }
    }
    class TitleSectionView extends SectionView {
        _doInitChildren(doc) {
            this.add(this.titleView = new TitleView(doc, false));
            this.add(this.subtitleView = new TitleView(doc, true));
        }
        _doMeasure(doc, chart, hintWidth, hintHeight, phase) {
            const v = this.titleView;
            const sv = this.subtitleView;
            let width = hintWidth;
            let height = 0;
            let sz;
            if (v.visible = chart.title.isVisible()) {
                sz = v.measure(doc, chart.title, hintWidth, hintHeight, phase);
                height += sz.height;
                hintHeight -= sz.height;
            }
            if (sv.visible = chart.subtitle.isVisible()) {
                sz = sv.measure(doc, chart.subtitle, hintWidth, hintHeight, phase);
                height += sz.height;
                hintHeight -= sz.height;
            }
            return { width, height };
        }
        _doLayout(body) {
            const v = this.titleView;
            const sv = this.subtitleView;
            const m = v.model;
            const sm = sv.model;
            const w = body.width;
            let y = 0;
            if (v.visible) {
                let x = 0;
                v.resizeByMeasured().layout();
                switch (m.align) {
                    case Align.LEFT:
                        break;
                    case Align.RIGHT:
                        x += w - v.width;
                        break;
                    default:
                        x += (w - v.width) / 2;
                        break;
                }
                v.translate(x, y);
                y += v.height;
            }
            if (sv.visible) {
                let x = 0;
                sv.resizeByMeasured().layout();
                switch (sm.position) {
                    default:
                        switch (sm.align) {
                            case Align.LEFT:
                                break;
                            case Align.RIGHT:
                                x += w - sv.width;
                                break;
                            default:
                                x += (w - sv.width) / 2;
                                break;
                        }
                        break;
                }
                sv.translate(x, y);
            }
        }
    }
    class LegendSectionView extends SectionView {
        _doInitChildren(doc) {
            this.add(this._legendView = new LegendView(doc));
        }
        _doMeasure(doc, chart, hintWidth, hintHeight, phase) {
            const sz = this._legendView.measure(doc, chart.legend, hintWidth, hintHeight, phase);
            return sz;
        }
        _doLayout() {
            this._legendView.resize(this.width, this.height);
            this._legendView.layout();
        }
    }
    class AxisSectionView extends SectionView {
        constructor(doc, dir) {
            super(doc);
            this.dir = dir;
            this.views = [];
            this._gap = 0;
        }
        prepare(doc, axes, guideContainer, frontGuideContainer) {
            const views = this.views;
            while (views.length < axes.length) {
                const v = new AxisView(doc);
                this.add(v);
                views.push(v);
            }
            while (views.length > axes.length) {
                views.pop().remove();
            }
            views.forEach((v, i) => {
                v.model = axes[i];
                v.prepareGuides(doc, guideContainer, frontGuideContainer);
            });
            this.axes = axes;
            if (this.visible = views.length > 0) {
                this.isHorz = views[0].model._isHorz;
                this._gap = views[0].model.chart.getAxesGap();
            }
        }
        checkHeights(doc, width, height) {
            let h = 0;
            this.views.forEach(view => {
                h += view.checkHeight(doc, width, height);
            });
            return h + (this.views.length - 1) * this._gap;
        }
        checkWidths(doc, width, height) {
            let w = 0;
            this.views.forEach(view => {
                w += view.checkWidth(doc, width, height);
            });
            return w + (this.views.length - 1) * this._gap;
        }
        _doMeasure(doc, chart, hintWidth, hintHeight, phase) {
            const axes = this.axes;
            let w = 0;
            let h = 0;
            this.views.forEach((v, i) => {
                const sz = v.measure(doc, axes[i], hintWidth, hintHeight, phase);
                v.setAttr('xy', axes[i]._isX ? 'x' : 'y');
                w += sz.width;
                h += sz.height;
            });
            if (this.isHorz) {
                h += (this.views.length - 1) * this._gap;
            }
            else {
                w += (this.views.length - 1) * this._gap;
            }
            return Size.create(w, h);
        }
        _doLayout() {
            const w = this.width;
            const h = this.height;
            let p = 0;
            this.views.forEach(v => {
                let x;
                let y;
                if (this.isHorz) {
                    v.resize(w, v.mh);
                }
                else {
                    v.resize(v.mw, h);
                }
                v.layout();
                if (this.isHorz) {
                    v.translateY(this.dir === SectionDir.TOP ? h - p - v.mh : p);
                    p += v.mh + this._gap;
                }
                else {
                    v.translateX(this.dir === SectionDir.RIGHT ? p : w - p - v.mw);
                    p += v.mw + this._gap;
                }
                v.move(x, y);
            });
        }
    }
    class EmptyView extends GroupElement {
    }
    class CreditView extends ChartElement {
        constructor(doc) {
            super(doc, 'rct-credits');
            this.add(this._textView = new TextElement(doc));
            this._textView.anchor = TextAnchor.START;
        }
        clicked(dom) {
            if (this.model.url) {
                window.open(this.model.url, 'new');
            }
        }
        _doMeasure(doc, model, intWidth, hintHeight, phase) {
            this._textView.text = model.text;
            this.setCursor(model.url ? 'pointer' : '');
            return this._textView.getBBounds();
        }
        _doLayout(param) {
        }
    }
    class ChartView extends RcElement {
        constructor(doc) {
            super(doc, 'rct-chart');
            this._inverted = false;
            this._axisSectionViews = new Map();
            Object.values(SectionDir).forEach(dir => {
                if (isNumber(dir)) {
                    const v = new AxisSectionView(doc, dir);
                    this.add(v);
                    this._axisSectionViews.set(dir, v);
                }
            });
            this.add(this._currBody = this._bodyView = new BodyView(doc, this));
            this.add(this._titleSectionView = new TitleSectionView(doc));
            this.add(this._legendSectionView = new LegendSectionView(doc));
            this.add(this._creditView = new CreditView(doc));
            this.add(this._tooltipView = new TooltipView(doc));
        }
        titleView() {
            return this._titleSectionView.titleView;
        }
        subtitleView() {
            return this._titleSectionView.subtitleView;
        }
        bodyView() {
            return this._bodyView;
        }
        measure(doc, model, hintWidth, hintHeight, phase) {
            if (model && phase == 1) {
                model.prepareRender();
            }
            if (this.$_checkEmpty(doc, model, hintWidth, hintHeight)) {
                return;
            }
            const m = this._model = model;
            const polar = m._polar;
            const credit = m.options.credits;
            const legend = m.legend;
            let w = hintWidth;
            let h = hintHeight;
            let sz;
            this._inverted = model.isInverted();
            if (this._creditView.setVisible(credit.visible)) {
                sz = this._creditView.measure(doc, credit, w, h, phase);
                if (!credit.floating) {
                    h -= sz.height + credit.offsetY;
                }
            }
            sz = this._titleSectionView.measure(doc, m, w, h, phase);
            h -= sz.height;
            if (this._legendSectionView.visible = (legend.isVisible())) {
                sz = this._legendSectionView.measure(doc, m, w, h, phase);
                switch (legend.position) {
                    case LegendPosition.TOP:
                    case LegendPosition.BOTTOM:
                        h -= sz.height;
                        break;
                    case LegendPosition.RIGHT:
                    case LegendPosition.LEFT:
                        w -= sz.width;
                        break;
                }
            }
            this.$_prepareBody(doc, polar);
            if (polar) {
                this.$_measurePolar(doc, m, w, h, 1);
            }
            else {
                this.$_measurePlot(doc, m, w, h, 1);
            }
        }
        layout() {
            var _a;
            const m = this._model;
            const height = this.height;
            const width = this.width;
            let w = width;
            let h = height;
            if ((_a = this._emptyView) === null || _a === void 0 ? void 0 : _a.visible) {
                this._emptyView.resize(w, h);
                return;
            }
            const polar = m._polar;
            const legend = m.legend;
            const credit = m.options.credits;
            const vCredit = this._creditView;
            let h1Credit = 0;
            let h2Credit = 0;
            let x = 0;
            let y = 0;
            if (vCredit.visible) {
                vCredit.resizeByMeasured();
                if (!credit.floating) {
                    if (credit.verticalAlign === VerticalAlign.TOP) {
                        h -= h1Credit = vCredit.height + credit.offsetY;
                    }
                    else {
                        h -= h2Credit = vCredit.height + credit.offsetY;
                    }
                }
            }
            const vTitle = this._titleSectionView;
            let hTitle = 0;
            const yTitle = y + h1Credit;
            if (vTitle.visible) {
                vTitle.resizeByMeasured();
                h -= hTitle = vTitle.height;
            }
            y = height - h2Credit;
            const vLegend = this._legendSectionView;
            let hLegend = 0;
            let wLegend = 0;
            let yLegend;
            let xLegend;
            if (vLegend.visible) {
                vLegend.resizeByMeasured().layout();
                hLegend = vLegend.height;
                wLegend = vLegend.width;
                switch (legend.position) {
                    case LegendPosition.TOP:
                        yLegend = hTitle + h1Credit;
                        h -= hLegend;
                        break;
                    case LegendPosition.BOTTOM:
                        h -= hLegend;
                        yLegend = y - hLegend;
                        y -= hLegend;
                        break;
                    case LegendPosition.RIGHT:
                        w -= wLegend;
                        xLegend = width - wLegend;
                        break;
                    case LegendPosition.LEFT:
                        w -= wLegend;
                        x += wLegend;
                        xLegend = 0;
                        break;
                }
            }
            let asv;
            let axisMap;
            if (!polar) {
                axisMap = new Map(this._axisSectionViews);
                HORZ_SECTIONS.forEach(dir => {
                    if ((asv = axisMap.get(dir)) && asv.visible) {
                        w -= asv.mw;
                    }
                    else {
                        axisMap.delete(dir);
                    }
                });
                VERT_SECTIONS.forEach(dir => {
                    if ((asv = axisMap.get(dir)) && asv.visible) {
                        h -= asv.mh;
                    }
                    else {
                        axisMap.delete(dir);
                    }
                });
                if ((asv = axisMap.get(SectionDir.LEFT)) && asv.visible) {
                    asv.resize(asv.mw, h);
                    asv.layout();
                    x += asv.mw;
                }
                if ((asv = axisMap.get(SectionDir.RIGHT)) && asv.visible) {
                    asv.resize(asv.mw, h);
                    asv.layout();
                }
                if ((asv = axisMap.get(SectionDir.BOTTOM)) && asv.visible) {
                    asv.resize(w, asv.mh);
                    asv.layout();
                    y -= asv.mh;
                }
                if ((asv = axisMap.get(SectionDir.TOP)) && asv.visible) {
                    asv.resize(w, asv.mh);
                    asv.layout();
                }
            }
            const org = this._org = Point.create(x, y);
            this._plotWidth = w;
            this._plotHeight = h;
            if (!polar) {
                if (asv = axisMap.get(SectionDir.LEFT)) {
                    asv.translate(org.x - asv.mw, org.y - asv.height);
                }
                if (asv = axisMap.get(SectionDir.RIGHT)) {
                    asv.translate(org.x + w, org.y - asv.height);
                }
                if (asv = axisMap.get(SectionDir.BOTTOM)) {
                    asv.translate(org.x, org.y);
                }
                if (asv = axisMap.get(SectionDir.TOP)) {
                    asv.translate(org.x, org.y - h - asv.height);
                }
            }
            const hPlot = this._plotHeight;
            const wPlot = this._plotWidth;
            x = org.x;
            y = org.y - hPlot;
            this._currBody.resize(wPlot, hPlot);
            this._currBody.layout().translate(x, y);
            if (vCredit.visible) {
                const xOff = credit.offsetX || 0;
                const yOff = credit.offsetY || 0;
                let cx;
                let cy;
                vCredit.layout();
                switch (credit.verticalAlign) {
                    case VerticalAlign.TOP:
                        break;
                    case VerticalAlign.MIDDLE:
                        cy = (height - vCredit.height) / 2 + yOff;
                        break;
                    default:
                        cy = height - h2Credit;
                        break;
                }
                switch (credit.align) {
                    case Align.LEFT:
                        cx = xOff;
                        break;
                    case Align.CENTER:
                        cx = (width - vCredit.width) / 2 + xOff;
                        break;
                    default:
                        cx = width - vCredit.width - xOff;
                        break;
                }
                vCredit.translate(cx, cy);
            }
            if (vTitle.visible) {
                vTitle.layout(this._currBody.getRect()).translate(x, yTitle);
            }
            if (vLegend.visible) {
                if (legend.position === LegendPosition.PLOT) {
                    if (!isNaN(+legend.left)) {
                        x += +legend.left;
                    }
                    else if (!isNaN(+legend.right)) {
                        x += wPlot - wLegend - +legend.right;
                    }
                    else {
                        x += (wPlot - wLegend) / 2;
                    }
                    if (!isNaN(+legend.top)) {
                        y += +legend.top;
                    }
                    else if (!isNaN(+legend.bottom)) {
                        y += hPlot - hLegend - +legend.bottom;
                    }
                    else {
                        y += (hPlot - hLegend) / 2;
                    }
                }
                else if (!isNaN(yLegend)) {
                    x += (w - wLegend) / 2;
                    y = yLegend;
                }
                else {
                    x = xLegend;
                    y = y + (h - hLegend) / 2;
                }
                vLegend.translate(x, y);
            }
            this._tooltipView.hide(true, false);
        }
        showTooltip(series, point) {
            const x = point.xPos + this._bodyView.tx;
            const y = point.yPos + this._bodyView.ty;
            this._tooltipView.show(series.tooltip, point, x, y, true);
        }
        hideTooltip() {
            this._tooltipView.hide(false, true);
        }
        legendByDom(dom) {
            return this._legendSectionView._legendView.legendByDom(dom);
        }
        seriesByDom(dom) {
            return this._bodyView.seriesByDom(dom);
        }
        creditByDom(dom) {
            return this._creditView.dom.contains(dom) ? this._creditView : null;
        }
        clipSeries(view, x, y, w, h, invertable) {
            if (view) {
                if (this._model.inverted && invertable) {
                    this._seriesClip.setBounds(0, -w, h, w);
                }
                else {
                    this._seriesClip.setBounds(0, 0, w, h);
                }
                view.setClip(this._seriesClip);
            }
        }
        _doAttached(parent) {
            this._seriesClip = this.control.clipBounds();
        }
        $_checkEmpty(doc, m, hintWidth, hintHeight) {
            if (m && !m.isEmpty()) {
                if (this._emptyView) {
                    this._emptyView.visible = false;
                }
            }
            else {
                if (!this._emptyView) {
                    this._emptyView = new EmptyView(doc);
                }
                this._emptyView.resize(hintWidth, hintHeight);
                return true;
            }
        }
        $_prepareBody(doc, polar) {
            var _a, _b;
            if (polar) {
                if (!this._polarView) {
                    this._polarView = new PolarBodyView(doc, this);
                    this.insertChild(this._polarView, this._bodyView);
                }
                this._currBody = this._polarView;
                (_a = this._bodyView) === null || _a === void 0 ? void 0 : _a.setVisible(false);
                this._polarView.setVisible(true);
            }
            else {
                (_b = this._polarView) === null || _b === void 0 ? void 0 : _b.setVisible(false);
                this._bodyView.setVisible(true);
                this._currBody = this._bodyView;
            }
        }
        $_prepareAxes(doc, m) {
            const guideContainer = this._currBody._guideContainer;
            const frontGuideContainer = this._currBody._frontGuideContainer;
            const need = !m.options.polar && m.needAxes();
            const map = this._axisSectionViews;
            for (const dir of map.keys()) {
                const v = map.get(dir);
                if (need) {
                    v.prepare(doc, m.getAxes(dir), guideContainer, frontGuideContainer);
                }
                else {
                    v.visible = false;
                }
            }
        }
        $_measurePlot(doc, m, w, h, phase) {
            const map = this._axisSectionViews;
            const wSave = w;
            const hSave = h;
            this._bodyView.prepareGuideContainers();
            this.$_prepareAxes(doc, m);
            m.layoutAxes(w, h, this._inverted, phase);
            w -= map.get(SectionDir.LEFT).checkWidths(doc, w, h);
            w -= map.get(SectionDir.RIGHT).checkWidths(doc, w, h);
            h -= map.get(SectionDir.BOTTOM).checkHeights(doc, w, h);
            h -= map.get(SectionDir.TOP).checkHeights(doc, w, h);
            m.layoutAxes(w, h, this._inverted, phase);
            for (const dir of map.keys()) {
                const asv = map.get(dir);
                if (asv.visible) {
                    asv.measure(doc, m, w, h, phase);
                }
            }
            w = wSave;
            h = hSave;
            for (const dir of map.keys()) {
                const asv = map.get(dir);
                if (asv.visible) {
                    if (dir === SectionDir.LEFT || dir === SectionDir.RIGHT) {
                        w -= asv.mw;
                    }
                    else if (dir === SectionDir.BOTTOM || dir === SectionDir.TOP) {
                        h -= asv.mh;
                    }
                }
            }
            m.layoutAxes(w, h, this._inverted, phase);
            for (const dir of map.keys()) {
                const asv = map.get(dir);
                if (asv.visible) {
                    asv.measure(doc, m, w, h, phase);
                }
            }
            w = wSave;
            h = hSave;
            for (const dir of map.keys()) {
                const asv = map.get(dir);
                if (asv.visible) {
                    if (dir === SectionDir.LEFT || dir === SectionDir.RIGHT) {
                        w -= asv.mw;
                    }
                    else if (dir === SectionDir.BOTTOM || dir === SectionDir.TOP) {
                        h -= asv.mh;
                    }
                }
            }
            m.calcAxesPoints(w, h, this._inverted);
            this._bodyView.measure(doc, m.body, w, h, phase);
        }
        $_measurePolar(doc, m, w, h, phase) {
            const body = m.body;
            const rd = body.getSize(w, h) / 2;
            this.$_prepareAxes(doc, m);
            m.layoutAxes(Math.PI * 2, rd, false, phase);
            this._polarView.measure(doc, m.body, w, h, phase);
        }
    }

    class ChartControl extends RcControl {
        constructor(doc, container) {
            super(doc, container);
            this.addElement(this._chartView = new ChartView(doc));
            this.setPointerHandler(new ChartPointerHandler(this));
        }
        onVisibleChanged(chart, item) {
            if (item instanceof Series) {
                this.invalidateLayout();
            }
        }
        get model() {
            return this._model;
        }
        set model(value) {
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
        chartView() {
            return this._chartView;
        }
        refresh() {
            this.invalidateLayout();
        }
        update(config, loadAnimation = false) {
            this.loaded = !loadAnimation;
            this.model = new Chart(config);
        }
        useImage(src) {
        }
        _doRender(bounds) {
            this.clearTemporaryDefs();
            this._chartView.measure(this.doc(), this._model, bounds.width, bounds.height, 1);
            this._chartView.resize(bounds.width, bounds.height);
            this._chartView.layout();
        }
        _doRenderBackground(elt, width, height) {
            if (this._model) {
                Object.assign(elt.style, this._model.options.style);
            }
        }
    }

    class Globals {
        static getVersion() {
            return '0.9.3';
        }
        static setDebugging(debug) {
            RcElement.DEBUGGING = debug;
        }
        static createChart(doc, container, config) {
            const c = new ChartControl(doc, container);
            c.model = new Chart(config);
            return c;
        }
    }

    const getVersion = Globals.getVersion;
    const setDebugging = Globals.setDebugging;
    const createChart = Globals.createChart;

    exports.Chart = Chart;
    exports.ChartControl = ChartControl;
    exports.createChart = createChart;
    exports.getVersion = getVersion;
    exports.setDebugging = setDebugging;

}));
//# sourceMappingURL=realchart.js.map
