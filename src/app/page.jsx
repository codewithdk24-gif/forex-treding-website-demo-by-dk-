'use client';
import { createDynamicPage } from '../components/DynamicPage';

const Page = createDynamicPage(
  () => import('../vanillaPages/LandingPage'),
  'landing',
  'LandingPage'
);

export default Page;