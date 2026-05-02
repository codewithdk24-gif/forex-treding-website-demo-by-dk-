export const TradingViewChart = (containerId, symbol = 'FX:EURUSD', theme = 'dark') => {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Format symbol for TradingView
  let tvSymbol = symbol;
  if (tvSymbol.includes('/')) {
    if (tvSymbol.startsWith('BTC') || tvSymbol.startsWith('ETH') || tvSymbol.startsWith('SOL') || tvSymbol.startsWith('BNB')) {
      tvSymbol = 'BINANCE:' + tvSymbol.replace('/', '');
    } else {
      tvSymbol = 'FX:' + tvSymbol.replace('/', '');
    }
  }

  // Clear container
  container.innerHTML = '';

  const script = document.createElement('script');
  script.src = 'https://s3.tradingview.com/tv.js';
  script.async = true;
  script.onload = () => {
    if (typeof TradingView !== 'undefined') {
      new TradingView.widget({
        "width": "100%",
        "height": "100%",
        "symbol": tvSymbol,
        "interval": "1",
        "timezone": "Etc/UTC",
        "theme": theme,
        "style": "1",
        "locale": "en",
        "toolbar_bg": theme === 'dark' ? "#131722" : "#ffffff",
        "enable_publishing": false,
        "hide_side_toolbar": false,
        "allow_symbol_change": true,
        "container_id": containerId,
        "backgroundColor": theme === 'dark' ? "#0f1115" : "#f5f7fb",
        "gridColor": theme === 'dark' ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.03)",
      });
    }
  };
  document.head.appendChild(script);
};
