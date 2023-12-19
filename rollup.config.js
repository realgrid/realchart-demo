import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import modify from "rollup-plugin-modify";
import banner2 from "rollup-plugin-banner2";
import terser from "@rollup/plugin-terser";
import copy from "rollup-plugin-copy";
import dts from "rollup-plugin-dts";
import del from "rollup-plugin-delete";
import sourcemaps from "rollup-plugin-sourcemaps";
import typescript from "@rollup/plugin-typescript";
import fs from "fs";
import exportDefault from "./exportDefault.js";

const pkg = JSON.parse(fs.readFileSync("./package.json"));
const version = pkg.version; // + '.' + pkg.buildNo;
const currYear = new Date().getFullYear();
const filename = `realchart.${pkg.version}`;
const namespace = "RealChart";

const copyright = `
/** 
 * RealChart v${version}
 * Copyright (C) 2023-${currYear} WooriTech Inc.
 * All Rights Reserved. 
 */\n`;

// let npmdist = process.env.BUILD === "libdebug" ? ".npmdebug" : ".npm";
let npmdist;
switch (process.env.BUILD) {
  case "libdebug":
    npmdist = ".npmdebug";
    break;
  case "lib":
    npmdist = ".npm";
    break;
  case "report":
    npmdist = ".githubnpm";
    break;
  case "reportdebug":
    npmdist = ".githubnpmdebug";
    break;
}

const rollup_debug_config = {
  input: "./out/realchart/js/src/main.js",
  output: {
    format: "umd",
    name: namespace,
    sourcemap: true,
    file: "./web/realchart/lib/realchart.js",
  },
  plugins: [
    // sourcemap과 modify를 함께 사용하면 sourcemap이 정상적으로 표시되지 않음.
    modify({
      $Version: `${pkg.version}`,
      // '$LicenseType': 'dev',
      // '$$LicenseCheck': '0',
      // '$ProductVersion': version
    }),
    resolve(),
    commonjs(), // commonjs 모듈을 es6으로 포함시킨다. ex) bezier-easing
    exportDefault(),
    sourcemaps(),
    // banner(copyright),  // 이것도 sourcemap에 문제를 일으킬 가능성이 존재. 필요시 rollup-plugin-banner2 대체
    copy({
      targets: [],
    }),
  ],
};

const rollup_debug_config2 = {
  input: "src/main.ts",
  output: {
    format: "umd",
    name: namespace,
    sourcemap: true,
    file: "./web/realchart/lib/realchart.js",
  },
  plugins: [
    typescript({
      // tsconfig: 'tsconfig.json'
    }),
    // sourcemap과 modify를 함께 사용하면 sourcemap이 정상적으로 표시되지 않음.
    modify({
      $Version: `${pkg.version}`,
      // '$LicenseType': 'dev',
      // '$$LicenseCheck': '0',
      // '$ProductVersion': version
    }),
    resolve(),
    commonjs(), // commonjs 모듈을 es6으로 포함시킨다. ex) bezier-easing
    exportDefault(),
    sourcemaps(),
    // banner(copyright),  // 이것도 sourcemap에 문제를 일으킬 가능성이 존재. 필요시 rollup-plugin-banner2 대체
    copy({
      targets: [],
    }),
  ],
};

const rollup_prod_config = {
  input: "./out/realchart/js/src/main.js",
  output: [
    {
      format: "umd",
      name: namespace,
      file: `./dist/deploy/${filename}/${filename}.min.js`,
    },
  ],
  plugins: [
    modify({
      $Version: `${pkg.version}`,
      $LicenseType: "enterprise",
      $$LicenseCheck: "1",
      $ProductVersion: version,
    }),
    resolve(),
    commonjs(),
    exportDefault(),
    terser(),
    banner2(() => copyright),
    // del({ targets: 'web/realchart/lib/realchart.js'}),
    copy({
      hook: "writeBundle",
      targets: [
        {
          src: "./web/realchart/styles/realchart-style.css",
          dest: `./dist/deploy/${filename}`,
        },
        {
          src: "./web/realchart/styles/realchart-style.css",
          dest: `./www/realchart/styles`,
        },
        {
          src: `./dist/deploy/${filename}/${filename}.min.js`,
          dest: `./web/realchart/lib`,
        },
        {
          src: `./dist/deploy/${filename}/${filename}.min.js`,
          dest: `./web/realchart/lib`,
          rename: "realchart.js",
        },
        {
          src: `./dist/deploy/${filename}/${filename}.min.js`,
          dest: `./www/realchart/lib`,
          rename: "realchart.js",
        },
      ],
    }),
  ],
};

const rollup_pub_config = {
  input: "./out/realchart/js/src/main.js",
  output: [
    {
      format: "umd",
      name: namespace,
      file: "./web/realchart/lib/realchart.js",
    },
  ],
  plugins: [
    modify({
      $Version: `${pkg.version}`,
      $LicenseType: "ent",
      $$LicenseCheck: "1",
      $ProductVersion: version,
    }),
    resolve(),
    commonjs(),
    exportDefault(),
    terser(),
    banner2(() => copyright),
    copy({
      hook: "writeBundle",
      targets: [
        {
          src: "./web/realchart/lib/realchart.js",
          dest: `./`,
          rename: `${filename}.min.js`,
        },
        // { src: './web/', dest: './', rename: 'www' }
      ],
      flatten: false,
    }),
    del({
      // targets:['./www/realchart/lib/realreport-chart.js.map'],
      hook: "closeBundle",
    }),
  ],
};

const rollup_report_config = {
  input: "./out/realchart/js/src/main.js",
  output: [
    {
      format: "umd",
      name: namespace,
      file: `./dist/${npmdist}/dist/index.js`,
    },
    {
      format: "es",
      name: namespace,
      file: `./dist/${npmdist}/dist/index.esm.js`,
    },
  ],
  plugins: [
    process.env.BUILD !== "reportdebug" &&
      modify({
        $Version: `${pkg.version}`,
        $LicenseType: "enterprise",
        $$LicenseCheck: "1",
        $$ReportCheck: "1",
        $ProductVersion: version,
      }),
    commonjs(),
    resolve(),
    exportDefault(),
    // process.env.BUILD !== "reportdebug" && terser(),
    process.env.BUILD !== "reportdebug" && banner2(() => copyright),
    copy({
      targets: [
        {
          src: "./web/realchart/styles/realchart-style.css",
          dest: `dist/${npmdist}/dist`,
        },
        { src: "./license.txt", dest: `dist/${npmdist}` },
        { src: "./README.md", dest: `dist/${npmdist}` },
      ],
    }),
  ],
};

const rollup_lib_config = {
  input: "./out/realchart/js/src/main.js",
  output: [
    {
      format: "umd",
      name: namespace,
      file: `./dist/${npmdist}/dist/index.js`,
    },
    {
      format: "es",
      name: namespace,
      file: `./dist/${npmdist}/dist/index.esm.js`,
    },
  ],
  plugins: [
    process.env.BUILD !== "libdebug" &&
      modify({
        $Version: `${pkg.version}`,
        $LicenseType: "enterprise",
        $$LicenseCheck: "1",
        $ProductVersion: version,
      }),
    commonjs(),
    resolve(),
    exportDefault(),
    process.env.BUILD !== "libdebug" && terser(),
    process.env.BUILD !== "libdebug" && banner2(() => copyright),

    // typescript({
    //     rollupCommonJSResolveHack: false,
    //     clean: true,
    //     useTsconfigDeclarationDir: true,
    //     tsconfig: 'libconfig.json',
    // }),
    copy({
      targets: [
        {
          src: "./web/realchart/styles/realchart-style.css",
          dest: `dist/${npmdist}/dist`,
        },
        { src: "./license.txt", dest: `dist/${npmdist}` },
        { src: "./README.md", dest: `dist/${npmdist}` },
      ],
    }),
  ],
};

const rollup_type_config = {
  input: "./out/realchart/js/src/main.d.ts",
  output: {
    file: `./dist/${npmdist}/dist/index.d.ts`,
    format: "es",
  },
  plugins: [dts()],
};

const copyToE2e = {
  input: "./rollup-dummy.js",
  plugins: [
    copy({
      targets: [
        {
          src: "./dist/.npm/dist/index.js",
          dest: "./e2e/src/js",
          rename: "realreport-chart.js",
        },
        {
          src: "./dist/.npm/dist/index.d.ts",
          dest: "./e2e/src/js",
          rename: "realreport-chart.d.ts",
        },
        {
          src: "./dist/.npm/dist/realchart-style.css",
          dest: "./e2e/src/styles",
        },
      ],
    }),
  ],
};

let rollup_config;
console.log("rollup", process.env.BUILD);

switch (process.env.BUILD) {
  case "e2e":
    rollup_config = [rollup_lib_config, rollup_type_config, copyToE2e];
    break;
  case "debug":
    rollup_config = rollup_debug_config;
    break;
  case "debugw":
    rollup_config = rollup_debug_config2;
    break;
  case "prod":
    rollup_config = rollup_prod_config;
    break;
  case "pub":
    rollup_config = rollup_pub_config;
    break;
  case "report":
  case "reportdebug":
    rollup_config = [rollup_report_config, rollup_type_config];
    break;
  case "lib":
  case "libdebug":
    rollup_config = [rollup_lib_config, rollup_type_config];
    break;
  default:
    rollup_config = [rollup_debug_config, rollup_prod_config];
    break;
}

export default rollup_config;
