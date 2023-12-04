/**
 * @demo
 * 
 */
const config = {
    options: {
        animatable: false
    },
    title: "Treemap",
    xAxis: {
    },
    yAxis: {
    },
    series: {
        type: 'treemap',
        tooltip: {
            text: 'id: ${id}<br>group: ${group}'
        },
        // startDir: 'vertical',
        algorithm: 'squarify',
        // algorithm: 'sliceDice',
        // algorithm: 'slice',
        pointLabel: {
            visible: true,
            text: '${x}',
            effect: 'outline',
            style: {
            },
        },
        data: [{
            "name": "A",
            "value": 6
        }, {
            "name": "B",
            "value": 5
        }, {
            "name": "C",
            "value": 4,
        }, {
            "name": "D",
            "value": 3,
        }, {
            "name": "E",
            "value": 2,
        }, {
            "name": "F",
            "value": 2,
        }, {
            "name": "G",
            "value": 1,
        }, {
            "name": "H",
            "value": 1,
        }, {
            "name": "I",
            "value": 1,
        }],
        style: {
        }
    }
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
    }, false);
    // createCheckBox(container, 'X Reversed', function (e) {
    //     config.xAxis.reversed = _getChecked(e);
    //     chart.load(config, animate);
    // }, false);
    // createCheckBox(container, 'Y Reversed', function (e) {
    //     config.yAxis.reversed = _getChecked(e);
    //     chart.load(config, animate);
    // }, false);
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
