'use client';
import { createDynamicPage } from '../../components/DynamicPage';

const Page = createDynamicPage(
  () => import('../../vanillaPages/AuthPage'),
  'auth',
  'AuthPage'
);

export default Page;