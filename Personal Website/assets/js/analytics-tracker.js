// Advanced Analytics Helper Functions
// This file provides enhanced tracking capabilities

class AnalyticsTracker {
    constructor() {
        this.sessionStartTime = Date.now();
        this.pageViews = 0;
        this.interactions = 0;
        this.init();
    }

    init() {
        this.trackPageView();
        this.trackUserEngagement();
        this.trackPerformance();
        this.trackErrors();
    }

    trackPageView() {
        this.pageViews++;
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                'page_title': document.title,
                'page_location': window.location.href,
                'page_path': window.location.pathname,
                'event_category': 'Navigation'
            });
        }
    }

    trackUserEngagement() {
        // Track clicks on any interactive element
        document.addEventListener('click', (e) => {
            this.interactions++;
            
            if (e.target.tagName === 'A' || e.target.closest('a')) {
                const link = e.target.closest('a') || e.target;
                const linkText = link.textContent.trim().substring(0, 50);
                const linkUrl = link.href;
                
                gtag('event', 'link_click', {
                    'event_category': 'Engagement',
                    'event_label': linkText,
                    'link_url': linkUrl,
                    'value': 1
                });
            }
            
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                const button = e.target.closest('button') || e.target;
                const buttonText = button.textContent.trim().substring(0, 50);
                
                gtag('event', 'button_click', {
                    'event_category': 'Engagement',
                    'event_label': buttonText,
                    'value': 1
                });
            }
        });

        // Track form interactions
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('focus', (e) => {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                    gtag('event', 'form_start', {
                        'event_category': 'Forms',
                        'event_label': 'Form Interaction Started',
                        'form_id': form.id || 'unknown'
                    });
                }
            }, true);
        });
    }

    trackPerformance() {
        // Track Core Web Vitals
        if ('web-vital' in window) {
            import('https://unpkg.com/web-vitals@3/dist/web-vitals.js').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
                onCLS((metric) => {
                    gtag('event', 'web_vital', {
                        'event_category': 'Performance',
                        'event_label': 'CLS',
                        'value': Math.round(metric.value * 1000)
                    });
                });

                onFID((metric) => {
                    gtag('event', 'web_vital', {
                        'event_category': 'Performance',
                        'event_label': 'FID',
                        'value': Math.round(metric.value)
                    });
                });

                onFCP((metric) => {
                    gtag('event', 'web_vital', {
                        'event_category': 'Performance',
                        'event_label': 'FCP',
                        'value': Math.round(metric.value)
                    });
                });

                onLCP((metric) => {
                    gtag('event', 'web_vital', {
                        'event_category': 'Performance',
                        'event_label': 'LCP',
                        'value': Math.round(metric.value)
                    });
                });

                onTTFB((metric) => {
                    gtag('event', 'web_vital', {
                        'event_category': 'Performance',
                        'event_label': 'TTFB',
                        'value': Math.round(metric.value)
                    });
                });
            });
        }
    }

    trackErrors() {
        // Track JavaScript errors
        window.addEventListener('error', (e) => {
            gtag('event', 'javascript_error', {
                'event_category': 'Errors',
                'event_label': e.message.substring(0, 100),
                'error_file': e.filename,
                'error_line': e.lineno,
                'value': 1
            });
        });

        // Track unhandled promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            gtag('event', 'promise_rejection', {
                'event_category': 'Errors',
                'event_label': e.reason?.toString().substring(0, 100) || 'Unknown error',
                'value': 1
            });
        });
    }

    // Custom conversion tracking
    trackConversion(type, value = 1, details = {}) {
        gtag('event', 'conversion', {
            'event_category': 'Conversions',
            'event_label': type,
            'value': value,
            ...details
        });
    }

    // Session summary on page unload
    trackSessionEnd() {
        const sessionDuration = Date.now() - this.sessionStartTime;
        
        gtag('event', 'session_end', {
            'event_category': 'Engagement',
            'event_label': 'Session Summary',
            'session_duration': Math.round(sessionDuration / 1000),
            'page_views': this.pageViews,
            'interactions': this.interactions
        });
    }
}

// Initialize tracker when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.analyticsTracker = new AnalyticsTracker();
    });
} else {
    window.analyticsTracker = new AnalyticsTracker();
}

// Track session end
window.addEventListener('beforeunload', () => {
    if (window.analyticsTracker) {
        window.analyticsTracker.trackSessionEnd();
    }
});

// Export for manual tracking
window.trackCustomEvent = (eventName, category, label, value = 1) => {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            'event_category': category,
            'event_label': label,
            'value': value
        });
    }
};

// Meta Pixel Enhanced Tracking
class MetaPixelTracker {
    constructor() {
        this.pixelId = '1867962034117344';
        this.init();
    }

    init() {
        // Check if Meta Pixel is loaded
        if (typeof fbq !== 'undefined') {
            this.setupEnhancedTracking();
        } else {
            console.warn('Meta Pixel not loaded');
        }
    }

    setupEnhancedTracking() {
        // Track WhatsApp clicks as Lead events
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href.includes('whatsapp.com')) {
                this.trackLead('WhatsApp Click');
            }
        });

        // Track form submissions as Leads
        document.addEventListener('submit', (e) => {
            if (e.target.tagName === 'FORM') {
                this.trackLead('Form Submission');
            }
        });

        // Track scroll depth
        this.trackScrollDepth();
    }

    trackLead(source = 'Website') {
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', {
                content_name: source,
                source: 'website',
                value: 1.00,
                currency: 'EGP'
            });
        }
    }

    trackPurchase(value = 0, contentName = 'Business Program') {
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Purchase', {
                content_name: contentName,
                value: value,
                currency: 'EGP'
            });
        }
    }

    trackViewContent(contentName = document.title) {
        if (typeof fbq !== 'undefined') {
            fbq('track', 'ViewContent', {
                content_name: contentName,
                content_type: 'page'
            });
        }
    }

    trackScrollDepth() {
        let maxScroll = 0;
        const thresholds = [25, 50, 75, 100];
        let trackedThresholds = [];

        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );

            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
            }

            thresholds.forEach(threshold => {
                if (scrollPercent >= threshold && !trackedThresholds.includes(threshold)) {
                    trackedThresholds.push(threshold);
                    
                    if (typeof fbq !== 'undefined') {
                        fbq('trackCustom', 'ScrollDepth', {
                            percentage: threshold,
                            page: window.location.pathname
                        });
                    }
                }
            });
        });
    }

    trackCustomEvent(eventName, parameters = {}) {
        if (typeof fbq !== 'undefined') {
            fbq('trackCustom', eventName, parameters);
        }
    }
}

// Initialize Meta Pixel Tracker
window.metaPixelTracker = new MetaPixelTracker();

// Global functions for easy tracking
window.trackFacebookLead = (source) => {
    if (window.metaPixelTracker) {
        window.metaPixelTracker.trackLead(source);
    }
};

window.trackFacebookPurchase = (value, contentName) => {
    if (window.metaPixelTracker) {
        window.metaPixelTracker.trackPurchase(value, contentName);
    }
};

window.trackFacebookViewContent = (contentName) => {
    if (window.metaPixelTracker) {
        window.metaPixelTracker.trackViewContent(contentName);
    }
};