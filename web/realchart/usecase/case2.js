/**
 * @demo
 *
 * Bar Series 기본 예제.
 */

const config = {
    title: '매입금액',

    templates: {
        pointLabel: {
            pointLabel: {
                visible: true,
                position: 'inside',
                effect: 'outline'
            }
        }
    },
    xAxis: {
        type: 'category'
    },
    yAxis: {},
    series: [
        {
            name: '매입금액',
            data: [
                ['주식회사 A업체', 303],
                ['주식회사 B업체', 154],
                ['주식회사 C업체', 100],
                ['주식회사 D업체', 35],
                ['주식회사 E업체', 120],
                ['주식회사 F업체', 21],
                ['주식회사 G업체', 80],
                ['주식회사 H업체', 18],
                ['주식회사 I업체', 50],
                ['주식회사 J업체', 250],
                ['주식회사 K업체', 128],
                ['주식회사 L업체', 13],
                ['주식회사 M업체', 45],
                ['주식회사 N업체', 7],
                ['주식회사 O업체', 70],
                ['주식회사 P업체', 90],
                ['주식회사 Q업체', 5],
                ['주식회사 R업체', 50],
                ['주식회사 S업체', 15],
                ['주식회사 T업체', 20]
            ],
            style: {
                fill: '#008CFF',
                stroke: 'none'
            },
            hoverStyle: {
                fill: '#5EB3E4',
                stroke: 'none'
            }
        }
    ],
    legend: {
        visible: true
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
