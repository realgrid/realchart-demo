export const config = {
  type: 'area',
  title: 'Area Group - Negative',
  options: {},
  xAxis: {
    title: '일일 Daily fat',
    categories: [ '쓰리엠', '아디다스', '디즈니', '이마트', '메리어트', '시세이도' ]
  },
  yAxis: { title: 'Vertical 수직축 Axis' },
  series: [
    {
      children: [
        {
          name: 'column1',
          pointLabel: { visible: true, position: 'inside', effect: 'outline' },
          data: [ 11, 22, 15, 9, 13, 27 ]
        },
        {
          name: 'column2',
          pointWidth: 2,
          pointLabel: { visible: true, position: 'inside', effect: 'outline' },
          data: [ 15, -19, 19, -6, 21, 21 ]
        },
        {
          name: 'column3',
          pointLabel: { visible: true, position: 'inside', effect: 'outline' },
          data: [ 13, 17, 15, -11, 23, 17 ]
        }
      ]
    }
  ]
}
export const tool = false