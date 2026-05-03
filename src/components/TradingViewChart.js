'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';

export const TradingViewChart = ({ symbol = 'FX:EURUSD', theme = 'dark' }) => {

  const [loading, setLoading] = useState(true);
  const [tvFailed, setTvFailed] = useState(false);
  const containerRef = useRef(null);
  const widgetRef = useRef(null);
  const containerIdRef = useRef("tv_chart_main");

  useEffect(() => {
    const safetyTimeout = setTimeout(() => {
      if (!widgetRef.current) {
        setTvFailed(true);
      }
      setLoading(false);
    }, 5000);

    const initWidget = () => {
      if (typeof window === 'undefined') return;
      if (typeof TradingView !== 'undefined' && containerRef.current && !widgetRef.current) {
        let tvSymbol = symbol;
        if (tvSymbol.includes('/')) {
          if (tvSymbol.startsWith('BTC') || tvSymbol.startsWith('ETH') || tvSymbol.startsWith('SOL') || tvSymbol.startsWith('BNB')) {
            tvSymbol = 'BINANCE:' + tvSymbol.replace('/', '');
          } else {
            tvSymbol = 'FX:' + tvSymbol.replace('/', '');
          }
        }

        widgetRef.current = new window.TradingView.widget({
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
          "container_id": containerIdRef.current,
          "backgroundColor": theme === 'dark' ? "#0f1115" : "#f5f7fb",
          "gridColor": theme === 'dark' ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.03)",
        });

        setLoading(false);
        setTvFailed(false);
        clearTimeout(safetyTimeout);
      }
    };

    if (!window.TradingView) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = initWidget;
      script.onerror = () => {
        console.error("TradingView failed");
        setTvFailed(true);
        setLoading(false);
      };
      document.body.appendChild(script);
    } else {
      initWidget();
    }

    return () => {
      clearTimeout(safetyTimeout);
      if (widgetRef.current) {
        try {
          widgetRef.current.remove();
        } catch (e) {}
        widgetRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full h-full relative bg-[#0f1115]">
      {loading && !tvFailed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-50">
          <div className="animate-spin h-10 w-10 border-t-2 border-blue-500 rounded-full"></div>
          <p className="text-xs text-gray-500 mt-2">Connecting to market...</p>
        </div>
      )}

      {tvFailed && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm bg-[#0f1115] z-40">
          ⚠️ Live chart unavailable (fallback mode)
        </div>
      )}

      <div id={containerIdRef.current} ref={containerRef} className={`w-full h-full ${loading && !tvFailed ? 'opacity-0' : 'opacity-100 transition-opacity duration-1000'}`} />
    </div>
  );
};
