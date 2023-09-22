import { test } from '@playwright/test';
import fs from 'fs/promises';
import path from 'path';

async function getFilesWithExtension(directoryPath, fileExtension) {
	try {
		const files = await fs.readdir(directoryPath);
		return files.filter((file) => path.extname(file) === fileExtension);
	} catch (err) {
		console.error('폴더를 읽어올 수 없습니다.', err);
		return [];
	}
}

test('copy demo', async ({ page }) => {
	let fileNo = 1;
	const baseUrl = 'http://localhost:6010/realchart/demo/';
	const directoryPath = './web/realchart/demo'; // 검색할 폴더 경로
	const fileExtension = '.js'; // 검색할 확장자

	const files = await getFilesWithExtension(directoryPath, fileExtension);
	for (const url of files) {
		const targetUrl = baseUrl + url.replace(fileExtension, '.html');

		try {
			await page.goto(targetUrl);
			const config = await page.evaluate('config');
			const jsonConfig = JSON.stringify(config, null, 2);
			const filePath = `../realreport-service/src/data/chart/chart-${fileNo++}.json`;
			await fs.writeFile(filePath, jsonConfig);
		} catch (err) {
			console.error('File that failed to convert: ' + url);
			console.error(err);
		}
	}
});
