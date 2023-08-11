const config = {
    type: "bar",
    title: "Bar Multi",
    xAxis: {
        title: "일일 Daily fat",
        categories: ['쓰리엠', '아디다스', '디즈니', '이마트', '메리어트', '시세이도'],
        grid: true,
    },
    yAxis: {
        title: "Vertical 수직축 Axis",
    },
    series: [{
        name: 'bar1',
        pointLabel: true,
        // pointWidth: '100%',
        data: [11, 22, 15, 9, 13, 27]
    }, {
        name: 'bar2',    
        groupWidth: 2,
        pointLabel: true,
        data: [15, 19, 19, 6, 21, 21]
    }, {
        name: 'bar3',
        pointLabel: true,
        data: [13, 17, 15, 11, 23, 17]
    }]
}
let chart;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.refresh();
    }, true);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
}

export function init() {
    // console.log(RealChart.getVersion());
    // RealChart.setLogging(true);
    RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
