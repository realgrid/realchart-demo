const config = {
  type: 'ohlc',
  title: 'OHLC Price Chart',
  xAxis: {
    type: 'time',
    title: 'Date',
    tick: {
      visible: true,
      stepInterval: '1w'
    },
    label: {
      visible: true,
      timeFormat: 'M/d'
    }
  },
  yAxis: {
    title: 'Price',
    tick: {
      stepInterval: 1000
    }
  },
  series: {
    xField: 'date',
    openField: 'openprc',
    highField: 'highprc',
    lowField: 'lowprc',
    closeField: 'closeprc',
    pointStyleCallback: function ({
      open,
      close
    }) {
      if (close > open) return {
        stroke: '#FF5C35'
      };else return {
        stroke: '#0098FF'
      };
    },
    data: [{
      date: '2021-04-01',
      openprc: 82500,
      highprc: 83000,
      lowprc: 82000,
      closeprc: 82900,
      trdamnt: 18676461
    }, {
      date: '2021-04-02',
      openprc: 84000,
      highprc: 85200,
      lowprc: 83900,
      closeprc: 84800,
      trdamnt: 22997538
    }, {
      date: '2021-04-05',
      openprc: 85800,
      highprc: 86000,
      lowprc: 84800,
      closeprc: 85400,
      trdamnt: 16255990
    }, {
      date: '2021-04-06',
      openprc: 86200,
      highprc: 86200,
      lowprc: 85100,
      closeprc: 86000,
      trdamnt: 19042023
    }, {
      date: '2021-04-07',
      openprc: 86100,
      highprc: 86200,
      lowprc: 85400,
      closeprc: 85600,
      trdamnt: 17885538
    }, {
      date: '2021-04-08',
      openprc: 85700,
      highprc: 85700,
      lowprc: 84100,
      closeprc: 84700,
      trdamnt: 19244259
    }, {
      date: '2021-04-09',
      openprc: 84700,
      highprc: 84900,
      lowprc: 83400,
      closeprc: 83600,
      trdamnt: 18193707
    }, {
      date: '2021-04-12',
      openprc: 84100,
      highprc: 84100,
      lowprc: 83100,
      closeprc: 83200,
      trdamnt: 12915282
    }, {
      date: '2021-04-13',
      openprc: 83000,
      highprc: 84500,
      lowprc: 82800,
      closeprc: 84000,
      trdamnt: 15238206
    }, {
      date: '2021-04-14',
      openprc: 84000,
      highprc: 84300,
      lowprc: 83400,
      closeprc: 84000,
      trdamnt: 13794652
    }, {
      date: '2021-04-15',
      openprc: 83700,
      highprc: 84500,
      lowprc: 83400,
      closeprc: 84100,
      trdamnt: 16377412
    }, {
      date: '2021-04-16',
      openprc: 84700,
      highprc: 84700,
      lowprc: 83600,
      closeprc: 83900,
      trdamnt: 15429522
    }, {
      date: '2021-04-19',
      openprc: 83800,
      highprc: 84000,
      lowprc: 83300,
      closeprc: 83300,
      trdamnt: 15287311
    }, {
      date: '2021-04-20',
      openprc: 83300,
      highprc: 84000,
      lowprc: 83100,
      closeprc: 83900,
      trdamnt: 15521965
    }, {
      date: '2021-04-21',
      openprc: 83300,
      highprc: 83500,
      lowprc: 82500,
      closeprc: 82600,
      trdamnt: 21636079
    }, {
      date: '2021-04-22',
      openprc: 82900,
      highprc: 83000,
      lowprc: 82400,
      closeprc: 82400,
      trdamnt: 13934746
    }, {
      date: '2021-04-23',
      openprc: 81900,
      highprc: 82900,
      lowprc: 81600,
      closeprc: 82800,
      trdamnt: 17805080
    }, {
      date: '2021-04-26',
      openprc: 82900,
      highprc: 83500,
      lowprc: 82600,
      closeprc: 83500,
      trdamnt: 15489938
    }, {
      date: '2021-04-27',
      openprc: 83200,
      highprc: 83300,
      lowprc: 82500,
      closeprc: 82900,
      trdamnt: 12941533
    }, {
      date: '2021-04-28',
      openprc: 83200,
      highprc: 83200,
      lowprc: 82100,
      closeprc: 82100,
      trdamnt: 15596759
    }, {
      date: '2021-04-29',
      openprc: 82400,
      highprc: 82500,
      lowprc: 81500,
      closeprc: 81700,
      trdamnt: 20000973
    }, {
      date: '2021-04-30',
      openprc: 81900,
      highprc: 82100,
      lowprc: 81500,
      closeprc: 81500,
      trdamnt: 18673197
    }]
  }
};
let chart;
function init() {
  console.log('RealChart v' + RealChart.getVersion());
  RealChart.setLogging(true);
  chart = RealChart.createChart(document, 'realchart', config);
}