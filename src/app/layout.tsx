import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { Noto_Sans_Thai } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const notoSansThai = Noto_Sans_Thai({
  subsets: ['latin', 'thai'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-noto-sans-thai',
});

export const metadata: Metadata = {
  title: 'Plan One',
  description: 'ระบบจัดการการก่อสร้าง',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning className={notoSansThai.variable}>
      <body className="font-sans" suppressHydrationWarning>
        {children}
        <Analytics />
        <SpeedInsights />
        <Script id="suppress-hydration" strategy="afterInteractive">
          {`
            (function() {
              setTimeout(() => {
                document.documentElement.removeAttribute('data-arp');
                document.body.removeAttribute('cz-shortcut-listen');
              }, 0);
            })();
          `}
        </Script>
      </body>
    </html>
  );
}
