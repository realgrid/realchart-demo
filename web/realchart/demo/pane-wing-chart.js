/**
 * @demo
 * 
 */
const config = {
    templates: {
    },
    inverted: true,
    title: "Wing Chart by Pane",
    options: {
        animatable: false
    },
    legend: {
        visible: false,
        itemGap: 100,
        backgroundStyle: {
            fill: 'none'
        }
    },
    xAxis: [{
        // title: "일일 Daily fat",
        position: 'between',
        categories: [
            '0-4', '5-9', '10-14', '15-19', '20-24', '25-29', '30-34', '35-40', '40-45',
            '45-49', '50-54', '55-59', '60-64', '65-69', '70-74', '75-79', '80+'
        ],
        grid: true,
    }],
    yAxis: [{
        title: "남자",
        reversed: true,
        tick: {
            length: 5,
            margin: 0
        }
    }, {
        col: 1,
        title: "여자",
        // grid: false,
        tick: {
            baseAxis: 0,
            baseRange: true,
            length: 5,
            margin: 0
        }
    }],
    panes: {
        visible: true,
        rows: 2
    },
    series: [{
        name: '남자',
        pointLabel: {
            visible: true,
            numberFormat: 'a##0.00'
        },
        data: [
            8.98, 7.52, 6.65, 5.72, 4.85,
            3.71, 2.76, 2.07, 1.70, 1.47,
            1.22, 0.99, 0.81, 0.62, 0.41,
            0.23, 0.15
        ]
    }, {
        name: '여자',
        color: '#ffaa00',
        yAxis: 1,
        pointLabel: {
            visible: true,
            numberFormat: '##0.00'
        },
        data: [
            8.84, 7.42, 6.57, 5.68, 4.83,
            3.74, 2.80, 2.14, 1.79, 1.59,
            1.34, 1.06, 0.83, 0.63, 0.43,
            0.25, 0.19
        ]
    }]
}

let animate = false;
let chart;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.render();
    }, false);
    createCheckBox(container, 'Always Animate', function (e) {
        animate = _getChecked(e);
    }, false);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
    createCheckBox(container, 'Inverted', function (e) {
        config.inverted = _getChecked(e);
        chart.load(config, animate);
    }, true);
    createCheckBox(container, 'X Reversed', function (e) {
        config.xAxis[0].reversed = _getChecked(e);
        chart.load(config, animate);
    }, false);
    createCheckBox(container, 'Y Reversed', function (e) {
        config.yAxis[0].reversed = _getChecked(e);
        chart.load(config, animate);
    }, true);
    createCheckBox(container, 'Y Reversed2', function (e) {
        config.yAxis[1].reversed = _getChecked(e);
        chart.load(config, animate);
    }, false);
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
