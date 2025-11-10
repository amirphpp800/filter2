// AI Development Notification System
(function() {
    'use strict';

    const NOTIFICATION_KEY = 'ai_dev_notification_shown';
    const NOTIFICATION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    function shouldShowNotification() {
        const lastShown = localStorage.getItem(NOTIFICATION_KEY);
        if (!lastShown) return true;
        
        const timePassed = Date.now() - parseInt(lastShown);
        return timePassed >= NOTIFICATION_DURATION;
    }

    function markNotificationShown() {
        localStorage.setItem(NOTIFICATION_KEY, Date.now().toString());
    }

    function createNotification() {
        // بررسی اگر قبلاً نمایش داده شده
        if (!shouldShowNotification()) {
            return;
        }

        // ایجاد المان نوتیفیکیشن
        const notification = document.createElement('div');
        notification.className = 'ai-notification';
        notification.innerHTML = `
            <div class="ai-notification-content">
                <div class="ai-notification-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                </div>
                <div class="ai-notification-text">
                    <h4>🤖 توسعه با هوش مصنوعی</h4>
                    <p>این سایت در حال توسعه و مطلب‌گذاری تا 99 درصد توسط هوش مصنوعی می‌باشد و انسان فقط ناظر پروژه است. اگر جایی اشکالی دیدید در جملات یا عملکرد، منتظر باشید، اصلاح خواهد شد.</p>
                </div>
                <button class="ai-notification-close" aria-label="بستن">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        `;

        // اضافه کردن به صفحه
        document.body.appendChild(notification);

        // انیمیشن ورود
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // دکمه بستن
        const closeBtn = notification.querySelector('.ai-notification-close');
        closeBtn.addEventListener('click', () => {
            closeNotification(notification);
        });

        // بستن خودکار بعد از 15 ثانیه
        setTimeout(() => {
            if (notification.classList.contains('show')) {
                closeNotification(notification);
            }
        }, 15000);
    }

    function closeNotification(notification) {
        notification.classList.remove('show');
        markNotificationShown();
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // نمایش نوتیفیکیشن بعد از لود شدن صفحه
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(createNotification, 1500);
        });
    } else {
        setTimeout(createNotification, 1500);
    }

})();
