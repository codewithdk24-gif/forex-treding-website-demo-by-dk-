'use client';
import dynamic from 'next/dynamic';

const WithdrawPage = dynamic(
  () => import('../../../pages/WithdrawPage'),
  { ssr: false }
);

export default function Route() {
  return <WithdrawPage />;
}
