# Page Visibility API Disabler

A Chrome extension that disables the Page Visibility API and Window Management API, preventing websites from detecting when their tab becomes hidden, unfocused, minimized, or covered by another window, and from detecting multiple monitors.

## What is the Page Visibility API?

The Page Visibility API allows websites to detect when their tab's visibility status changes. This API includes:

- `document.hidden`: Boolean indicating if the page is hidden
- `document.visibilityState`: String value ("visible", "hidden", or "prerendered")
- `visibilitychange` event: Fires when visibility status changes

Some websites use this API to pause videos, stop animations, or track user engagement when tabs are switched.

## What This Extension Does

This extension completely disables the Page Visibility API and window focus detection using a **comprehensive, multi-layered blocking approach** that intercepts ALL possible event registration and detection methods:

### Core API Overrides
1. **Overriding `document.hidden`**: Always returns `false`, making the page appear never hidden
2. **Overriding `document.visibilityState`**: Always returns `"visible"`, indicating the page is always visible
3. **Overriding `document.hasFocus()`**: Always returns `true`, making the document appear always focused
4. **Overriding `window.screen.isExtended`**: Always returns `false`, making it appear as if only one monitor is present
5. **Overriding `window.getScreenDetails()`**: Returns a mock object with only one screen, preventing multi-screen detection

### Layer 1: EventTarget.prototype Blocking
6. **Blocking `addEventListener()`**: Intercepts all calls to register event listeners for blocked events (visibilitychange, blur, focus, focusin, focusout)
7. **Blocking `removeEventListener()`**: Silently ignores removal attempts for blocked events
8. **Blocking `dispatchEvent()`**: Prevents synthetic event dispatching for blocked event types

### Layer 2: Property Setter Blocking
9. **Blocking `window.onblur` and `window.onfocus`**: Property assignments are silently ignored, getters return null
10. **Blocking `document.onvisibilitychange`**: Property assignments are silently ignored, getter returns null
11. **Blocking `element.onblur` and `element.onfocus`**: Inline property handlers on all HTML elements are blocked via HTMLElement.prototype

### Layer 3: Synthetic Event Prevention
12. **Event constructor wrapper**: Intercepts `new Event('blur')` and similar, replacing blocked event types with dummy events

### Layer 4: HTML Attribute Protection
13. **MutationObserver monitoring**: Watches for and immediately removes inline HTML attribute handlers like `<div onblur="...">`

### Layer 5: Framework Compatibility
14. **Zone.js handling**: Detects and patches Angular's Zone.js event system when present
15. **jQuery special events**: Overrides jQuery's special focus/blur event handling when jQuery is loaded
16. **React/Vue compatibility**: Works automatically via EventTarget overrides (these frameworks use addEventListener internally)

### Layer 6: Window Management API Override
17. **Multi-screen detection blocking**: Overrides the Window Management API to always report a single monitor, preventing websites from detecting multiple displays

## Installation

### Manual Installation (Developer Mode)

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" using the toggle in the top right corner
4. Click "Load unpacked"
5. Select the directory containing this extension's files
6. The extension will now be active on all websites

### From Source

```bash
git clone https://github.com/konrad-wila/page-visibility-api.git
cd page-visibility-api
```

Then follow the manual installation steps above.

## Usage

Once installed, the extension works automatically on all websites. No additional configuration is needed.

To verify it's working:
1. Open the browser console (F12) on any webpage
2. Type `document.hidden` - it should always return `false`
3. Type `document.visibilityState` - it should always return `"visible"`
4. Type `window.screen.isExtended` - it should always return `false`
5. Switch to another tab and back - the values remain unchanged

## Technical Details

The extension uses a content script that runs at `document_start` to inject code into the page context before any page scripts execute. This ensures the API is overridden before websites can detect the original behavior.

### Multi-Layered Protection Architecture

The extension implements seven layers of protection to ensure comprehensive blocking:

**Layer 1: Core EventTarget Overrides**
- Intercepts `EventTarget.prototype.addEventListener` to block registration
- Intercepts `EventTarget.prototype.removeEventListener` to ignore removals
- Intercepts `EventTarget.prototype.dispatchEvent` to prevent event firing
- Catches ALL event registrations including jQuery cached methods

**Layer 2: Property Setter Blocking**
- Uses `Object.defineProperty()` on Window, Document.prototype, and HTMLElement.prototype
- Blocks inline handlers: `window.onblur`, `window.onfocus`, `document.onvisibilitychange`
- Blocks element handlers: `element.onblur`, `element.onfocus` on all HTML elements
- Getters return `null`, setters silently ignore assignments

**Layer 3: Synthetic Event Interception**
- Wraps `window.Event` constructor to replace blocked event types with dummy events
- Prevents `new Event('blur')` and similar from creating functional blocked events
- Maintains prototype chain compatibility

**Layer 4: MutationObserver for HTML Attributes**
- Watches for inline HTML attributes being added: `<body onblur="...">`, `<div onfocus="...">`
- Removes them immediately when detected via `removeAttribute()`
- Monitors entire DOM tree with `subtree: true`

**Layer 5: Framework-Specific Handling**
- **Angular/Zone.js**: Detects and overrides Zone's patched event methods when present
- **jQuery**: Overrides `jQuery.event.special.focus` and `blur` when jQuery loads
- **React/Vue**: Already covered by EventTarget overrides (use addEventListener internally)

**Layer 6: CSP Bypass**
- Injects a separate JS file (`inject.js`) to bypass Content Security Policy restrictions
- Runs in page context with full access to modify prototypes

**Layer 7: Window Management API Override**
- Overrides `window.screen.isExtended` to always return `false`
- Overrides `window.getScreenDetails()` to return a mock single-screen configuration
- Prevents websites from detecting multiple monitors or managing windows across screens

### Coverage Matrix

| Method | Status |
|--------|--------|
| `addEventListener('blur')` | ✅ Blocked |
| `element.onblur = fn` | ✅ Blocked |
| `<div onblur="...">` | ✅ Blocked (removed) |
| `setAttribute('onblur', ...)` | ✅ Blocked (removed) |
| `dispatchEvent(new Event('blur'))` | ✅ Blocked |
| `new Event('blur')` | ✅ Blocked (dummy event) |
| jQuery cached methods | ✅ Blocked |
| React/Vue events | ✅ Blocked |
| Angular/Zone.js | ✅ Blocked |
| `window.screen.isExtended` | ✅ Overridden (always false) |
| `window.getScreenDetails()` | ✅ Overridden (single screen) |

The script:
- Runs on all URLs (`<all_urls>`)
- Executes in all frames (`all_frames: true`)
- Runs at `document_start` timing to override APIs before page scripts
- Uses multiple interception layers to ensure no bypass methods work

## Privacy & Permissions

This extension requires no special permissions. It only modifies the Page Visibility API behavior and does not:
- Collect any data
- Make network requests
- Access your browsing history
- Require any permissions beyond running on web pages

## Browser Compatibility

- Google Chrome (Manifest V3)
- Microsoft Edge (Chromium-based)
- Other Chromium-based browsers supporting Manifest V3

## Files

- `manifest.json`: Extension configuration
- `content.js`: Content script that injects the override code
- `inject.js`: Injected script that overrides the APIs (runs in page context)
- `icons/`: Extension icons in various sizes

## License

MIT License - Feel free to use and modify as needed.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## Disclaimer

This extension is for educational and legitimate use cases only. Users are responsible for ensuring their use complies with website terms of service and applicable laws.