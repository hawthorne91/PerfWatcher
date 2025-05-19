# PerfWatcher

A lightweight JavaScript library for monitoring frontend performance metrics.

## Features

- Track navigation timing (DOM load, page load times)
- Monitor resource loading performance
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
    trackResources: true
});

// Get metrics after page load
window.addEventListener('load', () => {
    setTimeout(() => {
        const metrics = monitor.getMetrics();
        console.log(metrics);
    }, 1000);
});
```

## Options

- `enableConsoleOutput`: Enable console logging (default: false)
- `trackNavigation`: Track navigation timing (default: true)
- `trackResources`: Track resource loading (default: true)

## License

MIT