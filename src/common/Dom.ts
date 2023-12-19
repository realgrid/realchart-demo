////////////////////////////////////////////////////////////////////////////////
// Dom.ts
// 2022. 01. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021-2022 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ISides } from "./Types";

/**
 * @internal
 * 
 * Utilities for HTML element.
 */
export class Dom {

    static clearChildren(parent: Element): void {
        let elt: any;
    	while (elt = parent.lastChild) {
    		parent.removeChild(elt);
    	}
    }

    static remove(elt: Node): null {
        const p = elt && elt.parentElement;
        p && p.removeChild(elt);
        return null;
    }

    static htmlEncode(text: string): string {
		return document.createElement('a').appendChild(document.createTextNode(text)).parentNode["innerHTML"];
    }

    static setImportantStyle(css: CSSStyleDeclaration, property: string, value: string): void {
        css.setProperty(property, value, 'important');
    }

    static getPadding(dom: HTMLElement | SVGElement): ISides {
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
}
