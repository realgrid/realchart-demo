import fs from "fs";
import path from "path";
import * as parser from "@babel/parser";
import generator from "@babel/generator";
import _traverse from "@babel/traverse";
const traverse = _traverse.default;

function readFile(file) {
    return fs.readFileSync(file, "utf-8");
}

function writeFile(file, s) {
    fs.writeFileSync(file, s);
}

function createJson(leafName) {
    let json = "";
    let demoDescription = "";
    try {
        const originJs = readFile("web/realchart/demo/" + leafName);
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
                delete path.node.leadingComments;
                // innerComments (사이 주석)도 확인하여 제거
                if (path.node.innerComments) {
                    delete path.node.innerComments;
                }
            },
        });
        if (configContent) {
            const { code } = generator.default(configContent);
            let stringObject = code.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": ');
            stringObject = stringObject.replace(/'([^']+)'/g, '"$1"');
            json = stringObject;
        } else {
            console.log("config object not found in " + leafName);
        }
    } catch (e) {
        console.error(e);
    }
    return {json, demoDescription};
}


let fileNo = 1;

const exportDemos = () => {
    const directoryPath = './web/realchart/demo'; // 검색할 폴더 경로
    const fileExtension = '.js'; // 원하는 확장자

    getFilesWithExtension(directoryPath, fileExtension, (err, files) => {
        if (err) {
          console.error('파일 목록을 가져오는 중 오류가 발생했습니다.');
          return;
        }
      
        files.forEach((file) => {
            if (file !== "") {
                const fileName = path.basename(file);
    
                // 파일 생성 로직
                const fileDetails = [
                    { type: 'json', contentProvider: createJson },
                ];
    
                fileDetails.forEach(({ type, contentProvider, content }) => {
                    const filePath = `../realreport-service/src/data/chart/chart-${fileNo++}.${type}`
                    let fileContent
    
                    if (contentProvider) {
                        const result = contentProvider(fileName);
    
                        if (typeof result === 'object' && result !== null) {
                            fileContent = result.json;
                        } else {
                            fileContent = result;
                        }
                    } else {
                        fileContent = content;
                    }
    
                    writeFile(filePath, fileContent);
                });
            }
        });
    });
};

function getFilesWithExtension(directoryPath, fileExtension, callback) {
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        console.error('폴더를 읽어올 수 없습니다.', err);
        return callback(err, null);
    }
  
      const filteredFiles = files.filter((file) => path.extname(file) === fileExtension);
      callback(null, filteredFiles);
    });
}

exportDemos();