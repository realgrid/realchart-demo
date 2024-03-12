export const config = {
  title: '매입금액',
  templates: {
    pointLabel: {
      pointLabel: { visible: true, position: 'inside', effect: 'outline' }
    }
  },
  xAxis: { type: 'category' },
  yAxis: { tick: { stepInterval: 25 } },
  series: [
    {
      name: '매입금액',
      data: [
        [ 'AccuSolve', 303 ],
        [ 'LedgerLogic', 154 ],
        [ 'FiscalGenius', 48 ],
        [ 'BalanceBeam Solutions', 35 ],
        [ 'ProfitPulse', 32 ],
        [ 'NumeraTech', 21 ],
        [ 'LedgerLoom', 21 ],
        [ 'ProfitPal Solutions', 18 ],
        [ 'SmartBooks Inc.', 16 ],
        [ 'NumeralEdge', 15 ],
        [ 'FiscalFocus', 15 ],
        [ 'AccuWise Solutions', 13 ],
        [ 'BalanceBright', 9 ],
        [ 'WealthWorks Tech', 7 ],
        [ 'MoneyMastery Corp.', 6 ],
        [ 'FinanceForge', 5 ],
        [ 'Accountable Solutions', 5 ],
        [ 'ProsperityPrime', 5 ],
        [ 'WealthWave Solutions', 5 ],
        [ 'FinSavvy Inc.', 4 ]
      ],
      style: { fill: '#008CFF', stroke: 'none' },
      hoverStyle: { fill: '#5EB3E4', stroke: 'none' }
    }
  ],
  legend: { visible: true }
}
export const tool = false