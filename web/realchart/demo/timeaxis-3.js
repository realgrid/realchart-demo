/**
 * @demo
 *
 */

const source = data.map((row) => {
  const dt = new Date(row["Date"]);
  return { ...row, Date: dt };
});

const config = {
  options: {
    animatable: false,
  },
  title: "Stock Market",
  xAxis: {
    type: "time",
    crosshair: {
        visible: true,
        flag: {
            minWidth: 140
        }
    },
    tick: {
      step: 30,
    },
    minPadding: 0,
    maxPadding: 0,
  },
  yAxis: {
    minValue: 0,
    tick: {
      step: "m",
    },
    label: {
      prefix: "$",
    },
    guide: [
      {
        type: "line",
        value: 400,
        label: {
          text: "40층에 사람있어요. 😭",
          style: {
            fill: "var(--color-2)",
          },
        },
        style: {
          stroke: "var(--color-2)",
        },
      },
      {
        type: "line",
        value: 280,
        label: {
          text: "28층.. 🙏",
          style: {
            fill: "var(--color-3)",
          },
        },
        style: {
          stroke: "var(--color-3)",
        },
      },
    ],
  },
  series: [
    {
      name: "Netflix(NFLX) 🍿",
      type: "line",
      marker: false,
      data: source,
      xField: "Date",
      yField: "NFLX",
      color: "var(--color-2)",
    },
    {
      name: "Domino(DPZ) 🍕",
      type: "line",
      marker: false,
      data: source,
      xField: "Date",
      yField: "DPZ",
      color: "var(--color-3)",
    },
  ],
  legend: {
    visible: true,
  },
};

let chart;

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
  createListBox(
    container,
    "Line Type",
    ["default", "spline", "step"],
    function (e) {
      config.series.lineType = _getValue(e);
      chart.load(config);
    },
    "default"
  );
  createCheckBox(
    container,
    "Inverted",
    function (e) {
      config.inverted = _getChecked(e);
      chart.load(config);
    },
    false
  );
  createCheckBox(
    container,
    "X Reversed",
    function (e) {
      config.xAxis.reversed = _getChecked(e);
      chart.load(config);
    },
    false
  );
  createCheckBox(
    container,
    "Y Reversed",
    function (e) {
      config.yAxis.reversed = _getChecked(e);
      chart.load(config);
    },
    false
  );
  createListBox(
    container,
    "XAxis.type",
    ["time", "linear", "log"],
    function (e) {
      config.xAxis.type = _getValue(e);
      chart.load(config);
    },
    "time"
  );
  createListBox(
    container,
    "YAxis.type",
    ["linear", "log"],
    function (e) {
      config.yAxis.type = _getValue(e);
      chart.load(config);
    },
    "linear"
  );
}

function init() {
  console.log("RealChart v" + RealChart.getVersion());
  // RealChart.setDebugging(true);

  chart = RealChart.createChart(document, "realchart", config);
  setActions("actions");
}
