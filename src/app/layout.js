import "../style.css";
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: 'ForexPro - Institutional Trading Terminal',
  description: 'Access institutional grade liquidity and precision execution in real-time.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="bg-[#0f1115]">
        <AuthProvider>
          {children}
          <div id="modal-root"></div>
        </AuthProvider>
      </body>
    </html>
  );
}