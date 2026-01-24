// Background service worker for HTML Element Inspector

console.log('HTML Inspector: Background service worker started');

// Track opened inspector windows
const inspectorWindows = new Map(); // Map of tabId -> windowId

// Global listener for window removal
chrome.windows.onRemoved.addListener((windowId) => {
  // Check if this was an inspector window
  for (const [tabId, winId] of inspectorWindows.entries()) {
    if (winId === windowId) {
      inspectorWindows.delete(tabId);
      console.log('Inspector window closed:', windowId);
      break;
    }
  }
});

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('HTML Inspector: Extension installed/updated', details.reason);
  
  if (details.reason === 'install') {
    console.log('HTML Inspector: First time installation');
  } else if (details.reason === 'update') {
    console.log('HTML Inspector: Extension updated');
  }
});

// Handle messages between popup and content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message, 'from:', sender);
  
  if (message.action === 'openInWindow') {
    // Open the inspector in a new popup window
    openInspectorWindow(message.tabId)
      .then(() => sendResponse({ success: true }))
      .catch(err => {
        console.error('Error opening window:', err);
        sendResponse({ success: false, error: err.message });
      });
    return true; // Keep channel open for async response
  }
  
  return true; // Keep channel open
});

// Open inspector in a separate popup window
async function openInspectorWindow(tabId) {
  try {
    // Check if window already exists for this tab
    if (inspectorWindows.has(tabId)) {
      const existingWindowId = inspectorWindows.get(tabId);
      try {
        // Try to focus existing window
        await chrome.windows.update(existingWindowId, { focused: true });
        console.log('Focused existing inspector window:', existingWindowId);
        return;
      } catch (err) {
        // Window doesn't exist anymore, remove from map
        inspectorWindows.delete(tabId);
      }
    }
    
    // Create new popup window
    const window = await chrome.windows.create({
      url: `popup.html?tabId=${tabId}`,
      type: 'popup',
      width: 800,
      height: 600,
      left: 100,
      top: 100
    });
    
    // Track the window
    inspectorWindows.set(tabId, window.id);
    console.log('Created inspector window:', window.id, 'for tab:', tabId);
  } catch (error) {
    console.error('Error creating inspector window:', error);
    throw error;
  }
}

// Handle popup opening
chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked for tab:', tab.id);
});

// Clean up when tabs are closed
chrome.tabs.onRemoved.addListener((tabId) => {
  if (inspectorWindows.has(tabId)) {
    const windowId = inspectorWindows.get(tabId);
    chrome.windows.remove(windowId).catch(err => {
      console.error('Could not close inspector window:', err);
    });
    inspectorWindows.delete(tabId);
  }
});

console.log('HTML Inspector: Background service worker ready');
