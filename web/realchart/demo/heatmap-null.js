/**
 * @demo
 * 
 */
const config = {
    options: {
        animatable: false
    },
    title: "Heatmap - Null Point",
    plot: {
        style: {
            fill: '#efefef'
        }
    },
    xAxis: {
        title: 'X Axis',
        categories: ['Alexander', 'Marie', 'Maximilian', 'Sophia', 'Lukas', '마리아', 'Leon', 'Anna', 'Tim', 'Laura'],
        grid: true,
        label: {
            rotation: -45
        }
    },
    yAxis: {
        title: 'Y Axis',
        categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        grid: true
    },
    series: {
        type: 'heatmap',
        pointLabel: {
            visible: true,
            position: 'head',
            // offset: 10,
            // text: '<b style="fill:red">${x}</b>',
            effect: 'outline',// 'background',
            style: {
            },
            // backgroundStyle: {
            //     fill: '#004',
            //     padding: '5px'
            // }
        },
        data: [
            [0, 0, null], [0, 1, 19], [0, 2, 8], [0, 3, 24], [0, 4, 67],
            [1, 0, 92], [1, 1, null], [1, 2, 78], [1, 3, 117], [1, 4, 48],
            [2, 0, 35], [2, 1, 15], [2, 2, 123], [2, 3, 64], [2, 4, 52],
            [3, 0, 72], [3, 1, 132], [3, 2, null], [3, 3, 19], [3, 4, 16],
            [4, 0, 38], [4, 1, 5], [4, 2, 8], [4, 3, 117], [4, 4, 115],
            [5, 0, 88], [5, 1, 32], [5, 2, 12], [5, 3, 6], [5, 4, 120],
            [6, 0, 13], [6, 1, 44], [6, 2, null], [6, 3, 98], [6, 4, 96],
            [7, 0, 31], [7, 1, 1], [7, 2, 82], [7, 3, 32], [7, 4, 30],
            [8, 0, 85], [8, 1, 97], [8, 2, 123], [8, 3, 64], [8, 4, 84],
            [9, 0, 47], [9, 1, 114], [9, 2, 31], [9, 3, 48], [9, 4, 91]
        ],
        style: {
            // fill: 'yellow'
        }
    }
}

let animate = false;
let chart;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.refresh();
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

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
