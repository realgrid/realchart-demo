# RealChart

RealChart is a JavaScript charting library.

## Install

```
npm i realchart
```

### License

> The License file is required for proper use. More information, visit: http://service.realgrid.com/start

## Usage

```ts
const chart = RealChart.createChart(document, 'realchart', config);
```

```ts
// config
const config = {
  options: {},
  title: 'Axis Breaks',
  xAxis: {
    title: '일일 Daily fat',
    categories: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    grid: true,
  },
  yAxis: {
    title: 'Vertical 수직축 Axis',
    break: [
      {
        from: 500,
        to: 3000,
        inclusive: false,
        space: 5,
      },
    ],
  },
  series: [
    {
      name: 'column1',
      pointLabel: true,
      data: [499, 128, 180, 345, 3050, 3590, 3840, 3630, 3120, 520, 240, 80],
    },
    {
      name: 'column3',
      pointLabel: true,
      data: [64, 138, 164, 408, 3120, 3540, 3875, 3420, 720, 320, 160, 20],
    },
  ],
};
const chart = RealChart.createChart(document, 'realchart', config);
```

### styles

- The themes are located in './dist'

```ts
import 'realchart/dist/realchart-style.css';
```

### Library Target

- index.esm.js for ES
- index.js for umd

## Exmaple

### fiddle url

`https://jsfiddle.net/gh/get/library/pure/realgrid/realchart-demo/tree/master/`

## Asking Questions

> support@realgrid.com
