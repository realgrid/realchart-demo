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
     * 이미지 너비
     */
    width?: number;
    /**
     * scale
     */
    scale?: number;
    /**
     * 내보내기시 저장되는 파일명
     */
    fileName?: string;
    /**
     * 내보내기 실패시 api요청을 보낼 경로
     */
    url?: string;
    /**
     * false로 지정하면 내보내기 결과에 {@link AxisScrollBar}가 포함되지 않는다.
     */
    hideScrollbar?: boolean;
    /**
     * false로 지정하면 내보내기 결과에 {@link SeriesNavigator}가 포함되지 않는다.
     */
    hideNavigator?: boolean;
    /**
     * false로 지정하면 내보내기 결과에 {@link ZoomButton}가 포함되지 않는다.
     */
    hideZoomButton?: boolean;
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
    export(dom: HTMLElement, options?: ImageExportOptions, config?: {[key: string]: any}): void {
        const type = options?.type || 'png';
        const fileName = options?.fileName || 'realchart';
        const rect = dom.getBoundingClientRect();

        const scale = options.width ? options.width / rect.width : options.scale;
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = rect.width;
        canvas.height = rect.height;

        const svgToImageAndDownload = () => {
            const svg = dom.querySelector('.rct-svg');
            const img = new Image();
            img.onload = function () {
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                const scaledWidth = canvas.width * scale;
                const scaledHeight = canvas.height * scale;
                const scaledCanvas = document.createElement('canvas');
                const scaledContext = scaledCanvas.getContext('2d');
                scaledCanvas.width = scaledWidth;
                scaledCanvas.height = scaledHeight;
                scaledContext.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, scaledWidth, scaledHeight);

                const imageDataUrl = scaledCanvas.toDataURL(`image/${type}`);

                const link = document.createElement('a');
                link.href = imageDataUrl;
                link.download = `${fileName}.${type}`;
                link.click();
            };

            const cloneSvg = svg.cloneNode(true) as Element;

            // 자식이 없는 g태그 제거
            cloneSvg.querySelectorAll('g').forEach((g) => {
                if (g.childElementCount === 0) g.remove();
            });

            this.$_removeItems(cloneSvg, '.rct-feedbacks');
            this.$_removeItems(cloneSvg, '.rct-tooltip');
            options.hideNavigator && this.$_removeItems(cloneSvg, '.rct-navigator');
            options.hideScrollbar && this.$_removeItems(cloneSvg, '.rct-axis-scrollbar');
            options.hideZoomButton && this.$_removeItems(cloneSvg, '.rct-reset-zoom');
            this.$_removeAriaLabelRecursively(cloneSvg);
            this.$_removeHiddenElementsRecursively(cloneSvg);

            this.$_imagesToBase64(cloneSvg, async () => {
                const stringSvg = new XMLSerializer().serializeToString(cloneSvg);
                const index = stringSvg.indexOf('>');
                const usedStyles = this.$_getUsedStyles(cloneSvg);
                const stringDom = `
                ${stringSvg.slice(0, index + 1)}
                <style type="text/css">
                ${usedStyles.join(' ')}
                </style>
                ${stringSvg.slice(index + 1)}`
                const utf8Bytes = new TextEncoder().encode(stringDom);
                let src: string;
                try {
                    src = 'data:image/svg+xml;base64,' + btoa(String.fromCharCode.apply(null, utf8Bytes));
                } catch (error) {
                    const url = options.url || 'http://127.0.0.1:4080/api';
                    // const url = options.url || 'https://realchart-node-exporter.vercel.app/api';
                    const response = await fetch(url, 
                        {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            size: {width: rect.width, height: rect.height},
                            options: options,
                            config: config
                          }),
                        });
                    const res = await response.json();
                    src = 'data:image/png;base64,' + res.data;
                }
                img.src = src;
            });
        }

        // control background
        const backgroundImageUrl = window.getComputedStyle(dom).getPropertyValue('background-image');

        if (backgroundImageUrl && backgroundImageUrl !== 'none') {
            const background = new Image();
            background.onload = function () {
                context.drawImage(background, 0, 0, canvas.width, canvas.height);
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

    private $_removeItems(svg: Element, selector: string): void {
        svg.querySelectorAll(selector).forEach((zoomButton) => {
            zoomButton.remove();
        });
    }

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
