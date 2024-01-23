export const config = {
  type: 'line',
  options: {},
  title: 'Legend Rows',
  legend: {},
  xAxis: { title: '일일 Daily fat' },
  yAxis: { title: 'Vertical 수직축 Axis' },
  series: [
    {
      name: 'Installation & Developers',
      marker: {},
      data: [
         60934,  61656,  75165,
         81827, 112143, 142383,
        171533, 165174, 155157,
        161454, 154610
      ]
    },
    {
      name: 'Manufacturing',
      marker: { radius: 7 },
      data: [
        44916, 47941, 39742,
        39851, 42490, 40282,
        48121, 46885, 43726,
        44243, 41050
      ]
    },
    {
      name: 'Sales & Distribution',
      marker: {},
      data: [
        11744, 30000, 16005,
        19771, 20185, 24377,
        32147, 30912, 29243,
        29213, 25663
      ]
    },
    {
      name: 'Operations & Maintenance',
      marker: {},
      data: [
        null, null,  null,
        null, null,  null,
        null, null,  9164,
        9218, 10077
      ]
    },
    {
      name: 'Other',
      marker: {},
      data: [
        21908,  5548,  8105,
        11248,  8989, 11816,
        18274, 17300, 15053,
        14906, 13073
      ]
    },
    {
      name: 'Developers & Operations',
      marker: {},
      data: [
         31908,  15548, 18105,
         31248,  48989, 51816,
         48274,  87300, 95053,
        114906, 123073
      ]
    },
    {
      name: 'Distribution & Sales',
      marker: {},
      data: [
        41908, 25548, 28105,
        51248, 58989, 31816,
        38274, 37300, 35053,
        34906, 33073
      ]
    }
  ]
}
export const tool = false