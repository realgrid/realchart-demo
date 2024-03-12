/**
 * @demo
 *
 * Bar Series 기본 예제.
 */
const config = {
    title: '매출실적 및 매출이익',
    options: {},
    body: {
        style: {
            fill: '#fff',
            background: '#6080E7'
        }
    },
    xAxis: {
        categories: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        grid: {
            visible: !true
        }
    },
    yAxis: {
        title: {
            text: '단위: 백만원',
            align: 'front'
        },
        tick: {
            stepInterval: 50
        }
    },
    series: [
        {
            layout: 'stack',
            pointLabel: true,
            children: [
                {
                    name: '매입실적',
                    data: [54, 73, 40, 61, 103, 72, 84, 73, 58, 84, 42, 83],
                    pointLabel: {
                        style: { fill: '#fff' },
                        visible: true,
                        position: 'inside'
                    },
                    style: {
                        fill: '#008CFF',
                        stroke: 'none'
                    },
                    hoverStyle: {
                        fill: '#FF4F63',
                        stroke: 'none'
                    }
                },
                {
                    name: '매출이익',
                    data: [8, 13, 6, 10, 23, 14, 23, 11, 11, 14, 8, 13],
                    pointLabel: {
                        style: { fill: '#' },
                        visible: true,
                        position: 'inside'
                    },
                    style: {
                        fill: '#FFB900',
                        stroke: 'none'
                    },
                    hoverStyle: {
                        fill: '#60D4C4',
                        stroke: 'none'
                    }
                }
            ]
        },
        {
            type: 'line',
            name: '매출목표',
            data: [34, 53, 37, 91, 83, 105, 69, 80, 67, 121, 48, 75],
            style: {
                fill: '',
                stroke: '#FFB900'
            },
            marker: {
                style: {
                    fill: '#fff'
                },
                hoverStyle: {
                    fill: '#FFB900',
                    stroke: 'none'
                }
            }
        }
    ],
    legend: {
        location: 'bottom'
        // reversed: true
    }
};

let animate = false;
let chart;

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
}
