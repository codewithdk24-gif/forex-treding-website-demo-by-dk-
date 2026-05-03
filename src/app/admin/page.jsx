'use client';
import { createDynamicPage } from '../../components/DynamicPage';

const Page = createDynamicPage(
  () => import('../../vanillaPages/AdminPage'),
  'admin',
  'AdminPage'
);

export default Page;