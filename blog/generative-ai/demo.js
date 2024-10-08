const categories = ['Office support', 'Production work', 'Food services', 'Mechanical installation and repair', 'Community services', 'Agriculture', 'Business and legal professionals', 'Customer service and sales', 'STEM professionals', 'Educator and workfoce training', 'Builders', 'Creatives and arts management', 'Transportation services', 'Managers', 'Health aides, technicians, and wellness', 'Health professionals', 'Property maintenance'];
const data = [[66, 87], [73, 82], [70, 78], [61, 67], [39, 65], [59, 63], [32, 62], [45, 57], [28, 57], [15, 54], [49, 53], [28, 53], [42, 49], [27, 44], [34, 43], [29, 43], [29, 37]];
const singleData = data.map(([min, max]) => {
  return max;
});
const config = {
  templates: {
    yAxis: {
      line: true,
      strictMin: 0,
      strictMax: 100,
      tick: {
        stepInterval: 20
      }
    }
  },
  title: '<b>Technical automation potential with and without generative AI</b><br><b>by occupation group in 2023</b>',
  inverted: true,
  legend: false,
  xAxis: {
    type: 'category',
    reversed: true,
    categories,
    label: {
      style: {
        fill: '#000'
      }
    }
  },
  yAxis: [{
    template: 'yAxis'
  }, {
    template: 'yAxis',
    position: 'opposite'
  }],
  series: [{
    type: 'bar',
    data: singleData,
    color: '#66d0ff',
    hoverEffect: 'none',
    yAxis: 1
  }, {
    type: 'errorbar',
    pointLabel: {
      visible: true,
      offset: 10
      // distance: 10
    },
    hoverEffect: 'none',
    data
  }, {
    type: 'line',
    data: singleData,
    marker: {
      radius: 6,
      style: {
        stroke: '#000',
        strokeWidth: 3,
        fill: '#fff'
      }
    },
    hoverEffect: 'none',
    style: {
      strokeWidth: 0
    }
  }],
  options: {
    pointHovering: false,
    credits: {
      align: 'left',
      text: 'Source: Mckinsey Global Institute analysis',
      url: 'https://www.mckinsey.com/featured-insights/2023-year-in-review/2023-the-year-in-charts'
    }
  }
};
function init() {
  console.log(RealChart.getVersion());
  // RealChart.setDebugging(true);
  RealChart.setLogging(true);
  chart = RealChart.createChart(document, 'realchart', config);
}