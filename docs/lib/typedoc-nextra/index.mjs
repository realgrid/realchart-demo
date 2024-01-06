var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/index.ts
import * as TypeDoc from "typedoc";
import { mkdir, readFile, writeFile } from "fs/promises";
import tmp from "tmp";
import path3 from "path";

// src/serializers/AbstractSerializer.ts
var AbstractSerializer = class {
  constructor(declaration) {
    this.declaration = declaration;
  }
  serialize() {
  }
};
__name(AbstractSerializer, "AbstractSerializer");

// src/serializers/ClassSerializer.ts
import { ReflectionKind } from "typedoc";

// src/utils/helpers.ts
import path2 from "path";

// src/utils/md.ts
import { stripIndents } from "common-tags";

// src/utils/links.ts
var DefaultLinksFactory = {
  String: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String",
  Number: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number",
  Boolean: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean",
  Symbol: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol",
  void: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined",
  Object: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object",
  Function: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function",
  Array: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array",
  Set: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set",
  Map: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map",
  Date: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date",
  RegExp: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp",
  Promise: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise",
  Error: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error",
  EventEmitter: "https://nodejs.org/dist/latest/docs/api/events.html#events_class_eventemitter",
  Timeout: "https://nodejs.org/dist/latest/docs/api/timers.html#timers_class_timeout",
  Buffer: "https://nodejs.org/dist/latest/docs/api/buffer.html#buffer_class_buffer",
  ReadableStream: "https://nodejs.org/dist/latest/docs/api/stream.html#stream_class_stream_readable",
  Readable: "https://nodejs.org/dist/latest/docs/api/stream.html#stream_class_stream_readable",
  ChildProcess: "https://nodejs.org/dist/latest/docs/api/child_process.html#child_process_class_childprocess",
  Worker: "https://nodejs.org/api/worker_threads.html#worker_threads_class_worker",
  MessagePort: "https://nodejs.org/api/worker_threads.html#worker_threads_class_messageport",
  IncomingMessage: "https://nodejs.org/dist/latest/docs/api/http.html#http_class_http_incomingmessage",
  RequestInfo: "https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch",
  RequestInit: "https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch",
  RequestOptions: "https://nodejs.org/dist/latest/docs/api/http.html#http_http_request_options_callback",
  Response: "https://developer.mozilla.org/en-US/docs/Web/API/Response",
  any: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any",
  CanvasRenderingContext2D: "https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D",
  unknown: "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type",
  Duplex: "https://nodejs.org/dist/latest/docs/api/stream.html#stream_class_stream_duplex"
};
var RealChartLinksFactory = {
  JSFIDDLE: "https://jsfiddle.net/gh/get/library/pure/realgrid/realchart-demo/tree/master/"
};

// src/utils/md.ts
import path from "path";
function heading(src, type = 1) {
  return `${"#".repeat(type)} ${src}`;
}
__name(heading, "heading");
function headingId(src, id, type = 1) {
  return `<h${type} id="${id}">${src}</h${type}>`;
}
__name(headingId, "headingId");
function code(src) {
  return `\`${src}\``;
}
__name(code, "code");
function codeBlock(src, lang) {
  return `\`\`\`${lang || ""}
${src}
\`\`\``;
}
__name(codeBlock, "codeBlock");
function bold(src) {
  return `**${src}**`;
}
__name(bold, "bold");
function italic(src) {
  return `*${src}*`;
}
__name(italic, "italic");
function strikethrough(src) {
  return `~~${src}~~`;
}
__name(strikethrough, "strikethrough");
function subscript(src) {
  return `~${src}~`;
}
__name(subscript, "subscript");
function superscript(src) {
  return `^${src}^`;
}
__name(superscript, "superscript");
function highlight(src) {
  return `==${src}==`;
}
__name(highlight, "highlight");
function taskList(src, checked = false) {
  return `[${checked ? "x" : ""}] ${src}`;
}
__name(taskList, "taskList");
function blockquote(src) {
  return `> ${src}`;
}
__name(blockquote, "blockquote");
function ul(src) {
  return `- ${src}`;
}
__name(ul, "ul");
function ol(src) {
  return `1. ${src}`;
}
__name(ol, "ol");
function hr() {
  return `---`;
}
__name(hr, "hr");
function hyperlink(text, link) {
  return `[${text}](${link})`;
}
__name(hyperlink, "hyperlink");
function doclink(text, vars = {}) {
  const [keyword, ...display] = text.trim().split(" ");
  const [sep, ...keys] = keyword.split(".");
  const label = display.join(" ");
  const subpaths = ["config", "docs", "demo", "guide"];
  let lastKey = keys.length ? keys.slice(-1)[0] : keyword;
  let page = "";
  if (!keys.length && subpaths.includes(keyword)) {
    page = `/${keyword}`;
  } else if (!keyword.startsWith("Rc") && keyword == sep) {
    page = `#${keyword}`;
  } else {
    switch (sep) {
      case "g":
      case "global":
        page = `/docs/api/globals/${[keys]}`;
        break;
      case "config":
        keys.forEach((k, i) => {
          keys[i] = k[0] === "$" ? vars[k.substring(1)] || "$" : k;
        });
        if (keys.some((k) => k === "$")) {
          console.warn("[WARN] not found var", text);
          return label;
        }
        lastKey = lastKey.split("#").slice(-1)[0];
        page = "/config/config/" + keys.join("/");
        break;
      case "demo":
      case "guide":
        page = `/${sep}/` + keys.join("/");
        break;
      case "rc":
      case "realchart":
      default:
        const [cls, prop] = keys.length ? keys : [keyword];
        page = `/docs/api/classes/${cls}${prop ? "#" + prop : ""}`;
    }
  }
  return hyperlink(label || lastKey, page);
}
__name(doclink, "doclink");
function fiddlelink(comment) {
  if (comment.tag != "@fiddle")
    return comment.text;
  const [{ text }] = comment.content;
  const [src, ...label] = text.split(" ");
  const href = path.join(RealChartLinksFactory["JSFIDDLE"], src);
  return `<FiddleLink label="${label.join(" ")}" href="${href}"/>`;
}
__name(fiddlelink, "fiddlelink");
function seelink(comment) {
  if (!(comment.kind == "inline-tag") || !(comment.tag == "@link"))
    return comment.text;
  return doclink(comment.text);
}
__name(seelink, "seelink");
function image(alt, link) {
  return `![${alt}](${link})`;
}
__name(image, "image");
function table(heading2, body) {
  return stripIndents`| ${heading2.join(" | ")} |
    | ${heading2.map(() => "-".repeat(11)).join(" | ")} |
    ${body.map((m) => `| ${m.join(" | ").replace(/\n/g, " ")} |`).join("\n")}`;
}
__name(table, "table");

// src/utils/helpers.ts
function getName(decl) {
  var _a;
  return decl.name === "default" ? path2.parse(((_a = getFileMetadata(decl)) == null ? void 0 : _a.name) || "default").name : decl.name;
}
__name(getName, "getName");
function getVars(decl) {
  var _a, _b, _c, _d;
  return (_d = (_c = (_b = (_a = decl.comment) == null ? void 0 : _a.blockTags) == null ? void 0 : _b.find((r) => r.tag === "@configvar")) == null ? void 0 : _c.content) == null ? void 0 : _d.reduce((acc, m) => {
    var _a2;
    const [key, value] = (_a2 = m.text) == null ? void 0 : _a2.split("=");
    return key ? Object.assign(acc, { [key]: value.replace(/\'/g, "") }) : acc;
  }, {});
}
__name(getVars, "getVars");
function getDescription(decl, vars = {}) {
  var _a, _b;
  return ((_b = (_a = decl.comment) == null ? void 0 : _a.summary) == null ? void 0 : _b.map((m) => {
    return getDocLinkedDesc(m, vars);
  }).join("")) || null;
}
__name(getDescription, "getDescription");
function getDocLinkedDesc(display, vars = {}) {
  const hasLink = display.kind == "inline-tag" && display.tag == "@link";
  return hasLink ? doclink(display.text, vars) : display.text;
}
__name(getDocLinkedDesc, "getDocLinkedDesc");
function getFileMetadata(decl) {
  var _a;
  const src = (_a = decl.sources) == null ? void 0 : _a[0];
  if (!src)
    return null;
  return {
    name: path2.basename(src.fileName),
    directory: path2.dirname(src.fileName),
    line: src.line,
    url: src.url
  };
}
__name(getFileMetadata, "getFileMetadata");
function escape(src) {
  return src.replace(/\[/g, "\\[").replace(/\</g, "\\<").replace(/\*/g, "\\*").replace(/\-/g, "\\-").replace(/\|/g, "\\|").replace(/\`/g, "\\`").replace(/\{/g, "\\{");
}
__name(escape, "escape");
function parseType(t) {
  var _a, _b;
  if (!(t == null ? void 0 : t.type))
    return "";
  switch (t.type) {
    case "array":
      return `Array<${parseType(t.elementType)}>`;
    case "conditional":
      return `${parseType(t.checkType)} extends ${parseType(t.extendsType)} ? ${parseType(t.trueType)} : ${parseType(t.falseType)}`;
    case "indexedAccess":
      return `${parseType(t.objectType)}[${parseType(t.indexType)}]`;
    case "intersection":
      return t.types.map(parseType).join(" & ");
    case "predicate":
      return `${t.asserts ? "asserts " : ""}${t.name}${t.targetType ? ` is ${parseType(t.targetType)}` : ""}`;
    case "reference":
      return `${t.name}${t.typeArguments ? `<${t.typeArguments.map(parseType).join(", ").trim()}>` : ""}`;
    case "reflection": {
      const obj = {};
      const { children, signatures } = t.declaration;
      if (children && children.length > 0) {
        for (const child of children) {
          obj[child.name] = parseType(child.type);
        }
        return `{ ${Object.entries(obj).map(([key, value]) => `${key}: ${value}`).join(",")} }`;
      }
      if (signatures && signatures.length > 0) {
        const s = signatures[0];
        const params = (_a = s.parameters) == null ? void 0 : _a.map((p) => `${p.name}: ${p.type ? parseType(p.type) : "unknown"}`);
        return `(${(params == null ? void 0 : params.join(", ")) || "...args: unknown[]"}) => ${s.type ? parseType(s.type) : "unknown"}`;
      }
      return "{}";
    }
    case "templateLiteral":
      return t.tail.map((tail) => {
        return `${t.head.replace(/\n/g, "\\n")}\\\${${escape(parseType(tail[0]))}}${tail[1].replace(/\n/g, "\\n")}`;
      }).join(" | ");
    case "literal":
      return typeof t.value === "string" ? `'${t.value}'` : `${t.value}`;
    case "tuple":
      return `[${((_b = t.elements) == null ? void 0 : _b.map(parseType).join(", ")) || ""}]`;
    case "typeOperator":
      return `${t.operator} ${parseType(t.target)}`;
    case "union":
      return t.types.map(parseType).filter((t2) => !!(t2 == null ? void 0 : t2.trim().length)).join(" | ");
    case "query":
      return `(typeof ${parseType(t.queryType)})`;
    case "inferred":
    case "intrinsic":
    case "unknown":
      return t.name;
    default:
      return "any";
  }
}
__name(parseType, "parseType");
function parseTypes(t) {
  var _a, _b;
  if (!(t == null ? void 0 : t.type))
    return [""];
  switch (t.type) {
    case "array":
      return ["Array", "<", ...parseTypes(t.elementType), ">"];
    case "conditional":
      return [...parseTypes(t.checkType), " ", "extends", " ", ...parseTypes(t.extendsType), " ? ", ...parseTypes(t.trueType), " : ", ...parseTypes(t.falseType)];
    case "indexedAccess":
      return [...parseTypes(t.objectType), "[", ...parseTypes(t.indexType), "]"];
    case "intersection":
      return t.types.flatMap((m, i, a) => [...parseTypes(m), i === a.length - 1 ? "" : " & "].filter((m2) => !!m2));
    case "predicate": {
      const res = [];
      if (t.asserts)
        res.push("asserts", " ", t.name);
      if (t.targetType)
        res.push(" is", ...parseTypes(t.targetType));
      return res;
    }
    case "reference": {
      const res = [];
      res.push(t.name);
      if (t.typeArguments)
        res.push("<", ...t.typeArguments.flatMap(parseTypes), ">");
      return res;
    }
    case "reflection": {
      const obj = {};
      const { children, signatures } = t.declaration;
      if (children && children.length > 0) {
        for (const child of children) {
          obj[child.name] = parseTypes(child.type);
        }
        return [
          "{",
          " ",
          ...Object.entries(obj).flatMap(([k, v]) => [k, ":", " ", ...[Array.isArray(v) ? v.flat() : v], ";"]).flat(),
          " ",
          "}"
        ];
      }
      if (signatures && signatures.length > 0) {
        const s = signatures[0];
        const params = (_a = s.parameters) == null ? void 0 : _a.flatMap((p) => `${p.name}: ${p.type ? parseTypes(p.type) : "unknown"}`);
        return ["(", ...params || ["...args", "unknown", "[", "]"], ")", " ", "=>", " ", ...s.type ? parseTypes(s.type) : ["unknown"]];
      }
      return ["{", "}"];
    }
    case "literal":
      return typeof t.value === "string" ? ["'", t.value, "'"] : [`${t.value}`];
    case "templateLiteral":
      return t.tail.map((tail) => `\`${t.head}${t.tail.length ? `\\\${${parseType(tail[0])}}\`` : ""}`);
    case "tuple":
      return ["[", ...((_b = t.elements) == null ? void 0 : _b.flatMap(parseTypes)) || [], "]"];
    case "typeOperator":
      return [t.operator, ...parseTypes(t.target)];
    case "union":
      return t.types.flatMap(parseTypes).filter((t2) => !!t2).flat(Infinity);
    case "query":
      return ["(", "typeof", " ", ...parseTypes(t.queryType), ")"];
    case "inferred":
    case "intrinsic":
    case "unknown":
      return [t.name];
    default:
      return ["any"];
  }
}
__name(parseTypes, "parseTypes");
function makeId(src, prefix) {
  src = src.replace(/ +/g, "-").replace(/#/g, "-").replace(/\</g, "-").replace(/\>/g, "-").replace(/\[/g, "-").replace(/\]/g, "-");
  return `${prefix || ""}${src}`;
}
__name(makeId, "makeId");

// src/serializers/ClassSerializer.ts
var ClassSerializer = class extends AbstractSerializer {
  constructor(declaration, config = {}) {
    super(declaration);
    this.declaration = declaration;
    this.config = config;
  }
  serialize() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w;
    const ctor = (_a = this.declaration.children) == null ? void 0 : _a.find((c) => {
      return c.kind === ReflectionKind.Constructor;
    });
    const properties = (_b = this.declaration.children) == null ? void 0 : _b.filter((c) => {
      return c.kind === ReflectionKind.Property || c.kind === ReflectionKind.Accessor;
    });
    const methods = (_c = this.declaration.children) == null ? void 0 : _c.filter((c) => {
      return c.kind === ReflectionKind.Method;
    });
    const ctorSig = (_d = ctor == null ? void 0 : ctor.signatures) == null ? void 0 : _d.find((r) => r.kind === ReflectionKind.ConstructorSignature);
    const vars = getVars(this.declaration);
    const description = getDescription(this.declaration, vars);
    const name = getName(this.declaration);
    return {
      name,
      abstract: this.declaration.flags.isAbstract || !!((_f = (_e = this.declaration.comment) == null ? void 0 : _e.blockTags) == null ? void 0 : _f.some((r) => r.tag === "@abstract")),
      constructor: ctor ? __spreadProps(__spreadValues({}, this.parseMethod(ctor)), {
        name: ((_g = ctorSig == null ? void 0 : ctorSig.type) == null ? void 0 : _g.name) || this.declaration.name || ctor.name,
        constructor: (ctorSig == null ? void 0 : ctorSig.name) || `new ${((_h = ctorSig == null ? void 0 : ctorSig.type) == null ? void 0 : _h.name) || this.declaration.name || ctor.name}`
      }) : null,
      metadata: getFileMetadata(this.declaration),
      deprecated: !!((_j = (_i = this.declaration.comment) == null ? void 0 : _i.blockTags) == null ? void 0 : _j.some((r) => r.tag === "@deprecated")),
      description,
      vars,
      extends: ((_k = this.declaration.extendedTypes) == null ? void 0 : _k.length) ? parseType(this.declaration.extendedTypes[0]) : null,
      implements: ((_l = this.declaration.implementedTypes) == null ? void 0 : _l.length) ? parseType(this.declaration.implementedTypes[0]) : null,
      rawExtends: ((_m = this.declaration.extendedTypes) == null ? void 0 : _m.length) ? parseTypes(this.declaration.extendedTypes[0]) : null,
      rawImplements: ((_n = this.declaration.implementedTypes) == null ? void 0 : _n.length) ? parseTypes(this.declaration.implementedTypes[0]) : null,
      methods: (methods == null ? void 0 : methods.map((m) => this.parseMethod(m))) || [],
      private: this.declaration.flags.isPrivate || !!((_p = (_o = this.declaration.comment) == null ? void 0 : _o.blockTags) == null ? void 0 : _p.some((r) => r.tag === "@private")),
      properties: (properties == null ? void 0 : properties.map((m) => this.parseProperties(m))) || [],
      configProperties: this.parseConfigProperties(name) || [],
      see: ((_t = (_s = (_r = (_q = this.declaration.comment) == null ? void 0 : _q.blockTags) == null ? void 0 : _r.find((r) => r.tag === "@see")) == null ? void 0 : _s.content) == null ? void 0 : _t.map((m) => seelink(m))) || [],
      fiddle: ((_w = (_v = (_u = this.declaration.comment) == null ? void 0 : _u.blockTags) == null ? void 0 : _v.filter((r) => r.tag === "@fiddle")) == null ? void 0 : _w.map((m) => fiddlelink(m))) || []
    };
  }
  parseConfigProperties(name) {
    const typedChartRegex = /Rc(?!Chart).*[Series|Gauge|Axis|Annotation](Group)?/;
    const [chart] = typedChartRegex.exec(name) || [];
    const key = name.slice(2);
    if (chart) {
      const { props, config: configs } = this.config[key] || {};
      const [config] = configs || [];
      const regex = /(\w+)\.(\w+)(?:\[(.*?)\])?(?:\s(.*))?/;
      const matches = config == null ? void 0 : config.match(regex);
      if (!matches || !matches.length) {
        return [];
      }
      const [_, _root, subname, options] = matches;
      const [_typeKey, chartType] = (options == null ? void 0 : options.split("=")) || [];
      return (props == null ? void 0 : props.map((p) => {
        var _a, _b, _c, _d;
        const sep = ((_a = p.dtype) == null ? void 0 : _a.kind) === ReflectionKind.Class ? "/" : "#";
        return __spreadProps(__spreadValues({}, p), {
          link: [subname, chartType].filter((v) => v).join("/") + sep + p.name.toLowerCase(),
          content: (_d = (_c = (_b = p.content) == null ? void 0 : _b.split(".").filter((c) => c).shift()) == null ? void 0 : _c.concat(".")) != null ? _d : ""
        });
      })) || [];
    }
    return [];
  }
  parseProperties(decl) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J;
    const vars = getVars(this.declaration);
    const description = getDescription(decl, vars);
    const base = {
      abstract: decl.flags.isAbstract || !!((_b = (_a = decl.comment) == null ? void 0 : _a.blockTags) == null ? void 0 : _b.some((r) => r.tag === "@abstract")),
      default: decl.defaultValue || ((_f = (_e = (_d = (_c = decl.comment) == null ? void 0 : _c.blockTags) == null ? void 0 : _d.find((r) => r.tag === "@default")) == null ? void 0 : _e.content) == null ? void 0 : _f[0].text) || null,
      deprecated: !!((_h = (_g = decl.comment) == null ? void 0 : _g.blockTags) == null ? void 0 : _h.some((r) => r.tag === "@deprecated")),
      description,
      metadata: getFileMetadata(decl),
      name: decl.name,
      private: decl.flags.isPrivate || !!((_j = (_i = decl.comment) == null ? void 0 : _i.blockTags) == null ? void 0 : _j.some((r) => r.tag === "@private")),
      readonly: decl.flags.isReadonly || !!((_l = (_k = decl.comment) == null ? void 0 : _k.blockTags) == null ? void 0 : _l.some((r) => r.tag === "@readonly")),
      see: ((_p = (_o = (_n = (_m = decl.comment) == null ? void 0 : _m.blockTags) == null ? void 0 : _n.find((r) => r.tag === "@see")) == null ? void 0 : _o.content) == null ? void 0 : _p.map((m) => seelink(m))) || [],
      fiddle: ((_s = (_r = (_q = decl.comment) == null ? void 0 : _q.blockTags) == null ? void 0 : _r.filter((r) => r.tag === "@fiddle")) == null ? void 0 : _s.map((m) => fiddlelink(m))) || [],
      vars,
      static: decl.flags.isStatic || !!((_u = (_t = decl.comment) == null ? void 0 : _t.blockTags) == null ? void 0 : _u.some((r) => r.tag === "@static")),
      type: decl.type ? parseType(decl.type) : "any"
    };
    if (decl.kind === ReflectionKind.Accessor) {
      const getter = decl.getSignature;
      if (!getter)
        throw new Error(`Accessor ${decl.name} does not have a getter`);
      const setter = decl.setSignature != null;
      if (!setter)
        base.readonly = true;
      return Object.assign(base, {
        abstract: getter.flags.isAbstract || ((_w = (_v = getter.comment) == null ? void 0 : _v.blockTags) == null ? void 0 : _w.some((r) => r.tag === "@abstract")),
        deprecated: (_y = (_x = getter.comment) == null ? void 0 : _x.blockTags) == null ? void 0 : _y.some((r) => r.tag === "@deprecated"),
        description: getDescription(getter, vars),
        metadata: getFileMetadata(getter),
        name: getter.name,
        private: getter.flags.isPrivate || ((_A = (_z = getter.comment) == null ? void 0 : _z.blockTags) == null ? void 0 : _A.some((r) => r.tag === "@private")),
        readonly: getter.flags.isReadonly || ((_C = (_B = getter.comment) == null ? void 0 : _B.blockTags) == null ? void 0 : _C.some((r) => r.tag === "@readonly")),
        see: (_E = (_D = getter.comment) == null ? void 0 : _D.blockTags) == null ? void 0 : _E.filter((r) => r.tag === "@see").map((m) => m.content.map((t) => seelink(t)).join("")),
        fiddle: ((_H = (_G = (_F = getter.comment) == null ? void 0 : _F.blockTags) == null ? void 0 : _G.filter((r) => r.tag === "@fiddle")) == null ? void 0 : _H.map((m) => fiddlelink(m))) || [],
        static: getter.flags.isStatic || ((_J = (_I = getter.comment) == null ? void 0 : _I.blockTags) == null ? void 0 : _J.some((r) => r.tag === "@static")),
        type: getter.type ? parseType(getter.type) : "any"
      });
    }
    return base;
  }
  parseMethod(decl) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t;
    const signature = ((_a = decl.signatures) == null ? void 0 : _a[0]) || decl;
    const description = getDescription(signature);
    return {
      name: decl.name,
      description,
      see: ((_c = (_b = signature.comment) == null ? void 0 : _b.blockTags) == null ? void 0 : _c.filter((r) => r.tag === "@see").map((t) => t.content.map((t2) => seelink(t2)).join(""))) || [],
      fiddle: ((_f = (_e = (_d = signature.comment) == null ? void 0 : _d.blockTags) == null ? void 0 : _e.filter((r) => r.tag === "@fiddle")) == null ? void 0 : _f.map((m) => fiddlelink(m))) || [],
      static: !!signature.flags.isStatic || !!decl.flags.isStatic,
      private: decl.flags.isPrivate || !!((_h = (_g = signature.comment) == null ? void 0 : _g.blockTags) == null ? void 0 : _h.filter((r) => r.tag === "@private").length),
      examples: ((_j = (_i = signature.comment) == null ? void 0 : _i.blockTags) == null ? void 0 : _j.filter((r) => r.tag === "@example").map((t) => t.content.map((t2) => t2.text).join(""))) || [],
      abstract: decl.flags.isAbstract || !!((_l = (_k = signature.comment) == null ? void 0 : _k.blockTags) == null ? void 0 : _l.some((r) => r.tag === "@abstract")),
      deprecated: !!((_n = (_m = signature.comment) == null ? void 0 : _m.blockTags) == null ? void 0 : _n.some((r) => r.tag === "@deprecated")),
      parameters: ((_o = signature.parameters) == null ? void 0 : _o.map((m) => this.parseParameter(m))) || ((_p = decl.parameters || decl.typeParameters) == null ? void 0 : _p.map((m) => this.parseParameter(m))) || [],
      returns: {
        type: signature.type ? parseType(signature.type) : "any",
        rawType: signature.type ? parseTypes(signature.type) : ["any"],
        description: ((_t = (_s = (_r = (_q = signature.comment) == null ? void 0 : _q.blockTags) == null ? void 0 : _r.find((r) => r.tag === "@returns")) == null ? void 0 : _s.content) == null ? void 0 : _t.map(getDocLinkedDesc).join("")) || null
      },
      metadata: getFileMetadata(decl)
    };
  }
  parseParameter(decl) {
    var _a, _b, _c, _d, _e, _f;
    return {
      name: decl.name,
      description: ((_b = (_a = decl.comment) == null ? void 0 : _a.summary) == null ? void 0 : _b.map(getDocLinkedDesc).join("").trim()) || null,
      optional: !!decl.flags.isOptional,
      default: ((_c = decl.default) == null ? void 0 : _c.name) || ((_f = (_e = (_d = decl.comment) == null ? void 0 : _d.blockTags) == null ? void 0 : _e.find((r) => r.tag === "@default")) == null ? void 0 : _f.content[0].text) || decl.defaultValue || null,
      type: decl.type ? parseType(decl.type) : "any",
      rawType: decl.type ? parseTypes(decl.type) : ["any"]
    };
  }
};
__name(ClassSerializer, "ClassSerializer");

// src/serializers/TypesSerializer.ts
import { ReflectionKind as ReflectionKind2 } from "typedoc";
var TypesSerializer = class extends AbstractSerializer {
  serialize() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
    const base = {
      deprecated: !!((_b = (_a = this.declaration.comment) == null ? void 0 : _a.blockTags) == null ? void 0 : _b.some((r) => r.tag === "@deprecated")),
      description: ((_d = (_c = this.declaration.comment) == null ? void 0 : _c.summary) == null ? void 0 : _d.map((t) => t.text).join("")) || null,
      metadata: getFileMetadata(this.declaration),
      name: getName(this.declaration),
      parameters: [],
      private: !!this.declaration.flags.isPrivate,
      properties: [],
      returns: null,
      see: ((_h = (_g = (_f = (_e = this.declaration.comment) == null ? void 0 : _e.blockTags) == null ? void 0 : _f.find((r) => r.tag === "@see")) == null ? void 0 : _g.content) == null ? void 0 : _h.map((m) => m.text)) || [],
      fiddle: ((_k = (_j = (_i = this.declaration.comment) == null ? void 0 : _i.blockTags) == null ? void 0 : _j.filter((r) => r.tag === "@fiddle")) == null ? void 0 : _k.map((m) => fiddlelink(m))) || [],
      type: this.declaration.type ? parseType(this.declaration.type) : "any"
    };
    if (this.declaration.kind === ReflectionKind2.Enum || this.declaration.kind === ReflectionKind2.Interface) {
      if (this.declaration.children) {
        base.properties = this.declaration.children.map((m) => {
          var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2, _i2, _j2, _k2, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C;
          if (((_a2 = m.type) == null ? void 0 : _a2.type) !== "reflection")
            return {
              name: m.name,
              description: ((_c2 = (_b2 = m.comment) == null ? void 0 : _b2.summary) == null ? void 0 : _c2.map((t) => t.text).join("")) || null,
              value: m.defaultValue || null,
              abstract: !!m.flags.isAbstract,
              default: m.defaultValue || null,
              deprecated: !!((_e2 = (_d2 = m.comment) == null ? void 0 : _d2.blockTags) == null ? void 0 : _e2.some((r) => r.tag === "@deprecated")),
              metadata: getFileMetadata(m),
              private: !!m.flags.isPrivate,
              readonly: !!m.flags.isReadonly,
              see: ((_i2 = (_h2 = (_g2 = (_f2 = this.declaration.comment) == null ? void 0 : _f2.blockTags) == null ? void 0 : _g2.find((r) => r.tag === "@see")) == null ? void 0 : _h2.content) == null ? void 0 : _i2.map((m2) => m2.text)) || [],
              fiddle: ((_l = (_k2 = (_j2 = this.declaration.comment) == null ? void 0 : _j2.blockTags) == null ? void 0 : _k2.filter((r) => r.tag === "@fiddle")) == null ? void 0 : _l.map((m2) => fiddlelink(m2))) || [],
              static: !!m.flags.isStatic,
              type: m.type ? parseType(m.type) : "any",
              rawType: m.type ? parseTypes(m.type) : ["any"]
            };
          return {
            name: m.name,
            description: ((_s = ((_q = (_p = (_o = (_n = (_m = m.type) == null ? void 0 : _m.declaration) == null ? void 0 : _n.signatures) == null ? void 0 : _o[0]) == null ? void 0 : _p.comment) == null ? void 0 : _q.summary) || ((_r = m.comment) == null ? void 0 : _r.summary)) == null ? void 0 : _s.map((t) => t.text).join("")) || null,
            value: m.defaultValue || null,
            abstract: !!m.flags.isAbstract,
            default: m.defaultValue || null,
            deprecated: !!((_u = (_t = m.comment) == null ? void 0 : _t.blockTags) == null ? void 0 : _u.some((r) => r.tag === "@deprecated")),
            metadata: getFileMetadata(((_v = m.type) == null ? void 0 : _v.declaration) || m),
            private: !!m.flags.isPrivate,
            readonly: !!m.flags.isReadonly,
            see: ((_z = (_y = (_x = (_w = this.declaration.comment) == null ? void 0 : _w.blockTags) == null ? void 0 : _x.find((r) => r.tag === "@see")) == null ? void 0 : _y.content) == null ? void 0 : _z.map((m2) => m2.text)) || [],
            fiddle: ((_C = (_B = (_A = this.declaration.comment) == null ? void 0 : _A.blockTags) == null ? void 0 : _B.filter((r) => r.tag === "@fiddle")) == null ? void 0 : _C.map((m2) => fiddlelink(m2))) || [],
            static: !!m.flags.isStatic,
            type: m.type ? parseType(m.type) : "any",
            rawType: m.type ? parseTypes(m.type) : ["any"]
          };
        });
      }
    }
    return base;
  }
};
__name(TypesSerializer, "TypesSerializer");

// src/serializers/FunctionSerializer.ts
var FunctionSerializer = class extends AbstractSerializer {
  serialize() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t;
    const decl = this.declaration;
    const signature = ((_a = decl.signatures) == null ? void 0 : _a[0]) || decl;
    const vars = getVars(this.declaration);
    const description = getDescription(signature, vars);
    return {
      name: decl.name,
      description,
      see: ((_c = (_b = signature.comment) == null ? void 0 : _b.blockTags) == null ? void 0 : _c.filter((r) => r.tag === "@see").map((t) => t.content.map((t2) => t2.text).join(""))) || [],
      fiddle: ((_f = (_e = (_d = signature.comment) == null ? void 0 : _d.blockTags) == null ? void 0 : _e.filter((r) => r.tag === "@fiddle")) == null ? void 0 : _f.map((m) => fiddlelink(m))) || [],
      static: !!signature.flags.isStatic || !!decl.flags.isStatic,
      private: decl.flags.isPrivate || !!((_h = (_g = signature.comment) == null ? void 0 : _g.blockTags) == null ? void 0 : _h.filter((r) => r.tag === "@private").length),
      examples: ((_j = (_i = signature.comment) == null ? void 0 : _i.blockTags) == null ? void 0 : _j.filter((r) => r.tag === "@example").map((t) => t.content.map((t2) => t2.text).join(""))) || [],
      abstract: decl.flags.isAbstract || !!((_l = (_k = signature.comment) == null ? void 0 : _k.blockTags) == null ? void 0 : _l.some((r) => r.tag === "@abstract")),
      deprecated: !!((_n = (_m = signature.comment) == null ? void 0 : _m.blockTags) == null ? void 0 : _n.some((r) => r.tag === "@deprecated")),
      parameters: ((_o = signature.parameters) == null ? void 0 : _o.map((m) => this.parseParameter(m))) || ((_p = decl.parameters || decl.typeParameters) == null ? void 0 : _p.map((m) => this.parseParameter(m))) || [],
      returns: {
        type: signature.type ? parseType(signature.type) : "any",
        rawType: signature.type ? parseTypes(signature.type) : ["any"],
        description: ((_t = (_s = (_r = (_q = signature.comment) == null ? void 0 : _q.blockTags) == null ? void 0 : _r.find((r) => r.tag === "@returns")) == null ? void 0 : _s.content) == null ? void 0 : _t.map((t) => t.text).join("")) || null
      },
      metadata: getFileMetadata(decl)
    };
  }
  parseParameter(decl) {
    var _a, _b, _c, _d, _e, _f;
    return {
      name: decl.name,
      description: ((_b = (_a = decl.comment) == null ? void 0 : _a.summary) == null ? void 0 : _b.map(getDocLinkedDesc).join("").trim()) || null,
      optional: !!decl.flags.isOptional,
      default: ((_c = decl.default) == null ? void 0 : _c.name) || ((_f = (_e = (_d = decl.comment) == null ? void 0 : _d.blockTags) == null ? void 0 : _e.find((r) => r.tag === "@default")) == null ? void 0 : _f.content[0].text) || null,
      type: decl.type ? parseType(decl.type) : "any",
      rawType: decl.type ? parseTypes(decl.type) : ["any"]
    };
  }
};
__name(FunctionSerializer, "FunctionSerializer");

// src/TypeDocNextra.ts
var TypeDocNextra = class {
  constructor(options) {
    this.options = options;
    this.linker = this.options.linker;
  }
  // [
  //     ' - ',
  //     '[Factorial - Wikipedia](https://en.wikipedia.org/wiki/Factorial)',
  //     '\n',
  //     ' - ',
  //     'semifactorial',
  //     '\n',
  // ]
  getSee(see) {
    return (see == null ? void 0 : see.length) ? `
${heading("See Also", 3)}
${see.map((s, i) => i % 3 == 1 ? heading(s, 4) : s).join("")}` : "";
  }
  getClassHeading(c) {
    const exts = c.extends ? `${heading("Extends", 3)}
${"- " + hyperlink(c.extends, "../classes/" + c.extends)}` : "";
    const imps = c.implements ? `${heading("Implements", 3)}
${"- " + hyperlink(c.implements, "../classes/" + c.implements)}` : "";
    return [
      heading(escape(c.name), 2),
      exts,
      imps,
      c.description ? `
${c.description}
` : "",
      this.getSee(c.see),
      c.fiddle.join(" ")
    ].map((v) => v == null ? void 0 : v.trim()).filter((v) => v).join("\n\r");
  }
  getCtor(c) {
    if (!c)
      return "";
    const ctor = codeBlock(
      `${escape(c.constructor)}(${c.parameters.filter((p) => !p.name.includes(".")).map((m) => m.name).join(", ")})`,
      "typescript"
    );
    if (c.parameters.length) {
      const tableHead = [
        "Parameter",
        "Type"
        // 'Optional',
      ];
      if (c.parameters.some((p) => p.description && p.description.trim().length > 0))
        tableHead.push("Description");
      const tableBody = c.parameters.map((m) => {
        const params = [
          escape(m.name),
          this.linker(m.type || "any", [m.type || "any"])
          // m.optional ? '✅' : '❌',
        ];
        if (tableHead.includes("Description"))
          params.push(m.description || "N/A");
        return params;
      });
      return `
${ctor}
${table(tableHead, tableBody)}
`;
    }
    return `
${ctor}
`;
  }
  transformClass(classes) {
    return classes.map((c) => {
      return {
        name: c.name,
        metadata: c.metadata,
        content: this.getMarkdown(c)
      };
    });
  }
  transformFunctions(types) {
    return types.map((t) => {
      return {
        name: t.name,
        metadata: t.metadata,
        content: this.getFunctions(t)
      };
    });
  }
  transformTypes(types) {
    return types.map((t) => {
      return {
        name: t.name,
        metadata: t.metadata,
        content: this.getTypeMarkdown(t)
      };
    });
  }
  getTypeMarkdown(t) {
    var _a;
    return [
      heading(escape(t.name), 2),
      t.description ? "\n" + t.description : "",
      t.deprecated ? `
- ${bold("\u26A0\uFE0F Deprecated")}` : "",
      t.properties.length ? (() => {
        const tableHead = ["Property", "Type", "Value"];
        if (t.properties.some((p) => p.description && p.description.trim().length > 0))
          tableHead.push("Description");
        const tableBody = t.properties.map((n) => {
          const params = [escape(n.name), this.linker(n.type || "any", [n.type || "any"]), escape(n.value || "N/A")];
          if (tableHead.includes("Description"))
            params.push(n.description || "N/A");
          return params;
        });
        return `
${table(tableHead, tableBody)}
`;
      })() : t.type ? `
- Type: ${this.linker(t.type, [t.type])}` : "",
      ((_a = t.metadata) == null ? void 0 : _a.url) ? `
- ${hyperlink("Source", t.metadata.url)}` : ""
    ].filter((r) => r.length > 0).join("\n").trim();
  }
  getMarkdown(c) {
    return [this.getClassHeading(c), this.getCtor(c.constructor), this.getConfigProperties(c.configProperties), this.getProperties(c.properties), this.getMethods(c.methods)].join("\n\n");
  }
  // config props를 테이블로 표현
  getConfigProperties(properties) {
    if (!properties.length)
      return "";
    const head = heading("Config Properties", 2);
    const cols = ["Name", "Type", "Description"];
    const tableCols = ["", ...cols, ""].join(" | ");
    const seperator = ["", ...Array(cols.length).fill("---"), ""].join(" | ");
    const tableHead = [tableCols, seperator].join("  \n");
    const tableBody = properties.map((p) => {
      var _a;
      const pname = escape(p.name).trim();
      const ptype = (p.type || p.dtype.name).replace(/\|/g, "\\|");
      const desc = ((_a = p.content) == null ? void 0 : _a.replace(/\n/g, " ").trim()) || "";
      return ["", `[${pname}](/config/config/${p.link})`, `\`${ptype}{:js}\``, desc, ""].join(" | ");
    });
    return `${head}
${tableHead}
${tableBody.join("  \n")}`.trim();
  }
  getProperties(properties) {
    if (!properties.length)
      return "";
    const head = heading("Properties", 2);
    const body = properties.map((m) => {
      var _a;
      const ename = escape(m.name);
      const name = `${m.static ? "static " : ""}${m.readonly ? "*`<readonly>`* " : ""}${ename}`.trim();
      const title = heading(`${name}: ${this.linker(m.type || "any", m.rawType || [m.type || "any"])}`, 3) + `[#${ename}]`;
      const desc = [m.description || "", m.deprecated ? `
- ${bold("\u26A0\uFE0F Deprecated")}` : "", ((_a = m.metadata) == null ? void 0 : _a.url) ? `
- ${hyperlink("Source", m.metadata.url)}` : ""].filter((r) => r.length > 0).join("\n").trim();
      return [
        title,
        desc,
        this.getSee(m.see),
        m.fiddle.join(" ")
      ].map((v) => v == null ? void 0 : v.trim()).filter((v) => v).join("\n");
    });
    return `${head}
${body.join("\n")}`;
  }
  getMethods(methods) {
    if (!methods.length)
      return "";
    const head = heading("Methods", 2);
    const body = methods.map((m) => {
      var _a, _b;
      const ename = escape(m.name);
      const name = `${m.static ? "static " : ""}${ename}(${m.parameters.filter((r) => !r.name.includes(".")).map((m2) => {
        return `${m2.name}${m2.optional ? "?" : ""}`;
      }).join(", ")})`.trim();
      const title = heading(`${name}: ${((_a = m.returns) == null ? void 0 : _a.type) ? `${this.linker(m.returns.type || "any", m.returns.rawType || ["any"])}` : "any"}`, 3) + `[#${ename}]`;
      const desc = [
        m.description || "",
        m.deprecated ? `
- ${bold("\u26A0\uFE0F Deprecated")}` : "",
        m.examples ? "\n" + m.examples.map((m2) => m2.includes("```") ? m2 : codeBlock(m2, "typescript")).join("\n\n") : "",
        m.parameters.length ? (() => {
          const tableHead = [
            "Parameter",
            "Type"
            // 'Optional',
          ];
          if (m.parameters.some((p) => p.description && p.description.trim().length > 0))
            tableHead.push("Description");
          const tableBody = m.parameters.map((n) => {
            const params = [
              n.default ? `${escape(n.name)}=${code(n.default)}` : escape(n.name),
              this.linker(n.type || "any", n.rawType || [n.type || "any"])
              //   n.optional ? '✅' : '❌'
            ];
            if (tableHead.includes("Description"))
              params.push(n.description || "N/A");
            return params;
          });
          return `
${table(tableHead, tableBody)}
`;
        })() : "",
        ((_b = m.metadata) == null ? void 0 : _b.url) ? `
- ${hyperlink("Source", m.metadata.url)}` : ""
      ].filter((r) => r.length > 0).join("\n").trim();
      return [
        title,
        desc,
        this.getSee(m.see),
        m.fiddle.join(" ")
      ].map((v) => v.trim()).filter((v) => v).join("\n");
    });
    return `${head}
${body.join("\n")}`;
  }
  getFunctions(m) {
    var _a, _b;
    const ename = escape(m.name);
    const name = `${ename}(${m.parameters.filter((r) => !r.name.includes(".")).map((m2) => {
      return `${m2.name}${m2.optional ? "?" : ""}`;
    }).join(", ")})`.trim();
    const title = heading(`${name}: ${((_a = m.returns) == null ? void 0 : _a.type) ? `${this.linker(m.returns.type || "any", m.returns.rawType || ["any"])}` : "any"}`, 3) + `[#${ename}]`;
    const desc = [
      m.description || "",
      m.deprecated ? `
- ${bold("\u26A0\uFE0F Deprecated")}` : "",
      m.examples ? "\n" + m.examples.map((m2) => m2.includes("```") ? m2 : codeBlock(m2, "typescript")).join("\n\n") : "",
      m.parameters.length ? (() => {
        const tableHead = [
          "Parameter",
          "Type"
          // 'Optional',
        ];
        if (m.parameters.some((p) => p.description && p.description.trim().length > 0))
          tableHead.push("Description");
        const tableBody = m.parameters.map((n) => {
          const params = [
            n.default ? `${escape(n.name)}=${code(n.default)}` : escape(n.name),
            this.linker(n.type || "any", n.rawType || [n.type || "any"])
            // n.optional ? '✅' : '❌',
          ];
          if (tableHead.includes("Description"))
            params.push(n.description || "N/A");
          return params;
        });
        return `
${table(tableHead, tableBody)}
`;
      })() : "",
      ((_b = m.metadata) == null ? void 0 : _b.url) ? `
- ${hyperlink("Source", m.metadata.url)}` : ""
    ].filter((r) => r.length > 0).join("\n").trim();
    return `${title}
${desc}`;
  }
};
__name(TypeDocNextra, "TypeDocNextra");

// src/index.ts
import { existsSync } from "fs";
function createDocumentation(options) {
  return __async(this, null, function* () {
    var _a, _b, _c;
    let data = void 0;
    let config = {};
    (_a = options.noLinkTypes) != null ? _a : options.noLinkTypes = false;
    (_b = options.links) != null ? _b : options.links = DefaultLinksFactory;
    const start = performance.now();
    if (options.jsonInputPath) {
      data = JSON.parse(yield readFile(options.jsonInputPath, "utf-8"));
    } else if (options.input) {
      const app = yield TypeDoc.Application.bootstrap({
        plugin: [],
        entryPoints: options.input,
        tsconfig: options.tsconfigPath
      });
      const tmpOutputPath = path3.join(tmp.dirSync().name, "project-reflection.json");
      app.options.addReader(new TypeDoc.TSConfigReader());
      app.options.addReader(new TypeDoc.TypeDocReader());
      const _proj = yield app.convert();
      if (_proj) {
        yield app.generateJson(_proj, tmpOutputPath);
        data = JSON.parse(yield readFile(tmpOutputPath, "utf-8"));
      }
    }
    if (!data && !((_c = options.custom) == null ? void 0 : _c.length)) {
      throw new Error("No input files to process");
    }
    if (options.configInputPath) {
      config = JSON.parse(yield readFile(options.configInputPath, "utf-8"));
    }
    const doc = {
      custom: {},
      modules: {},
      metadata: {
        generationMs: 0,
        timestamp: 0
      }
    };
    const modules = (() => {
      var _a2, _b2;
      if ((data == null ? void 0 : data.kind) === TypeDoc.ReflectionKind.Project) {
        const childs = (_a2 = data.children) == null ? void 0 : _a2.filter((r) => r.kind === TypeDoc.ReflectionKind.Module);
        if (!(childs == null ? void 0 : childs.length))
          return [data];
        return childs;
      }
      return (_b2 = data == null ? void 0 : data.children) == null ? void 0 : _b2.filter((r) => r.kind === TypeDoc.ReflectionKind.Module);
    })();
    const mdTransformer = new TypeDocNextra({
      links: options.links,
      linker: (t, r) => {
        const { noLinkTypes = false, links = {} } = options;
        if (noLinkTypes)
          return escape(t);
        const linkKeys = Object.entries(links);
        const linkTypes = /* @__PURE__ */ __name((type) => {
          var _a2;
          type = escape(type);
          for (const [li, val] of linkKeys) {
            if (li.toLowerCase() === type.toLowerCase()) {
              const hyl = hyperlink(type, val);
              return hyl;
            }
          }
          const isClass = (_a2 = data == null ? void 0 : data.children) == null ? void 0 : _a2.some((c) => c.name.toLowerCase() === type.toLowerCase());
          return isClass ? hyperlink(type, `../classes/${type}`) : type;
        }, "linkTypes");
        const linked = r.map((p) => linkTypes(p)).join(" &#124; ");
        return linked;
      }
    });
    if (Array.isArray(modules)) {
      modules.forEach((mod) => {
        var _a2, _b2, _c2, _d;
        if (!mod.children)
          return;
        (_c2 = (_a2 = doc.modules)[_b2 = mod.name]) != null ? _c2 : _a2[_b2] = {
          classes: [],
          functions: [],
          name: mod.name,
          types: []
        };
        const currentModule = doc.modules[mod.name];
        (_d = mod.children) == null ? void 0 : _d.forEach((child) => {
          switch (child.kind) {
            case TypeDoc.ReflectionKind.Class:
              {
                const classSerializer = new ClassSerializer(child, config);
                const serialized = classSerializer.serialize();
                currentModule.classes.push({
                  data: serialized,
                  markdown: options.markdown ? mdTransformer.transformClass([serialized]) : []
                });
              }
              break;
            case TypeDoc.ReflectionKind.Interface:
            case TypeDoc.ReflectionKind.TypeAlias:
            case TypeDoc.ReflectionKind.Enum:
              {
                const typesSerializer = new TypesSerializer(child);
                const serialized = typesSerializer.serialize();
                currentModule.types.push({
                  data: serialized,
                  markdown: options.markdown ? mdTransformer.transformTypes([serialized]) : []
                });
              }
              break;
            case TypeDoc.ReflectionKind.Function:
              {
                const functionsSerializer = new FunctionSerializer(child);
                const serialized = functionsSerializer.serialize();
                currentModule.functions.push({
                  data: serialized,
                  markdown: options.markdown ? mdTransformer.transformFunctions([serialized]) : []
                });
              }
              break;
            default:
              break;
          }
        });
      });
    }
    if (Array.isArray(options.custom) && options.custom.length > 0) {
      yield Promise.all(
        options.custom.map((m) => __async(this, null, function* () {
          const cat = doc.custom[m.category || "Custom"];
          if (!cat)
            doc.custom[m.category || "Custom"] = [];
          doc.custom[m.category || "Custom"].push({
            category: m.category || "Custom",
            name: m.name,
            path: m.path,
            type: m.type,
            content: yield readFile(m.path, "utf-8")
          });
        }))
      );
    }
    doc.metadata = {
      generationMs: performance.now() - start,
      timestamp: Date.now()
    };
    if (options.print)
      console.log(doc);
    if (!options.noEmit) {
      if (!options.output)
        throw new Error("Output path was not specified");
      if (options.jsonName) {
        const docStr = JSON.stringify(doc, null, options.spaces || 0);
        yield writeFile(path3.join(options.output, options.jsonName), docStr);
      }
      if (options.markdown) {
        for (const moduleIdx in doc.modules) {
          const module = doc.modules[moduleIdx];
          yield Promise.all([
            ...module.classes.flatMap((cl) => {
              return cl.markdown.map((md) => __async(this, null, function* () {
                const classPath = path3.join(options.output, "classes", module.name);
                if (!existsSync(classPath))
                  yield mkdir(classPath, {
                    recursive: true
                  });
                yield writeFile(path3.join(classPath, `${md.name}.${options.extension || "mdx"}`), md.content);
              }));
            }),
            ...module.types.flatMap((cl) => {
              return cl.markdown.map((md) => __async(this, null, function* () {
                const typesPath = path3.join(options.output, "types", module.name);
                if (!existsSync(typesPath))
                  yield mkdir(typesPath, {
                    recursive: true
                  });
                yield writeFile(path3.join(typesPath, `${md.name}.${options.extension || "mdx"}`), md.content);
              }));
            }),
            ...module.functions.flatMap((cl) => {
              return cl.markdown.map((md) => __async(this, null, function* () {
                const funcsPath = path3.join(options.output, "functions", module.name);
                if (!existsSync(funcsPath))
                  yield mkdir(funcsPath, {
                    recursive: true
                  });
                yield writeFile(path3.join(funcsPath, `${md.name}.${options.extension || "mdx"}`), md.content);
              }));
            })
          ]);
        }
        for (const fileIdx in doc.custom) {
          const file = doc.custom[fileIdx];
          yield Promise.all(
            file.map((m) => __async(this, null, function* () {
              const catPath = path3.join(options.output, path3.normalize(m.category));
              if (!existsSync(catPath))
                yield mkdir(catPath, {
                  recursive: true
                });
              yield writeFile(path3.join(catPath, `${m.name}${m.type || path3.extname(m.path)}`), m.content);
            }))
          );
        }
      }
    }
    return doc;
  });
}
__name(createDocumentation, "createDocumentation");
var src_default = createDocumentation;
export {
  AbstractSerializer,
  ClassSerializer,
  FunctionSerializer,
  TypeDocNextra,
  TypesSerializer,
  blockquote,
  bold,
  code,
  codeBlock,
  createDocumentation,
  src_default as default,
  doclink,
  escape,
  fiddlelink,
  getDescription,
  getDocLinkedDesc,
  getFileMetadata,
  getName,
  getVars,
  heading,
  headingId,
  highlight,
  hr,
  hyperlink,
  image,
  italic,
  makeId,
  ol,
  parseType,
  parseTypes,
  seelink,
  strikethrough,
  subscript,
  superscript,
  table,
  taskList,
  ul
};
