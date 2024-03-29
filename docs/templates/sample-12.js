export const config = {
  title: false,
  options: { style: { backgroundColor: '#363A46' } },
  xAxis: {},
  yAxis: {},
  series: {
    type: 'treemap',
    startDir: 'vertical',
    algorithm: 'squarify',
    alternate: false,
    groupMode: true,
    tooltipText: 'group: ${group}<br>value: ${value}',
    pointLabel: { visible: true, text: '${x}<br>${value}', effect: 'outline' },
    data: [
      { id: 'Technology', name: 'Technology' },
      {
        id: 'Consumer Electronics',
        name: 'Consumer Electronics',
        group: 'Technology',
        color: '#3498db'
      },
      {
        id: 'Software - Infrastructure',
        name: 'Software - Infrastructure',
        group: 'Technology',
        color: '#2ecc71'
      },
      {
        id: 'Semiconductors',
        name: 'Semiconductors',
        group: 'Technology',
        color: '#e74c3c'
      },
      {
        id: 'Semiconductor Equipment & Materials',
        name: 'Semiconductor Equipment & Materials',
        group: 'Technology',
        color: '#f39c12'
      },
      {
        id: 'Software - Application',
        name: 'Software - Application',
        group: 'Technology',
        color: '#9b59b6'
      },
      {
        id: 'Information Technology Services',
        name: 'Information Technology Services',
        group: 'Technology',
        color: '#1abc9c'
      },
      {
        id: 'Communication Equipment',
        name: 'Communication Equipment',
        group: 'Technology',
        color: '#34495e'
      },
      { id: 'Communication Services', name: 'Communication Services' },
      {
        id: 'Internet Content & Information',
        name: 'Internet Content & Information',
        group: 'Communication Services',
        color: '#3498db'
      },
      {
        id: 'Entertainment',
        name: 'Entertainment',
        group: 'Communication Services',
        color: '#2ecc71'
      },
      {
        id: 'Telecom Services',
        name: 'Telecom Services',
        group: 'Communication Services',
        color: '#e74c3c'
      },
      { id: 'Consumer Cyclical', name: 'Consumer Cyclical' },
      {
        id: 'Internet Retail',
        name: 'Internet Retail',
        group: 'Consumer Cyclical',
        color: '#3498db'
      },
      {
        id: 'Auto Manufacturers',
        name: 'Auto Manufacturers',
        group: 'Consumer Cyclical',
        color: '#2ecc71'
      },
      {
        id: 'Home Improvement Retail',
        name: 'Home Improvement Retail',
        group: 'Consumer Cyclical',
        color: '#e74c3c'
      },
      {
        id: 'Restaurants',
        name: 'Restaurants',
        group: 'Consumer Cyclical',
        color: '#f39c12'
      },
      {
        id: 'Footwear & Accessories',
        name: 'Footwear & Accessories',
        group: 'Consumer Cyclical',
        color: '#9b59b6'
      },
      {
        id: 'Travel Services',
        name: 'Travel Services',
        group: 'Consumer Cyclical',
        color: '#1abc9c'
      },
      { id: 'Financial', name: 'Financial' },
      {
        id: 'Insurance - Diversified',
        name: 'Insurance - Diversified',
        group: 'Financial',
        color: '#3498db'
      },
      {
        id: 'Credit Services',
        name: 'Credit Services',
        group: 'Financial',
        color: '#2ecc71'
      },
      {
        id: 'Banks - Diversified',
        name: 'Banks - Diversified',
        group: 'Financial',
        color: '#e74c3c'
      },
      {
        id: 'Banks - Regional',
        name: 'Banks - Regional',
        group: 'Financial',
        color: '#f39c12'
      },
      {
        id: 'Financial Data & Stock Exchanges',
        name: 'Financial Data & Stock Exchanges',
        group: 'Financial',
        color: '#9b59b6'
      },
      {
        id: 'Asset Management',
        name: 'Asset Management',
        group: 'Financial',
        color: '#1abc9c'
      },
      {
        id: 'Capital Markets',
        name: 'Capital Markets',
        group: 'Financial',
        color: '#34495e'
      },
      { id: 'Healthcare', name: 'Healthcare' },
      {
        id: 'Drug Manufacturers - General',
        name: 'Drug Manufacturers - General',
        group: 'Healthcare',
        color: '#3498db'
      },
      {
        id: 'Healthcare Plans',
        name: 'Healthcare Plans',
        group: 'Healthcare',
        color: '#2ecc71'
      },
      {
        id: 'Biotechnology',
        name: 'Biotechnology',
        group: 'Healthcare',
        color: '#e74c3c'
      },
      {
        id: 'Diagnostics & Research',
        name: 'Diagnostics & Research',
        group: 'Healthcare',
        color: '#f39c12'
      },
      {
        id: 'Medical Devices',
        name: 'Medical Devices',
        group: 'Healthcare',
        color: '#9b59b6'
      },
      {
        id: 'Medical Instruments & Supplies',
        name: 'Medical Instruments & Supplies',
        group: 'Healthcare',
        color: '#1abc9c'
      },
      { id: 'Energy', name: 'Energy' },
      {
        id: 'Oil & Gas Integrated',
        name: 'Oil & Gas Integrated',
        group: 'Energy',
        color: '#3498db'
      },
      {
        id: 'Oil & Gas E&P',
        name: 'Oil & Gas E&P',
        group: 'Energy',
        color: '#2ecc71'
      },
      { id: 'Consumer Defensive', name: 'Consumer Defensive' },
      {
        id: 'Discount Stores',
        name: 'Discount Stores',
        group: 'Consumer Defensive',
        color: '#3498db'
      },
      {
        id: 'Household & Personal Products',
        name: 'Household & Personal Products',
        group: 'Consumer Defensive',
        color: '#2ecc71'
      },
      {
        id: 'Beverages - Non-Alcoholic',
        name: 'Beverages - Non-Alcoholic',
        group: 'Consumer Defensive',
        color: '#e74c3c'
      },
      {
        id: 'Tobacco',
        name: 'Tobacco',
        group: 'Consumer Defensive',
        color: '#f39c12'
      },
      { id: 'Basic Materials', name: 'Basic Materials' },
      {
        id: 'Specialty Chemicals',
        name: 'Specialty Chemicals',
        group: 'Basic Materials',
        color: '#3498db'
      },
      {
        id: 'Other Industrial Metals & Mining',
        name: 'Other Industrial Metals & Mining',
        group: 'Basic Materials',
        color: '#2ecc71'
      },
      { id: 'Industrials', name: 'Industrials' },
      {
        id: 'Railroads',
        name: 'Railroads',
        group: 'Industrials',
        color: '#3498db'
      },
      {
        id: 'Aerospace & Defense',
        name: 'Aerospace & Defense',
        group: 'Industrials',
        color: '#2ecc71'
      },
      {
        id: 'Specialty Industrial Machinery',
        name: 'Specialty Industrial Machinery',
        group: 'Industrials',
        color: '#e74c3c'
      },
      {
        id: 'Integrated Freight & Logistics',
        name: 'Integrated Freight & Logistics',
        group: 'Industrials',
        color: '#f39c12'
      },
      {
        id: 'Conglomerates',
        name: 'Conglomerates',
        group: 'Industrials',
        color: '#9b59b6'
      },
      {
        id: 'Farm & Heavy Construction Machinery',
        name: 'Farm & Heavy Construction Machinery',
        group: 'Industrials',
        color: '#1abc9c'
      },
      { id: 'Utilities', name: 'Utilities' },
      {
        id: 'Utilities - Regulated Electric',
        name: 'Utilities - Regulated Electric',
        group: 'Utilities',
        color: '#3498db'
      },
      {
        name: 'AAPL',
        group: 'Consumer Electronics',
        value: '2975.41B'
      },
      {
        name: 'MSFT',
        group: 'Software - Infrastructure',
        value: '2808.28B'
      },
      {
        name: 'GOOG',
        group: 'Internet Content & Information',
        value: '1752.49B'
      },
      {
        name: 'GOOGL',
        group: 'Internet Content & Information',
        value: '1733.34B'
      },
      { name: 'AMZN', group: 'Internet Retail', value: '1516.10B' },
      { name: 'NVDA', group: 'Semiconductors', value: '1203.29B' },
      {
        name: 'META',
        group: 'Internet Content & Information',
        value: '877.58B'
      },
      {
        name: 'BRK-A',
        group: 'Insurance - Diversified',
        value: '796.80B'
      },
      {
        name: 'BRK-B',
        group: 'Insurance - Diversified',
        value: '785.49B'
      },
      { name: 'TSLA', group: 'Auto Manufacturers', value: '744.53B' },
      {
        name: 'LLY',
        group: 'Drug Manufacturers - General',
        value: '564.92B'
      },
      { name: 'V', group: 'Credit Services', value: '516.67B' },
      { name: 'TSM', group: 'Semiconductors', value: '511.64B' },
      { name: 'UNH', group: 'Healthcare Plans', value: '502.93B' },
      { name: 'JPM', group: 'Banks - Diversified', value: '443.28B' },
      { name: 'XOM', group: 'Oil & Gas Integrated', value: '416.68B' },
      { name: 'WMT', group: 'Discount Stores', value: '416.30B' },
      { name: 'AVGO', group: 'Semiconductors', value: '401.18B' },
      { name: 'MA', group: 'Credit Services', value: '384.80B' },
      {
        name: 'JNJ',
        group: 'Drug Manufacturers - General',
        value: '363.07B'
      },
      { name: 'NVO', group: 'Biotechnology', value: '358.82B' },
      {
        name: 'PG',
        group: 'Household & Personal Products',
        value: '357.28B'
      },
      {
        name: 'ORCL',
        group: 'Software - Infrastructure',
        value: '318.40B'
      },
      {
        name: 'HD',
        group: 'Home Improvement Retail',
        value: '309.28B'
      },
      {
        name: 'ADBE',
        group: 'Software - Infrastructure',
        value: '282.03B'
      },
      { name: 'CVX', group: 'Oil & Gas Integrated', value: '272.80B' },
      {
        name: 'ASML',
        group: 'Semiconductor Equipment & Materials',
        value: '272.60B'
      },
      { name: 'COST', group: 'Discount Stores', value: '261.89B' },
      {
        name: 'MRK',
        group: 'Drug Manufacturers - General',
        value: '258.17B'
      },
      { name: 'TM', group: 'Auto Manufacturers', value: '255.25B' },
      {
        name: 'KO',
        group: 'Beverages - Non-Alcoholic',
        value: '252.57B'
      },
      {
        name: 'ABBV',
        group: 'Drug Manufacturers - General',
        value: '245.41B'
      },
      { name: 'BAC', group: 'Banks - Diversified', value: '235.28B' },
      {
        name: 'PEP',
        group: 'Beverages - Non-Alcoholic',
        value: '232.76B'
      },
      {
        name: 'CRM',
        group: 'Software - Application',
        value: '218.05B'
      },
      { name: 'SHEL', group: 'Oil & Gas Integrated', value: '216.86B' },
      {
        name: 'ACN',
        group: 'Information Technology Services',
        value: '209.62B'
      },
      { name: 'NFLX', group: 'Entertainment', value: '209.56B' },
      { name: 'MCD', group: 'Restaurants', value: '204.63B' },
      { name: 'LIN', group: 'Specialty Chemicals', value: '202.21B' },
      {
        name: 'AZN',
        group: 'Drug Manufacturers - General',
        value: '199.91B'
      },
      { name: 'AMD', group: 'Semiconductors', value: '197.59B' },
      {
        name: 'CSCO',
        group: 'Communication Equipment',
        value: '196.10B'
      },
      {
        name: 'NVS',
        group: 'Drug Manufacturers - General',
        value: '195.45B'
      },
      {
        name: 'TMO',
        group: 'Diagnostics & Research',
        value: '190.48B'
      },
      { name: 'BABA', group: 'Internet Retail', value: '189.46B' },
      { name: 'INTC', group: 'Semiconductors', value: '185.34B' },
      { name: 'ABT', group: 'Medical Devices', value: '178.21B' },
      {
        name: 'SAP',
        group: 'Software - Application',
        value: '177.83B'
      },
      { name: 'DIS', group: 'Entertainment', value: '175.58B' },
      { name: 'TMUS', group: 'Telecom Services', value: '172.32B' },
      {
        name: 'PFE',
        group: 'Drug Manufacturers - General',
        value: '172.22B'
      },
      { name: 'CMCSA', group: 'Telecom Services', value: '171.39B' },
      {
        name: 'NKE',
        group: 'Footwear & Accessories',
        value: '163.74B'
      },
      {
        name: 'DHR',
        group: 'Diagnostics & Research',
        value: '163.56B'
      },
      { name: 'TTE', group: 'Oil & Gas Integrated', value: '163.42B' },
      {
        name: 'INTU',
        group: 'Software - Application',
        value: '158.35B'
      },
      { name: 'PDD', group: 'Internet Retail', value: '158.01B' },
      {
        name: 'BHP',
        group: 'Other Industrial Metals & Mining',
        value: '157.14B'
      },
      { name: 'VZ', group: 'Telecom Services', value: '157.07B' },
      { name: 'WFC', group: 'Banks - Diversified', value: '155.80B' },
      { name: 'HDB', group: 'Banks - Regional', value: '150.59B' },
      { name: 'HSBC', group: 'Banks - Diversified', value: '150.33B' },
      { name: 'PM', group: 'Tobacco', value: '145.20B' },
      { name: 'QCOM', group: 'Semiconductors', value: '142.24B' },
      {
        name: 'AMGN',
        group: 'Drug Manufacturers - General',
        value: '141.90B'
      },
      {
        name: 'IBM',
        group: 'Information Technology Services',
        value: '141.64B'
      },
      { name: 'TXN', group: 'Semiconductors', value: '138.98B' },
      {
        name: 'NOW',
        group: 'Software - Application',
        value: '138.09B'
      },
      { name: 'UNP', group: 'Railroads', value: '137.30B' },
      { name: 'COP', group: 'Oil & Gas E&P', value: '136.81B' },
      { name: 'BA', group: 'Aerospace & Defense', value: '133.07B' },
      {
        name: 'SPGI',
        group: 'Financial Data & Stock Exchanges',
        value: '131.29B'
      },
      {
        name: 'GE',
        group: 'Specialty Industrial Machinery',
        value: '130.61B'
      },
      { name: 'BX', group: 'Asset Management', value: '129.54B' },
      { name: 'MS', group: 'Capital Markets', value: '129.17B' },
      {
        name: 'UPS',
        group: 'Integrated Freight & Logistics',
        value: '129.11B'
      },
      { name: 'HON', group: 'Conglomerates', value: '127.37B' },
      {
        name: 'CAT',
        group: 'Farm & Heavy Construction Machinery',
        value: '125.92B'
      },
      {
        name: 'AMAT',
        group: 'Semiconductor Equipment & Materials',
        value: '125.48B'
      },
      {
        name: 'UL',
        group: 'Household & Personal Products',
        value: '122.45B'
      },
      { name: 'RY', group: 'Banks - Diversified', value: '120.96B' },
      { name: 'AXP', group: 'Credit Services', value: '119.94B' },
      {
        name: 'NEE',
        group: 'Utilities - Regulated Electric',
        value: '117.46B'
      },
      { name: 'SBUX', group: 'Restaurants', value: '116.66B' },
      {
        name: 'SNY',
        group: 'Drug Manufacturers - General',
        value: '116.14B'
      },
      { name: 'T', group: 'Telecom Services', value: '115.90B' },
      { name: 'RTX', group: 'Aerospace & Defense', value: '115.25B' },
      {
        name: 'LOW',
        group: 'Home Improvement Retail',
        value: '114.86B'
      },
      {
        name: 'UBER',
        group: 'Software - Application',
        value: '114.05B'
      },
      { name: 'ELV', group: 'Healthcare Plans', value: '112.22B' },
      { name: 'LMT', group: 'Aerospace & Defense', value: '112.15B' },
      {
        name: 'ISRG',
        group: 'Medical Instruments & Supplies',
        value: '111.78B'
      },
      { name: 'TD', group: 'Banks - Diversified', value: '111.69B' },
      { name: 'SYK', group: 'Medical Devices', value: '111.21B' },
      { name: 'GS', group: 'Capital Markets', value: '110.43B' },
      { name: 'BKNG', group: 'Travel Services', value: '108.54B' },
      { name: 'BLK', group: 'Asset Management', value: '108.47B' },
      { name: 'SONY', group: 'Consumer Electronics', value: '107.22B' },
      {
        name: 'DE',
        group: 'Farm & Heavy Construction Machinery',
        value: '106.45B'
      }
    ]
  }
}
export const tool = false