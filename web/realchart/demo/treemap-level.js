/**
 * @demo
 * 
 */
const config = {
    title: "Treemap - Levels",
    xAxis: {
    },
    yAxis: {
    },
    series: {
        type: 'treemap',
        // startDir: 'vertical',
        algorithm: 'squarify',
        // algorithm: 'strip',
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
            "id": "A",
            "name": "Nord-Norge",
            "color": "#50FFB1"
        }, {
            "id": "B",
            "name": "Trøndelag",
            "color": "#F5FBEF"
        }, {
            "id": "C",
            "name": "Vestlandet",
            "color": "#A09FA8"
        }, {
            "id": "D",
            "name": "Østlandet",
            "color": "#E7ECEF"
        }, {
            "id": "E",
            "name": "Sørlandet",
            "color": "#A9B4C2"
        }, {
            "name": "Troms og Finnmark",
            "group": "A",
            "value": 70923
        }, {
            "name": "Nordland",
            "group": "A",
            "value": 35759
        }, {
            "name": "Trøndelag",
            "group": "B",
            "value": 39494
        }, {
            "name": "Møre og Romsdal",
            "group": "C",
            "value": 13840
        }, {
            "name": "Vestland",
            "group": "C",
            "value": 31969
        }, {
            "name": "Rogaland",
            "group": "C",
            "value": 8576
        }, {
            "name": "Viken",
            "group": "D",
            "value": 22768
        }, {
            "name": "Innlandet",
            "group": "D",
            "value": 49391
        },
        {
            "name": "Oslo",
            "group": "D",
            "value": 454
        },
        {
            "name": "Vestfold og Telemark",
            "group": "D",
            "value": 15925
        },
        {
            "name": "Agder",
            "group": "E",
            "value": 14981
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
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config, false);
    setActions('actions')
}
