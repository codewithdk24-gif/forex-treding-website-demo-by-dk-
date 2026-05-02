import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const Layout = (content) => {
  return `
    <div class="flex min-h-screen bg-[#0f1115]">
      <!-- Mobile Sidebar Drawer -->
      <div id="sidebar-overlay" onclick="window.toggleSidebar()" class="drawer-overlay lg:hidden"></div>
      ${Sidebar(true)}

      <!-- Desktop Sidebar -->
      ${Sidebar(false)}

      <div class="flex-1 flex flex-col min-w-0">
        ${Header()}
        
        <main id="main-content" class="flex-1 flex flex-col overflow-hidden relative">
          <div id="content-scroll-container" class="flex-1 overflow-y-auto scroll-smooth">
            ${content}
          </div>
        </main>
      </div>
    </div>
  `;
};
