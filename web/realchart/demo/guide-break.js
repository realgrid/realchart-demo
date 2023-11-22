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
		// animatable: false
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
			// startStep: 0,
			step: 1,
		},
        line: true,
	},
	yAxis: {

		title: {
			
		},
		// reversed: true,
		// baseValue: -1
		break : {
			from : 50,
			to: 60
		},
		guide: [
			{ type: 'line', value: 12, label: 'line guide' },
			{
			  type: 'range',
			  start: 70,
			  end: 90,
			  label: { text: 'range guide', align: 'right', style: { fill: 'red' } }
			}
		  ]
	},
	body: {

        style: {
            // stroke: 'none'
        },
		
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
	createButton(container, 'PNG', function (e) {
		chart.exportImage();
	});
	createButton(container, 'JPG', function (e) {
		chart.exportImage({type: 'jpg'});
	});
	createButton(container, 'JPEG', function (e) {
		chart.exportImage({type: 'jpeg'});
	});
}

function init() {
	console.log('RealChart v' + RealChart.getVersion());
	// RealChart.setDebugging(true);

	chart = RealChart.createChart(document, 'realchart', config);
	setActions('actions');
}
