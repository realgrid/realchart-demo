const config = {
  options: {
    credits: {
      text: 'Source: Woman in the Workplace 2023, Mckinsey & Company Leanin.Org',
      url: 'https://www.mckinsey.com/featured-insights/2023-year-in-review/2023-the-year-in-charts',
      align: 'left',
      offsetY: -15
    },
    style: {
      backgroundColor: '#011927'
    }
  },
  templates: {
    series: {
      pointLabel: {
        visible: true,
        position: 'inside',
        numberFormat: '#.#'
      }
    }
  },
  title: {
    text: 'Representation in corporate role, by gender and race, 2023, % of employees (n = 276)',
    style: {
      fill: '#fff',
      fontWeight: 'bold',
      fontSize: '16px'
    }
  },
  // subtitle: {
  //     text: '(2020년 - 2025년)',
  //     style: {
  //         fill: '#0056B3',
  //         fontWeight: 'bold',
  //         fontSize: '22px'
  //     },
  // },
  body: {
    annotations: [{
      text: '<t style="font-size: 20pt">48%</t><br>woman',
      offsetX: '-2w',
      offsetY: '-0.5h',
      x1: 0,
      y1: 63,
      front: true,
      style: {
        fill: '#fff'
      }
    }, {
      type: 'shape',
      shape: 'rectangle',
      x1: 0,
      y1: 34,
      width: -140,
      y2: 81,
      style: {
        fill: 'none',
        stroke: '#77838B'
      }
    }, {
      text: '<t style="font-size: 20pt">28%</t><br>woman',
      offsetX: '1w',
      // offsetY: '-0.5h',
      x1: 5,
      y1: 79,
      front: true,
      style: {
        fill: '#fff'
      }
    }, {
      type: 'shape',
      shape: 'rectangle',
      x1: 5,
      y1: 57,
      width: 140,
      y2: 85,
      style: {
        fill: 'none',
        stroke: '#77838B'
      }
    }]
  },
  legend: {
    // layout: 'vertical',
    // itemsPerLine: 2,
    lineGap: 40,
    itemGap: 4,
    reversed: true,
    style: {
      fill: '#fff'
    }
  },
  xAxis: {
    categories: ['Entity Level', 'Manager', 'Senior\nmanager/\ndirector', 'Vice\npresident', 'Senior\nvice\npresident', 'C-suite'],
    label: {
      style: {
        fill: '#fff'
      }
    },
    padding: 2
  },
  yAxis: {
    visible: false,
    grid: false,
    strictMax: 102
  },
  series: [{
    layout: 'stack',
    // colorByPoint: true,
    // pointColors: ['#ccc', 'var(--color1)', 'var(--color-2)', '#ddd' ],
    children: [{
      name: 'White men',
      color: '#66767E',
      template: 'series',
      data: [34, 42, 49, 53, 58, 57]
    }, {
      name: 'White women',
      color: '#66CEF4',
      template: 'series',
      data: [29, 27, 27, 26, 21, 22]
    }, {
      name: 'Women of color',
      color: '#00B4EF',
      template: 'series',
      data: [18, 13, 10, 7, 7, 6]
    }, {
      name: 'Men of color',
      color: '#475A63',
      template: 'series',
      data: [18, 16, 16, 14, 15, 15]
    }
    // 99, 98, 102, 
    ]
  }]
};

let animate = false;
let chart;
function init() {
  console.log('RealChart v' + RealChart.getVersion());
  // RealChart.setDebugging(true);
  RealChart.setLogging(true);
  chart = RealChart.createChart(document, 'realchart', config);
}