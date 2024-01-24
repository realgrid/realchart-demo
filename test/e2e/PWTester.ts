import { Page, ElementHandle } from '@playwright/test';
import { IPoint } from '../../src/common/Point';
import { IRect } from '../../src/common/Rectangle';
import { Chart } from '../../src/model/Chart';

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
		page.on('console', async (msg) => {
			const values = [];
			for (const arg of msg.args())
				values.push((await arg) && arg.jsonValue());
			console.log(...values);
		});
		page.on('domcontentloaded', (page) => {});
		await page.setViewportSize(this.VIEWPORT_SIZE);
		await page
			.goto('http://localhost:6010/realchart/' + url)
			.catch((err) => '>> ' + console.error(err));
	}

	static async getBounds(elt: ElementHandle): Promise<IRect> {
		return await elt.evaluate((elt) => {
			const { x, y, width, height } = (
				elt as Element
			).getBoundingClientRect();
			return { x, y, width, height };
		});
	}

	static async getAxis(page: Page, xy: 'x' | 'y'): Promise<ElementHandle> {
		return await page.$('.rct-axis' + `[xy=${xy}]`);
	}

	static async getAxisLine(
		page: Page,
		xy: 'x' | 'y'
	): Promise<ElementHandle> {
		const axis = await this.getAxis(page, xy);
		return await axis.$('.rct-axis-line');
	}

	static async getGridBounds(page: Page): Promise<IRect> {
		const grids = await page.$('.rct-axis-grids');
		return await this.getBounds(grids);
	}

	static async getTranslate(elt: ElementHandle): Promise<IPoint> {
		const bv = await elt.evaluate((elt) => {
			const svgElement = elt as SVGSVGElement;
			const transformList = svgElement.transform.baseVal;
			if (transformList.numberOfItems > 0) {
				// 첫 번째 변환을 가져오기
				const firstTransform = transformList.getItem(0);
				return {
					x: firstTransform.matrix.e,
					y: firstTransform.matrix.f,
				};
			}
			return { x: 0, y: 0 }; // 변환이 없는 경우 기본값 반환
		});
		return bv;
	}

	static async getPathDValue(elt: ElementHandle): Promise<string | null> {
		const dValue = await elt.evaluate((elt) => {
			const pathElement = elt as SVGPathElement;
			return pathElement.getAttribute('d');
		});
		return dValue;
	}

    static async getConfig(page: any): Promise<Chart> {
        const config = await page.evaluate('config');
        const chart = new Chart(config);
        
        chart.prepareRender();
        return chart;
    }

    static async getModel(page: any): Promise<any> {
        return await page.evaluate('chart.$_p.model');
    }

	static async sleep(time: number = 500): Promise<void> {
		await new Promise((resolve) => setTimeout(resolve, time));
	}

	
}
