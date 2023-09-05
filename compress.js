import compressing from "compressing";
import path from "path";
import fs from "fs";

const pkg = JSON.parse(fs.readFileSync("./package.json"));
const FgRed = "\x1b[31m";
const FgGreen = "\x1b[32m";
const Reset = "\x1b[0m";
const fname = 'realchart'
const __dirname = path.resolve();

const deployPath = path.resolve(__dirname, `dist/deploy`, `${fname}.${pkg.version}`);
const latest = path.resolve(__dirname, `dist/deploy`, `${fname}.latest`);

compressing.zip.compressDir(deployPath, `${deployPath}.zip`)
    .then(() => {console.log('\n', FgGreen + `${fname}.${pkg.version}.zip 압축 파일 생성완료!` + Reset);})
    .catch(() => {console.log(FgRed + '압축 파일 생성 실패...: ' + `${fname}.${pkg.version}` + Reset);});

compressing.zip.compressDir(deployPath, `${latest}.zip`)
    .then(() => {console.log('\n', FgGreen + `latest.zip 압축 파일 생성완료! ==> ${pkg.version}` + Reset);})
    .catch(() => {console.log(FgRed + '압축 파일 생성 실패...: ' + `${fname}.${pkg.version}` + Reset);});