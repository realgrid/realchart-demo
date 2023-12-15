export const config = {
  options: { credits: false },
  annotations: {
    text: 'IN 1952',
    offsetX: 180,
    offsetY: 24,
    scope: 'container',
    align: 'center',
    style: { fontWeight: 'bold' }
  },
  title: {
    text: 'Gapminder Global Indicators',
    style: { fontWeight: 'bold' }
  },
  xAxis: {
    title: { text: 'GDP per Capita', style: { fontWeight: 'bold' } },
    grid: true,
    line: false
  },
  yAxis: {
    title: { text: 'Life Expectancy', style: { fontWeight: 'bold' } },
    strictMin: 20,
    tick: { stepInterval: 10 },
    grid: { visible: true, startVisible: false, endVisible: false }
  },
  legend: { location: 'right', verticalAlign: 'top' },
  series: [
    {
      name: 'Asia',
      type: 'bubble',
      tooltipText: 'country: ${country}<br>gdpPercap: ${x}<br>lifeExp: ${y}<br>pop: ${z}',
      sizeMode: 'width',
      shape: 'rectangle',
      radius: 0.1,
      data: [
        {
          x: 779.4453145,
          y: 28.801,
          z: 8425333,
          country: 'Afghanistan'
        },
        { x: 9867.084765, y: 50.939, z: 120447, country: 'Bahrain' },
        {
          x: 684.2441716,
          y: 37.484,
          z: 46886859,
          country: 'Bangladesh'
        },
        { x: 368.4692856, y: 39.417, z: 4693836, country: 'Cambodia' },
        { x: 400.448611, y: 44, z: 556263527, country: 'China' },
        {
          x: 3054.421209,
          y: 60.96,
          z: 2125900,
          country: 'Hong Kong, China'
        },
        { x: 546.5657493, y: 37.373, z: 372000000, country: 'India' },
        {
          x: 749.6816546,
          y: 37.468,
          z: 82052000,
          country: 'Indonesia'
        },
        { x: 3035.326002, y: 44.869, z: 17272000, country: 'Iran' },
        { x: 4129.766056, y: 45.32, z: 5441766, country: 'Iraq' },
        { x: 4086.522128, y: 65.39, z: 1620914, country: 'Israel' },
        { x: 3216.956347, y: 63.03, z: 86459025, country: 'Japan' },
        { x: 1546.907807, y: 43.158, z: 607914, country: 'Jordan' },
        {
          x: 1088.277758,
          y: 50.056,
          z: 8865488,
          country: 'Korea, Dem. Rep.'
        },
        {
          x: 1030.592226,
          y: 47.453,
          z: 20947571,
          country: 'Korea, Rep.'
        },
        undefined,
        { x: 4834.804067, y: 55.928, z: 1439529, country: 'Lebanon' },
        { x: 1831.132894, y: 48.463, z: 6748378, country: 'Malaysia' },
        { x: 786.5668575, y: 42.244, z: 800663, country: 'Mongolia' },
        { x: 331, y: 36.319, z: 20092996, country: 'Myanmar' },
        { x: 545.8657229, y: 36.157, z: 9182536, country: 'Nepal' },
        { x: 1828.230307, y: 37.578, z: 507833, country: 'Oman' },
        { x: 684.5971438, y: 43.436, z: 41346560, country: 'Pakistan' },
        {
          x: 1272.880995,
          y: 47.752,
          z: 22438691,
          country: 'Philippines'
        },
        {
          x: 6459.554823,
          y: 39.875,
          z: 4005677,
          country: 'Saudi Arabia'
        },
        { x: 2315.138227, y: 60.396, z: 1127000, country: 'Singapore' },
        { x: 1083.53203, y: 57.593, z: 7982342, country: 'Sri Lanka' },
        { x: 1643.485354, y: 45.883, z: 3661549, country: 'Syria' },
        { x: 1206.947913, y: 58.5, z: 8550362, country: 'Taiwan' },
        { x: 757.7974177, y: 50.848, z: 21289402, country: 'Thailand' },
        { x: 605.0664917, y: 40.412, z: 26246839, country: 'Vietnam' },
        {
          x: 1515.592329,
          y: 43.16,
          z: 1030585,
          country: 'West Bank and Gaza'
        },
        {
          x: 781.7175761,
          y: 32.548,
          z: 4963829,
          country: 'Yemen, Rep.'
        }
      ]
    },
    {
      name: 'Europe',
      type: 'bubble',
      tooltipText: 'country: ${country}<br>gdpPercap: ${x}<br>lifeExp: ${y}<br>pop: ${z}',
      sizeMode: 'width',
      shape: 'rectangle',
      radius: 0.1,
      data: [
        { x: 1601.056136, y: 55.23, z: 1282697, country: 'Albania' },
        { x: 6137.076492, y: 66.8, z: 6927772, country: 'Austria' },
        { x: 8343.105127, y: 68, z: 8730405, country: 'Belgium' },
        {
          x: 973.5331948,
          y: 53.82,
          z: 2791000,
          country: 'Bosnia and Herzegovina'
        },
        { x: 2444.286648, y: 59.6, z: 7274900, country: 'Bulgaria' },
        { x: 3119.23652, y: 61.21, z: 3882229, country: 'Croatia' },
        {
          x: 6876.14025,
          y: 66.87,
          z: 9125183,
          country: 'Czech Republic'
        },
        { x: 9692.385245, y: 70.78, z: 4334000, country: 'Denmark' },
        { x: 6424.519071, y: 66.55, z: 4090500, country: 'Finland' },
        { x: 7029.809327, y: 67.41, z: 42459667, country: 'France' },
        { x: 7144.114393, y: 67.5, z: 69145952, country: 'Germany' },
        { x: 3530.690067, y: 65.86, z: 7733250, country: 'Greece' },
        { x: 5263.673816, y: 64.03, z: 9504000, country: 'Hungary' },
        { x: 7267.688428, y: 72.49, z: 147962, country: 'Iceland' },
        { x: 5210.280328, y: 66.91, z: 2952156, country: 'Ireland' },
        { x: 4931.404155, y: 65.94, z: 47666000, country: 'Italy' },
        { x: 2647.585601, y: 59.164, z: 413834, country: 'Montenegro' },
        {
          x: 8941.571858,
          y: 72.13,
          z: 10381988,
          country: 'Netherlands'
        },
        { x: 10095.42172, y: 72.67, z: 3327728, country: 'Norway' },
        { x: 4029.329699, y: 61.31, z: 25730551, country: 'Poland' },
        { x: 3068.319867, y: 59.82, z: 8526050, country: 'Portugal' },
        { x: 3144.613186, y: 61.05, z: 16630000, country: 'Romania' },
        { x: 3581.459448, y: 57.996, z: 6860147, country: 'Serbia' },
        {
          x: 5074.659104,
          y: 64.36,
          z: 3558137,
          country: 'Slovak Republic'
        },
        { x: 4215.041741, y: 65.57, z: 1489518, country: 'Slovenia' },
        { x: 3834.034742, y: 64.94, z: 28549870, country: 'Spain' },
        { x: 8527.844662, y: 71.86, z: 7124673, country: 'Sweden' },
        {
          x: 14734.23275,
          y: 69.62,
          z: 4815000,
          country: 'Switzerland'
        },
        { x: 1969.10098, y: 43.585, z: 22235677, country: 'Turkey' },
        {
          x: 9979.508487,
          y: 69.18,
          z: 50430000,
          country: 'United Kingdom'
        }
      ]
    },
    {
      name: 'Africa',
      type: 'bubble',
      tooltipText: 'country: ${country}<br>gdpPercap: ${x}<br>lifeExp: ${y}<br>pop: ${z}',
      sizeMode: 'width',
      shape: 'rectangle',
      radius: 0.1,
      data: [
        { x: 2449.008185, y: 43.077, z: 9279525, country: 'Algeria' },
        { x: 3520.610273, y: 30.015, z: 4232095, country: 'Angola' },
        { x: 1062.7522, y: 38.223, z: 1738315, country: 'Benin' },
        { x: 851.2411407, y: 47.622, z: 442308, country: 'Botswana' },
        {
          x: 543.2552413,
          y: 31.975,
          z: 4469979,
          country: 'Burkina Faso'
        },
        { x: 339.2964587, y: 39.031, z: 2445618, country: 'Burundi' },
        { x: 1206.947913, y: 38.523, z: 5009067, country: 'Cameroon' },
        {
          x: 1071.310713,
          y: 35.463,
          z: 1291695,
          country: 'Central African Republic'
        },
        { x: 1178.665927, y: 38.092, z: 2682462, country: 'Chad' },
        { x: 1102.990936, y: 40.715, z: 153936, country: 'Comoros' },
        {
          x: 780.5423257,
          y: 39.143,
          z: 14100005,
          country: 'Congo, Dem. Rep.'
        },
        {
          x: 2125.621418,
          y: 42.111,
          z: 854885,
          country: 'Congo, Rep.'
        },
        {
          x: 1388.594732,
          y: 40.477,
          z: 2977019,
          country: "Cote d'Ivoire"
        },
        { x: 2669.529475, y: 34.812, z: 63149, country: 'Djibouti' },
        { x: 1418.822445, y: 41.893, z: 22223309, country: 'Egypt' },
        {
          x: 375.6431231,
          y: 34.482,
          z: 216964,
          country: 'Equatorial Guinea'
        },
        { x: 328.9405571, y: 35.928, z: 1438760, country: 'Eritrea' },
        { x: 362.1462796, y: 34.078, z: 20860941, country: 'Ethiopia' },
        { x: 4293.476475, y: 37.003, z: 420702, country: 'Gabon' },
        { x: 485.2306591, y: 30, z: 284320, country: 'Gambia' },
        { x: 911.2989371, y: 43.149, z: 5581001, country: 'Ghana' },
        { x: 510.1964923, y: 33.609, z: 2664249, country: 'Guinea' },
        { x: 299.850319, y: 32.5, z: 580653, country: 'Guinea-Bissau' },
        { x: 853.540919, y: 42.27, z: 6464046, country: 'Kenya' },
        { x: 298.8462121, y: 42.138, z: 748747, country: 'Lesotho' },
        { x: 575.5729961, y: 38.48, z: 863308, country: 'Liberia' },
        { x: 2387.54806, y: 42.723, z: 1019729, country: 'Libya' },
        {
          x: 1443.011715,
          y: 36.681,
          z: 4762912,
          country: 'Madagascar'
        },
        { x: 369.1650802, y: 36.256, z: 2917802, country: 'Malawi' },
        { x: 452.3369807, y: 33.685, z: 3838168, country: 'Mali' },
        {
          x: 743.1159097,
          y: 40.543,
          z: 1022556,
          country: 'Mauritania'
        },
        { x: 1967.955707, y: 50.986, z: 516556, country: 'Mauritius' },
        { x: 1688.20357, y: 42.873, z: 9939217, country: 'Morocco' },
        {
          x: 468.5260381,
          y: 31.286,
          z: 6446316,
          country: 'Mozambique'
        },
        { x: 2423.780443, y: 41.725, z: 485831, country: 'Namibia' },
        { x: 761.879376, y: 37.444, z: 3379468, country: 'Niger' },
        { x: 1077.281856, y: 36.324, z: 33119096, country: 'Nigeria' },
        { x: 2718.885295, y: 52.724, z: 257700, country: 'Reunion' },
        { x: 493.3238752, y: 40, z: 2534927, country: 'Rwanda' },
        {
          x: 879.5835855,
          y: 46.471,
          z: 60011,
          country: 'Sao Tome and Principe'
        },
        { x: 1450.356983, y: 37.278, z: 2755589, country: 'Senegal' },
        {
          x: 879.7877358,
          y: 30.331,
          z: 2143249,
          country: 'Sierra Leone'
        },
        { x: 1135.749842, y: 32.978, z: 2526994, country: 'Somalia' },
        {
          x: 4725.295531,
          y: 45.009,
          z: 14264935,
          country: 'South Africa'
        },
        { x: 1615.991129, y: 38.635, z: 8504667, country: 'Sudan' },
        { x: 1148.376626, y: 41.407, z: 290243, country: 'Swaziland' },
        { x: 716.6500721, y: 41.215, z: 8322925, country: 'Tanzania' },
        { x: 859.8086567, y: 38.596, z: 1219113, country: 'Togo' },
        { x: 1468.475631, y: 44.6, z: 3647735, country: 'Tunisia' },
        { x: 734.753484, y: 39.978, z: 5824797, country: 'Uganda' },
        { x: 1147.388831, y: 42.038, z: 2672000, country: 'Zambia' },
        { x: 406.8841148, y: 48.451, z: 3080907, country: 'Zimbabwe' }
      ]
    },
    {
      name: 'Americas',
      type: 'bubble',
      tooltipText: 'country: ${country}<br>gdpPercap: ${x}<br>lifeExp: ${y}<br>pop: ${z}',
      sizeMode: 'width',
      shape: 'rectangle',
      radius: 0.1,
      data: [
        {
          x: 5911.315053,
          y: 62.485,
          z: 17876956,
          country: 'Argentina'
        },
        { x: 2677.326347, y: 40.414, z: 2883315, country: 'Bolivia' },
        { x: 2108.944355, y: 50.917, z: 56602560, country: 'Brazil' },
        { x: 11367.16112, y: 68.75, z: 14785584, country: 'Canada' },
        { x: 3939.978789, y: 54.745, z: 6377619, country: 'Chile' },
        { x: 2144.115096, y: 50.643, z: 12350771, country: 'Colombia' },
        { x: 2627.009471, y: 57.206, z: 926317, country: 'Costa Rica' },
        { x: 5586.53878, y: 59.421, z: 6007797, country: 'Cuba' },
        {
          x: 1397.717137,
          y: 45.928,
          z: 2491346,
          country: 'Dominican Republic'
        },
        { x: 3522.110717, y: 48.357, z: 3548753, country: 'Ecuador' },
        { x: 3048.3029, y: 45.262, z: 2042865, country: 'El Salvador' },
        { x: 2428.237769, y: 42.023, z: 3146381, country: 'Guatemala' },
        { x: 1840.366939, y: 37.579, z: 3201488, country: 'Haiti' },
        { x: 2194.926204, y: 41.912, z: 1517453, country: 'Honduras' },
        { x: 2898.530881, y: 58.53, z: 1426095, country: 'Jamaica' },
        { x: 3478.125529, y: 50.789, z: 30144317, country: 'Mexico' },
        { x: 3112.363948, y: 42.314, z: 1165790, country: 'Nicaragua' },
        { x: 2480.380334, y: 55.191, z: 940080, country: 'Panama' },
        { x: 1952.308701, y: 62.649, z: 1555876, country: 'Paraguay' },
        { x: 3758.523437, y: 43.902, z: 8025700, country: 'Peru' },
        {
          x: 3081.959785,
          y: 64.28,
          z: 2227000,
          country: 'Puerto Rico'
        },
        {
          x: 3023.271928,
          y: 59.1,
          z: 662850,
          country: 'Trinidad and Tobago'
        },
        {
          x: 13990.48208,
          y: 68.44,
          z: 157553000,
          country: 'United States'
        },
        { x: 5716.766744, y: 66.071, z: 2252965, country: 'Uruguay' },
        { x: 7689.799761, y: 55.088, z: 5439568, country: 'Venezuela' }
      ]
    },
    {
      name: 'Oceania',
      type: 'bubble',
      tooltipText: 'country: ${country}<br>gdpPercap: ${x}<br>lifeExp: ${y}<br>pop: ${z}',
      sizeMode: 'width',
      shape: 'rectangle',
      radius: 0.1,
      data: [
        { x: 10039.59564, y: 69.12, z: 8691212, country: 'Australia' },
        {
          x: 10556.57566,
          y: 69.39,
          z: 1994794,
          country: 'New Zealand'
        }
      ]
    }
  ]
}
