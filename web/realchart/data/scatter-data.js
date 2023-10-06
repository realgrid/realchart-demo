const scatter_data = generateRandomData(3000);
const scatter_data2 = generateRandomData(3000);

function generateRandomData(count) {
  const data = [];
  for (let i = 0; i < count; i++) {
      const x = Math.random() * 10000;
      const y = Math.random() * 10000; // y 좌표는 0에서 100 사이의 임의의 값
      data.push({x,y});
  }
  return data;
}
