/**
 * @demo
 * 
 */
export const config = {
    title: "Point Style Callback",
    options: {
        // animatable: false
    },
    xAxis: {
        categories: ['쓰리엠', '아디다스', '디즈니', '이마트', '메리어트', '시세이도'],
        title: {
            text: "일일 Daily fat",
        },
        tick: {
        },
        label: {
        },
        // grid: true,
        line: true,
    },
    yAxis: {
        title: "Vertical 수직축 Axis",
        // reversed: true,
        // baseValue: -1
    },
    series: [{
        name: 'column1',
        pointLabel: {
            visible: true,
            position: 'inside',
            effect: 'outline',
        },
        // pointWidth: '100%',
        pointStyleCallback: args => {
            if (args.index == 0) return { fill: 'lightgray' }
            else if (args.yValue === args.yMax) return { fill: 'green' }
        },
        data: [11, 22, 15, 9, 19, 13, 27, 15]
    }, {
        name: 'line1',
        type: 'line',
        pointLabel: true,
        color: 'blue',
        data: [9, 17, 19, 11, 25, 10, 21, 11],
        style: {
            strokeDasharray: '5'
        },
        marker: {
            style: {
                stroke: 'white',
                strokeDasharray: 'none'
            }
        },
        pointStyleCallback: args => {
            if (args.yValue === args.yMax) return { fill: 'red', strokeWidth: '5px', stroke: 'red' }    
            return { fill: 'green' }
        }
    }]
}

let animate = false;
let chart;

function setActions(container) {
    createCheckBox(container, 'Debug', function (e) {
        RealChart.setDebugging(_getChecked(e));
        chart.refresh();
    }, false);
    // createCheckBox(container, 'Always Animate', function (e) {
    //     animate = _getChecked(e);
    // }, false);
    createButton(container, 'Test', function(e) {
        alert('hello');
    });
    createCheckBox(container, 'Inverted', function (e) {
        config.inverted = _getChecked(e);
        chart.load(config, animate);
    }, false);
    createCheckBox(container, 'X Reversed', function (e) {
        config.xAxis.reversed = _getChecked(e);
        chart.load(config, animate);
    }, false);
    createCheckBox(container, 'Y Reversed', function (e) {
        config.yAxis.reversed = _getChecked(e);
        chart.load(config, animate);
    }, false);
}

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);

    chart = RealChart.createChart(document, 'realchart', config);
    setActions('actions')
}
