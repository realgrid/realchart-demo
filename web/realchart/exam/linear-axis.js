const config = {
  title: "Boundary",
  xAxis: {
    type: "linear",
    tick: {
      visible: true,
    },
  },
  body:{
    padding: 100,
  },
  series: [
    {
      type: 'bar',
      name: "column",
      data: [ 1,  2,   4,   8],

    },
  ],
  tooltip: {
    text: "%{y} ㅎㅎㅎ"
  }
};

let animate = false;
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
  createCheckBox(
    container,
    "Always Animate",
    function (e) {
      animate = _getChecked(e);
    },
    false
  );
  createButton(container, "createChart", function (e) {
    chart = RealChart.createChart(document, "realchart", config,false, () => {console.log("hi")});
  });
  createButton(container, "destroy", function (e) {
    chart.destroy()
  });
  createCheckBox(
    container,
    "Inverted",
    function (e) {
      config.inverted = _getChecked(e);
      chart.load(config, animate);
    },
    true
  );
  createCheckBox(
    container,
    "X Reversed",
    function (e) {
      config.xAxis[0].reversed = _getChecked(e);
      config.xAxis[1].reversed = _getChecked(e);
      chart.load(config, animate);
    },
    false
  );
  createCheckBox(
    container,
    "Y Reversed",
    function (e) {
      config.yAxis.reversed = _getChecked(e);
      chart.load(config, animate);
    },
    false
  );
}

function init() {
  console.log("RealChart v" + RealChart.getVersion());
  // RealChart.setDebugging(true);
  RealChart.setLogging(true);

  chart = RealChart.createChart(document, "realchart", config,false, () => {console.log("hi")});
  setActions("actions");
}
