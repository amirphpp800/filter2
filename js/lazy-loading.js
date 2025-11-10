// Lazy Loading Images with Intersection Observer
(function() {
    'use strict';

    // Configuration
    const config = {
        rootMargin: '50px 0px',
        threshold: 0.01
    };

    // Check for Intersection Observer support
    if (!('IntersectionObserver' in window)) {
        // Fallback for older browsers
        loadAllImages();
        return;
    }

    // Create intersection observer
    const imageObserver = new IntersectionObserver(onIntersection, config);

    // Callback for intersection
    function onIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                loadImage(img);
                imageObserver.unobserve(img);
            }
        });
    }

    // Load image
    function loadImage(img) {
        const src = img.dataset.src || img.getAttribute('data-src');
        const srcset = img.dataset.srcset || img.getAttribute('data-srcset');
        
        if (!src) return;

        // Create a temporary image to preload
        const tempImg = new Image();
        
        tempImg.onload = function() {
            img.src = src;
            if (srcset) {
                img.srcset = srcset;
            }
            img.classList.add('loaded');
            img.removeAttribute('data-src');
            img.removeAttribute('data-srcset');
        };

        tempImg.onerror = function() {
            img.classList.add('error');
            // Try fallback if available
            const fallback = img.dataset.fallback || img.getAttribute('data-fallback');
            if (fallback) {
                img.src = fallback;
            }
        };

        tempImg.src = src;
    }

    // Load all images (fallback)
    function loadAllImages() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            const src = img.dataset.src || img.getAttribute('data-src');
            const srcset = img.dataset.srcset || img.getAttribute('data-srcset');
            if (src) {
                img.src = src;
                if (srcset) {
                    img.srcset = srcset;
                }
                img.classList.add('loaded');
            }
        });
    }

    // Observe all lazy images
    function observeImages() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"], img[data-src]');
        lazyImages.forEach(img => {
            // Add placeholder class
            if (!img.classList.contains('loaded')) {
                img.classList.add('lazy-loading');
            }
            imageObserver.observe(img);
        });
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', observeImages);
    } else {
        observeImages();
    }

    // Re-observe when new images are added (for dynamic content)
    const mutationObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.tagName === 'IMG' && (node.loading === 'lazy' || node.dataset.src)) {
                        imageObserver.observe(node);
                    }
                    if (node.querySelectorAll) {
                        const images = node.querySelectorAll('img[loading="lazy"], img[data-src]');
                        images.forEach(img => imageObserver.observe(img));
                    }
                });
            }
        });
    });

    mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
