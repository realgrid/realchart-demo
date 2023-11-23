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
        algorithm: 'squarify',
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
            "name": "A1",
            "group": "A",
            "value": 250923
        }, {
            "name": "A2",
            "group": "A",
            "value": 245759
        }, {
            "name": "A3",
            "group": "A",
            "value": 233494
        }, {
            "name": "A4",
            "group": "A",
            "value": 222494
        }, {
            "name": "A5",
            "group": "A",
            "value": 211494
        }, {
            "name": "A6",
            "group": "A",
            "value": 200494
        }, {
            "name": "A7",
            "group": "A",
            "value": 159094
        }, {
            "name": "A8",
            "group": "A",
            "value": 138694
        }, {
            "name": "A9",
            "group": "A",
            "value": 138494
        }, {
            "name": "A10",
            "group": "A",
            "value": 128494
        }, {
            "name": "A11",
            "group": "A",
            "value": 127494
        }, {
            "name": "A12",
            "group": "A",
            "value": 126494
        }, {
            "name": "A13",
            "group": "A",
            "value": 125494
        }, {
            "name": "A14",
            "group": "A",
            "value": 124494
        }, {
            "name": "A15",
            "group": "A",
            "value": 123494
        }, {
            "name": "A16",
            "group": "A",
            "value": 122494
        }, {
            "name": "A17",
            "group": "A",
            "value": 121494
        }, {
            "name": "A18",
            "group": "A",
            "value": 119494
        }, {
            "name": "A19",
            "group": "A",
            "value": 118494
        }, {
            "name": "A20",
            "group": "A",
            "value": 117494
        }, {
            "name": "A21",
            "group": "A",
            "value": 116494
        }, {
            "name": "A22",
            "group": "A",
            "value": 115494
        }, {
            "name": "A23",
            "group": "A",
            "value": 114494
        }, {
            "name": "A24",
            "group": "A",
            "value": 113494
        }, {
            "name": "A25",
            "group": "A",
            "value": 112494
        }, {
            "name": "A26",
            "group": "A",
            "value": 111494
        }, {
            "name": "A27",
            "group": "A",
            "value": 110494
        }, {
            "name": "A28",
            "group": "A",
            "value": 119494
        }, {
            "name": "A29",
            "group": "A",
            "value": 118494
        }, {
            "name": "A30",
            "group": "A",
            "value": 57494
        }, {
            "name": "A31",
            "group": "A",
            "value": 46494
        }, {
            "name": "A32",
            "group": "A",
            "value": 135494
        }, {
            "name": "A33",
            "group": "A",
            "value": 124494
        }, {
            "name": "A34",
            "group": "A",
            "value": 119494
        }, {
            "id": 'B1',
            "name": "B1",
            "group": "B",
            "value": 670840
        }, {
            "name": "B1-1",
            "group": "B1",
            "value":350040
        }, {
            "name": "B1-2",
            "group": "B1",
            "value": 265840
        }, {
            "name": "B1-3",
            "group": "B1",
            "value": 159840
        }, {
            "name": "B1-4",
            "group": "B1",
            "value": 155840
        }, {
            "name": "B1-5",
            "group": "B1",
            "value": 152840
        }, {
            "name": "B1-6",
            "group": "B1",
            "value": 131840
        }, {
            "name": "B1-7",
            "group": "B1",
            "value": 129840
        }, {
            "name": "B1-8",
            "group": "B1",
            "value": 126840
        },{
            "id": "B2",
            "name": "B2",
            "group": "B",
            "value": 36969
        },{
            "name": "B2-1",
            "group": "B2",
            "value": 27969
        },{
            "name": "B2-2",
            "group": "B2",
            "value": 24969
        },{
            "name": "B2-3",
            "group": "B2",
            "value": 23969
        },{
            "name": "B2-4",
            "group": "B2",
            "value": 22969
        },{
            "name": "B2-5",
            "group": "B2",
            "value": 21969
        },{
            "name": "B2-6",
            "group": "B2",
            "value": 17969
        },{
            "name": "B2-7",
            "group": "B2",
            "value": 17969
        },{
            "name": "B2-8",
            "group": "B2",
            "value": 15969
        },{
            "name": "B2-9",
            "group": "B2",
            "value": 15969
        },{
            "name": "B2-10",
            "group": "B2",
            "value": 14969
        },{
            "name": "B2-11",
            "group": "B2",
            "value": 13969
        },{
            "name": "B2-12",
            "group": "B2",
            "value": 12969
        },{
            "name": "B2-13",
            "group": "B2",
            "value": 10069
        },{
            "name": "B2-14",
            "group": "B2",
            "value": 7969
        },{
            "name": "B2-15",
            "group": "B2",
            "value": 6969
        },{
            "name": "B2-16",
            "group": "B2",
            "value": 5969
        },{
            "name": "B2-17",
            "group": "B2",
            "value": 4969
        },{
            "name": "B2-18",
            "group": "B2",
            "value": 3799
        },{
            "name": "B2-19",
            "group": "B2",
            "value": 2969
        },{
            "name": "B2-20",
            "group": "B2",
            "value": 1969
        },{
            "name": "B2-21",
            "group": "B2",
            "value": 99969
        },{
            "name": "B2-22",
            "group": "B2",
            "value": 98969
        },{
            "name": "B2-23",
            "group": "B2",
            "value": 97969
        },{
            "name": "B2-24",
            "group": "B2",
            "value": 96969
        },{
            "name": "B2-25",
            "group": "B2",
            "value": 95969
        },{
            "name": "B2-26",
            "group": "B2",
            "value": 94469
        },{
            "name": "B2-27",
            "group": "B2",
            "value": 93969
        },{
            "name": "B2-28",
            "group": "B2",
            "value": 92969
        },{
            "name": "B2-29",
            "group": "B2",
            "value": 91969
        },{
            "name": "B2-30",
            "group": "B2",
            "value": 90969
        },{
            "name": "B2-31",
            "group": "B2",
            "value": 89969
        },{
            "name": "B2-32",
            "group": "B2",
            "value": 88969
        },{
            "name": "B2-33",
            "group": "B2",
            "value": 87969
        },{
            "name": "B2-34",
            "group": "B2",
            "value": 86969
        },{
            "name": "B2-35",
            "group": "B2",
            "value": 85969
        },{
            "name": "B2-36",
            "group": "B2",
            "value": 83369
        },{
            "name": "B2-37",
            "group": "B2",
            "value": 82969
        },{
            "name": "B2-38",
            "group": "B2",
            "value": 81969
        },{
            "name": "B2-39",
            "group": "B2",
            "value": 80969
        },{
            "name": "B2-40",
            "group": "B2",
            "value": 79969
        },{
            "name": "B2-41",
            "group": "B2",
            "value": 78969
        },{
            "name": "B2-42",
            "group": "B2",
            "value": 77969
        },{
            "name": "B2-43",
            "group": "B2",
            "value": 76969
        },{
            "name": "B2-44",
            "group": "B2",
            "value": 74969
        },{
            "name": "B2-45",
            "group": "B2",
            "value": 73969
        },{
            "name": "B2-46",
            "group": "B2",
            "value": 72969
        },{
            "name": "B2-47",
            "group": "B2",
            "value": 71969
        },{
            "name": "B2-48",
            "group": "B2",
            "value": 69969
        },{
            "name": "B2-49",
            "group": "B2",
            "value": 68969
        },{
            "name": "B2-50",
            "group": "B2",
            "value": 75969
        },{
            "name": "B2-51",
            "group": "B2",
            "value": 73969
        },{
            "name": "C1",
            "group": "C",
            "value": 315768
        },{
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
        },{
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
            "value": 77768
        },{
            "name": "C2-1",
            "group": "C2",
            "value": 78768
        },{
            "name": "C2-2",
            "group": "C2",
            "value": 66768
        },{
            "name": "C2-3",
            "group": "C2",
            "value": 65768
        },{
            "name": "C2-4",
            "group": "C2",
            "value": 64768
        },{
            "name": "C2-5",
            "group": "C2",
            "value": 63768
        },{
            "name": "C2-6",
            "group": "C2",
            "value": 62768
        },{
            "name": "C2-7",
            "group": "C2",
            "value": 61768
        },{
            "name": "C2-8",
            "group": "C2",
            "value": 60768
        },{
            "name": "C2-9",
            "group": "C2",
            "value": 59768
        },{
            "name": "C2-10",
            "group": "C2",
            "value": 58768
        },{
            "name": "C2-11",
            "group": "C2",
            "value": 57768
        },{
            "name": "C2-12",
            "group": "C2",
            "value": 56768
        },{
            "name": "C2-13",
            "group": "C2",
            "value": 55768
        },{
            "name": "C2-14",
            "group": "C2",
            "value": 54768
        },{
            "name": "C2-15",
            "group": "C2",
            "value": 53768
        },{
            "name": "C2-16",
            "group": "C2",
            "value": 52768
        },{
            "name": "C2-17",
            "group": "C2",
            "value": 51768
        },{
            "name": "C2-18",
            "group": "C2",
            "value": 50768
        },{
            "name": "C2-19",
            "group": "C2",
            "value": 49768
        },{
            "name": "C2-20",
            "group": "C2",
            "value": 48768
        },{
            "name": "C2-21",
            "group": "C2",
            "value": 47768
        },{
            "id": 'C3',
            "name": "C3-1",
            "group": "C2",
            "value": 46768
        },{
            "name": "C3-2",
            "group": "C3",
            "value": 45768
        },{
            "name": "C3-3",
            "group": "C3",
            "value": 44768
        },{
            "name": "C3-4",
            "group": "C3",
            "value": 43768
        },{
            "name": "C3-5",
            "group": "C3",
            "value": 41768
        },{
            "name": "C3-6",
            "group": "C3",
            "value": 40768
        },{
            "name": "C3-7",
            "group": "C3",
            "value": 39768
        },{
            "name": "C3-8",
            "group": "C3",
            "value": 38768
        },{
            "name": "C3-9",
            "group": "C3",
            "value": 37768
        },
    ],
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
