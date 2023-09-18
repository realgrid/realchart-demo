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
const parseReturnTag = (tags) => {

}

const parseBlockTags = (tags) => {
  return {
    config: parseConfigTag(tags),
    fiddle: parseFiddleTag(tags),
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
  return summary?.map(line => {
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
  const [header, content] = parseComment(comment)
  switch (kindString) {
    case 'Class':
      const regex = /(\w+)/g;
      let matches = header?.matchAll(regex);
      matches = matches && [...matches].map(m => m[0]);
      const prop = header ? (matches[0] == 'chart' ? matches[1] : header) : '';
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
    this.docMap = {
      series: {
        _content: '',
      },
      axis: {
        _content: '',
      },
      // legend: {},
      // options: {},
    };
  }

  // <br> 태그 변환
  _fixContent(content) {
    // replace \n or double space <space><space>
    return content.replace(/<br>/g, '\n');
  }

  _makeProps(props) {
    const header = '## Properties\n';
    return [ header, ...props.map(p => {
      const { name, type, header, content, defaultValue } = p;
      let md = `### ${name}${type ? ': ' + type : ''}\n`;
      if (header) md += `${header}\n`;
      if (content) md += `${this._fixContent(content)}\n`;
      return md;
    })].join('\n');
  }

  generate() {
    Object.entries(this.classMap).forEach(([key, value]) => {
      // series, axis type
      const { prop, type, props, content } = value;
      if (prop && type) {
        // console.debug({ key, prop, type, len: props.length });
        const _content = `## ${prop}.${type}\n${this._fixContent(content)}\n`;
        this.docMap[prop] = { ...this.docMap[prop], _content: this.docMap[prop]._content += _content };
        const propContents = this._makeProps(props);
        this.docMap[prop][type] = _content + propContents;
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

class HtmlGenerator {
  dom = new JSDOM(`<!DOCTYPE html>
  <html>
  <body>
    <header><h2>RealChart</h2></header>
    <nav></nav>
    <section></section>
    <aside></aside>
    <footer></footer>
  </body>
  </html>
  `);

  constructor(map) {
    this.classMap = map;
  }

  generate() {
    const doc = dom.window.document;
    const body = doc.body;
    const nav = body.querySelector('nav');

    const rootList = doc.createElement('ul');
    rootList.innerHTML = '>';
    const seriesList = doc.createElement('ul');
    seriesList.innerHTML = 'series>';
    const axisList = doc.createElement('ul');
    axisList.innerHTML = 'axis>';

    nav.appendChild(rootList);
    nav.appendChild(seriesList);
    nav.appendChild(axisList);

    const makePropList = (props) => {
      const ul = doc.createElement('ul');
      props.forEach(p => {
        let li = doc.createElement('li');
        li.innerHTML = p.name
        ul.appendChild(li);
      });
      return ul;
    }

    Object.entries(this.classMap).forEach(([key, value]) => {
      const { category } = value;
      let li = doc.createElement('li');
      // %caution% innerText is not implemented in jsdom.
      li.innerHTML = key;
      li.appendChild(makePropList(value.props));
      switch (category) {
        case 'series':
          seriesList.appendChild(li);
          break;
        case 'axis':
          axisList.appendChild(li);
          break;
        default:
          rootList.appendChild(li);
          break;
      }
    });
  }
  
  saveFile(path='./api/index.html') {
    const doc = dom.window.document;
    fs.writeFileSync(path, doc.documentElement.outerHTML, { encoding: 'utf-8'});
  }
}

