/**
 * typedoc으로 가공한 json을 가지고 재가공한다. 따라서 typedoc이 먼저 실행되어야 한다.
 * 
 * export 한 클래스만 찾는다. export하지 않은 것을 포함하려면 typedoc plugin 필요.
 * https://github.com/tomchen/typedoc-plugin-not-exported
 */
import fs from 'fs';

const text = fs.readFileSync('./api/model.json', { encoding: 'utf-8'});
const model = JSON.parse(text);
const classMap = {};

const JSFIDDLE_URL = 'https://jsfiddle.net/gh/get/library/pure/realgrid/realchart-demo/tree/master/';

const findTag = (tags, tag) => {
  return tags?.find(t => t.tag == tag );
}

const findTags = (tags, tag) => {
  return tags?.filter(t => t.tag == tag );
}

/**
 * @param tags: Array
 * @returns string
 */
const parseConfigTag = (tags) => {
  const configs = findTags(tags, '@config');
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
const parseFiddleTag = (tags) => {
  const fiddles = findTags(tags, '@fiddle');
  return fiddles?.map(fiddle => {
    const [{text}] = fiddle.content;
    const [src, ...label] = text.split(' ');
    return `- [${label.join(' ')}](${JSFIDDLE_URL + src})`;
  }).join('\n');
}

/**
 * defaultValue를 사용하되, @default tag가 있으면 설명을 추가한다.
 * @param tags: Array
 * @returns string
 */
const parseDefaultTag = (tags) => {
  return '';
}

/**
 * 
 * @param tags: Array
 * @returns { config: string[], fiddle: string, defaultBlock: string}
 */
const parseBlockTags = (tags) => {
  return {
    config: parseConfigTag(tags),
    fiddle: parseFiddleTag(tags),
    defaultBlock: parseDefaultTag(tags),
  }
}

/**
 * 
 * @param line: string
 * @returns string
 */
const parseInlineTag = (line) => {
  switch(line) {
    case '@link':
      return `**[${line.text}](./${line.text})**`
    default:
      return line.text;
  }
}

// parse property type
const parseType = (obj) => {
  const { type, name, types, elementType } = { ...obj };
  switch(type) {
    case 'intrinsic':
      return name;
    case 'union':
      return types.map(t => parseType(t)).join(' | ');
    case 'array':
      return `${elementType.name}[]`;
    case 'reference':
      // console.info({ [name]: type, ...obj })
      return name;
    default:
      console.warn('unexpected type', obj);
      return '';
  }
}

const _parseType = (obj) => {
  const { id, type, name, types, elementType } = { ...obj };
  switch(type) {
    case 'intrinsic':
      return { type, name };
    case 'union':
      return types.map(t => _parseType(t));
    case 'array':
      return { type, name:`${elementType.name}[]`};
    case 'reference':
      // console.info(obj)
      return { type, name, id };
    default:
      console.warn('unexpected type', obj);
      return {};
  }
}

/**
 * 
 * @param summary: Array
 * @returns string
 */
const parseSummary = (summary) => {
  // 일반 주석 라인은 제거한다.
  return summary?.filter(line => {
    return line.text.trim().indexOf('//') < 0;
  }).map(line => {
    switch (line.kind) {
      case 'inline-tag':
        return parseInlineTag(line);
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
const parseComment = (comment) => {
  const { summary, blockTags } = { ...comment };
  let lines = parseSummary(summary);
  // @config content
  const { config, fiddle, defaultBlock } = parseBlockTags(blockTags)
  if (fiddle) {
    lines += `\n${fiddle}`
  }

  return { config, defaultBlock, content: lines };
}
const setContent = (prop) => {
  // return prop.name;
  const { config, defaultBlock, content } = parseComment(prop.comment);
  return {
      name: prop.name,
      type: parseType(prop.type),
      dtype: _parseType(prop.type),
      header: config.join('|'), 
      content,
      defaultValue: prop.defaultValue,
      defaultBlock,
  };
}
// scan all classes
const visit = (obj) => {
  const { name, children, kindString, comment, extendedTypes = [], extendedBy = [] } = { ...obj };
  const { config, content } = parseComment(comment);
  switch (kindString) {
    case 'Class':
      classMap[name] = { 
        // header, content, prop, type,
        kindString,
        config,
        content,
        extended: extendedTypes.map(t => t.name),
        props: children.filter(c => 
          c.kindString == 'Property'
          && findTag(c.comment?.blockTags, '@config')
        ).map(setContent)
      };
      break;
    case 'Enumeration':
      // console.debug(obj);
      break;
    case 'Type alias':
      break;
  }

  children?.forEach(child => {
    visit(child);
  });

  return extendedTypes.map(type => type.name);
}

visit(model);


const json = JSON.stringify(classMap, null, 2)
fs.writeFileSync('./api/api.json', json, { encoding: 'utf-8'});

class MDGenerater {
  constructor(map) {
    this.classMap = map;
    this.docMap = {};
    this.DEBUG = false;
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
    const { name: _name, type: _type, prop } = param;
    const { header, name, type, dtype, content, defaultValue } = prop;
    if (dtype instanceof Array) {
      dtype.map(t => {
        if (t.type == 'reference') {
          console.warn('Not Implemented union references');
          // throw Error('Not Implemented union references');
        }
      });
    } else if (dtype?.type == 'reference') {
      const v = this.classMap[dtype.name];
      if (v) {
        if (v.kindString == 'Class') {
          
          let accessor = this.docMap;
          const keys = _type 
            ? [..._name.split('.').slice(1), _type, name]
            : [..._name.split('.').slice(1), name];
          console.debug({ keys });
          keys.forEach((key, i) => {
            if (!accessor[key]) {
              // is the last
              if (i == keys.length - 1) {
                console.debug( _name, _type, name, {v})
                const _content = `## ${name}\n${this._fixContent(content)}\n`
                  + this._makeProps({ name, type: _type, props: v.props });
                accessor[key] = { _content };
                // this._writeJsonFile('./api/' + keys.join('.') + '.json', accessor);
              } else {
                accessor[key] = { _content: '' };
              }
            }
            accessor = accessor[key];
          });
          // this._writeJsonFile('./api/' + [...keys, Date.now()].join('.') + '.json', this.docMap);
        }
      }
    }

    let md = `### ${name}${type ? ': ' + type : ''}\n`;
    if (header) md += `${header}  \n`;
    if (content) md += `${this._fixContent(content)}  \n`;
    if (defaultValue) md += `\`default: ${defaultValue}\`  \n`;
    return md;
  }

  /**
   * 
   * @iparam name:string config name
   * @iparam type:string attr value
   * @iparam props:any[] properties
   * @returns contents
   */
  _makeProps(param) {
    const { name, type, props } = param;
    const h = '## Properties\n';
    return [ h, ...props.map(prop => {
      return this._makeProp({ name, type, prop })
    })].join('\n');
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

  generate() {
    Object.entries(this.classMap).forEach(([key, value]) => {
      // series, axis type
      const { config, props, content } = value;
      config?.map(conf => {
        const { name, root, opt, label, type } = this._destructConfig(conf);
        // console.debug({ name, root, opt, label, type })
        // chart class
        // if (name == 'chart') {
        //   props.forEach(p => {
        //     this.docMap[p.name] = { _content: this._makeProp(p) };
        //   })
        // }
        
        // chart.{opt}
        if (opt && root == 'chart') {
          if (!this.docMap[opt]) this.docMap[opt] = { _content: '' };
  
          if (type) {
            const _content = `## ${opt}.${type}\n${this._fixContent(content)}\n`;
            this.docMap[opt] = { ...this.docMap[opt], _content: this.docMap[opt]._content += _content };
            const propContents = this._makeProps({ name, type, props});
            this.docMap[opt][type] = { ...this.docMap[opt][type], _content: _content + propContents };
          }
          else if (!['series', 'axis'].includes(opt)){
            const _content = `## ${opt}\n${this._fixContent(content)}\n`
              + this._makeProps({name, props});
            this.docMap[opt] = { ...this.docMap[opt], _content: this.docMap[opt]._content += _content };
          }
        }
      })
    });

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

  saveFile() {
    const root = 'docs/pages/docs';
    this._saveFile(root, this.docMap);
  }

  exportModel() {
    this._writeJsonFile('./api/doc.json', this.docMap);
  }
}

const generator = new MDGenerater(classMap)
generator.generate();
generator.saveFile();
generator.exportModel();
