/**
 * @demo
 *
 */
const data = RealChart.createData('main', [
    ['신흥1동', 3904],
    ['신흥2동', 19796],
    ['신흥3동', 10995],
    ['태평1동', 14625],
    ['태평2동', 14627],
    ['태평3동', 12649],
    ['태평4동', 12279],
]);
const config = {
    options: {},
    title: 'Chart Data',
    legend: true,
    body: {
        style: {
            stroke: 'none',
        },
    },
    xAxis: {
        label: {
            style: {},
        },
        grid: {
            visible: true,
            lastVisible: true,
        },
        tick: true,
        title: {
            text: '수정구',
        },
        // grid: true,
        crosshair: true,
    },
    yAxis: {
        title: {
            text: '전체 인구수',
        },
        unit: '(명)',
        label: {
            lastText: '${label}<br>${axis.unit}',
            lastStyle: { fontWeight: 'bold' },
        },
    },
    series: {
        pointLabel: true,
        data,
        pointStyleCallback: (args) => {
            if (args.yValue > 30000) {
                return { fill: 'blue', stroke: 'blue' };
            } else if (args.yValue < 5000) {
                return { fill: 'red', stroke: 'red' };
            }
        },
    },
};

let animate;
let chart;
let timer;
let dong = 1;


function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
}
