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
import { Utils } from '../../../src/common/Utils';

const source = {
    showAlways: Utils.brandom(),
    showLabel: Utils.brandom(),
    labelFormat: '',
    labelStyles: {}
}

/**
 * Tests for Crosshair class.
 */
 describe("Crosshair test", function() {

    let crosshair: Crosshair;
    beforeEach(() => {
        crosshair = new Crosshair(new LinearAxis(null));
        crosshair.load(source);
    });

    it('init', () => {
        let ch = new Crosshair(new LinearAxis(null));

        expect(ch).exist;
    });

    it('showAlways', () => {
        expect(crosshair.showAlways).eq(source.showAlways);
    });
});
