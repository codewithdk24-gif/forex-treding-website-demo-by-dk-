'use client';
import dynamic from 'next/dynamic';

const OrdersPage = dynamic(
  () => import('../../vanillaPages/OrdersPage').then(mod => mod.OrdersPage),
  { ssr: false }
);

export default function Route() {
  return <OrdersPage />;
}