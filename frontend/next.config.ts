// next.config.ts
import { NextConfig } from 'next'; // NextConfig 타입을 임포트할 수도 있습니다.

const nextConfig: NextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*', // 이 경로로 프록시
      },
    ];
  },
};

export default nextConfig;