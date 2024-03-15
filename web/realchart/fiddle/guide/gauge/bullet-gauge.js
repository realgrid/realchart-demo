
const config = {
  title: 'Bullet Gauges',
  gauge: [
    {
      type: 'bullet',
      name: 'bullet1',
      width: '55%',
      height: 65,
      left: 10,
      maxValue: 100,
      value: 81,
      targetValue: 90,
      scale: {
        line: true,
        label: {
          suffix: '%',
        },
      },
      ranges: [
        {
          toValue: 50,
          color: '#777',
        },
        {
          toValue: 70,
          color: '#aaa',
        },
      ],
      label: {
        text: 'RealChart Bullet<br>ver 1.0',
        // position: 'top',
      },
    },
    {
      type: 'bullet',
      name: 'bullet2',
      width: 80,
      height: '70%',
      left: 600,
      top: 50,
      vertical: true,
      maxValue: 100,
      value: 81,
      targetValue: 90,
      scale: {
        line: true,
      },
      ranges: [
        {
          toValue: 50,
          color: '#777',
        },
        {
          toValue: 70,
          color: '#aaa',
        },
      ],
      label: {
        text: 'RealChart<br>Bullet<br>ver 1.0',
        
      },
    },
  ],
};

let animate = false;
let chart;


function init() {
	chart = RealChart.createChart(document, 'realchart', config);
}
 