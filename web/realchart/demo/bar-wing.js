/**
 * @demo
 * 
 * Bar Wing 예제
 * 그룹 시리즈의 overlap layout으로 split모드 없이 wing 차트 모양을 내는 예제.
 * male은 data는 음수로 구성되어 있다.
 * axis는 그룹의 axis를 따른다. 두 번째 axis는 모양만 내는 것.
 */
const config = {
    templates: {
        xAxis: {
            categories: [
                '0-4', '5-9', '10-14', '15-19', '20-24', '25-29', '30-34', '35-40', '40-45',
                '45-49', '50-54', '55-59', '60-64', '65-69', '70-74', '75-79', '80+'
            ],
            guide: [
                {
                    type: 'range',
                    startValue: 0,
                    endValue: 5,
                    style: {
                        fill: 'red', //'#5272F2',
                    }
                },
                {
                    type: 'range',
                    startValue: 5,
                    endValue: 11,
                    style: {
                        fill: 'blue', //'#F8BDEB'
                    }
                },
                {
                    type: 'range',
                    startValue: 11,
                    endValue: 16,
                    style: {
                        fill: 'green', //'#FBECB2'
                    }
                }
            ],
        },
    },
    // inverted: true,
    title: "Bar Wing Chart (No Split)",
    options: {
        // animatable: false
    },
    legend: {
        itemGap: 20,
        backgroundStyle: {
            fill: 'none'
        }
    },
    xAxis: [{
        template: 'xAxis',
        title: "Daily fat",
    }, {
        template: 'xAxis',
        title: "Daily fat2",
        position: 'opposite',
    }],
    yAxis: {
        title: "Vertical 수직축 Axis",
        label: {
            numberFormat: 'a'
        }
    },
    series: {
        layout: 'overlap',
        children: [{
            name: 'Male',
            pointLabel: {
                visible: true,
                numberFormat: '##0.00'
            },
            color: '#468B97',
            data: [
                -8.98, -7.52, -6.65, -5.72, -4.85,
                -3.71, -2.76, -2.07, -1.70, -1.47,
                -1.22, -0.99, -0.81, -0.62, -0.41,
                -0.23, -0.15
            ]
        }, {
            name: 'Female',
            color: '#EF6262',
            pointLabel: {
                visible: true,
                numberFormat: '##0.00'
            },
            data: [
                8.84, 7.42, 6.57, 5.68, 4.83,
                3.74, 2.80, 2.14, 1.79, 1.59,
                1.34, 1.06, 0.83, 0.63, 0.43,
                0.25, 0.19
            ]
        }]
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
    createCheckBox(container, 'Inverted', function (e) {
        config.inverted = _getChecked(e);
        chart.load(config, animate);
    }, true);
    createCheckBox(container, 'X1 Reversed', function (e) {
        config.xAxis[0].reversed = _getChecked(e);
        chart.load(config, animate);
    }, false);
    createCheckBox(container, 'X2 Reversed', function (e) {
        config.xAxis[1].reversed = _getChecked(e);
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
