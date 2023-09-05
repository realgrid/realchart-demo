const config = {
    options: {
        // animatable: false,
        credit: {
        }
    },
    title: "Basic Real-Chart",
    legend: true,
    xAxis: {
        // type: 'category',
        // position: 'apposite'
        // position: 'base',
        // baseAxis: 1,
        title: 'X Axis',
        grid: true
    },
    yAxis: {
        title: 'Y Axis',
        // maxPadding: 0
        // strictMin: 1
    },
    series: {
        // baseValue: null,
        pointLabel: {
            visible: true,
            //position: 'head',
            // offset: 10,
            // text: '<b style="fill:red">${x}</b>',
            effect: 'outline',// 'background',
            style: {
            },
            // backgroundStyle: {
            //     fill: '#004',
            //     padding: '5px'
            // }
        },
        data: [
            ['home', 7], 
            ['sky', 11], 
            ['def', 9], 
            ['소홍', 10], 
            ['지리산', 14.3], 
            ['zzz', 13],
            ['낙동강', 12.5]
        ],
        data2: [
            [1, 7], 
            [2, 11], 
            [3, 9], 
            [4, 10], 
            [5, 14.3], 
            [6, 13],
            [7, 12.5]
        ],
        style: {
            // fill: 'yellow'
        }
    }
}

let animate;
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
        chart.update(config, animate);
    }, false);
    createCheckBox(container, 'X Reversed', function (e) {
        config.xAxis.reversed = _getChecked(e);
        chart.update(config, animate);
    }, false);
    createCheckBox(container, 'Y Reversed', function (e) {
        config.yAxis.reversed = _getChecked(e);
        chart.update(config, animate);
    }, false);
}

function init() {
    console.log(RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
