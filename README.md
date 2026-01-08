# Page Visibility API Disabler

A Chrome extension that disables the Page Visibility API, preventing websites from detecting when their tab becomes hidden, unfocused, minimized, or covered by another window.

## What is the Page Visibility API?

The Page Visibility API allows websites to detect when their tab's visibility status changes. This API includes:

- `document.hidden`: Boolean indicating if the page is hidden
- `document.visibilityState`: String value ("visible", "hidden", or "prerendered")
- `visibilitychange` event: Fires when visibility status changes

Some websites use this API to pause videos, stop animations, or track user engagement when tabs are switched.

## What This Extension Does

This extension completely disables the Page Visibility API and window focus detection by:

1. **Overriding `document.hidden`**: Always returns `false`, making the page appear never hidden
2. **Overriding `document.visibilityState`**: Always returns `"visible"`, indicating the page is always visible
3. **Blocking `visibilitychange` events**: Prevents event listeners from detecting visibility changes
4. **Blocking `window.blur` and `window.focus` events**: Prevents event listeners from detecting when the window loses or gains focus

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
4. Switch to another tab and back - the values remain unchanged

## Technical Details

The extension uses a content script that runs at `document_start` to inject code into the page context before any page scripts execute. This ensures the API is overridden before websites can detect the original behavior.

The script:
- Runs on all URLs (`<all_urls>`)
- Executes in all frames (`all_frames: true`)
- Uses `Object.defineProperty` to override API properties
- Intercepts `addEventListener` to block `visibilitychange` event registration
- Intercepts `Window.prototype.addEventListener` to block `blur` and `focus` event registration

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
- `content.js`: Content script that overrides the API
- `icons/`: Extension icons in various sizes

## License

MIT License - Feel free to use and modify as needed.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## Disclaimer

This extension is for educational and legitimate use cases only. Users are responsible for ensuring their use complies with website terms of service and applicable laws.