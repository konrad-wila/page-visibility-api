# Installation Guide

This guide will help you install and test the Page Visibility API Disabler Chrome extension.

## Prerequisites

- Google Chrome, Microsoft Edge, or any Chromium-based browser
- Basic understanding of browser extensions

## Step-by-Step Installation

### 1. Download the Extension

**Option A: Clone the Repository**
```bash
git clone https://github.com/konrad-wila/page-visibility-api.git
cd page-visibility-api
```

**Option B: Download ZIP**
1. Go to the [GitHub repository](https://github.com/konrad-wila/page-visibility-api)
2. Click the green "Code" button
3. Select "Download ZIP"
4. Extract the ZIP file to a folder on your computer

### 2. Load the Extension in Chrome

1. Open Google Chrome (or your Chromium-based browser)
2. Navigate to `chrome://extensions/` by typing it in the address bar
3. Enable **Developer mode** by clicking the toggle switch in the top-right corner
4. Click the **"Load unpacked"** button that appears
5. Browse to and select the folder containing the extension files (the folder with `manifest.json`)
6. The extension should now appear in your extensions list

### 3. Verify Installation

You should see "Page Visibility API Disabler" in your extensions list with:
- A blue eye icon with a red slash through it
- Version 1.0.0
- Status showing "Active"

## Testing the Extension

### Quick Test

1. Open the included `test.html` file in your browser:
   - Right-click on `test.html` in the extension folder
   - Select "Open with" → Chrome/Edge
   - Or drag the file into your browser window

2. Observe the current values:
   - `document.hidden`: should show `false`
   - `document.visibilityState`: should show `"visible"`

3. Switch to another tab or minimize the browser window

4. Return to the test page

5. **With the extension enabled:**
   - Values should remain unchanged
   - No "visibility changed" events in the log

6. **To test without the extension:**
   - Go to `chrome://extensions/`
   - Disable the extension
   - Refresh the test page
   - Repeat steps 3-4
   - Values should change and events should be logged

### Testing on Real Websites

1. Open any website (e.g., YouTube, Twitter, etc.)
2. Open the browser's Developer Console (Press F12)
3. Type the following commands:

```javascript
// Should always return false
console.log(document.hidden);

// Should always return "visible"
console.log(document.visibilityState);
```

4. Switch to another tab and back
5. Run the commands again - values should remain the same

### Advanced Testing

Test that event listeners are blocked:

```javascript
// This listener should never fire with the extension enabled
document.addEventListener('visibilitychange', function() {
    console.log('Visibility changed!');
});
```

Switch tabs - no message should appear in the console.

## Troubleshooting

### Extension Not Working

1. **Check if it's enabled:**
   - Go to `chrome://extensions/`
   - Ensure the extension's toggle is ON

2. **Refresh the page:**
   - The extension runs when pages load
   - Press Ctrl+R or F5 to reload

3. **Check for errors:**
   - On `chrome://extensions/`
   - Click "Details" on the extension
   - Check for error messages

4. **Verify browser compatibility:**
   - Requires Manifest V3 support
   - Works on Chrome 88+ and Edge 88+

### Console Shows Errors

If you see errors in the console:
- Make sure all files are present (manifest.json, content.js, icons/)
- Try removing and reinstalling the extension
- Check file permissions

### Extension Icon Not Showing

This is normal - the extension doesn't add a toolbar button. It works automatically in the background.

## Updating the Extension

To update to a new version:

1. Download/pull the latest version
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
   - OR remove the extension and reload it

## Uninstalling

To remove the extension:

1. Go to `chrome://extensions/`
2. Find "Page Visibility API Disabler"
3. Click "Remove"
4. Confirm the removal

## Security Notes

- This extension requires no special permissions
- It only modifies the Page Visibility API behavior
- It doesn't collect any data or make network requests
- Source code is fully visible and auditable

## Getting Help

If you encounter issues:
1. Check this guide's Troubleshooting section
2. Review the [README.md](README.md) for more information
3. Open an issue on the GitHub repository
4. Include browser version and any error messages

## Privacy

This extension:
- ✅ Runs locally on your machine
- ✅ No data collection
- ✅ No network requests
- ✅ No tracking
- ✅ Open source

## Next Steps

- Read the [README.md](README.md) for technical details
- Review the source code in `content.js`
- Test with the included `test.html` file
- Report any issues on GitHub

---

**Happy browsing with full control over the Page Visibility API!** 👁️🚫
