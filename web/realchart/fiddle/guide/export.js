/**
 * @demo
 *
 */

const config = {
    export: { visible: true },
    series: {
        type: 'bar',
        data: [155, 138, 122, 133, 114, 113],
    },
};
let animate;
let chart;


function init() {
    console.log(RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    $$_RealChartExporter.RealchartExport(chart);
}
