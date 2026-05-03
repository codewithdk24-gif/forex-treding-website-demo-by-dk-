'use client';
import { createDynamicPage } from '../../components/DynamicPage';

const Page = createDynamicPage(
  () => import('../../vanillaPages/MarketsPage'),
  'markets',
  'MarketsPage'
);

export default Page;