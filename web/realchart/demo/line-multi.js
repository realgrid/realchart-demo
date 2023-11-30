/**
 * @demo
 * 
 */
const config = {
    options: {},
    title: "보건용 마스크의 월별 수출입 현황 (2021-2023)",
    xAxis: {
        label: {
            step: 6
        },
        title: '년도 및 월',
		categories: ['2021년 01월', '2021년 02월', '2021년 3월', '2021년 4월', '2021년 5월', '2021년 6월','2021년 7월','2021년 8월','2021년 9월','2021년 10월','2021년 11월','2021년 12월','2022년 1월','2022년 2월','2022년 3월','2022년 4월','2022년 5월','2022년 6월','2022년 7월','2022년 8월','2022년 9월','2022년 10월','2022년 11월','2022년 12월','2023년 1월','2023년 2월','2023년 3월','2023년 4월','2023년 5월','2023년 6월','2023년 7월','2023년 8월','2023년 9월','2023년 10월','2023년 11월','2023년 12월',],
    },
    yAxis: {
        title: '수출 및 수입량'
    },
    series: [{
        name: '수출',
        type: 'line',
        lineType: 'spline',
        marker: true,
        data: [6724,7719,7172,4265,4830,5150,8091,10906,7638,6460,6273,9633,14534,18051,16306,7127,11401,5810,5742,9069,5702,2429,2382,12596,3861,2481,998,508,624,703,1531,411,720,697]
    },{
        name: '수입',
        type: 'line',
        lineType: 'spline',
        marker: true,
        data: [8450,1070,360,70,1130,680,440,3320,640,1770,4670,360,780,2480,3650,1840,2020,1370,2600,610,1430,1110,2140,3750,3490,1300,2030,20,720,590,2350,1380,560,500]
    }]
}

let animate = false;
let chart;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.render();
    }, false);
    createCheckBox(container, 'Always Animate', function (e) {
        animate = _getChecked(e);
    }, false);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
    createListBox(container, "Line Type", ['default', 'spline', 'step'], function (e) {
        config.series.lineType = _getValue(e);
        chart.load(config, animate);
    }, 'default');
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
