const config = {
  type: 'area',
  templates: {
    xAxis: {
      line: true,
      grid: {
        firstVisible: true,
        lastVisible: true
      }
    },
    yAxis: {
      strictMax: 0.5,
      label: false,
      grid: false
    },
    series: {
      xField: 'Age',
      yField: 'Ratio',
      lineType: 'spline',
      noClip: true,
      marker: false,
      pointLabel: false,
      style: {
        strokeWidth: 3
      }
    }
  },
  title: {
    text: '2023 East Asia Population',
    gap: 50
  },
  split: {
    visible: true,
    rows: 6
  },
  legend: false,
  xAxis: [{
    type: 'category',
    template: 'xAxis',
    label: true,
    row: 0
  }, {
    type: 'category',
    template: 'xAxis',
    label: false,
    row: 1
  }, {
    type: 'category',
    template: 'xAxis',
    label: false,
    row: 2
  }, {
    type: 'category',
    template: 'xAxis',
    label: false,
    row: 3
  }, {
    type: 'category',
    template: 'xAxis',
    label: false,
    row: 4
  }, {
    type: 'category',
    template: 'xAxis',
    label: false,
    row: 5
  }],
  yAxis: [{
    template: 'yAxis',
    title: {
      text: 'Korea',
      rotation: false,
      style: {
        fontSize: '12pt'
      }
    },
    row: 0
  }, {
    template: 'yAxis',
    title: {
      text: 'China',
      rotation: false,
      style: {
        fontSize: '12pt'
      }
    },
    row: 1
  }, {
    template: 'yAxis',
    title: {
      text: 'Japan',
      rotation: false,
      style: {
        fontSize: '12pt'
      }
    },
    row: 2
  }, {
    template: 'yAxis',
    title: {
      text: 'Thailand',
      rotation: false,
      style: {
        fontSize: '12pt'
      }
    },
    row: 3
  }, {
    template: 'yAxis',
    title: {
      text: 'HongKong',
      rotation: false,
      style: {
        fontSize: '12pt'
      }
    },
    row: 4
  }, {
    template: 'yAxis',
    title: {
      text: 'Mongolia',
      rotation: false,
      style: {
        fontSize: '12pt'
      }
    },
    row: 5
  }],
  series: [{
    template: 'series',
    xAxis: 0,
    yAxis: 0,
    data: [{
      Country: 'Korea, Rep.',
      Age: '0-4',
      Ratio: 0.3330120746752555
    }, {
      Country: 'Korea, Rep.',
      Age: '5-9',
      Ratio: 0.4537525470981865
    }, {
      Country: 'Korea, Rep.',
      Age: '10-14',
      Ratio: 0.5124917433085754
    }, {
      Country: 'Korea, Rep.',
      Age: '15-19',
      Ratio: 0.5101001344621123
    }, {
      Country: 'Korea, Rep.',
      Age: '20-24',
      Ratio: 0.648192611648972
    }, {
      Country: 'Korea, Rep.',
      Age: '25-29',
      Ratio: 0.7950427329340216
    }, {
      Country: 'Korea, Rep.',
      Age: '30-34',
      Ratio: 0.7815063569514893
    }, {
      Country: 'Korea, Rep.',
      Age: '35-39',
      Ratio: 0.7548153472969078
    }, {
      Country: 'Korea, Rep.',
      Age: '40-44',
      Ratio: 0.9088553225801025
    }, {
      Country: 'Korea, Rep.',
      Age: '45-49',
      Ratio: 0.879792890217685
    }, {
      Country: 'Korea, Rep.',
      Age: '50-54',
      Ratio: 1
    }, {
      Country: 'Korea, Rep.',
      Age: '55-59',
      Ratio: 0.9211426251624704
    }, {
      Country: 'Korea, Rep.',
      Age: '60-64',
      Ratio: 0.9402609170562778
    }, {
      Country: 'Korea, Rep.',
      Age: '65-69',
      Ratio: 0.7332401780417427
    }, {
      Country: 'Korea, Rep.',
      Age: '70-74',
      Ratio: 0.4980200762363169
    }, {
      Country: 'Korea, Rep.',
      Age: '75-79',
      Ratio: 0.36536103469660797
    }, {
      Country: 'Korea, Rep.',
      Age: '80-',
      Ratio: 0.528710184243373
    }],
    areaStyle: {
      stroke: 'none'
    },
    style: {
      fill: '#ffd938bb',
      stroke: '#ffd938bb'
    }
  }, {
    template: 'series',
    xAxis: 1,
    yAxis: 1,
    data: [{
      Country: 'China',
      Age: '0-4',
      Ratio: 0.4996439298643902
    }, {
      Country: 'China',
      Age: '5-9',
      Ratio: 0.7249525250820975
    }, {
      Country: 'China',
      Age: '10-14',
      Ratio: 0.7311805880658407
    }, {
      Country: 'China',
      Age: '15-19',
      Ratio: 0.6689256033974931
    }, {
      Country: 'China',
      Age: '20-24',
      Ratio: 0.6491091241220903
    }, {
      Country: 'China',
      Age: '25-29',
      Ratio: 0.7046728485056358
    }, {
      Country: 'China',
      Age: '30-34',
      Ratio: 0.9194970500464319
    }, {
      Country: 'China',
      Age: '35-39',
      Ratio: 0.9301490284672599
    }, {
      Country: 'China',
      Age: '40-44',
      Ratio: 0.814525151474825
    }, {
      Country: 'China',
      Age: '45-49',
      Ratio: 0.803830084549185
    }, {
      Country: 'China',
      Age: '50-54',
      Ratio: 1
    }, {
      Country: 'China',
      Age: '55-59',
      Ratio: 0.93116070893413
    }, {
      Country: 'China',
      Age: '60-64',
      Ratio: 0.6101975803502424
    }, {
      Country: 'China',
      Age: '65-69',
      Ratio: 0.6215802563091076
    }, {
      Country: 'China',
      Age: '70-74',
      Ratio: 0.47830143925837737
    }, {
      Country: 'China',
      Age: '75-79',
      Ratio: 0.2743400461626246
    }, {
      Country: 'China',
      Age: '80-',
      Ratio: 0.2878226059954115
    }],
    areaStyle: {
      stroke: 'none'
    },
    style: {
      fill: '#ffd938bb',
      stroke: '#ffd938bb'
    }
  }, {
    template: 'series',
    xAxis: 2,
    yAxis: 2,
    data: [{
      Country: 'Japan',
      Age: '0-4',
      Ratio: 0.30943830664313166
    }, {
      Country: 'Japan',
      Age: '5-9',
      Ratio: 0.3580534386687205
    }, {
      Country: 'Japan',
      Age: '10-14',
      Ratio: 0.3927352055677276
    }, {
      Country: 'Japan',
      Age: '15-19',
      Ratio: 0.41132385139458133
    }, {
      Country: 'Japan',
      Age: '20-24',
      Ratio: 0.44603742640565286
    }, {
      Country: 'Japan',
      Age: '25-29',
      Ratio: 0.4589209751980705
    }, {
      Country: 'Japan',
      Age: '30-34',
      Ratio: 0.4659849028890164
    }, {
      Country: 'Japan',
      Age: '35-39',
      Ratio: 0.5115301061922739
    }, {
      Country: 'Japan',
      Age: '40-44',
      Ratio: 0.5648876196362178
    }, {
      Country: 'Japan',
      Age: '45-49',
      Ratio: 0.6824116821385634
    }, {
      Country: 'Japan',
      Age: '50-54',
      Ratio: 0.6985615821771122
    }, {
      Country: 'Japan',
      Age: '55-59',
      Ratio: 0.6092840150042135
    }, {
      Country: 'Japan',
      Age: '60-64',
      Ratio: 0.5556413433219723
    }, {
      Country: 'Japan',
      Age: '65-69',
      Ratio: 0.5444329226742566
    }, {
      Country: 'Japan',
      Age: '70-74',
      Ratio: 0.6656557929743758
    }, {
      Country: 'Japan',
      Age: '75-79',
      Ratio: 0.5694757168474563
    }, {
      Country: 'Japan',
      Age: '80-',
      Ratio: 1
    }],
    areaStyle: {
      stroke: 'none'
    },
    style: {
      fill: '#ffd938bb',
      stroke: '#ffd938bb'
    }
  }, {
    template: 'series',
    xAxis: 3,
    yAxis: 3,
    data: [{
      Country: 'Thailand',
      Age: '0-4',
      Ratio: 0.6101144211820221
    }, {
      Country: 'Thailand',
      Age: '5-9',
      Ratio: 0.6899115214555046
    }, {
      Country: 'Thailand',
      Age: '10-14',
      Ratio: 0.7625410954962638
    }, {
      Country: 'Thailand',
      Age: '15-19',
      Ratio: 0.7709582078259976
    }, {
      Country: 'Thailand',
      Age: '20-24',
      Ratio: 0.8312239925058795
    }, {
      Country: 'Thailand',
      Age: '25-29',
      Ratio: 0.9553858330558257
    }, {
      Country: 'Thailand',
      Age: '30-34',
      Ratio: 0.9524840311273916
    }, {
      Country: 'Thailand',
      Age: '35-39',
      Ratio: 0.9559980793014544
    }, {
      Country: 'Thailand',
      Age: '40-44',
      Ratio: 0.9835601034309374
    }, {
      Country: 'Thailand',
      Age: '45-49',
      Ratio: 0.9417573636997408
    }, {
      Country: 'Thailand',
      Age: '50-54',
      Ratio: 0.997865534121172
    }, {
      Country: 'Thailand',
      Age: '55-59',
      Ratio: 1
    }, {
      Country: 'Thailand',
      Age: '60-64',
      Ratio: 0.9333755333570434
    }, {
      Country: 'Thailand',
      Age: '65-69',
      Ratio: 0.7615633882405326
    }, {
      Country: 'Thailand',
      Age: '70-74',
      Ratio: 0.5549111299575201
    }, {
      Country: 'Thailand',
      Age: '75-79',
      Ratio: 0.3578123658647719
    }, {
      Country: 'Thailand',
      Age: '80-',
      Ratio: 0.4875538545570837
    }],
    areaStyle: {
      stroke: 'none'
    },
    style: {
      fill: '#ffd938bb',
      stroke: '#ffd938bb'
    }
  }, {
    template: 'series',
    xAxis: 4,
    yAxis: 4,
    data: [{
      Country: 'Hong Kong SAR, China',
      Age: '0-4',
      Ratio: 0.4056293781753688
    }, {
      Country: 'Hong Kong SAR, China',
      Age: '5-9',
      Ratio: 0.5225218939193563
    }, {
      Country: 'Hong Kong SAR, China',
      Age: '10-14',
      Ratio: 0.4874380747305957
    }, {
      Country: 'Hong Kong SAR, China',
      Age: '15-19',
      Ratio: 0.4325414146790271
    }, {
      Country: 'Hong Kong SAR, China',
      Age: '20-24',
      Ratio: 0.4829724778383396
    }, {
      Country: 'Hong Kong SAR, China',
      Age: '25-29',
      Ratio: 0.6860354359392925
    }, {
      Country: 'Hong Kong SAR, China',
      Age: '30-34',
      Ratio: 0.7977013210183248
    }, {
      Country: 'Hong Kong SAR, China',
      Age: '35-39',
      Ratio: 0.8865962318280876
    }, {
      Country: 'Hong Kong SAR, China',
      Age: '40-44',
      Ratio: 0.9368682730050449
    }, {
      Country: 'Hong Kong SAR, China',
      Age: '45-49',
      Ratio: 0.890779483567999
    }, {
      Country: 'Hong Kong SAR, China',
      Age: '50-54',
      Ratio: 0.9066995312096867
    }, {
      Country: 'Hong Kong SAR, China',
      Age: '55-59',
      Ratio: 0.9422166041667005
    }, {
      Country: 'Hong Kong SAR, China',
      Age: '60-64',
      Ratio: 1
    }, {
      Country: 'Hong Kong SAR, China',
      Age: '65-69',
      Ratio: 0.8386868029604051
    }, {
      Country: 'Hong Kong SAR, China',
      Age: '70-74',
      Ratio: 0.6469144056066608
    }, {
      Country: 'Hong Kong SAR, China',
      Age: '75-79',
      Ratio: 0.41556013870611275
    }, {
      Country: 'Hong Kong SAR, China',
      Age: '80-',
      Ratio: 0.6481460146332677
    }],
    areaStyle: {
      stroke: 'none'
    },
    style: {
      fill: '#ffd938bb',
      stroke: '#ffd938bb'
    }
  }, {
    template: 'series',
    xAxis: 5,
    yAxis: 5,
    data: [{
      Country: 'Mongolia',
      Age: '0-4',
      Ratio: 0.900777689729046
    }, {
      Country: 'Mongolia',
      Age: '5-9',
      Ratio: 1
    }, {
      Country: 'Mongolia',
      Age: '10-14',
      Ratio: 0.8784294217198167
    }, {
      Country: 'Mongolia',
      Age: '15-19',
      Ratio: 0.6124075384157728
    }, {
      Country: 'Mongolia',
      Age: '20-24',
      Ratio: 0.5666685831848032
    }, {
      Country: 'Mongolia',
      Age: '25-29',
      Ratio: 0.5898317880364272
    }, {
      Country: 'Mongolia',
      Age: '30-34',
      Ratio: 0.7211341121063117
    }, {
      Country: 'Mongolia',
      Age: '35-39',
      Ratio: 0.6924513350215359
    }, {
      Country: 'Mongolia',
      Age: '40-44',
      Ratio: 0.5806874967190043
    }, {
      Country: 'Mongolia',
      Age: '45-49',
      Ratio: 0.5232069514612617
    }, {
      Country: 'Mongolia',
      Age: '50-54',
      Ratio: 0.44707785146651136
    }, {
      Country: 'Mongolia',
      Age: '55-59',
      Ratio: 0.3822953721086616
    }, {
      Country: 'Mongolia',
      Age: '60-64',
      Ratio: 0.30454139804165176
    }, {
      Country: 'Mongolia',
      Age: '65-69',
      Ratio: 0.1871379968052476
    }, {
      Country: 'Mongolia',
      Age: '70-74',
      Ratio: 0.10282203129257482
    }, {
      Country: 'Mongolia',
      Age: '75-79',
      Ratio: 0.060860283328042074
    }, {
      Country: 'Mongolia',
      Age: '80-',
      Ratio: 0.06688731623299195
    }],
    areaStyle: {
      stroke: 'none'
    },
    style: {
      fill: '#91cc39bb',
      stroke: '#91cc39bb'
    }
  }]
};
let chart;
function init() {
  console.log('RealChart v' + RealChart.getVersion());
  chart = RealChart.createChart(document, 'realchart', config);
}