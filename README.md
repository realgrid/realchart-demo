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

... 

```

```ts
// config
const config = {
    options: {
        animatable: false
    },
    title: "Basic Real-Chart",
    legend: true,
    xAxis: {
        title: 'X Axis',
        grid: true
    },
    yAxis: {
        title: 'Y Axis',
    },
    series: {
        pointLabel: {
            visible: true,
            effect: 'outline',
            style: {
            },
        },
        data: [
            ['home', 7], 
            ['sky', 11], 
            ['def', 9], 
            ['소홍', 10], 
            ['지리산', 14.3], 
            ['zzz', 13],
            ['낙동강', 12.5]
        ],
        data2: [
            [1, 7], 
            [2, 11], 
            [3, 9], 
            [4, 10], 
            [5, 14.3], 
            [6, 13],
            [7, 12.5]
        ],
    }
}
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


## Asking Questions

> support@realgrid.com