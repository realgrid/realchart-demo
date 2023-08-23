const config = {
    options: {
    },
    title: "Bar Group",
    xAxis: {
        title: "일일 Daily fat",
        categories: ['쓰리엠', '아디다스', '디즈니', '이마트', '메리어트', '시세이도'],
        grid: true
    },
    yAxis: {
        title: "Vertical 수직축 Axis",
    },
    series: [{
        groupPadding: 0.1,
        // layout: 'overlap',
        // layout: 'stack',
        series: [{
            name: 'column1',
            // pointWidth: '100%',
            data: [11, 22, 15, 9, 13, 27]
        }, {
            name: 'column2',    
            data: [15, 19, 19, 6, 21, 21]
        }, {
            name: 'column3',
            data: [13, 17, 15, 11, 23, 17]
        }]
    }, {
        groupPadding: 0.1,
        // layout: 'overlap',
        layout: 'stack',
        series: [{
            group: 1,
            name: 'column4',
            data: [13, 17, 15, 11, 23, 17]
        }, {
            group: 1,
            name: 'column5',
            data: [15, 19, 19, 6, 21, 21]
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
        alert('hello');
    });
    createListBox(container, "layout1", ['default', 'stack', 'fill', 'overlap'], function (e) {
        config.series[0].layout = _getValue(e);
        chart.update(config, animate);
    }, 'default');
    createListBox(container, "layout2", ['default', 'stack', 'fill', 'overlap'], function (e) {
        config.series[1].layout = _getValue(e);
        chart.update(config, animate);
    }, 'stack');
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
    // console.log(RealChart.getVersion());
    // RealChart.setLogging(true);
    RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
