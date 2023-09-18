/**
 * @demo
 * 
 */
const config = {
    title: "Category Axis",
    options: {
        // animatable: false
    },
    xAxis: {
        categories: ['쓰리엠', '아디다스', '디즈니', '이마트', '메리어트', '시세이도'],
        title: {
            text: "일일 Daily fat",
        },
        tick: {
        },
        label: {
        },
        grid: true,
        line: true,
    },
    yAxis: {
        title: "Vertical 수직축 Axis",
        // reversed: true,
        // baseValue: -1
    },
    series: [{
        name: 'column1',
        pointLabel: {
            visible: true,
            position: 'inside',
            effect: 'outline'
        },
        // pointWidth: '100%',
        data: [11, 22, 15, 9, 13, 27]
    }, {
        name: 'line1',
        type: 'line',
        pointLabel: true,
        color: 'black',
        data: [9, 17, 19, 11, 10, 21],
        style: {
            strokeDasharray: '5'
        }
    }]
}

let animate = false;
let chart;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.refresh();
    }, false);
    createCheckBox(container, 'Always Animate', function (e) {
        animate = _getChecked(e);
    }, false);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
    createCheckBox(container, 'Inverted', function (e) {
        config.inverted = _getChecked(e);
        chart.load(config, animate);
    }, false);
    createCheckBox(container, 'X.Opposite', function (e) {
        config.xAxis.position = _getChecked(e) ? 'opposite': 'normal';
        chart.load(config, animate);
    }, false);
    createCheckBox(container, 'X Reversed', function (e) {
        config.xAxis.reversed = _getChecked(e);
        chart.load(config, animate);
    }, false);
    createCheckBox(container, 'Y Reversed', function (e) {
        config.yAxis.reversed = _getChecked(e);
        chart.load(config, animate);
    }, false);
    createListBox(container, "Axis.padding", ['0', '-0.2', '-0.4', '-0.5', '0.5'], function (e) {
        config.xAxis.padding = _getValue(e);
        chart.load(config);
    }, '0');
    createListBox(container, "Axis.categoryPadding", ['0', '0.1', '0.15', '0.2'], function (e) {
        config.xAxis.categoryPadding = _getValue(e);
        chart.load(config);
    }, '0.1');
    createCheckBox(container, 'Axis.title', function (e) {
        config.xAxis.title.visible = _getChecked(e);
        chart.load(config, animate);
    }, true);
    createCheckBox(container, 'Axis.tick', function (e) {
        config.xAxis.tick.visible = _getChecked(e);
        chart.load(config, animate);
    }, true);
    createListBox(container, "Axis.tick.position", ['point', 'edge'], function (e) {
        config.xAxis.tick.position = _getValue(e);
        chart.load(config);
    }, 'point');
    createCheckBox(container, 'Axis.label', function (e) {
        config.xAxis.label.visible = _getChecked(e);
        chart.load(config, animate);
    }, true);
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
