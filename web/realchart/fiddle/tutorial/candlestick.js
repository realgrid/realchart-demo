/**
 * @demo
 *
 */

const stockData = data
  .sort((a, b) => a.date > b.date)
  .filter((r) => r.date >= '2021-04-01');
const config = {
  title: {
    text: 'WTI (Woori Tech Inc.)',
    align: 'left',
    style: {
      fill: '#666',
      fontWeight: 700,
    },
  },
  annotations: [
    {
      offsetX: 280,
      offsetY: 3,
      text: '81,400',
      style: {
        fontSize: '16pt',
        fontWeight: 700,
        fill: '#000',
      },
    },
    {
      offsetX: 355,
      offsetY: 8,
      text: '-1,200 (-0.01%)',
      style: {
        fontSize: '12pt',
        fontWeight: 700,
        fill: 'var(--color-3)',
      },
    },
  ],
  legend: !true,
  xAxis: {
    visible: true,
    type: 'time',
    tick: {
      visible: true,
      stepInterval: '1w',
    },
    label: {
      visible: true,
      timeFormat: 'M/d, yyyy',
    },
  },
  yAxis: {
    crosshair: true,
    tick: {
      stepInterval: 1000,
    },
  },
  seriesNavigator: {
    visible: true,
    series: {
      type: 'bar',
    },
  },
  series: {
    template: '',
    padding: 1,
    pointPadding: 0.1,
    type: 'candlestick',
    pointLabel: !true,
    xField: 'date',
    openField: 'openprc',
    highField: 'highprc',
    lowField: 'lowprc',
    closeField: 'closeprc',
    data: stockData,
    declineStyle: {
      fill: 'var(--color-3)',
    },
    style: {
      fill: 'var(--color-1)',
      stroke: 'black',
    },
  },
};

let chart;

function addPoints() {
  chart.series.addPoint({
    date: '2021-06-03',
    openprc: 80500,
    highprc: 81300,
    lowprc: 80100,
    closeprc: 80600,
    trdamnt: 14058401,
  });
}
function removePoint() {}
function init() {
  console.log('RealChart v' + RealChart.getVersion());
  RealChart.setLogging(true);

  chart = RealChart.createChart(document, 'realchart', config);
}
