
const [catiMainData] = data.filter(row => row['구분'] == '전체')
const colors = ['#009D92', '#47AFA8', '#835337', '#593219', '#937B6F'];
const pieData = Object.entries(catiMainData)
    .filter((_, i) => [3,4,5,6,9].includes(i))
    .map(([key, value], i) => {
        return { label: key, value, color: colors[i] }
    });
const config = {
    templates: {
        series: {
            // startAngle: -90,
            // totalAngle: 180,
            // inverted: true,
            // yAxis: 0,
            radius: '50%',
            // centerY: '100%',
            innerRadius: '50%',
            // innerText: '<t style="fill:#000;font-weight:bold;font-size:24px">OS</t>',
            // legendByPoint: true,
            pointLabel: {
                visible: true,
                numberFormat: '#.00',
                suffix: '%',
                position: 'inside',
                text: '${x}<br>${y}%',
            },
        },
        xAxis: {
            line: false,
            label: false,
        },
        xAxis: {
            line: false,
            label: false,
        }
    },
    annotations: [
        { 
            text: `<t>긍정적으로 평가한다</t><br>
                <b style="font-size:20pt">${catiMainData["긍정"]}</b>`,
                offsetX: 580,
                offsetY: 100,
                style: {
                    fill: colors[0],
                    textAlign: 'center',
                },
            },
        { 
            text: `<t>부정적으로 평가한다</t><br>
                <b style="font-size:30pt">${catiMainData["부정"]}</b>`,
            offsetX: 50,
            offsetY: 400,
            style: {
                fill: colors[3],
                textAlign: 'center',
            },
        },
        {
            imageUrl: '../assets/images/seoul.png',
            front: true,
            width: 260,
            offsetX: 260,
            offsetY: 180,
        }
    ],
    // inverted: true,
    options: {
        // animatable: false
    },
    title: {
        align: 'left',
        text: '2023년 11월',
        gap: 10,
        // backgroundStyle: {
        //     fill: 'black',
        //     rx: '3px'
        // },
        style: {
            // fill: '#fff',
            fontSize: '16px',
            padding: '2px 5px',
        }
    },
    subtitle: {
        align: 'left',
        text: '여론 조사',
        style: {
            fill: 'black',
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '10px'
        }
    },
    legend: false,
    xAxis: {
        template: 'xAxis',
    },
    yAxis: {
        template: 'yAxis',
    },
    series: [
        {
            template: 'series',
            tooltipText: '${x}',
            type: 'pie',
            colorField: 'color',
            data: pieData,
            pointLabel: {
                style: {
                    fill: '#fff'
                },
                textCallback: ({x, y}) => {
                    const fontSize = Math.max(15, y);
                    return `${x}<br><b style="font-size:${fontSize}px">${y}</b>`
                }
            }
        }
    ]
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
