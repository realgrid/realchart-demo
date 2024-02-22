const config = {
    series: [
        {
            layout: 'overlap',
            children: [
                {
                    name: "group1",
                    data: [11, 22, 15, 9, 13, 27],
                    pointPadding: 0.2
                },
                {
                    name: "group2",
                    data: [15, 19, 19, 6, 21, 21],
                    pointPadding: 0.3
                },
                {
                    name: "group3",
                    data: [13, 17, 15, 11, 23, 17],
                    pointPadding: 0.4
                }
            ]
        }
    ]
};

let animate = false;
let chart;

function init() {
    chart = RealChart.createChart(document, 'realchart', config);
}
