/**
 * @demo
 * 
 */

const ballsData = [
    { angle: 85, hits: 1 },
    { angle: 80, hits: 3 },
    { angle: 65, hits: 13 },
    { angle: 60, hits: 1 },
    { angle: 55, hits: 4 },
    { angle: 50, hits: 6 },
    { angle: 45, hits: 8 },
    { angle: 40, hits: 6 },
    { angle: 35, hits: 14 },
    { angle: 30, hits: 11 },
    { angle: 25, hits: 11 },
    { angle: 20, hits: 17 },
    { angle: 15, hits: 15 },
    { angle: 10, hits: 16 },
    { angle: 5, hits: 15 },
    { angle: 0, hits: 15 },
    { angle: -5, hits: 9 },
    { angle: -10, hits: 9 },
    { angle: -15, hits: 11 },
    { angle: -20, hits: 6 },
    { angle: -25, hits: 22 },
    { angle: -30, hits: 5 },
    { angle: -35, hits: 3 },
    { angle: -40, hits: 7 },
    { angle: -45, hits: 3 },
    { angle: -55, hits: 1 },
    { angle: -65, hits: 2 },
];

const hitsData = [
    { angle: 30, hits: 1 },
    { angle: 25, hits: 4 },
    { angle: 20, hits: 4 },
    { angle: 15, hits: 5 },
    { angle: 10, hits: 10 },
    { angle: 5, hits: 10 },
    { angle: 0, hits: 7 },
    { angle: -5, hits: 2 },
    { angle: -10, hits: 5 },
    { angle: -20, hits: 4 },
    { angle: -65, hits: 1 },
]


const config = {
    inverted: true,
    // polar: true,
    options: {
        // animatable: false
        style: {
            paddingLeft: '260px'
        }
    },
    title: {
        text: 'J.D Reyes',
        align: 'left',
        style: {
            fontWeight: 700,
        }
    },
    subtitle: {
        text: '<t style="fill:#888">Balls in play</t><br><t style="fill:var(--color-3)">Hits</t>',
        align: 'left',
        style: {
            textAlign: 'left'
        }
    },
    xAxis: {
        type: 'linear',
        minValue: -90,
        maxValue: 90,
        // strictMin: 0,
        // strictMax: 360,
        label: {
            visible: true,
            suffix: '°',
            style: {
                fill: '#999'
            }
        },
        tick: {
            visible: !true,
            stepInterval: 10,
        },
        grid: {
            visible: false,
        },
    },
    yAxis: {
        type: 'linear',
        line: true,
        label: {
            visible: true,
            style: {
                fill: '#999'
            }
        },
        title: 'hits',
        grid: {
            visible: true,
            // startVisible: false,
        },
        strictMax: 25,
        tick: { 
            visible: !true,
            stepInterval: 5 
        },
    },
    body: {
        // startAngle: 90,
        annotations: [
            {
                imageUrl: '../assets/images/baseball-player.png',
                align: 'right',
                offsetX: 300,
                offsetY: 0,
                width: 300
            }
        ]
    },
    legend: false,
    series: {
        layout: 'overlap',
        children: [{
            noClip: true,
            type: 'bar',
            pointLabel: {
                visible: !true,
            },
            data: ballsData,
            xField: 'angle',
            yField: 'hits',
            style: {
                stroke: 'none',
                fill: '#bbb',
            }
        }, {
            noClip: true,
            type: 'bar',
            pointLabel: {
                visible: !true,
            },
            data: hitsData,
            xField: 'angle',
            yField: 'hits',
            style: {
                stroke: 'none',
                fill: 'var(--color-3)',
            }
        },]
    }
}

let animate;
let chart;

function setActions(container) {
	createCheckBox(
		container,
		'Debug',
		function (e) {
			RealChart.setDebugging(_getChecked(e));
			chart.render();
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
    createListBox(container, "X.startOffset", ['0', '0.5'], function (e) {
        config.xAxis.startOffset = _getValue(e);
        chart.load(config);
    }, '0');
	createCheckBox(
		container,
		'body.circular',
		function (e) {
            config.body.circular = _getChecked(e);
			chart.load(config, animate);
		},
		false,
	);
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
