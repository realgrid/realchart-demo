const config = {
    title: {
        template: 'title',
        text: '소싱처리 준수율',
        style: {
            fontSize: '20px'
        }
    },
    templates: {
        series: {
            pointPadding: 0,
            pointLabel: {
                visible: true,
                position: 'inside',
                effect: 'outline',
                textCallback: (args) => {
                    if (args.y > 1) {
                        return args.y;
                    }
                    return ' ';
                }
            }
        }
    },
    xAxis: {
        type: 'category',
        categories: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
    },
    yAxis: {
        type: 'linear',
        strictMax: 100,
        title: {
            text: '단위: %',
            align: 'end',
            style: {
                fontSize: 12,
                fill: 'gray'
            }
        }
    },
    series: [
        {
            layout: 'stack',
            children: [
                {
                    template: 'series',
                    name: '0~3일 이상',
                    data: [66.7, 0, 40, 70, 0, 0, 0, 0, 0, 0, 0, 100],
                    style: {
                        fill: '#FF5C35',
                        stroke: 'none'
                    },
                    hoverStyle: {
                        fill: '#FF6F5C',
                        stroke: 'none'
                    },
                    pointLabel: {
                        effect: 'none',
                        style: {
                            stroke: 'none',
                            fill: '#fff'
                        }
                    }
                },
                {
                    template: 'series',
                    name: '4~5일 이상',
                    data: [33.3, 0, 20, 0, 50, 0, 0, 0, 0, 100, 0, 0],
                    autoContrast: false,
                    style: {
                        fill: '#FF9F00',
                        stroke: 'none'
                    },
                    hoverStyle: {
                        fill: '#FFB243',
                        stroke: 'none'
                    },
                    pointLabel: {
                        effect: 'none',
                        style: {
                            stroke: 'none',
                            fill: '#fff'
                        }
                    }
                },
                {
                    template: 'series',
                    name: '6~7일 이상',
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    style: {
                        fill: '#95D12C',
                        stroke: 'none'
                    },
                    hoverStyle: {
                        fill: '#91CC39',
                        stroke: 'none'
                    }
                },
                {
                    template: 'series',
                    name: '8~9일 이상',
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                },
                {
                    template: 'series',
                    name: '10일 이상',
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                }
            ]
        },
        {
            type: 'line',
            children: [
                {
                    name: '목표율',
                    data: [66.7, 60, 30, 70, 95, 95, 95, 95, 95, 95, 95, 95],
                    style: {
                        fill: 'red',
                        stroke: '#FF5C35'
                    },
                    marker: {
                        style: {
                            fill: '#fff'
                        },
                        hoverStyle: {
                            fill: '#FF5C35',
                            stroke: '#fff'
                        }
                    }
                }
            ]
        }
    ],
    legend: {
        //location: 'bottom'
        //간격
        itemGap: 20,
        style: {
            // 글자 크기
            fontSize: '12px'
        }
    },
    tooltip: {
        scope: 'group'
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
