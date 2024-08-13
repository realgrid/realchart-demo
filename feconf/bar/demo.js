const config = {
  type: 'bar',
  title: 'Agricultural Exports from Ulsan Metropolitan City (2014-2021)',
  templates: {
    '@series': {
      base: {
        pointWidth: 2,
        pointLabel: {
          visible: true,
          position: 'inside',
          effect: 'outline'
        }
      }
    }
  },
  xAxis: {
    title: 'Year',
    grid: true,
    categories: ['2017', '2018', '2019', '2020', '2021']
  },
  yAxis: {
    title: 'Export Volume (Unit: 10,000)'
  },
  series: [{
    name: 'Pear',
    data: [485, 550, 554, 233, 181]
  }, {
    name: 'Pear Juice',
    data: [230, 250, 250, 330, 260]
  }, {
    name: 'Persimmon',
    data: [60, 100, 70, 67, 28]
  }]
};
let chart;
function init() {
  console.log('RealChart v' + RealChart.getVersion());
  RealChart.setLogging(true);
  chart = RealChart.createChart(document, 'realchart', config);
}