import fs from 'fs';
import path from 'path'

const text = fs.readFileSync('./api/api.json', { encoding: 'utf-8'});
const model = JSON.parse(text);
const classMap = {};

// scan all classes
const visit = (obj) => {
  const { name, children, kindString, comment, extendedTypes = [], extendedBy = [] } = { ...obj };
  
  switch (kindString) {
    case 'Class':
      classMap[name] = { 
        commment: destruct(comment),
        extends: extendedTypes.map(t => t.name),
        props: children.filter(c => c.kindString == 'Property')
          .map(c => {
            return {
              [c.name]: {
                comment: c.comment, 
                defaultValue: c.defaultValue
              }
            };
          })
      };
      break;
  }

  children?.forEach(child => {
    visit(child);
  });

  return extendedTypes.map(type => type.name);
}

// 
const destruct = (comment) => {
  const { summary=[], blockTags=[] } = { ...comment };
  return comment;
}

visit(model);

const derive = (className) => {
  if (classMap[className]) {
    let ext = classMap[className].extends;
    const [lastExt] = ext.slice(-1);
    if (lastExt) {
      ext.splice(ext.length, 0, ...derive(lastExt).filter((e) => !ext.includes(e)));
      return ext;
    }
  }

  return [className];
}

Object.entries(classMap).map(([key, value]) => {
  derive(key);

})

console.log(classMap);

// function extractInheritedClasses(clazz, jsonData, inheritedClasses = []) {
//   if (clazz.extendedTypes) {
//     for (const extendedType of clazz.extendedTypes) {
//       const extendedClass = jsonData.children.find((item) => item.name === extendedType.name);
//       if (extendedClass && extendedClass.kind === 128 /* Class */) {
//         inheritedClasses.push(extendedType.name);
//         extractInheritedClasses(extendedClass, jsonData, inheritedClasses);
//       }
//     }
//   }
// }

// // 클래스 상속 정보 추출 (깊은 상속 구조 처리)
// const classes = model.children.filter((item) => item.kind === 128 /* Class */);

// for (const clazz of classes) {
//   console.log(`Class: ${clazz.name}`);
//   const inheritedClasses = [];
//   extractInheritedClasses(clazz, jsonData, inheritedClasses);
//   if (inheritedClasses.length > 0) {
//     console.log(`Inherited Classes: ${inheritedClasses.join(', ')}`);
//   }
// }

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