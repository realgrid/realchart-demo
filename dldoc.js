////////////////////////////////////////////////////////////////////////////////
// dldoc.js
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
 */
import fs from 'fs';
import path from 'path';

const JSFIDDLE_URL = 'https://jsfiddle.net/gh/get/library/pure/realgrid/realchart-demo/tree/master/';
/**
 * typedoc에서 가공한 클래스 구조 모델을 api문서에서 사용할 config 구조로 재가공한다.
 * debug가 true면 ./api/api.json으로 모델을 내보낸다.
 */
class Tunner {
  constructor({ path = '', debug = false }) {
    this.debug = debug;
    const text = fs.readFileSync(path || './docs/.tdout/model.json', { encoding: 'utf-8'});
    this.model = JSON.parse(text);
    this.classMap = {};
  }

  static get fiddleUrl() {
    return JSFIDDLE_URL;
  }


  _findTag (tags, tag) {
    return tags?.find(t => t.tag == tag );
  }

  _findTags (tags, tag) {
    return tags?.filter(t => t.tag == tag );
  }

  /**
   * `@{tag} url label...` 형태의 url링크를 변환한다.
   * @param tag: any
   * @returns url item string
   */
  _parseLinkTag(tag,baseUrl='') {
    const [{text}] = tag.content;
    const [src, ...label] = text.split(' ');
    return `- [${label.join(' ')}](${path.join(baseUrl, src)})`;
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
      return this._parseLinkTag(fiddle, this.fiddleUrl);
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
    return {
      config: this._parseConfigTag(tags),
      fiddle: this._parseFiddleTag(tags),
      defaultBlock: this._parseDefaultTag(tags),
    }
  }

  /**
   * 
   * @param line: string
   * @returns string
   */
  _parseInlineTag(line) {
    switch(line) {
      case '@link':
        return `**[${line.text}](./${line.text})**`
      default:
        return line.text;
    }
  }

  // parse property type
  _parseType(obj) {
    const { type, name, types, elementType } = { ...obj };
    switch(type) {
      case 'intrinsic':
        return name;
      case 'union':
        return types.map(t => this._parseType(t)).join(' | ');
      case 'array':
        return `${elementType.name}[]`;
      case 'reference':
        // console.info({ [name]: type, ...obj })
        return '';
      default:
        console.warn('[WARN] unexpected type', obj);
        return '';
    }
  }

  _parseTypeD(obj) {
    const { id, type, name, types, elementType, kindString } = { ...obj };

    // if kindString == 

    switch(type) {
      case 'intrinsic':
        return { type, name };
      case 'union':
        return types.map(this._parseTypeD.bind(this));
      case 'array':
        return { type, name:`${elementType.name}[]`};
      case 'reference':
        // console.info(obj)
        return { type, name, id };
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
    // 일반 주석 라인은 제거한다.
    return summary?.filter(line => {
      return line.text.trim().indexOf('//') < 0;
    }).map(line => {
      switch (line.kind) {
        case 'inline-tag':
          return this._parseInlineTag(line);
        case 'text':
          return line.text
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
  _setContent (prop) {
    // return prop.name;
    const { config, defaultBlock, content } = this._parseComment(prop.comment);
    return {
        name: prop.name,
        type: this._parseType(prop.type),
        dtype: this._parseTypeD(prop.type),
        header: config.join('|'), 
        content,
        defaultValue: prop.defaultValue,
        defaultBlock,
    };
  }
  // scan all classes
  _visit(obj) {
    const { name, children, kindString, comment, extendedTypes = [], extendedBy = [] } = { ...obj };
    const { config, content } = this._parseComment(comment);
    const propFilter = (child) => {
      return (child.kindString == 'Property' && this._findTag(child.comment?.blockTags, '@config'))
        || (child.kindString == 'Accessor' && this._findTag(child.getSignature?.comment?.blockTags, '@config'))
    }
    switch (kindString) {
      case 'Class':
        this.classMap[name] = { 
          // header, content, prop, type,
          kindString,
          config,
          content,
          extended: extendedTypes.map(t => t.name),
          props: children.filter(propFilter).map(c => {
            return c.kindString == 'Property' 
              ? this._setContent(c)
              : this._setContent(c.getSignature)
          }),
        };
        break;
      case 'Enumeration':
        this.classMap[name] = {
          kindString,
          props: children.filter(c => 
            c.kindString == "Enumeration Member"
            && this._findTag(c.comment?.blockTags, '@config')
          ).map(c => {
            const { content } = this._parseComment(c.comment);
            return { name: c.name, value: c.type.value, content };
          }),
        }
        // console.debug(name, this.classMap[name]);
        break;
      case 'Type alias':
        // console.debug(obj);
        break;
    }

    children?.forEach(child => {
      this._visit(child);
    });

    return extendedTypes.map(type => type.name);
  }

  scan() {
    this._visit(this.model);

    if (this.debug) {
      this.exportModel();
    }

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
  constructor(map, { debug=false }) {
    this.classMap = map;
    this.docMap = {};
    this.debug = debug;
  }

  // <br> 태그 변환
  _fixContent(content) {
    // replace \n or double space
    return content?.replace(/<br>/g, '\n') || '';
  }


  /**
   * 
   * @iparam name:string config name
   * @iparam type:string attr type value
   * @iparam prop:any
   * @returns 
   */
  _makeProp(param) {
    const { name: _name, opt, type: _type, prop } = param;
    const { header, name, type, dtype, content, defaultValue, defaultBlock } = prop;
    let enumLines = ''
    let lines = `### ${name}${type ? ': \`' + type  + '{:typescript}\`': ''}\n`;

    if (dtype instanceof Array) {
      dtype.map(t => {
        if (t.type == 'reference') {
          console.warn('Not Implemented union references');
          // throw Error('Not Implemented union references');
        }
      });
    } else if (dtype?.type == 'reference') {
      const v = this.classMap[dtype.name];
      if (v?.kindString == 'Class') {
        let accessor = this.docMap;
        const keys = _type 
          ? [opt, _type, name]
          : [opt, name];
        keys.forEach((key, i) => {
          if (!accessor[key]) {
            // is the last
            if (i == keys.length - 1) {

              const _content = `## ${name}\n${this._fixContent(content)}\n`
                    + this._makeProps({ name, opt, type: _type, props: v.props });
              accessor[key] = { _content };
              // this._writeJsonFile('./docs/.tdout/' + keys.join('.') + '.json', accessor);
            } else {
              accessor[key] = { _content: '' };
            }
          }
          accessor = accessor[key];
        });
        // this._writeJsonFile('./docs/.tdout/' + [...keys, Date.now()].join('.') + '.json', this.docMap);

        lines = `### [${name}](./${_type}/${name})\n`;
        lines += `${this._fixContent(v.content)}  \n`;
        return lines;
      } else if (v?.kindString == 'Enumeration') {
        enumLines = this._makeEnums({ name, enums: v.props })
      }
    }
    
    if (header) lines += `${header}  \n`;
    if (content) lines += `${this._fixContent(content)}  \n`;
    
    lines += enumLines;
    // @defalut가 없으면 typedoc에서 정의한 defaultValue를 사용한다.
    const dft = defaultBlock || defaultValue ;
    if (dft) {
      const [value, ...content] = dft.split(' ');
      lines += `\`default: ${value}\` ${content.join(' ')} \n`;
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
  _makeProps(param) {
    const { name, opt, type, props } = param;
    const h = '## Properties\n';
    return [ h, ...props.map(prop => {
      return this._makeProp({ name, opt, type, prop })
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
      const content = this._fixContent(e.content).replace(/\n/g, '  ');
      return `- \`'${e.value}'\` ${content}`
    }).join('\n') + '\n\n';
  }

  /**
   * 
   * @param config: any
   * @returns { name, root, opt, label, ...attr }
   * @rparam name: head of line
   * @rparam root: root name of head line
   * @rparam opt: option name of head line; 2nd value of . connected string
   * @rparam label: tail of line
   * @rparam ...attr: key, value pair object bind in []
   */
  _destructConfig(config) {
    // ex) chart.series[type=vector]
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
        const [key, value] = option.split('=');
        if (key && value) {
          options[key] = value.replace(/["']/g, '');
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

  _setPropContents(docMap, { opt, type, _content }) {
    if (type) {
      // if (opt != 'series') console.debug(opt, type, _content)
      docMap[opt][type] = { ...docMap[opt][type], _content }
    } else {
      docMap[opt] = { ...docMap[opt], _content }
    }
  }

  /**
   * series, axis 처럼 type이 있으면 디렉토리가 생긴다.
   * 이 때, series.mdx에는 속성이 없는 개요 문서를 생성하고
   * series/{type}.mdx에는 속성이 포함된 문서를 생성한다.
   * 이 후, property 생성에서 참조하는 confg정보는 재귀 처리한다.
   */
  _setContent(docMap, dconf) {
    const { name, root, opt, label, type, props, content } = dconf;
    if (root != 'chart' || !opt) return;

    let subtitle = '';
    let subtitleText = opt;
    // 개요 문서에만 링크 추가
    if (type) {
      subtitleText += `[type=${type}]`;  
      subtitle = `## [${subtitleText}](./${opt}/${type})`
    }
    const _content = `${this._fixContent(content)}\n`;
    
    if (['series', 'xAxis', 'yAxis', 'gauge'].indexOf(opt) >= 0 && !type) 
      return console.warn(`[WARN] ${name} type missed.`);

    if (!docMap[opt]) docMap[opt] = { _content: ''};

    // docMap 참조 주의...
    docMap[opt] = { ...docMap[opt], _content: docMap[opt]._content += `${subtitle}\n${_content}` };
    
    // 속성 추가
    if (props) {
      const propContents = this._makeProps({ name, opt, type, props });
      this._setPropContents(docMap, { opt, type, _content: `## ${subtitleText}\n${_content}` + propContents} )
    }
  }

  _generate() {
    Object.entries(this.classMap).forEach(([key, value]) => { 
      const { config, props, content } = value;
      // 동일한 내용이지만 xAxis, yAxis처럼 속성만 다른 경우를 처리하기 위해 @config가 2개 이상일 수 있다.
      config?.map(conf => {
        const dconf = this._destructConfig(conf);
        // const { name, root, opt, label, type } = dconf;
        this._setContent(this.docMap, { ...dconf, props, content })
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
        console.debug('write', `${path}.mdx`);
        fs.writeFileSync(`${path}.mdx`, value , { encoding: 'utf-8'});
      } else {
        !fs.existsSync(`${path}`) && fs.mkdirSync(path);
        this._saveFile(`${path}/${key}`, value);
      }
    });
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
    this._saveFile(root, this.docMap);
  }

  exportModel() {
    this._writeJsonFile('./docs/.tdout/doc.json', this.docMap);
  }
}

const classMap = new Tunner({debug:true}).scan();
const generator = new MDGenerater(classMap, { debug:true })
generator.run();
