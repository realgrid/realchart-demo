export const config = {
  options: {},
  title: 'Pattern Fill',
  assets: [
    {
      type: 'pattern',
      id: 'pattern-1',
      pattern: 0,
      style: { stroke: 'red', fill: 'red' }
    }
  ],
  legend: true,
  body: { style: { stroke: 'none' } },
  xAxis: { title: { text: '수정구' }, crosshair: true },
  yAxis: { title: { text: '전체 인구수' } },
  series: {
    pointLabel: { visible: true, effect: 'outline', style: {} },
    data: [
      [ '신흥1동', 12904 ],
      [ '신흥2동', 19796 ],
      [ '신흥3동', 10995 ],
      [ '태평1동', 14625 ],
      [ '태평2동', 14627 ],
      [ '태평3동', 12649 ],
      [ '태평4동', 12279 ]
    ],
    style: { fill: 'url(#pattern-1)' }
  }
}
