/**
 * typedoc으로 가공한 json을 가지고 재가공한다. 따라서 typedoc이 먼저 실행되어야 한다.
 * 
 * export 한 클래스만 찾는다. export하지 않은 것을 포함하려면 typedoc plugin 필요.
 * https://github.com/tomchen/typedoc-plugin-not-exported
 */
import fs from 'fs';
import jsdom from 'jsdom';
const { JSDOM } = jsdom;

const text = fs.readFileSync('./api/model.json', { encoding: 'utf-8'});
const model = JSON.parse(text);
const classMap = {};

const JSFIDDLE_URL = 'https://jsfiddle.net/gh/get/library/pure/realgrid/realchart-demo/tree/master/';

const findTag = (tags, tag) => {
  return tags?.find(t => t.tag == tag );
}

const parseConfigTag = (tags) => {
  const config = findTag(tags, '@config');
  const { tag, content } = {...config};
  return content?.map(c => c.text).join(' ');
}
// jsfiddle inline으로 가정한다. @fiddle url label...
const parseFiddleTag = (tags) => {
  const fiddles = tags?.filter(t => t.tag == '@fiddle');
  return fiddles?.map(fiddle => {
    const [{text}] = fiddle.content;
    const [src, ...label] = text.split(' ');
    // console.debug({ src, label: label.join(' ') });
    return `- [${label.join(' ')}](${JSFIDDLE_URL + src})`;
  }).join('\n');
}

// defaultValue를 사용하되, @default tag가 있으면 설명을 추가한다.
const parseDefaultTag = (tags) => {
  return '';
}

const parseBlockTags = (tags) => {
  return {
    config: parseConfigTag(tags),
    fiddle: parseFiddleTag(tags),
    default: parseDefaultTag(tags),
  }
}

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
      return name;
    default:
      return '';
  }
}

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


const parseComment = (comment) => {
  const { summary, blockTags } = { ...comment };
  let lines = parseSummary(summary);
  // @config content
  const {config, fiddle } = parseBlockTags(blockTags)
  if (fiddle) {
    lines += `\n${fiddle}`
  }

  return [config, lines];
}
const setContent = (prop) => {
  // return prop.name;
  const [header, content] = parseComment(prop.comment);
  return {
      name: prop.name,
      type: parseType(prop.type),
      header, 
      content,
      defaultValue: prop.defaultValue
  };
}
// scan all classes
const visit = (obj) => {
  const { name, children, kindString, comment, extendedTypes = [], extendedBy = [] } = { ...obj };
  const [header, content] = parseComment(comment);
  switch (kindString) {
    case 'Class':
      const regex = /(\w+)/g;
      let matches = header?.matchAll(regex);
      matches = matches && [...matches].map(m => m[0]);
      // const prop = matches ? (matches[0] == 'chart' ? matches[1] : '') : '';
      const prop = matches && matches[0] == 'chart' ? matches[1] : '';
      // chart.series[type=bar] -> matches: ['chart','series','type','bar'];
      const type = matches?.length == 4 && matches[2] == 'type' ? matches[3] : '';
      classMap[name] = { 
        header, content, prop, type,
        extended: extendedTypes.map(t => t.name),
        props: children.filter(c => 
          c.kindString == 'Property'
          && findTag(c.comment?.blockTags, '@config')
        ).map(setContent)
      };
      break;
  }

  children?.forEach(child => {
    visit(child);
  });

  return extendedTypes.map(type => type.name);
}

visit(model);


const json = JSON.stringify(classMap, null, 2)
// console.log(json);
// console.log(JSON.stringify(classMap, null, 2));
fs.writeFileSync('./api/api.json', json, { encoding: 'utf-8'});

class MDGenerater {
  constructor(map) {
    this.classMap = map;
    this.docMap = {};
  }

  // <br> 태그 변환
  _fixContent(content) {
    // replace \n or double space
    return content.replace(/<br>/g, '\n');
  }

  _makeProps(props) {
    const header = '## Properties\n';
    return [ header, ...props.map(p => {
      const { name, type, header, content, defaultValue } = p;
      let md = `### ${name}${type ? ': ' + type : ''}\n`;
      if (header) md += `${header}  \n`;
      if (content) md += `${this._fixContent(content)}  \n`;
      if (defaultValue) md += `\`default: ${defaultValue}\`  \n`;
      return md;
    })].join('\n');
  }

  generate() {
    Object.entries(this.classMap).forEach(([key, value]) => {
      // series, axis type
      const { prop, type, props, content, header } = value;
      if (prop) {
        if (!this.docMap[prop]) this.docMap[prop] = { _content: '' };

        if (type) {
            // console.debug({ key, prop, type, len: props.length });
            const _content = `## ${prop}.${type}\n${this._fixContent(content)}\n`;
            this.docMap[prop] = { ...this.docMap[prop], _content: this.docMap[prop]._content += _content };
            const propContents = this._makeProps(props);
            this.docMap[prop][type] = _content + propContents;
        }
        else if (!['series', 'axis'].includes(prop)){
          console.log({ key, prop, type, header });
          const _content = `## ${prop}\n${this._fixContent(content)}\n`
            + this._makeProps(props);
          this.docMap[prop] = { ...this.docMap[prop], _content: this.docMap[prop]._content += _content };
        }
      }
    });


    return this.docMap;
  }

  saveFile() {
    Object.entries(this.docMap).forEach(([key, value]) => {
      // const content = typeof value === 'string' ? value : value.content;
      let dir = `docs/pages/docs/${key}`;
      !fs.existsSync(dir) && fs.mkdirSync(dir);
      fs.writeFileSync(`${dir}.mdx`, value._content , { encoding: 'utf-8'});
      Object.entries(value).forEach(([type, content]) => {
        if (type == '_content') return;
        // !fs.existsSync(filepath) && fs.mkdirSync(filepath);
        fs.writeFileSync(`${dir}/${type}.mdx`, content , { encoding: 'utf-8'});
      });
    });
  }
}

const generator = new MDGenerater(classMap)
generator.generate();
generator.saveFile();

/**
 * "kindString": "Property",
							"flags": {},
							"comment": {
								"summary": [
									{
										"kind": "text",
										"text": "false로 지정하면 차트 전체척으로 animation 효과를 실행하지 않는다."
									}
								],
								"blockTags": [
									{
										"tag": "@config",
										"content": []
									}
								]
							},
 */

