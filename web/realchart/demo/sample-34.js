/**
 * @demo
 */
const config = {
  height: 600,
  options: { animatable: false },
  templates: {
    gauge: {
      // width: '55%',
      height: 65,
      label: {
        width: "19%",
      },
      targetBar: {
        style: {
          fill: "#222",
        },
      },
      actualBar: {
        styleCallback: (args) => {
          if (args.value > args.gauge.$_p.targetValue) {
            return {
              fill: "#0047AB",
            };
          } else {
            return {
              fill: "#ED254E",
            };
          }
        },
      },
    },
  },
  title: "Intel Core i9-13900K Performance",
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
          toValue: 3.5,
          color: "#AFCBE6",
        },
        {
          toValue: 4.5,
          color: "#8DA9C4",
        },
        {
          toValue: 5.5,
          color: "#7C98B3",
        },
      ],
      scale: {
        label: {
          suffix: "GHz",
        },
      },
      label: {
        text: "<t style='font-weight: bold'>Turbo Clock Speed</t> <br>  vs AMD Ryzen 9 7950x",
      },
    },
    {
      type: "bullet",
      name: "ClockSpeed",
      template: "gauge",
      value: 3.0,
      top: 100,
      targetValue: 4.5,
      maxValue: 6,
      ranges: [
        {
          toValue: 2,
          color: "#AFCBE6",
        },
        {
          toValue: 3.5,
          color: "#8DA9C4",
        },
        {
          toValue: 4.5,
          color: "#7C98B3",
        },
      ],
      scale: {
        label: {
          suffix: "GHz",
        },
      },
      label: {
        text: "<t style='font-weight: bold'>Clock Speed</t> <br>  vs AMD Ryzen 9 7950x",
      },
    },
    {
      type: "bullet",
      name: "PhysicalCores",
      template: "gauge",
      value: 24,
      top: 180,
      targetValue: 16,
      maxValue: 32,
      ranges: [
        {
          toValue: 8,
          color: "#AFCBE6",
        },
        {
          toValue: 16,
          color: "#8DA9C4",
        },
        {
          toValue: 14,
          color: "#7C98B3",
        },
      ],
      label: {
        text: "<t style='font-weight: bold'>Physical Cores</t> <br>  vs AMD Ryzen 9 7950x",
      },
    },
    {
      type: "bullet",
      name: "CPUValue",
      template: "gauge",
      value: 104.4,
      top: 260,
      targetValue: 116.8,
      maxValue: 150,
      ranges: [
        {
          toValue: 60,
          color: "#AFCBE6",
        },
        {
          toValue: 100,
          color: "#8DA9C4",
        },
        {
          toValue: 120,
          color: "#7C98B3",
        },
      ],
      label: {
        text: "<t style='font-weight: bold'>CPU Value</t> <br>  vs AMD Ryzen 9 7950x",
      },
    },
    {
      type: "bullet",
      name: "CPUMark",
      template: "gauge",
      value: 59528,
      top: 340,
      targetValue: 63188,
      maxValue: 80000,
      ranges: [
        {
          toValue: 35000,
          color: "#AFCBE6",
        },
        {
          toValue: 50000,
          color: "#8DA9C4",
        },
        {
          toValue: 70000,
          color: "#7C98B3",
        },
      ],
      label: {
        text: "<t style='font-weight: bold'>CPU Mark</t> <br>  vs AMD Ryzen 9 7950x",
      },
    },
    {
      type: "bullet",
      name: "price",
      template: "gauge",
      value: 569.97,
      top: 420,
      targetValue: 540.99,
      maxValue: 1000,
      ranges: [
        {
          toValue: 200,
          color: "#AFCBE6",
        },
        {
          toValue: 400,
          color: "#8DA9C4",
        },
        {
          toValue: 550,
          color: "#7C98B3",
        },
      ],
      label: {
        text: "<t style='font-weight: bold'>price</t> <br>  vs AMD Ryzen 9 7950x",
      },
      actualBar: {
        belowStyle: {
          fill: "red",
          stroke: "red",
        },
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
