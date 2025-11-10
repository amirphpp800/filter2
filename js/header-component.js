// Header Component with Mobile Menu
(function() {
    'use strict';

    // Detect if we're in a subdirectory
    function getBasePath() {
        const path = window.location.pathname;
        return path.includes('/pages/') ? '../' : '';
    }

    // Mobile Menu HTML Template
    function getMobileMenuHTML() {
        const basePath = getBasePath();
        return `
        <div class="mobile-menu-grid">
            <a href="${basePath}index.html" class="mobile-menu-card">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                <span>خانه</span>
            </a>
            <a href="${basePath}pages/tools.html" class="mobile-menu-card">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                </svg>
                <span>ابزارها</span>
            </a>
            <a href="${basePath}pages/articles.html" class="mobile-menu-card">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                <span>یادداشت‌ها</span>
            </a>
            <a href="${basePath}pages/podcasts.html" class="mobile-menu-card">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="23"></line>
                    <line x1="8" y1="23" x2="16" y2="23"></line>
                </svg>
                <span>پادکست‌ها</span>
            </a>
            <a href="${basePath}pages/about.html" class="mobile-menu-card">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 17V11" stroke="#ff4444" stroke-width="1.5" stroke-linecap="round"></path>
                    <circle cx="1" cy="1" r="1" transform="matrix(1 0 0 -1 11 9)" fill="#ff4444"></circle>
                    <path d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7" stroke="#ff4444" stroke-width="1.5" stroke-linecap="round"></path>
                </svg>
                <span>درباره</span>
            </a>
        </div>
        <button class="mobile-search-box" id="mobileSearchBtn">
            <span>جستجو</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
            </svg>
        </button>
    `;
    }

    // Initialize Mobile Menu
    function initMobileMenu() {
        const mainNav = document.getElementById('mainNav');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        
        if (!mainNav || !mobileMenuBtn) return;

        // Insert mobile menu HTML if not exists
        if (!mainNav.querySelector('.mobile-menu-grid')) {
            const desktopNav = mainNav.innerHTML;
            mainNav.innerHTML = getMobileMenuHTML() + desktopNav;
        }

        // Get elements after insertion
        const mobileSearchBtn = document.getElementById('mobileSearchBtn');

        // Mobile Menu Toggle
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
            
            // Toggle body scroll
            if (mainNav.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Mobile search button
        if (mobileSearchBtn) {
            mobileSearchBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Close mobile menu first
                if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
                if (mainNav) mainNav.classList.remove('active');
                document.body.style.overflow = '';
                
                // Small delay to let menu close
                setTimeout(() => {
                    // Open search modal
                    const searchModal = document.getElementById('searchModal');
                    const searchOverlay = document.getElementById('searchOverlay');
                    const searchInput = document.getElementById('searchInput');
                    
                    if (searchModal && searchOverlay) {
                        searchModal.classList.add('active');
                        searchOverlay.classList.add('active');
                        document.body.style.overflow = 'hidden';
                        
                        // Clear and focus
                        if (searchInput) {
                            searchInput.value = '';
                            setTimeout(() => {
                                searchInput.focus();
                            }, 100);
                        }
                    }
                }, 350);
            });
        }

        // Close menu when clicking on menu cards or links
        const menuCards = mainNav.querySelectorAll('.mobile-menu-card, .mobile-menu-link');
        menuCards.forEach(card => {
            card.addEventListener('click', function() {
                mobileMenuBtn.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mainNav.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
                mobileMenuBtn.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileMenu);
    } else {
        initMobileMenu();
    }

})();
