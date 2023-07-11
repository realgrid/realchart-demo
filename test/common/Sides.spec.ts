////////////////////////////////////////////////////////////////////////////////
// Sides.spec.ts
// 2023. 07. 11. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Sides } from '../../src/common/Sides';

/**
 * Tests for Sides class.
 */
 describe("Sides Test", function() {

    it('create from string', function() {
        let sides = Sides.createFrom('1 2 3 4');

        expect(sides).exist;
        expect(sides.top).eq(1);
        expect(sides.bottom).eq(2);
        expect(sides.left).eq(3);
        expect(sides.right).eq(4);

        sides = Sides.createFrom('1 2');

        expect(sides).exist;
        expect(sides.top).eq(1);
        expect(sides.bottom).eq(1);
        expect(sides.left).eq(2);
        expect(sides.right).eq(2);

        sides = Sides.createFrom('1');

        expect(sides).exist;
        expect(sides.top).eq(1);
        expect(sides.bottom).eq(1);
        expect(sides.left).eq(1);
        expect(sides.right).eq(1);
    });
});
