const config = {
  type: 'bump',
  templates: {
    '@series': {
      base: {
        pointLabel: true,
        marker: false,
        style: {
          strokeWidth: '5px',
          strokeLinecap: 'round'
        }
      }
    }
  },
  title: {
    text: 'Monthly Sales Volume Trends for Products (6 Months)',
    style: {
      fontWeight: 'bold'
    }
  },
  xAxis: {
    title: 'Month',
    padding: -0.2,
    tick: true,
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  },
  yAxis: {
    type: 'category',
    title: 'Sales Volume',
    grid: false,
    label: false
  },
  series: {
    children: [{
      name: 'Product A',
      data: [150, 170, 250, 220, 180, 210]
    }, {
      name: 'Product B',
      data: [180, 200, 160, 190, 210, 200]
    }, {
      name: 'Product C',
      data: [140, 150, 180, 170, 190, 220]
    }, {
      name: 'Product D',
      data: [130, 160, 180, 170, 190, 220]
    }]
  }
};
let chart;
function init() {
  console.log('RealChart v' + RealChart.getVersion());
  RealChart.setLogging(true);
  chart = RealChart.createChart(document, 'realchart', config);
}