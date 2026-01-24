# Installation Guide - HTML Element Inspector

This guide will help you install and set up the HTML Element Inspector Chrome extension.

## Prerequisites

- Google Chrome, Microsoft Edge, or any Chromium-based browser (version 88 or higher for Manifest V3 support)
- Basic familiarity with browser extensions

## Installation Methods

### Method 1: Load Unpacked Extension (Recommended for Testing)

This method is ideal for development and testing purposes.

#### Step 1: Clone or Download the Repository

```bash
git clone https://github.com/konrad-wila/page-visibility-api.git
cd page-visibility-api
```

Or download the repository as a ZIP file and extract it.

#### Step 2: Open Chrome Extensions Page

1. Open Google Chrome
2. Navigate to `chrome://extensions/` by typing it in the address bar
3. Alternatively, click the three-dot menu → **More tools** → **Extensions**

#### Step 3: Enable Developer Mode

1. Look for the **Developer mode** toggle in the top-right corner
2. Turn it **ON** (it should turn blue)

#### Step 4: Load the Extension

1. Click the **Load unpacked** button (appears after enabling Developer mode)
2. Navigate to the `html-inspector-extension/` directory in the cloned repository
3. Select the folder and click **Select Folder** (or **Open** on some systems)

#### Step 5: Verify Installation

1. The extension should now appear in your extensions list
2. You should see the HTML Element Inspector icon in your Chrome toolbar
3. If you don't see the icon, click the puzzle piece icon and pin the extension

### Method 2: Microsoft Edge Installation

The same steps work for Microsoft Edge:

1. Navigate to `edge://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `html-inspector-extension/` directory

## Post-Installation

### First Launch

1. Click the extension icon in your toolbar
2. The popup will open showing the HTML inspector interface
3. Navigate to any webpage to start inspecting HTML

### Permissions

The extension will request the following permissions:
- **Active Tab**: To access the current page's HTML content
- **Scripting**: To inject content scripts for element selection
- **Clipboard Write**: To copy HTML to your clipboard

These permissions are automatically granted when you load the extension in developer mode.

## Updating the Extension

If you make changes to the extension files:

1. Go to `chrome://extensions/`
2. Find the HTML Element Inspector extension
3. Click the **Reload** button (circular arrow icon)
4. The extension will reload with your changes

## Troubleshooting

### Extension Not Appearing

- **Solution**: Make sure you selected the correct `html-inspector-extension/` directory (not the parent directory)
- **Check**: Verify that `manifest.json` exists in the selected directory

### "Manifest file is missing or unreadable" Error

- **Solution**: Ensure you selected the `html-inspector-extension/` folder, not a parent or child folder
- **Check**: Verify that `manifest.json` is valid JSON (no syntax errors)

### Extension Icon Not Showing

- **Solution**: Click the puzzle piece icon in Chrome toolbar and pin the extension
- **Alternative**: Access the extension from the extensions menu

### Content Script Not Working

- **Solution**: Refresh the webpage after installing the extension
- **Note**: Some pages with strict Content Security Policy may limit functionality

### Popup Not Opening

- **Solution**: Try reloading the extension from `chrome://extensions/`
- **Check**: Look for errors in the Chrome console (right-click extension icon → Inspect popup)

### "Cannot access chrome" Error

- **Solution**: This is normal when opening popup.html directly in a browser tab
- **Note**: The extension must be used through the browser action (clicking the icon)

## Uninstallation

To remove the extension:

1. Go to `chrome://extensions/`
2. Find the HTML Element Inspector extension
3. Click **Remove**
4. Confirm the removal

## Testing the Extension

After installation, test the extension using the included test page:

1. Open `html-inspector-extension/test-page.html` in Chrome
2. Click the extension icon to open the popup
3. Try the following features:
   - View full page HTML in the "Full Page HTML" tab
   - Alt+Click on elements to select them
   - Toggle auto-update and click buttons to see live DOM changes
   - Copy HTML to clipboard

## Next Steps

- Read the [README.md](README.md) for usage instructions
- Try the extension on different websites
- Enable auto-update to monitor dynamic pages
- Use Alt+Click to inspect specific elements

## Support

For issues or questions:
- Check the [README.md](README.md) troubleshooting section
- Open an issue on the GitHub repository
- Review Chrome's extension development documentation

## Security Notes

- This extension only accesses page content when you open the popup
- No data is collected, stored, or transmitted
- All processing happens locally in your browser
- The extension is open source - review the code yourself!

## Development

If you want to modify the extension:

1. Make your changes to the source files
2. Reload the extension from `chrome://extensions/`
3. Test your changes on the test page
4. Clear the browser cache if styles don't update

## Chrome Web Store Publication (Future)

This extension is currently available for manual installation. To use a published version:

1. We may publish to Chrome Web Store in the future
2. Until then, use the "Load unpacked" method described above

---

**Happy inspecting!** 🔍
