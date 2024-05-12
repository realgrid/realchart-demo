const data = {
  pre: [{
    year: 2021,
    wind: 135,
    storage: 27,
    solar: 73
  }, {
    year: 2025,
    wind: 150,
    storage: 34,
    solar: 165
  }, {
    year: 2027,
    wind: 153,
    storage: 37,
    solar: 185
  }, {
    year: 2030,
    wind: 155,
    storage: 44,
    solar: 215
  }, {
    year: 2032,
    wind: 165,
    storage: 54,
    solar: 225
  }],
  post: [{
    year: 2021,
    wind: 135,
    storage: 27,
    solar: 73
  }, {
    year: 2025,
    wind: 136,
    storage: 34,
    solar: 142
  }, {
    year: 2027,
    wind: 208,
    storage: 37,
    solar: 240
  }, {
    year: 2030,
    wind: 389,
    storage: 46,
    solar: 445
  }, {
    year: 2032,
    wind: 553,
    storage: 75,
    solar: 617
  }]
};
const config = {
  templates: {
    area: {
      xField: 'year',
      hoverEffect: 'none'
    },
    xAxis: {
      label: {
        numberSymbols: ''
      },
      tick: {
        visible: true,
        steps: data.pre.map(r => r.year)
      },
      line: false
    },
    yAxis: {
      strictMin: 0,
      strictMax: 1300,
      tick: {
        stepInterval: 100
      },
      grid: {
        firstVisible: false
      },
      label: {
        lastText: ''
        // step: 2,
      }
    },

    annTitle: {
      style: {
        fontSize: '2rem',
        fontWeight: '700'
      }
    },
    ann: {
      align: 'center',
      verticalAlign: 'middle',
      style: {
        fontSize: '2rem',
        fontWeight: '700'
      }
    },
    annLegend: {
      x1: 2032,
      front: true,
      offsetX: '-1w',
      offsetY: '-0.9h'
    }
  },
  title: '<b>Projections of US Installed solar and wind capacity,</b> gigawatts',
  split: {
    visible: true,
    cols: 2,
    // gap: 100,
    panes: [{
      body: {
        annotations: [{
          text: 'Pre-IRA',
          template: 'annTitle'
        }, {
          text: '+6%',
          template: 'ann'
        }, {
          text: 'Wind',
          template: 'annLegend',
          y1: 165,
          offsetY: '0.2h'
        }, {
          text: 'Storage',
          template: 'annLegend',
          y1: 219
        }, {
          text: 'Solar',
          template: 'annLegend',
          y1: 444
        }]
      }
    }, {
      col: 1,
      body: {
        annotations: [{
          text: 'Post-IRA',
          template: 'annTitle'
        }, {
          text: '+16%',
          template: 'ann'
        }, {
          text: 'Wind',
          template: 'annLegend',
          y1: 553,
          offsetY: '0.2h'
        }, {
          text: 'Storage',
          template: 'annLegend',
          y1: 628
        }, {
          text: 'Solar',
          template: 'annLegend',
          y1: 1245
        }]
      }
    }
    // { title: 'Before Inflation Reduction Act' },
    // { title: 'After Inflation Reduction Act' },
    ]
  },

  legend: false,
  xAxis: [{
    type: 'linear',
    template: 'xAxis'
  }, {
    col: 1,
    type: 'linear',
    template: 'xAxis'
  }],
  yAxis: [{
    template: 'yAxis'
  }, {
    template: 'yAxis',
    col: 1,
    position: 'opposite'
  }],
  series: ['pre', 'post'].map((k, i) => {
    return {
      type: 'areagroup',
      layout: 'stack',
      xAxis: i,
      yAxis: i,
      children: [{
        template: 'area',
        yField: 'wind',
        data: data[k]
      }, {
        template: 'area',
        yField: 'storage',
        data: data[k]
      }, {
        template: 'area',
        yField: 'solar',
        data: data[k]
      }]
    };
  }),
  options: {
    pointHovering: false,
    credits: {
      align: 'left',
      text: 'Source: Inflation Reduction Act of 2022; Mckinsey Power Solutions',
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