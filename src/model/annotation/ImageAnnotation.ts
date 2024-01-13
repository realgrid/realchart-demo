////////////////////////////////////////////////////////////////////////////////
// ImageAnnotation.ts
// 2023. 11. 11. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isString } from "../../common/Common";
import { isNull } from "../../common/Types";
import { Annotation } from "../Annotation";

/**
 * 이미지 Annotation 모델.
 * 
 * @config chart.annotation[type=image]
 */
export class ImageAnnotation extends Annotation {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 이미지 경로.
     * 
     * @config 
     */
    imageUrl: string;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    isVisible(): boolean {
        return this.visible && !isNull(this.imageUrl);
    }
    
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'image';
    }

    protected _doLoadSimple(source: any): boolean {
        if (isString(source)) {
            this.imageUrl = source;
            return true;
        }
        return super._doLoadSimple(source);
    }
}
