import { Page, Locator, ElementHandle } from '@playwright/test';
import { IPoint } from '../src/common/Point';

interface IRect {
	x: number;
	y: number;
	width: number;
	height: number;
}

export class PWTester {
	//-------------------------------------------------------------------------
	// consts
	//-------------------------------------------------------------------------
	static readonly VIEWPORT_SIZE = {
		width: 1920,
		height: 1080,
	};

	//-------------------------------------------------------------------------
	// static members
	//-------------------------------------------------------------------------
	static same(v1: number, v2: number, round = true): boolean {
		return round ? Math.round(v1) === Math.round(v2) : v1 === v2;
	}

	static async goto(page: Page, url: string): Promise<void> {
		await page.setViewportSize(this.VIEWPORT_SIZE);
		await page.goto('http://localhost:6010/realchart/' + url).catch((err) => '>> ' + console.error(err));
		await page.evaluate('chart.update(config, false)');
	}

	static async getBounds(elt: ElementHandle): Promise<IRect> {
		return await elt.evaluate((elt) => {
			const { x, y, width, height } = (elt as Element).getBoundingClientRect();
			return { x, y, width, height };
		});
	}

	static async getAxis(page: Page, xy: 'x' | 'y'): Promise<ElementHandle> {
		return await page.$('.rct-axis' + `[xy=${xy}]`);
	}

	static async getAxisLine(page: Page, xy: 'x' | 'y'): Promise<ElementHandle> {
		const axis = await this.getAxis(page, xy);
		return await axis.$('.rct-axis-line');
	}

	static async getGridBounds(page: Page): Promise<IRect> {
		const grids = await page.$('.rct-grids');
		return await this.getBounds(grids);
	}

	static async getTranslate(elt: ElementHandle): Promise<IPoint> {
		const cs = await elt.evaluate((elt) => getComputedStyle(elt as Element).getPropertyValue('transform'));
		const vals = cs.substring('matrix('.length, cs.length - 1).split(/\,\s*/);

		return { x: +vals[4], y: +vals[5] };
	}
}
