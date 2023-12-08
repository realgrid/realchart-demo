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
            "color": "#DAA520",
            data:[{
                "name": "A",
                "value": 100,
            },
            {
                "name": "A",
                "value": 87,
            },
            {
                "name": "A",
                "value": 76,
            },
            {
                "name": "A",
                "value": 72,
            },
            {
                "name": "A",
                "value": 67,
            },
            {
                "name": "A",
                "value": 63,
            },
            {
                "name": "A",
                "value": 59,
            },
            {
                "name": "A",
                "value": 55,
            },
            {
                "name": "A",
                "value": 53,
            },
            {
                "name": "A",
                "value": 49,
            },
            {
                "name": "A",
                "value": 48,
            },
            {
                "name": "A",
                "value": 44,
            },
            {
                "name": "A",
                "value": 43,
            },
            {
                "name": "A",
                "value": 30,
            },
            {
                "name": "A",
                "value": 27,
            },
            {
                "name": "A",
                "value": 24,
            },
            {
                "name": "A",
                "value": 22,
            },
            {
                "name": "A",
                "value": 20,
            },
            {
                "name": "A",
                "value": 18,
            },
            {
                "name": "A",
                "value": 15,
            },
            {
                "name": "A",
                "value": 7,
            },
            {
                "name": "A",
                "value": 65,
            },
            {
                "name": "A",
                "value": 85,
            },
            {
                "name": "A",
                "value": 95,
            },
            {
                "name": "A",
                "value": 35,
            },
            {
                "name": "A",
                "value": 43,
            },
            {
                "name": "A",
                "value": 62,
            },
            {
                "name": "A",
                "value": 98,
            },
            {
                "name": "A",
                "value": 76,
            },
            {
                "name": "A",
                "value": 87,
            },
            {
                "name": "A",
                "value": 24,
            },
            {
                "name": "A",
                "value": 5,
            },
            {
                "name": "A",
                "value": 3,
            },
            {
                "name": "A",
                "value": 1,
            }]
        },{
            "name": "B",
            "color": "#FFFF66",
            data: [{
                "name": "B-1",
                data:[{
                    name: "B-1-1",
                    value: 89,
                },{
                    name: "B-1-2",
                    value: 77,
                },{
                    name: "B-1-3",
                    value: 94,
                },{
                    name: "B-1-4",
                    value: 83,
                },{
                    name: "B-1-5",
                    value: 65,
                },{
                    name: "B-1-6",
                    value: 61,
                },{
                    name: "B-1-7",
                    value: 53,
                },{
                    name: "B-1-8",
                    value: 42,
                },{
                    name: "B-1-9",
                    value: 34,
                },],
                
            },{
                "name": "B-2",
                data:[{
                    "name": "B-2-1",
                    "value": 98
                },{
                    "name": "B-2-1",
                    "value": 94
                },{
                    "name": "B-2-1",
                    "value": 90
                },{
                    "name": "B-2-1",
                    "value": 88
                },{
                    "name": "B-2-1",
                    "value": 84
                },{
                    "name": "B-2-1",
                    "value": 85
                },{
                    "name": "B-2-1",
                    "value": 79
                },{
                    "name": "B-2-1",
                    "value": 75
                },{
                    "name": "B-2-1",
                    "value": 73
                },{
                    "name": "B-2-1",
                    "value": 70
                },{
                    "name": "B-2-1",
                    "value": 66
                },{
                    "name": "B-2-1",
                    "value": 64
                },{
                    "name": "B-2-1",
                    "value": 62
                },{
                    "name": "B-2-1",
                    "value": 60
                },{
                    "name": "B-2-1",
                    "value": 57
                },{
                    "name": "B-2-1",
                    "value": 55
                },{
                    "name": "B-2-1",
                    "value": 53
                },{
                    "name": "B-2-1",
                    "value": 51
                },{
                    "name": "B-2-1",
                    "value": 47
                },{
                    "name": "B-2-1",
                    "value": 44
                },{
                    "name": "B-2-1",
                    "value": 40
                },{
                    "name": "B-2-1",
                    "value": 38
                },,{
                    "name": "B-2-1",
                    "value": 35
                },{
                    "name": "B-2-1",
                    "value": 33
                },{
                    "name": "B-2-1",
                    "value": 31
                },{
                    "name": "B-2-1",
                    "value": 27
                },{
                    "name": "B-2-1",
                    "value": 24
                },{
                    "name": "B-2-1",
                    "value": 20
                },{
                    "name": "B-2-1",
                    "value": 19
                },{
                    "name": "B-2-1",
                    "value": 16
                },{
                    "name": "B-2-1",
                    "value": 11
                },{
                    "name": "B-2-1",
                    "value": 7
                },{
                    "name": "B-2-1",
                    "value": 5
                },{
                    "name": "B-2-1",
                    "value": 2
                }],
                
            }],          
        },{
            "name": "C",
            "color": "#90EE99",
            data:[{
                "name": "C-1",
                data:[{
                    "name": "C-1-1",
                    data: [{
                        "name": "C-1-1-1",
                        "value": 100
                    },{
                        "name": "C-1-1-1",
                        "value": 100
                    },{
                        "name": "C-1-1-1",
                        "value": 100
                    },{
                        "name": "C-1-1-1",
                        "value": 100
                    },{
                        "name": "C-1-1-1",
                        "value": 100
                    },{
                        "name": "C-1-1-1",
                        "value": 100
                    },{
                        "name": "C-1-1-1",
                        "value": 100
                    },{
                        "name": "C-1-1-1",
                        "value": 100
                    },{
                        "name": "C-1-1-1",
                        "value": 100
                    },{
                        "name": "C-1-1-1",
                        "value": 100
                    },{
                        "name": "C-1-1-1",
                        "value": 100
                    },{
                        "name": "C-1-1-1",
                        "value": 100
                    },{
                        "name": "C-1-1-1",
                        "value": 100
                    },{
                        "name": "C-1-1-1",
                        "value": 100
                    },{
                        "name": "C-1-1-1",
                        "value": 100
                    },{
                        "name": "C-1-1-1",
                        "value": 100
                    },{
                        "name": "C-1-1-1",
                        "value": 100
                    },{
                        "name": "C-1-1-1",
                        "value": 100
                    },{
                        "name": "C-1-1-1",
                        "value": 100
                    },{
                        "name": "C-1-1-1",
                        "value": 100
                    },{
                        "name": "C-1-1-1",
                        "value": 100
                    },{
                        "name": "C-1-1-1",
                        "value": 100
                    },{
                        "name": "C-1-1-1",
                        "value": 100
                    },{
                        "name": "C-1-1-1",
                        "value": 100
                    },{
                        "name": "C-1-1-1",
                        "value": 100
                    },{
                        "name": "C-1-1-1",
                        "value": 100
                    },{
                        "name": "C-1-1-1",
                        "value": 100
                    },{
                        "name": "C-1-1-1",
                        "value": 100
                    },{
                        "name": "C-1-1-1",
                        "value": 100
                    },{
                        "name": "C-1-1-1",
                        "value": 100
                    },{
                        "name": "C-1-1-1",
                        "value": 100
                    },,{
                        "name": "C-1-1-1",
                        "value": 100
                    },{
                        "name": "C-1-1-1",
                        "value": 100
                    },{
                        "name": "C-1-1-1",
                        "value": 100
                    },{
                        "name": "C-1-1-1",
                        "value": 100
                    },{
                        "name": "C-1-1-1",
                        "value": 100
                    },{
                        "name": "C-1-1-1",
                        "value": 100
                    },{
                        "name": "C-1-1-1",
                        "value": 100
                    },{
                        "name": "C-1-1-1",
                        "value": 100
                    }]
                },{
                    "name": "C-1-2"
                }]
            },{
                "name": "C-2",
                data:[{
                    "name": "C-2-1",
                    data:[{
                        "name": "C-2-1-1",
                        data:[{
                            "name": "C-2-1-1-1",
                            "value": 100
                        },{
                            "name": "C-2-1-1-1",
                            "value": 100
                        },{
                            "name": "C-2-1-1-1",
                            "value": 100
                        },{
                            "name": "C-2-1-1-1",
                            "value": 100
                        },{
                            "name": "C-2-1-1-1",
                            "value": 100
                        },{
                            "name": "C-2-1-1-1",
                            "value": 100
                        },{
                            "name": "C-2-1-1-1",
                            "value": 100
                        },{
                            "name": "C-2-1-1-1",
                            "value": 100
                        },{
                            "name": "C-2-1-1-1",
                            "value": 100
                        },{
                            "name": "C-2-1-1-1",
                            "value": 100
                        },{
                            "name": "C-2-1-1-1",
                            "value": 100
                        },{
                            "name": "C-2-1-1-1",
                            "value": 100
                        },{
                            "name": "C-2-1-1-1",
                            "value": 100
                        },{
                            "name": "C-2-1-1-1",
                            "value": 100
                        },{
                            "name": "C-2-1-1-1",
                            "value": 100
                        },{
                            "name": "C-2-1-1-1",
                            "value": 100
                        },{
                            "name": "C-2-1-1-1",
                            "value": 100
                        },{
                            "name": "C-2-1-1-1",
                            "value": 100
                        },{
                            "name": "C-2-1-1-1",
                            "value": 100
                        },{
                            "name": "C-2-1-1-1",
                            "value": 100
                        },{
                            "name": "C-2-1-1-1",
                            "value": 100
                        },{
                            "name": "C-2-1-1-1",
                            "value": 100
                        },{
                            "name": "C-2-1-1-1",
                            "value": 100
                        }]
                    },{
                        "name": "C-2-1-2",
                        data:[{
                            "name": "C-2-1-2-1",
                            "value": 100
                        },{
                            "name": "C-2-1-2-1",
                            "value": 100
                        },{
                            "name": "C-2-1-2-1",
                            "value": 100
                        },{
                            "name": "C-2-1-2-1",
                            "value": 100
                        },{
                            "name": "C-2-1-2-1",
                            "value": 100
                        },{
                            "name": "C-2-1-2-1",
                            "value": 100
                        },{
                            "name": "C-2-1-2-1",
                            "value": 100
                        },{
                            "name": "C-2-1-2-1",
                            "value": 100
                        },{
                            "name": "C-2-1-2-1",
                            "value": 100
                        },{
                            "name": "C-2-1-2-1",
                            "value": 100
                        },{
                            "name": "C-2-1-2-1",
                            "value": 100
                        },{
                            "name": "C-2-1-2-1",
                            "value": 100
                        },{
                            "name": "C-2-1-2-1",
                            "value": 100
                        },{
                            "name": "C-2-1-2-1",
                            "value": 100
                        },{
                            "name": "C-2-1-2-1",
                            "value": 100
                        },{
                            "name": "C-2-1-2-1",
                            "value": 100
                        },{
                            "name": "C-2-1-2-1",
                            "value": 100
                        },{
                            "name": "C-2-1-2-1",
                            "value": 100
                        }]
                    },{
                        "name": "C-2-1-3",
                        data:[{
                            "name": "C-2-1-3-1",
                            "value": 100,
                        },{
                            "name": "C-2-1-3-1",
                            "value": 100,
                        },{
                            "name": "C-2-1-3-1",
                            "value": 100,
                        },{
                            "name": "C-2-1-3-1",
                            "value": 100,
                        },{
                            "name": "C-2-1-3-1",
                            "value": 100,
                        },{
                            "name": "C-2-1-3-1",
                            "value": 100,
                        },{
                            "name": "C-2-1-3-1",
                            "value": 100,
                        },{
                            "name": "C-2-1-3-1",
                            "value": 100,
                        },{
                            "name": "C-2-1-3-1",
                            "value": 100,
                        }]
                    }]
                },{
                    "name": "C-2-2",
                    data:[{
                        "name": "C-2-2-1",
                        data:[{
                            "name": "C-2-2-1-1",
                            "value": 100,
                        },{
                            "name": "C-2-2-1-1",
                            "value": 100,
                        },{
                            "name": "C-2-2-1-1",
                            "value": 100,
                        },{
                            "name": "C-2-2-1-1",
                            "value": 100,
                        },{
                            "name": "C-2-2-1-1",
                            "value": 100,
                        },{
                            "name": "C-2-2-1-1",
                            "value": 100,
                        },{
                            "name": "C-2-2-1-1",
                            "value": 100,
                        }]
                    },{
                        "name": "C-2-2-2",
                        data:[{
                            "name": "C-2-2-2-1",
                            "value": 100
                        },{
                            "name": "C-2-2-2-1",
                            "value": 100
                        },{
                            "name": "C-2-2-2-1",
                            "value": 100
                        },{
                            "name": "C-2-2-2-1",
                            "value": 100
                        },{
                            "name": "C-2-2-2-1",
                            "value": 100
                        },{
                            "name": "C-2-2-2-1",
                            "value": 100
                        },{
                            "name": "C-2-2-2-1",
                            "value": 100
                        },{
                            "name": "C-2-2-2-1",
                            "value": 100
                        },{
                            "name": "C-2-2-2-1",
                            "value": 100
                        },{
                            "name": "C-2-2-2-1",
                            "value": 100
                        },{
                            "name": "C-2-2-2-1",
                            "value": 100
                        },{
                            "name": "C-2-2-2-1",
                            "value": 100
                        },{
                            "name": "C-2-2-2-1",
                            "value": 100
                        }]
                    },{
                        "name": "C-2-2-3",
                        data:[{
                            "name": "C-2-2-3-1",
                            "value": 100
                        },{
                            "name": "C-2-2-3-1",
                            "value": 100
                        },{
                            "name": "C-2-2-3-1",
                            "value": 100
                        },{
                            "name": "C-2-2-3-1",
                            "value": 100
                        },{
                            "name": "C-2-2-3-1",
                            "value": 100
                        },{
                            "name": "C-2-2-3-1",
                            "value": 100
                        },{
                            "name": "C-2-2-3-1",
                            "value": 100
                        },{
                            "name": "C-2-2-3-1",
                            "value": 100
                        },{
                            "name": "C-2-2-3-1",
                            "value": 100
                        },{
                            "name": "C-2-2-3-1",
                            "value": 100
                        },{
                            "name": "C-2-2-3-1",
                            "value": 100
                        },{
                            "name": "C-2-2-3-1",
                            "value": 100
                        },{
                            "name": "C-2-2-3-1",
                            "value": 100
                        },{
                            "name": "C-2-2-3-1",
                            "value": 100
                        },{
                            "name": "C-2-2-3-1",
                            "value": 100
                        },{
                            "name": "C-2-2-3-1",
                            "value": 100
                        },{
                            "name": "C-2-2-3-1",
                            "value": 100
                        },{
                            "name": "C-2-2-3-1",
                            "value": 100
                        },{
                            "name": "C-2-2-3-1",
                            "value": 100
                        }]
                    }]
                },{
                    "name": "C-2-3",
                    data:[{
                        "name": "C-2-3-1",
                        data:[{
                            "name": "C-2-3-1-1",
                            "value": 100
                        },{
                            "name": "C-2-3-1-1",
                            "value": 100
                        },{
                            "name": "C-2-3-1-1",
                            "value": 100
                        },{
                            "name": "C-2-3-1-1",
                            "value": 100
                        },{
                            "name": "C-2-3-1-1",
                            "value": 100
                        },{
                            "name": "C-2-3-1-1",
                            "value": 100
                        },{
                            "name": "C-2-3-1-1",
                            "value": 100
                        },{
                            "name": "C-2-3-1-1",
                            "value": 100
                        },{
                            "name": "C-2-3-1-1",
                            "value": 100
                        },{
                            "name": "C-2-3-1-1",
                            "value": 100
                        },{
                            "name": "C-2-3-1-1",
                            "value": 100
                        },{
                            "name": "C-2-3-1-1",
                            "value": 100
                        },{
                            "name": "C-2-3-1-1",
                            "value": 100
                        }]
                    },{
                        "name": "C-2-3-2",
                        data:[{
                            "name": "C-2-3-2-1",
                            "value": 100
                        },{
                            "name": "C-2-3-2-1",
                            "value": 100
                        },{
                            "name": "C-2-3-2-1",
                            "value": 100
                        },{
                            "name": "C-2-3-2-1",
                            "value": 100
                        },{
                            "name": "C-2-3-2-1",
                            "value": 100
                        },{
                            "name": "C-2-3-2-1",
                            "value": 100
                        },{
                            "name": "C-2-3-2-1",
                            "value": 100
                        },{
                            "name": "C-2-3-2-1",
                            "value": 100
                        },{
                            "name": "C-2-3-2-1",
                            "value": 100
                        },{
                            "name": "C-2-3-2-1",
                            "value": 100
                        },{
                            "name": "C-2-3-2-1",
                            "value": 100
                        },{
                            "name": "C-2-3-2-1",
                            "value": 100
                        },{
                            "name": "C-2-3-2-1",
                            "value": 100
                        },{
                            "name": "C-2-3-2-1",
                            "value": 100
                        },{
                            "name": "C-2-3-2-1",
                            "value": 100
                        },{
                            "name": "C-2-3-2-1",
                            "value": 100
                        },{
                            "name": "C-2-3-2-1",
                            "value": 100
                        },{
                            "name": "C-2-3-2-1",
                            "value": 100
                        },{
                            "name": "C-2-3-2-1",
                            "value": 100
                        }]
                    },{
                        "name": "C-2-3-3",
                        data:[{
                            "name": "C-2-3-3-1",
                            "value": 100
                        },{
                            "name": "C-2-3-3-1",
                            "value": 100
                        },{
                            "name": "C-2-3-3-1",
                            "value": 100
                        },{
                            "name": "C-2-3-3-1",
                            "value": 100
                        },{
                            "name": "C-2-3-3-1",
                            "value": 100
                        },{
                            "name": "C-2-3-3-1",
                            "value": 100
                        },{
                            "name": "C-2-3-3-1",
                            "value": 100
                        },{
                            "name": "C-2-3-3-1",
                            "value": 100
                        },{
                            "name": "C-2-3-3-1",
                            "value": 100
                        },{
                            "name": "C-2-3-3-1",
                            "value": 100
                        },{
                            "name": "C-2-3-3-1",
                            "value": 100
                        }]
                    }]
                }]
            }]
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
