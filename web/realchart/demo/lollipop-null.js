/**
 * @demo
 * 
 */
const config = {
    options: {},
    title: "Lollipop Null Point",
    xAxis: {
        type: 'category',
        grid: true
    },
    yAxis: {
        title: 'Y Axis',
    },
    series: {
        type: 'lollipop',
        pointLabel: {
            visible: true,
            // offset: 10,
            // text: '<b style="fill:red">${x}</b>',
            // effect: 'outline',// 'background',
            style: {
                fill: 'black'
            },
            // backgroundStyle: {
            //     fill: '#004',
            //     padding: '5px'
            // }
        },
        data: [
            ['home', 7], 
            ['sky', null], 
            ['def', 9], 
            ['소홍', 10], 
            ['지리산', 14.3], 
            ['zzz', 13],
            ['낙동강', 12.5]
        ],
        style: {
            // fill: 'yellow'
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
    createCheckBox(container, 'Inverted', function (e) {
        config.inverted = _getChecked(e);
        chart.load(config);
    }, false);
    createCheckBox(container, 'X Reversed', function (e) {
        config.xAxis.reversed = _getChecked(e);
        chart.load(config);
    }, false);
    createCheckBox(container, 'Y Reversed', function (e) {
        config.yAxis.reversed = _getChecked(e);
        chart.load(config);
    }, false);
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
