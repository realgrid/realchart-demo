
////////////////////////////////////////////////////////////////////////////////
// dldoc.js
// config 문서를 생성한다.
// 2023. 09. 17. created by benny
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

/**
 * typedoc으로 가공한 ./api/model.json을 가지고 재가공한다. 따라서 typedoc이 먼저 실행되어야 한다.
 * ```yarn dldoc``` script에 해당 명령을 포함한다.
 * export 한 클래스만 찾는다. export하지 않은 것을 포함하려면 typedoc plugin 필요.
 * https://github.com/tomchen/typedoc-plugin-not-exported
 * typedoc 기본 설정은 typedoc.json을 사용한다.
 */
import fs from 'fs';
import path from 'path';

import { doclink, fiddlelink }  from './docs/lib/typedoc-nextra/index.mjs';

const ReflectionKind = {
  Project: 1,
  Module: 2,
  Namespace: 4,
  Enum: 8,
  EnumMember: 16,
  Variable: 32,
  Function: 64,
  Class: 128,
  Interface: 256,
  Constructor: 512,
  Property: 1024,
  Method: 2048,
  CallSignature: 4096,
  IndexSignature: 8192,
  ConstructorSignature: 16384,
  Parameter: 32768,
  TypeLiteral: 65536,
  TypeParameter: 131072,
  Accessor: 262144,
  GetSignature: 524288,
  SetSignature: 1048576,
  TypeAlias: 2097152,
  Reference: 4194304
}
Object.freeze(ReflectionKind);

const ReflectionKindString = Object.fromEntries(
  Object.entries(ReflectionKind).map(([key, value]) => {
    return [value, key]
  })
);
Object.freeze(ReflectionKindString);

const JSFIDDLE_URL = 'https://jsfiddle.net/gh/get/library/pure/realgrid/realchart-demo/tree/master/';
/**
 * typedoc에서 가공한 클래스 구조 모델을 api문서에서 사용할 config 구조로 재가공한다.
 */
class Tunner {
  constructor({ path = '', debug = false }) {
    this.debug = debug;
    const text = fs.readFileSync(path || './docs/.tdout/model.json', { encoding: 'utf-8'});
    this.model = JSON.parse(text);
    this.classMap = {};
    // temporary map
    this.currents = [];
    this.current = { name: '', kind: 0, props: {} };
  }

  static get fiddleUrl() {
    return JSFIDDLE_URL;
  }

  _findTag(tags, tag) {
    return tags?.find(t => t.tag == tag );
  }

  _findTags(tags, tag) {
    return tags?.filter(t => t.tag == tag );
  }

  _findModel(model, name) {
    for (const child of model.children) {
      if (child.name == name) {
        return child;
      } else if (child.children) {
        const found = this._findModel(child, name)
        if (found) return found;
      };
    }
  }

  _findModelById(model, id) {
    for (const child of model.children) {
      if (child.id == id) {
        return { ...child };
      } else if (child.children) {
        const found = this._findModelById(child, id)
        if (found) return found;
      };
    }
  }

  _parseLink(tag, baseUrl='') {
    const [{text}] = tag.content;
    const [src, ...label] = text.split(' ');
    return { label: label.join(' '), href: path.join(baseUrl, src)}
  }

  /**
   * `@{tag} url label...` 형태의 url링크를 변환한다.
   * @param tag: any
   * @returns url item string
   */
  _parseLinkTag(tag, baseUrl='') {
    const { label, href } = this._parseLink(tag, baseUrl);
    return `- [${label}](${href})`;
  }

  _parseFiddle(tag) {
    fiddlelink()
    const { label, href } = this._parseLink(tag, Tunner.fiddleUrl);
    return `<FiddleLink label="${label}" href="${href}"/>`;
  }

  /**
   * @param tags: Array
   * @returns string
   */
  _parseConfigTag(tags) {
    const configs = this._findTags(tags, '@config');
    return configs?.map(config => {
      const { tag, content } = {...config};
      return content?.map(c => c.text).join(' ');
    });
  }

  /**
   * jsfiddle inline으로 가정한다. @fiddle url label...
   * @param tags: Array
   * @returns string
   */
  _parseFiddleTag(tags) {
    const fiddles = this._findTags(tags, '@fiddle');
    return fiddles?.map(fiddle => {
      // return this._parseFiddle(fiddle);
      return fiddlelink(fiddle);
    }).join('\n');
  }

  /**
   * defaultValue를 사용하되, @default tag가 있으면 설명을 대체한다.
   * @param tags: Array
   * @returns string
   */
  _parseDefaultTag(tags) {
    const dft = this._findTag(tags, '@default');
    return dft?.content.map(c => c.text).join('\n');
  }

  /**
   * 내부 문서 링크. @see url label...
   * @param tags: Array
   * @returns string
   */
  _parseSeeTag(tags) {
    const sees = this._findTag(tags, '@see');
    return sees?.map(see => {
      return this._parseLinkTag(see);
    }).join('\n');
  }

  /**
   * 
   * @param tags: Array
   * @returns { config: string[], fiddle: string, defaultBlock: string}
   */
  _parseBlockTags(tags) {
    const fiddle = this._parseFiddleTag(tags);
    // const fiddle = _fiddle ? '- jsfiddle\n' + _fiddle : null;
    
    return {
      config: this._parseConfigTag(tags),
      fiddle,
      defaultBlock: this._parseDefaultTag(tags),
    }
  }

  _getConfigLinkById(id) {
    const model = this._findModelById(this.model, id);
    switch (model?.kind) {
      case ReflectionKind.EnumMember:
        return `\`${model.type.value}\``;
      case ReflectionKind.Property:
      case ReflectionKind.Accessor:
        // this.current.name == 'BulletGauge' && console.debug(`[DEBUG] ${model.name}`, model)
        const [current] = this.currents.slice(-1);
        const [config] = this._parseConfigTag(current.comment?.blockTags) || [];
        if (config) {
          const { opt, type } = MDGenerater.destructConfig(config);
          const link = ['/config', 'config', opt, type].filter(v => v).join('/');
          return `[${model.name}](${link}#${model.name.toLowerCase()})`;
        }
        break;
      default:
        // console.warn(`[WARN] ${model.name}`, model)
        break;
    }

    return;
  }

  _getConfigLink(name, prop) {
    const model = this._findModel(this.model, name);
    switch(model?.kind){
      case ReflectionKind.Class:
        const [config] = this._parseConfigTag(model.comment?.blockTags) || [];
        if (config) {
          const { opt } = MDGenerater.destructConfig(config);
          const link = ['/config', 'config', opt].filter(v => v).join('/');
          return `[${prop}](${link}#${prop.toLowerCase()})`;
        }
        break;
      default:
        break;
    }
    return '';
  }

  /**
   * 
   * @param line: string
   * @returns string
   */
  _parseInlineTag(line) {
    if(line.tag == '@link') {
      /** line.target 정보로 찾기 */
      if (/^(http:|https:)/.test(line.target)) {
        return `**[${line.text}](${line.target})**`;
      } else if (line.target) {
        // ts 제공 구조체인 경우
        const { sourceFileName, qualifiedName } = line.target;
        if (sourceFileName?.indexOf('node_modules/typescript') == 0) {
          return `**${qualifiedName}**`;
        }
        
        // 현재 구조체의 속성인 경우
        // % 상속받은 prop이면 현재 prop id와 다르다.
        const [current] = this.currents.slice(-1);
        // 현재 속성 중에 있거나, 상속 받은 속성. 조상까지 찾을 필요는 없다.
        const prop = current.props?.find(
          p => (line.target == p.id)
          || (line.text == p.inheritedFrom?.name.split('.').pop())
        );
        // 다른 구조체에서 이름이 같을 수 있음. Series.xStart, ChartOptions.xStart
        // || p.name == line.text
        if (prop) return `[${line.text}](#${prop.name.toLowerCase()})`;
        
        // 레퍼런스
        // line.target 이 number 타입으로 reference가 있는 경우...
        if (typeof line.target === 'number') {
          const link = this._getConfigLinkById(line.target);
          return link;
        } else {
          console.warn(`[WARN] Unexpected inline link`, line);
        }
        return line.text;
      } else {
        // target정보가 없어서, line.text에서 클래스 이름과 속성으로 가정하고 config 찾기
        const [name, prop] = line.text.split('.');
        const link = this._getConfigLink(name, prop);
        if (link) return link;
      }

      return doclink(line.text);
    }

    return line.text;
  }

  // parse property type
  _parseType(obj) {
    const { type, name, types, elementType, qualifiedName, target} = { ...obj };
    const { name: ename, type: etype, target: etarget } = { ...elementType };
    switch(type) {
      case 'intrinsic':
        return name;
      case 'union':
        return types.map(t => {return this._parseType(t)}).join(' | ');
      case 'array':
        // IValueRange
        switch (etype) {
          case 'reference':
            return `${ename}[]`;
          case 'intrinsic':
            return `${ename}[]`;
          default:
            console.warn(`[WARN] Unexpected array type ${etype}, ${ename}`, obj);
        }
        return;
      case 'reference':
        const qlfName = qualifiedName || target.qualifiedName
        if (qlfName) { 
          
          if (target.sourceFileName.indexOf('node_modules/typescript') == -1) {
            console.warn(`[WARN] Not found ${qlfName} qualified model. Check it's @internal or not exported.`)
          }
          // else Date
          return qlfName;
        } 

        this._preScan(name);
        const cls = this.classMap[name];
        if (!cls) throw new Error(name);
        return this._parseType(cls.type ?? { name, ...cls });
      case 'literal':
        // console.warn(`[WARN] ignored ${type}`, obj);
        return typeof obj.value === 'string' ? `'${obj.value}'` : obj.value;
      case 'reflection':
        return obj.declaration?.signatures.map(s => {return this._parseType(s)}).join(' | ');
      default:
        // type 없음. class, Interface, Enumeration...
        return this._parseStructure(obj);
    }
  }

  _parseStructure(obj) {
    switch(obj.kind) {
      case ReflectionKind.Interface:
        return obj.name;
      case ReflectionKind.Enum:
        if (!obj.props) throw new Error(obj.name);
        return obj.props?.map(p => `'${p.value}'`).join('|');
      case ReflectionKind.Class:
        break;
      case ReflectionKind.CallSignature:
        console.warn(`[WARN] TODO - ${obj.name}:${ReflectionKindString[obj.kind]}`);
        break;
      default:
        console.warn(`[WARN] Unexpected type ${obj.name}:${ReflectionKindString[obj.kind]}`);
        break;
    }

    return null;
  }

  _parseTypeD(obj) {
    const { id, type, name, types, elementType } = { ...obj };

    switch(type) {
      case 'intrinsic':
        return { type, name };
      case 'union':
        return types.map(this._parseTypeD.bind(this));
      case 'array':
        return { type, name:`${elementType.name}[]`, elementType };
      case 'reference':
        this._preScan(name);
        const { kind } = this.classMap[name] || {};
        return { type, name, kind, id };
      default:
        return {};
    }
  }

  /**
   * 
   * @param summary: Array
   * @returns string
   */
  _parseSummary(summary) {
    return summary?.map(line => {
      switch (line.kind) {
        case 'inline-tag':
          return this._parseInlineTag(line);
        case 'text':
          // 일반 주석 라인은 제거한다.
          return line.text.trim().split('\n')
            .filter(l => l.trim().indexOf('//') < 0)
            .join('\n')
      }
    }).join(' ');
  }

  /**
   * 
   * @param comment: any
   * @returns { config: Array, defaultBlock: string, lines: string }
   */
  _parseComment(comment) {
    const { summary, blockTags } = { ...comment };
    let lines = this._parseSummary(summary);
    // @config content
    const { config, fiddle, defaultBlock } = this._parseBlockTags(blockTags)
    if (fiddle) {
      lines += `\n${fiddle}`
    }

    return { config, defaultBlock, content: lines };
  }

  /**
   * 주석이 아닌 '@config visible' 같은 포맷으로 선언된 doclet 여부
   */
  _isDoclet(name) {
      return name.indexOf('@config') == 0;
  }
  _doclet(name) {
    const isDoclet = this._isDoclet(name);
    return { isDoclet, name: isDoclet ? name.split(' ').pop() : name };
  }
  _setContent (prop) {
    // return prop.name;
    const { config, defaultBlock, content } = this._parseComment(prop.comment);
    return {
        name: prop.name,
        type: this._parseType(prop.type),
        dtype: this._parseTypeD(prop.type),
        header: config?.join('|'), 
        // readonly: prop.flags?.isReadonly, // config에서 readonly 표기가 유효한지 확인.
        optional: prop.flags?.isOptional,
        content,
        defaultValue: prop.defaultValue,
        defaultBlock,
    };
  }
  // scan all classes
  _visit(obj, level=0) {
    const { name, children, kind, type, typeParameters, comment, extendedTypes = [], extendedBy = [] } = { ...obj };
    const propFilter = (child) => {
      return (
        child.kind === ReflectionKind.Property 
          && (this._isDoclet(child.name) || this._findTag(child.comment?.blockTags, '@config'))
        ) || (
        child.kind === ReflectionKind.Accessor 
          && this._findTag(child.getSignature?.comment?.blockTags, '@config')
      );
    }
    const staticPropFilter = (child) => {
      return child.kind === ReflectionKind.Property
        && child.flags?.isStatic
    }
    this.currents.push({ name, kind, comment });

    const { config, content } = this._parseComment(comment);
    switch (kind) {
      case ReflectionKind.Class:

        // this.current = { name, kind, comment, props: children.filter(propFilter)}
        const clsProps = children.filter(propFilter);
        this.currents[this.currents.length -1].props = clsProps;
        this.classMap[name] = { 
          // header, content, prop, type,
          kind,
          config,
          content,
          extended: extendedTypes.map(t => t.name),
          staticProps: children
            .filter(staticPropFilter)
            .map(c => { return { name: c.name, value: c.type?.value }}),
          props: clsProps
            .map(c => {
              return c.kind === ReflectionKind.Property
              ? this._setContent(c)
              : this._setContent(c.getSignature)
            })
            .sort((prev, next) => {
              // doclet을 뒤로 보낸다. 다음 reduce에서 부모 속성을 덮어쓴다.
              const { isDoclet, name } = this._doclet(next.name);
              return isDoclet ? -1 : 0;
            })
            .reduce((acc, curr) => {
              // 상위 클래스 속성 설명에 doclet 설명을 추가하고, defaultValue는 덮어쓴다.
              const { isDoclet, name } = this._doclet(curr.name);
              const found = acc.findIndex((el) => el.name == name);
              if (found >= 0 && isDoclet) {
                acc[found].content += `  \n${curr.content}`
                acc[found].defaultValue = curr.defaultValue;
                acc[found].defaultBlock = curr.defaultBlock;
              } else if (isDoclet) {
                curr.name = name;
                acc.push(curr);
              } else {
                acc.push(curr);
              }
              return acc;
            }, [])
            .sort((prev, next) => {
              return prev.name > next.name ? 1 : -1;
            })
        };
        break;
      case ReflectionKind.Enum:
        const enumProps = children.filter(c => 
          c.kind == ReflectionKind.EnumMember
          && this._findTag(c.comment?.blockTags, '@config')
        ).map(c => {
          const { content } = this._parseComment(c.comment);
          return { name: c.name, value: c.type.value, content };
        });

        this.currents[this.currents.length - 1].props = enumProps;
        this.classMap[name] = {
          kind,
          props: enumProps,
        }
        // console.debug(name, this.classMap[name]);
        break;
      case ReflectionKind.TypeAlias:
        this.classMap[name] = {
          kind,
          type,
          typeParameters
        }
        break;
      case ReflectionKind.Interface:
        // !children && console.debug(name, children);
        const itfProps = children?.filter(c => c.kind === ReflectionKind.Property)?.map(c => {
          return this._setContent(c);
        });
        this.currents[this.currents.length -1].props = itfProps;
        this.classMap[name] = {
          kind,
          type,
          config,
          props: itfProps
        }
        break;
      default:
        // console.debug('Ignored.', name, kindString, obj)
        break;
    }

    if (!this.currents.length)
      throw Error();
    this.currents.pop();


    // project or module
    // kind == 1 || kind == 2 
    children?.forEach(child => {
      this._visit(child);
    });

    return extendedTypes.map(type => type.name);
  }

  // 아직 classMap에 없으면 모델을 찾아서 업데이트 한다.
  _preScan(name) {
    if (!this.classMap[name]) {
      const model = this._findModel(this.model, name)
      if (!model){
        return console.warn(`[WARN] Not found ${name} model. Check it's @internal or not exported.`)
      } else {
        this._visit(model);
      }
    }
  }

  scan() {
    this._visit(this.model);

    // class api 문서를 생성하는 docs/typedoc에서 사용.
    this.exportModel();

    return this.classMap;
  }

  exportModel() {
    const json = JSON.stringify(this.classMap, null, 2)
    fs.writeFileSync('./docs/.tdout/api.json', json, { encoding: 'utf-8'});
  }
}

/**
 * Tunner에서 가공한 모델을 가지고 config별 mdx문서를 내보낸다.
 */
class MDGenerater {

  static get TYPE_ELEMENTS() {
    return ['series', 'xAxis', 'yAxis', 'gauge', 'annotation', 'asset'];
  } 

  constructor(map, { debug=false }) {
    this.classMap = map;
    this.docMap = {};
    this.debug = debug;
  }

  /**
   * root.opt[type] label
   * @param config: any
   * @returns { name, root, opt, label, ...attr }
   * @rparam name: head of line
   * @rparam root: root name of head line
   * @rparam opt: option name of head line; 2nd value of . connected string
   * @rparam label: tail of line
   * @rparam ...attr: key, value pair object bind in []
   */
  static destructConfig(config) {
    // ex) chart.series[type=vector,type2=bar] foo bar...
    const regex = /(\w+(?:\.\w+)?)(?:\[(.*?)\])?(?:\s(.*))?/;
    const matches = config?.match(regex);
  
    if (!matches) {
      return [];
    }
  
    const [, name, optionsStr, rest] = matches;
    const [root, opt] = name.split('.');
    const result = { name, root, opt };
  
    if (optionsStr) {
      const options = {};
      optionsStr.split(',').forEach(option => {
        try {
          const [key, value] = option.split('=');
          if (key) {
            options[key] = value?.replace(/["']/g, '') ?? true;
          }
        } catch(err) {
          console.error(err, {option});
        }
      });
      // result.push(options);
      Object.assign(result, options);
    }
  
    if (rest) {
      // result.push(rest.trim());
      result['label'] = rest.trim();
    }
  
    return result;
  }

  _styleContent(content) {
    // <br> 태그 변환
    content = content?.replace(/\\r|<br>|\\/g, '\n').trim() || '';

    const specialRegex = /null|undefined|true|false|NaN/g;
    const singleQuoteRegex = /'.*'/g;
    content = content
      .replace(specialRegex, (match) => `<Content type="keyword" value="${match}"></Content>`)
      .replace(singleQuoteRegex, (match) => `<Content type="expression" value="${match}"></Content>`);

    return content;
  }

  _getDoc(keys, docMap) {
    const _keys = keys.slice();
    if (keys.length) {
      const key = _keys.shift();
      try {
        if (!docMap[key]) {
          docMap[key] = { _key: [docMap._key, key].filter(v=>v).join('.'), _content: '' };
        }
        return this._getDoc(_keys, docMap[key]);
      } catch(err) {
        console.error(err);
      }
    }
    return docMap;
  }

  _makeClassProp(param, classMap) {
    const { prop: { name, content } } = param;
    const keys = param.keys.slice();
    const docMap = this._getDoc(keys, this.docMap);
    if (!docMap) throw Error();

    // 개요
    if (MDGenerater.TYPE_ELEMENTS.includes(name)){
      const title = `[${name}](/config/config/${name})`
      const outline = `${title}\n${this._styleContent(content)}\n`
      return `### ${outline}`;
    }

    keys.push(name);
    const _key = keys.join('.');
    const _content = [
      `## **${name}**`, 
      this._styleContent(classMap.content), 
      this._makeProps({ keys, props: classMap.props })].join('\n');
    docMap[name] = { _key , ...docMap[name], _content };
    

    // this._writeJsonFile('./docs/.tdout/' + [...keys, Date.now()].join('.') + '.json', this.docMap);
    const subtitle = keys.pop();
    const parent = keys.pop();

    let lines = `### [${subtitle}](./${[parent || 'config', subtitle].join('/')})\n`;
    lines += `${this._styleContent(classMap.content)}  \n`;
    return lines;
  }

  /**
   * 
   * @iparam name:string config name
   * @iparam type:string attr type value
   * @iparam prop:any
   * @returns 
   */
  _makeProp(param) {
    const { prop } = param;
    const { header, name, type, dtype, content, defaultValue, defaultBlock, readonly } = prop;

    let extraLines = ''
    let lines = `### ${readonly ? '*`<readonly>`* ' : ''}`
      + `${name}`
      + `${type ? ': \`' + type  + '\{:js}`': ''}`
      + `[#${name}]\n`;

    if (dtype instanceof Array) {
      // dtype.map(t => {
      //   if (t.type == 'reference') {
      //     t.name != 'Date' && console.warn('Not Implemented union references', t);
      //     // Date
      //     return t.name;
      //   } else if (t.type == 'array') {
      //     // console.warn(`[WARN] Unexpected type in array`, t)
      //   } else if (t.type == 'intrinsic') {
      //     // console.warn(`[WARN] Unexpected type in array`, t)
      //   } else if (Object.keys(t.type || {}).length) {
      //     // console.warn(`[WARN] Unexpected type in array`, t)
      //   }
      // });
    } else if (dtype?.type == 'reference') {
      const v = this.classMap[dtype.name];
      if (!v) return console.warn(`[WARN] Not found classMap of ${dtype.name}`);
      switch(v.kind) {
        case ReflectionKind.Class:  
          return this._makeClassProp(param, v);
        case ReflectionKind.Enum:
          extraLines = this._makeEnums({ name, enums: v.props });
          break;
        case ReflectionKind.Interface:
          const { props, content: itfContent } = this.classMap[type];
          const itfContents = this._makeInterfaceProps({ name: type, content: itfContent, props });
          extraLines = itfContents;
          break;
        case ReflectionKind.TypeAlias:
          // union에 reference가 있고, Interface 이면,
          v.type.types?.map(({ name, type }) => {
            // if (type.target)
            if (type == 'reference') {
              const { kind, props, content: itfContent } = this.classMap[name];
              if (kind == ReflectionKind.Interface) {
                extraLines += this._makeInterfaceProps({ name, content: itfContent, props });
              } else {
                // class??
                console.warn(`[WARN] Unexpected union alias ${name}`, type);
              }
            } else if (type != 'intrinsic'){
              console.warn(`[DEBUG] TODO: ${name}`, type);
            }
          });
          // callback function
          const { declaration } = v;
          if (declaration) console.debug({ declaration });
          break;
        default:
          console.warn('[WARN] Unexpected prop type', v);
      }
    } else if (dtype?.type == 'array') {
      const { elementType: { name: ename, type: etype } } = dtype;
      if (etype == 'reference') {
        const ref = this.classMap[ename];
        switch (ref?.kind) {
          case ReflectionKind.Interface:
            const { props, content: itfContent } = ref;
            extraLines = this._makeInterfaceProps({ name: ename, content: itfContent, props });
            break;
          case ReflectionKind.Class:
            return this._makeClassProp(param, ref);
          default:
            break;
        }
      }
    }
    
    if (header) lines += `${header}  \n`;
    if (content) lines += `${this._styleContent(content)}  \n`;
    
    lines += extraLines;
    // @defalut가 없으면 typedoc에서 정의한 defaultValue를 사용한다.
    const dft = defaultBlock || defaultValue ;
    if (dft) {
      // strip ```ts ... ```
      const dftValue = dft.match(/```ts([\s\S]*?)```/)?.[1].trim() || dft.trim();
      let [value, ...content] = dftValue.split(' ');
      // this.classMap[dtype.name].staticProps
      if (dtype?.kind === ReflectionKind.Enum) {
        // console.debug(dtype, value, typeof value);
        
        // ex) name: 'ChartTextEffect', value: ChartTextEffect.NONE
        // name과 value head가 같다.
        const [enumName, memberName] = value.split('.');
        if (dtype.name == enumName) {
          const enumEl = this.classMap[enumName];
          if (!enumEl) {
            console.warn(`[WARN] Could not find.`, enumName)
          } else {
            const em = enumEl.props?.find(m => m.name == memberName)
            if (em && em.value) {
              value = em.value;
              if (typeof value == 'string' ) value = `'${value}'`;
            } else {
              // console.warn(`[WARN] EnumMember @config may not set.`, value);
            }
          }
        } else {
          console.warn(`[WARN] Unexpected default value pattern.`, dftValue);
        }
      } else if (dtype?.kind === ReflectionKind.TypeAlias) {
        // ex) name: RtPercentSize, value: CircularGauge.DEF_CENTER
        // 1. find static vars
        const regex = /\b[A-Z].+\.\b[A-Z].*/g;
        if (regex.test(value)) {
          const [clsName, propName] = value.split('.');
          const clsEl = this.classMap[clsName];
          if (!clsEl) {
            console.warn(`[WARN] Not found class static variable`, value);
          } else {
            const sm = clsEl.staticProps?.find(p => p.name == propName)
            if (sm && sm.value) {
              value = sm.value;
              if (typeof value == 'string' ) value = `'${value}'`;
            } else {
              console.warn(`[WARN] Not found class static variable.`, value)
            }
          }
        } else {
          // ex) name: RtPercentSize, value: '7%'
        }
      }

      lines += `<DefaultValue value="${value}" contents="${content.join(' ')}"></DefaultValue>`.trim();
    } else {
      lines += `<DefaultValue value="undefined" contents=""></DefaultValue>`.trim();
    }
    
    return lines;
  }

  /**
   * 
   * @iparam name:string config name
   * @iparam type:string attr value
   * @iparam props:any[] properties
   * @returns contents
   */
  _makeProps({ keys, props }) {
    const h = '## Properties\n';
    return [ h, ...props.map(prop => {
      return this._makeProp({ keys, prop })
    })].join('\n');
  }

  /**
   * 
   * @iparam name
   * @iparam enums
   */
  _makeEnums(param) {
    const { name, enums } = param;
    return enums.map(e => {
      const content = this._styleContent(e.content).replace(/\n/g, '  ');
      return `- \`'${e.value}'\` ${content}`
    }).join('\n') + '\n\n';
  }

  _makeInterfaceProps({name, content, props }) {
    // section head 
    let lines = `- \`${name}{:js}\` \n\n`;
    if (content) lines += content + ' \n';
    // table head
    lines += `| Name | Type | Optional |  \n`;
    lines += '| ----- | ----- | ----- |  \n';
    lines += props?.map(({name, type, optional}) => {
      // code 블록안에 pipe character 있으면 acorn 오류
      return `| ${name} | \`${type.replace(/\|/g, '\\|')}{:js}\` | ${optional ?? 'false'} |`;
    }).join('  \n');
    return lines.trim();
  }

  _setPropContents({ keys, _content }) {
    // root config
    // const [root] = keys;
    const _key = keys.join('.');
    const [name] = keys.splice(-1, 1);
    if (!_key) {
      this.docMap = { ...this.docMap, _content };
    } else {
      let docMap = this._getDoc(keys, this.docMap);
      docMap[name] = { _key, ...docMap[name], _content };
    }
    // else if (opt && type) {
    //   // if (opt != 'series') console.debug(opt, type, _content)
    //   this.docMap[opt][type] = { _key: [opt, type].join('.'), ...this.docMap[opt][type], _content }
    // } else {
    //   this.docMap[opt] = { _key: opt, ...this.docMap[opt], _content }
    // }
  }

  /**
   * series, axis 처럼 type이 있으면 디렉토리가 생긴다.
   * 이 때, series.mdx에는 속성이 없는 개요 문서를 생성하고
   * series/{type}.mdx에는 속성이 포함된 문서를 생성한다.
   * 이 후, property 생성에서 참조하는 confg정보는 재귀 처리한다.
   */
  _setChartContent(dconf) {
    const { name, root, opt, label, type, base, props, content } = dconf;
    if (root != 'chart') return;

    let subtitle = '';
    let subtitleText = opt;

    // 개요 문서에만 링크 추가
    if (type) {
      subtitleText += `[type=${type}]`;  
      subtitle = `## [${subtitleText}](./${opt}/${type})`
    }
    const _content = `${this._styleContent(content)}\n`;
    
    if (MDGenerater.TYPE_ELEMENTS.includes(opt) && !base && !type) 
      return console.warn(`[WARN] ${name} type missed.`);

    if (!base && opt) {
      // if (!this.docMap[opt]) 
      //   this.docMap[opt] = { _key: opt, _content: ''};
      
        // docMap 참조 주의...
      this.docMap[opt] = {
        _key: opt, 
        ...this.docMap[opt], 
        _content: (this.docMap[opt]?._content || '') + `${subtitle}\n${_content}` 
      };
    }

    // 속성 추가
    if (props) {

      const keys = [base ? 'base' : '', opt, type].filter(v => v);
      // chart면 키가 없음...

      const propContents = this._makeProps({ keys , props });
      this._setPropContents({ 
        // name, opt, type, 
        keys,
        _content: (subtitleText ? `## **${subtitleText}**\n${_content}` : '') 
          + propContents 
      });
    }
  }

  _generate() {
    Object.entries(this.classMap).forEach(([key, value]) => { 
      const { config, props, content } = value;
      // 동일한 내용이지만 xAxis, yAxis처럼 속성만 다른 경우를 처리하기 위해 @config가 2개 이상일 수 있다.
      config?.map(conf => {
        const dconf = MDGenerater.destructConfig(conf);
        // const { name, root, opt, label, type } = dconf;
        this._setChartContent({ ...dconf, props, content })
      });
    })

    return this.docMap;
  }

  _writeJsonFile(path, obj) {
    fs.writeFileSync(path, JSON.stringify(obj, null, 2), { encoding: 'utf-8'});
  }

  _saveFile(path, docMap) {
    Object.entries(docMap).forEach(([key, value]) => {
      if (key == '_content') {
        // config root
        const paths = path.split('/');
        const last = paths.pop();
        if (last == 'chart') {
          path = paths.join('/');
        }
        // console.debug('write', `${path}.mdx`);
        fs.writeFileSync(`${path}.mdx`, value , { encoding: 'utf-8'});
      } else if (key != '_key') {
        !fs.existsSync(`${path}`) && fs.mkdirSync(path);
        this._saveFile(`${path}/${key}`, value);
      }
    });
    const meta = Object.keys(docMap)
    .filter(key => !key.startsWith('_'))
    .reduce((agg, key) => {
      return Object.assign(agg, { [key]: key });
    }, {})
    // console.debug(path, meta);
    path.split('/').length == 5 &&
      fs.existsSync(path) && 
      fs.writeFileSync(`${path}/_meta.json`, JSON.stringify(meta) , { encoding: 'utf-8'});
  }

  run() {
    this._generate();
    this.saveFile();
    if (this.debug) {
      this.exportModel();
    }
    return this.docMap;
  }

  saveFile() {
    const root = 'docs/pages/config/config';
    // clear
    fs.existsSync(root) && fs.rmSync(root, { recursive: true, force: true });
    
    this._saveFile(root, this.docMap);

    // overwrite config
    fs.copyFileSync('docs/pages/config/config._meta.json', `${root}/_meta.json`);
    fs.copyFileSync('docs/pages/config/base._meta.json', `${root}/base/_meta.json`);
  }

  exportModel() {
    this._writeJsonFile('./docs/.tdout/doc.json', this.docMap);
  }
}

const classMap = new Tunner({ debug:true }).scan();
const generator = new MDGenerater(classMap, { debug:true })
generator.run();
