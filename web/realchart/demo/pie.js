const config = {
    title: "Pie Series",
    legend: {
        position: 'inside',
        layout: 'vertical',
        align: 'right',
        valign: 'top',
        style: {
            marginTop: '16px',
            marginRight: '20px'
        }
    },
    xAxis: {
    },
    yAxis: {
    },
    series: {
        type: 'pie',
        pointLabel: {
            visible: true,
            effect: 'outline',
            style: {
                // fill: '#eee'
            }
        },
        data: [ 
            { name: 'moon', y: 53, sliced: true }, 
            { name: 'yeon', y: 97, color: '#0088ff' }, 
            { name: 'lim', y: 17}, 
            { name: 'moon', y: 9}, 
            { name: 'hong', y: 13 }, 
            { name: 'america', y: 23}, 
            { name: 'asia', y: 29}, 
            // 23,
            // 7,
            // 17,
            // 13
        ],
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
