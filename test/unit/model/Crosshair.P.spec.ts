////////////////////////////////////////////////////////////////////////////////
// Crosshair.spec.ts
// 2023. 08. 21. created by wooriPbg
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Crosshair } from '../../../src/model/Crosshair';
import { LinearAxis } from '../../../src/model/axis/LinearAxis';
import { Tester } from '../Tester';

const source = {
    showAlways: Tester.brandom(),
    showLabel: Tester.brandom(),
    labelFormat: '',
    labelStyles: {}
}

/**
 * Tests for Crosshair class.
 */
 describe("Crosshair test", function() {

    let crosshair: Crosshair;
    beforeEach(() => {
        crosshair = new Crosshair(new LinearAxis(null, false));
        crosshair.load(source);
    });

    it('init', () => {
        let ch = new Crosshair(new LinearAxis(null, false));

        expect(ch).exist;
    });

    it('showAlways', () => {
        expect(crosshair.showAlways).eq(source.showAlways);
    });
});
