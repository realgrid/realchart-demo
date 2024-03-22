const config = {
    series: {
        type: 'line',
        data: [155, 138, 122, 133, 114, 113],
        style: {
            stroke: 'red',
            strokeDasharray: '4'
        }
    },
    title: {
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
