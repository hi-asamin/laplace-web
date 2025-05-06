# Laplace Markets API 仕様書

このリポジトリには、Laplaceアプリの銘柄詳細ページで使用するAPI仕様が含まれています。この仕様に基づいてバックエンドAPIを実装してください。

## 概要

このAPIは、以下の機能を提供します：

1. 銘柄検索
2. 銘柄詳細情報の取得
3. チャートデータの取得
4. ファンダメンタル分析データの取得
5. 銘柄関連ニュースの取得
6. 関連銘柄の取得

## 仕様書形式

- YAML形式: `/swagger/markets-api.yaml`
- JSON形式: `/swagger/markets-api.json`

SwaggerUIやPostmanなどのツールを使用して仕様を閲覧・テストすることができます。

## 主要なエンドポイント

### 銘柄検索

```
GET /markets/search?query={keyword}&limit={limit}
```

### 銘柄詳細情報の取得

```
GET /markets/{symbol}
```

### チャートデータの取得

```
GET /charts/{symbol}?period={period}&interval={interval}
```

### ファンダメンタル分析データの取得

```
GET /fundamentals/{symbol}
```

### 銘柄関連ニュースの取得

```
GET /news/{symbol}?limit={limit}&page={page}
```

### 関連銘柄の取得

```
GET /related/{symbol}?limit={limit}
```

## 実装の優先順位

銘柄詳細ページの実装において重要度の高い順：

1. 銘柄詳細情報の取得 (`/markets/{symbol}`)
2. チャートデータの取得 (`/charts/{symbol}`)
3. ファンダメンタル分析データの取得 (`/fundamentals/{symbol}`)
4. 銘柄関連ニュースの取得 (`/news/{symbol}`)
5. 関連銘柄の取得 (`/related/{symbol}`)

## 特に重要なファンダメンタル分析データ

ファンダメンタル分析データの中でも、以下の情報は特に重要視されています：

1. 四半期業績推移 (quarterlyEarnings)
2. EPS（一株当たり利益） (keyMetrics.eps)
3. ROE（自己資本利益率） (keyMetrics.roe)
4. 一株当たり配当金額 (dividendData.dividend)

これらの指標には、初心者ユーザーのために詳細な説明も表示される予定です。

## データソース

データソースとしては以下が考えられます：

- Yahoo Finance API
- Alpha Vantage
- Financial Modeling Prep API
- IEX Cloud
- Polygon.io

## 注意事項

- レスポンスのパフォーマンスに注意してください。特にチャートデータは大量になる可能性があるため、必要に応じてデータポイントを間引くなどの最適化を検討してください。
- すべての金額データは適切な通貨単位を含めてフォーマットしてください。
- 日付や時刻データはISO 8601形式でレスポンスしてください。

## 環境

以下の環境でAPIを提供する予定です：

- 開発環境: `http://localhost:3000/api`
- ステージング環境: `https://staging-api.laplace.com/v1`
- 本番環境: `https://api.laplace.com/v1`

## 質問やフィードバック

実装に関する質問や仕様に関するフィードバックがある場合は、開発チームにお問い合わせください。
