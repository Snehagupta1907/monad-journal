import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Builder Journal on Monad';
export const size = {
  width: 1200,
  height: 800,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to right, #6c54f8, #8b6ffb)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          {/* Pen icon */}
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            style={{ marginRight: '20px' }}
          >
            <path
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h1
            style={{
              fontSize: '72px',
              color: 'white',
              margin: '0',
              fontWeight: 'bold',
            }}
          >
            Builder Journal
          </h1>
        </div>
        <p
          style={{
            fontSize: '32px',
            color: 'rgba(255, 255, 255, 0.9)',
            marginTop: '20px',
            textAlign: 'center',
          }}
        >
          Document your builder journey and mint it as an NFT on Monad
        </p>
      </div>
    ),
    {
      ...size,
    }
  );
} 