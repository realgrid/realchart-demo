////////////////////////////////////////////////////////////////////////////////
// Crosshair.spec.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Crosshair } from '../../../src/model/Crosshair';
import { LinearAxis } from '../../../src/model/axis/LinearAxis';

/**
 * Tests for Crosshair class.
 */
 describe("Crosshair test", function() {

    it('init', () => {
        let ch = new Crosshair(new LinearAxis(null));

        expect(ch).exist;
    });
});
