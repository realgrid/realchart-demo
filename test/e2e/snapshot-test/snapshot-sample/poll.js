
const areaData = data.filter(row => row['구분'] == '7개 권역');

const pointLabel = {
    visible: true,
    numberFormat: '#.00',
    suffix: '%',
    position: 'inside',
    style: {
        // fill: '#fff'
    }
};

const config = {
    // inverted: true,
    options: {
        // animatable: false
    },
    title: {
        text: '2023년 11월',
        gap: 10,
        backgroundStyle: {
            fill: 'black',
            rx: '3px'
        },
        style: {
            fill: '#fff',
            fontSize: '16px',
            padding: '2px 5px',
        }
    },
    subtitle: {
        text: '여론 조사',
        style: {
            fill: 'black',
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '10px'
        }
    },
    split: {
        visible: true,
        cols: 2,
        rows: 2,
    },
    legend: {
        align: 'left',
        itemGap: 20,
        markerGap: 10,
        offsetX: 20,
        style: {
            marginRight: '20px'
        }
    },
    xAxis: [{
        // col: 0,
        line: false,
        label: false,
        // reversed: true
    },{
        col: 1,
        line: true,
        // position: 'between',
        label: {
            style: {
                fill: '#000',
                fontWeight: 'bold'
            },
        },
        inverted: true,
        // reversed: true
    }],
    yAxis: [{
        // position: 'opposite',
        label: false,
        grid: false
    },],
    series: [{
        type: 'pie',
        startAngle: -90,
        totalAngle: 180,
        // inverted: true,
        xAxis: 0,
        yAxis: 0,
        radius: '40%',
        centerY: '60%',
        innerRadius: '40%',
        // innerText: '<t style="fill:#000;font-weight:bold;font-size:24px">OS</t>',
        legendByPoint: true,
        pointLabel: {
            text: '${x}<br>${y}%',
            visible: true,
            numberFormat: '#.00',
            style: {
                fill: '#fff',
                stroke: '#d3d3d3',
                strokeWidth: '0.2px',
                fontSize: '14px'
            }
        },
        data: [
            { label: '매우 긍정', value: 11},
            { label: '어느정도 긍정', value: 22.4},
            { label: '어느정도 부정', value: 16.9},
            { label: '매우 부정', value: 43.6},
            { label: '잘 모름', value: 7.1},
        ],
    },
    {
        type: 'bargroup',
        color: '#0098ff',
        // visibleInLegend: false,
        xAxis: 1,
        yAxis: 0,
        pointLabel,
        data: areaData,
        layout: 'stack',
        children: [
            {
                name: '긍정',
                xField: '구분값',
                yField: '긍정',
                data: areaData,
            },
            {
                name: '부정',
                xField: '구분값',
                yField: '부정',
                data: areaData,
            },
            {
                name: '모름|무응답',
                xField: '구분값',
                yField: '모름|무응답',
                data: areaData,
            }
        ]
    }, ]
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
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
