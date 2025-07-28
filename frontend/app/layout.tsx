import type { Metadata } from 'next';
import ClientLayout from './clientLayout';
import QueryClientWrapper from '@/src/components/layout/QueryClientWrapper';
import './globals.css';

export const metadata: Metadata = {
  title: '마음아지트',
  description: '당신의 이야기를 기록하고 공유하는 공간',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <QueryClientWrapper>
          <ClientLayout>
            {children}
          </ClientLayout>
        </QueryClientWrapper>
      </body>
    </html>
  );
}