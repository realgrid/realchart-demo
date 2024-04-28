const config = {
    templates: {
        gauge: {
            maxValue: 70,
            label: {
                style: {
                    // textAnchor: 'start',
                },
                // numberFormat: '#.#',
                text: "<t style='fill:gray'>${x}</t>",

            },
            rim: {
                style: {
                    fill: 'none'
                },
            },
        },
    },
    title: {
        text: 'Depending on the level, global gender parity in investing roles may take<br>multiple decades to achieve.',
        style: {
            fontWeight: 700,
        },
        align: 'center',
        gap: -120,
    },
    subtitle: {
        text: ['<b>Trips around the sun required</b>',
            '<b>to reach gender parity in</b>',
            '<b>investing roles at each</b>',
            '<b>level</b>, years'].join('<br>'),
        align: 'right',
        style: {
            textAlign: 'right',
            paddingRight: 100
        },
        alignBase: 'body',
        // paddingLeft: 20,
    },
    body: {
        annotations: [
            {
                type: 'image',
                front: true,
                width: 100,
                anchor: 'gauge1',
                offsetY: 220,
                imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Gender_equality_symbol_%28clipart%29.png',
                style: {
                    filter: 'opacity(0.5)'
                }
            }
        ],
    },
    legend: false,
    gauge: [
        {
            name: 'gaugeRoot',
            style: {
                marginBottom: -100
            },
            children: [
            {
              name: 'gauge1',
              template: 'gauge',
              value: 62,
              valueRim: {
                style: {
                  fill: 'var(--color-1)',
                },
              },
              label: {
                style: {
                  fill: 'var(--color-1)',
                },
                text: "<t style='fill:gray'>Managing Group -</t> ${value}",
              },
            },
            {
              name: 'gauge2',
              template: 'gauge',
              value: 35,
              valueRim: {
                style: {
                  fill: 'var(--color-2)',
                },
              },
              label: {
                style: {
                  fill: 'var(--color-2)',
                },
                text: "<t style='fill:gray'>Principal -</t> ${value}",
              },
            },
            {
              name: 'gauge3',
              template: 'gauge',
              value: 11,
              valueRim: {
                style: {
                  fill: 'var(--color-3)',
                },
              },
              label: {
                style: {
                  fill: 'var(--color-3)',
                },
                text: "<t style='fill:gray'>Vice President -</t> ${value}",
              },
            },
            {
              name: 'gauge4',
              template: 'gauge',
              value: 8,
              valueRim: {
                style: {
                  fill: 'var(--color-4)',
                },
              },
              label: {
                style: {
                  fill: 'var(--color-4)',
                },
                text: "<t style='fill:gray'>Associate -</t> ${value}",
              },
            },
            {
                name: 'gauge5',
                template: 'gauge',
                value: 4,
                valueRim: {
                  style: {
                    fill: 'var(--color-5)',
                  },
                },
                label: {
                  style: {
                    fill: 'var(--color-5)',
                  },
                  text: "<t style='fill:gray'>Entry Level -</t> ${value}",
                },
              },
          ],
          innerRadius: '30%',
          sweepAngle: 270,
          label: 'Hello'
        },
      ],
    options: {
        palette: 'vintage',
        pointHovering: false,
        credits: {
            align: 'left',
            text: 'Based on data provided by 66 private equity firms. Responses cover more than 60,000 employees.',
            url: 'https://www.mckinsey.com/featured-insights/2023-year-in-review/2023-the-year-in-charts'
        }
    }
};

function init() {
    console.log(RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
}
