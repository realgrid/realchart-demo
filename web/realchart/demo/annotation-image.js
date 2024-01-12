/**
 * @demo
 *
 * Bar Series 기본 예제.
 */
const config = {
	type: 'bar',
	title: 'Title',
	xAxis: {
		categories: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
		label: {
			step: 1,
		},
	},
	yAxis: {
	},
	body: {
        style: {
            fill: '#0088ff20'
		},
		annotations: [{
            type: 'image',
            offsetX: 30,
            offsetY: 5,
            width: 100,
            imageUrl: '../assets/images/annotation.png'
        }, {
            align: 'right',
            offsetX: 20,
            offsetY: 10,
            width: 90,
            imageUrl: '../assets/images/insta.png'
        }, {
            align: 'right',
            offsetX: 120,
            offsetY: 20,
            rotation: -20,
            width: 90,
            imageUrl: '../assets/images/insta.png'
        }, {
            align: 'right',
            offsetX: 220,
            offsetY: 20,
            rotation: -45,
            width: 150,
            imageUrl: '../assets/images/insta.png'
        }]
    },
	series: [{
		pointLabel: {
            visible: true,
            style: {
                fill: '#777'
            }
        },
		data: [
			120, 140, 130, 120, 110, 90, 80, 70, 110, 150, 140, 30, 
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
    RealChart.setLogging(true);

	chart = RealChart.createChart(document, 'realchart', config);
	setActions('actions');
}
