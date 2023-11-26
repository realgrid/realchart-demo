const pointLabel = {
  visible: true,
  numberFormat: '#.00',
  suffix: '%',
  position: 'inside',
};

const appendX = (v, i) => {
  const year = 2014 + Math.floor(i / 4);
  const q = i % 4;
  return [`${year} Q${q + 1}`, v];
};

const salesAlcohol = [92, 91, 94, 93, 90, 92, 98, 110, 143, 146, 143, 153.03].map(appendX);
const salesJuice = [70, 75, 78, 85, 81, 88, 94, 100, 120, 114, 100, 102.01].map(appendX);
const salesOthers = [80, 78, 82, 90, 100, 95, 114, 105, 100, 90, 78, 80.41].map(appendX);

const lineSeries = {
  type: 'line',
  marker: false,
  style: {
    strokeWidth: 4,
  }
}
const lines = [
  { ...lineSeries, name: 'Alcohol', 
    style: {
      ...lineSeries.style,
      stroke: 'var(--color-5)'
    },
    data: salesAlcohol },
  { ...lineSeries, name: 'Juice', data: salesJuice },
  { ...lineSeries, name: 'Ohters', 
    style: {
      ...lineSeries.style,
      stroke: 'var(--color-8)'
    },
    data: salesOthers }
]

const lineConfig = {
  legend: {
    location: 'top',
    alignBase: 'parent',
    itemsAlign: 'start',
    colors: ['--color-8'],
  },
  title: {
    align: 'left',
    text: '3 Year Status for Product Categories',
    gap: 10,
    backgroundStyle: {
        fill: 'black',
        rx: '3px'
    },
    style: {
        fill: '#fff',
        fontSize: '20px',
        padding: '2px 5px',
    }
  },
  subtitle: {
    align: 'left',
    text: 'North America AC, FC in mUSD',
    style: {
        fill: 'black',
        fontSize: '14px',
        fontWeight: 'bold',
        marginBottom: '10px'
    }
  },
  xAxis: {
    type: 'category',
    line: false,
    grid: false,
  },
  yAxis: {
    type: 'linear',
    grid: false,
    label: false,
    minValue: 70,
    padding: 0,
  },
  
  series: lines
}

// North America Alchohol, AC, PL in mUSD 2014
// compared to PY. Better Q1 Results.
const data14 = [1, -1.2, -1, 1.2];
const data15 = [1.2, 1.4, 1.2, 2.2];

const dataA14 = [2.2, 2.3, 2.0, 3.1];
const dataB14 = [1.0, 1.8, 1.5, 2.0];

const dataA15 = [2.1, 2.2, 2.5, 2.4];
const dataB15 = [1.2, 1.8, 2.2, 2.2];

const data16 = [2.4, 4.5, 4.8, 5.1];

const barXAxis = {
  type: 'category',
  line: false,
  label: false,
  grid: true,
  // position: 'opposite'
  style: {
    // strokeDasharray: '0 1 0 1',
  }
}

const barYAxis = {
  type: 'linear',
  line: false,
  label: false,
  grid: false,
  strictMin: -2,
  strictMax: 6,
  padding: 0,
}

const bar = {
  type: 'bar',
  pointLabel: true,
  style: {
    "fill": "var(--color-7)",
    "stroke": "var(--color-7)"
  },
  belowStyle: {
    "fill": "var(--color-3)",
    "stroke": "var(--color-3)"
  },
}

const barA = {
  ...bar,
  style: {
    fill: 'none',
  },
  pointWidth: 5,
}

const oldBar = {
  type: 'bar',
  pointLabel: false,
  pointPadding: -1.4,
  
}

const bar14 = {
  ...bar,
  xAxis: 2,
  yAxis: 2,
  data: data14
}

const barA14 = {
  ...barA,
  style: {
    fill: 'none',
    stroke: 'var(--color-5)',
  },
  data: dataA14
}

const barB14 = {
  ...oldBar,
  style: {
    fill: 'var(--color-5)',
    stroke: 'var(--color-5)',
  },
  data: dataB14
}

const bar15 = {
  ...bar,
  xAxis: 3,
  yAxis: 3,
  data: data15
}

const barA15 = {
  ...barA,
  data: dataA15
}

const barB15 = {
  ...oldBar,
  data: dataB15
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

const cols = 2;
const rows = 2;
const config = {
  title: false,
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
      align: 'left',
      itemGap: 20,
      markerGap: 10,
      offsetX: 20,
      style: {
          marginRight: '20px'
      }
  },
  xAxis: Array(rows).fill().reduce((acc, curr, i) => {
    return acc.concat(Array(cols).fill(barXAxis).map((v, j) => {
      v.row = i,
      v.col = j;
      return {...v}
    }));
  }, []),
  // yAxis: [pieYAxis, barYAxis],
  yAxis: Array(rows).fill().reduce((acc, curr, i) => {
    return acc.concat(Array(cols).fill(barYAxis).map((v, j) => {
      v.row = i,
      v.col = j;
      return {...v}
    }));
  }, []),
  series: [
    bar14Group,
    bar15Group,
    bar14,
    bar15,
  ]
}

const barConfig = {
  title: false,
  xAxis: {
    type: 'category',
    line: false,
    grid: false,
    label: false,
  },
  yAxis: {
    ...barYAxis,
    // padding: 0.01,
    strictMin: -0.8,
  },
  series: {
    ...bar,
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
  groupchart = RealChart.createChart(document, 'realchart', config);
  barchart = RealChart.createChart(document, 'bar16chart', barConfig);
  setActions('actions')
}