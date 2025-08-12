// Utility Functions
const Utils = {
    // Format currency
    formatCurrency(amount, currency = '₺', decimals = 2) {
        return `${currency}${parseFloat(amount).toLocaleString('tr-TR', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        })}`;
    },

    // Format number with specific decimal places
    formatNumber(number, decimals = 8) {
        return parseFloat(number).toFixed(decimals);
    },

    // Format percentage
    formatPercentage(value, decimals = 2) {
        const number = parseFloat(value);
        const sign = number >= 0 ? '+' : '';
        return `${sign}${number.toFixed(decimals)}%`;
    },

    // Format date
    formatDate(date, options = {}) {
        const defaultOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(date).toLocaleDateString('tr-TR', { ...defaultOptions, ...options });
    },

    // Show notification
    showNotification(message, type = 'info') {
        // Create container if it doesn't exist
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
            `;
            document.body.appendChild(container);
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            margin-bottom: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 12px;
        `;

        const icon = this.getNotificationIcon(type);
        notification.innerHTML = `<i class="fas ${icon}"></i> ${message}`;

        container.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    },

    // Get notification color based on type
    getNotificationColor(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        return colors[type] || colors.info;
    },

    // Get notification icon based on type
    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    },

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Copy to clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showNotification('Panoya kopyalandı', 'success');
        } catch (err) {
            this.showNotification('Kopyalama başarısız', 'error');
        }
    },

    // Local storage wrapper
    storage: {
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                console.error('Storage error:', e);
            }
        },

        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.error('Storage error:', e);
                return defaultValue;
            }
        },

        remove(key) {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                console.error('Storage error:', e);
            }
        },

        clear() {
            try {
                localStorage.clear();
            } catch (e) {
                console.error('Storage error:', e);
            }
        }
    },

    // DOM helpers
    dom: {
        // Create element with attributes and children
        createElement(tag, attributes = {}, children = []) {
            const element = document.createElement(tag);
            
            Object.entries(attributes).forEach(([key, value]) => {
                if (key === 'style' && typeof value === 'object') {
                    Object.assign(element.style, value);
                } else if (key.startsWith('on') && typeof value === 'function') {
                    element.addEventListener(key.substring(2).toLowerCase(), value);
                } else {
                    element.setAttribute(key, value);
                }
            });

            children.forEach(child => {
                if (typeof child === 'string') {
                    element.appendChild(document.createTextNode(child));
                } else {
                    element.appendChild(child);
                }
            });

            return element;
        },

        // Query selector with error handling
        $(selector, parent = document) {
            const element = parent.querySelector(selector);
            if (!element) {
                console.warn(`Element not found: ${selector}`);
            }
            return element;
        },

        // Query selector all with error handling
        $$(selector, parent = document) {
            return Array.from(parent.querySelectorAll(selector));
        }
    }
};

// Export Utils
window.Utils = Utils;
