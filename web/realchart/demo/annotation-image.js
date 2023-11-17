/**
 * @demo
 *
 * Bar Series 기본 예제.
 */
const config = {
	type: 'bar',
	title: 'Title',
	subtitle: {
		
	},
	options: {

	},
	legend:{
		
	},
	xAxis: {
        grid: {
           
        },
	
		title: {

		},
		categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
		label: {
			step: 1,
		},
	},
	yAxis: {
		title: {

		},
	},
	body: {
        style: {

		},
		annotations: [{
            offsetX: 30,
            offsetY: 25,
            rotation: 5,
            text: 'Annotation Sample',
            style: {
                padding: '3px 5px',
                fill: 'white'
            },
            backgroundStyle: {
                fill: '#333',
                rx: 5,
                fillOpacity: 0.7
            }
        }, 
		{
            offsetX: 260,
            offsetY: 25,
            rotation: -5,
            text: 'Text',
            style: {
                padding: '3px 5px',
                fill: 'white'
            },
            backgroundStyle: {
                fill: 'blue',
                rx: 5,
                fillOpacity: 0.7
            }
        },{
            type: 'image',
            align: 'right',
            offsetX: 50,
            offsetY: 50,
            width: 100,
            imageUrl: '../assets/images/annotation.png'
        }]
    },
	series: [{
		colorByPoint: true,
		pointLabel: true,
		pointWidth: 30,
		data: [
			[150], // 1월은 -2°C
			[140], // 2월은 -1°C
			[130], // 3월은 1°C
			[120], // 4월은 5°C
			[110], // 5월은 10°C
			[90], // 6월은 14°C
			[80], // 7월은 16°C
			[70], // 8월은 15°C
			[60], // 9월은 10°C
			[50], 
			[40], 
		 	[30], 
		],
	},
		
	
	],
};

let animate = false;
let chart;

function setActions(container) {
	createCheckBox(
		container,
		'Debug',
		function (e) {
			RealChart.setDebugging(_getChecked(e));
			chart.refresh();
		},
		false
	);
	createCheckBox(
		container,
		'Always Animate',
		function (e) {
			animate = _getChecked(e);
		},
		false
	);
	createButton(container, 'Test', function (e) {
		alert('hello');
	});
	createCheckBox(
		container,
		'ColorByPoint',
		function (e) {
			config.series.colorByPoint = _getChecked(e);
			chart.load(config, animate);
		},
		false
	);
	createCheckBox(
		container,
		'Inverted',
		function (e) {
            chart.inverted = _getChecked(e);
		},
		false
	);
	createCheckBox(
		container,
		'X Reversed',
		function (e) {
			config.xAxis.reversed = _getChecked(e);
			chart.load(config, animate);
		},
		false
	);
	createCheckBox(
		container,
		'Y Reversed',
		function (e) {
			config.yAxis.reversed = _getChecked(e);
			chart.load(config, animate);
		},
		false
	);
}

function init() {
	console.log('RealChart v' + RealChart.getVersion());
	// RealChart.setDebugging(true);

	chart = RealChart.createChart(document, 'realchart', config);
	setActions('actions');
}
