/**
 * @demo
 *
 * Bar Series 기본 예제.
 */
const config = {
	type: 'bar',
	title: 'Image Annotations',
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
            offsetX: 10,
            offsetY: 10,
            width: 100,
            imageUrl: '../assets/images/annotation.png',
            backgroundStyle: {
                stroke: 'blue',
                strokeWidth: '2px',
                strokeDasharray: '2',
                rx: 5
            }
        }, {
            align: 'right',
            offsetX: 20,
            offsetY: 50,
            width: 90,
            imageUrl: '../assets/images/insta.png'
        }, {
            align: 'right',
            front: true,
            offsetX: 120,
            offsetY: 20,
            rotation: -20,
            width: 90,
            imageUrl: '../assets/images/insta.png'
        }, {
            align: 'right',
            noClip: true,
            offsetX: 220,
            offsetY: 10,
            rotation: -45,
            width: 150,
            imageUrl: '../assets/images/insta.png',
            style: {
                opacity: 0.5
            }
        }, {
            verticalAlign: 'bottom',
            front: true,
            offsetX: -90,
            offsetY: -100,
            rotation: 45,
            width: 250,
            imageUrl: '../assets/images/insta.png',
            style: {
                opacity: 0.7
            }
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
            config.inverted = _getChecked(e);
			chart.load(config, animate);
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
