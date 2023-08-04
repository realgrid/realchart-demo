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

export function init() {
    // console.log(RealChart.getVersion());
    // RealChart.setLogging(true);
    RealChart.setDebugging(true);

    const chart = RealChart.createChartControl(document, 'realchart');
    chart.model = RealChart.loadChart(config);
}
