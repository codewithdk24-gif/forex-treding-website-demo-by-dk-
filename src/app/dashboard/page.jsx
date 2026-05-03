'use client';
import dynamic from 'next/dynamic';

const DashboardPage = dynamic(
  () => import('../../vanillaPages/DashboardPage').then(mod => mod.DashboardPage),
  { ssr: false }
);

export default function Route() {
  return <DashboardPage />;
}