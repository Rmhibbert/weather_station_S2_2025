export function calculateYAxisConfig(data, dataKey) {
  if (!data || data.length === 0) {
    return { domain: [0, 10], ticks: [0, 2, 4, 6, 8, 10] }; // Fallback for empty data
  }

  // Extract the data values
  const values = data.map((item) => item[dataKey]);
  const maxValue = Math.max(...values);

  // Always start Y-axis at 0
  const minY = 0;

  // Calculate a reasonable step size
  const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));
  let stepSize = magnitude / 2; // Divide by 2 for better granularity

  // Round up max value to the nearest multiple of step size
  const maxY = Math.ceil(maxValue / stepSize) * stepSize;

  // Generate ticks from 0 to maxY
  const ticks = [];
  for (let i = minY; i <= maxY; i += stepSize) {
    ticks.push(i);
  }

  return {
    domain: [minY, maxY],
    ticks: ticks,
  };
}
