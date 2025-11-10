// Component Loader - مدیریت بارگذاری کامپوننت‌های مشترک
(function() {
    'use strict';

    // تشخیص مسیر اصلی - استفاده از مسیر مطلق
    function getBasePath() {
        const path = window.location.pathname;
        // همیشه از مسیر مطلق استفاده می‌کنیم
        return '/';
    }

    // بارگذاری یک کامپوننت
    async function loadComponent(componentName, targetSelector) {
        try {
            const basePath = getBasePath();
            const componentPath = `${basePath}components/${componentName}.html`;
            
            const response = await fetch(componentPath);
            if (!response.ok) {
                return false;
            }
            
            let html = await response.text();
            
            // جایگزینی placeholder های مسیر
            html = html.replace(/\{\{basePath\}\}/g, basePath);
            
            // قرار دادن HTML در DOM
            const target = document.querySelector(targetSelector);
            if (target) {
                target.innerHTML = html;
                // Mark components as loaded after successful load
                if (componentName === 'footer') {
                    document.body.setAttribute('data-components-loaded', 'true');
                    window.componentsLoaded = true;
                }
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    // بارگذاری همه کامپوننت‌ها
    async function loadAllComponents() {
        const components = [
            { name: 'header', selector: '#header-placeholder' },
            { name: 'search-modal', selector: '#search-modal-placeholder' },
            { name: 'footer', selector: '#footer-placeholder' }
        ];

        const promises = components.map(comp => 
            loadComponent(comp.name, comp.selector)
        );

        await Promise.all(promises);
        
        // بعد از لود شدن کامپوننت‌ها، اسکریپت‌های مربوطه رو اجرا می‌کنیم
        initializeComponentScripts();
    }

    // راه‌اندازی اسکریپت‌های کامپوننت‌ها
    function initializeComponentScripts() {
        // منوی موبایل
        initMobileMenu();
        
        // جستجو
        initSearchModal();
        
        // تریگر event برای اطلاع به اسکریپت‌های دیگر
        document.dispatchEvent(new Event('componentsLoaded'));
    }

    // راه‌اندازی منوی موبایل
    function initMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mainNav = document.getElementById('mainNav');
        const mobileSearchBtn = document.getElementById('mobileSearchBtn');
        
        if (!mobileMenuBtn || !mainNav) return;

        let scrollPosition = 0;

        // باز و بسته کردن منو
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
            
            // مدیریت scroll صفحه
            if (mainNav.classList.contains('active')) {
                // ذخیره موقعیت scroll
                scrollPosition = window.pageYOffset;
                document.body.classList.add('menu-open');
                document.body.style.overflow = 'hidden';
                document.body.style.top = `-${scrollPosition}px`;
            } else {
                document.body.classList.remove('menu-open');
                document.body.style.overflow = '';
                document.body.style.top = '';
                // بازگشت به موقعیت قبلی
                window.scrollTo(0, scrollPosition);
            }
        });

        // دکمه جستجو در منوی موبایل
        if (mobileSearchBtn) {
            mobileSearchBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // بستن منوی موبایل
                mobileMenuBtn.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.style.overflow = '';
                
                // باز کردن مودال جستجو
                setTimeout(() => {
                    const searchModal = document.getElementById('searchModal');
                    const searchOverlay = document.getElementById('searchOverlay');
                    const searchInput = document.getElementById('searchInput');
                    
                    if (searchModal && searchOverlay) {
                        searchModal.classList.add('active');
                        searchOverlay.classList.add('active');
                        document.body.style.overflow = 'hidden';
                        
                        if (searchInput) {
                            searchInput.value = '';
                            setTimeout(() => searchInput.focus(), 100);
                        }
                    }
                }, 350);
            });
        }

        // تابع بستن منو
        function closeMenu() {
            mobileMenuBtn.classList.remove('active');
            mainNav.classList.remove('active');
            document.body.classList.remove('menu-open');
            document.body.style.overflow = '';
            document.body.style.top = '';
            window.scrollTo(0, scrollPosition);
        }

        // بستن منو با کلیک روی آیتم‌ها
        const menuItems = mainNav.querySelectorAll('.mobile-menu-card, .nav-item, .mobile-tool-card');
        menuItems.forEach(item => {
            item.addEventListener('click', closeMenu);
        });

        // بستن منو با کلیک بیرون
        document.addEventListener('click', function(event) {
            if (!mainNav.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
                if (mainNav.classList.contains('active')) {
                    closeMenu();
                }
            }
        });
    }

    // راه‌اندازی مودال جستجو
    function initSearchModal() {
        const searchModal = document.getElementById('searchModal');
        const searchOverlay = document.getElementById('searchOverlay');
        const searchCloseBtn = document.getElementById('searchCloseBtn');
        const headerSearchBtn = document.getElementById('headerSearchBtn');
        const headerSearchInput = document.getElementById('headerSearchInput');
        const searchInput = document.getElementById('searchInput');

        if (!searchModal || !searchOverlay) return;

        // باز کردن مودال از هدر
        if (headerSearchBtn) {
            headerSearchBtn.addEventListener('click', openSearchModal);
        }
        
        if (headerSearchInput) {
            headerSearchInput.addEventListener('click', openSearchModal);
        }

        // بستن مودال
        if (searchCloseBtn) {
            searchCloseBtn.addEventListener('click', closeSearchModal);
        }
        
        if (searchOverlay) {
            searchOverlay.addEventListener('click', closeSearchModal);
        }

        // بستن با ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && searchModal.classList.contains('active')) {
                closeSearchModal();
            }
        });

        function openSearchModal(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            searchModal.classList.add('active');
            searchOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            if (searchInput) {
                searchInput.value = '';
                setTimeout(() => searchInput.focus(), 100);
            }
        }

        function closeSearchModal() {
            searchModal.classList.remove('active');
            searchOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // شروع بارگذاری وقتی DOM آماده شد
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAllComponents);
    } else {
        loadAllComponents();
    }

})();
