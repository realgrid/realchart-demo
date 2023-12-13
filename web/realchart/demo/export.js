/**
 * @demo
 *
 * Bar Series 기본 예제.
 */
const config = {
	type: 'bar',
	title: 'Title',
	subtitle: {
		visible: true,
		text: "Subtitle"
	},
	export: {
		visible: true
	},
	options: {
		style: {
			 backgroundImage: 'url(../assets/mountain.jpeg)'
		}
	},
	legend:{
		visible: true,
		location: "bottom"
	},
	xAxis: {
        grid: {
            visible: true,
            endVisible: true,
        },
		crosshair: true,
		tick: true,
		title: 'Title',
		categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
		label: {
			// startStep: 0,
			step: 2,
		},
        line: true,
        scrollBar: {
            visible: true
        }
	},
	yAxis: [{
		
		crosshair: true,
		grid: true,
		line: true,
		tick: true,
		title: 'Title',
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
		  ],
		
	}],
	body: {
        zoomType: 'x',
        style: {
            // stroke: 'none'
        },
		annotations: [{
            offsetX: 30,
            offsetY: 25,
            rotation: 5,
            text: 'Annotation Sample',
            style: {
                fill: 'white'
            },
            backgroundStyle: {
                fill: '#333',
                padding: '3px 5px',
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
                fill: 'white'
            },
            backgroundStyle: {
                padding: '3px 5px',
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
        }],
		
    },
	series: [{
		colorByPoint: true,
		pointLabel: true,
		pointWidth: 30,
		yAxis: 0,
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
	{
		lineType: 'spline',
		type: 'line',
		color: '#333',
		trendline: {
            visible: true,
            type: 'movingAverage',
            movingAverage: {
                interval: 4,
            }
        },
		yAxis: 1,
		data : [10,20,30,50,70,90,110,130,150,160,170,180]
	}
	
	],
	ChartTextEffect: {
		autoContrast: true,
	},
	seriesNavigator: {
        visible: true
    },
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
	createCheckBox(container, 'Inverted', function (e) {
            chart.inverted = _getChecked(e);
		}, false);
	createCheckBox(container, 'X Reversed', function (e) {
			config.xAxis.reversed = _getChecked(e);
			chart.load(config, animate);
		}, false);
	createCheckBox(container, 'Y Reversed', function (e) {
			config.yAxis.reversed = _getChecked(e);
			chart.load(config, animate);
		}, false);
	line(container);
	createCheckBox(container, 'export.visible', function (e) {
			config.export.visible = _getChecked(e);
			chart.load(config, animate);
		}, true);
	createCheckBox(container, 'export.hideNavigator', function (e) {
			config.export.hideNavigator = _getChecked(e);
			chart.load(config, animate);
		}, false);
	createCheckBox(container, 'export.hideScrollbar', function (e) {
			config.export.hideScrollbar = _getChecked(e);
			chart.load(config, animate);
		}, false);
	createCheckBox(container, 'export.hideZoomButton', function (e) {
			config.export.hideZoomButton = _getChecked(e);
			chart.load(config, animate);
		}, false);
	line(container);
	createListBox(container, "export.width", ['425', '850', '1275'], function (e) {
        config.export.width = Number(_getValue(e));
        chart.load(config);
    }, '850');
	createListBox(container, "export.scale", ['0.5', '1', '1.5'], function (e) {
        config.export.scale = Number(_getValue(e));
        chart.load(config);
    }, '1');
}

function init() {
	console.log('RealChart v' + RealChart.getVersion());
	// RealChart.setDebugging(true);

	chart = RealChart.createChart(document, 'realchart', config);
	setActions('actions');
}
