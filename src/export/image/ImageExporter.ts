////////////////////////////////////////////////////////////////////////////////
// ImageExporter.ts
// 2021. 09. 29. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2020-2021 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import htmlToCanvas from 'html2canvas';
import download from 'downloadjs';
import { Utils } from '../../common/Utils';
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

        const t = +new Date();

        debugger;
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
            const data = Utils.dataUriToBinary(url);

            const name = fileName + '.' + type;
            download(data, name);
        })
        

        // for (let i = 0; i < pages.length; i++) {
        //     const p = (function (i: number, page: HTMLElement) {
        //         return new Promise((resolve, reject) => {
        //             htmlToCanvas(page, opts).then(canvas => {
        //                 const url = canvas.toDataURL(mimes[type]);
        //                 const data = Utils.dataUriToBinary(url);

        //                 const name = fileName + (pages.length > 1 ? (i + 1) : '');
        //                 fileMap[name + '.' + type] = [data, {}];
        //                 resolve(i);
        //             })
        //         })
        //     })(i, pages[i].page);
        //     promises.push(p);
        // }

        // Promise.all(promises).then(() => {
        //     this.$_saveFile(fileMap, zipName, saveCallback);
        // })
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
}
