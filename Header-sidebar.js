// Enhanced Header and Sidebar Component with Improved Toggle Functionality
class AppHeaderSidebar {
    static init() {
        this.render();
        this.bindEvents();
        this.loadTheme();
    }

    static render() {
        // Get business info from authData
        const authData = JSON.parse(localStorage.getItem('authData'));
        const businessName = authData?.businessInfo?.shortName || 'PowerSoft BIZ';
        const businessLogo = authData?.businessInfo?.logo || '';
        
        // Create header HTML
        const header = `
            <header class="app-header" id="app-header" style="position: fixed; top: 0; left: 0; width: 100%; height: 50px; z-index: 100;">
                <div class="header-left">
                    <button class="sidebar-toggle" aria-label="Toggle sidebar">
                        <i class="fas fa-bars"></i>
                    </button>
                    <h1 class="logo">
                        ${businessLogo ? 
                            `<img src="${businessLogo}" alt="${businessName}" class="business-logo">` : 
                            `<i class="fas fa-store"></i>`
                        }
                        <span>${businessName}</span>
                    </h1>
                </div>
                <div class="header-right">
                    <button class="theme-toggle" aria-label="Toggle theme">
                        <i class="fas fa-moon"></i>
                    </button>
                    <a href="profile.html" style="text-decoration: none; color: white;"><div class="user-profile">
    <span class="username">${authData?.name || 'Username'}</span>
    ${authData?.image ? 
        `<img src="${authData.image}" alt="Profile" class="profile-image">` : 
        '<i class="fas fa-user-circle"></i>'}
</div></a>
                </div>
            </header>
        `;
        
        // Create sidebar
        const sidebar = document.createElement('aside');
        sidebar.className = 'app-sidebar';
        sidebar.innerHTML = `
            <nav>
                <ul>${this.generateNavItems()}</ul>
            </nav>
        `;
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        
        // Insert into DOM
        const headerContainer = document.getElementById('header');
        if (headerContainer) {
            headerContainer.innerHTML = header;
        }
        
        document.body.insertAdjacentElement('afterbegin', sidebar);
        document.body.insertAdjacentElement('afterbegin', overlay);
        
        // Highlight current page
        this.highlightCurrentPage();
        this.addStyles();
    }

    // method to check page permissions
    static hasPagePermission(page) {
        const authData = JSON.parse(localStorage.getItem('authData'));
        if (!authData) return false;
        
        // Always allow index and login pages
        if (page === 'index.html' || page === 'login.html') return true;
        
        // Check if user has permission for this page
        return authData.permissions?.pages?.includes(page) || 
               authData.permissions?.pages?.includes('all');
    }

    // Update the generateNavItems method to include the footer in the main nav list
static generateNavItems() {
    // Define all navigation items
    const navItems = [
        { icon: 'tachometer-alt', text: 'Dashboard', href: 'index.html' },
        { type: 'divider' },
        { icon: 'boxes', text: 'Inventory', href: 'inventory.html', restricted: true },
        { icon: 'truck', text: 'Order Tracking', href: 'order-tracking.html', restricted: true },
        { icon: 'shopping-cart', text: 'Sales', href: 'sales.html', restricted: true },
        { icon: 'clipboard-list', text: 'Daily Stock', href: 'daily-stock.html', restricted: true },
        { type: 'divider' },
        { icon: 'money-bill-wave', text: 'Finance', href: 'finance.html' },
        { icon: 'chart-line', text: 'Profit and Loss', href: 'profit.html' },
        { icon: 'users', text: 'Customers', href: 'customers.html', restricted: true },
        { icon: 'chart-pie', text: 'Reports', href: 'reports.html' },
        { type: 'divider' },
        { icon: 'cog', text: 'Settings', href: 'settings.html' },
        { icon: 'code', text: 'Web Engine', href: 'web-engine.html' },
        { icon: 'lightbulb', text: 'Upcoming Features', href: 'upcoming-features.html' },
        { type: 'divider' },
        { icon: 'laptop-code', text: 'Related Softwares', href: 'related-softwares.html' },
        { icon: 'ad', text: 'Adverts', href: 'ads.html' },
        { icon: 'headset', text: 'Contact Support', href: 'contact.html' },
        { type: 'divider' },
        { 
            icon: 'sign-out-alt', 
            text: 'Logout', 
            href: '#',
            onclick: 'logout()'
        }
    ];

    // Generate HTML for navigation items
    let navHTML = '';
    let previousWasDivider = false;

    navItems.forEach(item => {
        if (item.type === 'divider') {
            // Only add divider if it's not the first item and previous wasn't a divider
            if (navHTML && !previousWasDivider) {
                navHTML += `<li class="divider"><hr></li>`;
                previousWasDivider = true;
            }
        } 
        else {
            // Skip restricted items unless user has permission
            if (item.restricted && !this.hasPagePermission(item.href.split('/').pop())) {
                return;
            }
            
            navHTML += `
                <li>
                    <a href="${item.href}" onclick="${item.onclick}">
                        <i class="fas fa-${item.icon}"></i>
                        <span>${item.text}</span>
                    </a>
                </li>
            `;
            previousWasDivider = false;
        }
    });

    return navHTML;
}

    static addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Header Styles */
            .app-header {
                background: linear-gradient(10deg, #0054e3, #75f9a6);
                color: white;
                padding: 0 1rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                box-shadow: var(--shadow-sm);
                line-height: 1;
            }
            
            .header-left, .header-right {
                display: flex;
                align-items: center;
                gap: 1px;
            }
            
            .sidebar-toggle {
                background: none;
                color: white;
                margin-right: 5px;
                border: none;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 50%;
                transition: all 0.3s ease;
            }
            
            .sidebar-toggle:hover {
                background-color: rgba(0,0,0,0.05);
            }
            
            .logo {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                font-size: 1.25rem;
                font-weight: 600;
                margin: 0;
            }
            
            .business-logo {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                object-fit: contain;
            }
            
            .theme-toggle {
                background: none;
                color: white;
                border: none;
                font-size: 1.1rem;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 50%;
                transition: all 0.3s ease;
            }
            
            .theme-toggle:hover {
                background-color: rgba(0,0,0,0.05);
            }
            
            .user-profile {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                cursor: pointer;
                padding: 0.25rem 0.75rem;
                border-radius: 1.5rem;
                transition: all 0.3s ease;
            }
            
            .user-profile:hover {
                background-color: rgba(0,0,0,0.05);
            }
            
            .username {
                font-weight: 500;
                font-size: 0.875rem;
            }
            
            .profile-image {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                object-fit: cover;
            }
            
            .user-profile i {
                font-size: 1.5rem;
            }
            
            /* Sidebar Styles */
            .app-sidebar {
                width: 250px;
                background-color: white;
                position: fixed;
                top: 50px;
                left: 0;
                bottom: 0;
                z-index: 90;
                box-shadow: var(--shadow-sm);
                transition: transform 0.3s ease;
                overflow-y: auto;
                transform: translateX(-100%);
            }
            
            .app-sidebar nav ul {
                list-style: none;
                padding: 1rem 0;
                margin: 0;
            }
            
            .app-sidebar nav li {
                margin: 0;
            }
            
            .app-sidebar nav a {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 0.75rem 1.5rem;
                color: var(--text-color);
                text-decoration: none;
                transition: all 0.3s ease;
                border-left: 3px solid transparent;
            }
            
            .app-sidebar nav a:hover {
                background-color: rgba(0,0,0,0.05);
                color: var(--primary);
            }
            
            .app-sidebar nav li.active a {
                background-color: rgba(52, 152, 219, 0.1);
                color: var(--primary);
                border-left-color: var(--primary);
            }
            
            .app-sidebar nav i {
                width: 1.25rem;
                text-align: center;
            }
            
            .app-sidebar nav .divider {
                padding: 0.5rem 0;
                margin: 0.5rem 0;
            }
            
            .app-sidebar nav .divider hr {
                border: none;
                border-top: 1px solid var(--border-color);
                margin: 0 1.5rem;
            }
            
            /* Sidebar open state */
            body.sidebar-open .app-sidebar {
                transform: translateX(0);
            }
            
            /* Main content adjustment */
            .main-content {
                margin-top: 50px;
                transition: margin-left 0.3s ease;
            }
            
            /* Sidebar footer styles */
.sidebar-footer {
    position: sticky;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 1rem 0;
    background-color: var(--bg-color);
    border-top: 1px solid red;
    margin-top: auto; /* Push to bottom */
}

/* Adjust sidebar to use flex layout */
.app-sidebar nav ul {
    list-style: none;
    padding: 1rem 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    height: calc(100% - 60px); /* Account for header */
    min-height: calc(100vh - 110px); /* Full viewport minus header and footer */
}

/* Remove the fixed padding-bottom from sidebar */
.app-sidebar {
    padding-bottom: 0;
    display: flex;
    flex-direction: column;
}

            /* Overlay styles */
            .sidebar-overlay {
                position: fixed;
                top: 50px;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0,0,0,0.5);
                z-index: 80;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            body.sidebar-open .sidebar-overlay {
                opacity: 1;
                visibility: visible;
            }
            
            /* Dark mode styles */
            body.dark-mode {
                background-color: #2c3e50;
                color: #ecf0f1;
            }
            
            body.dark-mode .app-header,
            body.dark-mode .app-sidebar {
                background: linear-gradient(10deg, #033b9d, #046829);
            }
            
            body.dark-mode .app-sidebar {
                background-color: #1a1a2e;
            }
            
            body.dark-mode .app-sidebar nav a:hover {
                background-color: rgba(255,255,255,0.1);
            }
            
            body.dark-mode .sidebar-footer {
                background: #1a1a2e;
            }
            
            body.dark-mode .app-sidebar nav .divider hr {
                border-top-color: #2d3748;
            }
            
            /* Responsive styles */
            @media (min-width: 769px) {
                .app-sidebar {
                    transform: translateX(0);
                }
                
                .main-content {
                    margin-left: 250px;
                }
                
                .sidebar-overlay {
                    display: none;
                }
            }
        `;
        document.head.appendChild(style);
    }

    static bindEvents() {
        // Sidebar toggle
        document.addEventListener('click', (e) => {
            const toggleBtn = e.target.closest('.sidebar-toggle');
            if (toggleBtn) {
                this.toggleSidebar();
            }
        });
        
        // Close sidebar when clicking on nav links
        document.querySelectorAll('.app-sidebar a').forEach(link => {
            link.addEventListener('click', () => {
                this.closeSidebar();
            });
        });
        
        // Close sidebar when clicking overlay
        document.querySelector('.sidebar-overlay').addEventListener('click', () => {
            this.closeSidebar();
        });
        
        // Theme toggle
        document.addEventListener('click', (e) => {
            if (e.target.closest('.theme-toggle')) {
                this.toggleDarkMode();
            }
        });
        
        // Restore sidebar state for desktop
        if (window.innerWidth >= 769) {
            document.body.classList.add('sidebar-open');
        }
    }

    static toggleSidebar() {
        document.body.classList.toggle('sidebar-open');
        this.updateToggleIcon();
    }

    static closeSidebar() {
        document.body.classList.remove('sidebar-open');
        this.updateToggleIcon();
    }

    static updateToggleIcon() {
        const icon = document.querySelector('.sidebar-toggle i');
        if (icon) {
            icon.className = document.body.classList.contains('sidebar-open') 
                ? 'fas fa-times' 
                : 'fas fa-bars';
        }
    }

    static toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        this.updateThemeIcon();
    }

    static loadTheme() {
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
        }
        this.updateThemeIcon();
    }

    static updateThemeIcon() {
        const icon = document.querySelector('.theme-toggle i');
        if (icon) {
            icon.className = document.body.classList.contains('dark-mode') 
                ? 'fas fa-sun' 
                : 'fas fa-moon';
        }
    }

    static highlightCurrentPage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.app-sidebar a').forEach(link => {
            const li = link.parentElement;
            if (link.getAttribute('href') === currentPage) {
                li.classList.add('active');
            } else {
                li.classList.remove('active');
            }
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => AppHeaderSidebar.init());

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth >= 769) {
        document.body.classList.add('sidebar-open');
    } else {
        document.body.classList.remove('sidebar-open');
    }
    AppHeaderSidebar.updateToggleIcon();
});