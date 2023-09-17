/**
 * typedoc으로 가공한 json을 가지고 재가공한다.
 * 
 * export 한 클래스만 찾는다. export하지 않은 것을 포함하려면 typedoc plugin 필요.
 * https://github.com/tomchen/typedoc-plugin-not-exported
 */
import fs from 'fs';

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
      classMap[name] = { 
        header, content,
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

const derive = (className) => {
  const clazz = classMap[className];
  if (clazz) {
    const { extended, props } = clazz;
    // const ext = classMap[className].extended;
    const [lastExt] = extended.slice(-1);
    if (lastExt) {
      // extended.splice(extended.length, 0, 
      //   ...derive(lastExt).filter((e) => !extended.includes(e)));
      extended.push(...derive(lastExt).filter((e) => !extended.includes(e)));
      // const { props:_props } = _classMap[className];
      // props.push(...derive(l));
      return extended;

    }
    
  }

  return [className];
}

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
Object.entries(classMap).map(([key, value]) => {
  derive(key);
  // _classMap[key] = derive(key, { derived:[], props:[] });
  // console.debug(_classMap[key])
  console.debug('-------------------------')
})

const json = JSON.stringify(classMap, null, 2)
console.log(json);
// console.log(JSON.stringify(classMap, null, 2));
fs.writeFileSync('./api/api.json', json, { encoding: 'utf-8'})

/**
 * 
  "name": "SomeClass",
  "kind": 128,
  "kindString": "Class",
  "flags": {
    "isAbstract": true
  },
  "comment": {
    "summary": [
      {
        "kind": "inline-tag",
        "tag": "@link",
        "text": "position",
        "target": 2117
      },
      {
        "kind": "text",
        "text": "이 "
      },
      {
        "kind": "inline-tag",
        "tag": "@link",
        "text": "plot",
        "target": 2097
      },
      {
        "kind": "text",
        "text": "일 때, plot 영역의 하단 모서리와 legend의 간격.\n"
      },
      {
        "kind": "inline-tag",
        "tag": "@link",
        "text": "top",
        "target": 2122
      },
      {
        "kind": "text",
        "text": "이 지정되면 이 속성은 무시된다."
      }
    ],
    "blockTags": [
      {
        "tag": "@config",
        "content": []
      }
    ]
  },
  "extendedTypes": [
      {
        "type": "reference",
        "id": 859,
        "name": "Axis"
      }
    ],
  "extendedBy": [
    {
      "type": "reference",
      "id": 6867,
      "name": "BarSeries"
    },
    {
      "type": "reference",
      "id": 8963,
      "name": "EqualizerSeries"
    },
    {
      "type": "reference",
      "id": 11760,
      "name": "LollipopSeries"
    }
  ]
 */