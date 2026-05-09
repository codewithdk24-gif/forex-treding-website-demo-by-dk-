'use client';
import dynamic from 'next/dynamic';

const DepositPage = dynamic(
  () => import('../../../pages/DepositPage'),
  { ssr: false }
);

export default function Route() {
  return <DepositPage />;
}
