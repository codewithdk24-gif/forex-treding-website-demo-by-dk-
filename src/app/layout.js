import "../style.css";

export const metadata = {
  title: 'ForexPro - Institutional Trading Terminal',
  description: 'Access institutional grade liquidity and precision execution in real-time.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0f1115]">
        {children}
        <div id="modal-root"></div>
      </body>
    </html>
  );
}