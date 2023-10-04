////////////////////////////////////////////////////////////////////////////////
// TextFormatter.spec.ts
// 2021. 12. 14. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { TextFormatter } from '../../../src/common/TextFormatter';

/**
 * Tests for TextFormatter class.
 */
 describe("TextFormatter Test", function() {

    it('init', function() {
        const f = TextFormatter.getFormatter('(\\d{3})(\\d{4})(\\d{4})(\\d{2});$1-$2-$3-$4');
        expect(f).instanceOf(TextFormatter);
    });

    it('Text', function() {
        let f = TextFormatter.getFormatter('(\\d{3})(\\d{4})(\\d{4})(\\d{2});$1-$2-$3-$4')
        let v = '1112222333344'
        let s = f.toStr(v);

        expect(s).eq('111-2222-3333-44');
    });
});
