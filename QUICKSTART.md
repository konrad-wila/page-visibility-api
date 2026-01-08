# Quick Reference Guide

## 🚀 Quick Start

1. **Load Extension**: `chrome://extensions/` → Enable "Developer mode" → "Load unpacked"
2. **Select Folder**: Choose the folder containing `manifest.json`
3. **Done!** The extension works automatically on all websites

## 🔍 What Gets Changed

| API Property/Method | Normal Behavior | With Extension |
|---------------------|-----------------|----------------|
| `document.hidden` | `true` when tab is hidden | Always `false` |
| `document.visibilityState` | `"visible"` or `"hidden"` | Always `"visible"` |
| `document.hasFocus()` | `false` when window loses focus | Always `true` |
| `visibilitychange` event | Fires on tab switch | Never fires |
| `window.blur` event | Fires when window loses focus | Never fires |
| `window.focus` event | Fires when window gains focus | Never fires |

## ✅ Testing Commands

Open browser console (F12) and try:

```javascript
// Should always return false with extension enabled
document.hidden

// Should always return "visible" with extension enabled
document.visibilityState

// Should always return true with extension enabled
document.hasFocus()
```

## 📝 Test Procedure

1. Open `test.html` or `demo.html` in Chrome
2. Note the current values
3. Switch to another tab for 5 seconds
4. Switch back
5. **With extension**: Values unchanged
6. **Without extension**: Values show the tab was hidden

## 🎯 Use Cases

- **Video playback**: Keep videos playing when tab is unfocused
- **Real-time updates**: Maintain WebSocket/polling when backgrounded  
- **Games**: Continue game logic when tab loses focus
- **Testing**: Test apps that use visibility detection
- **Privacy**: Prevent websites from tracking tab switching behavior

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| Not working | Refresh the page (Ctrl+R) |
| Still detecting | Check extension is enabled at `chrome://extensions/` |
| Console errors | Reinstall: Remove extension and load again |
| Values changing | Verify extension loads on the page (check console for message) |

## 📦 Files Overview

```
page-visibility-api/
├── manifest.json      # Extension config (required)
├── content.js         # Content script that injects override (required)
├── inject.js          # Injected script with API overrides (required)
├── icons/            # Extension icons (required)
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── README.md         # Full documentation
├── INSTALL.md        # Installation guide
├── test.html         # Simple test page
├── demo.html         # Advanced demo with animations
└── LICENSE           # MIT License
```

## 🔒 Security & Privacy

- ✅ **No permissions required**
- ✅ **No data collection**
- ✅ **No network access**
- ✅ **Open source**
- ✅ **Runs locally only**

## 💡 Tips

1. **Extension works immediately** on page load
2. **No toolbar button** - works automatically in background
3. **Works on all websites** - no exceptions needed
4. **No configuration** - set and forget
5. **Check console** - Look for "[Page Visibility API Disabler]" message

## 🐛 Known Limitations

- `document.hasFocus()` still works correctly (this is intentional)
- Some websites may use other detection methods (mouse movement, keyboard events)
- Extension must be loaded before page to work properly

## 📚 Learn More

- Full details: See `README.md`
- Installation help: See `INSTALL.md`
- Try it out: Open `demo.html`
- Simple test: Open `test.html`

## 🆘 Getting Help

1. Check the console for error messages
2. Review `INSTALL.md` troubleshooting section
3. Open an issue on GitHub
4. Verify browser supports Manifest V3 (Chrome 88+)

---

**Version**: 1.0.0 | **License**: MIT | **Status**: Active Development
