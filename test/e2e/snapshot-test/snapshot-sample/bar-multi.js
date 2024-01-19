export const config = {
  title: '울산광역시 농산물 수출 현황 (2014-2021)',
  options: {},
  xAxis: {
    title: '년도',
    categories: [ '2017년', '2018년', '2019년', '2020년', '2021년' ],
    grid: true,
    label: { step: 1 }
  },
  yAxis: { title: '수출량(단위 만)' },
  series: [
    {
      pointWidth: 2,
      pointLabel: { visible: true, position: 'inside', effect: 'outline' },
      name: '배',
      data: [ 485, 550, 554, 233, 181 ]
    },
    {
      pointWidth: 2,
      pointLabel: { visible: true, position: 'inside', effect: 'outline' },
      name: '배즙',
      data: [ 230, 250, 250, 330, 260 ]
    },
    {
      pointWidth: 2,
      pointLabel: { visible: true, position: 'inside', effect: 'outline' },
      name: '단감',
      data: [ 60, 100, 70, 67, 28 ]
    }
  ]
}
