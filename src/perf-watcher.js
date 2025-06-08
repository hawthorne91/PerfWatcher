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
            trackMemory: options.trackMemory !== false,
            trackCustomEvents: options.trackCustomEvents !== false,
            ...options
        };

        this.metrics = {};
        this.customEvents = [];
        this.startTime = performance.now();

        if (this.options.trackNavigation) {
            this.trackNavigationTiming();
        }

        if (this.options.trackResources) {
            this.trackResourceTiming();
        }

        if (this.options.trackMemory) {
            this.trackMemoryUsage();
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

    trackMemoryUsage() {
        if ('memory' in performance) {
            const updateMemoryMetrics = () => {
                this.metrics.memory = {
                    usedJSHeapSize: performance.memory.usedJSHeapSize,
                    totalJSHeapSize: performance.memory.totalJSHeapSize,
                    jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
                    timestamp: performance.now()
                };

                if (this.options.enableConsoleOutput) {
                    console.log('Memory metrics:', this.metrics.memory);
                }
            };

            // Initial measurement
            updateMemoryMetrics();

            // Update every 5 seconds
            setInterval(updateMemoryMetrics, 5000);
        } else {
            console.warn('Memory API not supported in this browser');
        }
    }

    trackCustomEvent(eventName, data = {}) {
        if (!this.options.trackCustomEvents) return;

        const event = {
            name: eventName,
            timestamp: performance.now(),
            data: data
        };

        this.customEvents.push(event);
        this.metrics.customEvents = this.customEvents;

        if (this.options.enableConsoleOutput) {
            console.log('Custom event tracked:', event);
        }
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

    exportToJSON() {
        return JSON.stringify({
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            metrics: this.metrics
        }, null, 2);
    }

    exportToCSV() {
        let csv = 'Metric,Value,Unit\n';

        if (this.metrics.navigation) {
            const nav = this.metrics.navigation;
            csv += `DOM Content Loaded,${nav.domContentLoaded},ms\n`;
            csv += `Load Complete,${nav.loadComplete},ms\n`;
            csv += `DOM Interactive,${nav.domInteractive},ms\n`;
            csv += `Total Load Time,${nav.totalLoadTime},ms\n`;
        }

        if (this.metrics.resources) {
            this.metrics.resources.forEach(resource => {
                const name = resource.name.split('/').pop() || resource.name;
                csv += `${name} Duration,${resource.duration},ms\n`;
                csv += `${name} Size,${resource.size},bytes\n`;
            });
        }

        return csv;
    }

    downloadJSON() {
        const data = this.exportToJSON();
        this.downloadFile(data, 'performance-metrics.json', 'application/json');
    }

    downloadCSV() {
        const data = this.exportToCSV();
        this.downloadFile(data, 'performance-metrics.csv', 'text/csv');
    }

    downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Export for both CommonJS and browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerfWatcher;
} else {
    window.PerfWatcher = PerfWatcher;
}