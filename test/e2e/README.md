## 주의사항

### ElementHandle 의 boundingBox는 오차가 발생한다.
* Elements from child frames return the bounding box relative to the main frame, unlike the
   * [Element.getBoundingClientRect](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect).

```
const point = await page.$('.rct-point');
const pointBox = await point?.boundingBox();
```

### getComputedStyle
* webkit에서 CSSStyleDeclaration 타입 값을 제대로 가져오지 못한다.

### strokeWidth를 설정하면 3배 크기의 값으로 여백이 발생한다.

