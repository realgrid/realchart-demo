////////////////////////////////////////////////////////////////////////////////
// NumberFormatter.spec.ts
// 2021. 12. 14. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { NumberFormatter } from '../../../src/common/NumberFormatter';

/**
 * Tests for NumberFormatter class.
 */
 describe("NumberFormatter Test", function() {

    it('init', function() {
        const f = NumberFormatter.getFormatter(',0.00');
        expect(f).instanceOf(NumberFormatter);
    });

    it('number', function() {
        let f = NumberFormatter.Default;
        let v = 1234;
        let s = f.toStr(v);

        expect(s).eq('1234');
        s = f.toStr(0.1 + 0.2);
        expect(s).eq('0.3');
        s = f.toStr(999999999999999);
        expect(s).eq('999999999999999');

        f = NumberFormatter.getFormatter(',');
        s = f.toStr(v);
        expect(s).eq('1,234');

        f = NumberFormatter.getFormatter(',0.0');
        s = f.toStr(12345);
        expect(s).eq('12,345.0');
        s = f.toStr(-12345);
        expect(s).eq('-12,345.0');
        s = f.toStr(12345.123);
        expect(s).eq('12,345.1');

        f = NumberFormatter.getFormatter(',00.0');
        s = f.toStr(1.1);
        expect(s).eq('01.1');
        s = f.toStr(-1.1);
        expect(s).eq('-01.1');

        f = NumberFormatter.getFormatter(',0.0#');
        s = f.toStr(12345.123);
        expect(s).eq('12,345.12');
        s = f.toStr(12345.1);
        expect(s).eq('12,345.1');
        s = f.toStr(12345);
        expect(s).eq('12,345.0');
    });
});
