/**
 * @demo
 *
 */
const config = {
    title: '울산광역시 농산물 수출 현황 (2014-2021)',
    options: {
        // animatable: false
    },
    xAxis: {
        title: '년도',
        categories: ['2017년', '2018년', '2019년', '2020년', '2021년'],
        grid: true,

        label: {
            // startStep: 0,
            step: 1
        }
    },
    yAxis: {
        title: '수출량(단위 만)'
    },
    series: [
        {
            type: 'equalizer',
            pointLabel: {
                visible: true,
                position: 'inside',
                effect: 'outline'
            },
            name: '배',
            data: [485, 550, 554, 233, 181]
        },
        {
            type: 'equalizer',
            pointLabel: {
                visible: true,
                position: 'inside',
                effect: 'outline'
            },
            name: '배즙',
            // baseValue: null,
            // pointWidth: '100%',
            // colorByPoint: true,
            data: [230, 250, 250, 330, 260]
        }
    ]
};
let chart;

function setActions(container) {
    createCheckBox(
        container,
        'Debug',
        function (e) {
            RealChart.setDebugging(_getChecked(e));
            chart.render();
        },
        false
    );
    createButton(container, 'Test', function (e) {
        alert('hello');
    });
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions');
}
