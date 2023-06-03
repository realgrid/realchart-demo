////////////////////////////////////////////////////////////////////////////////
// Types.spec.ts
// 2022. 02. 12. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021-2022 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { calcPercent, isValidPercentSize, parsePercentSize } from '../../src/common/Types';

/**
 * Tests for Types functions.
 */
 describe("Types test", function() {

    it('isValidSizeValue', () => {
        expect(isValidPercentSize(33)).true;
        expect(isValidPercentSize('33%')).true;
        expect(isValidPercentSize('33z')).false;
    });

    it('calculateSize', () => {
        const size = parsePercentSize('80%', false);

        expect(size.fixed).false;
        expect(size.size).eq(80);

        const v = calcPercent(size, 2 * 100);
        expect(v).eq(80 * 2);
    });

    it ('in test', () => {
        const keys = {
            renderer: null,
            style: null,
            fields: null,
            field: null,
            value: null,
            id: null,
            tag: null
        }
        const obj = {
            name: 'xxx',
            addr: 'fadfad',
            width: 10,
            height: 10,
            renderer: {},
            style: {}
        };
        const count = 10000;

        let t1 = +new Date();
        let s = 0;

        for (let i = 0; i < count; i++) {
            for (const p in obj) {
                if (p !== 'renderer' && p !== 'style' && p !== 'fields' && p !== 'field' && p !== 'value' && p !== 'id' && p !== 'tag') {
                    s++;
                }
            }
        }
        console.log((+new Date() - t1) + 'ms. ' + s);

        t1 = +new Date();
        s = 0;

        for (let i = 0; i < count; i++) {
            for (const p in obj) {
                // if (!keys.hasOwnProperty(p)) {
                if (!(p in keys)) {
                    s++;
                }
            }
        }
        console.log((+new Date() - t1) + 'ms. ' + s);

        t1 = +new Date();
        s = 0;

        for (let i = 0; i < count; i++) {
            for (const p in obj) {
                if (p !== 'renderer' && p !== 'style' && p !== 'fields' && p !== 'field' && p !== 'value') {
                    s++;
                }
            }
        }
        console.log((+new Date() - t1) + 'ms. ' + s);

        t1 = +new Date();
        s = 0;

        for (let i = 0; i < count; i++) {
            for (const p in obj) {
                if (!keys.hasOwnProperty(p)) {
                // if (!(p in keys)) {
                    s++;
                }
            }
        }
        console.log((+new Date() - t1) + 'ms. ' + s);

        t1 = +new Date();
        s = 0;

        for (let i = 0; i < count; i++) {
            const obj2 = Object.assign({}, obj);
            s += obj2.width;
        }
        console.log((+new Date() - t1) + 'ms. ' + s);
    });

    it ('delete', () => {
        const obj = {
            name: 'xxx',
            addr: 'fadfad',
            width: 10,
            height: 10,
            renderer: {},
            style: {}
        };

        let t1 = +new Date();
        let s = 0;

        for (let i = 0; i < 10000; i++) {
            delete obj.name;
            obj.name = 'zzz';
            s++;
        }
        console.log('DEL ' + (+new Date() - t1) + 'ms. ' + s);
    })
});
