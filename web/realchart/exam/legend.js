/**
 * @demo
 *
 * Bar Series 기본 예제.
 */
  const config = {
    title: "매출실적 및 매출이익",
    options: {},
    xAxis: {
      categories: [
        "1월",
        "2월",
        "3월",
        "4월",
        "5월",
        "6월",
        "7월",
        "8월",
        "9월",
        "10월",
        "11월",
        "12월",
      ],
      grid: {
        visible: !true,
      },
    },
    yAxis: {
      title: {
        text: "단위: 백만원",
        align: "end"
      },
      
    },
    series: [
      {
        layout: "stack",
        name: "대기질",
        pointLabel: true,
        children: [
          {
            name: "매입실적",
            data: [186, 48, 120, 48, 49, 82, 41, 51, 34, 59, 37, 0],
            pointLabel: {
              visible: true,
              position: "inside",
            },
          },
          {
            name: "매출이익",
            data: [45, 9, 29, 8, 8, 14, 6, 8, 5, 6, 5, 0],
            pointLabel: {
              visible: true,
              position: "inside",
            },
            style:{
              fill: "gray",
              stroke: "gray"
            }
          },
        ],
      },
      {
        type: "line",
        name: "매출목표",
        data: [152, 94, 66, 82, 142, 100, 123, 116, 96, 134, 105, 116],
        style: {
          fill: "red",
          stroke: "red"
        },
        marker: {
          style: {
            fill: "#fff"
          }
        }
      },
    ],
    legend: {
      location: "right",
    },
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
    createButton(container, "Test", function (e) {
      alert("hello");
    });
    createButton(container, "Update", function (e) {
      chart.series.updateData([175, 188, 152, 173, 134, 123, 153]);
    });
    createCheckBox(
      container,
      "ColorByPoint",
      function (e) {
        config.series.colorByPoint = _getChecked(e);
        chart.load(config, animate);
      },
      false
    );
    createCheckBox(
      container,
      "Inverted",
      function (e) {
        config.inverted = _getChecked(e);
        chart.load(config, animate);
      },
      false
    );
    createCheckBox(
      container,
      "X Reversed",
      function (e) {
        config.xAxis.reversed = _getChecked(e);
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
    createListBox(
      container,
      "topRadius",
      [0, 3, 6, 10, 100],
      function (e) {
        config.series[0].topRadius = +_getValue(e);
        chart.load(config, animate);
      },
      "0"
    );
    createListBox(
      container,
      "bottomRadius",
      [0, 3, 6, 10, 100],
      function (e) {
        config.series[0].bottomRadius = +_getValue(e);
        chart.load(config, animate);
      },
      "0"
    );
  }
  
  function init() {
    console.log("RealChart v" + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);
  
    chart = RealChart.createChart(document, "realchart", config);
    setActions("actions");
  }
  