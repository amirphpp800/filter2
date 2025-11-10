// Unified Loader System - سیستم یکپارچه لودینگ و مسیریابی
(function() {
    'use strict';

    // State Management
    const state = {
        isLoading: false,
        progress: 0,
        resourcesLoaded: 0,
        totalResources: 0,
        progressInterval: null,
        loader: null,
        loadStartTime: 0
    };

    // Configuration
    const config = {
        minLoadTime: 500,           // حداقل زمان نمایش loader (ms)
        maxLoadTime: 15000,         // حداکثر زمان انتظار (ms)
        progressSpeed: 100,         // سرعت پیشرفت خودکار (ms)
        fadeOutDuration: 400,       // مدت زمان fade out (ms)
        enableTransitions: true     // فعال/غیرفعال کردن transitions
    };

    // ==================== DOM Utilities ====================
    
    function createElement(html) {
        const template = document.createElement('template');
        template.innerHTML = html.trim();
        return template.content.firstChild;
    }

    function getElement(selector) {
        return document.querySelector(selector);
    }

    // ==================== Loader Creation ====================

    function createLoader() {
        if (state.loader) return state.loader;

        const loaderHTML = `
            <div class="unified-loader" id="unifiedLoader">
                <div class="loader-progress-bar" id="loaderProgressBar"></div>
                <div class="loader-content">
                    <div class="loader-logo">
                        <img src="assets/logo/logotype.svg" alt="فیلتربین" width="200" height="60">
                    </div>
                    <div class="loader-spinner">
                        <div class="spinner-ring"></div>
                        <div class="spinner-ring"></div>
                        <div class="spinner-ring"></div>
                    </div>
                    <div class="loader-text">
                        <span class="loading-message">در حال بارگذاری</span>
                        <span class="loader-dots">
                            <span>.</span><span>.</span><span>.</span>
                        </span>
                    </div>
                    <div class="loader-percentage" id="loaderPercentage">0%</div>
                </div>
            </div>
        `;

        state.loader = createElement(loaderHTML);
        document.body.insertBefore(state.loader, document.body.firstChild);
        
        return state.loader;
    }

    // ==================== Progress Management ====================

    function updateProgress(newProgress, message) {
        if (newProgress <= state.progress) return;
        
        state.progress = Math.min(100, newProgress);
        
        const progressBar = getElement('#loaderProgressBar');
        const percentage = getElement('#loaderPercentage');
        const messageEl = getElement('.loading-message');
        
        if (progressBar) {
            progressBar.style.width = `${state.progress}%`;
        }
        
        if (percentage) {
            percentage.textContent = `${Math.floor(state.progress)}%`;
        }
        
        if (message && messageEl) {
            messageEl.textContent = message;
        }
    }

    function startAutoProgress() {
        if (state.progressInterval) return;
        
        state.progressInterval = setInterval(() => {
            if (state.progress < 70) {
                const increment = state.progress < 30 ? 2 : 
                                 state.progress < 50 ? 1.5 : 
                                 state.progress < 60 ? 1 : 0.5;
                updateProgress(state.progress + increment);
            }
        }, config.progressSpeed);
    }

    function stopAutoProgress() {
        if (state.progressInterval) {
            clearInterval(state.progressInterval);
            state.progressInterval = null;
        }
    }

    // ==================== Resource Tracking ====================

    function trackResources() {
        const resources = {
            images: document.querySelectorAll('img:not([data-no-track])'),
            stylesheets: document.querySelectorAll('link[rel="stylesheet"]'),
            scripts: document.querySelectorAll('script[src]')
        };

        state.totalResources = resources.images.length + 
                              resources.stylesheets.length + 
                              resources.scripts.length;

        // Track images
        resources.images.forEach(img => {
            if (img.complete) {
                onResourceLoaded();
            } else {
                img.addEventListener('load', onResourceLoaded, { once: true });
                img.addEventListener('error', onResourceLoaded, { once: true });
            }
        });

        // Track stylesheets
        resources.stylesheets.forEach(link => {
            if (link.sheet) {
                onResourceLoaded();
            } else {
                link.addEventListener('load', onResourceLoaded, { once: true });
                link.addEventListener('error', onResourceLoaded, { once: true });
            }
        });

        // Track scripts
        resources.scripts.forEach(script => {
            if (script.hasAttribute('data-loaded')) {
                onResourceLoaded();
            } else {
                script.addEventListener('load', onResourceLoaded, { once: true });
                script.addEventListener('error', onResourceLoaded, { once: true });
            }
        });
    }

    function onResourceLoaded() {
        state.resourcesLoaded++;
        
        if (state.totalResources > 0) {
            const resourceProgress = Math.floor((state.resourcesLoaded / state.totalResources) * 30);
            updateProgress(70 + resourceProgress);
        }

        // Check if all resources loaded
        if (state.resourcesLoaded >= state.totalResources) {
            updateProgress(100, 'تکمیل شد');
        }
    }

    // ==================== Show/Hide Loader ====================

    function showLoader(message = 'در حال بارگذاری') {
        if (state.isLoading) return;
        
        state.isLoading = true;
        state.progress = 0;
        state.resourcesLoaded = 0;
        state.totalResources = 0;
        state.loadStartTime = Date.now();
        
        createLoader();
        updateProgress(0, message);
        startAutoProgress();
        
        // Make body visible but dimmed
        document.body.style.opacity = '1';
        state.loader.classList.remove('hidden');
        
        return state.loader;
    }

    function hideLoader(force = false) {
        if (!state.isLoading && !force) return;
        
        stopAutoProgress();
        
        // Ensure loader is shown for minimum time
        const elapsedTime = Date.now() - state.loadStartTime;
        const remainingTime = force ? 0 : Math.max(0, config.minLoadTime - elapsedTime);
        
        setTimeout(() => {
            updateProgress(100, 'تکمیل شد');
            
            setTimeout(() => {
                if (state.loader) {
                    state.loader.classList.add('hidden');
                    document.body.classList.add('loaded');
                    document.body.style.opacity = '1';
                }
                
                state.isLoading = false;
                
                // Remove from DOM after animation
                setTimeout(() => {
                    if (state.loader && state.loader.parentNode) {
                        state.loader.remove();
                        state.loader = null;
                    }
                }, config.fadeOutDuration);
                
                // Dispatch event
                document.dispatchEvent(new CustomEvent('loaderHidden'));
            }, 300);
        }, remainingTime);
    }

    // ==================== Page Load Management ====================

    function initPageLoad() {
        showLoader('در حال بارگذاری صفحه');
        
        // Track resources after a short delay
        setTimeout(() => {
            trackResources();
        }, 100);

        // Handle page load events
        if (document.readyState === 'complete') {
            handlePageComplete();
        } else {
            window.addEventListener('load', handlePageComplete, { once: true });
            
            // Fallback timeout
            setTimeout(() => {
                if (state.isLoading) {
                    hideLoader(true);
                }
            }, config.maxLoadTime);
        }
    }

    function handlePageComplete() {
        // Wait for components to load
        const checkComponents = setInterval(() => {
            const componentsLoaded = document.body.hasAttribute('data-components-loaded') ||
                                   window.componentsLoaded === true;
            
            if (componentsLoaded || !state.isLoading) {
                clearInterval(checkComponents);
                hideLoader();
            }
        }, 100);
        
        // Timeout for component check
        setTimeout(() => {
            clearInterval(checkComponents);
            if (state.isLoading) {
                hideLoader();
            }
        }, 3000);
    }

    // ==================== Navigation Management ====================

    function navigateTo(url, transition = true) {
        if (!transition || !config.enableTransitions) {
            window.location.href = url;
            return;
        }

        showLoader('در حال انتقال');
        
        // Fade out
        document.body.style.transition = 'opacity 0.3s ease';
        document.body.style.opacity = '0.7';
        
        setTimeout(() => {
            window.location.href = url;
        }, 300);
    }

    // ==================== Public API ====================

    window.UnifiedLoader = {
        show: showLoader,
        hide: hideLoader,
        updateProgress: updateProgress,
        navigateTo: navigateTo,
        
        // Configuration
        config: config,
        
        // State (read-only)
        get isLoading() { return state.isLoading; },
        get progress() { return state.progress; }
    };

    // Legacy compatibility
    window.showLoading = showLoader;
    window.hideLoading = hideLoader;

    // ==================== Auto-init ====================

    // Initialize on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPageLoad);
    } else {
        initPageLoad();
    }

    // Handle page unload
    window.addEventListener('beforeunload', () => {
        if (config.enableTransitions) {
            document.body.style.opacity = '0.7';
        }
    });

    // Handle page show (browser back/forward)
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            document.body.style.opacity = '1';
            hideLoader(true);
        }
    });

})();
