# RealChart Documentation

## 개발

### 설치

```sh
> cd docs
> yarn
```

### 디버깅

```sh
> yarn dev
```

### 빌드

```sh
> yarn build
```

### 실행

```sh
> yarn start
```

## 메뉴 구분

### 가이드

- mdx로 가이드 작성

### API 문서

typedoc으로 문서 구조를 모델링한 다음 mdx로 렌더링  
`yarn dldoc` 클래스 모델과 문서를 생성한다. 아래 커맨드들을 모두 실행한다.
1. `npx typedoc` main.ts 변환
2. `docs/typedoc.js` main mdx 생성. `typedoc-nextra` 모듈을 사용한다.
3. `yarn tsdoc` 클래스 모델을 생성한다.
4. `node dldoc` 3.의 클래스 모델로 문서를 생성한다.

config로 노출하고자 하는 구성에 @config를 사용한다.
- export class에 @config로 구성 라벨을 설정한다.
  - series나 axis는 type 속성을 추가한다.  
  `@config chart.series[type=bar]`
  
- public property에 @config를 추가하여 config의 구성요소를 설정한다.
  - 상위 클래스에서 @config 설정한 properties를 가져온다.
  - 상속 받는 클래스이 properties를 override하여 @config를 설정하면, 설명도 같이 override한다.
  - `@default text`로 default값에 대한 설명을 추가한다.

- inline link
  - 설명에 `{@link config.series.line 라인}`과 같은 포맷으로 링크를 설정한다. 라벨을 지정하지 않으면 마지막 구분자(`line`)를 라벨로 한다.
  - class api 링크는 `sub.Class.Property`로 고정한다. 예를 들어,
    - global 링크는 `g.createChart`
    - class 링크는 `rc.RcAreaSeries`, class property 링크는 `rc.RcAreaSeries.name`. `rc.` 생략 가능
  - config 링크는 a.b#property로 '#'을 써서 속성임을 명시해줘야 한다.
  - 해당 코드는 `md.ts`의 `doclink`함수에 구현하고 있다. `dldoc.js`, `typedoc.js`에서 모두 사용한다.

- 상속 받는 클래스 속성의 설명(comment)에서 @link를 동적으로 변경
  - 부모/추상 클래스 속성의 설명에서 링크를 `{@link config.gauge.$guage.label 라벨}` 처럼 설정한다.
  - 상속 받는 클래스의 설명에서 `@configvar gauge=band`처럼 $gauge를 교체할 값을 설정한다.

- series, axis처럼 type을 갖는 클래스들의 공통 config 노출은 base 카테고리에 둔다.
  - 공통 속성을 노출하려면 노출하고자 하는 추상 클래스 주석에서 `@config chart.axis[base]`와 같이 type자리에 base를 설정한다.

- jsfiddle 링크를 추가하려면 `@fiddle url label...` 을 설정한다.

- **주의: config 설명에 double quotes(`""`)를 써서는 안된다.**

```
/**
 * foo class 설명
 * @fiddle demo/foo my example
 * @config chart.foo[type=baz]
 */
 export class foo {
  /**
  * bar 속성 설명
  * @config
  */
  bar: string
 }
```

- api는 typedoc 기본 기능을 사용한다.
```
@internal - 문서에 노출하지 않는다.
```

#### [typedoc-nextra](https://github.com/neplextech/typedoc-nextra)
packages/typedoc-nextra에 기존 코드를 개선하여 사용한다.
api 문서 페이지를 생성할 때, 사용된다. `yarn dbundle`로 build 후 docs/lib에 dist 결과를 복사한다.
(docs package.json에 필요한 모듈을 추가했다.)

### 데모

- web에서 데모에 보여줄 목록을 demo.config.json파일로 정의
- 