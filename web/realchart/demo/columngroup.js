const config = {
    title: "Column Group",
    options: {
        // inverted: true,
    },
    xAxis: {
        title: "일일 Daily fat",
        categories: ['쓰리엠', '아디다스', '디즈니', '이마트', '메리어트', '시세이도']
    },
    yAxis: {
        title: "Vertical 수직축 Axis",
        // reversed: true
    },
    series: [{
        layout: 'stack',
        series: [{
            name: 'column1',
            pointLabel: true,
            // pointWidth: '100%',
            data: [11, 22, 15, 9, 13, 27]
        }, {
            name: 'column2',    
            pointWidth: 2,
            pointLabel: true,
            data: [15, 19, 19, 6, 21, 21]
        }, {
            name: 'column3',
            pointLabel: true,
            data: [13, 17, 15, 11, 23, 17]
        }]
    }]
}

let animate = false;
let chart;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.refresh();
    }, true);
    createCheckBox(container, 'Always Animate', function (e) {
        animate = _getChecked(e);
    }, false);
    createButton(container, 'Test', function(e) {
        alert('hello2');
    });
    createListBox(container, "layout", ['default', 'stack', 'fill', 'overlap'], function (e) {
        config.series[0].layout = _getValue(e);
        chart.update(config, animate);
    }, 'default');
    createCheckBox(container, 'Inverted', function (e) {
        config.options.inverted = _getChecked(e);
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

export function init() {
    // console.log(RealChart.getVersion());
    // RealChart.setLogging(true);
    RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
