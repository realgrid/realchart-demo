////////////////////////////////////////////////////////////////////////////////
// Tester.ts
// 22020. 08. 10. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2020 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import * as fs from 'fs';

export function loadJson(path: string): any {
    if (!path.endsWith('.json')) path += '.json';
    const lines = fs.readFileSync(path).toString();
    const data = JSON.parse(lines);
    return data;
}

export function loadChartJson(name: string): any {
    return loadJson("test/assets/chart/" + name);
}

export function loadFile(path: string): any {
    const s = fs.readFileSync(path).toString();
    return s;
}