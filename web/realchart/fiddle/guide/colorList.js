const config = {
    assets: [{
        type: 'colors',
        id: 'color1',
        colors: ['#88f', '#aaf', '#bbf', '#ddf', '#eef'],
        mode: 'suffle'
    }],
    series: {
        data: [155, 138, 122, 133, 114, 113],
        tooltipText: '<b>${name}</b><br>${series}:<b> ${yValue}</b>',
        pointColors: 'color1'
    },
};

let animate = false;
let chart;

function init() {
    chart = RealChart.createChart(document, 'realchart', config);
}
