/**
 * @demo
 *
 * Bar Series 기본 예제.
 */

const config = {
    title: '매입금액',

    templates: {
        pointLabel: {
            pointLabel: {
                visible: true,
                position: 'inside',
                effect: 'outline'
            }
        }
    },
    xAxis: {
        type: 'category'
    },
    yAxis: {},
    series: [
        {
            name: '매입금액',
            data: [
                ['AccuSolve', 303],
                ['LedgerLogic', 154],
                ['FiscalGenius', 100],
                ['BalanceBeam Solutions', 35],
                ['ProfitPulse',120],
                ['NumeraTech', 21],
                ['LedgerLoom', 80],
                ['ProfitPal Solutions', 18],
                ['SmartBooks Inc.', 50],
                ['NumeralEdge', 250],
                ['FiscalFocus', 128],
                ['AccuWise Solutions', 13],
                ['BalanceBright', 45],
                ['WealthWorks Tech', 7],
                ['MoneyMastery Corp.', 70],
                ['FinanceForge',90],
                ['Accountable Solutions', 5],
                ['ProsperityPrime', 50],
                ['WealthWave Solutions', 15],
                ['FinSavvy Inc.', 20]
            ],
            style: {
                fill: '#008CFF',
                stroke: 'none'
            },
            hoverStyle: {
                fill: '#5EB3E4',
                stroke: 'none'
            }
        }
    ],
    legend: {
        visible: true
    }
};

let animate = false;
let chart;

function init() {
    console.log('RealChart v' + RealChart.getVersion());
    // RealChart.setDebugging(true);
    RealChart.setLogging(true);

    chart = RealChart.createChart(document, 'realchart', config);
}
