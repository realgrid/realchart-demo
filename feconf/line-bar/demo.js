const config = {
  type: 'bar',
  templates: {
    '@series': {
      base: {
        pointLabel: {
          visible: true,
          position: 'inside'
        }
      }
    }
  },
  title: {
    text: 'Sales Performance and Gross Profit',
    style: {
      fontSize: '20px'
    }
  },
  xAxis: {
    grid: false,
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  },
  yAxis: {
    title: 'Unit: Million KRW',
    tick: {
      stepInterval: 50
    }
  },
  legend: {
    itemGap: 30,
    style: {
      fontSize: '12px'
    }
  },
  series: [{
    layout: 'stack',
    children: [{
      name: 'Purchasing Performance',
      data: [54, 73, 40, 61, 98, 72, 84, 73, 58, 84, 42, 83]
    }, {
      name: 'Gross Profit',
      style: {
        fill: '#FFC239',
        stroke: '#FFC239'
      },
      data: [8, 13, 6, 10, 23, 14, 23, 11, 11, 14, 8, 13]
    }]
  }, {
    type: 'line',
    name: 'Sales Target',
    pointLabel: false,
    style: {
      stroke: '##1A3A5F',
      strokeWidth: '2px'
    },
    data: [34, 53, 37, 91, 83, 105, 69, 80, 67, 121, 48, 75]
  }]
};
let chart;
function init() {
  console.log('RealChart v' + RealChart.getVersion());
  RealChart.setLogging(true);
  chart = RealChart.createChart(document, 'realchart', config);
}