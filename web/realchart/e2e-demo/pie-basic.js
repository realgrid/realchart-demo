const config = {
  title: {
    align: 'left',
    text: '2023년 11월',
    gap: 10,
    style: {
      fontSize: '16px',
      padding: '2px 5px',
    },
  },
  subtitle: {
    align: 'left',
    text: '여론 조사',
    style: {
      fill: 'black',
      fontSize: '32px',
      fontWeight: 'bold',
      marginBottom: '10px',
    },
  },
  series: {
    type: 'pie',
    radius: '50%',
    tooltipText: '${x}: ${y}%',
    data: [
      { label: '매우 긍정', value: 11.1 },
      { label: '어느 정도 긍정', value: 21.4 },
      { label: '어느 정도 부정', value: 16.9 },
      { label: '매우 부정', value: 43.6 },
      { label: '모름|무응답', value: 7.1 },
    ],
    pointLabel: {
      visible: true,
      numberFormat: '#.00',
      suffix: '%',
      position: 'inside',
      style: {
        fill: '#fff',
      },
        // offset: 10,
      textCallback: ({ x, y }) => {
        const fontSize = Math.max(15, y * 0.9);
        return `${x}<br><b style="font-size:${fontSize}px">${y}%</b>`;
      },
    },
    pointColors: ['#009D92', '#47AFA8', '#835337', '#593219', '#937B6F'],
  },
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
