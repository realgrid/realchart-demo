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

- jsfiddle 링크를 추가하려면 `@fiddle url label...` 을 설정한다.
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

### 데모

- web에서 데모에 보여줄 목록을 demo.config.json파일로 정의
- 