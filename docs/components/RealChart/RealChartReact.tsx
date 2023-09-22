import dynamic from 'next/dynamic';

export const RealChartReact = dynamic(
  () => import('./RealChart').then(({RealChartReact}) => ({default: RealChartReact})),
  { ssr: false }
)
