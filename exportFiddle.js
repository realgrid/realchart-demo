import jsdomGlobal from "jsdom-global";
import fs from "fs";
import path from "path";
import * as parser from "@babel/parser";
import generator from "@babel/generator";
import _traverse from "@babel/traverse";
import chokidar from "chokidar";
import { load } from "cheerio";

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

function createHTML(leafName) {
  const originHtml = readFile(leafName);
  const htmlWithoutBOM = originHtml.replace(/^\uFEFF/, '');
  const $ = load(htmlWithoutBOM);

  const scripts = $("script");
  const links = $("link");

  for (let link of links) {
    if (link.attribs.href.includes("realchart-style.css")) {
      $(link).attr(
        "href",
        "https://unpkg.com/realchart/dist/realchart-style.css"
      );
    } else {
      $(link).remove();
    }
  }

  for (let script of scripts) {
    const src = $(script).attr("src");
    if (src && src.includes("realchart.js")) {
      $(script).attr("src", "https://unpkg.com/realchart");
      continue;
    }
    if (src) $(script).remove();
  }
  const licScriptContent = `
  <script>
    var realChartLic = 'upVcPE+wPOkOR/egW8JuxkM/nBOseBrflwxYpzGZyYkhw7qfHRQ+GiF0lY62mJi5KBwoSJHOA48O5+/xJSE3Lms4sjcl83Pgkn/JIEkiRbk=';
  </script>
`;
  $("body").append(licScriptContent);
  return $.html({ pretty: true });
}

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
      const js = createJs(srcPath);
      const destJsPath = path.join(destPath, "demo.js");
      await fs.promises.writeFile(destJsPath, js);
      break;
    case ".html":
      const htmlContent = createHTML(srcPath);
      const destHTMLPath = path.join(destPath, "demo.html");
      await fs.promises.writeFile(destHTMLPath, htmlContent);
      break;
  }
}

function createJs(leafName) {
  let jsContent;
  try {
    const originJs = readFile(leafName);
    const ast = parser.parse(originJs, {
      sourceType: "module",
      plugins: ["jsx", "flow"],
    });
    traverse(ast, {
      Program(path) {
        // 전체 JavaScript 코드를 저장
        jsContent = path.toString();
      },
    });
  } catch (e) {
    // console.error(e);
  }
  return jsContent;
}

copyFolderStructure(SOURCE_ROOT, DEST_ROOT)
  .then(() => console.log("Structure copied successfully!"))
  .catch((error) => console.error("Error copying structure:", error));
