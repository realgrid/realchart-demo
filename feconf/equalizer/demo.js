const config = {
  type: 'equalizer',
  title: 'Seoul City Average Air Quality Index by Year',
  xAxis: {
    title: 'Seoul City',
    categories: ['2014', '2015', '2016', '2017', '2018', '2019']
  },
  yAxis: {
    title: '<t style="fill:#333;font-size:1.2em;">Air Quality Index, AQI</t>'
  },
  series: {
    pointLabel: {
      visible: true,
      effect: 'outline'
    },
    data: [155, 138, 122, 133, 114, 113]
  }
};
let chart;
function init() {
  console.log('RealChart v' + RealChart.getVersion());
  RealChart.setLogging(true);
  chart = RealChart.createChart(document, 'realchart', config);
}