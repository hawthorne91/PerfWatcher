# PerfWatcher

A lightweight JavaScript library for monitoring frontend performance metrics.

## Features

- Track navigation timing (DOM load, page load times)
- Monitor resource loading performance
- Memory usage monitoring (Chrome/Chromium browsers)
- Custom event tracking
- Export metrics to JSON/CSV formats
- Lightweight and easy to integrate
- No dependencies

## Installation

Include the script in your HTML:

```html
<script src="src/perf-watcher.js"></script>
```

## Usage

```javascript
// Basic usage
const monitor = new PerfWatcher({
    enableConsoleOutput: true,
    trackNavigation: true,
    trackResources: true,
    trackMemory: true,
    trackCustomEvents: true
});

// Track custom events
monitor.trackCustomEvent('user_action', { action: 'button_click', element: 'header_cta' });

// Get metrics after page load
window.addEventListener('load', () => {
    setTimeout(() => {
        const metrics = monitor.getMetrics();
        console.log(metrics);
    }, 1000);
});

// Export metrics
monitor.downloadJSON(); // Download as JSON
monitor.downloadCSV();  // Download as CSV
```

## Configuration Options

- `enableConsoleOutput`: Enable console logging (default: false)
- `trackNavigation`: Track navigation timing (default: true)
- `trackResources`: Track resource loading (default: true)
- `trackMemory`: Track memory usage (default: true, Chrome only)
- `trackCustomEvents`: Enable custom event tracking (default: true)

## API Methods

- `getMetrics()`: Returns all collected metrics
- `trackCustomEvent(name, data)`: Track a custom event with optional data
- `exportToJSON()`: Export metrics as JSON string
- `exportToCSV()`: Export metrics as CSV string
- `downloadJSON()`: Download metrics as JSON file
- `downloadCSV()`: Download metrics as CSV file

## License

MIT