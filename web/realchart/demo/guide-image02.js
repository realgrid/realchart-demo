/**
 * @demo
 *
 * Bar Series 기본 예제.
 */
const config = {
    options: {
        // animatable: false
    },
    title: {
        text: "한국 경제 지표",
        align: 'left',
        style: {
            fontWeight: 'bold'
        }
    },
    subtitle: {
        text: 'GDP 성장률 대 비교 수출량',
        align: 'left',
    },
    legend: {
        // layout: 'vertical',
        position: 'plot',
        left: 0,
        top: 0
    },
	body: {
		annotations: [
		{
            offsetX: 460,
            offsetY: 25,
            rotation: 0,
            text: '8월 20일 최고점 기록',
            // style: {
            //     padding: '3px 5px',
            //     fill: 'white'
            // },
            backgroundStyle: {
                fill: 'white',
                rx: 5,
                fillOpacity: 0.7
            }
        },{
            type: 'image',
            align: 'left',
            offsetX: 70,
            offsetY: 5,
            width: 170,
            imageUrl: '../assets/images/태극기.png'
        }],
		image: {
            url: '../assets/images/컨테이너선.jpeg',
            style: {
                opacity: 0.2
            }
        },
	},
    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ],
    },
    yAxis: [{
        grid: true,
        title: {
            text: '변화율 (%)',
            style: {
            }
        },
        tick: {
            baseAxis: 0
        },
        label: {
            suffix: '',
            style: {
            }
        }
    }, {
        grid: false,
        title: {
            text: '수출액 (십억 USD)',
            style: {
            }
        },
        tick: {
            baseAxis: 0
        },
        label: {
            suffix: '',
            style: {
            }
        },
        position: "opposite"
    }],
    series: [{
        name: 'GDP 성장률',
        type: 'line',
        lineType: 'spline',
        data: [
            15.0, 14.9, 16.5, 21.5, 24.2, 29.5, 33.2, 35.5, 33.3, 28.3, 23.9, 19.6
        ]
    }, {
        name: '수출량 변화율',
        type: 'line',
        lineType: 'spline',
        yAxis: 1,
        data: [114, 115, 114.9, 114.5, 111.3, 109.5, 109.6, 110.2, 113.1, 114.9, 115.2, 114.7],
        marker: {
            visible: true
        },
        style: {
            strokeDasharray: '2',
			stroke: "#333",
			fill: '#333'
        }
    }]
}

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
