## 주의사항

### ElementHandle 의 boundingBox는 오차가 발생한다.
* Elements from child frames return the bounding box relative to the main frame, unlike the
   * [Element.getBoundingClientRect](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect).

```
const point = await page.$('.rct-point');
const pointBox = await point?.boundingBox();
```

### strokeWidth를 설정하면 3배 크기의 값으로 여백이 발생한다.