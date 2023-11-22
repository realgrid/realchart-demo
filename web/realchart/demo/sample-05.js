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
            "name": "A1",
            "group": "A",
            "value": 70923
        }, {
            "name": "A2",
            "group": "A",
            "value": 35759
        }, {
            "name": "A3",
            "group": "A",
            "value": 33494
        }, {
            "name": "A4",
            "group": "A",
            "value": 32494
        }, {
            "name": "A5",
            "group": "A",
            "value": 31494
        }, {
            "name": "A6",
            "group": "A",
            "value": 30494
        }, {
            "name": "A7",
            "group": "A",
            "value": 29094
        }, {
            "name": "A8",
            "group": "A",
            "value": 28694
        }, {
            "name": "A9",
            "group": "A",
            "value": 28494
        }, {
            "name": "A10",
            "group": "A",
            "value": 28494
        }, {
            "name": "A11",
            "group": "A",
            "value": 27494
        }, {
            "name": "A12",
            "group": "A",
            "value": 26494
        }, {
            "name": "A13",
            "group": "A",
            "value": 25494
        }, {
            "name": "A14",
            "group": "A",
            "value": 24494
        }, {
            "name": "A15",
            "group": "A",
            "value": 23494
        }, {
            "name": "A16",
            "group": "A",
            "value": 22494
        }, {
            "name": "A17",
            "group": "A",
            "value": 21494
        }, {
            "name": "A18",
            "group": "A",
            "value": 19494
        }, {
            "name": "A19",
            "group": "A",
            "value": 18494
        }, {
            "name": "A20",
            "group": "A",
            "value": 17494
        }, {
            "name": "A21",
            "group": "A",
            "value": 16494
        }, {
            "name": "A22",
            "group": "A",
            "value": 15494
        }, {
            "name": "A23",
            "group": "A",
            "value": 14494
        }, {
            "name": "A24",
            "group": "A",
            "value": 13494
        }, {
            "name": "A25",
            "group": "A",
            "value": 12494
        }, {
            "name": "A26",
            "group": "A",
            "value": 11494
        }, {
            "name": "A27",
            "group": "A",
            "value": 10494
        }, {
            "name": "A28",
            "group": "A",
            "value": 9494
        }, {
            "name": "A29",
            "group": "A",
            "value": 8494
        }, {
            "name": "A30",
            "group": "A",
            "value": 7494
        }, {
            "name": "A31",
            "group": "A",
            "value": 6494
        }, {
            "name": "A32",
            "group": "A",
            "value": 5494
        }, {
            "name": "A33",
            "group": "A",
            "value": 4494
        }, {
            "name": "A34",
            "group": "A",
            "value": 3494
        }, {
            "id": 'B1',
            "name": "B1",
            "group": "B",
            "value": 59840
        }, {
            "name": "B1-1",
            "group": "B1",
            "value": 59840
        }, {
            "name": "B1-2",
            "group": "B1",
            "value": 59840
        }, {
            "name": "B1-3",
            "group": "B1",
            "value": 59840
        }, {
            "name": "B1-4",
            "group": "B1",
            "value": 59840
        }, {
            "name": "B1-5",
            "group": "B1",
            "value": 59840
        }, {
            "name": "B1-6",
            "group": "B1",
            "value": 59840
        }, {
            "name": "B1-7",
            "group": "B1",
            "value": 59840
        }, {
            "name": "B1-8",
            "group": "B1",
            "value": 59840
        },{
            "id": "B2",
            "name": "B2",
            "group": "B",
            "value": 57969
        },{
            "name": "B2-1",
            "group": "B2",
            "value": 57969
        },{
            "name": "B2-2",
            "group": "B2",
            "value": 57969
        },{
            "name": "B2-3",
            "group": "B2",
            "value": 57969
        },{
            "name": "B2-4",
            "group": "B2",
            "value": 57969
        },{
            "name": "B2-5",
            "group": "B2",
            "value": 57969
        },{
            "name": "B2-6",
            "group": "B2",
            "value": 57969
        },{
            "name": "B2-7",
            "group": "B2",
            "value": 57969
        },{
            "name": "B2-8",
            "group": "B2",
            "value": 57969
        },{
            "name": "B2-9",
            "group": "B2",
            "value": 57969
        },{
            "name": "B2-10",
            "group": "B2",
            "value": 57969
        },{
            "name": "B2-1",
            "group": "B2",
            "value": 57969
        },{
            "name": "B2-1",
            "group": "B2",
            "value": 57969
        },{
            "name": "B2-1",
            "group": "B2",
            "value": 57969
        },{
            "name": "B2-1",
            "group": "B2",
            "value": 57969
        },{
            "name": "B2-1",
            "group": "B2",
            "value": 57969
        },{
            "name": "B2-1",
            "group": "B2",
            "value": 57969
        },{
            "name": "B2-1",
            "group": "B2",
            "value": 57969
        },{
            "name": "B2-1",
            "group": "B2",
            "value": 57969
        },{
            "name": "B2-1",
            "group": "B2",
            "value": 57969
        },{
            "name": "B2-1",
            "group": "B2",
            "value": 57969
        },{
            "name": "B2-1",
            "group": "B2",
            "value": 57969
        },{
            "name": "C1",
            "group": "C",
            "value": 215768
        }, 
        {
            "id": "CC",
            "name": "C2",
            "group": "C",
            "value": 115768
        },{
            "name": "CC1",
            "group": "CC",
            "value": 105768
        },{
            "name": "CC2",
            "group": "CC",
            "value": 95768
        },{
            "name": "CC3",
            "group": "CC",
            "value": 94768
        },{
            "name": "CC4",
            "group": "CC",
            "value": 93768
        },
        {
            "name": "CC5",
            "group": "CC",
            "value": 92768
        },{
            "name": "CC6",
            "group": "CC",
            "value": 91768
        },{
            "name": "CC7",
            "group": "CC",
            "value": 90768
        },{
            "name": "CC8",
            "group": "CC",
            "value": 89768
        },{
            "name": "CC9",
            "group": "CC",
            "value": 88768
        },{
            "name": "CC10",
            "group": "CC",
            "value": 87768
        },{
            "name": "CC11",
            "group": "CC",
            "value": 86768
        },{
            "name": "CC12",
            "group": "CC",
            "value": 85768
        },{
            "name": "CC13",
            "group": "CC",
            "value": 84768
        },{
            "name": "CC14",
            "group": "CC",
            "value": 83768
        },{
            "name": "CC15",
            "group": "CC",
            "value": 82768
        },{
            "name": "CC16",
            "group": "CC",
            "value": 81768
        },{
            "name": "CC17",
            "group": "CC",
            "value": 80768
        },{
            "name": "CC18",
            "group": "CC",
            "value": 79768
        },{
            "name": "CC19",
            "group": "CC",
            "value": 78768
        },{
            "name": "CC20",
            "group": "CC",
            "value": 77768
        },{
            "name": "CC21",
            "group": "CC",
            "value": 76768
        },{
            "name": "CC22",
            "group": "CC",
            "value": 75768
        },{
            "name": "CC23",
            "group": "CC",
            "value": 74768
        },{
            "name": "CC24",
            "group": "CC",
            "value": 73768
        },{
            "name": "CC25",
            "group": "CC",
            "value": 72768
        },{
            "name": "CC26",
            "group": "CC",
            "value": 71768
        },{
            "name": "CC27",
            "group": "CC",
            "value": 70768
        },{
            "name": "CC28",
            "group": "CC",
            "value": 69768
        },{
            "name": "CC29",
            "group": "CC",
            "value": 68768
        },{
            "name": "CC30",
            "group": "CC",
            "value": 67768
        },{
            "id": "C2",
            "name": "C2",
            "group": "C",
            "value": 67768
        },{
            "name": "C2-1",
            "group": "C2",
            "value": 67768
        },{
            "name": "C2-1",
            "group": "C2",
            "value": 67768
        },{
            "name": "C2-1",
            "group": "C2",
            "value": 67768
        },{
            "name": "C2-1",
            "group": "C2",
            "value": 67768
        },{
            "name": "C2-1",
            "group": "C2",
            "value": 67768
        },{
            "name": "C2-1",
            "group": "C2",
            "value": 67768
        },{
            "name": "C2-1",
            "group": "C2",
            "value": 67768
        },{
            "name": "C2-1",
            "group": "C2",
            "value": 67768
        },{
            "name": "C2-1",
            "group": "C2",
            "value": 67768
        },{
            "name": "C2-1",
            "group": "C2",
            "value": 67768
        },{
            "name": "C2-1",
            "group": "C2",
            "value": 67768
        },{
            "name": "C2-1",
            "group": "C2",
            "value": 67768
        },{
            "name": "C2-1",
            "group": "C2",
            "value": 67768
        },{
            "name": "C2-1",
            "group": "C2",
            "value": 67768
        },{
            "name": "C2-1",
            "group": "C2",
            "value": 67768
        },{
            "name": "C2-1",
            "group": "C2",
            "value": 67768
        },{
            "name": "C2-1",
            "group": "C2",
            "value": 67768
        },{
            "name": "C2-1",
            "group": "C2",
            "value": 67768
        },{
            "name": "C2-1",
            "group": "C2",
            "value": 67768
        },{
            "name": "C2-1",
            "group": "C2",
            "value": 67768
        },{
            "name": "C2-1",
            "group": "C2",
            "value": 67768
        },
        {
            "name": "D1",
            "group": "D",
            "value": 15925
        },
        {
            "name": "D2",
            "group": "D",
            "value": 14981
        }],
        style: {
        }
    }
}
let chart;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.render();
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
