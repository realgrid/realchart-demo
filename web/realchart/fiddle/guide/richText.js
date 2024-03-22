const config = {
    series: {
        type: 'line',
        data: [155, 138, 122, 133, 114, 113],
        style: {
            stroke: 'red',
            strokeDasharray: '4'
        },
        tooltipText: '<b>${name}</b><br>${series}:<b> ${yValue}</b>',
    },
    title: {
        text: '<t style="fill:red">title</t><i> italic </i>',
        style: {
            fontSize: '50px',
            fill: '#333',
            fontWeight: 'bold'
        }
    }
};

let animate = false;
let chart;

function init() {
    chart = RealChart.createChart(document, 'realchart', config);
}
