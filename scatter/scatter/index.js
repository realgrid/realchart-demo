const config = {
  type: 'scatter',
  options: {},
  title: "Scatter Series",
  xAxis: {
    title: 'Height',
    baseValue: null
  },
  yAxis: {
    title: 'Weight'
  },
  series: [{
    data: olympic_data.slice(0, 200).filter(v => v.height > 1),
    xField: 'height',
    yField: 'weight'
    // pointLabel: true
  }, {
    data: olympic_data.slice(1000, 1200).filter(v => v.height > 1),
    xField: 'height',
    yField: 'weight'
  }]
};
const chart = RealChart.createChart(document, 'realchart', config);