import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol') || 'AAPL';
    const name = searchParams.get('name') || 'Apple Inc.';
    const price = searchParams.get('price') || '$196.45';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0a2540',
            backgroundImage: 'linear-gradient(135deg, #0a2540 0%, #1e293b 100%)',
          }}
        >
          {/* ロゴ・ブランド */}
          <div
            style={{
              position: 'absolute',
              top: '40px',
              left: '60px',
              display: 'flex',
              alignItems: 'center',
              color: '#00d4a1',
              fontSize: '32px',
              fontWeight: 'bold',
            }}
          >
            Laplace
          </div>

          {/* メインコンテンツ */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: 'white',
            }}
          >
            {/* 銘柄シンボル */}
            <div
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#00d4a1',
                marginBottom: '16px',
              }}
            >
              {symbol}
            </div>

            {/* 企業名 */}
            <div
              style={{
                fontSize: '36px',
                fontWeight: '600',
                marginBottom: '24px',
                maxWidth: '800px',
              }}
            >
              {name}
            </div>

            {/* 株価 */}
            <div
              style={{
                fontSize: '64px',
                fontWeight: 'bold',
                color: '#00d4a1',
                marginBottom: '16px',
              }}
            >
              {price}
            </div>

            {/* サブタイトル */}
            <div
              style={{
                fontSize: '24px',
                color: '#cbd5e1',
                marginBottom: '32px',
              }}
            >
              株価・配当・財務分析
            </div>
          </div>

          {/* 装飾要素 */}
          <div
            style={{
              position: 'absolute',
              top: '0',
              right: '0',
              width: '300px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(0, 212, 161, 0.1) 0%, transparent 70%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              width: '200px',
              height: '200px',
              background: 'radial-gradient(circle, rgba(74, 144, 226, 0.1) 0%, transparent 70%)',
            }}
          />

          {/* フッター */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              right: '60px',
              fontSize: '18px',
              color: '#94a3b8',
            }}
          >
            laplace-web.vercel.app
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
