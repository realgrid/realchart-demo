const config = {
    options: {
        // animatable: false
        credits: {
            text: '자료: 여성가족부',
            url: 'https://www.mogef.go.kr/'
        },
    },
    title: {
        text: '스트레스•우울감 현황',
        align: 'start',
        style: {
            fontSize: '36px',
            fontWeight: 'bold'
        },
        sectionGap: 20
    },
    inverted: true,
    legend: false,
    annotations: {
        text: '2022년 기준',
        align: 'center',
        offsetX: -2,
        offsetY: 65,
        style: {
            fontSize: '22px',
        }
    },
    split: {
        visible: true,
        rows: 2,
    },
    xAxis: [{
        reversed: true,
        position: 'between',
        categories: [
            '중•고등학생 전체', '중학생', '고등학생', '남학생', '여학생'
        ],
    }],
    yAxis: [{
        title: {
            text: '스트레스 인지율',
            align: 'start',
            style: {
                fontSize: '22px',
                fill: 'blue'
            }
        },
        position: 'opposite',
        reversed: true,
        grid: false,
        label: false
    }, {
        row: 1,
        title: {
            text: '최근 1년내 우울감 경험률',
            align: 'start',
            style: {
                fontSize: '22px',
                fill: 'red'
            }
        },
        position: 'opposite',
        grid: false,
        label: false
    }],
    series: [{
        pointLabel: {
            visible: true,
            numberFormat: '##0.0',
            textCallback: ({index, y}) => {
                return index === 0 ? y + '%' : y + '';
            },
        },
        data: [41.3, 39.8, 34, 36, 47]
    }, {
        color: '#ffaa00',
        yAxis: 1,
        xAxis: 1,
        pointLabel: {
            visible: true,
            numberFormat: '##0.0',
            textCallback: ({index, y}) => {
                return index === 0 ? y + '%' : y + '';
            },
        },
        data: [28.7, 28.2, 29.3, 24.2, 33.5]
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
    createCheckBox(container, 'Inverted', function (e) {
        config.inverted = _getChecked(e);
        chart.load(config, animate);
    }, true);
    createCheckBox(container, 'X Reversed', function (e) {
        config.xAxis[0].reversed = _getChecked(e);
        chart.load(config, animate);
    }, false);
    createCheckBox(container, 'Y Reversed', function (e) {
        config.yAxis[0].reversed = _getChecked(e);
        chart.load(config, animate);
    }, true);
    createCheckBox(container, 'Y Reversed2', function (e) {
        config.yAxis[1].reversed = _getChecked(e);
        chart.load(config, animate);
    }, false);
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
