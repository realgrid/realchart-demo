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
    }],
    legend: {}
}
let chart;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.refresh();
    }, true);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
    createCheckBox(container, 'visible', function (e) {
        //chart.model.legend.visible = _getChecked(e);
        config.legend.visible = _getChecked(e);
        chart.update(config);
    }, true)
    createListBox(container, "position", ['bottom', 'top', 'right', 'left', 'plot'], function (e) {
        config.legend.position = _getValue(e);
        chart.update(config);
    }, 'bottom');
    createListBox(container, "left", ['', 10, 15, 20, 25], function (e) {
        config.legend.left = _getValue(e);
        chart.update(config);
    }, '');
    createListBox(container, "right", ['', 10, 15, 20, 25], function (e) {
        config.legend.right = _getValue(e);
        chart.update(config);
    }, '');
    createListBox(container, "top", ['', 10, 15, 20, 25], function (e) {
        config.legend.top = _getValue(e);
        chart.update(config);
    }, '');
    createListBox(container, "bottom", ['', 10, 15, 20, 25], function (e) {
        config.legend.bottom = _getValue(e);
        chart.update(config);
    }, '');
    // createListBox(container, "layout", ['auto', 'horizontal', 'vertical'], function (e) {
    //     chart.model.legend.layout = _getValue(e);
    // }, 'auto');
    // createListBox(container, "alignBase", ['plot', 'chart'], function (e) {
    //     chart.model.legend.alignBase = _getValue(e);
    // }, 'plot');
    // createListBox(container, "align", ['left', 'center', 'right'], function (e) {
    //     chart.model.legend.align = _getValue(e);
    // }, 'center');
    // createListBox(container, "verticalAlign", ['top', 'middle', 'bottom'], function (e) {
    //     chart.model.legend.verticalAlign = _getValue(e);
    // }, 'middle');
    // createListBox(container, "offsetX", [0, 10, 20, 30], function (e) {
    //     chart.model.legend.offsetX = _getValue(e);
    // }, 0);
    // createListBox(container, "offsetY", [0, 10, 20, 30], function (e) {
    //     chart.model.legend.offsetY = _getValue(e);
    // }, 0);
    // createListBox(container, "background", ['none', 'yellow'], function (e) {
    //     chart.model.legend.styles = {
    //         fill: _getValue(e)
    //     }
    // }, 'none');
    // createCheckBox(container, 'clickable', function (e) {
    //     chart.model.legend.clickable = _getChecked(e);
    // }, true)
    // createCheckBox(container, 'clickEvent', function (e) {
    //     chart.model.legend.onClick = !_getChecked(e) ? null : (chart, item) => {
    //         alert(item.label);
    //     }
    // }, false)
    // createCheckBox(container, 'clickEventTrue', function (e) {
    //     chart.model.legend.onClick = !_getChecked(e) ? null : (chart, item) => {
    //         console.log('legend click', item.label);
    //         return true;
    //     }
    // }, false)
}

function init() {
    // console.log(RealChart.getVersion());
    // RealChart.setLogging(true);
    RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
