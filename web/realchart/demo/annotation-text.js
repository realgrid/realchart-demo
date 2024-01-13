/**
 * @demo
 * 
 * 축의 특정한 위치나 범위를 강조해서 표시하는 방법.
 */
const config = {
    options: {
    },
    title: "Text Annotations",
    // annotations: [{
    //     offsetX: 0,
    //     offsetY: 0,
    //     verticalAlign: 'bottom',
    //     text: '출처: Text 어노테이션10, <t style="font-size:15px">우리테크 Inc.</t>',
    //     style: {
    //         fontSize: '17px',
    //         fill: 'black'
    //     },
    //     backgroundStyle: {
    //         padding: '3px 5px',
    //         fill: '#0088ff23',
    //         stroke: '#008',
    //         strokeWidth: '1px',
    //         rx: 5,
    //     }

    // }],
    xAxis: {
        // type: 'category',
        tick: true,
        // position: 'apposite'
        // position: 'base',
        // baseAxis: 1,
        title: 'X Axis',
        grid: true
    },
    yAxis: {
        tick: true,
        title: 'Y Axis'
    },
    series: {
        data: [
            ['종로구', 7], 
            ['강남구', 11], 
            ['도봉구', 9], 
            ['은평구', 14.3], 
            ['동작구', 13],
            ['강동구', 12.5]
        ],
        style: {
            // fill: 'yellow'
        }
    },
    body: {
        annotations: [{
            offsetX: 30,
            offsetY: 40,
            // rotation: -20,
            text: 'Text 어노테이션',
            style: {
                fill: 'white'
            },
            backgroundStyle: {
                padding: '3px 5px',
                fill: '#33f',
                rx: 5,
                fillOpacity: 0.7
            }
        }, {
            offsetX: 110,
            offsetY: 90,
            rotation: -20,
            text: 'Text 어노테이션2',
            style: {
                fill: 'white'
            },
            backgroundStyle: {
                padding: '3px 5px',
                fill: '#333',
                rx: 5,
                fillOpacity: 0.7
            }
        }, {
            offsetX: 100,
            offsetY: 160,
            front: true,
            rotation: 20,
            text: 'Text 어노테이션3',
            style: {
                fontSize: '30px',
                fill: 'white'
            },
            backgroundStyle: {
                padding: '3px 5px',
                fill: '#383',
                rx: 5,
                fillOpacity: 0.7
            }
        }, {
            align: 'right',
            offsetX: 10,
            offsetY: 10,
            text: 'Text<br>어노테이션4',
            style: {
                fontSize: '30px',
                fill: 'white'
            },
            backgroundStyle: {
                padding: '3px 5px',
                fill: '#833',
                rx: 5,
                fillOpacity: 0.7
            }
        }, {
            align: 'right',
            verticalAlign: 'bottom',
            front: true,
            offsetX: 10,
            offsetY: 10,
            text: 'Text<br><t style="fill:red;font-size:24px;font-weight:bold;">어노테이션5</t>',
            style: {
                fontSize: '30px',
            },
            backgroundStyle: {
                padding: '3px 5px',
                stroke: '#080',
                strokeWidth: '1px',
                strokeDasharray: '4'
            }
        }]
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
    createCheckBox(container, 'inverted', function (e) {
        config.inverted = _getChecked(e);
        chart.load(config);
    }, false);   
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
