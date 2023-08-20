const config = {
    options: {},
    title: "Linear Axis",
    xAxis: {
        type: 'category'
    },
    yAxis: {
    },
    series: {
        type: 'line',
        pointLabel: true,
        data: [
            ['대한민국', 34980],
            ['중국', 11890],
            ['인도', 2170],
            ['인도네시아', 4140],
            ['일본', 42620],
            ['사우디아라비아', 22270],
            ['튀르키예', 9830],
            ['캐나다', 48310],
            ['멕시코', 9380],
            ['미국', 70430],
            ['아르헨티나', 10050],
            ['브라질', 7720],
            ['프랑스', 43880],
            ['독일', 51040],
            ['이탈리아', 35710],
            ['러시아', 11600],
            ['영국', 45380],
            ['남아프리카공화국', 6440],
            ['오스트레일리아', 56760],
        ]
    }
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
