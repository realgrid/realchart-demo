/**
 * @demo
 *
 */
const config = {
  // inverted: true,
  options: {},
  title: 'Axis Label Icons',
  legend: true,
  body: {
    style: {
      stroke: 'none',
    },
  },
  xAxis: {
    categories: [
      { name: '스페인', icon: 'esp.png' },
      { name: '오스트리아', icon: 'aut.png' },
      { name: '나이지리아', icon: 'nga.png' },
      { name: '브라질', icon: 'bra.png' },
      { name: '캐나다', icon: 'can.png' },
      { name: '말레이시아', icon: 'mys.png' },
      { name: '파키스탄', icon: 'pak.png' },
    ],
    label: {
      iconRoot: '/realchart/assets/images/country/',
      // iconPosition: 'bottom',
      // iconPosition: 'left',
      // iconPosition: 'right',
      style: {},
    },
    grid: {
      visible: true,
      lastVisible: true,
    },
    tick: true,
    // type: 'category',
    // position: 'apposite'
    // position: 'base',
    // baseAxis: 1,
    title: {
      text: '수정구',
    },
    // grid: true,
    crosshair: true,
  },
  yAxis: {
    title: {
      text: '전체 점포수',
    },
    unit: '(명)',
    label: {
      lastText: '${label}<br>${axis.unit}',
      lastStyle: { fontWeight: 'bold' },
    },
  },
  series: {
    pointLabel: {
      visible: true,
    },
    data: [
      ['신흥1동', 12904],
      ['신흥2동', 19796],
      ['신흥3동', 10995],
      ['태평1동', 14625],
      ['태평2동', 14627],
      ['태평3동', 12649],
      ['태평4동', 12279],
    ],
  },
};

let animate;
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
  createButton(container, 'Test', function (e) {
    // alert('hello');
    // alert(RealChart.getVersion());
    // chart.series.visible = !chart.series.visible;
    // chart.series.set('visible', !chart.series.get('visible'));
    // chart.series.toggle('visible');
    // chart.series.set('pointLabel', false);
    // chart.series.toggle('pointLabel.visible');
    // chart.series.pointLabel.toggle('visible');
    // chart.$_p.test(document.getElementById('canvas'));
  });
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
  createCheckBox(
    container,
    'X Opposite',
    function (e) {
      config.xAxis.position = _getChecked(e) ? 'opposite' : '';
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
