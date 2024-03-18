const config = {
  title: "Text Annotations",
  xAxis: {
      tick: true,
      title: 'X Axis',
      grid: true
  },
  yAxis: {
      tick: true,
      title: 'Y Axis'
  },
  series: {
      data: [
          ['종로구', 7], 
          ['강남구', 11], 
          ['도봉구', 9], 
          ['은평구', 14.3], 
          ['동작구', 13],
          ['강동구', 12.5]
      ],
  },
  body: {
      annotations: [{
          offsetX: 30,
          offsetY: 40,
          text: 'Text 어노테이션',
          style: {
              fill: 'white'
          },
          backgroundStyle: {
              padding: '3px 5px',
              fill: '#33f',
              rx: 5,
              fillOpacity: 0.7
          }
      }, {
          offsetX: 110,
          offsetY: 90,
          rotation: -20,
          text: 'Text 어노테이션2',
          style: {
              fill: 'white'
          },
          backgroundStyle: {
              padding: '3px 5px',
              fill: '#333',
              rx: 5,
              fillOpacity: 0.7
          }
      }, {
          offsetX: 100,
          offsetY: 160,
          front: true,
          rotation: 20,
          text: 'Text 어노테이션3',
          style: {
              fontSize: '30px',
              fill: 'white'
          },
          backgroundStyle: {
              padding: '3px 5px',
              fill: '#383',
              rx: 5,
              fillOpacity: 0.7
          }
      }, {
          align: 'right',
          offsetX: 10,
          offsetY: 10,
          text: 'Text<br>어노테이션4',
          style: {
              fontSize: '30px',
              fill: 'white'
          },
          backgroundStyle: {
              padding: '3px 5px',
              fill: '#833',
              rx: 5,
              fillOpacity: 0.7
          }
      }, {
          align: 'right',
          verticalAlign: 'bottom',
          front: true,
          offsetX: 10,
          offsetY: 10,
          text: 'Text<br><t style="fill:red;font-size:24px;font-weight:bold;">어노테이션5</t>',
          style: {
              fontSize: '30px',
          },
          backgroundStyle: {
              padding: '3px 5px',
              stroke: '#080',
              strokeWidth: '1px',
              strokeDasharray: '4'
          }
      }]
  }
}


let animate = false;
let chart;


function init() {
	chart = RealChart.createChart(document, 'realchart', config);
}
 