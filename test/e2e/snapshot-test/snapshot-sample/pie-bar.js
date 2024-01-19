export const config = {
    inverted: true,
    options: {
    },
    title: {
        text: '2017년 3/4분기',
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
        text: '모바일 트래픽 분석',
        style: {
            fill: 'black',
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '10px'
        }
    },
    split: {
        visible: true,
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
        line: false,
        label: false,
        reversed: true
    },{
        row: 1,
        line: false,
        position: 'between',
        label: {
            style: {
                fill: '#000',
                fontWeight: 'bold'
            },
        },
        reversed: true
    }],
    yAxis: [{
        title: {
            text: '운영체제',
            style: {
                fontSize: '24px',
                fontWeight: 'bold'
            }
        },
        position: 'opposite',
        label: false,
        grid: false
    }, {
        row: 1,
        title: {
            text: '안드로이드(Android) 버전별',
            backgroundStyle: {
                padding: '5px 20px',
                stroke: '#d3d3d3',
                strokeWidth: '0.3px'
            },
            style: {
                fontSize: '18px'
            }
        },
        position: 'opposite',
        label: false,
        grid: false
    }],
    series: [{
        type: 'pie',
        radius: '40%',
        centerY: '50%',
        innerRadius: '50%',
        innerText: '<t style="fill:#000;font-weight:bold;font-size:24px">OS</t>',
        legendByPoint: true,
        onPointClick: (arg) => {
            const data = {
                Android: [
                    { x: '7', y: 49.18},
                    { x: '6', y: 29.04},
                    { x: '5.1', y: 5.60},
                    { x: '5', y: 6.26},
                    { x: '4.4', y: 7.85},
                    { x: '기타', y: 2.07},
                ],
                iOS: [
                    { x: '10', y: 18.58},
                    { x: '9', y: 42.4},
                    { x: '8', y: 25.1},
                    { x: '7', y: 8.42},
                    { x: '6', y: 3.7},
                    { x: '기타', y: 1.8},
                ],
                Windows: [
                    { x: '10', y: 42.04},
                    { x: '9', y: 34.63},
                    { x: '8.1', y: 12.6},
                    { x: '8', y: 4.17},
                    { x: '7', y: 1.02},
                    { x: '기타', y: 5.44},
                ],
                기타: [
                    { x: 'BlackBerry', y: 49.18},
                    { x: 'Kai', y: 29.04},
                    { x: 'Tizen', y: 5.60},
                    { x: 'Harmony', y: 3.26},
                    { x: 'Firefox', y: 7.85},
                    { x: '기타', y: 5.27},
                ]
            }
            const colors = ['#0098ff', '#66d0ff', '#ff5c35', '#ff9f00'];
            config.series[1].data = data[arg.x];
            config.series[0].data.forEach(value => {
                value.sliced = value.x === arg.x ? true : false;
                config.series[1].color = colors[arg.index];
                switch(arg.x) {
                    case 'Android':
                        config.yAxis[1].title.text = '안드로이드(Android) 버전별 사용량';
                        break;
                    case 'iOS':
                        config.yAxis[1].title.text = 'iOS 버전별 사용량';
                        break;
                    case 'Windos':
                        config.yAxis[1].title.text = 'Windows 버전별 사용량';
                        break;
                    case '기타':
                        config.yAxis[1].title.text = '기타 OS 버전별 사용량';
                        break;
                    default:
                        break;
                }
            });
            chart.load(config, false);
        },
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
            { x: 'Android', y: 53.51, sliced: true }, 
            { x: 'iOS', y: 29.14 }, 
            { x: 'Windows', y: 10.72}, 
            { x: '기타', y: 6.63}, 
        ],
    },{
        color: '#0098ff',
        visibleInLegend: false,
        xAxis: 1,
        yAxis: 1,
        pointLabel: {
            visible: true,
            numberFormat: '#.00',
            suffix: '%',
            offset: 12,
            style: {
                fill: '#000'
            }
        },
        data: [
            { x: '7', y: 49.18},
            { x: '6', y: 29.04},
            { x: '5.1', y: 5.60},
            { x: '5', y: 6.26},
            { x: '4.4', y: 7.85},
            { x: '기타', y: 2.07},
        ]
    }]
}
