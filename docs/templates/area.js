export const config = {
  type: 'area',
  title: '년도 별 수학검정시험 재학생 인원',
  templates: {
    series: { marker: { visible: false }, xStart: '1994', xStep: '1y' }
  },
  xAxis: { type: 'time' },
  series: [
    {
      template: 'series',
      name: '재학생',
      marker: {},
      pointLabel: {},
      data: [
        521806, 496617, 477960, 526833,
        545023, 613376, 623130, 631745,
        603238, 541662, 482089, 476129,
        435538, 422310, 425396, 446597,
        448472, 532436, 541880, 526418,
        510972, 509081, 495027, 482054,
        459342, 444873, 448111, 394024,
        346673, 360710, 350239
      ]
    }
  ]
}
export const tool = false