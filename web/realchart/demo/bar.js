/**
 * @demo
 * 
 * Bar Series 기본 예제.
 */
const config = {
    title: "Bar Series",
    options: {
        // animatable: false
    },
    xAxis: {
        title: "일일 Daily fat",
        categories: ['쓰리엠', '아디다스', 'Youtube', '디즈니', '이마트', '메리어트', '시세이도'],
        grid: true,
    },
    yAxis: {
        title: "Vertical 수직축 Axis",
        // reversed: true,
        // baseValue: -1
    },
    series: {
        name: 'bar1',
        // baseValue: null,
        pointLabel: true,
        // pointWidth: '100%',
        colorByPoint: true,
        // color: 'green',
        data: [11, 22, 10, 15, 9, 13, 27]
    }
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
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
