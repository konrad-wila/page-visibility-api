// State management
let isMonitoring = false;
let selectedElement = null;
let mutationObserver = null;
let highlightOverlay = null;
let lastUpdateTime = 0;
const UPDATE_THROTTLE = 500; // ms

// Initialize content script
console.log('HTML Inspector: Content script loaded');

// Create highlight overlay
function createHighlightOverlay() {
  if (highlightOverlay) return;
  
  highlightOverlay = document.createElement('div');
  highlightOverlay.id = 'html-inspector-highlight';
  highlightOverlay.style.cssText = `
    position: absolute;
    border: 3px solid #667eea;
    background: rgba(102, 126, 234, 0.1);
    pointer-events: none;
    z-index: 999999;
    transition: all 0.2s ease;
    box-shadow: 0 0 0 1px rgba(102, 126, 234, 0.3);
  `;
  document.body.appendChild(highlightOverlay);
}

// Remove highlight overlay
function removeHighlightOverlay() {
  if (highlightOverlay && highlightOverlay.parentNode) {
    highlightOverlay.parentNode.removeChild(highlightOverlay);
    highlightOverlay = null;
  }
}

// Highlight element
function highlightElement(element) {
  if (!element) {
    removeHighlightOverlay();
    return;
  }
  
  createHighlightOverlay();
  
  const rect = element.getBoundingClientRect();
  highlightOverlay.style.top = (window.scrollY + rect.top) + 'px';
  highlightOverlay.style.left = (window.scrollX + rect.left) + 'px';
  highlightOverlay.style.width = rect.width + 'px';
  highlightOverlay.style.height = rect.height + 'px';
}

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
    highlightElement(selectedElement);
    
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
    removeHighlightOverlay();
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

// Update highlight on scroll/resize
window.addEventListener('scroll', () => {
  if (selectedElement) {
    highlightElement(selectedElement);
  }
}, { passive: true });

window.addEventListener('resize', () => {
  if (selectedElement) {
    highlightElement(selectedElement);
  }
}, { passive: true });

console.log('HTML Inspector: Ready for element selection (Alt+Click)');
