/**
 * @demo
 */
const config = {
  templates: {
    gauge: {
      // width: '55%',
      height: 65,
      label: {
        width: "19%",
      },
    },
  },
  title: "Intel Core i9-13900K",
  gauge: [
    {
      type: "bullet",
      name: "TurboClockSpeed",
      template: "gauge",
      top: 20,
      value: 5.8,
      targetValue: 5.7,
      maxValue: 6,
      ranges: [
        {
          fromValue: 0,
          toValue: 1,
          color: "green",
        },
        {
          fromValue: 1,
          toValue: 2,
          color: "blue",
        },
        {
          fromValue: 2,
          toValue: 4,
          color: "red",
        },
      ],
      targetBar: {
        style: {
          fill: "red",
          stroke: "red"
        },
      },
      actualBar: {
        style: {
          fill: "blue",
          stroke: "blue"
        }
      },
      label: {
        text: "Turbo Clock Speed <br>  vs AMD Ryzen 9 7950x",
      },
    },
    {
      type: "bullet",
      name: "ClockSpeed",
      template: "gauge",
      value: 3.0,
      top: 90,
      targetValue: 4.5,
      maxValue: 6,
      ranges: [
        {
          toValue: 3,
          color: "#666",
        },
        {
          toValue: 4,
          color: "#999",
        },
      ],
      label: {
        text: "Clock Speed <br>  vs AMD Ryzen 9 7950x",
      },
    },
    {
      type: "bullet",
      name: "PhysicalCores",
      template: "gauge",
      value: 24,
      top: 160,
      targetValue: 16,
      maxValue: 32,
      ranges: [
        {
          toValue: 8,
          color: "#666",
        },
        {
          toValue: 12,
          color: "#999",
        },
      ],
      label: {
        text: "Physical Cores <br>  vs AMD Ryzen 9 7950x",
      },
    },
    {
      type: "bullet",
      name: "CPUValue",
      template: "gauge",
      value: 104.4,
      top: 230,
      targetValue: 116.8,
      maxValue: 150,
      ranges: [
        {
          toValue: 60,
          color: "#666",
        },
        {
          toValue: 80,
          color: "#999",
        },
      ],
      label: {
        text: "CPU Value <br>  vs AMD Ryzen 9 7950x",
      },
    },
    {
      type: "bullet",
      name: "CPUMark",
      template: "gauge",
      value: 59528,
      top: 300,
      targetValue: 63188,
      maxValue: 80000,
      ranges: [
        {
          toValue: 40000,
          color: "#666",
        },
        {
          toValue: 60000,
          color: "#999",
        },
      ],
      label: {
        text: "CPU Mark <br>  vs AMD Ryzen 9 7950x",
      },
    },
    {
      type: "bullet",
      name: "price",
      template: "gauge",
      value: 569.97,
      top: 370,
      targetValue: 540.99,
      maxValue: 1000,
      ranges: [
        {
          toValue: 200,
          color: "#666",
        },
        {
          toValue: 400,
          color: "#999",
        },
      ],
      label: {
        text: "price <br>  vs AMD Ryzen 9 7950x",
      },
    },
  ],
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
  // createButton(container, 'Run', function(e) {
  //     config.gauge.active = true;
  //     chart.load(config);
  // });
  // createButton(container, 'Stop', function(e) {
  //     config.gauge.active = false;
  //     chart.load(config);
  // });
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
