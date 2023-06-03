////////////////////////////////////////////////////////////////////////////////
// Utils.spec.ts
// 2021. 12. 24. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Utils } from '../../src/common/Utils';

/**
 * Tests for Utils functions.
 */
 describe("Utils test", function() {

    it('equalObjects', function() {
        const obj1: any = {};
        const obj2: any = {};

        expect(Utils.equalObjects(null, null)).true;
        expect(Utils.equalObjects(null, {})).false;
        expect(Utils.equalObjects(obj1, obj1)).true;
        expect(Utils.equalObjects(obj1, obj2)).true;

        obj1.name = 'xxx';
        expect(Utils.equalObjects(obj1, obj2)).false;
        obj2.name = 'abc';
        expect(Utils.equalObjects(obj1, obj2)).false;
        obj2.name = 'xxx';
        expect(Utils.equalObjects(obj1, obj2)).true;
    });

    it('irandom', () => {
        let i = Utils.irandom(0, 0.5);
        expect(i).eq(0);
    });

    it('splice', () => {
        const arr = [0, 1, 2];
        const arr2 = [3, 4]

        Utils.splice(arr, 1, 2, arr2);
        expect(arr[1]).eq(arr2[0]);
        expect(arr[2]).eq(arr2[1]);
    });

    it('array test', () => {
        const cnt = 1000;
        const texts: string[] = [];

        for (let i = 0; i < cnt; i++) {
            texts.push(Utils.srandom(5, 20));
        }

        console.time('array');

        const tester = /.+\[\d+\]$/;
        let n = 0;

        for (let i = 0; i < cnt; i++) {
            if (tester.test(texts[i])) n++;
        }

        // console.log(n);
        console.timeEnd('array');
    });

    it('deep clone', () => {
        let obj: any = {}
        let obj2: any = Utils.deepClone(obj);

        expect(obj2).not.eq(obj);
        expect(obj2).deep.eq(obj);

        obj = { a: 1 };
        obj2 = Utils.deepClone(obj);
        expect(obj2).deep.eq(obj);

        obj = { a: [1, 2, 3]};
        obj2 = Utils.deepClone(obj);
        expect(obj2).deep.eq(obj);
        obj2.a[2] = 111;
        expect(obj2).not.deep.eq(obj);

        obj = { a: { b: 'x' }};
        obj2 = Utils.deepClone(obj);
        expect(obj2).deep.eq(obj);
        expect(obj2.a).not.eq(obj.a);

        obj = { a: { b: {c: [1, 2]} }};
        obj2 = Utils.deepClone(obj);
        expect(obj2).deep.eq(obj);

        obj = { a: [{ b: {c: [1, 2]} }, 2]};
        obj2 = Utils.deepClone(obj);
        expect(obj2).deep.eq(obj);
    });
});
