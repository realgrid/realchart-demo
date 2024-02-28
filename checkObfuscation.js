import fs from 'fs';

function readFile(file) {
    return fs.readFileSync(file, 'utf-8');
}

function removeCopyrightAndLastSpace(str) {
    const removeCopyrightStr = str.replace(/\/\*[\s\S]*?\*\//, '').slice(2);
    return removeCopyrightStr.slice(0, removeCopyrightStr.length - 1);
}

function hasNoNewline(str) {
    const noNewlinesRegex = /^([^\r\n]*)$/;
    return noNewlinesRegex.test(str);
}

function checkObfuscation(path) {
    const code = removeCopyrightAndLastSpace(readFile(path));
    const startText =
        '!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).RealChart={})}';

    const startTextTest = code.startsWith(startText);
    const newLineTest = hasNoNewline(code);

    if (startTextTest && newLineTest) {
        console.log('난독화 테스트 성공!');
    } else {
        throw new Error('난독화 실패!');
    }
}

const path = './dist/.npm/dist/index.js';
checkObfuscation(path);
