const scatter_data = generateRandomData(3000);
const scatter_data2 = generateRandomData(3000);
const scatter_jitter = [];

function generateRandomData(count) {
  const data = [];
  for (let i = 0; i < count; i++) {
      const x = Math.random() * 10000;
      const y = Math.random() * 10000; // y 좌표는 0에서 100 사이의 임의의 값
      data.push({x,y});
  }
  return data;
}

// from hichart
function getJitterData(x, count) {
    const off = 0.2 + 0.2 * Math.random();

    return new Array(count).fill(1).map(() => [
        x,
        off + (Math.random() - 0.5) * (Math.random() - 0.5)
    ]);
};