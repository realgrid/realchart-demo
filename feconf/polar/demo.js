const config = {
  type: 'area',
  polar: true,
  title: 'Personal Skills Assessment',
  xAxis: {
    startAngle: -30,
    categories: ['Programming', 'Problem Solving', 'Communication', 'Project Management', 'Creativity', 'Teamwork']
  },
  body: {
    circular: false
  },
  series: {
    data: [8, 7, 6, 5, 7, 8]
  }
};
let chart;
function init() {
  console.log('RealChart v' + RealChart.getVersion());
  RealChart.setLogging(true);
  chart = RealChart.createChart(document, 'realchart', config);
}