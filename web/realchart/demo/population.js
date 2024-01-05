// const eAsia = ['KOR', 'CHN', 'JPN'];
// const asiaData = data.filter(r => eAsia.includes(r['Country Code']));

const getData = (name, year) => {
  // const {data} = config;
  const _data = config.data.filter((r) => r['Country'] == name);
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
};
const cols = {
  Korea: 'Korea, Rep.',
  China: 'China',
  Japan: 'Japan',
  Thailand: 'Thailand',
  HongKong: 'Hong Kong SAR, China',
  Mongolia: 'Mongolia',
};

const countries = Object.keys(cols);
const rows = countries.length;

const createSeries = (year) => {
  const { countries, getData, cols } = config.params;
  return countries.map((c, i) => {
    const data = getData(cols[c], year);
    // ratio가 max인 age 구간
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
  });
};
const tool = {
  data,
  params: {
    cols,
    countries,
    getData,
    createSeries,
  },
  actions: [
    {
      label: 'Year',
      type: 'slider',
      min: 2001,
      max: 2023,
      value: 2023,
      step: 1,
      action: ({ value }) => {
        config.series = config.params.createSeries(value);
        config.title.text = `${value} East Asia Population`;
        chart.load(config);
      },
    },
  ],
};

const config = {
  type: 'area',
  tooltip: false,
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
    credits: false,
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
          fontSize: '12pt',
          // fontFamily: ''
        },
      },
      row: i,
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
  config.series = createSeries(2023);
  chart = RealChart.createChart(document, 'realchart', config);
  setActions('actions');
}
