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
import path2 from "path";

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
import path from "path";
function getName(decl) {
  var _a;
  return decl.name === "default" ? path.parse(((_a = getFileMetadata(decl)) == null ? void 0 : _a.name) || "default").name : decl.name;
}
__name(getName, "getName");
function getFileMetadata(decl) {
  var _a;
  const src = (_a = decl.sources) == null ? void 0 : _a[0];
  if (!src)
    return null;
  return {
    name: path.basename(src.fileName),
    directory: path.dirname(src.fileName),
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

// src/utils/md.ts
import { stripIndents } from "common-tags";
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

// src/serializers/ClassSerializer.ts
var ClassSerializer = class extends AbstractSerializer {
  serialize() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t;
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
    return {
      name: getName(this.declaration),
      abstract: this.declaration.flags.isAbstract || !!((_f = (_e = this.declaration.comment) == null ? void 0 : _e.blockTags) == null ? void 0 : _f.some((r) => r.tag === "@abstract")),
      constructor: ctor ? __spreadProps(__spreadValues({}, this.parseMethod(ctor)), {
        name: ((_g = ctorSig == null ? void 0 : ctorSig.type) == null ? void 0 : _g.name) || this.declaration.name || ctor.name,
        constructor: (ctorSig == null ? void 0 : ctorSig.name) || `new ${((_h = ctorSig == null ? void 0 : ctorSig.type) == null ? void 0 : _h.name) || this.declaration.name || ctor.name}`
      }) : null,
      metadata: getFileMetadata(this.declaration),
      deprecated: !!((_j = (_i = this.declaration.comment) == null ? void 0 : _i.blockTags) == null ? void 0 : _j.some((r) => r.tag === "@deprecated")),
      description: ((_l = (_k = this.declaration.comment) == null ? void 0 : _k.summary) == null ? void 0 : _l.map((t) => t.text).join("")) || null,
      extends: ((_m = this.declaration.extendedTypes) == null ? void 0 : _m.length) ? parseType(this.declaration.extendedTypes[0]) : null,
      implements: ((_n = this.declaration.implementedTypes) == null ? void 0 : _n.length) ? parseType(this.declaration.implementedTypes[0]) : null,
      rawExtends: ((_o = this.declaration.extendedTypes) == null ? void 0 : _o.length) ? parseTypes(this.declaration.extendedTypes[0]) : null,
      rawImplements: ((_p = this.declaration.implementedTypes) == null ? void 0 : _p.length) ? parseTypes(this.declaration.implementedTypes[0]) : null,
      methods: (methods == null ? void 0 : methods.map((m) => this.parseMethod(m))) || [],
      private: this.declaration.flags.isPrivate || !!((_r = (_q = this.declaration.comment) == null ? void 0 : _q.blockTags) == null ? void 0 : _r.some((r) => r.tag === "@private")),
      properties: (properties == null ? void 0 : properties.map((m) => this.parseProperties(m))) || [],
      see: ((_t = (_s = this.declaration.comment) == null ? void 0 : _s.blockTags) == null ? void 0 : _t.filter((r) => r.tag === "@see").map((m) => {
        var _a2;
        return (_a2 = m.content) == null ? void 0 : _a2[0].text;
      })) || []
    };
  }
  parseProperties(decl) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F;
    const base = {
      abstract: decl.flags.isAbstract || !!((_b = (_a = decl.comment) == null ? void 0 : _a.blockTags) == null ? void 0 : _b.some((r) => r.tag === "@abstract")),
      default: decl.defaultValue || ((_f = (_e = (_d = (_c = decl.comment) == null ? void 0 : _c.blockTags) == null ? void 0 : _d.find((r) => r.tag === "@default")) == null ? void 0 : _e.content) == null ? void 0 : _f[0].text) || null,
      deprecated: !!((_h = (_g = decl.comment) == null ? void 0 : _g.blockTags) == null ? void 0 : _h.some((r) => r.tag === "@deprecated")),
      description: ((_j = (_i = decl.comment) == null ? void 0 : _i.summary) == null ? void 0 : _j.map((t) => t.text).join("")) || null,
      metadata: getFileMetadata(decl),
      name: decl.name,
      private: decl.flags.isPrivate || !!((_l = (_k = decl.comment) == null ? void 0 : _k.blockTags) == null ? void 0 : _l.some((r) => r.tag === "@private")),
      readonly: decl.flags.isReadonly || !!((_n = (_m = decl.comment) == null ? void 0 : _m.blockTags) == null ? void 0 : _n.some((r) => r.tag === "@readonly")),
      see: ((_p = (_o = decl.comment) == null ? void 0 : _o.blockTags) == null ? void 0 : _p.filter((r) => r.tag === "@see").map((m) => m.content[0].text)) || [],
      static: decl.flags.isStatic || !!((_r = (_q = decl.comment) == null ? void 0 : _q.blockTags) == null ? void 0 : _r.some((r) => r.tag === "@static")),
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
        abstract: getter.flags.isAbstract || ((_t = (_s = getter.comment) == null ? void 0 : _s.blockTags) == null ? void 0 : _t.some((r) => r.tag === "@abstract")),
        deprecated: (_v = (_u = getter.comment) == null ? void 0 : _u.blockTags) == null ? void 0 : _v.some((r) => r.tag === "@deprecated"),
        description: (_x = (_w = getter.comment) == null ? void 0 : _w.summary) == null ? void 0 : _x.map((t) => t.text).join(""),
        metadata: getFileMetadata(getter),
        name: getter.name,
        private: getter.flags.isPrivate || ((_z = (_y = getter.comment) == null ? void 0 : _y.blockTags) == null ? void 0 : _z.some((r) => r.tag === "@private")),
        readonly: getter.flags.isReadonly || ((_B = (_A = getter.comment) == null ? void 0 : _A.blockTags) == null ? void 0 : _B.some((r) => r.tag === "@readonly")),
        see: (_D = (_C = getter.comment) == null ? void 0 : _C.blockTags) == null ? void 0 : _D.filter((r) => r.tag === "@see").map((m) => m.content.map((t) => t.text).join("")),
        static: getter.flags.isStatic || ((_F = (_E = getter.comment) == null ? void 0 : _E.blockTags) == null ? void 0 : _F.some((r) => r.tag === "@static")),
        type: getter.type ? parseType(getter.type) : "any"
      });
    }
    return base;
  }
  parseMethod(decl) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s;
    const signature = ((_a = decl.signatures) == null ? void 0 : _a[0]) || decl;
    return {
      name: decl.name,
      description: ((_c = (_b = signature.comment) == null ? void 0 : _b.summary) == null ? void 0 : _c.map((t) => t.text).join("")) || null,
      see: ((_e = (_d = signature.comment) == null ? void 0 : _d.blockTags) == null ? void 0 : _e.filter((r) => r.tag === "@see").map((t) => t.content.map((t2) => t2.text).join(""))) || [],
      static: !!signature.flags.isStatic || !!decl.flags.isStatic,
      private: decl.flags.isPrivate || !!((_g = (_f = signature.comment) == null ? void 0 : _f.blockTags) == null ? void 0 : _g.filter((r) => r.tag === "@private").length),
      examples: ((_i = (_h = signature.comment) == null ? void 0 : _h.blockTags) == null ? void 0 : _i.filter((r) => r.tag === "@example").map((t) => t.content.map((t2) => t2.text).join(""))) || [],
      abstract: decl.flags.isAbstract || !!((_k = (_j = signature.comment) == null ? void 0 : _j.blockTags) == null ? void 0 : _k.some((r) => r.tag === "@abstract")),
      deprecated: !!((_m = (_l = signature.comment) == null ? void 0 : _l.blockTags) == null ? void 0 : _m.some((r) => r.tag === "@deprecated")),
      parameters: ((_n = signature.parameters) == null ? void 0 : _n.map((m) => this.parseParameter(m))) || ((_o = decl.parameters || decl.typeParameters) == null ? void 0 : _o.map((m) => this.parseParameter(m))) || [],
      returns: {
        type: signature.type ? parseType(signature.type) : "any",
        rawType: signature.type ? parseTypes(signature.type) : ["any"],
        description: ((_s = (_r = (_q = (_p = signature.comment) == null ? void 0 : _p.blockTags) == null ? void 0 : _q.find((r) => r.tag === "@returns")) == null ? void 0 : _r.content) == null ? void 0 : _s.map((t) => t.text).join("")) || null
      },
      metadata: getFileMetadata(decl)
    };
  }
  parseParameter(decl) {
    var _a, _b, _c, _d, _e, _f;
    return {
      name: decl.name,
      description: ((_b = (_a = decl.comment) == null ? void 0 : _a.summary) == null ? void 0 : _b.map((t) => t.text).join("").trim()) || null,
      optional: !!decl.flags.isOptional,
      default: ((_c = decl.default) == null ? void 0 : _c.name) || ((_f = (_e = (_d = decl.comment) == null ? void 0 : _d.blockTags) == null ? void 0 : _e.find((r) => r.tag === "@default")) == null ? void 0 : _f.content[0].text) || null,
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
    var _a, _b, _c, _d;
    const base = {
      deprecated: !!((_b = (_a = this.declaration.comment) == null ? void 0 : _a.blockTags) == null ? void 0 : _b.some((r) => r.tag === "@deprecated")),
      description: ((_d = (_c = this.declaration.comment) == null ? void 0 : _c.summary) == null ? void 0 : _d.map((t) => t.text).join("")) || null,
      metadata: getFileMetadata(this.declaration),
      name: getName(this.declaration),
      parameters: [],
      private: !!this.declaration.flags.isPrivate,
      properties: [],
      returns: null,
      see: [],
      type: this.declaration.type ? parseType(this.declaration.type) : "any"
    };
    if (this.declaration.kind === ReflectionKind2.Enum || this.declaration.kind === ReflectionKind2.Interface) {
      if (this.declaration.children) {
        base.properties = this.declaration.children.map((m) => {
          var _a2, _b2, _c2, _d2, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w;
          if (((_a2 = m.type) == null ? void 0 : _a2.type) !== "reflection")
            return {
              name: m.name,
              description: ((_c2 = (_b2 = m.comment) == null ? void 0 : _b2.summary) == null ? void 0 : _c2.map((t) => t.text).join("")) || null,
              value: m.defaultValue || null,
              abstract: !!m.flags.isAbstract,
              default: m.defaultValue || null,
              deprecated: !!((_e = (_d2 = m.comment) == null ? void 0 : _d2.blockTags) == null ? void 0 : _e.some((r) => r.tag === "@deprecated")),
              metadata: getFileMetadata(m),
              private: !!m.flags.isPrivate,
              readonly: !!m.flags.isReadonly,
              see: ((_i = (_h = (_g = (_f = this.declaration.comment) == null ? void 0 : _f.blockTags) == null ? void 0 : _g.find((r) => r.tag === "@see")) == null ? void 0 : _h.content) == null ? void 0 : _i.map((m2) => m2.text)) || [],
              static: !!m.flags.isStatic,
              type: m.type ? parseType(m.type) : "any",
              rawType: m.type ? parseTypes(m.type) : ["any"]
            };
          return {
            name: m.name,
            description: ((_p = ((_n = (_m = (_l = (_k = (_j = m.type) == null ? void 0 : _j.declaration) == null ? void 0 : _k.signatures) == null ? void 0 : _l[0]) == null ? void 0 : _m.comment) == null ? void 0 : _n.summary) || ((_o = m.comment) == null ? void 0 : _o.summary)) == null ? void 0 : _p.map((t) => t.text).join("")) || null,
            value: m.defaultValue || null,
            abstract: !!m.flags.isAbstract,
            default: m.defaultValue || null,
            deprecated: !!((_r = (_q = m.comment) == null ? void 0 : _q.blockTags) == null ? void 0 : _r.some((r) => r.tag === "@deprecated")),
            metadata: getFileMetadata(((_s = m.type) == null ? void 0 : _s.declaration) || m),
            private: !!m.flags.isPrivate,
            readonly: !!m.flags.isReadonly,
            see: ((_w = (_v = (_u = (_t = this.declaration.comment) == null ? void 0 : _t.blockTags) == null ? void 0 : _u.find((r) => r.tag === "@see")) == null ? void 0 : _v.content) == null ? void 0 : _w.map((m2) => m2.text)) || [],
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
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s;
    const decl = this.declaration;
    const signature = ((_a = decl.signatures) == null ? void 0 : _a[0]) || decl;
    return {
      name: decl.name,
      description: ((_c = (_b = signature.comment) == null ? void 0 : _b.summary) == null ? void 0 : _c.map((t) => t.text).join("")) || null,
      see: ((_e = (_d = signature.comment) == null ? void 0 : _d.blockTags) == null ? void 0 : _e.filter((r) => r.tag === "@see").map((t) => t.content.map((t2) => t2.text).join(""))) || [],
      static: !!signature.flags.isStatic || !!decl.flags.isStatic,
      private: decl.flags.isPrivate || !!((_g = (_f = signature.comment) == null ? void 0 : _f.blockTags) == null ? void 0 : _g.filter((r) => r.tag === "@private").length),
      examples: ((_i = (_h = signature.comment) == null ? void 0 : _h.blockTags) == null ? void 0 : _i.filter((r) => r.tag === "@example").map((t) => t.content.map((t2) => t2.text).join(""))) || [],
      abstract: decl.flags.isAbstract || !!((_k = (_j = signature.comment) == null ? void 0 : _j.blockTags) == null ? void 0 : _k.some((r) => r.tag === "@abstract")),
      deprecated: !!((_m = (_l = signature.comment) == null ? void 0 : _l.blockTags) == null ? void 0 : _m.some((r) => r.tag === "@deprecated")),
      parameters: ((_n = signature.parameters) == null ? void 0 : _n.map((m) => this.parseParameter(m))) || ((_o = decl.parameters || decl.typeParameters) == null ? void 0 : _o.map((m) => this.parseParameter(m))) || [],
      returns: {
        type: signature.type ? parseType(signature.type) : "any",
        rawType: signature.type ? parseTypes(signature.type) : ["any"],
        description: ((_s = (_r = (_q = (_p = signature.comment) == null ? void 0 : _p.blockTags) == null ? void 0 : _q.find((r) => r.tag === "@returns")) == null ? void 0 : _r.content) == null ? void 0 : _s.map((t) => t.text).join("")) || null
      },
      metadata: getFileMetadata(decl)
    };
  }
  parseParameter(decl) {
    var _a, _b, _c, _d, _e, _f;
    return {
      name: decl.name,
      description: ((_b = (_a = decl.comment) == null ? void 0 : _a.summary) == null ? void 0 : _b.map((t) => t.text).join("").trim()) || null,
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
  getClassHeading(c) {
    return `${heading(escape(c.name), 2)}${c.extends ? ` extends ${this.linker(c.extends, [c.extends])}` : ""}${c.implements ? ` implements ${this.linker(c.implements, [c.implements])}` : ""}${c.description ? `
${c.description}
` : ""}`;
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
      ];
      if (c.parameters.some((p) => p.description && p.description.trim().length > 0))
        tableHead.push("Description");
      const tableBody = c.parameters.map((m) => {
        const params = [
          escape(m.name),
          this.linker(m.type || "any", [m.type || "any"])
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
    return [this.getClassHeading(c), this.getCtor(c.constructor), this.getProperties(c.properties), this.getMethods(c.methods)].join("\n\n");
  }
  getProperties(properties) {
    if (!properties.length)
      return "";
    const head = heading("Properties", 2);
    const body = properties.map((m) => {
      var _a;
      const name = `${m.private ? "private" : "public"} ${m.static ? "static " : ""}${escape(m.name)}`.trim();
      const title = heading(`${name}: ${this.linker(m.type || "any", m.rawType || ["any"])}`, 3);
      const desc = [m.description || "", m.deprecated ? `
- ${bold("\u26A0\uFE0F Deprecated")}` : "", ((_a = m.metadata) == null ? void 0 : _a.url) ? `
- ${hyperlink("Source", m.metadata.url)}` : ""].filter((r) => r.length > 0).join("\n").trim();
      return `${title}
${desc}`;
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
      const name = `${m.private ? `private` : `public`} ${m.static ? "static " : ""}${escape(m.name)}(${m.parameters.filter((r) => !r.name.includes(".")).map((m2) => {
        return `${m2.name}${m2.optional ? "?" : ""}`;
      }).join(", ")})`.trim();
      const title = heading(`${name}: ${((_a = m.returns) == null ? void 0 : _a.type) ? `${this.linker(m.returns.type || "any", m.returns.rawType || ["any"])}` : "any"}`, 3);
      const desc = [
        m.description || "",
        m.deprecated ? `
- ${bold("\u26A0\uFE0F Deprecated")}` : "",
        m.examples ? "\n" + m.examples.map((m2) => m2.includes("```") ? m2 : codeBlock(m2, "typescript")).join("\n\n") : "",
        m.parameters.length ? (() => {
          const tableHead = [
            "Parameter",
            "Type"
          ];
          if (m.parameters.some((p) => p.description && p.description.trim().length > 0))
            tableHead.push("Description");
          const tableBody = m.parameters.map((n) => {
            const params = [
              n.default ? `${escape(n.name)}=${code(escape(n.default))}` : escape(n.name),
              this.linker(n.type || "any", n.rawType || ["any"])
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
    });
    return `${head}
${body.join("\n")}`;
  }
  getFunctions(m) {
    var _a, _b;
    const name = `${escape(m.name)}(${m.parameters.filter((r) => !r.name.includes(".")).map((m2) => {
      return `${m2.name}${m2.optional ? "?" : ""}`;
    }).join(", ")})`.trim();
    const title = heading(`${name}: ${((_a = m.returns) == null ? void 0 : _a.type) ? `${this.linker(m.returns.type || "any", m.returns.rawType || ["any"])}` : "any"}`, 3);
    const desc = [
      m.description || "",
      m.deprecated ? `
- ${bold("\u26A0\uFE0F Deprecated")}` : "",
      m.examples ? "\n" + m.examples.map((m2) => m2.includes("```") ? m2 : codeBlock(m2, "typescript")).join("\n\n") : "",
      m.parameters.length ? (() => {
        const tableHead = [
          "Parameter",
          "Type"
        ];
        if (m.parameters.some((p) => p.description && p.description.trim().length > 0))
          tableHead.push("Description");
        const tableBody = m.parameters.map((n) => {
          const params = [
            n.default ? `${escape(n.name)}=${code(escape(n.default))}` : escape(n.name),
            this.linker(n.type || "any", n.rawType || ["any"])
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

// src/index.ts
function createDocumentation(options) {
  return __async(this, null, function* () {
    var _a, _b, _c;
    let data = void 0;
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
      const tmpOutputPath = path2.join(tmp.dirSync().name, "project-reflection.json");
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
          for (const [li, val] of linkKeys) {
            if (li.toLowerCase() === type.toLowerCase()) {
              const hyl = hyperlink(escape(type), val);
              return hyl;
            }
          }
          return escape(type);
        }, "linkTypes");
        const linked = r.map((p) => linkTypes(p)).join("");
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
                const classSerializer = new ClassSerializer(child);
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
        yield writeFile(path2.join(options.output, options.jsonName), docStr);
      }
      if (options.markdown) {
        for (const moduleIdx in doc.modules) {
          const module = doc.modules[moduleIdx];
          yield Promise.all([
            ...module.classes.flatMap((cl) => {
              return cl.markdown.map((md) => __async(this, null, function* () {
                const classPath = path2.join(options.output, "classes", module.name);
                if (!existsSync(classPath))
                  yield mkdir(classPath, {
                    recursive: true
                  });
                yield writeFile(path2.join(classPath, `${md.name}.${options.extension || "mdx"}`), md.content);
              }));
            }),
            ...module.types.flatMap((cl) => {
              return cl.markdown.map((md) => __async(this, null, function* () {
                const typesPath = path2.join(options.output, "types", module.name);
                if (!existsSync(typesPath))
                  yield mkdir(typesPath, {
                    recursive: true
                  });
                yield writeFile(path2.join(typesPath, `${md.name}.${options.extension || "mdx"}`), md.content);
              }));
            }),
            ...module.functions.flatMap((cl) => {
              return cl.markdown.map((md) => __async(this, null, function* () {
                const funcsPath = path2.join(options.output, "functions", module.name);
                if (!existsSync(funcsPath))
                  yield mkdir(funcsPath, {
                    recursive: true
                  });
                yield writeFile(path2.join(funcsPath, `${md.name}.${options.extension || "mdx"}`), md.content);
              }));
            })
          ]);
        }
        for (const fileIdx in doc.custom) {
          const file = doc.custom[fileIdx];
          yield Promise.all(
            file.map((m) => __async(this, null, function* () {
              const catPath = path2.join(options.output, path2.normalize(m.category));
              if (!existsSync(catPath))
                yield mkdir(catPath, {
                  recursive: true
                });
              yield writeFile(path2.join(catPath, `${m.name}${m.type || path2.extname(m.path)}`), m.content);
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
  escape,
  getFileMetadata,
  getName,
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
  strikethrough,
  subscript,
  superscript,
  table,
  taskList,
  ul
};
