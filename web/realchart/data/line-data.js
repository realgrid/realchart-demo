const line_data = generateRandomData(3000);

function generateRandomData(count) {
  const data = [];
  for (let i = 0; i < count; i++) {
      const x = i;
      const y = Math.random() * 100; // y 좌표는 0에서 100 사이의 임의의 값
      data.push(['No ' + x, y]);
  }
  return data;
}
