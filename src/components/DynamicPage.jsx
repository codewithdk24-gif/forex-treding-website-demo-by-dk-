'use client';
import dynamic from 'next/dynamic';

export function createDynamicPage(importPageFn, pageName, exportName) {
  return dynamic(() => Promise.all([
    importPageFn(),
    import('./PageWrapper')
  ]).then(([pageMod, pwMod]) => {
    const PageWrapper = pwMod.default;
    const pageFn = pageMod[exportName];
    return function DynamicRoute() {
      return <PageWrapper pageFn={pageFn} pageName={pageName} />;
    };
  }), { ssr: false });
}
