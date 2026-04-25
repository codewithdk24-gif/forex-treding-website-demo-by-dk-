export class Router {
  constructor(routes) {
    this.routes = routes;
    this.root = document.getElementById('app');
    this.currentLayout = null; // 'full' or 'layout'
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('load', () => this.handleRoute());
  }

  async handleRoute() {
    const hash = window.location.hash.slice(1) || 'landing';
    
    // If the hash is not a defined route but is an element ID, let the browser handle it (scrolling)
    if (!this.routes[hash] && document.getElementById(hash)) {
      return;
    }

    const routeFunc = this.routes[hash] || this.routes['landing'];
    
    if (!routeFunc) return;

    // Determine if this route needs a layout
    const needsLayout = !['landing', 'auth', 'admin-login'].includes(hash);
    
    // Auth Protection: Redirect to auth if trying to access terminal without login
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (needsLayout && !user) {
      window.location.hash = 'auth';
      return;
    }

    const newLayoutType = needsLayout ? 'layout' : 'full';

    const content = await routeFunc();

    // If we are staying in the same layout type, only update the inner content
    const innerContainer = document.getElementById('router-view');
    
    if (this.currentLayout === newLayoutType && innerContainer && newLayoutType === 'layout') {
      // Smooth transition for inner content
      innerContainer.style.opacity = '0';
      innerContainer.style.transform = 'translateY(10px)';
      
      setTimeout(() => {
        innerContainer.innerHTML = content;
        innerContainer.style.opacity = '1';
        innerContainer.style.transform = 'translateY(0)';
        window.dispatchEvent(new CustomEvent('pageLoaded', { detail: { page: hash } }));
      }, 150);
    } else {
      // Full layout change
      this.root.style.opacity = '0';
      
      setTimeout(async () => {
        if (needsLayout) {
          // Import Layout dynamically or use the imported one
          // For simplicity, we assume Layout(content) is what main.js used to return
          // But now we handle it here
          const { Layout } = await import('../components/Layout');
          this.root.innerHTML = Layout(`<div id="router-view" class="transition-all duration-300">${content}</div>`);
        } else {
          this.root.innerHTML = content;
        }
        
        this.root.style.opacity = '1';
        this.currentLayout = newLayoutType;
        window.dispatchEvent(new CustomEvent('pageLoaded', { detail: { page: hash } }));
      }, 150);
    }
  }

  static navigate(hash) {
    window.location.hash = hash;
  }
}
