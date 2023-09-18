import jsdomGlobal from "jsdom-global";
import fs from "fs";
import path from "path";
import * as parser from "@babel/parser";
import generator from "@babel/generator";
import _traverse from "@babel/traverse";
import { group } from "console";
const traverse = _traverse.default;

let ROOT = "www";

function createDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}
function readFile(file) {
    return fs.readFileSync(file, "utf-8");
}
function writeFile(file, s) {
    fs.writeFileSync(file, s);
}

function createHTML(title) {
    return `
    <script src="https://unpkg.com/realchart"></script>

    <div id="realchart"></div>
    `;
}

const CSS = `
@import url('https://unpkg.com/realchart/dist/realchart-style.css');

#realchart {
    width: 100%;
    height: 550px;
    border: 1px solid lightgray;
    margin-bottom: 20px;
}`;

function createJs(leafName) {
    let js = "";
    let demoDescription = "";
    try {
        const originJs = readFile("web/realchart/demo/" + leafName + ".js");
        let configContent;
        const ast = parser.parse(originJs, {
            sourceType: "module",
            plugins: ["jsx", "flow"],
        });
        traverse(ast, {
            VariableDeclaration(path) {
                const declarations = path.node.declarations;

                for (let decl of declarations) {
                    if (decl.id.name === "config") {
                        // config 객체의 내용을 저장
                        configContent = decl.init;
                        break;
                    }
                }
                
                if (path.node.leadingComments && path.node.leadingComments.length > 0) {
                    path.node.leadingComments.forEach((comment) => {
                        if (comment.type === "CommentBlock" && comment.value.trim().startsWith("*")) {
                            const content = comment.value.trim().split("\n");
                            let isDemoContent = false;
                            let emptyLinePassed = false;
                            content.forEach((line) => {
                                line = line.trim();
                                if (line.includes("@demo")) {
                                    isDemoContent = true;
                                    return;
                                }
                                if (isDemoContent && line.startsWith("*")) {
                                    if (!emptyLinePassed && line === "*") {
                                        emptyLinePassed = true;
                                        return;
                                    }
                                    demoDescription += line.replace('*', '').trim() + "\n";
                                }
                            });
                        }
                    });
                }
            },
            enter(path) {
                // 모든 노드에 대해 trailingComments 제거
                delete path.node.trailingComments;
                // innerComments (사이 주석)도 확인하여 제거
                if (path.node.innerComments) {
                    delete path.node.innerComments;
                }
            },
        });
        if (configContent) {
            const { code } = generator.default(configContent);
            js = `const config = ${code};
const chart = RealChart.createChart(document, 'realchart', config);`;
        } else {
            console.log("config object not found");
        }
    } catch (e) {
        // console.error(e);
    }
    return {js, demoDescription};
}
function createDetail(leafName, demoDescription) {
    const detail = `---
    name: ${leafName} Demo
    description: ${demoDescription ? demoDescription : leafName + " Demo"}
    authors:
      - Wooritech
...
    `;

    return detail;
}

function createFilePath(leafDir, type) {
    return leafDir + "/demo." + type;
}
const exportDemos = () => {
    const fiddleDat = readFile("web/realchart/fiddle.dat");

    let category = "";
    let groupDir = "";

    const lines = fiddleDat.trim().split('\n');

    for (const line of lines) {
        if (line.startsWith('[')) {
            category = line.slice(1, -1).toLowerCase();
        } else if (line !== "") {
            const fileName = path.basename(line);
            const tempDir = [ROOT, ...line.split("/").map(l => l.toLowerCase())];
            tempDir.splice(2, 0, category.toLowerCase());
            const leafDir = tempDir.join("/");
            createDir(leafDir); // 폴더 생성

            // 파일 생성 로직
            const fileDetails = [
                { type: 'js', contentProvider: createJs, additional: 'demoDescription' },
                { type: 'html', contentProvider: createHTML },
                { type: 'css', content: CSS },
                { type: 'detail', contentProvider: createDetail, needsDescription: true }
            ];

            fileDetails.forEach(({ type, contentProvider, content, additional, needsDescription }) => {
                const filePath = createFilePath(leafDir, type);
                let fileContent, demoDescription;

                if (contentProvider) {
                    const result = contentProvider(fileName);

                    // `createJs` 함수가 객체를 반환하는 경우
                    if (typeof result === 'object' && result !== null) {
                        fileContent = result.js;
                        demoDescription = result.demoDescription;
                    } else {
                        fileContent = result;
                    }
                } else {
                    fileContent = content;
                }

                if (needsDescription) {
                    fileContent = createDetail(fileName, demoDescription);
                }

                writeFile(filePath, fileContent);
            });
        }
    }
};

exportDemos();
