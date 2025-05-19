/**
 * PerfWatcher - A lightweight performance monitoring tool
 * @author hawthorne91
 */

class PerfWatcher {
    constructor(options = {}) {
        this.options = {
            enableConsoleOutput: options.enableConsoleOutput || false,
            trackNavigation: options.trackNavigation !== false,
            trackResources: options.trackResources !== false,
            ...options
        };

        this.metrics = {};
        this.startTime = performance.now();

        if (this.options.trackNavigation) {
            this.trackNavigationTiming();
        }

        if (this.options.trackResources) {
            this.trackResourceTiming();
        }
    }

    trackNavigationTiming() {
        window.addEventListener('load', () => {
            const nav = performance.getEntriesByType('navigation')[0];
            if (nav) {
                this.metrics.navigation = {
                    domContentLoaded: nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart,
                    loadComplete: nav.loadEventEnd - nav.loadEventStart,
                    domInteractive: nav.domInteractive - nav.navigationStart,
                    totalLoadTime: nav.loadEventEnd - nav.navigationStart
                };

                if (this.options.enableConsoleOutput) {
                    console.log('Navigation metrics:', this.metrics.navigation);
                }
            }
        });
    }

    trackResourceTiming() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const resources = performance.getEntriesByType('resource');
                this.metrics.resources = resources.map(resource => ({
                    name: resource.name,
                    duration: resource.duration,
                    size: resource.transferSize || 0,
                    type: this.getResourceType(resource.name)
                }));

                if (this.options.enableConsoleOutput) {
                    console.log('Resource metrics:', this.metrics.resources);
                }
            }, 100);
        });
    }

    getResourceType(url) {
        if (url.match(/\.(css)$/i)) return 'stylesheet';
        if (url.match(/\.(js)$/i)) return 'script';
        if (url.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i)) return 'image';
        if (url.match(/\.(woff|woff2|ttf|eot)$/i)) return 'font';
        return 'other';
    }

    getMetrics() {
        return this.metrics;
    }
}

// Export for both CommonJS and browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerfWatcher;
} else {
    window.PerfWatcher = PerfWatcher;
}