/**
 * @demo
 *
 * Bar Series 기본 예제.
 */
const config = {
    title: '연도별 서울시 평균 대기질 지수',
    options: {
        // animatable: false
    },
    xAxis: {
        title: '서울시',
        categories: ['`14', '`15', '`16', '`17', '`18', '`19'],
        grid: {
            visible: true,
        },
    },
    yAxis: {
        title: '대기질 지수<br><t style="fill:gray;font-size:0.9em;">(Air Quality Index, AQI)</t>',
        // reversed: true,
        // baseValue: -1,
        // strictMin: 11,
        // strictMax: 161
    },
    series: [
        {
            name: '대기질',
            // baseValue: null,
            pointLabel: true,
            // pointWidth: '100%',
            // colorByPoint: true,
            data: [155, 138, 122, 133, 114, 113],
        },
    ],
};

let animate = false;
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
    createCheckBox(
        container,
        'Always Animate',
        function (e) {
            animate = _getChecked(e);
        },
        false
    );
    createButton(container, 'Test', function (e) {
        alert('hello');
    });
    createButton(container, 'Update', function (e) {
        chart.series.updateData([175, 188, 152, 173, 134, 123, 153]);
    });
    createCheckBox(
        container,
        'ColorByPoint',
        function (e) {
            config.series.colorByPoint = _getChecked(e);
            chart.load(config, animate);
        },
        false
    );
    createCheckBox(
        container,
        'Inverted',
        function (e) {
            config.inverted = _getChecked(e);
            chart.load(config, animate);
        },
        false
    );
    createCheckBox(
        container,
        'X Reversed',
        function (e) {
            config.xAxis.reversed = _getChecked(e);
            chart.load(config, animate);
        },
        false
    );
    createCheckBox(
        container,
        'Y Reversed',
        function (e) {
            config.yAxis.reversed = _getChecked(e);
            chart.load(config, animate);
        },
        false
    );
    createListBox(
        container,
        'topRadius',
        [0, 3, 6, 10, 100],
        function (e) {
            config.series[0].topRadius = +_getValue(e);
            chart.load(config, animate);
        },
        '0'
    );
    createListBox(
        container,
        'bottomRadius',
        [0, 3, 6, 10, 100],
        function (e) {
            config.series[0].bottomRadius = +_getValue(e);
            chart.load(config, animate);
        },
        '0'
    );
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions');
}
