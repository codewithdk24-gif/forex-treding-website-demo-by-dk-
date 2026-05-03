'use client';
import dynamic from 'next/dynamic';

const WalletPage = dynamic(
  () => import('../../vanillaPages/WalletPage').then(mod => mod.WalletPage),
  { ssr: false }
);

export default function Route() {
  return <WalletPage />;
}