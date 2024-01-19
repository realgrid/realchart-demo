export const config = {
  options: {},
  title: 'Pattern Fill',
  assets: [
    {
      type: 'pattern',
      id: 'pattern-0',
      pattern: 0,
      style: { stroke: 'black' }
    },
    { type: 'pattern', id: 'pattern-1', pattern: 1 },
    { type: 'pattern', id: 'pattern-2', pattern: 2 },
    { type: 'pattern', id: 'pattern-3', pattern: 3 },
    { type: 'pattern', id: 'pattern-4', pattern: 4 },
    { type: 'pattern', id: 'pattern-5', pattern: 5 },
    { type: 'pattern', id: 'pattern-6', pattern: 6 },
    { type: 'pattern', id: 'pattern-7', pattern: 7 },
    { type: 'pattern', id: 'pattern-8', pattern: 8 },
    { type: 'pattern', id: 'pattern-9', pattern: 9 },
    { type: 'pattern', id: 'pattern-10', pattern: 10 },
    { type: 'pattern', id: 'pattern-11', pattern: 11 },
    { type: 'pattern', id: 'pattern-12', pattern: 12 }
  ],
  legend: true,
  body: { style: { stroke: 'none' } },
  xAxis: { title: { text: '수정구' } },
  yAxis: { title: { text: '전체 인구수' } },
  tooltip: false,
  series: [
    {
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
      style: { fill: 'url(#pattern-0)' }
    },
    {
      type: 'pie',
      centerX: '80%',
      centerY: '40%',
      radius: '30%',
      legendByPoint: true,
      pointStyleCallback: ({index}) => {return {fill: `url(#pattern-${index})`,stroke: '#FFF',strokeWidth: '4px'}},
      data: [
        1, 1, 1, 1, 1,
        1, 1, 1, 1, 1,
        1, 1
      ]
    }
  ]
}
