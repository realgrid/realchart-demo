////////////////////////////////////////////////////////////////////////////////
// DataPoint.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

export class DataPoint {

    value: any;
}

export class DataPointCollection {

    private _points: DataPoint[];

    get count(): number {
        return this._points.length;
    }

    load(source: any): void {
    }
}