import { ChartControl, Chart } from 'realchart';
import { useEffect, useRef } from 'react';
import 'node_modules/realchart/dist/realchart-style.css';
import { Box } from '@mantine/core';

/**
 * DOM API 사용 문제
 * - Chart 등 DOM api를 사용하는 모듈의 경우 SSR 등에서 로딩시 DOM 을 찾지 못하는 오류 발생
 * - React.lazy 를 써서 DOM이 렌더링 될때 컴포넌트를 호출 해야 한다.
 * - nextjs에서는 dynamic(..., { ssr: false }) 로 호출 해야 한다.
 * - ts에서는 ComponentType<{}>에 맞춰주기 위해 import(..).then(({Type}) => ({default: Type})) 으로 처리
 */

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
          effect: 'outline',// 'background',
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
      style: {
      }
  }
}

export function RealChartReact() {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;
    document.getElementById('realchart').innerHTML = '';
    const chart = new ChartControl(document, chartRef.current);
    chart.model = new Chart(config);

  }, [chartRef])
  
  return (
    <div style={{ border: '2px solid black' }}>
      <div id="realchart" ref={chartRef} style={{ width: '100%', height: '500px' }}/>
    </div>
  );
}
