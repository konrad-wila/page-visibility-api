// State management
let isMonitoring = false;
let selectedElement = null;
let mutationObserver = null;
let lastUpdateTime = 0;
const UPDATE_THROTTLE = 500; // ms

// Initialize content script
console.log('HTML Inspector: Content script loaded');

// Get element path
function getElementPath(element) {
  if (!element || element === document.documentElement) {
    return 'html';
  }
  
  const path = [];
  let current = element;
  
  while (current && current !== document.documentElement) {
    let selector = current.tagName.toLowerCase();
    
    if (current.id) {
      selector += '#' + current.id;
    } else if (current.className && typeof current.className === 'string') {
      const classes = current.className.trim().split(/\s+/).slice(0, 2);
      if (classes.length > 0 && classes[0]) {
        selector += '.' + classes.join('.');
      }
    }
    
    path.unshift(selector);
    current = current.parentElement;
  }
  
  return 'html > ' + path.join(' > ');
}

// Handle element selection (Alt+Click)
function handleElementClick(event) {
  if (event.altKey) {
    event.preventDefault();
    event.stopPropagation();
    
    selectedElement = event.target;
    
    const elementData = {
      html: selectedElement.outerHTML,
      path: getElementPath(selectedElement),
      tagName: selectedElement.tagName.toLowerCase()
    };
    
    // Send to popup
    chrome.runtime.sendMessage({
      action: 'elementSelected',
      elementData: elementData
    }).catch(err => {
      console.log('Popup not open:', err);
    });
  }
}

// Get page HTML
function getPageHTML() {
  return document.documentElement.outerHTML;
}

// Get selected element data
function getSelectedElementData() {
  if (!selectedElement || !document.body.contains(selectedElement)) {
    selectedElement = null;
    return null;
  }
  
  return {
    html: selectedElement.outerHTML,
    path: getElementPath(selectedElement),
    tagName: selectedElement.tagName.toLowerCase()
  };
}

// Send HTML update to popup (throttled)
function sendHTMLUpdate() {
  const now = Date.now();
  if (now - lastUpdateTime < UPDATE_THROTTLE) {
    return;
  }
  lastUpdateTime = now;
  
  const html = getPageHTML();
  const selectedElementData = getSelectedElementData();
  
  chrome.runtime.sendMessage({
    action: 'htmlUpdate',
    html: html,
    selectedElement: selectedElementData
  }).catch(err => {
    // Popup might be closed, that's okay
    console.log('Could not send update:', err);
  });
}

// Start monitoring DOM changes
function startMonitoring() {
  if (isMonitoring) return;
  
  isMonitoring = true;
  console.log('HTML Inspector: Started monitoring');
  
  // Create mutation observer
  mutationObserver = new MutationObserver((mutations) => {
    sendHTMLUpdate();
  });
  
  // Start observing
  mutationObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true
  });
}

// Stop monitoring DOM changes
function stopMonitoring() {
  if (!isMonitoring) return;
  
  isMonitoring = false;
  console.log('HTML Inspector: Stopped monitoring');
  
  if (mutationObserver) {
    mutationObserver.disconnect();
    mutationObserver = null;
  }
}

// Handle messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Content script received message:', message);
  
  if (message.action === 'getHTML') {
    const html = getPageHTML();
    const selectedElementData = getSelectedElementData();
    
    sendResponse({
      html: html,
      selectedElement: selectedElementData
    });
  } else if (message.action === 'startMonitoring') {
    startMonitoring();
    sendResponse({ success: true });
  } else if (message.action === 'stopMonitoring') {
    stopMonitoring();
    sendResponse({ success: true });
  }
  
  return true; // Keep channel open for async response
});

// Set up element selection
document.addEventListener('click', handleElementClick, true);

console.log('HTML Inspector: Ready for element selection (Alt+Click)');
