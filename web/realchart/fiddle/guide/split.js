/**
 * @demo
 *
 */
const config = {
    type: 'line',
    options: {
        animatable: false
    },
    title: "Column Split Lines",
    split: {
        visible: true,
        cols: 3
    },
    xAxis: [{
        categories: ['성남시', '용인시', '수원시', '일산시', '화성시', '평택시', '안양시', '부천시', '고양시',' 안산시']
    }, {
        col: 1,
        type: 'linear',
        tick: {
            step: 1
        }
    }, {
        col: 2,
        categories: ['성남시', '용인시', '수원시', '일산시', '화성시', '평택시', '안양시', '부천시', '고양시',' 안산시']
    }],
    yAxis: {
        guides: [{
            type: 'line',
            col: 0,
            // front: true,
            value: 12,
            label: {
                text: 'line guide',
                effect: 'background',
                style: {
                    fill: 'white',
                },
                backgroundStyle: {
                    fill: 'black',
                    padding: '2px 5px'
                }
            },
            style: {
                stroke: 'blue',
                strokeDasharray: '4'
            }
        }, {
            type: 'range',
            col: [0, 2],
            front: true,
            startValue: 3,
            endValue: 6,
            label: {
                text: 'range guide',
                align: 'right',
                style: {
                    fill: 'red'
                }
            }
        }]
    },
    series: [{
        lineType: 'spline',
        pointLabel: true,
        data: [7, 11, 9, 7.5, 15.3, 13, 7, 9, 11, 2.5]
    }, {
        type: 'bar',
        xAxis: 1,
        pointLabel: true,
        data: [7, 10, 8, 6.5, 15.3, 13, 10, 9.5, 11.5, 3.5]
    }, {
        xAxis: 2,
        lineType: 'spline',
        pointLabel: true,
        data: [7, 10, 8, 6.5, 15.3, 13, 10, 9.5, 11.5, 3.5]
    }]
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
