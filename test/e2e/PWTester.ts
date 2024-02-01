import { Page, ElementHandle, TestInfo, expect } from '@playwright/test';
import { IPoint } from '../../src/common/Point';
import { IRect } from '../../src/common/Rectangle';
import { Chart } from '../../src/model/Chart';
import path from 'path';
export class PWTester {
    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly VIEWPORT_SIZE = {
        width: 1920,
        height: 1080
    };

    //-------------------------------------------------------------------------
    // static members
    //-------------------------------------------------------------------------
    static same(v1: number, v2: number, round = true): boolean {
        return round ? Math.round(v1) === Math.round(v2) : v1 === v2;
    }

    static async goto(page: Page, url: string): Promise<void> {
        page.on('domcontentloaded', (page) => {});
        await page.setViewportSize(this.VIEWPORT_SIZE);
        await page.goto('http://localhost:6010/realchart/' + url).catch((err) => '>> ' + console.error(err));
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
                    y: firstTransform.matrix.f
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

    static async testChartBySnapshot(page: Page, testInfo: TestInfo, description?: string) {
        const chartElementId = '#realchart';
        // const folderPath = testInfo.snapshotDir.split("/").slice(0, -1).join("/");
        // const snapshotFolder = path.join(folderPath, 'snapshot');
        // console.log(path.join(snapshotFolder, 'test.png'))
        // const screenShot = await page.locator(chartElementId).screenshot({path: path.join(snapshotFolder, 'test.png')});
        const screenShot = await page.locator(chartElementId).screenshot();

        await expect(screenShot).toMatchSnapshot({ maxDiffPixels: 10 });
        await testInfo.attach('screenshot', {
            body: screenShot,
            contentType: 'image/png'
        });
        if (!description) {
            return;
        }
        await testInfo.attach('스냅샷 설명', {
            body: description,
            contentType: 'text/plain'
        });
    }

    static async mouseHover(page: Page, elt: ElementHandle) {
        await page.mouse.click(0, 0);
        const boundingBox = await elt.boundingBox();

        if (boundingBox) {
            await page.mouse.move(boundingBox.x + boundingBox.width / 2, boundingBox.y + boundingBox.height / 2);
        } else {
            console.error('DOM 요소의 위치를 가져올 수 없습니다.');
        }
    }
    static async mouseClick(page: Page, elt: ElementHandle) {
        await page.mouse.move(0, 0);
        const boundingBox = await elt.boundingBox();

        if (boundingBox) {
            await page.mouse.move(boundingBox.x + boundingBox.width / 2, boundingBox.y + boundingBox.height / 2);
            await page.mouse.down();
            await page.mouse.up();
            // await page.mouse.click(
            //   boundingBox.x + boundingBox.width / 2,
            //   boundingBox.y + boundingBox.height / 2
            // );
        } else {
            console.error('DOM 요소의 위치를 가져올 수 없습니다.');
        }
    }
}
