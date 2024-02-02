/**
 * @demo
 * 
 */
207015,27016,25575
const config = {
    title: "Point Style Callback",
    options: {
        // animatable: false
    },
    xAxis: {
		title: '서울시',
		categories: ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'],
		grid: true
	},
    yAxis: {
        title: "Vertical 수직축 Axis",
        // reversed: true,
        // baseValue: -1
    },
    series: [{
        name: 'column1',
        pointLabel: {
            visible: true,
            position: 'inside',
            effect: 'outline',
        },
        // pointWidth: '100%',
        pointStyleCallback: args => {
            if (args.index == 0) {
                return { fill: 'lightgray' }
            }
            else if(args.yValue === args.yMax) {
                return { fill: 'green' }
            }
        },
        data: [155, 138, 122, 133, 114, 113, 123, 119, 125, 131],
    }, {
        name: 'line1',
        type: 'line',
        pointLabel: true,
        color: 'blue',
        data: [58, 80, 77, 79, 68, 84, 96, 82, 77, 120],
        style: {
            strokeDasharray: '5'
        },
        marker: {
            style: {
                stroke: 'white',
                strokeDasharray: 'none'
            }
        },
        pointStyleCallback: args => {
            if (args.yValue === args.yMax) {
                return { fill: 'red', strokeWidth: '5px', stroke: 'red' }
            }
            return { fill: 'green' }
        }
    }]
}

let animate = false;
let chart;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.render();
    }, false);
    // createCheckBox(container, 'Always Animate', function (e) {
    //     animate = _getChecked(e);
    // }, false);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
    createCheckBox(container, 'Inverted', function (e) {
        config.inverted = _getChecked(e);
        chart.load(config, animate);
    }, false);
    createCheckBox(container, 'X Reversed', function (e) {
        config.xAxis.reversed = _getChecked(e);
        chart.load(config, animate);
    }, false);
    createCheckBox(container, 'Y Reversed', function (e) {
        config.yAxis.reversed = _getChecked(e);
        chart.load(config, animate);
    }, false);
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
