/**
 * @demo
 * 
 */
const config = {
    title: "Legends",
    xAxis: {
        title: "일일 Daily fat",
        categories: ['쓰리엠', '아디다스', '디즈니', '이마트', '메리어트', '시세이도'],
        grid: true,
    },
    yAxis: {
        title: "Vertical 수직축 Axis",
    },
    series: [{
        name: 'column1',
        pointLabel: true,
        data: [11, 22, 15, 9, 13, 27]
    }, {
        name: 'column2',    
        pointLabel: true,
        data: [15, 19, 19, 6, 21, 21]
    }, {
        name: 'line1',
        type: 'line',
        pointLabel: true,
        data: [13, 17, 15, 11, 23, 17]
    }, {
        name: 'line2',
        type: 'line',
        pointLabel: true,
        data: [15, 19, 13, 15, 20, 15]
    }],
    legend: {}
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
    createCheckBox(container, 'visible', function (e) {
        //chart.model.legend.visible = _getChecked(e);
        config.legend.visible = _getChecked(e);
        chart.load(config);
    }, true)
    createListBox(container, "location", ['bottom', 'top', 'right', 'left', 'body'], function (e) {
        config.legend.location = _getValue(e);
        chart.load(config);
    }, 'bottom');
    createListBox(container, "alignBase", ['plot', 'chart'], function (e) {
        config.legend.alignBase = _getValue(e);
        chart.load(config);
    }, 'plot');
    createListBox(container, "align", ['', 'left', 'center', 'right'], function (e) {
        config.legend.align = _getValue(e);
        chart.load(config);
    }, '');
    createListBox(container, "verticalAlign", ['', 'top', 'middle', 'bottom'], function (e) {
        config.legend.verticalAlign = _getValue(e);
        chart.load(config);
    }, '');
    createListBox(container, "offsetX", [0, 10, 15, 20, 25], function (e) {
        config.legend.offsetX = _getValue(e);
        chart.load(config);
    }, '0');
    createListBox(container, "offsetY", [0, 10, 15, 20, 25], function (e) {
        config.legend.offsetY = _getValue(e);
        chart.load(config);
    }, '0');
    createCheckBox(container, 'markerVisible', function (e) {
        config.legend.markerVisible = _getChecked(e);
        chart.load(config);
    }, true);
    // createCheckBox(container, 'clickable', function (e) {
    //     chart.model.legend.clickable = _getChecked(e);
    // }, true);
    // createCheckBox(container, 'clickEvent', function (e) {
    //     chart.model.legend.onClick = !_getChecked(e) ? null : (chart, item) => {
    //         alert(item.label);
    //     }
    // }, false);
    // createCheckBox(container, 'clickEventTrue', function (e) {
    //     chart.model.legend.onClick = !_getChecked(e) ? null : (chart, item) => {
    //         console.log('legend click', item.label);
    //         return true;
    //     }
    // }, false);
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
