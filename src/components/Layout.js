import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { OrderPanel } from './OrderPanel';
import { MobileTerminal } from './MobileTerminal';

export const Layout = (content) => {
  const currentHash = window.location.hash.slice(1) || 'dashboard';

  return `
    <div class="flex min-h-screen bg-[#0f1115]">
      <!-- Mobile Sidebar Drawer -->
      <div id="sidebar-overlay" onclick="window.toggleSidebar()" class="drawer-overlay lg:hidden"></div>
      ${Sidebar(true)}

      <!-- Desktop Sidebar -->
      ${Sidebar(false)}
      

      <!-- Trade Bottom Sheet for Mobile -->
      <div id="sheet-overlay" onclick="window.toggleBottomSheet(false)" class="drawer-overlay lg:hidden" style="z-index: 240;"></div>
      <div id="trade-bottom-sheet" class="bottom-sheet lg:hidden">
        <div class="bottom-sheet-handle"></div>
        <div class="p-4 sm:p-6">
           ${OrderPanel(true)}
        </div>
      </div>
      
      <div class="flex-1 flex flex-col min-w-0">
        ${Header()}
        
        <main id="main-content" class="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          <div id="content-scroll-container" class="flex-1 overflow-y-auto scroll-smooth">
            ${content}
          </div>
          
          <!-- Order Panel -->
          <aside id="desktop-order-panel" class="hidden lg:block">
            ${currentHash.includes('dashboard') ? OrderPanel(false) : ''}
          </aside>
        </main>
      </div>
    </div>
  `;
};

