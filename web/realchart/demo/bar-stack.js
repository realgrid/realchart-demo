/**
 * @demo
 * 
 */
const cols = ['CPI1', 'CPI2', 'CPI3'];
const labels = ['Food', 'Less Food, Less Energy', 'Energy']
const colors = ['#2a9d8f', '#e9c46a', '#e76f51']
const children = cols.map((c) => {
  return { 
    name: labels.shift(), 
    color: colors.shift(),
    data,
    xField: 'Date',
    yField: c,
  }
});

const config = {
  "options": {
    credits: false,
  },
  "title": "Inflation CPI of Korea",
  "xAxis": {
    "title": "Month of Year",
    type: 'category',
    tick: {
      step: 3,
    }
  },
  "yAxis": {
    "title": "Inflation CPI(%)"
  },
  "series": {
    "layout": "stack",
    "children": children,
  }
};


let chart;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.render();
    }, false);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
    createCheckBox(container, 'Inverted', function (e) {
        config.inverted = _getChecked(e);
        chart.load(config);
    }, false);
    createCheckBox(container, 'X Reversed', function (e) {
        config.xAxis.reversed = _getChecked(e);
        chart.load(config);
    }, false);
    createCheckBox(container, 'Y Reversed', function (e) {
        config.yAxis.reversed = _getChecked(e);
        chart.load(config);
    }, false);
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
