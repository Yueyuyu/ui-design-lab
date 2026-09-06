// 不替换或压缩无效点，避免把缺测误绘为连续趋势。
export function validSeries(data) {
  return Array.isArray(data) && data.every(item => typeof (typeof item === "object" && item !== null ? item.value : item) === "number" && Number.isFinite(typeof item === "object" && item !== null ? item.value : item));
}
export function lineCoordinates(data, width = 640, height = 220) {
  if (!validSeries(data) || !data.length) return [];
  const min = Math.min(...data), max = Math.max(...data);
  return data.map((value, index) => ({
    x: data.length === 1 ? width / 2 : index * width / (data.length - 1),
    y: max === min ? height / 2 : height - 12 - ((value - min) / (max - min)) * (height - 24),
    value,
  }));
}
export function barGeometry(data) {
  if (!validSeries(data) || !data.length) return [];
  const max = Math.max(0,...data.map(item => item.value));
  const min = Math.min(0,...data.map(item => item.value));
  const range = max - min || 1;
  return data.map(item => ({ ...item, top: (max - Math.max(0,item.value))/range*100, height: Math.abs(item.value)/range*100, baseline: max/range*100 }));
}
