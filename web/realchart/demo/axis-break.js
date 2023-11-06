/**
 * @demo
 * 
 * y축 중간을 생략한다.
 */
const config = {
    options: {
        // animatable: false
    },
    title: "Axis Breaks",
    xAxis: {
        title: "일일 Daily fat",
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        grid: true,
    },
    yAxis: {
        title: "Vertical 수직축 Axis",
        break: {
            from: 500,
            to: 3000
        }
    },
    series: [{
        name: 'column1',
        pointLabel: true,
        // pointWidth: '100%',
        data: [499, 128, 180, 345, 3050, 3590, 3840, 3630, 3120, 520, 240, 80]
    }, {
        name: 'column3',
        pointLabel: true,
        data: [64, 138, 164, 1408, 3120, 3540, 3875, 3420, 720, 320, 160, 20]
    }]
}

let animate = false;
let chart;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.render();
    }, false);
    // createCheckBox(container, 'Always Animate', function (e) {
    //     animate = _getChecked(e);
    // }, false);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
    createCheckBox(container, 'Inverted', function (e) {
        config.inverted = _getChecked(e);
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
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
