import { SimulationYearData, SimulationSettings } from '@/types/simulationTypes';

// 資産形成計算関数
export function calculateAssetAccumulation(settings: SimulationSettings): {
  data: SimulationYearData[];
  calculatedValue?: number;
  isSuccess: boolean;
  errorMessage?: string;
} {
  try {
    const {
      averageYield = 5,
      years = 30,
      initialPrincipal = 0,
      monthlyAmount = 30000,
      targetAmount,
      questionType,
    } = settings;

    const monthlyYield = averageYield / 100 / 12;
    const data: SimulationYearData[] = [];
    let calculatedValue: number | undefined;

    switch (questionType) {
      case 'total-assets': {
        // 資産総額を計算
        let cumulativePrincipal = initialPrincipal; // 累積元本
        let totalAssets = initialPrincipal; // 総資産

        // 初年度のデータを追加
        data.push({
          year: 0,
          principal: cumulativePrincipal,
          dividendProfit: 0, // 初年度は複利利益なし
          totalAssets: totalAssets,
        });

        for (let year = 1; year <= years; year++) {
          // この年の月ごとの計算
          for (let month = 0; month < 12; month++) {
            // 運用益を加算（現在の総資産に月利を適用）
            totalAssets = totalAssets * (1 + monthlyYield);
            // 積立額を追加
            totalAssets += monthlyAmount;
            cumulativePrincipal += monthlyAmount;
          }

          // この年の複利利益は総資産から累積元本を引いた値
          const dividendProfit = Math.max(0, totalAssets - cumulativePrincipal);

          data.push({
            year,
            principal: cumulativePrincipal,
            dividendProfit: dividendProfit,
            totalAssets: totalAssets,
          });
        }

        calculatedValue = totalAssets;
        break;
      }

      case 'required-yield': {
        // 必要利回りを計算
        if (!targetAmount) {
          return { data: [], isSuccess: false, errorMessage: '目標金額を設定してください' };
        }

        // 二分探索で最適な利回りを見つける
        let low = 0;
        let high = 50;
        let optimalYield = 5;

        for (let i = 0; i < 100; i++) {
          const testYield = (low + high) / 2;
          const testMonthlyYield = testYield / 100 / 12;

          let testTotalAssets = initialPrincipal;
          for (let month = 0; month < years * 12; month++) {
            testTotalAssets = testTotalAssets * (1 + testMonthlyYield) + monthlyAmount;
          }

          if (Math.abs(testTotalAssets - targetAmount) < 10000) {
            optimalYield = testYield;
            break;
          }

          if (testTotalAssets < targetAmount) {
            low = testYield;
          } else {
            high = testYield;
          }
        }

        // 計算結果でデータを生成
        const resultMonthlyYield = optimalYield / 100 / 12;
        let cumulativePrincipal = initialPrincipal;
        let totalAssets = initialPrincipal;

        // 初年度のデータを追加
        data.push({
          year: 0,
          principal: cumulativePrincipal,
          dividendProfit: 0,
          totalAssets: totalAssets,
        });

        for (let year = 1; year <= years; year++) {
          for (let month = 0; month < 12; month++) {
            totalAssets = totalAssets * (1 + resultMonthlyYield);
            totalAssets += monthlyAmount;
            cumulativePrincipal += monthlyAmount;
          }

          const dividendProfit = Math.max(0, totalAssets - cumulativePrincipal);

          data.push({
            year,
            principal: cumulativePrincipal,
            dividendProfit: dividendProfit,
            totalAssets: totalAssets,
          });
        }

        calculatedValue = optimalYield;
        break;
      }

      case 'required-monthly': {
        // 必要積立額を計算
        if (!targetAmount) {
          return { data: [], isSuccess: false, errorMessage: '目標金額を設定してください' };
        }

        // 二分探索で最適な積立額を見つける
        let low = 0;
        let high = 1000000;
        let optimalMonthly = 30000;

        for (let i = 0; i < 100; i++) {
          const testMonthly = (low + high) / 2;

          let testTotalAssets = initialPrincipal;
          for (let month = 0; month < years * 12; month++) {
            testTotalAssets = testTotalAssets * (1 + monthlyYield) + testMonthly;
          }

          if (Math.abs(testTotalAssets - targetAmount) < 10000) {
            optimalMonthly = testMonthly;
            break;
          }

          if (testTotalAssets < targetAmount) {
            low = testMonthly;
          } else {
            high = testMonthly;
          }
        }

        // 計算結果でデータを生成
        let cumulativePrincipal = initialPrincipal;
        let totalAssets = initialPrincipal;

        // 初年度のデータを追加
        data.push({
          year: 0,
          principal: cumulativePrincipal,
          dividendProfit: 0,
          totalAssets: totalAssets,
        });

        for (let year = 1; year <= years; year++) {
          for (let month = 0; month < 12; month++) {
            totalAssets = totalAssets * (1 + monthlyYield);
            totalAssets += optimalMonthly;
            cumulativePrincipal += optimalMonthly;
          }

          const dividendProfit = Math.max(0, totalAssets - cumulativePrincipal);

          data.push({
            year,
            principal: cumulativePrincipal,
            dividendProfit: dividendProfit,
            totalAssets: totalAssets,
          });
        }

        calculatedValue = optimalMonthly;
        break;
      }

      case 'required-years': {
        // 必要期間を計算
        if (!targetAmount) {
          return { data: [], isSuccess: false, errorMessage: '目標金額を設定してください' };
        }

        let optimalYears = years;
        let totalAssets = initialPrincipal;
        let cumulativePrincipal = initialPrincipal;

        // 月ごとに計算して目標金額に到達するまでの期間を求める
        for (let month = 0; month < 600; month++) {
          // 最大50年
          totalAssets = totalAssets * (1 + monthlyYield) + monthlyAmount;
          cumulativePrincipal += monthlyAmount;

          if (totalAssets >= targetAmount) {
            optimalYears = month / 12;
            break;
          }
        }

        // 年次データを生成
        cumulativePrincipal = initialPrincipal;
        totalAssets = initialPrincipal;

        // 初年度のデータを追加
        data.push({
          year: 0,
          principal: cumulativePrincipal,
          dividendProfit: 0,
          totalAssets: totalAssets,
        });

        for (let year = 1; year <= Math.ceil(optimalYears); year++) {
          for (let month = 0; month < 12; month++) {
            totalAssets = totalAssets * (1 + monthlyYield);
            totalAssets += monthlyAmount;
            cumulativePrincipal += monthlyAmount;
          }

          const dividendProfit = Math.max(0, totalAssets - cumulativePrincipal);

          data.push({
            year,
            principal: cumulativePrincipal,
            dividendProfit: dividendProfit,
            totalAssets: totalAssets,
          });
        }

        calculatedValue = optimalYears;
        break;
      }

      default:
        return { data: [], isSuccess: false, errorMessage: '無効な質問タイプです' };
    }

    return { data, calculatedValue, isSuccess: true };
  } catch (error) {
    return {
      data: [],
      isSuccess: false,
      errorMessage: error instanceof Error ? error.message : '計算エラーが発生しました',
    };
  }
}

// 資産活用計算関数
export function calculateAssetDistribution(settings: SimulationSettings): {
  data: SimulationYearData[];
  calculatedValue?: number;
  isSuccess: boolean;
  errorMessage?: string;
} {
  try {
    const {
      averageYield = 4,
      years = 30,
      initialAssets = 10000000,
      withdrawalAmount = 10,
      withdrawalType = 'fixed',
      annualWithdrawalRate = 4,
      questionType,
    } = settings;

    const monthlyYield = averageYield / 100 / 12;
    const data: SimulationYearData[] = [];
    let calculatedValue: number | undefined;

    switch (questionType) {
      case 'asset-lifespan': {
        // 資産寿命を計算
        let remainingAssets = initialAssets;
        let yearCount = 0;
        const monthlyWithdrawal = withdrawalAmount * 10000; // 万円を円に変換
        const maxYears = 100; // 最大100年まで計算可能

        data.push({
          year: 0,
          principal: 0,
          dividendProfit: 0,
          totalAssets: remainingAssets,
          withdrawalAmount: 0,
        });

        // 運用利回りと取り崩し額の関係をチェック
        const annualYield = averageYield / 100;
        const annualWithdrawal =
          withdrawalType === 'fixed'
            ? monthlyWithdrawal * 12
            : initialAssets * (annualWithdrawalRate / 100);
        const annualYieldAmount = initialAssets * annualYield;
        const isSustainable = annualYieldAmount >= annualWithdrawal;

        if (isSustainable) {
          // 運用利回りが取り崩し額を上回る場合は「永続的」
          yearCount = Infinity;

          // 50年分のデータを生成（表示用）
          remainingAssets = initialAssets;
          for (let year = 1; year <= 50; year++) {
            let yearlyWithdrawal = 0;

            for (let month = 0; month < 12; month++) {
              remainingAssets *= 1 + monthlyYield;
              const withdrawal =
                withdrawalType === 'fixed'
                  ? monthlyWithdrawal
                  : remainingAssets * (annualWithdrawalRate / 100 / 12);

              remainingAssets -= withdrawal;
              yearlyWithdrawal += withdrawal;
            }

            data.push({
              year,
              principal: 0,
              dividendProfit: 0,
              totalAssets: Math.max(0, remainingAssets),
              withdrawalAmount: yearlyWithdrawal,
            });
          }
        } else {
          // 運用利回りが取り崩し額を下回る場合は通常の計算
          // 月ごとに計算して正確な資産寿命を求める
          for (let month = 0; month < maxYears * 12; month++) {
            if (remainingAssets <= 0) break;

            // 運用益を加算
            remainingAssets *= 1 + monthlyYield;

            // 取り崩し
            const withdrawal =
              withdrawalType === 'fixed'
                ? monthlyWithdrawal
                : remainingAssets * (annualWithdrawalRate / 100 / 12);

            remainingAssets -= withdrawal;

            if (remainingAssets <= 0) {
              yearCount = (month + 1) / 12;
              remainingAssets = 0;
              break;
            }
          }

          // 年次データを生成（表示用）
          remainingAssets = initialAssets;
          const maxDisplayYears = Math.min(Math.ceil(yearCount) + 5, 50);

          for (let year = 1; year <= maxDisplayYears; year++) {
            let yearlyWithdrawal = 0;

            for (let month = 0; month < 12; month++) {
              if (remainingAssets <= 0) break;

              remainingAssets *= 1 + monthlyYield;
              const withdrawal =
                withdrawalType === 'fixed'
                  ? monthlyWithdrawal
                  : remainingAssets * (annualWithdrawalRate / 100 / 12);

              remainingAssets -= withdrawal;
              yearlyWithdrawal += withdrawal;

              if (remainingAssets <= 0) {
                remainingAssets = 0;
                break;
              }
            }

            data.push({
              year,
              principal: 0,
              dividendProfit: 0,
              totalAssets: Math.max(0, remainingAssets),
              withdrawalAmount: yearlyWithdrawal,
            });

            if (remainingAssets <= 0) break;
          }
        }

        calculatedValue = yearCount;
        break;
      }

      case 'required-assets': {
        // 必要資産額を計算
        const monthlyWithdrawal = withdrawalAmount * 10000;

        // 二分探索で最適な初期資産を見つける
        let low = 0;
        let high = 100000000;
        let optimalAssets = initialAssets;

        for (let i = 0; i < 100; i++) {
          const testAssets = (low + high) / 2;
          let remainingAssets = testAssets;

          for (let month = 0; month < years * 12; month++) {
            remainingAssets *= 1 + monthlyYield;
            remainingAssets -= monthlyWithdrawal;

            if (remainingAssets <= 0) break;
          }

          if (Math.abs(remainingAssets) < 100000) {
            optimalAssets = testAssets;
            break;
          }

          if (remainingAssets < 0) {
            low = testAssets;
          } else {
            high = testAssets;
          }
        }

        // 計算結果でデータを生成
        let remainingAssets = optimalAssets;

        data.push({
          year: 0,
          principal: 0,
          dividendProfit: 0,
          totalAssets: remainingAssets,
          withdrawalAmount: 0,
        });

        for (let year = 1; year <= years; year++) {
          let yearlyWithdrawal = 0;

          for (let month = 0; month < 12; month++) {
            remainingAssets *= 1 + monthlyYield;
            remainingAssets -= monthlyWithdrawal;
            yearlyWithdrawal += monthlyWithdrawal;
          }

          data.push({
            year,
            principal: 0,
            dividendProfit: 0,
            totalAssets: Math.max(0, remainingAssets),
            withdrawalAmount: yearlyWithdrawal,
          });

          if (remainingAssets <= 0) break;
        }

        calculatedValue = optimalAssets;
        break;
      }

      case 'withdrawal-amount': {
        // 可能取り崩し額を計算
        // 指定された期間で資産を使い切る前提で最適な月間取り崩し額を計算

        // 二分探索で最適な月間取り崩し額を見つける
        let low = 0;
        let high = initialAssets / 12; // 最大でも全資産を12ヶ月で使い切る額
        let optimalWithdrawal = 0;

        for (let i = 0; i < 100; i++) {
          const testWithdrawal = (low + high) / 2;
          let remainingAssets = initialAssets;

          // 指定期間での資産推移をシミュレーション
          for (let month = 0; month < years * 12; month++) {
            remainingAssets *= 1 + monthlyYield;
            remainingAssets -= testWithdrawal;

            if (remainingAssets < 0) break;
          }

          // 期間終了時の残高が0に近い場合が最適
          if (Math.abs(remainingAssets) < 10000) {
            optimalWithdrawal = testWithdrawal;
            break;
          }

          if (remainingAssets < 0) {
            high = testWithdrawal;
          } else {
            low = testWithdrawal;
          }
        }

        // 計算結果でデータを生成
        let remainingAssets = initialAssets;

        data.push({
          year: 0,
          principal: 0,
          dividendProfit: 0,
          totalAssets: remainingAssets,
          withdrawalAmount: 0,
        });

        for (let year = 1; year <= years; year++) {
          let yearlyWithdrawal = 0;

          for (let month = 0; month < 12; month++) {
            remainingAssets *= 1 + monthlyYield;
            remainingAssets -= optimalWithdrawal;
            yearlyWithdrawal += optimalWithdrawal;
          }

          data.push({
            year,
            principal: 0,
            dividendProfit: 0,
            totalAssets: Math.max(0, remainingAssets),
            withdrawalAmount: yearlyWithdrawal,
          });

          if (remainingAssets <= 0) break;
        }

        calculatedValue = optimalWithdrawal / 10000; // 円を万円に変換
        break;
      }

      default:
        return { data: [], isSuccess: false, errorMessage: '無効な質問タイプです' };
    }

    return { data, calculatedValue, isSuccess: true };
  } catch (error) {
    return {
      data: [],
      isSuccess: false,
      errorMessage: error instanceof Error ? error.message : '計算エラーが発生しました',
    };
  }
}

// フォーマット用ユーティリティ関数
export function formatCurrency(amount: number, decimals: number = 0): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

export function formatNumber(num: number, decimals: number = 0): string {
  return new Intl.NumberFormat('ja-JP', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatPercentage(num: number, decimals: number = 1): string {
  return `${num.toFixed(decimals)}%`;
}
