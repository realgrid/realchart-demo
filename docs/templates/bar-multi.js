/**
 * @demo
 * 
 */
export const config = {
    title: "Bar Multi",
    options: {},
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
        // pointWidth: '100%',
        data: [11, 22, 15, 9, 13, 27]
    }, {
        name: 'column2',    
        groupWidth: 2,
        pointLabel: true,
        data: [15, 19, 19, 6, 21, 21]
    }, {
        name: 'column3',
        pointLabel: true,
        data: [13, 17, 15, 11, 23, 17]
    }]
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
