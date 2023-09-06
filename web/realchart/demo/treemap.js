/**
 * @demo
 * 
 */
const config = {
    title: "Treemap",
    xAxis: {
    },
    yAxis: {
    },
    series: {
        type: 'treemap',
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
            "value": 6,
            "colorValue": 1
        }, {
            "name": "B",
            "value": 5,
            "colorValue": 2
        }, {
            "name": "C",
            "value": 4,
            "colorValue": 3
        }, {
            "name": "D",
            "value": 3,
            "colorValue": 4
        }, {
            "name": "E",
            "value": 2,
            "colorValue": 5
        }, {
            "name": "F",
            "value": 2,
            "colorValue": 6
        }, {
            "name": "G",
            "value": 1,
            "colorValue": 7
        }, {
            "name": "H",
            "value": 1,
            "colorValue": 7
        }, {
            "name": "I",
            "value": 1,
            "colorValue": 7
        }],
        style: {
        }
    }
}

let chart;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.refresh();
    }, false);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
