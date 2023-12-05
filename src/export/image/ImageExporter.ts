////////////////////////////////////////////////////////////////////////////////
// ImageExporter.ts
// 2023. 11. 22. created by wooriPbg
// -----------------------------------------------------------------------------
// Copyright (c) 2020-2021 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { RcObject } from '../../common/RcObject';

export interface ImageExportOptions {
    type?: 'png' | 'jpeg';
    fileName?: string;
}

/**
 * 리포트 출력을 image 파일로 내보내기 한다.
 */
export class ImageExporter extends RcObject {
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
    //-------------------------------------------------------------------------
    // constructors
    //-------------------------------------------------------------------------
    constructor() {
        super();
    }

    protected _doDestory(): void {
        super._doDestory();
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    export(dom: HTMLElement, options?: ImageExportOptions): void {
        const type = options?.type || 'png';
        const fileName = options?.fileName || 'realchart';

		const link = document.createElement('a');
		document.body.appendChild(link);

		const img = new Image();
		img.width = dom.clientWidth;
		img.height = dom.clientHeight;

		img.onload = function () {
			const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);

            // 좌표값과 사이즈가 필요하기 때문에 clone이 아닌 원본에서 가져와야 한다.
            const images = dom.querySelectorAll('image');
            const r1 = dom.getBoundingClientRect();
            images.forEach((image) => {
                const r2 = image.getBoundingClientRect();
                context.drawImage(image, r2.x - r1.x, r2.y - r1.y, r2.width, r2.height);
            });

            const imageDataUrl = canvas.toDataURL(`image/${type}`);

            link.href = imageDataUrl;
			link.download = `${fileName}.${type}`;
			link.click();
		};

		const cloneSvg = dom.querySelector('.rct-svg').cloneNode(true) as Element;

        // 자식이 없는 g태그 제거
        cloneSvg.querySelectorAll('g').forEach((g) => {
            if (g.childElementCount === 0) g.remove();
        });

        // aria-label 제거
        this.$_removeAriaLabelRecursively(cloneSvg);

        // display none 제거
        this.$_removeHiddenElementsRecursively(cloneSvg);

        const stringSvg = new XMLSerializer().serializeToString(cloneSvg);
		const index = stringSvg.indexOf('>');
        const usedStyles = this.$_getUsedStyles(cloneSvg);
		const utf8Bytes = new TextEncoder().encode(`
        ${stringSvg.slice(0, index + 1)}
		<style type="text/css">
		${usedStyles.join(' ')}
		</style>
		${stringSvg.slice(index + 1)}`);

		const base64Encoded = btoa(String.fromCharCode.apply(null, utf8Bytes));

		img.src = 'data:image/svg+xml;base64,' + base64Encoded;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------

    private $_getUsedStyles(dom: Element): string[] {
        const usedStyles = [];
        const styleSheets = (dom.ownerDocument || document).styleSheets;
		for (const [key, value] of Object.entries(styleSheets)) {
			for (let i = 0; i < value.cssRules.length; i++) {
				const rule = value.cssRules[i] as CSSStyleRule;
				let cssSelectorUsed = false;
				try {
					cssSelectorUsed = dom.querySelectorAll(rule.selectorText).length > 0;
				} catch (error) {
					console.error("Unable to check if CSS selector is used: " + rule.selectorText, error);
				}
				if (cssSelectorUsed) {
					usedStyles.push(rule.cssText);
				}
			}
		}

        return usedStyles;
    }

    private $_removeAriaLabelRecursively(element: Element) {
        if (element.hasAttribute('aria-label')) {
            element.removeAttribute('aria-label');
        }
    
        const children = element.children;
        for (let i = 0; i < children.length; i++) {
            this.$_removeAriaLabelRecursively(children[i]);
        }
    }
    
    private $_removeHiddenElementsRecursively(element: Element) {
        if (window.getComputedStyle(element).display === 'none' || (element as HTMLElement).style.display === 'none') {
            element.parentNode.removeChild(element);
            return;
        }

        const children = element.children;
        for (let i = 0; i < children.length; i++) {
            this.$_removeHiddenElementsRecursively(children[i]);
        }
    }
}
