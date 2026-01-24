// Background service worker for HTML Element Inspector

console.log('HTML Inspector: Background service worker started');

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
  
  // Forward messages if needed (currently direct communication works)
  // This can be expanded for more complex message routing
  
  return true; // Keep channel open
});

// Handle popup opening
chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked for tab:', tab.id);
});

console.log('HTML Inspector: Background service worker ready');
