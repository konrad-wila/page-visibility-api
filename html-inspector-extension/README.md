# HTML Element Inspector

A Chrome extension that allows you to inspect, copy, and monitor page HTML and selected elements in real-time.

## Features

- 🔍 **Full Page HTML Inspection** - View the complete HTML of any webpage
- 🎯 **Element Selection** - Select specific elements on the page with Alt+Click
- 🪟 **Popup Window** - Open inspector in a separate, resizable window
- 🔄 **Auto-Update** - Continuously monitor DOM changes in real-time
- 📋 **Copy to Clipboard** - Copy HTML with one click
- 🎨 **Modern UI** - Clean, intuitive interface with tab navigation
- ⚡ **Performance Optimized** - Throttled updates to prevent performance issues
- 🌐 **Universal** - Works on all websites
- 🕶️ **Discreet Operation** - No visible highlighting or page modifications

## Installation

### Manual Installation (Developer Mode)

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" using the toggle in the top right corner
4. Click "Load unpacked"
5. Select the `html-inspector-extension/` directory
6. The extension icon will appear in your toolbar

### From Source

```bash
git clone https://github.com/konrad-wila/page-visibility-api.git
cd page-visibility-api/html-inspector-extension
```

Then follow the manual installation steps above.

## Usage

### Opening the Inspector

1. Click the HTML Element Inspector icon in your Chrome toolbar
2. A popup window will appear showing the current page's HTML

### Viewing Full Page HTML

1. Open the inspector popup
2. The "Full Page HTML" tab is active by default
3. Browse through the formatted HTML code
4. Use the scrollbar to navigate long documents

### Selecting Elements

1. Open the inspector popup on any webpage
2. **Alt+Click** on any element on the page
3. The selected element will be:
   - Displayed in the "Selected Element" tab
   - Shown with its DOM path (e.g., "html > body > div > section")
4. The extension operates discreetly without any visible highlighting on the page

### Opening in Separate Window

1. Click the extension icon to open the popup
2. Click the "Open in Window" button (🪟)
3. The inspector will open in a separate popup window
4. You can now:
   - Move the window to a different monitor
   - Resize the window as needed
   - Keep it visible while working on other tabs
   - All functionality remains the same as in popup mode

### Copying HTML

1. Switch to the desired tab (Full Page or Selected Element)
2. Click the "Copy HTML" button
3. The HTML will be copied to your clipboard
4. A success notification will appear

### Auto-Update Mode

1. Toggle the "Auto-update" switch in the header
2. When enabled:
   - The inspector will automatically refresh when the DOM changes
   - A green indicator will pulse in the status bar
   - Updates are throttled to once every 500ms for performance
3. Toggle off to stop monitoring

### Manual Refresh

Click the "Refresh" button to manually update the HTML display at any time.

## Interface Overview

### Header
- **Title** - Extension name and icon
- **Open in Window Button** - Open inspector in a separate window
- **Refresh Button** - Manually update HTML
- **Copy Button** - Copy current HTML to clipboard
- **Auto-update Toggle** - Enable/disable continuous monitoring

### Tab Navigation
- **Full Page HTML** - Shows complete page HTML
- **Selected Element** - Shows currently selected element

### Code Display
- Formatted HTML with proper indentation
- Scrollable area for long content
- Monospace font for readability

### Status Bar
- **Last Updated** - Timestamp of last update
- **Elements** - Total element count on page
- **Status Indicator** - Shows when auto-update is active (green pulse)

## Keyboard Shortcuts

- **Alt+Click** - Select an element on the page

## Technical Details

### Permissions

The extension requires the following permissions:

- `activeTab` - Access current page content
- `scripting` - Inject content scripts
- `clipboardWrite` - Copy HTML to clipboard
- `tabs` - Query and access tab information for window mode

### Architecture

- **Manifest V3** - Uses latest Chrome extension manifest version
- **Content Script** - Injected into all pages to capture HTML and handle selection
- **Background Service Worker** - Manages extension lifecycle and messaging
- **Popup** - User interface for viewing and interacting with HTML

### Performance

- **Throttled Updates** - Maximum one update per 500ms to prevent performance issues
- **Efficient DOM Monitoring** - Uses MutationObserver API for change detection
- **On-Demand Processing** - Only monitors when auto-update is enabled

### Browser Compatibility

- Google Chrome (Manifest V3)
- Microsoft Edge (Chromium-based)
- Other Chromium-based browsers supporting Manifest V3

## Files Structure

```
html-inspector-extension/
├── manifest.json          # Extension configuration
├── popup.html            # Popup UI structure
├── popup.js              # Popup logic and messaging
├── content.js            # Page HTML capture and element selection
├── background.js         # Service worker for message routing
├── styles.css            # UI styling
├── README.md             # This file
└── icons/                # Extension icons
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## Privacy & Security

This extension:
- ✅ Runs only when you activate it
- ✅ Does not collect or transmit any data
- ✅ Does not make external network requests
- ✅ Only accesses page content when you open the popup
- ✅ All processing happens locally in your browser

## Troubleshooting

### Extension doesn't show page HTML

- Make sure you've opened the extension popup on an active tab
- Try clicking the "Refresh" button
- Some pages with strict Content Security Policy may limit functionality

### Element selection (Alt+Click) not working

- Ensure you're holding the Alt key while clicking
- Try on different elements - some elements might capture clicks
- Refresh the page and try again

### Auto-update not working

- Check that the toggle is enabled (green indicator should pulse)
- Some pages with minimal DOM changes may not trigger updates
- Try making a visible change to the page (e.g., open a dropdown)

### Copy to clipboard fails

- Ensure you've granted clipboard permissions
- Try selecting the text manually and copying with Ctrl+C
- Check browser console for error messages

## Development

### Building from Source

No build process required - this is a pure JavaScript extension.

### Testing

1. Load the extension in developer mode
2. Open the extension popup on any webpage
3. Test element selection with Alt+Click
4. Toggle auto-update and observe real-time updates
5. Test copy functionality

### Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT License - See LICENSE file in the repository root.

## Support

For issues, questions, or feature requests, please open an issue on the GitHub repository.

## Changelog

### Version 1.1.0 (Current)
- Added popup window functionality - open inspector in separate window
- Removed element highlighting for discreet operation
- Added ability to move inspector to different monitors
- Improved window state management
- Enhanced background service worker for window lifecycle management

### Version 1.0.0 (Initial Release)
- Full page HTML inspection
- Element selection with Alt+Click
- Real-time DOM monitoring
- Copy to clipboard functionality
- Modern, responsive UI
- Tab-based navigation

## Credits

Created as a companion extension to the Page Visibility API Disabler.
