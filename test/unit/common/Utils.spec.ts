////////////////////////////////////////////////////////////////////////////////
// Utils.spec.ts
// 2021. 12. 24. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Utils } from '../../../src/common/Utils';

/**
 * Tests for Utils functions.
 */
 describe("Utils test", function() {

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
