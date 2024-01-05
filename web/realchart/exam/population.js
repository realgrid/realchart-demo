// const eAsia = ['KOR', 'CHN', 'JPN'];
// const asiaData = data.filter(r => eAsia.includes(r['Country Code']));

const getData = (name, year) => {
  const _data = data.filter((r) => r['Country'] == name);
  const max = _data.reduce((max, row) => {
    return Math.max(max, row[year]);
  }, 0);
  return _data.map((r) => {
    return {
      Country: r['Country'],
      Age: r['Age'],
      Ratio: r[year.toString()] / max,
    };
  });
  // const max = years.reduce((max, year) => {
  //     return Math.max(max, row[year]);
  // }, 0)
  // return years.map(y => [y, row[y] / max ]);
};

const seriesData = {
  Korea: getData('Korea, Rep.', 2023),
  China: getData('China', 2023),
  Japan: getData('Japan', 2023),
  Thailand: getData('Thailand', 2023),
  HongKong: getData('Hong Kong SAR, China', 2023),
  Mongolia: getData('Mongolia', 2023),
};

const countries = Object.keys(seriesData);
const rows = countries.length;

const config = {
  type: 'area',
  templates: {
    xAxis: {
      line: {
        visible: true,
        style: {
          stroke: '#ddd',
        },
      },
      tick: false,
      grid: {
        visible: !true,
        firstVisible: !false,
        lastVisible: !false,
        style: {
          stroke: '#ddd',
        },
      },
      // padding: 0.4,
      // position: 'opposite',
    },
    yAxis: {
      strictMax: 0.5,
      label: false,
      grid: false,
      // position: 'opposite',
    },
    series: {
      noClip: true,
      marker: false,
      pointLabel: false,
      xField: 'Age',
      yField: 'Ratio',
      lineType: 'spline',
      data,
      style: {
        strokeWidth: 3,
      },
    },
  },
  title: {
    text: '2023 East Asia Population',
    gap: 50,
  },
  split: {
    visible: true,
    rows,
  },
  options: {
    // style: {},
    // credits: false,
  },
  legend: false,
  xAxis: countries.map((c, i) => {
    return {
      type: 'category',
      template: 'xAxis',
      label: i == 0,
      row: i,
    };
  }),
  yAxis: countries.map((c, i) => {
    return {
      template: 'yAxis',
      title: {
        text: c,
        rotation: false,
        style: {
          fontSize: '10pt',
          fontFamily: '',
        },
      },
      row: i,
    };
  }),
  series: countries.map((c, i) => {
    const data = seriesData[c];
    // ratio가 max인 구간
    let max = 0;
    let denseSection = '';
    for (const row of data) {
      const ratio = row['Ratio'];
      if (ratio > max) {
        max = ratio;
        denseSection = row['Age'];
      }
    }
    const denseAge = parseInt(denseSection.split('-')[0]);
    // console.debug(c, denseAge)
    const isOld = denseAge >= 50;
    const primary = isOld ? '#ffd938bb' : '#91cc39bb';

    return {
      template: 'series',
      xAxis: i,
      yAxis: i,
      data,
      areaStyle: {
        stroke: 'none',
      },
      style: {
        fill: primary,
        stroke: primary,
      },
    };
  }),
};

let animate = false;
let chart;

function setActions(container) {
  createCheckBox(
    container,
    'Debug',
    function (e) {
      RealChart.setDebugging(_getChecked(e));
      chart.render();
    },
    false
  );
  createCheckBox(
    container,
    'Always Animate',
    function (e) {
      animate = _getChecked(e);
    },
    false
  );
  createButton(container, 'Test', function (e) {
    alert('hello');
  });
  createListBox(
    container,
    'Line Type',
    ['default', 'spline', 'step'],
    function (e) {
      config.series.lineType = _getValue(e);
      chart.load(config, animate);
    },
    'default'
  );
  createCheckBox(
    container,
    'Inverted',
    function (e) {
      config.inverted = _getChecked(e);
      chart.load(config, animate);
    },
    false
  );
  createCheckBox(
    container,
    'X Reversed',
    function (e) {
      config.xAxis.reversed = _getChecked(e);
      chart.load(config, animate);
    },
    false
  );
  createCheckBox(
    container,
    'Y Reversed',
    function (e) {
      config.yAxis.reversed = _getChecked(e);
      chart.load(config, animate);
    },
    false
  );
}

function init() {
  console.log('RealChart v' + RealChart.getVersion());
  // RealChart.setDebugging(true);
  RealChart.setLogging(true);

  chart = RealChart.createChart(document, 'realchart', config);
  setActions('actions');
}
