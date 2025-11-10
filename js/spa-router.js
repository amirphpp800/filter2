// SPA Router - سیستم مسیریابی تک‌صفحه‌ای
(function() {
    'use strict';

    // Router State
    const state = {
        currentRoute: null,
        previousRoute: null,
        routes: new Map(),
        middlewares: [],
        isNavigating: false,
        history: []
    };

    // Router Configuration
    const config = {
        mode: 'history',           // 'history' or 'hash'
        basePath: '',              // Base path for the app
        enableTransitions: true,   // Enable page transitions
        scrollBehavior: 'smooth',  // 'smooth', 'auto', or 'instant'
        transitionDuration: 300    // ms
    };

    // ==================== Route Class ====================

    class Route {
        constructor(path, options = {}) {
            this.path = path;
            this.name = options.name || path;
            this.component = options.component;
            this.beforeEnter = options.beforeEnter;
            this.meta = options.meta || {};
            this.regex = this.pathToRegex(path);
        }

        pathToRegex(path) {
            // Convert path to regex pattern
            const pattern = path
                .replace(/\//g, '\\/')
                .replace(/:(\w+)/g, '(?<$1>[^/]+)')
                .replace(/\*/g, '.*');
            return new RegExp(`^${pattern}$`);
        }

        match(pathname) {
            return this.regex.exec(pathname);
        }

        extractParams(pathname) {
            const match = this.match(pathname);
            return match ? match.groups || {} : {};
        }
    }

    // ==================== Router Core ====================

    function addRoute(path, options) {
        const route = new Route(path, options);
        state.routes.set(path, route);
        return route;
    }

    function removeRoute(path) {
        return state.routes.delete(path);
    }

    function getRoute(path) {
        return state.routes.get(path);
    }

    function findRoute(pathname) {
        for (const [, route] of state.routes) {
            if (route.match(pathname)) {
                return route;
            }
        }
        return null;
    }

    // ==================== Middleware ====================

    function use(middleware) {
        if (typeof middleware === 'function') {
            state.middlewares.push(middleware);
        }
    }

    async function runMiddlewares(to, from, next) {
        let index = 0;

        async function runNext() {
            if (index >= state.middlewares.length) {
                next();
                return;
            }

            const middleware = state.middlewares[index++];
            await middleware(to, from, runNext);
        }

        await runNext();
    }

    // ==================== Navigation ====================

    async function navigate(path, options = {}) {
        if (state.isNavigating) return false;

        const {
            replace = false,
            skipTransition = false,
            state: historyState = {}
        } = options;

        state.isNavigating = true;

        try {
            // Get current route
            const from = state.currentRoute;
            const to = findRoute(path);

            if (!to) {
                throw new Error(`Route not found: ${path}`);
            }

            // Extract params
            const params = to.extractParams(path);

            // Create route object
            const toRoute = {
                path,
                route: to,
                params,
                query: parseQuery(window.location.search),
                meta: to.meta,
                name: to.name
            };

            // Run beforeEnter guard
            if (to.beforeEnter) {
                const canEnter = await to.beforeEnter(toRoute, from);
                if (canEnter === false) {
                    state.isNavigating = false;
                    return false;
                }
            }

            // Run global middlewares
            let canNavigate = true;
            await runMiddlewares(toRoute, from, () => {
                canNavigate = true;
            });

            if (!canNavigate) {
                state.isNavigating = false;
                return false;
            }

            // Show loader if enabled
            if (config.enableTransitions && !skipTransition && window.UnifiedLoader) {
                window.UnifiedLoader.show('در حال انتقال');
            }

            // Transition effect
            if (config.enableTransitions && !skipTransition) {
                document.body.style.opacity = '0.7';
                await delay(config.transitionDuration);
            }

            // Update browser history
            const url = config.basePath + path;
            if (replace) {
                window.history.replaceState(historyState, '', url);
            } else {
                window.history.pushState(historyState, '', url);
            }

            // Update state
            state.previousRoute = from;
            state.currentRoute = toRoute;
            state.history.push(toRoute);

            // Dispatch navigation event
            window.dispatchEvent(new CustomEvent('routeChanged', {
                detail: { from, to: toRoute }
            }));

            // Scroll to top
            scrollToTop();

            // Hide loader
            if (window.UnifiedLoader) {
                window.UnifiedLoader.hide();
            }

            // Restore opacity
            document.body.style.opacity = '1';

            state.isNavigating = false;
            return true;

        } catch (error) {
            state.isNavigating = false;
            
            if (window.UnifiedLoader) {
                window.UnifiedLoader.hide(true);
            }

            document.body.style.opacity = '1';
            
            throw error;
        }
    }

    function back() {
        window.history.back();
    }

    function forward() {
        window.history.forward();
    }

    function go(n) {
        window.history.go(n);
    }

    // ==================== Navigation Guards ====================

    function beforeEach(guard) {
        use(guard);
    }

    function afterEach(hook) {
        window.addEventListener('routeChanged', (event) => {
            hook(event.detail.to, event.detail.from);
        });
    }

    // ==================== URL Handling ====================

    function parseQuery(queryString) {
        const query = {};
        if (!queryString) return query;

        const pairs = queryString.substring(1).split('&');
        for (const pair of pairs) {
            const [key, value] = pair.split('=');
            if (key) {
                query[decodeURIComponent(key)] = decodeURIComponent(value || '');
            }
        }
        return query;
    }

    function getFullPath() {
        if (config.mode === 'hash') {
            return window.location.hash.substring(1) || '/';
        }
        return window.location.pathname + window.location.search;
    }

    function getCurrentRoute() {
        return state.currentRoute;
    }

    // ==================== Link Handling ====================

    function handleLinkClick(event) {
        const link = event.target.closest('a[href]');
        
        if (!link) return;
        if (link.target === '_blank') return;
        if (link.hasAttribute('download')) return;
        if (link.classList.contains('no-router')) return;
        if (event.ctrlKey || event.metaKey || event.shiftKey) return;

        const href = link.getAttribute('href');
        
        // Skip external links
        if (href.startsWith('http') || href.startsWith('//')) return;
        
        // Skip hash links on same page
        if (href.startsWith('#')) return;
        
        // Skip mailto and tel links
        if (href.startsWith('mailto:') || href.startsWith('tel:')) return;

        event.preventDefault();
        navigate(href);
    }

    // ==================== Browser Navigation ====================

    function handlePopState(event) {
        const path = getFullPath();
        const route = findRoute(path);

        if (route) {
            const params = route.extractParams(path);
            const to = {
                path,
                route,
                params,
                query: parseQuery(window.location.search),
                meta: route.meta,
                name: route.name
            };

            state.previousRoute = state.currentRoute;
            state.currentRoute = to;

            window.dispatchEvent(new CustomEvent('routeChanged', {
                detail: {
                    from: state.previousRoute,
                    to: to
                }
            }));
        }
    }

    // ==================== Utilities ====================

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: config.scrollBehavior
        });
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ==================== Initialization ====================

    function init(options = {}) {
        // Merge config
        Object.assign(config, options);

        // Setup event listeners
        document.addEventListener('click', handleLinkClick);
        window.addEventListener('popstate', handlePopState);

        // Initial route
        const initialPath = getFullPath();
        const initialRoute = findRoute(initialPath);

        if (initialRoute) {
            const params = initialRoute.extractParams(initialPath);
            state.currentRoute = {
                path: initialPath,
                route: initialRoute,
                params,
                query: parseQuery(window.location.search),
                meta: initialRoute.meta,
                name: initialRoute.name
            };
        }
    }

    function destroy() {
        document.removeEventListener('click', handleLinkClick);
        window.removeEventListener('popstate', handlePopState);
        state.routes.clear();
        state.middlewares = [];
    }

    // ==================== Public API ====================

    window.SPARouter = {
        // Route Management
        addRoute,
        removeRoute,
        getRoute,
        findRoute,
        
        // Navigation
        navigate,
        push: navigate,
        replace: (path, options = {}) => navigate(path, { ...options, replace: true }),
        back,
        forward,
        go,
        
        // Guards & Middleware
        beforeEach,
        afterEach,
        use,
        
        // State
        getCurrentRoute,
        get currentRoute() { return state.currentRoute; },
        get previousRoute() { return state.previousRoute; },
        get history() { return [...state.history]; },
        get isNavigating() { return state.isNavigating; },
        
        // Configuration
        config,
        
        // Lifecycle
        init,
        destroy
    };

    // Legacy compatibility
    window.navigateTo = navigate;

})();
