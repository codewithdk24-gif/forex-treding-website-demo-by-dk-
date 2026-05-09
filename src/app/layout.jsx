import '../style.css';
import ClientSetup from './ClientSetup';
import { AuthProvider } from '@/context/AuthContext';
import ErrorBoundary from '@/components/ErrorBoundary';

export const metadata = {
  title: 'ForexPro | Institutional Trading Terminal',
  description: 'Institutional grade liquidity and precision execution in real-time.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <script type="text/javascript" src="https://s3.tradingview.com/tv.js" async></script>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f1115" />
      </head>
      <body className="bg-[#0f1115] text-white selection:bg-blue-500/30 selection:text-blue-500" suppressHydrationWarning>
        <ErrorBoundary>
          <AuthProvider>
            <ClientSetup />
            <div id="app">
              {children}
            </div>
            <div id="modal-root"></div>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
