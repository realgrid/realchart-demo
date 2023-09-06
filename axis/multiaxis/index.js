const config = {
  options: {
    // animatable: false
  },
  title: {
    text: "Average Monthly Weather Data for Tokyo",
    align: 'left',
    style: {
      fontWeight: 'bold'
    }
  },
  subtitle: {
    text: 'Source: WorldClimate.com',
    align: 'left'
  },
  legend: {
    layout: 'vertical',
    position: 'plot',
    left: 0,
    top: 0
  },
  xAxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    crosshair: true
  },
  yAxis: [{
    label: {
      suffix: ' °C',
      style: {}
    },
    title: {
      text: 'Temperature',
      style: {}
    },
    position: "opposite"
  }, {
    grid: false,
    title: {
      text: 'Rainfall',
      style: {}
    },
    label: {
      suffix: ' mm',
      style: {}
    }
  }, {
    grid: false,
    title: {
      text: 'Sea-Level Pressure',
      style: {}
    },
    label: {
      suffix: ' mb',
      style: {}
    },
    position: "opposite"
  }],
  series: [{
    name: 'Rainfall',
    yAxis: 1,
    pointLabel: {
      visible: true,
      effect: 'outline',
      suffix: 'mm',
      style: {
        fill: '#008'
      }
    },
    data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
  }, {
    name: 'Temperature',
    type: 'line',
    lineType: 'spline',
    data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
  }, {
    name: 'Sea-Level Pressure',
    type: 'line',
    lineType: 'spline',
    yAxis: 2,
    data: [1016, 1016, 1015.9, 1015.5, 1012.3, 1009.5, 1009.6, 1010.2, 1013.1, 1016.9, 1018.2, 1016.7],
    marker: {
      visible: false
    },
    style: {
      strokeDasharray: '2'
    }
  }]
};
const chart = RealChart.createChart(document, 'realchart', config);