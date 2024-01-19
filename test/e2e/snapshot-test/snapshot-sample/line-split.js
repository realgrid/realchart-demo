export const config = {
    templates: {
        gauge: {
            width: '33%',
            height: '50%',
            innerRadius: '93%',
            rim: false,
            valueRim: false,
            label: {
                style: {
                    fill: '#464646',
                    fontWeight: 'bold'
                },
            }
        }
    },
    type: 'line',
    title: false,
    options: {
        style: {
            backgroundColor: '#fdfdfd'
        },
        credits: false,
    },
    legend: false,
    xAxis: [{
        line: false,
        label: false,
        title: {
            text: 'AVG. SPEED',
            align: 'start',
            style: {
                fill: '#9ea7a6',
                fontSize: '24px',
                fontWeight: 'bold'
            }
        },
        position: 'opposite',
    }, {
        line: false,
        label: false,
        title: {
            text: 'AVG. HEART RATE',
            align: 'start',
            style: {
                fill: '#9ea7a6',
                fontSize: '24px',
                fontWeight: 'bold'
            }
        },
        position: 'between',
    }],
    yAxis: [{
        side: true,
        position: 'opposite',
        minValue: 0,
        minValue: 30,
    }, {
        position: 'opposite',
        minValue: 0,
        minValue: 250,
    }],
    body: {
        split: true,
    },
    series: [{
        lineType: 'spline',
        color: '#0098ff',
        data: [14.5, 13, 22, 14.8, 18.2, 11.3, 14.7, 11.4, 13.1, 6],
        marker: false,
        style: {
            strokeWidth: '3px',
        }
    }, {
        lineType: 'spline',
        color: '#ff5c35',
        xAxis: 1,
        yAxis: 1,
        data: [110, 100, 130, 110, 126, 118, 132, 105, 115, 98],
        marker: false,
        style: {
            strokeWidth: '3px',
        }
    }],
    gauge: [{
        template: "gauge",
        name: 'gauge1',
        left: -60,
        top: -320,
        value: 16,
        label: {
            text: '<t style="font-size:48px;">${value}</t><t style="font-size:24px;">  km/h</t>',
        }
    }, {
        template: "gauge",
        name: 'gauge2',
        left: -50,
        top: -70,
        value: 132,
        maxValue: 240,
        label: {
            text: '<t style="font-size:48px;">${value}</t><t style="font-size:24px;">  bpm</t>',
        }
    }]
}
