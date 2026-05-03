'use client';
import { createDynamicPage } from '../../components/DynamicPage';

const Page = createDynamicPage(
  () => import('../../vanillaPages/AuthPage'),
  'admin-login',
  'AuthPage'
);

export default Page;