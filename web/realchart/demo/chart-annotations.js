/**
 * @demo
 * 
 * 축의 특정한 위치나 범위를 강조해서 표시하는 방법.
 */
const config = {
    options: {
    },
    title: "Chart Level Annotations",
    legend: true,
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
        pointLabel: {
            visible: true,
            position: 'head',
            // offset: 10,
            // text: '<b style="fill:red">${x}</b>',
            effect: 'outline',// 'background',
            style: {
            },
        },
        data: [
            ['home', 7], 
            ['sky', 11], 
            ['def', 9], 
            ['지리산', 14.3], 
            ['zzz', 13],
            ['낙동강', 12.5]
        ],
        style: {
            // fill: 'yellow'
        }
    },
    body: {
    },
    annotations: [{
        offsetX: 30,
        offsetY: 40,
        rotation: -20,
        text: 'Annotation Sample',
        style: {
            fill: 'white'
        },
        backgroundStyle: {
            fill: '#33f',
            padding: '3px 5px',
            rx: 5,
            fillOpacity: 0.7
        }
    }, {
        type: 'image',
        align: 'right',
        offsetX: 50,
        offsetY: 0,
        width: 150,
        imageUrl: '../assets/images/daum.png'
    }]
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
        RealChart.setDebugging(_getChecked(e));
        config.inverted = _getChecked(e);
        chart.load(config);
    }, false);
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
