const fs = require('fs');
const path = require('path');

const appDir = path.join(process.cwd(), 'src/app');

const routes = [
  { path: '', name: 'landing', component: 'LandingPage', file: 'LandingPage' },
  { path: 'auth', name: 'auth', component: 'AuthPage', file: 'AuthPage' },
  { path: 'admin-login', name: 'admin-login', component: 'AuthPage', file: 'AuthPage' },
  { path: 'dashboard', name: 'dashboard', component: 'DashboardPage', file: 'DashboardPage' },
  { path: 'markets', name: 'markets', component: 'MarketsPage', file: 'MarketsPage' },
  { path: 'orders', name: 'orders', component: 'OrdersPage', file: 'OrdersPage' },
  { path: 'wallet', name: 'wallet', component: 'WalletPage', file: 'WalletPage' },
  { path: 'admin', name: 'admin', component: 'AdminPage', file: 'AdminPage' }
];

routes.forEach(r => {
  const dir = path.join(appDir, r.path);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  const relPath = r.path === '' ? '../vanillaPages' : '../../vanillaPages';
  const compPath = r.path === '' ? '../components' : '../../components';
  
  const content = `
'use client';
import { createDynamicPage } from '${compPath}/DynamicPage';

const Page = createDynamicPage(
  () => import('${relPath}/${r.file}'),
  '${r.name}',
  '${r.component}'
);

export default Page;
`;

  fs.writeFileSync(path.join(dir, 'page.jsx'), content.trim(), 'utf-8');
});

console.log('Regenerated Next.js pages with ssr: false');
