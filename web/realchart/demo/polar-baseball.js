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
    height: 600,
    actions: [
        {
            label: 'yAxis.type',
            type: 'select',
            data: ['linear', 'log'],
            value: 'log',
            action: ({value}) => {
                config.yAxis.type = value;
                config.yAxis.template = `${value}Axis`;
                chart.load(config);
            }
        }
    ],
    polar: true,
    templates: {
        series: {
            noClip: true,
            pointLabel: false,
            xField: 'angle',
            yField: 'hits',
            tooltipText: '${x}°: ${y}hits',
        },
        logAxis: {
            label: {
                visible: true,
                effect: 'outline',
                outlineThickness: 5,
                style: {
                    fill: '#555',
                },
                firstText: '',
            },
            title: 'hits',
            tick: { 
                visible: false,
                // stepInterval: 0.5,
                // stepCount: 5,
                steps: [0, Math.log10(5), Math.log10(10), Math.log10(20), Math.log10(30)]
            },
        },
        linearAxis: {
            label: {
                visible: true,
                effect: 'outline',
                outlineThickness: 5,
                style: {
                    fill: '#555',
                },
                firstText: '',
            },
            tick: { 
                visible: false,
                // steps: [0, Math.log10(5), Math.log10(10), Math.log10(20), Math.log10(30)]
            },

        }
    },
    options: {
        // animatable: false,
        style: {
            paddingLeft: '100px'
        },
        credits: false,
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
    legend: false,
    xAxis: {
        type: 'linear',
        reversed: true,
        startAngle: 10,
        totalAngle: 160,
        minValue: -90,
        maxValue: 90,
        label: {
            visible: true,
            suffix: '°',
            style: {
                fill: '#999'
            },
            textCallback: ({ count, index, value }) => {
                return (value > -90 && value < 90) ? value.toString() : '';
            },
        },
        tick: {
            stepInterval: 10,
        },
        grid: {
            // visible: false,
            startVisible: false
        },
        line: {
            visible: true,
            style: {
                stroke: '#999',
                // stroke: 'red',
                // strokeWidth: '2px',
                // fill: '#999'
            }
        },
        sectorLine: {
            style: {
                stroke: '#999',
            }
        }
    },
    yAxis: {
        template: 'logAxis',
        type: 'log',
        // template: 'linearAxis',
        // type: 'linear',
    },
    body: {
        annotations: [
            {
                imageUrl: '../assets/images/baseball-player.png',
                align: 'center',
                verticalAlign: 'middle',
                offsetX: -120,
                // offsetY: -30,
                width: 400
            }
        ]
    },
    tooltip: {
        level: 'series'
    },
    series: {
        // layout: 'stack',
        layout: 'overlap',
        // noClip: false,
        groupPadding: 0,
        children: [
        {
            template: 'series',
            data: ballsData,
            style: {
                stroke: 'none',
                fill: '#bbb',
            },
            tooltipText: '${name}°: ${y}hits',
        },
        {
            template: 'series',
            data: hitsData,
            style: {
                stroke: 'none',
                fill: 'var(--color-3)',
            },
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
    createListBox(container, "X.startAngle", ['0', '90', '180', '270'], function (e) {
        config.xAxis.startAngle = _getValue(e);
        chart.load(config);
    }, '0');
    createListBox(container, "X.totalAngle", ['360', '270', '180'], function (e) {
        config.xAxis.totalAngle = _getValue(e);
        chart.load(config);
    }, '360');
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
		true
	);
    createCheckBox(
		container,
		'polar',
		function (e) {
            config.polar = _getChecked(e);
			chart.load(config, animate);
		},
		true
	);
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
