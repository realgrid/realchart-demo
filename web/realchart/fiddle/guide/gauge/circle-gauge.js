const config = {
    templates: {
        gauge: {
            width: '33%',
            height: '50%',
            innerRadius: '93%',
            valueRim: {
                ranges: [{
                    toValue: 25,
                    color: 'green'
                }, {
                    toValue: 50,
                    color: '#0000cc'
                }, {
                    toValue: 75,
                    color: '#ffaa00'
                }, {
                    color: 'red'
                }]
            },
            label: {
                text: '<t style="fill:blue">${value}</t><t style="font-size:12px;">&nbsp;</t><t style="font-size:20px;">%</t><br><t style="font-size:20px;font-weight:normal">Gauge Test</t>',
                style: {
                    fontWeight: 'bold'
                }
            }
        }
    },
    title: "Multiple Gauges",
    gauge: [{
        template: "gauge",
        name: 'gauge1',
        left: 0,
        top: 0,
        value: Math.random() * 100,
    }, {
        template: "gauge",
        name: 'gauge2',
        left: '33%',
        top: 0,
        valueRim: {
            thickness: '200%',
        },
        value: Math.random() * 100,
    }, {
        template: "gauge",
        name: 'gauge3',
        left: '66%',
        top: 0,
        value: Math.random() * 100,
    }, {
        template: "gauge",
        name: 'gauge4',
        left: 0,
        top: '50%',
        value: Math.random() * 100,
        innerRadius: '85%',
        valueRim: {
            stroked: true,
            style: {
                strokeLinecap: 'round'
            }
        },
        backgroundStyle: {
            stroke: 'lightblue',
            strokeWidth: '2px',
            borderRadius: '10px'
        }
    }, {
        template: "gauge",
        name: 'gauge5',
        left: '33%',
        top: '50%',
        value: Math.random() * 100,
        innerRadius: '75%',
        valueRim: {
            stroked: true,
            style: {
                strokeDasharray: '3'
            }
        },
        label: {
            style: {
                fontSize: '30px'
            }
        }
    }, {
        template: "gauge",
        name: 'gauge6',
        left: '66%',
        top: '50%',
        value: Math.random() * 100,
        innerStyle: {
            fill: '#003300',
            stroke: 'white',
            strokeWidth: '5px'
        },
        label: {
            text: '<t style="fill:yellow">${value}</t><t style="font-size:12px;">&nbsp;</t><t style="font-size:20px;">%</t><br><t style="font-size:20px;font-weight:normal">Gauge Test</t>',
            style: {
                fontWeight: 'bold',
                fill: 'white'
            }
        }
    }]
};

let animate = false;
let chart;


function init() {
	chart = RealChart.createChart(document, 'realchart', config);
}
 