export const config = {
    gaugeType: 'clock',
    templates: {
        gauge: {
            label: {
                style: {
                    fontSize: '12px'
                }
            }
        }
    },
    options: {
        credits: {
        }
    },
    title: "Multiple Clocks",
    gauge: [{
        template: "gauge",
        name: 'gauge1',
        width: '33%',
        height: '50%',
        left: 0,
        top: 0,
    }, {
        template: "gauge",
        name: 'gauge2',
        width: '33%',
        height: '50%',
        left: '33%',
        top: 0,
        timezone: 120,
        rim: {
            thickness: 5,
            style: {
                stroke: 'none',
                fill: '#338'
            }
        },
        hourHand: {
            style: {
                stroke: 'none',
                fill: '#338'
            }
        },
        minuteHand: {
            style: {
                stroke: 'none',
                fill: '#338'
            }
        },
        secondHand: {
            style: {
                stroke: 'none',
                fill: '#338'
            }
        },
        label: {
            text: 'Paris',
            style: {
                fontSize: '15px',
                fontWeight: 'bold',
                fill: 'blue'
            }
        },
    }, {
        template: "gauge",
        name: 'gauge3',
        width: '33%',
        height: '50%',
        left: '66%',
        top: 0,
        timezone: -240,
        label: {
            text: 'NewYork',
            style: {
                fontSize: '15px',
                fontWeight: 'bold',
                fill: 'blue'
            }
        },
        tick: {
            length: 5
        },
        minorTick: false
    }, {
        template: "gauge",
        name: 'gauge4',
        width: '33%',
        height: '50%',
        left: 0,
        top: '50%',
        tick: {
            length: 0
        },
        minorTick: false,
        rim: {
            thickness: 2,
            style: {
                stroke: 'none',
                fill: '#333'
            }
        },
        hourHand: {
            length: '55%',
            thickness: 5,
        },
        minuteHand: {
            length: '75%',
            thickness: 3,
        },
        secondHand: {
            thickness: 1,
            style: {
                fill: '#080'
            }
        },
    }, {
        template: "gauge",
        name: 'gauge5',
        width: '33%',
        height: '50%',
        left: '33%',
        top: '50%',
        minorTick: false,
        hourHand: {
            thickness: 5,
        },
        minuteHand: {
            thickness: 3,
        },
        secondHand: {
            style: {
                fill: '#333'            
            }
        }
    }, {
        template: "gauge",
        name: 'gauge6',
        width: '33%',
        height: '50%',
        left: '66%',
        top: '50%',
        rim: {
            thickness: 5,
            style: {
                stroke: 'none',
                fill: '#333'
            }
        },
        hourHand: {
            thickness: 5,
        },
        minuteHand: {
            thickness: 3,
        },
        secondHand: false,
        tickLabel: {
            step: 3
        },
        label: {
            position: 'bottom'
        }
    }]
}
