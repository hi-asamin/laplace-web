import { ChartData, ChartDataPoint } from '@/types/api';

/**
 * チャートデータからSVGパスを生成する
 */
export function generateChartPath(
  chartData: ChartDataPoint[],
  width: number,
  height: number,
  padding = 10
): {
  linePath: string;
  areaPath: string;
  minValue: number;
  maxValue: number;
} {
  if (!chartData || chartData.length === 0) {
    return {
      linePath: '',
      areaPath: '',
      minValue: 0,
      maxValue: 0,
    };
  }

  // 終値を取得
  const closeValues = chartData.map((d) => d.close);
  const minValue = Math.min(...closeValues);
  const maxValue = Math.max(...closeValues);

  // データ範囲が小さい場合はマージンを追加
  const valueMargin = (maxValue - minValue) * 0.1;
  const effectiveMin = minValue - valueMargin;
  const effectiveMax = maxValue + valueMargin;
  const valueRange = effectiveMax - effectiveMin;

  // パディングを考慮した実際のチャート領域
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;

  // 各データポイントの位置を計算
  const points = chartData.map((d, i) => {
    const x = padding + (i / (chartData.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((d.close - effectiveMin) / valueRange) * chartHeight;
    return { x, y };
  });

  // SVGパスを生成
  let linePath = '';
  let areaPath = '';

  if (points.length > 0) {
    // 線のパス
    linePath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      linePath += ` L ${points[i].x} ${points[i].y}`;
    }

    // 塗りつぶし領域のパス
    areaPath = linePath;
    areaPath += ` L ${points[points.length - 1].x} ${height - padding}`;
    areaPath += ` L ${points[0].x} ${height - padding}`;
    areaPath += ' Z';
  }

  return {
    linePath,
    areaPath,
    minValue,
    maxValue,
  };
}

/**
 * チャートのY軸ラベルを生成する
 */
export function generateYAxisLabels(minValue: number, maxValue: number, count = 3): number[] {
  const step = (maxValue - minValue) / (count - 1);
  return Array.from({ length: count }, (_, i) => minValue + step * i);
}

/**
 * 数値をフォーマットする（例: 1234.56 -> "1,234.56"）
 */
export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat('ja-JP', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * 日付をフォーマットする（例: "2023-04-01T16:00:00.000Z" -> "04/01"）
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ja-JP', {
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}
