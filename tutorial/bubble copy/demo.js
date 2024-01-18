const data = [{
  country: 'Afghanistan',
  continent: 'Asia',
  year: 1952,
  lifeExp: 28.801,
  pop: 8425333,
  gdpPercap: 779.4453145
}, {
  country: 'Bahrain',
  continent: 'Asia',
  year: 1952,
  lifeExp: 50.939,
  pop: 120447,
  gdpPercap: 9867.084765
}, {
  country: 'Bangladesh',
  continent: 'Asia',
  year: 1952,
  lifeExp: 37.484,
  pop: 46886859,
  gdpPercap: 684.2441716
}, {
  country: 'Cambodia',
  continent: 'Asia',
  year: 1952,
  lifeExp: 39.417,
  pop: 4693836,
  gdpPercap: 368.4692856
}, {
  country: 'China',
  continent: 'Asia',
  year: 1952,
  lifeExp: 44,
  pop: 556263527,
  gdpPercap: 400.448611
}, {
  country: 'Hong Kong, China',
  continent: 'Asia',
  year: 1952,
  lifeExp: 60.96,
  pop: 2125900,
  gdpPercap: 3054.421209
}, {
  country: 'India',
  continent: 'Asia',
  year: 1952,
  lifeExp: 37.373,
  pop: 372000000,
  gdpPercap: 546.5657493
}, {
  country: 'Indonesia',
  continent: 'Asia',
  year: 1952,
  lifeExp: 37.468,
  pop: 82052000,
  gdpPercap: 749.6816546
}, {
  country: 'Iran',
  continent: 'Asia',
  year: 1952,
  lifeExp: 44.869,
  pop: 17272000,
  gdpPercap: 3035.326002
}, {
  country: 'Iraq',
  continent: 'Asia',
  year: 1952,
  lifeExp: 45.32,
  pop: 5441766,
  gdpPercap: 4129.766056
}, {
  country: 'Israel',
  continent: 'Asia',
  year: 1952,
  lifeExp: 65.39,
  pop: 1620914,
  gdpPercap: 4086.522128
}, {
  country: 'Japan',
  continent: 'Asia',
  year: 1952,
  lifeExp: 63.03,
  pop: 86459025,
  gdpPercap: 3216.956347
}, {
  country: 'Jordan',
  continent: 'Asia',
  year: 1952,
  lifeExp: 43.158,
  pop: 607914,
  gdpPercap: 1546.907807
}, {
  country: 'Korea, Dem. Rep.',
  continent: 'Asia',
  year: 1952,
  lifeExp: 50.056,
  pop: 8865488,
  gdpPercap: 1088.277758
}, {
  country: 'Korea, Rep.',
  continent: 'Asia',
  year: 1952,
  lifeExp: 47.453,
  pop: 20947571,
  gdpPercap: 1030.592226
}, {
  country: 'Lebanon',
  continent: 'Asia',
  year: 1952,
  lifeExp: 55.928,
  pop: 1439529,
  gdpPercap: 4834.804067
}, {
  country: 'Malaysia',
  continent: 'Asia',
  year: 1952,
  lifeExp: 48.463,
  pop: 6748378,
  gdpPercap: 1831.132894
}, {
  country: 'Mongolia',
  continent: 'Asia',
  year: 1952,
  lifeExp: 42.244,
  pop: 800663,
  gdpPercap: 786.5668575
}, {
  country: 'Myanmar',
  continent: 'Asia',
  year: 1952,
  lifeExp: 36.319,
  pop: 20092996,
  gdpPercap: 331
}, {
  country: 'Nepal',
  continent: 'Asia',
  year: 1952,
  lifeExp: 36.157,
  pop: 9182536,
  gdpPercap: 545.8657229
}, {
  country: 'Oman',
  continent: 'Asia',
  year: 1952,
  lifeExp: 37.578,
  pop: 507833,
  gdpPercap: 1828.230307
}, {
  country: 'Pakistan',
  continent: 'Asia',
  year: 1952,
  lifeExp: 43.436,
  pop: 41346560,
  gdpPercap: 684.5971438
}, {
  country: 'Philippines',
  continent: 'Asia',
  year: 1952,
  lifeExp: 47.752,
  pop: 22438691,
  gdpPercap: 1272.880995
}, {
  country: 'Saudi Arabia',
  continent: 'Asia',
  year: 1952,
  lifeExp: 39.875,
  pop: 4005677,
  gdpPercap: 6459.554823
}, {
  country: 'Singapore',
  continent: 'Asia',
  year: 1952,
  lifeExp: 60.396,
  pop: 1127000,
  gdpPercap: 2315.138227
}, {
  country: 'Sri Lanka',
  continent: 'Asia',
  year: 1952,
  lifeExp: 57.593,
  pop: 7982342,
  gdpPercap: 1083.53203
}, {
  country: 'Syria',
  continent: 'Asia',
  year: 1952,
  lifeExp: 45.883,
  pop: 3661549,
  gdpPercap: 1643.485354
}, {
  country: 'Taiwan',
  continent: 'Asia',
  year: 1952,
  lifeExp: 58.5,
  pop: 8550362,
  gdpPercap: 1206.947913
}, {
  country: 'Thailand',
  continent: 'Asia',
  year: 1952,
  lifeExp: 50.848,
  pop: 21289402,
  gdpPercap: 757.7974177
}, {
  country: 'Vietnam',
  continent: 'Asia',
  year: 1952,
  lifeExp: 40.412,
  pop: 26246839,
  gdpPercap: 605.0664917
}, {
  country: 'West Bank and Gaza',
  continent: 'Asia',
  year: 1952,
  lifeExp: 43.16,
  pop: 1030585,
  gdpPercap: 1515.592329
}, {
  country: 'Yemen, Rep.',
  continent: 'Asia',
  year: 1952,
  lifeExp: 32.548,
  pop: 4963829,
  gdpPercap: 781.7175761
}];
const config = {
  title: {
    text: 'Gapminder Global Indicators IN 1952',
    style: {
      fontWeight: 'bold'
    }
  },
  xAxis: {
    title: {
      text: 'GDP per Capita',
      style: {
        fontWeight: 'bold'
      }
    },
    grid: true,
    line: false
  },
  yAxis: {
    title: {
      text: 'Life Expectancy',
      style: {
        fontWeight: 'bold'
      }
    },
    tick: {
      stepInterval: 10
    },
    grid: {
      visible: true,
      firstVisible: false,
      lastVisible: false
    }
  },
  legend: {
    location: 'right',
    verticalAlign: 'top'
  },
  series: {
    colorByPoint: true,
    type: 'bubble',
    tooltipText: 'country: ${country}<br>gdpPercap: ${x}<br>lifeExp: ${y}<br>pop: ${z}',
    xField: 'gdpPercap',
    yField: 'lifeExp',
    zField: 'pop',
    data
  }
};
let animate = false;
let chart;
function init() {
  console.log('RealChart v' + RealChart.getVersion());
  // RealChart.setDebugging(true);
  // config.series = createSeries(1952);
  chart = RealChart.createChart(document, 'realchart', config);
}