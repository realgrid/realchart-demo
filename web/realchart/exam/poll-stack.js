
const catiAreaData = data.filter(row => row['구분'] == '7개 권역');

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
    inverted: true,
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
    xAxis: {
        type: 'category',
        // line: true,
        // position: 'between',
        label: {
            style: {
                fill: '#000',
                fontWeight: 'bold'
            },
        },
        // inverted: true,
        // reversed: true
    },
    yAxis: {
        // position: 'opposite',
        label: false,
        grid: false
    },
    series: 
    {
        type: 'bar',
        // color: '#000',
        // visibleInLegend: true,
        layout: 'stack',
        children: [
            {
                name: '긍정',
                xField: '구분값',
                yField: '긍정',
                data: catiAreaData,
                pointLabel,
                style: {
                    fill: 'var(--color-1)'
                }
            },
            {
                name: '부정',
                xField: '구분값',
                yField: '부정',
                data: catiAreaData,
                pointLabel,
                style: {
                    fill: 'var(--color-3)'
                }
            },
            {
                name: '모름|무응답',
                xField: '구분값',
                yField: '모름|무응답',
                data: catiAreaData,
                pointLabel,
                style: {
                    fill: 'var(--color-11)'
                }
            }
        ]
    }
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
