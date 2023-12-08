////////////////////////////////////////////////////////////////////////////////
// ImageExporter.ts
// 2023. 11. 22. created by wooriPbg
// -----------------------------------------------------------------------------
// Copyright (c) 2020-2021 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////


export interface ImageExportOptions {
    /**
     * 내보내기시 저장되는 파일명
     */
    type?: 'png' | 'jpeg',
    /**
     * 내보내기시 저장되는 파일명
     */
    fileName?: string;
    /**
     * false로 지정하면 내보내기 결과에 {@link AxisScrollBar}가 포함되지 않는다.
     */
    includeScrollbar?: boolean;
    /**
     * false로 지정하면 내보내기 결과에 {@link SeriesNavigator}가 포함되지 않는다.
     */
    includeNavigator?: boolean;
    /**
     * false로 지정하면 내보내기 결과에 {@link ZoomButton}가 포함되지 않는다.
     */
    includeZoomButton?: boolean;
}

/**
 * 차트를 image 파일로 내보내기 한다.
 */
export class ImageExporter {
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
        const rect = dom.getBoundingClientRect();

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = rect.width;
        canvas.height = rect.height;

        const svgToImageAndDownload = () => {
            const svg = dom.querySelector('.rct-svg');
            const img = new Image();
            img.width = svg.clientWidth;
            img.height = svg.clientHeight;
            img.onload = function () {
                context.drawImage(img, 0, 0);

                const imageDataUrl = canvas.toDataURL(`image/${type}`);

                const link = document.createElement('a');
                document.body.appendChild(link);
                link.href = imageDataUrl;
                link.download = `${fileName}.${type}`;
                link.click();
                link.remove();
            };

            const cloneSvg = svg.cloneNode(true) as Element;

            // 자식이 없는 g태그 제거
            cloneSvg.querySelectorAll('g').forEach((g) => {
                if (g.childElementCount === 0) g.remove();
            });

            // tooltip
            cloneSvg.querySelectorAll('.rct-tooltip').forEach((tooltip) => {
                tooltip.remove();
            });

            // navigator
            if (!options.includeNavigator) {
                cloneSvg.querySelectorAll('.rct-navigator').forEach((navigator) => {
                    navigator.remove();
                });
            }

            // scrollbar
            if (!options.includeScrollbar) {
                cloneSvg.querySelectorAll('.rct-axis-scrollbar').forEach((scrollbar) => {
                    scrollbar.remove();
                });
            }

            // zoom button
            if (!options.includeZoomButton) {
                cloneSvg.querySelectorAll('.rct-reset-zoom').forEach((zoomButton) => {
                    zoomButton.remove();
                });
            }

            // aria-label 제거
            this.$_removeAriaLabelRecursively(cloneSvg);

            // display none 제거
            this.$_removeHiddenElementsRecursively(cloneSvg);

            this.$_imagesToBase64(cloneSvg, () => {
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
            });
        }

        // control background
        const backgroundImageUrl = window.getComputedStyle(dom).getPropertyValue('background-image');

        if (backgroundImageUrl && backgroundImageUrl !== 'none') {
            const background = new Image();
            background.width = rect.width;
            background.height = rect.height;
            background.onload = function () {
                context.drawImage(background, 0, 0);
                svgToImageAndDownload();
            };

            background.src = backgroundImageUrl.replace(/^url\(["']?(.*?)["']?\)$/, '$1');
        } else {
            svgToImageAndDownload();
        }
        
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

    private $_imagesToBase64(elt: Element, callback: () => void) {

        function imageToBase64(url: string, callback: (base64: any) => void) {
            fetch(url)
                .then(response => response.blob())
                .then(blob => {
                    return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                    });
                })
                .then(base64Image => {
                    // 콜백 함수로 전달하여 이미지를 적용
                    callback(base64Image);
                })
                .catch(error => console.error('Error:', error));
        }

        const imageElements = elt.querySelectorAll('image');
      
        if (imageElements.length > 0) {
            imageElements.forEach(imageElement => {
                const imageUrl = imageElement.getAttribute('href');
                imageUrl && imageToBase64(imageUrl, base64Image => {
                    imageElement.setAttribute('href', base64Image);
                    callback();
                });
            });
        } else {
            callback();
        }
    }
}
