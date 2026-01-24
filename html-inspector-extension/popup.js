// Global state
let currentTab = 'fullPage';
let autoUpdateEnabled = false;
let currentTabId = null;

// DOM elements
const elements = {
  refreshBtn: document.getElementById('refreshBtn'),
  copyBtn: document.getElementById('copyBtn'),
  autoUpdateToggle: document.getElementById('autoUpdateToggle'),
  fullPageHtml: document.getElementById('fullPageHtml'),
  selectedElementHtml: document.getElementById('selectedElementHtml'),
  elementPath: document.getElementById('elementPath'),
  lastUpdate: document.getElementById('lastUpdate'),
  elementCount: document.getElementById('elementCount'),
  statusIndicator: document.getElementById('statusIndicator'),
  notification: document.getElementById('notification'),
  notificationText: document.getElementById('notificationText')
};

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  // Get current tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  currentTabId = tab.id;

  // Set up tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Set up button handlers
  elements.refreshBtn.addEventListener('click', refreshHTML);
  elements.copyBtn.addEventListener('click', copyToClipboard);
  elements.autoUpdateToggle.addEventListener('change', toggleAutoUpdate);

  // Initial HTML load
  await refreshHTML();

  // Listen for messages from content script
  chrome.runtime.onMessage.addListener(handleMessage);
});

// Switch between tabs
function switchTab(tabName) {
  currentTab = tabName;
  
  // Update tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });
  
  // Update tab panes
  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.remove('active');
  });
  
  if (tabName === 'fullPage') {
    document.getElementById('fullPageTab').classList.add('active');
  } else {
    document.getElementById('selectedElementTab').classList.add('active');
  }
}

// Refresh HTML from page
async function refreshHTML() {
  try {
    // Send message to content script
    const response = await chrome.tabs.sendMessage(currentTabId, { 
      action: 'getHTML' 
    });
    
    if (response) {
      updateFullPageHTML(response.html);
      if (response.selectedElement) {
        updateSelectedElement(response.selectedElement);
      }
    }
  } catch (error) {
    console.error('Error refreshing HTML:', error);
    showNotification('Error: Could not access page', 'error');
  }
}

// Update full page HTML display
function updateFullPageHTML(html) {
  elements.fullPageHtml.textContent = formatHTML(html);
  updateStatus(html);
}

// Update selected element display
function updateSelectedElement(elementData) {
  if (elementData && elementData.html) {
    elements.elementPath.textContent = elementData.path || 'Selected element';
    elements.selectedElementHtml.textContent = formatHTML(elementData.html);
  } else {
    elements.elementPath.textContent = 'No element selected. Use Alt+Click to select an element.';
    elements.selectedElementHtml.textContent = '';
  }
}

// Format HTML with indentation
function formatHTML(html) {
  if (!html) return '';
  
  // Basic formatting - add line breaks and indentation
  let formatted = html;
  let indent = 0;
  const indentSize = 2;
  
  // Add line breaks after tags
  formatted = formatted.replace(/></g, '>\n<');
  
  // Split into lines and add indentation
  const lines = formatted.split('\n');
  const indentedLines = lines.map(line => {
    line = line.trim();
    
    // Decrease indent for closing tags
    if (line.startsWith('</')) {
      indent = Math.max(0, indent - 1);
    }
    
    const indentedLine = ' '.repeat(indent * indentSize) + line;
    
    // Increase indent for opening tags (not self-closing)
    if (line.startsWith('<') && !line.startsWith('</') && !line.endsWith('/>') && !line.match(/<(br|hr|img|input|meta|link)/i)) {
      indent++;
    }
    
    return indentedLine;
  });
  
  return indentedLines.join('\n');
}

// Update status bar
function updateStatus(html) {
  // Update last update time
  const now = new Date();
  elements.lastUpdate.textContent = now.toLocaleTimeString();
  
  // Count elements
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const count = doc.querySelectorAll('*').length;
  elements.elementCount.textContent = count;
}

// Copy to clipboard
async function copyToClipboard() {
  try {
    let textToCopy = '';
    
    if (currentTab === 'fullPage') {
      textToCopy = elements.fullPageHtml.textContent;
    } else {
      textToCopy = elements.selectedElementHtml.textContent || '';
    }
    
    if (!textToCopy) {
      showNotification('Nothing to copy', 'error');
      return;
    }
    
    await navigator.clipboard.writeText(textToCopy);
    showNotification('✓ HTML copied to clipboard!', 'success');
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    showNotification('Error copying to clipboard', 'error');
  }
}

// Toggle auto-update
async function toggleAutoUpdate() {
  autoUpdateEnabled = elements.autoUpdateToggle.checked;
  
  // Update status indicator
  if (autoUpdateEnabled) {
    elements.statusIndicator.classList.add('active');
  } else {
    elements.statusIndicator.classList.remove('active');
  }
  
  // Send message to content script
  try {
    await chrome.tabs.sendMessage(currentTabId, {
      action: autoUpdateEnabled ? 'startMonitoring' : 'stopMonitoring'
    });
    
    showNotification(
      autoUpdateEnabled ? '✓ Auto-update enabled' : '✓ Auto-update disabled',
      'success'
    );
  } catch (error) {
    console.error('Error toggling auto-update:', error);
  }
}

// Handle messages from content script
function handleMessage(message, sender, sendResponse) {
  if (message.action === 'htmlUpdate') {
    // Auto-update from content script
    if (autoUpdateEnabled) {
      updateFullPageHTML(message.html);
      if (message.selectedElement) {
        updateSelectedElement(message.selectedElement);
      }
    }
  } else if (message.action === 'elementSelected') {
    // Element was selected
    updateSelectedElement(message.elementData);
    
    // Switch to selected element tab
    switchTab('selectedElement');
  }
}

// Show notification
function showNotification(text, type = 'success') {
  elements.notificationText.textContent = text;
  elements.notification.classList.remove('hidden');
  
  // Auto-hide after 2 seconds
  setTimeout(() => {
    elements.notification.classList.add('hidden');
  }, 2000);
}
