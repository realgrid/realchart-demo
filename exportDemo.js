import jsdomGlobal from "jsdom-global";
import fs from "fs";
import path from "path";
import * as parser from "@babel/parser";
import generator from "@babel/generator";
import _traverse from "@babel/traverse";
import chokidar from "chokidar";

const traverse = _traverse.default;
const SOURCE_ROOT = "web/realchart/fiddle";
const DEST_ROOT = "fiddle";

function getDepth(depth) {
  let src = "";
  for (let i = 0; i < depth; i++) {
    src += "../";
  }
  return src;
}
function readFile(file) {
  return fs.readFileSync(file, "utf-8");
}
function writeFile(file, s) {
  fs.writeFileSync(file, s);
}

function createHTML(destPath) {
  const depth = getDepth(destPath.split("/").length);

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

async function copyFolderStructure(src, dest) {
  const entries = await fs.promises.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    let destPath;

    if (entry.isDirectory()) {
      destPath = path.join(dest, entry.name);
      await fs.promises.mkdir(destPath, { recursive: true });
      await copyFolderStructure(srcPath, destPath);
    } else {
      const baseNameWithoutExt = path.basename(srcPath, path.extname(srcPath));
      destPath = path.join(dest, baseNameWithoutExt);
      await fs.promises.mkdir(destPath, { recursive: true }); // 폴더를 생성합니다.
      await handleFileCreation(srcPath, destPath);
    }
  }
  // 파일 변경 감지를 위한 chokidar 설정
  const watcher = chokidar.watch(SOURCE_ROOT, {
    persistent: false,
  });

  watcher.on("change", async (changedFilePath) => {
    console.log(`File changed: ${changedFilePath}`);

    // 변경된 파일의 경로를 얻어온 후 해당 파일을 처리
    const relativePath = path.relative(SOURCE_ROOT, changedFilePath);
    const destPath = path.join(DEST_ROOT, relativePath);

    await handleFileCreation(changedFilePath, destPath);

  });
}

async function handleFileCreation(srcPath, destPath) {
  const extname = path.extname(srcPath);
  switch (extname) {
    case ".js":
      const { js: jsContent } = createJs(srcPath);
      const destJsPath = path.join(destPath, "demo.js");
      await fs.promises.writeFile(destJsPath, jsContent);
      const detailContent = createDetail(destPath);
      const destDetailPath = path.join(destPath, "demo.detail");
      await fs.promises.writeFile(destDetailPath, detailContent);
      break;
    case ".html":
      const htmlContent = createHTML(destPath);
      const destHTMLPath = path.join(destPath, "demo.html");
      await fs.promises.writeFile(destHTMLPath, htmlContent);
      const cssContent = CSS;
      const destCSSPath = path.join(destPath, "demo.css");
      await fs.promises.writeFile(destCSSPath, cssContent);
      break;
    default:
      break;
  }
}

function createDetail(leafName, demoDescription) {
  const name = leafName.split("/")[leafName.split("/").length - 1];
  const detail = `---
    name: ${name} Demo
    description: ${demoDescription ? demoDescription : name + " Demo"}
    authors:
      - Wooritech
...
    `;

  return detail;
}

function createJs(leafName) {
  let js = "";
  let demoDescription = "";
  try {
    const originJs = readFile(leafName);
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

        // if (path.node.leadingComments && path.node.leadingComments.length > 0) {
        //   path.node.leadingComments.forEach((comment) => {
        //     if (
        //       comment.type === "CommentBlock" &&
        //       comment.value.trim().startsWith("*")
        //     ) {
        //       const content = comment.value.trim().split("\n");
        //       let isDemoContent = false;
        //       let emptyLinePassed = false;
        //       content.forEach((line) => {
        //         line = line.trim();
        //         if (line.includes("@demo")) {
        //           isDemoContent = true;
        //           return;
        //         }
        //         if (isDemoContent && line.startsWith("*")) {
        //           if (!emptyLinePassed && line === "*") {
        //             emptyLinePassed = true;
        //             return;
        //           }
        //           demoDescription += line.replace("*", "").trim() + "\n";
        //         }
        //       });
        //     }
        //   });
        // }
      },
    //   enter(path) {
    //     // 모든 노드에 대해 trailingComments 제거
    //     delete path.node.trailingComments;
    //     // innerComments (사이 주석)도 확인하여 제거
    //     if (path.node.innerComments) {
    //       delete path.node.innerComments;
    //     }
    //   },
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
  return { js, demoDescription };
}

copyFolderStructure(SOURCE_ROOT, DEST_ROOT)
  .then(() => console.log("Structure copied successfully!"))
  .catch((error) => console.error("Error copying structure:", error));
