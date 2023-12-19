/**
 * @demo
 */
let config = {
  type: 'line',
  options: {},
  title: 'Row Split Lines',
  split: { visible: true, rows: 2, col:1 },
  xAxis: [{
    categories: [
      'home',   'sky',
      '태풍',   'def',
      '지리산', 'zzz',
      'ttt',    'taaatt',
      '백두산', '낙동강'
    ],
  },{
    linear: {
      visible: true
    }
  }],
  yAxis: [ {}, { row: 1, position: 'opposite' } ],
  series: [
    {
      lineType: 'spline',
      pointLabel: true,
      data: [
           7,  11, 9, 7.5,
        15.3,  13, 7,   9,
          11, 2.5
      ],
      xAxis: 0,
    },
    {
      yAxis: 1,
      lineType: 'spline',
      pointLabel: true,
      data: [
           7,  10,  8, 6.5,
        15.3,  13, 10, 9.5,
        11.5, 3.5
      ],
      xAxis: 1,
    },
    // {
    //   yAxis: 2,
    //   lineType: 'spline',
    //   pointLabel: true,
    //   data: [
    //        7,  10,  8, 6.5,
    //     15.3,  13, 10, 9.5,
    //     11.5, 3.5
    //   ]
    // }
  ]
};

let chart;
let timer;

function setActions(container) {
  createCheckBox(
    container,
    "Debug",
    function (e) {
      RealChart.setDebugging(_getChecked(e));
      chart.render();
    },
    false
  );
  createButton(container, "Test", function (e) {
    alert("hello");
  });
  createCheckBox(
    container,
    "reversed",
    function (e) {
      config.gauge[0].reversed = _getChecked(e);
      chart.load(config);
    },
    false
  );
  createListBox(
    container,
    "label.position",
    ["", "left", "right", "top", "bottom"],
    function (e) {
      const pos = _getValue(e);
      config.gauge[0].label.position = pos;
      config.gauge[0].height = pos === "top" || pos === "bottom" ? 86 : 65;
      config.gauge[0].label.text =
        pos === "top" || pos === "bottom"
          ? "RealChart Bullet ver 1.0"
          : "RealChart Bullet<br>ver 1.0";
      chart.load(config);
    },
    ""
  );
  createCheckBox(
    container,
    "scale",
    function (e) {
      config.gauge[0].scale.visible = _getChecked(e);
      chart.load(config);
    },
    true
  );
  createCheckBox(
    container,
    "scale.line",
    function (e) {
      config.gauge[0].scale.line = _getChecked(e);
      chart.load(config);
    },
    true
  );
  createCheckBox(
    container,
    "scale.tick",
    function (e) {
      config.gauge[0].scale.tick = _getChecked(e);
      chart.load(config);
    },
    true
  );
  createListBox(
    container,
    "scale.gap",
    ["0", "4", "8", "12"],
    function (e) {
      config.gauge[0].scale.gap = _getValue(e);
      chart.load(config);
    },
    "8"
  );
  createCheckBox(
    container,
    "scale.opposite",
    function (e) {
      config.gauge[0].scale.position = _getChecked(e) ? "opposite" : "default";
      chart.load(config);
    },
    false
  );
  line(container);
  createCheckBox(
    container,
    "reversed2",
    function (e) {
      config.gauge[1].reversed = _getChecked(e);
      chart.load(config);
    },
    false
  );
  createListBox(
    container,
    "label2.position",
    ["", "left", "right", "top", "bottom"],
    function (e) {
      const pos = _getValue(e);
      config.gauge[1].label.position = pos;
      config.gauge[1].width = pos === "left" || pos === "right" ? 140 : 65;
      // config.gauge[0].label.text = (pos === 'left' || pos === 'bottom') ? 'RealChart Bullet ver 1.0' : 'RealChart Bullet<br>ver 1.0';
      chart.load(config);
    },
    ""
  );
  createCheckBox(
    container,
    "scale2",
    function (e) {
      config.gauge[1].scale.visible = _getChecked(e);
      chart.load(config);
    },
    true
  );
  createCheckBox(
    container,
    "scale2.line",
    function (e) {
      config.gauge[1].scale.line = _getChecked(e);
      chart.load(config);
    },
    true
  );
  createCheckBox(
    container,
    "scale2.tick",
    function (e) {
      config.gauge[1].scale.tick = _getChecked(e);
      chart.load(config);
    },
    true
  );
  createListBox(
    container,
    "scale2.gap",
    ["0", "4", "8", "12"],
    function (e) {
      config.gauge[1].scale.gap = _getValue(e);
      chart.load(config);
    },
    "8"
  );
  createCheckBox(
    container,
    "scale2.opposite",
    function (e) {
      config.gauge[1].scale.position = _getChecked(e) ? "opposite" : "default";
      chart.load(config);
    },
    false
  );
}

function init() {
  console.log(RealChart.getVersion());
  // RealChart.setDebugging(true);
  RealChart.setLogging(true);

  chart = RealChart.createChart(document, "realchart", config);
  setActions("actions");
}
