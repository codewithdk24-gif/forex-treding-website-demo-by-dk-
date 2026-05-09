'use client';
import dynamic from 'next/dynamic';

const WalletPage = dynamic(
  () => import('../../pages/WalletPage'),
  { ssr: false }
);

export default function Route() {
  return <WalletPage />;
}