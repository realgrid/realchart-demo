/**
 * @demo
 *
 */
const config = {
    title: 'Empty Chart'
};

let animate;
let chart;

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config, true, () => {
        console.log('LOADED!');
    });
}
