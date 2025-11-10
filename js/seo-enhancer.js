// SEO Enhancement and Structured Data Helper
(function() {
    'use strict';

    // Add canonical link if not exists
    function ensureCanonical() {
        if (!document.querySelector('link[rel="canonical"]')) {
            const canonical = document.createElement('link');
            canonical.rel = 'canonical';
            canonical.href = window.location.origin + window.location.pathname;
            document.head.appendChild(canonical);
        }
    }

    // Update meta tags dynamically
    function updateMetaTags(data) {
        const metaTags = {
            'description': data.description,
            'keywords': data.keywords,
            'og:title': data.title,
            'og:description': data.description,
            'og:image': data.image,
            'og:url': window.location.href,
            'twitter:title': data.title,
            'twitter:description': data.description,
            'twitter:image': data.image
        };

        Object.entries(metaTags).forEach(([name, content]) => {
            if (!content) return;
            
            let meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
            
            if (!meta) {
                meta = document.createElement('meta');
                if (name.startsWith('og:') || name.startsWith('twitter:')) {
                    meta.setAttribute('property', name);
                } else {
                    meta.setAttribute('name', name);
                }
                document.head.appendChild(meta);
            }
            
            meta.setAttribute('content', content);
        });
    }

    // Add structured data (JSON-LD)
    function addStructuredData(type, data) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        
        let structuredData = {
            "@context": "https://schema.org",
            "@type": type
        };

        structuredData = { ...structuredData, ...data };
        
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }

    // Add breadcrumb structured data
    function addBreadcrumb(items) {
        const breadcrumbList = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": items.map((item, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": item.name,
                "item": item.url
            }))
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(breadcrumbList);
        document.head.appendChild(script);
    }

    // Add Article structured data
    function addArticleStructuredData(article) {
        const articleData = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": article.title,
            "description": article.description,
            "image": article.image,
            "datePublished": article.datePublished,
            "dateModified": article.dateModified || article.datePublished,
            "author": {
                "@type": "Organization",
                "name": "فیلتربین"
            },
            "publisher": {
                "@type": "Organization",
                "name": "فیلتربین",
                "logo": {
                    "@type": "ImageObject",
                    "url": window.location.origin + "/assets/logo/logo.svg"
                }
            },
            "inLanguage": "fa"
        };

        if (article.keywords) {
            articleData.keywords = article.keywords;
        }

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(articleData);
        document.head.appendChild(script);
    }

    // Accessibility enhancements
    function enhanceAccessibility() {
        // Add skip to main content link if not exists
        if (!document.querySelector('.skip-to-main')) {
            const skipLink = document.createElement('a');
            skipLink.href = '#main-content';
            skipLink.className = 'skip-to-main';
            skipLink.textContent = 'پرش به محتوای اصلی';
            skipLink.style.cssText = 'position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden;';
            skipLink.addEventListener('focus', function() {
                this.style.cssText = 'position:fixed;top:0;left:0;z-index:10000;padding:1rem;background:#9D0913;color:#fff;';
            });
            skipLink.addEventListener('blur', function() {
                this.style.cssText = 'position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden;';
            });
            document.body.insertBefore(skipLink, document.body.firstChild);
        }

        // Ensure main content has id
        const main = document.querySelector('main, .main-content');
        if (main && !main.id) {
            main.id = 'main-content';
        }

        // Add ARIA landmarks if missing
        const nav = document.querySelector('nav:not([role])');
        if (nav) nav.setAttribute('role', 'navigation');

        const header = document.querySelector('header:not([role])');
        if (header) header.setAttribute('role', 'banner');

        const footer = document.querySelector('footer:not([role])');
        if (footer) footer.setAttribute('role', 'contentinfo');

        // Ensure all images have alt text
        document.querySelectorAll('img:not([alt])').forEach(img => {
            // Try to get alt from title or set empty alt for decorative images
            const alt = img.title || '';
            img.setAttribute('alt', alt);
            
            if (!alt && !img.hasAttribute('role')) {
                img.setAttribute('role', 'presentation');
            }
        });

        // Add aria-label to links with only icons
        document.querySelectorAll('a:not([aria-label])').forEach(link => {
            const text = link.textContent.trim();
            if (!text && link.querySelector('svg, i, img')) {
                const title = link.title || link.href;
                link.setAttribute('aria-label', title);
            }
        });
    }

    // Initialize on DOM ready
    function init() {
        ensureCanonical();
        enhanceAccessibility();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export functions for use in other scripts
    window.SEOEnhancer = {
        updateMetaTags,
        addStructuredData,
        addBreadcrumb,
        addArticleStructuredData,
        enhanceAccessibility
    };

})();
