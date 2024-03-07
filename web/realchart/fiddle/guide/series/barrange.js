
const config = {
    series: {
        type: 'barrange',
        data: [
            [-13.9, 5.2], // [low, y(high)]
            [-16.7, 10.6],
            [-4.7, 11.6],
            [-4.4, 16.8],
            [-2.1, 27.2],
            [5.9, 29.4],
            [6.5, 29.1],
            [4.7, 25.4],
            [4.3, 21.6],
            [-3.5, 15.1],
            [-9.8, 12.5],
            [-11.5, 8.4]
        ]
    }
};

let animate = false;
let chart;


function init() {
	chart = RealChart.createChart(document, 'realchart', config);
}
 