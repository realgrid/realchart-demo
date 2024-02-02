export const config = {
  options: {},
  title: '연도별 서울시 평균 대기질 지수',
  xAxis: {
    title: '서울시',
    categories: [ '`14', '`15', '`16', '`17', '`18', '`19' ],
    grid: { visible: true }
  },
  yAxis: {
    title: '대기질 지수<br><t style="fill:gray;font-size:0.9em;">(Air Quality Index, AQI)</t>'
  },
  series: {
    type: 'lollipop',
    pointLabel: { visible: true, style: { fill: 'black' } },
    data: [ 155, 138, 122, 133, 114, 113 ]
  }
}
export const tool = false