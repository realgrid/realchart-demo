/*
 * 노드에 배포되는 package.json의 version을 일치시킨다. 
 */
import replace from "replace-in-file";
import fs from "fs";

const pkg = JSON.parse(fs.readFileSync("./package.json"));

const dest = ["./dist/.npm/package.json", "./dist/.npmdebug/package.json"];

replace({
    files: dest,
    from: [/"version": "\d+.\d+.\d+"/],
    to: [`"version": "${pkg.version}"`]
})