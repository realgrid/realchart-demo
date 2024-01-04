/**
 * @demo
 *
 * Bar Series 기본 예제.
 */
const config = {
    assets: [{
        id: 'cols1',
        type: 'colors',
        colors: ['#888', '#aaa', '#bbb', '#ccc', '#ddd']
    }, {
        id: 'cols2',
        colors: ['#88f', '#aaf', '#bbf', '#ccf', '#ddf']
    }, {
        id: 'cols3',
        colors: ['#f88', '#faa', '#fbb', '#fcc', '#fdd']
    }],
    options: {
        // animatable: false
    },
    title: '연도별 서울시 평균 대기질 지수',
    subtitle: {
        text: 'Asset - Colors',
        style: { fill: 'red', fontWeight: 'bold' }
    },
    xAxis: {
        title: '서울시',
        categories: ['2014', '2015', '2016', '2017', '2018', '2019', '2020'],
        grid: {
            visible: true,
        },
    },
    yAxis: {
        title:
            '대기질 지수<br><t style="fill:gray;font-size:0.9em;">(Air Quality Index, AQI)</t>',
    },
    series: {
        name: '대기질',
        pointLabel: true,
        pointColors: 'cols1',
        data: [155, 138, 122, 133, 114, 113, 123],
    },
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
    createListBox(container, "series.pointColors", ['', 'cols1', 'cols2', 'cols3', 'xxx'], function (e) {
        config.series.pointColors = _getValue(e);
        chart.load(config);
    }, 'cols1');
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions');
}
