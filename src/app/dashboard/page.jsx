'use client';
import dynamic from 'next/dynamic';

const DashboardPage = dynamic(
  () => import('../../pages/DashboardPage'),
  { ssr: false }
);

export default function Route() {
  return <DashboardPage />;
}