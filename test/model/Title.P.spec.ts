////////////////////////////////////////////////////////////////////////////////
// Title.P.spec.ts
// 2023. 08. 24. created by wooriPbg
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { beforeEach, describe, it } from 'mocha';
import { Chart } from '../../src/main';
import { Utils } from '../../src/common/Utils';
import { Subtitle, SubtitlePosition, Title } from '../../src/model/Title';
import { Align, VerticalAlign, isNull } from '../../src/common/Types';
import { isString } from '../../src/common/Common';

const title_source = {
    text: Utils.srandom(1, 10),
    align: Utils.arandom([Align.LEFT, Align.CENTER, Align.RIGHT]),
    backgroundStyle: {
        fill: 'red'
    }
}

/**
 * Tests for Title class.
 */
describe('Title test', function() {
    let title: Title;
    let chart: Chart;

    beforeEach(() => {
        chart = new Chart(null);
        title = new Title(chart);
        title.load(title_source);
    });

    it('init', () => {
        const title = new Title(chart);

        expect(title).exist;
    });

    it('text', () => {
        expect(title.text).eq(source.text);
    });

    it('align', () => {
        expect(title.align).eq(source.align);
    });

    it('backgroundStyle', () => {
        expect(title.backgroundStyle).eql(source.backgroundStyle);
    });

    it('isVisible()', () => {
        if (title.visible && !isNull(title.text)) {
            expect(title.isVisible()).true;
        } else {
            expect(title.isVisible()).false;
        }
    });

    it('_doLoadSimple()', () => {
        const text = Utils.arandom([Utils.srandom(1, 10), Utils.irandom(0, 1000), Utils.brandom()]) ;
        if (isString(text)) {
            expect(title['_doLoadSimple'](text)).true;
            expect(title.text).eq(text);
        } else {
            expect(title['_doLoadSimple'](text)).undefined;
        } 
    });
});

const subtitle_source = {
    text: Utils.srandom(1, 10),
    valign: Utils.arandom([VerticalAlign.BOTTOM, VerticalAlign.MIDDLE, VerticalAlign.TOP]),
    position: Utils.arandom([SubtitlePosition.BOTTOM, SubtitlePosition.LEFT, SubtitlePosition.RIGHT, SubtitlePosition.TOP])
}

/**
 * Tests for Subtitle class.
 */

describe('Subtitle', function() {
    let subtitle: Subtitle;
    let chart: Chart;

    beforeEach(() => {
        chart = new Chart(null);
        subtitle = new Subtitle(chart);
        subtitle.load(subtitle_source);
    });

    it('init', () => {
        const subtitle = new Subtitle(chart);

        expect(subtitle).exist;
    });

    it('position', () => {
        expect(subtitle.position).eq(subtitle_source.position);
    });

    it('valign', () => {
        expect(subtitle.valign).eq(subtitle_source.valign);
    });

    it('text', () => {
        expect(subtitle.text).eq(subtitle_source.text);
    });
});