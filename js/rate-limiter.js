// Rate Limiter for Form Submissions and API Calls
(function() {
    'use strict';

    class RateLimiter {
        constructor(maxAttempts = 5, timeWindow = 60000) {
            this.maxAttempts = maxAttempts;
            this.timeWindow = timeWindow; // in milliseconds
            this.attempts = new Map();
        }

        // Check if action is allowed
        isAllowed(key) {
            const now = Date.now();
            const userAttempts = this.attempts.get(key) || [];
            
            // Filter out old attempts outside time window
            const recentAttempts = userAttempts.filter(
                timestamp => now - timestamp < this.timeWindow
            );
            
            // Update attempts
            this.attempts.set(key, recentAttempts);
            
            // Check if limit exceeded
            if (recentAttempts.length >= this.maxAttempts) {
                return false;
            }
            
            return true;
        }

        // Record an attempt
        recordAttempt(key) {
            const now = Date.now();
            const userAttempts = this.attempts.get(key) || [];
            userAttempts.push(now);
            this.attempts.set(key, userAttempts);
        }

        // Get remaining attempts
        getRemainingAttempts(key) {
            const now = Date.now();
            const userAttempts = this.attempts.get(key) || [];
            const recentAttempts = userAttempts.filter(
                timestamp => now - timestamp < this.timeWindow
            );
            return Math.max(0, this.maxAttempts - recentAttempts.length);
        }

        // Get time until reset
        getTimeUntilReset(key) {
            const now = Date.now();
            const userAttempts = this.attempts.get(key) || [];
            
            if (userAttempts.length === 0) {
                return 0;
            }
            
            const oldestAttempt = Math.min(...userAttempts);
            const timeUntilReset = this.timeWindow - (now - oldestAttempt);
            
            return Math.max(0, timeUntilReset);
        }

        // Reset attempts for a key
        reset(key) {
            this.attempts.delete(key);
        }

        // Clear all attempts
        clearAll() {
            this.attempts.clear();
        }
    }

    // Create global rate limiters
    window.rateLimiters = {
        form: new RateLimiter(5, 60000), // 5 submissions per minute
        search: new RateLimiter(30, 60000), // 30 searches per minute
        api: new RateLimiter(20, 60000), // 20 API calls per minute
        download: new RateLimiter(10, 300000) // 10 downloads per 5 minutes
    };

    // Helper function to get user identifier
    function getUserIdentifier() {
        // Use combination of fingerprinting techniques
        const factors = [
            navigator.userAgent,
            navigator.language,
            screen.width + 'x' + screen.height,
            new Date().getTimezoneOffset()
        ];
        
        // Simple hash function
        const hash = factors.join('|').split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
        
        return 'user_' + Math.abs(hash);
    }

    // Protect forms
    function protectForms() {
        const forms = document.querySelectorAll('form[data-rate-limit]');
        
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                const userId = getUserIdentifier();
                const limiter = window.rateLimiters.form;
                
                if (!limiter.isAllowed(userId)) {
                    e.preventDefault();
                    
                    const timeUntilReset = limiter.getTimeUntilReset(userId);
                    const seconds = Math.ceil(timeUntilReset / 1000);
                    
                    showRateLimitMessage(
                        `تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً ${seconds} ثانیه صبر کنید.`
                    );
                    return false;
                }
                
                limiter.recordAttempt(userId);
            });
        });
    }

    // Show rate limit message
    function showRateLimitMessage(message) {
        // Use toast notification if available
        if (window.toast && typeof window.toast.error === 'function') {
            window.toast.error(message);
        } else {
            alert(message);
        }
    }

    // Protect API calls
    window.rateLimitedFetch = async function(url, options = {}, limiterType = 'api') {
        const userId = getUserIdentifier();
        const limiter = window.rateLimiters[limiterType] || window.rateLimiters.api;
        
        if (!limiter.isAllowed(userId)) {
            const timeUntilReset = limiter.getTimeUntilReset(userId);
            const seconds = Math.ceil(timeUntilReset / 1000);
            
            throw new Error(`Rate limit exceeded. Try again in ${seconds} seconds.`);
        }
        
        limiter.recordAttempt(userId);
        return fetch(url, options);
    };

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', protectForms);
    } else {
        protectForms();
    }

    // Monitor for dynamically added forms
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                protectForms();
            }
        });
    });

    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

})();
