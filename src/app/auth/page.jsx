'use client';
import dynamic from 'next/dynamic';

const AuthPage = dynamic(
  () => import('../../pages/AuthPage'),
  { ssr: false }
);

export default function Route() {
  return <AuthPage />;
}