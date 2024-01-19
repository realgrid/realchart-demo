/**
 * Pie Group
 */
const config = {
    title: 'Pie Group',
    series: {
        type: 'piegroup',
        layout: 'stack',
        polarSize: '10%',
        children: [
            {
                template: 'series',
                name: 'pie1',
                pointLabel: {
                    visible: true,
                    position: 'inside',
                    effect: 'outline',
                },
                // pointWidth: '100%',
                data: [11, 22, 15, 9, 13, 27],
            },
            {
                template: 'series',
                name: 'pie2',
                pointLabel: {
                    visible: true,
                    position: 'inside',
                    effect: 'outline',
                },
                data: [15, 19, 19, 6, 21, 21],
            },
            {
                template: 'series',
                name: 'pie3',
                pointLabel: {
                    visible: true,
                    position: 'inside',
                    effect: 'outline',
                },
                data: [13, 17, 15, 11, 23, 17],
            },
        ],
    },
};

let chart;

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
}
