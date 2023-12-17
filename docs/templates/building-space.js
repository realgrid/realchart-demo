export const config = {
  width: 600,
  height: 1200,
  templates: {
    yAxis: { grid: false, label: false, strictMax: 520000 },
    series: {
      pointLabel: { visible: true, position: 'auto', style: { fontSize: '9pt' } }
    },
    annotation: {
      style: { fontSize: '10pt', fontWeight: 600, fontFamily: 'monospace' }
    }
  },
  inverted: true,
  title: { text: 'Building Space', gap: 50 },
  options: {},
  legend: { visible: false, location: 'top' },
  split: {
    visible: true,
    rows: 2,
    panes: [
      {
        body: {
          annotations: [
            {
              template: 'annotation',
              offsetX: 44,
              offsetY: -50,
              text: 'Number of<br>Violations'
            },
            {
              template: 'annotation',
              offsetX: 144,
              offsetY: -50,
              text: 'Public<br>Space',
              style: { textAlign: 'right' }
            }
          ]
        }
      },
      {
        row: 1,
        body: {
          annotations: [
            {
              template: 'annotation',
              offsetX: 8,
              offsetY: -50,
              text: 'Bonus Floor<br>Space',
              style: { textAlign: 'left' }
            }
          ]
        }
      }
    ]
  },
  xAxis: [
    {
      type: 'category',
      width: 100,
      tick: { gap: -100 },
      label: {
        visible: true,
        step: 1,
        style: { fill: '#333', fontWeight: 500, fontFamily: 'monospace' }
      },
      reversed: true,
      line: false,
      grid: true
    }
  ],
  yAxis: [
    { template: 'yAxis', reversed: true },
    { template: 'yAxis', row: 1 }
  ],
  series: [
    {
      name: 'Public',
      template: 'series',
      pointLabel: { style: { fill: '#999' } },
      yField: 'Public',
      xField: 'Building',
      style: { fill: '#333', stroke: '#333' },
      data: [
        {
          Building: '55 Water Street<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">1</t>',
          Violations: 1,
          Public: 90000,
          'Bonus Floor': 480000
        },
        {
          Building: '1 New York Plaza<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">0</t>',
          Violations: 0,
          Public: 40000,
          'Bonus Floor': 330000
        },
        {
          Building: '1 Pennsylvania Plaza<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">6</t>',
          Violations: 6,
          Public: 50000,
          'Bonus Floor': 310000
        },
        {
          Building: '1 Liberty Plaza<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">1</t>',
          Violations: 1,
          Public: 30000,
          'Bonus Floor': 290000
        },
        {
          Building: '1345 Sixth Avenue<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">2</t>',
          Violations: 2,
          Public: 30000,
          'Bonus Floor': 270000
        },
        {
          Building: '388 Greenwich Street<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">1</t>',
          Violations: 1,
          Public: 50000,
          'Bonus Floor': 270000
        },
        {
          Building: '1251 Sixth Avenue<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">1</t>',
          Violations: 1,
          Public: 30000,
          'Bonus Floor': 260000
        },
        {
          Building: '1221 Sixth Avenue<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">1</t>',
          Violations: 1,
          Public: 30000,
          'Bonus Floor': 250000
        },
        {
          Building: '1211 Sixth Avenue<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">0</t>',
          Violations: 0,
          Public: 30000,
          'Bonus Floor': 230000
        },
        {
          Building: '245 Park Avenue<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">3</t>',
          Violations: 3,
          Public: 30000,
          'Bonus Floor': 220000
        },
        {
          Building: '345 Park Avenue<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">0</t>',
          Violations: 0,
          Public: 20000,
          'Bonus Floor': 210000
        },
        {
          Building: '1166 Sixth Avenue<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">0</t>',
          Violations: 0,
          Public: 30000,
          'Bonus Floor': 210000
        },
        {
          Building: '1301 Sixth Avenue<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">1</t>',
          Violations: 1,
          Public: 20000,
          'Bonus Floor': 200000
        },
        {
          Building: '1114 Sixth Avenue<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">0</t>',
          Violations: 0,
          Public: 20000,
          'Bonus Floor': 200000
        },
        {
          Building: '767 Fifth Avenue<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">1</t>',
          Violations: 1,
          Public: 20000,
          'Bonus Floor': 200000
        },
        {
          Building: '9 West 57th Street<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">3</t>',
          Violations: 3,
          Public: 30000,
          'Bonus Floor': 200000
        },
        {
          Building: '322 West 57th Street<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">1</t>',
          Violations: 1,
          Public: 30000,
          'Bonus Floor': 190000
        },
        {
          Building: '153 East 53rd Street<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">0</t>',
          Violations: 0,
          Public: 20000,
          'Bonus Floor': 190000
        },
        {
          Building: '919 Third Avenue<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">0</t>',
          Violations: 0,
          Public: 20000,
          'Bonus Floor': 190000
        },
        {
          Building: '350 Jay Street<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">1</t>',
          Violations: 1,
          Public: 30000,
          'Bonus Floor': 170000
        },
        {
          Building: '280 Park Avenue<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">1</t>',
          Violations: 1,
          Public: 20000,
          'Bonus Floor': 170000
        },
        {
          Building: '1886 Broadway<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">1</t>',
          Violations: 1,
          Public: 20000,
          'Bonus Floor': 170000
        },
        {
          Building: '85 Broad Street<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">3</t>',
          Violations: 3,
          Public: 30000,
          'Bonus Floor': 160000
        },
        {
          Building: '330 East 38th Street<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">1</t>',
          Violations: 1,
          Public: 30000,
          'Bonus Floor': 160000
        },
        {
          Building: '125 Broad Street<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">0</t>',
          Violations: 0,
          Public: 20000,
          'Bonus Floor': 160000
        },
        {
          Building: '140 Broadway<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">0</t>',
          Violations: 0,
          Public: 20000,
          'Bonus Floor': 160000
        },
        {
          Building: '101 Park Avenue<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">0</t>',
          Violations: 0,
          Public: 20000,
          'Bonus Floor': 160000
        },
        {
          Building: '299 Park Avenue<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">0</t>',
          Violations: 0,
          Public: 20000,
          'Bonus Floor': 150000
        },
        {
          Building: '1411 Broadway<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">0</t>',
          Violations: 0,
          Public: 20000,
          'Bonus Floor': 150000
        },
        {
          Building: '60 Wall Street<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">2</t>',
          Violations: 2,
          Public: 20000,
          'Bonus Floor': 150000
        },
        {
          Building: '1095 Sixth Avenue<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">0</t>',
          Violations: 0,
          Public: 20000,
          'Bonus Floor': 150000
        },
        {
          Building: '180 Maiden Lane<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">1</t>',
          Violations: 1,
          Public: 20000,
          'Bonus Floor': 140000
        },
        {
          Building: '425 East 58th Street<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">0</t>',
          Violations: 0,
          Public: 30000,
          'Bonus Floor': 140000
        },
        {
          Building: '622 Third Avenue<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">5</t>',
          Violations: 5,
          Public: 20000,
          'Bonus Floor': 140000
        },
        {
          Building: '17 Battery Place<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">2</t>',
          Violations: 2,
          Public: 20000,
          'Bonus Floor': 130000
        },
        {
          Building: '400 East 56th Street<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">1</t>',
          Violations: 1,
          Public: 20000,
          'Bonus Floor': 130000
        },
        {
          Building: '888 Seventh Avenue<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">1</t>',
          Violations: 1,
          Public: 10000,
          'Bonus Floor': 120000
        },
        {
          Building: '235 East 95th Street<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">1</t>',
          Violations: 1,
          Public: 20000,
          'Bonus Floor': 120000
        },
        {
          Building: '1 Battery Park Plaza<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">0</t>',
          Violations: 0,
          Public: 20000,
          'Bonus Floor': 120000
        },
        {
          Building: '45 Broadway<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">1</t>',
          Violations: 1,
          Public: 2000,
          'Bonus Floor': 110000
        },
        {
          Building: '375 Pearl Street<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">0</t>',
          Violations: 0,
          Public: 20000,
          'Bonus Floor': 110000
        },
        {
          Building: '1 Lincoln Plaza<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">2</t>',
          Violations: 2,
          Public: 20000,
          'Bonus Floor': 110000
        },
        {
          Building: '437 Madison Avenue<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">1</t>',
          Violations: 1,
          Public: 10000,
          'Bonus Floor': 110000
        },
        {
          Building: '457 Madison Avenue<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">1</t>',
          Violations: 1,
          Public: 6000,
          'Bonus Floor': 110000
        },
        {
          Building: '555 West 57th Street<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">2</t>',
          Violations: 2,
          Public: 20000,
          'Bonus Floor': 110000
        },
        {
          Building: '111 Wall Street<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">0</t>',
          Violations: 0,
          Public: 20000,
          'Bonus Floor': 110000
        },
        {
          Building: '32 Old Slip<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">1</t>',
          Violations: 1,
          Public: 20000,
          'Bonus Floor': 110000
        },
        {
          Building: '1285 Sixth Avenue<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">2</t>',
          Violations: 2,
          Public: 20000,
          'Bonus Floor': 110000
        },
        {
          Building: '343 Gold Street<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">2</t>',
          Violations: 2,
          Public: 20000,
          'Bonus Floor': 100000
        },
        {
          Building: '1 State Street<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">1</t>',
          Violations: 1,
          Public: 10000,
          'Bonus Floor': 100000
        }
      ]
    },
    {
      name: 'Bonus Floor',
      template: 'series',
      yAxis: 1,
      pointLabel: { position: 'inside', style: { fill: '#fff' } },
      yField: 'Bonus Floor',
      xField: 'Building',
      style: { fill: 'var(--color-8)', stroke: 'var(--color-8)' },
      data: [
        {
          Building: '55 Water Street<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">1</t>',
          Violations: 1,
          Public: 90000,
          'Bonus Floor': 480000
        },
        {
          Building: '1 New York Plaza<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">0</t>',
          Violations: 0,
          Public: 40000,
          'Bonus Floor': 330000
        },
        {
          Building: '1 Pennsylvania Plaza<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">6</t>',
          Violations: 6,
          Public: 50000,
          'Bonus Floor': 310000
        },
        {
          Building: '1 Liberty Plaza<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">1</t>',
          Violations: 1,
          Public: 30000,
          'Bonus Floor': 290000
        },
        {
          Building: '1345 Sixth Avenue<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">2</t>',
          Violations: 2,
          Public: 30000,
          'Bonus Floor': 270000
        },
        {
          Building: '388 Greenwich Street<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">1</t>',
          Violations: 1,
          Public: 50000,
          'Bonus Floor': 270000
        },
        {
          Building: '1251 Sixth Avenue<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">1</t>',
          Violations: 1,
          Public: 30000,
          'Bonus Floor': 260000
        },
        {
          Building: '1221 Sixth Avenue<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">1</t>',
          Violations: 1,
          Public: 30000,
          'Bonus Floor': 250000
        },
        {
          Building: '1211 Sixth Avenue<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">0</t>',
          Violations: 0,
          Public: 30000,
          'Bonus Floor': 230000
        },
        {
          Building: '245 Park Avenue<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">3</t>',
          Violations: 3,
          Public: 30000,
          'Bonus Floor': 220000
        },
        {
          Building: '345 Park Avenue<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">0</t>',
          Violations: 0,
          Public: 20000,
          'Bonus Floor': 210000
        },
        {
          Building: '1166 Sixth Avenue<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">0</t>',
          Violations: 0,
          Public: 30000,
          'Bonus Floor': 210000
        },
        {
          Building: '1301 Sixth Avenue<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">1</t>',
          Violations: 1,
          Public: 20000,
          'Bonus Floor': 200000
        },
        {
          Building: '1114 Sixth Avenue<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">0</t>',
          Violations: 0,
          Public: 20000,
          'Bonus Floor': 200000
        },
        {
          Building: '767 Fifth Avenue<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">1</t>',
          Violations: 1,
          Public: 20000,
          'Bonus Floor': 200000
        },
        {
          Building: '9 West 57th Street<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">3</t>',
          Violations: 3,
          Public: 30000,
          'Bonus Floor': 200000
        },
        {
          Building: '322 West 57th Street<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">1</t>',
          Violations: 1,
          Public: 30000,
          'Bonus Floor': 190000
        },
        {
          Building: '153 East 53rd Street<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">0</t>',
          Violations: 0,
          Public: 20000,
          'Bonus Floor': 190000
        },
        {
          Building: '919 Third Avenue<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">0</t>',
          Violations: 0,
          Public: 20000,
          'Bonus Floor': 190000
        },
        {
          Building: '350 Jay Street<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">1</t>',
          Violations: 1,
          Public: 30000,
          'Bonus Floor': 170000
        },
        {
          Building: '280 Park Avenue<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">1</t>',
          Violations: 1,
          Public: 20000,
          'Bonus Floor': 170000
        },
        {
          Building: '1886 Broadway<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">1</t>',
          Violations: 1,
          Public: 20000,
          'Bonus Floor': 170000
        },
        {
          Building: '85 Broad Street<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">3</t>',
          Violations: 3,
          Public: 30000,
          'Bonus Floor': 160000
        },
        {
          Building: '330 East 38th Street<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">1</t>',
          Violations: 1,
          Public: 30000,
          'Bonus Floor': 160000
        },
        {
          Building: '125 Broad Street<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">0</t>',
          Violations: 0,
          Public: 20000,
          'Bonus Floor': 160000
        },
        {
          Building: '140 Broadway<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">0</t>',
          Violations: 0,
          Public: 20000,
          'Bonus Floor': 160000
        },
        {
          Building: '101 Park Avenue<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">0</t>',
          Violations: 0,
          Public: 20000,
          'Bonus Floor': 160000
        },
        {
          Building: '299 Park Avenue<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">0</t>',
          Violations: 0,
          Public: 20000,
          'Bonus Floor': 150000
        },
        {
          Building: '1411 Broadway<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">0</t>',
          Violations: 0,
          Public: 20000,
          'Bonus Floor': 150000
        },
        {
          Building: '60 Wall Street<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">2</t>',
          Violations: 2,
          Public: 20000,
          'Bonus Floor': 150000
        },
        {
          Building: '1095 Sixth Avenue<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">0</t>',
          Violations: 0,
          Public: 20000,
          'Bonus Floor': 150000
        },
        {
          Building: '180 Maiden Lane<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">1</t>',
          Violations: 1,
          Public: 20000,
          'Bonus Floor': 140000
        },
        {
          Building: '425 East 58th Street<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">0</t>',
          Violations: 0,
          Public: 30000,
          'Bonus Floor': 140000
        },
        {
          Building: '622 Third Avenue<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">5</t>',
          Violations: 5,
          Public: 20000,
          'Bonus Floor': 140000
        },
        {
          Building: '17 Battery Place<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">2</t>',
          Violations: 2,
          Public: 20000,
          'Bonus Floor': 130000
        },
        {
          Building: '400 East 56th Street<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">1</t>',
          Violations: 1,
          Public: 20000,
          'Bonus Floor': 130000
        },
        {
          Building: '888 Seventh Avenue<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">1</t>',
          Violations: 1,
          Public: 10000,
          'Bonus Floor': 120000
        },
        {
          Building: '235 East 95th Street<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">1</t>',
          Violations: 1,
          Public: 20000,
          'Bonus Floor': 120000
        },
        {
          Building: '1 Battery Park Plaza<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">0</t>',
          Violations: 0,
          Public: 20000,
          'Bonus Floor': 120000
        },
        {
          Building: '45 Broadway<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">1</t>',
          Violations: 1,
          Public: 2000,
          'Bonus Floor': 110000
        },
        {
          Building: '375 Pearl Street<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">0</t>',
          Violations: 0,
          Public: 20000,
          'Bonus Floor': 110000
        },
        {
          Building: '1 Lincoln Plaza<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">2</t>',
          Violations: 2,
          Public: 20000,
          'Bonus Floor': 110000
        },
        {
          Building: '437 Madison Avenue<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">1</t>',
          Violations: 1,
          Public: 10000,
          'Bonus Floor': 110000
        },
        {
          Building: '457 Madison Avenue<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">1</t>',
          Violations: 1,
          Public: 6000,
          'Bonus Floor': 110000
        },
        {
          Building: '555 West 57th Street<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">2</t>',
          Violations: 2,
          Public: 20000,
          'Bonus Floor': 110000
        },
        {
          Building: '111 Wall Street<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">0</t>',
          Violations: 0,
          Public: 20000,
          'Bonus Floor': 110000
        },
        {
          Building: '32 Old Slip<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">1</t>',
          Violations: 1,
          Public: 20000,
          'Bonus Floor': 110000
        },
        {
          Building: '1285 Sixth Avenue<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">2</t>',
          Violations: 2,
          Public: 20000,
          'Bonus Floor': 110000
        },
        {
          Building: '343 Gold Street<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">2</t>',
          Violations: 2,
          Public: 20000,
          'Bonus Floor': 100000
        },
        {
          Building: '1 State Street<t>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</t><t style="fill:var(--color-10);font-weight:700">1</t>',
          Violations: 1,
          Public: 10000,
          'Bonus Floor': 100000
        }
      ]
    }
  ]
}
