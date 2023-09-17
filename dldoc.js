/**
 * typedoc으로 가공한 json을 가지고 재가공한다.
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


const findTag = (tags, tag) => {
  return tags?.find(t => t.tag == tag );
}

const parseBlockTags = (tags) => {
  const config = findTag(tags, '@config');
  const { tag, content } = {...config};
  // @returns
  return content?.map(c => c.text).join(' ');
}

const parseSummary = (summary) => {
  return summary?.map(line => {
    switch (line.kind) {
      case 'inline-tag':
        return `{${line.tag} ${line.text}}`
      case 'text':
        return line.text
    }
  }).join(' ');
}
const parseComment = (comment) => {
  const { summary, blockTags } = { ...comment };
  const lines = parseSummary(summary);
  // @config content
  const config = parseBlockTags(blockTags)
  return [config, lines];
}
const setContent = (prop) => {
  // return prop.name;
  const [header, content] = parseComment(prop.comment);
  return {
      name: prop.name,
      type: prop.type.name,
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
      const category = header ? (matches[0] == 'chart' ? matches[1] : header) : '';
      classMap[name] = { 
        header, content, category,
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

// const derive = (className) => {
//   const clazz = classMap[className];
//   if (clazz) {
//     const { extended, props } = clazz;
//     // const ext = classMap[className].extended;
//     const [lastExt] = extended.slice(-1);
//     if (lastExt) {
//       // extended.splice(extended.length, 0, 
//       //   ...derive(lastExt).filter((e) => !extended.includes(e)));
//       extended.push(...derive(lastExt).filter((e) => !extended.includes(e)));
//       // const { props:_props } = _classMap[className];
//       // props.push(...derive(l));
//       return extended;

//     }
    
//   }

//   return [className];
// }

// const _derive = (className, agg) => {
//   // const clazz = JSON.parse(JSON.stringify(classMap[className]));
//   const clazz = classMap[className] ?? {};
//   const { extended=[], props=[] } = clazz;
//   const [lastExt] = extended.slice(-1);
//   if (lastExt) {
//     console.debug(lastExt, agg.props.length);
//     return derive(lastExt, {
//       ...agg,
//       derived: [...agg.derived, lastExt],
//       // props: [...agg.props, ...props]
//       props: clazz.props,
//     });
//   }
//   return agg;
// }

// const _classMap = JSON.parse(JSON.stringify(classMap));
// const _classMap = {};
// Object.entries(classMap).map(([key, value]) => {
//   derive(key);
//   // _classMap[key] = derive(key, { derived:[], props:[] });
//   // console.debug(_classMap[key])
//   console.debug('-------------------------')
// })

const json = JSON.stringify(classMap, null, 2)
// console.log(json);
// console.log(JSON.stringify(classMap, null, 2));
fs.writeFileSync('./api/api.json', json, { encoding: 'utf-8'})


const dom = new JSDOM(`<!DOCTYPE html>
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

Object.entries(classMap).forEach(([key, value]) => {
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

fs.writeFileSync('./api/index.html', doc.documentElement.outerHTML, { encoding: 'utf-8'});