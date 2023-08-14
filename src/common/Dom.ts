////////////////////////////////////////////////////////////////////////////////
// Dom.ts
// 2022. 01. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021-2022 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { RtDebug } from "./Common";
import { IRect } from "./Rectangle";
import { CSSStyles2, IPadding, ISides } from "./Types";

export interface IDomContaner {
    dom(): Element;
}

let _dom_id_ = 651212;

export const DIV = 'div';
export const SPAN = 'span';
export const BORDER_SIDES = {
    't': 'borderTop',
    'b': 'borderBottom',
    'l': 'borderLeft',
    'r': 'borderRight'
};

/**
 * @internal
 * 
 * Utilities for HTML element.
 */
export class Dom {

    static getWin(doc: Document): Window {
        return doc.defaultView || doc['parentWindow'];
    }

    static isVisible(elt: HTMLElement): boolean {
        return elt && elt.style.display !== 'none';
    }

    static setVisible(elt: HTMLElement | SVGSVGElement, visible: boolean, visibleStyle = ''): boolean {
        elt.style.display = visible ? (visibleStyle || '') : 'none';
        return visible;
    }

    static hide(elt: HTMLElement | SVGSVGElement): void {
        elt.style.display = 'none';
    }

    static show(elt: HTMLElement | SVGSVGElement, visibleStyle = ''): void {
        elt.style.display = visibleStyle;
    }

    static addClass(elt: HTMLElement | SVGSVGElement, className: string): HTMLElement | SVGSVGElement {
        if (className) {
            const classes = className.split(/\s+/g);
            classes.forEach(c => elt.classList.add(c));
        }
        return elt;
    }

    static removeClass(elt: HTMLElement | SVGSVGElement, className: string): HTMLElement | SVGSVGElement {
        if (className) {
            const classes = className.split(/\s+/g);
            classes.forEach(c => elt.classList.remove(c));
        }
        return elt;
    }

    static getImageUrl(css: CSSStyleDeclaration): string {
        const url = css.backgroundImage;

        if (url && url.startsWith('url("')) {
            return url.substring(5, url.length - 2);
        }
    }

    static getFocused(): HTMLElement {
        const sel = document.getSelection();
        let node = sel.focusNode;

        while (node) {
            if (node instanceof HTMLElement) return node;
            node = node.parentElement;
        }
    }

    static isAncestorOf(elt: HTMLElement, child: HTMLElement): boolean {
        let p = child;
        
		while (p) {
			if (p == elt) {
				return true;
			}
			p = p.parentElement;
		}
		return false;
	}

    static getOffset(elt: HTMLElement): {x: number, y: number} {
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
        return { x: Math.round(x), y: Math.round(y)};
    }
    
    static getSize(elt: HTMLElement): {width: number, height: number} {
		const r = elt.getBoundingClientRect();
		return { width: r.width, height: r.height };
    }

    static moveX(elt: HTMLElement, x: number): void {
		elt.style.left = x + 'px';
    }

    static moveY(elt: HTMLElement, y: number): void {
		elt.style.top = y + 'px';
    }
    
    static move(elt: HTMLElement | SVGSVGElement, x: number, y: number): void {
		elt.style.left = x + 'px';
		elt.style.top = y + 'px';
    }

    static moveI(elt: HTMLElement, x: number, y: number): void {
		elt.style.left = (x >>> 0) + 'px';
		elt.style.top = (y >>> 0) + 'px';
    }

    static resize(elt: HTMLElement | SVGSVGElement, width: number, height: number): void {
        elt.style.width = width + 'px';
        elt.style.height = height + 'px';
    }

    static resizeSVG(elt: SVGSVGElement, width: number, height: number): void {
        elt.setAttribute('viewBox', `0 0 ${width} ${height}`);
    }

    static setWidth(elt: HTMLElement, width: number): void {
        elt.style.width = width + 'px';
    }

    static setHeight(elt: HTMLElement, height: number): void {
        elt.style.height = height + 'px';
    }

    static getBrowserSize(elt?: HTMLElement): {width: number, height: number} {
        const doc = elt ? elt.ownerDocument : document;
        const win = doc.defaultView;
        return {
            // width: _win.innerWidth || _doc.documentElement.clientWidth || _doc.body.clientWidth,
            // height: _win.innerHeight || _doc.documentElement.clientHeight || _doc.body.clientHeight
            width: win.innerWidth || doc.documentElement.clientWidth || doc.body.clientWidth,
            height: win.innerHeight || doc.documentElement.clientHeight || doc.body.clientHeight
        };
    }

    static setRect(elt: HTMLElement, r: IRect): void {
		const style = elt.style;
		style.left = r.x + 'px';
		style.top = r.y + 'px';
		style.width = r.width + 'px';
		style.height = r.height + 'px';
    }
    
    static setBounds(elt: HTMLElement, x: number, y: number, w: number, h: number): void {
		const style = elt.style;
		style.left = x + 'px';
		style.top = y + 'px';
		style.width = w + 'px';
		style.height = h + 'px';
    }
    
    static setBoundsEx(elt: HTMLElement, x: number, y: number, w: number, h: number): void {
		const style = elt.style;
		!isNaN(x) && (style.left = x + 'px');
		!isNaN(y) && (style.top = y + 'px');
		!isNaN(x) && (style.width = w + 'px');
		!isNaN(x) && (style.height = h + 'px');
    }

    static getClientRect(elt: HTMLElement): ClientRect | DOMRect {
		const r = elt.getBoundingClientRect();
		r["cx"] = elt.offsetLeft;
		r["cy"] = elt.offsetTop;
		return r;
    }
    
	static getChildIndex(elt: HTMLElement): number {
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

    static clearChildren(parent: Element): void {
        let elt: any;
    	while (elt = parent.lastChild) {
    		parent.removeChild(elt);
    	}
    }

    static clearElements(parent: Element): void {
        let elt:any;
    	while (elt = parent.lastChild) {
    		Dom.clearElements(elt as Element);
    		parent.removeChild(elt);
    	}
    }

    static append(elt: Node, child: Node): void {
        child.parentNode !== elt && elt.appendChild(child);
    }

    static addChild(elt: HTMLElement, child: HTMLElement): boolean {
		if (elt && child && child.parentNode !== elt) {
			elt.appendChild(child);
			return true;
		}
		return false;
    }
    
	static removeChild(elt: HTMLElement, child: HTMLElement): boolean {
		if (elt && child && child.parentNode === elt) {
			elt.removeChild(child);
			return true;
		}
		return false;
    }

    static removeChildren(elt: Element, children: (Element | IDomContaner)[]): void {
        children.forEach(child => {
            if (child instanceof Element) {
                if (child.parentNode === elt) {
                    elt.removeChild(child);
                }
            } else if (child && child.dom().parentNode == elt) {
                elt.removeChild(child.dom());
            }
        });
    }

    static remove(elt: Node): null {
        const p = elt && elt.parentElement;
        p && p.removeChild(elt);
        return null;
    }

    static clearStyle(elt: HTMLElement): void {
        elt.style.cssText = '';
    }

    static removeStyles(css: CSSStyleDeclaration, style: CSSStyles2) {
        if (style) {
            for (const p in style) {
                css[p] = '';
            }
        }
    }

    static setStyle(elt: HTMLElement, style: CSSStyles2): void {
        style && Object.assign(elt.style, style);
    }

    static replaceStyle(css: CSSStyleDeclaration, style: CSSStyles2, prevStyle: CSSStyles2): CSSStyles2 {
        if (style != prevStyle) {
            if (prevStyle) {
                for (const p in prevStyle) {
                    css[p] = '';
                }
            }
            style && Object.assign(css, style);
            return style;
        }
        return prevStyle;
    }

    static createElement<K extends keyof HTMLElementTagNameMap>(doc: Document, tagName: K, style: CSSStyles2): HTMLElementTagNameMap[K] {
        const elt = doc.createElement(tagName);
        style && Object.assign(elt.style, style);
        return elt;
    }

    static htmlEncode(text: string): string {
		return document.createElement('a').appendChild(document.createTextNode(text)).parentNode["innerHTML"];
    }

    static setData(elt: HTMLElement | SVGElement, name: string, value: any): void {
        if (value == null || value === '') {
            delete elt.dataset[name];
        } else {
            elt.dataset[name] = value;
        }
    }

    static toggleData(elt: HTMLElement | SVGElement, name: string, value: boolean): void {
        if (value) {
            elt.dataset[name] = '1';
        } else {
            delete elt.dataset[name];
        }
    }

    static getData(elt: HTMLElement, name: string): any {
        return elt.dataset[name];
    }

    static hasData(elt: HTMLElement, name: string): boolean {
        return elt.dataset[name] !== void 0;
    }

    static setVar(elt: HTMLElement | SVGSVGElement, name: string, value: string): void {
        elt.style.setProperty(name, value);
    }

    static animate(elt: HTMLElement, prop: string, from: any, to: any, duration = 150, fill = 'none'): Animation {
        const frame1 = {};
        const frame2 = {};

        frame1[prop] = from;
        frame2[prop] = to;

        return elt.animate([
            frame1, frame2
        ], {
            duration: duration,
            fill: fill as any
        })

    }

    // static setAnimating(elt: HTMLElement, set: boolean) {
    //     elt.dataset.animating = set ? '1' : '0';
    // }

    // static isAnimating(elt: HTMLElement) {
    //     return elt.dataset.animating === '1';
    // }

    static setAttr(elt: Element, attr: string, value: any): void {
        if (value != null && value !== '') {
            elt.setAttribute(attr, value);
        } else {
            elt.removeAttribute(attr);
        }
    }

    static setAttrs(elt: Element, attrs: any): void {
        for (const attr in attrs) {
            elt.setAttribute(attr, attrs[attr]);
        }
    }

    static getDomId(): string {
        return '-rtc-' + _dom_id_++;
    }

    static createBR(doc: Document, className: string): HTMLBRElement {
        const br = doc.createElement('br');
        br.className = className;
        return br;
    }

    static createSpan(doc: Document, style: CSSStyles2): HTMLSpanElement {
        const span = doc.createElement('span');
        style && Object.assign(span.style, style);
        return span;
    }

    static createCheckBox(doc: Document, style: CSSStyles2): HTMLInputElement {
        const chk = doc.createElement('input');
        chk.type = 'checkbox';
        style && Object.assign(chk.style, style);
        return chk;
    }

    static createRadio(doc: Document, style: CSSStyles2): HTMLInputElement {
        const chk = doc.createElement('input');
        chk.type = 'radio';
        style && Object.assign(chk.style, style);
        return chk;
    }

    static getPadding(dom: HTMLElement | SVGSVGElement): ISides {
        // css selector에서 설정할 수도 있으므로 dom.style 만으로는 부족하다.
        // padding % 는 자신 크기에 대한 비율이 아니라 상위 block에 대한 상대값이다.
        // touch 컨트롤에서는 (거의) 사용할 수 없다.
        const cs = getComputedStyle(dom);
        
        return {
            left: parseFloat(cs.paddingLeft) || 0,
            right: parseFloat(cs.paddingRight) || 0,
            top: parseFloat(cs.paddingTop) || 0,
            bottom: parseFloat(cs.paddingBottom) || 0
        }
    }

    static getPaddingEx(dom: HTMLElement | SVGSVGElement): ISides {
        const s = this.getPadding(dom);
        s.horz = s.left + s.right;
        s.vert = s.top + s.bottom;
        return s;
    }

    static getPaddingBorder(dom: HTMLElement): IPadding {
        const cs = getComputedStyle(dom);
        
        return {
            left: parseFloat(cs.paddingLeft) || 0,
            right: parseFloat(cs.paddingRight) || 0,
            top: parseFloat(cs.paddingTop) || 0,
            bottom: parseFloat(cs.paddingBottom) || 0,
            borderLeft: parseFloat(cs.borderLeftWidth) || 0,
            borderRight: parseFloat(cs.borderRightWidth) || 0,
            borderTop: parseFloat(cs.borderTopWidth) || 0,
            borderBottom: parseFloat(cs.borderBottomWidth) || 0
        }
    }

    static stopAnimation(ani: Animation): null {
        if (ani) {
            try {
                ani.finish(); // cancel()?
            } catch (e) {
                RtDebug.debugging();
                console.error(e);
            }
        }
        return null;
    }

    static childByPath(dom: Node, path: number[]): Node {
        let node = dom;

        if (path) {
            let i = 0;

            while (i < path.length) {
                node = node.childNodes[path[i++]];
            }
        }
        return node;
    }

    static childByClass<T extends Element>(parent: HTMLElement, className: string): T {
        return parent.getElementsByClassName(className)[0] as any;
    }

    static setDisabled(dom: Element, value: boolean): void {
        this.setAttr(dom, 'disabled', value ? true : void 0);
    }

    static setImportantStyle(css: CSSStyleDeclaration, property: string, value: string): void {
        css.setProperty(property, value, 'important');
    }
}
