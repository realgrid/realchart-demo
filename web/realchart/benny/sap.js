const startYear = 2020;

const appendX = (v, i) => {
  const year = startYear + Math.floor(i / 4);
  const q = i % 4;
  return [`${year} Q${q + 1}`, v];
};

const quarters = Array(12).fill().map((_, i) => {
  const year = startYear + Math.floor(i / 4);
  const q = i % 4;
  return `${year} Q${q + 1}`;
})

const salesCoke = [92, 91, 94, 93, 90, 92, 98, 110, 143, 146, 143, 153.03].map(v => v * 1.3);
const salesCb = [70, 75, 78, 83, 83, 88, 94, 100, 120, 114, 120, 132.01].map(v => v*1.2);
const salesOthers = [80, 78, 82, 90, 100, 95, 114, 105, 100, 90, 78, 80.41].map(v => v*1.3);

// colors
const primary = '#219ebc';

// const idx = year - startYear;
// salesAlcohol.slice(idx * 4, (idx+1) * 4)
const lines = [
    { 
      template: 'series', 
      type: 'line',
      name: 'Coke', 
      style: {
        stroke: 'var(--color-5)'
      },
      data: salesCoke,
    },
    { 
      template: 'series', 
      type: 'line',
      name: 'Carbone', 
      style: {
        stroke: 'var(--color-2)'
      },
      data: salesCb,
    },
    { 
      template: 'series', 
      type: 'line',
      name: 'Others', 
      style: {
        stroke: 'var(--color-8)'
      },
      data: salesOthers,
    }
  ];

const lineConfig = {
  options: {
    credits: {
      visible: false,
    }
  },
  templates: {
    series: {
      marker: false,
      pointLabel: {
        visibleCallback: (args) => {
          // console.debug(args);
          // args.series
          return args.count - 1 == args.index;
        },
        style: {
          fill: '#999'
        }
      },
      style: {
        strokeWidth: 4,
      }
    },
    xAxis: {
      type: 'category',
      categories: quarters,
      line: false,
      grid: false,
      label: {
        textCallback: ({index}) => {
          const [year, q] = quarters[index].split(' ');
          return q == 'Q1' ? `${q}<br>${year}` : q
        },
        style: {
          // textAlign: 'left',
          fontWeight: 700,
          fontSize: '11pt',
          fill: primary,
          textAnchor: 'middle',
        }
      }
      // padding: -0.5,
    },
    annoAmount: {
      style: {
        fontSize: '24pt',
        fontWeight: 500,
        fill: '#aaa'
      }
    },
    annoLabel: {
      style: {
        fontSize: '12pt',
        fontWeight: 500,
        fill: primary,
      }
    }
  },
  body: {
    annotations: [
      {
        template: 'annoAmount',
        text: "71M",
        offsetX: 416,
        offsetY: -100,
      },
      {
        template: 'annoLabel',
        text: `Total Amount in ${startYear + 1}`,
        offsetX: 416,
        offsetY: -60,
      },
      {
        template: 'annoAmount',
        text: "94M",
        offsetX: 800,
        offsetY: -100,
      },
      {
        template: 'annoLabel',
        text: `Total Amount in ${startYear + 2}`,
        offsetX: 800,
        offsetY: -60,
      }
    ],
  },
  legend: {
    visible: true,
    // markerVisible: false,
    location: 'top',
    align: 'left',
    // alignBase: 'parent',
    itemsAlign: 'start',
    style: {
      fontSize: '10pt',
      fontWeigth: 700,
      fill: primary,
      strokeWidth: 4,
    },
  },
  title: {
    align: 'left',
    text: '3 Year Status for<br>Zero Sugar Products',
    gap: 10,
    style: {
        fill: primary,
        fontWeight: 700,
        fontSize: '20px',
        padding: '2px 5px',
    }
  },
  subtitle: {
    align: 'left',
    text: 'unit: mUSD',
    style: {
        fill: '#999',
        fontSize: '14px',
        fontWeight: 'bold',
        marginBottom: '10px'
    }
  },
  xAxis: {
    template: 'xAxis',
    type: 'category',
  },
  yAxis: {
    type: 'linear',
    grid: false,
    label: false,
    strictMin: 70,
    strictMax: 200,
    padding: 0,
  },
  series: lines,
}


const generate = (max, ne = false) => {
  return Array(4).fill().map(() => {
    return Math.fround(0.5 + Math.random() * max) * (ne && Math.random() > 0.5 ? -1 : 1);
  })
}

// compared to PY. Better Q1 Results.
const data14 = generate(1, true);
const data15 = generate(2, true);
const data16 = generate(4);

const dataA14 = generate(3);
const dataB14 = generate(2);

const dataA15 = generate(3);
const dataB15 = generate(2);

const dataA16 = generate(5);
const dataB16 = generate(4);

const bar14 = {
  template: 'bar',
  xAxis: 3,
  yAxis: 3,
  data: data14
}

const barA14 = {
  template: 'barA',
  style: {
    fill: 'none',
    stroke: 'var(--color-5)',
  },
  data: dataA14
}

const barB14 = {
  template: 'barB',
  style: {
    fill: 'var(--color-5)',
    stroke: 'var(--color-5)',
  },
  data: dataB14
}

const bar15 = {
  template: 'bar',
  xAxis: 4,
  yAxis: 4,
  data: data15
}

const barA15 = {
  template: 'barA',
  data: dataA15
}

const barB15 = {
  template: 'barB',
  data: dataB15
}

const bar16 = {
  template: 'bar',
  xAxis: 5,
  yAxis: 5,
  data: data16
}

const color16 = 'var(--color-6)'
const barA16 = {
  template: 'barA',
  style: {
    fill: 'none',
    stroke: color16,
  },
  data: dataA16
}

const barB16 = {
  template: 'barB',
  style: {
    fill: color16,
    stroke: color16,
  },
  data: dataB16
}

const bar14Group = {
  type: 'bar',
  xAxis: 0,
  yAxis: 0,
  groupPadding: 0.2,
  children: [
    barA14, barB14, 
  ]
}

const bar15Group = {
  type: 'bar',
  xAxis: 1,
  yAxis: 1,
  groupPadding: 0.2,
  children: [
    barA15, barB15,
  ]
}

const bar16Group = {
  type: 'bar',
  xAxis: 2,
  yAxis: 2,
  groupPadding: 0.2,
  children: [
    barA16, barB16,
  ]
}


const cols = 3;
const rows = 2;
const barConfig = {
  title: false,
  templates: {
    xAxis: {
      type: 'category',
      line: !true,
      label: !true,
      grid: !true,
      // position: 'opposite'
      style: {
        // strokeDasharray: '0 1 0 1',
      }
    },
    yAxis: {
      type: 'linear',
      line: !true,
      label: !true,
      grid: {
        visible: true,
        style: {
          // stroke: '#555',
          strokeWidth: 2,
        },
        front: true,
      },
      strictMin: -2,
      strictMax: 6,
      padding: 0,
    },
    bar: {
      type: 'bar',
      pointLabel: {
        visible: true,
        // numberFormat: '#.00',
        // suffix: '%',
        // position: 'inside',
        // style: {
        //   fill: 'var(--color-7)'
        // },
        styleCallback: ({y}) => {
          // return y < 0 ? { fill: 'var(--color-3)' } : null;
          return y < 0 ? { fill: 'var(--color-3)' } : { fill: 'var(--color-7)'};
        }
      },
      style: {
        fill: 'var(--color-7)',
        stroke: 'var(--color-7)'
      },
      belowStyle: {
        fill: 'var(--color-3)',
        stroke: 'var(--color-3)'
      },
    },
    // target?
    barA: {
      template: 'bar',
      style: {
        fill: 'none',
        strokeWidth: 2,
      },
      pointLabel: true,
      pointWidth: 5,
    },
    // actual
    barB: {
      template: 'bar',
      pointLabel: false,
      pointPadding: -1.4,
    },
    
  },
  // inverted: true,
  options: {
      // animatable: false
  },
  split: {
      visible: true,
      cols,
      rows,
  },
  legend: {
      visible: false,
  },
  xAxis: Array(rows).fill().reduce((acc, curr, i) => {
    return acc.concat(Array(cols).fill().map((_, j) => {
      return {
        template: 'xAxis',
        row: i,
        col: j,
      };
    }));
  }, []),
  // yAxis: [pieYAxis, barYAxis],
  yAxis: Array(rows).fill().reduce((acc, curr, i) => {
    return acc.concat(Array(cols).fill().map((_, j) => {
      return {
        template: 'yAxis',
        row: i,
        col: j,
      }
    }));
  }, []),
  series: [
    bar14Group,
    bar15Group,
    bar16Group,
    bar14,
    bar15,
    bar16,
  ]
}

const config = {
  title: false,
  templates: {

  },
  xAxis: {
    type: 'category',
    line: false,
    grid: false,
    label: false,
  },
  yAxis: {
    template: 'yAxis',
    // padding: 0.01,
    strictMin: -0.8,
  },
  series: {
    template: 'bar',
    style: {
      fill: 'var(--color-5)',
      stroke: 'var(--color-5)',
    },
    data: data16,
  }
}

console.debug(config);

let animate = false;
let chart;

function setActions(container) {
  createCheckBox(container, 'Debug', function (e) {
      RealChart.setDebugging(_getChecked(e));
      chart.render();
  }, false);
  createCheckBox(container, 'Always Animate', function (e) {
      animate = _getChecked(e);
  }, false);
  createButton(container, 'Test', function(e) {
      alert('hello');
  });
  createListBox(container, "Line Type", ['default', 'spline', 'step'], function (e) {
      config.series.lineType = _getValue(e);
      chart.load(config, animate);
  }, 'default');
  createCheckBox(container, 'Inverted', function (e) {
      config.inverted = _getChecked(e);
      chart.load(config, animate);
  }, false);
  createCheckBox(container, 'X Reversed', function (e) {
      config.xAxis.reversed = _getChecked(e);
      chart.load(config, animate);
  }, false);
  createCheckBox(container, 'Y Reversed', function (e) {
      config.yAxis.reversed = _getChecked(e);
      chart.load(config, animate);
  }, false);
}

function init() {
  console.log('RealChart v' + RealChart.getVersion());
  // RealChart.setDebugging(true);

  linechart = RealChart.createChart(document, 'linechart', lineConfig);
  // groupchart = RealChart.createChart(document, 'realchart', config);
  barchart = RealChart.createChart(document, 'barchart', barConfig);
  setActions('actions')
}