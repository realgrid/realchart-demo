/**
 * @demo
 *
 */
const config = {
  type: 'lollipop',
  title: {
    text: '2023 City Population Overview',
    style: {
      fontSize: '28px',
      fontWeight: 'bold'
    },
    gap: 30
  },
  xAxis: {
    title: 'Cities',
    categories: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose']
  },
  yAxis: {
    title: 'Population'
  },
  series: {
    pointLabel: {
      visible: true,
      offset: -40
    },
    marker: {
      radius: 30
    },
    data: [{
      value: 8419000
    }, {
      value: 3980000,
      color: '#66d0ff'
    }, {
      value: 2716000,
      color: '#ff5c35'
    }, {
      value: 2328000,
      color: '#ff9f00'
    }, {
      value: 1690000,
      color: '#ffd938'
    }, {
      value: 1584200,
      color: '#00ac69'
    }, {
      value: 1547200,
      color: '#91cc39'
    }, {
      value: 1426000,
      color: '#8fc6a9'
    }, {
      value: 1357000,
      color: '#c45db9'
    }, {
      value: 1035000,
      color: '#ef5e99'
    }]
  }
};
let chart;
function init() {
  console.log('RealChart v' + RealChart.getVersion());
  chart = RealChart.createChart(document, 'realchart', config);
}