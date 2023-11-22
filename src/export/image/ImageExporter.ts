////////////////////////////////////////////////////////////////////////////////
// ImageExporter.ts
// 2023. 11. 22. created by wooriPbg
// -----------------------------------------------------------------------------
// Copyright (c) 2020-2021 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import htmlToCanvas from 'html2canvas';
import { RcObject } from '../../common/RcObject';

export interface ImageExportOptions {
    type?: 'png' | 'jpeg' | 'jpg';
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
        console.time('export image')

        const type = options?.type || 'png';
        const fileName = options?.fileName || 'realchart';

        const mimes = {
            'png': 'image/png',
            'jpg': 'image/jpg',
            'jpeg': 'image/jpeg',
        }

        const opts = {
            onclone: (doc: any) => {
                // 전처리 작업진행
            },
            useCORS: true,
        }

        htmlToCanvas(dom, opts).then((canvas) => {
            const url = canvas.toDataURL(mimes[type]);

            const name = fileName + '.' + type;
            const link = document.createElement('a');
            document.body.appendChild(link);
            link.href = url;
            link.download = name;
            link.click();
            link.remove();
        })

        console.timeEnd('export image')
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
}
