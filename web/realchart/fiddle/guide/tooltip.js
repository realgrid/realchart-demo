/**
 * @demo
 *
 */
const config = {
    assets: [{
        type: 'pattern',
        id: 'pattern-1',
        pattern: 0,
        style: {
            stroke: 'white',
            strokeWidth: '1px'
        },
        backgroundStyle: {
            fill: '#0088ff'
        }
    }],
    title: 'Hover Style',
    legend: true,
    body: {
        style: {
            stroke: 'none',
        },
    },
    xAxis: {
        tick: true,
        title: {
            text: '수정구',
        },
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
        tooltipText: '<b>${name}</b><br>${series}:<b> ${yValue}</b>',
        pointLabel: {
            visible: true,
            rotation: -90,
        },
        hoverStyle: {
            stroke: 'blue',
            fill: 'url(#pattern-1)'
        },
        data: [
            // { name: 'xxx', value: 11111, label: 3333},
            ['신흥1동', 13904],
            ['신흥2동', 19796],
            ['신흥3동', 10995],
            ['태평1동', 14625],
            ['태평2동', 14627],
            ['태평3동', 12649],
            ['태평4동', 12279],
        ],
    },
};

let animate;
let chart;


function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config, true, () => {
        console.log('LoADED!')
    });
}
