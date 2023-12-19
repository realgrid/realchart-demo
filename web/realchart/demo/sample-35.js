/**
 * @demo
 */
const updateDisplay = () => {
  let temperature, usage, ramUsage;
  const temperatureValue = chart.getGauge("temperature").get("value");
  const usageValue = chart.getGauge("usage").get("value");
  const ramUsageValue = chart.getGauge("ramUsage").get("value");
  const randomValue = Math.random() < 0.5 ? -1 : 1;

  temperature = temperatureValue + randomValue * (Math.random() * 5);
  usage = usageValue + randomValue * (Math.random() * 5);
  ramUsage = ramUsageValue + randomValue * (Math.random() * 2);

  chart.getGauge("temperature").set("value", Math.round(temperature));
  chart.getGauge("usage").set("value", usage);
  chart.getGauge("ramUsage").set("value", ramUsage);
}
let config = {
  params: {
    updateDisplay
  },
  actions: [
    {
      type: "button",
      label: '데이터 업데이트',
      action: () => {
        // 새로운 인터벌 시작
        let intervalId = setInterval(config.params.updateDisplay, 1000);
        return intervalId;
      },
    },
  ],
  templates: {
    gauge: {
      width: "28%",
      band: {
        visible: true,
        ranges: [
          { toValue: 40, color: "#209C05" },
          { toValue: 65, color: "#EBFF0A" },
          { toValue: 85, color: "#FA9D00" },
          { color: "#FF0A0A" },
        ],
      },
      hand: {
        visible: true,
        length: "80%",
        radius: 8,
        style: {
          fill: "#777",
          strokeWidth: "30px",
        },
      },
      valueRim: {
        ranges: [
          {
            toValue: 40,
            color: "#209C05",
          },
          {
            toValue: 65,
            color: "#EBFF0A",
          },
          {
            toValue: 85,
            color: "#FA9D00",
          },
          {
            color: "#FF0A0A",
          },
        ],
      },
      pin: {
        visible: true,
        radius: 10,
        style: {
          stroke: "#AAA",
          fill: "#FFF",
        },
      },
      startAngle: 225,
      sweepAngle: 270,
      label: {
        numberFormat: "#0.0",
        style: { fontFamily: "Arial", fontWeight: "bold" },
        offsetY: 150,
      },
    },
  },
  title: {
    text: "System Performance Overview",
    style: {
      fontSize: "28px",
      fontWeight: "bold",
    },
  },
  options: {
    theme: "dark",
    style: {
      background: "#222",
    },
  },

  gauge: [
    {
      template: "gauge",
      name: "temperature",
      value: 66,
      scale: { visible: true },
      left: 0,
      label: {
        text: `
        <t style="fill:#262626 font-size:22px;"> \${value} </t><t style="font-size:18px;">°C</t>
      <t style="font-size:20px;font-weight:normal">CPU Temperature</t>
      `,
      },
    },
    {
      template: "gauge",
      name: "usage",
      value: 55,
      scale: { visible: true },
      label: {
        text: `
      <t style="fill:#262626 font-size:22px;"> \${value} </t><t style="font-size:18px;">%</t>
      <t style="font-size:20px;font-weight:normal">CPU Usage Rate</t>
      `,
      },
    },
    {
      template: "gauge",
      name: "ramUsage",
      value: 21,
      left: "72%",
      scale: { visible: true },
      label: {
        text: `
        <t style="fill:#262626 font-size:22px;"> \${value} </t><t style="font-size:18px;">%</t>
      <t style="font-size:20px;font-weight:normal">RAM Usage Rate</t>
      `,
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
