'use client';

import React, { useEffect, useRef, useMemo } from 'react';

export const TradingViewChart = ({ symbol = 'FX:EURUSD', theme = 'dark' }) => {
  const containerRef = useRef(null);
  const containerId = useMemo(() => `tv_chart_${Math.random().toString(36).substring(7)}`, []);

  useEffect(() => {
    // Format symbol for TradingView
    let tvSymbol = symbol;
    if (tvSymbol.includes('/')) {
      if (tvSymbol.startsWith('BTC') || tvSymbol.startsWith('ETH') || tvSymbol.startsWith('SOL') || tvSymbol.startsWith('BNB')) {
        tvSymbol = 'BINANCE:' + tvSymbol.replace('/', '');
      } else {
        tvSymbol = 'FX:' + tvSymbol.replace('/', '');
      }
    }

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (typeof window.TradingView !== 'undefined' && containerRef.current) {
        new window.TradingView.widget({
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

    return () => {
      // Cleanup if needed
    };
  }, [symbol, theme, containerId]);

  return (
    <div 
      id={containerId} 
      ref={containerRef} 
      className="w-full h-full"
    />
  );
};

export default TradingViewChart;
