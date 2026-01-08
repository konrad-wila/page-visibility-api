// Injected script to override Page Visibility API and window focus detection
// This runs in the page context to override APIs before page scripts execute

(function() {
  'use strict';
  
  // Store original methods from EventTarget.prototype to catch all event registrations
  // This is more effective than overriding Window/Document separately as EventTarget
  // is the base prototype for all event-capable objects (Window, Document, Element, etc.)
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  const originalRemoveEventListener = EventTarget.prototype.removeEventListener;
  
  // Override document.hidden to always return false
  Object.defineProperty(Document.prototype, 'hidden', {
    get: function() {
      return false;
    },
    configurable: true
  });
  
  // Override document.visibilityState to always return "visible"
  Object.defineProperty(Document.prototype, 'visibilityState', {
    get: function() {
      return 'visible';
    },
    configurable: true
  });
  
  // Override document.hasFocus to always return true
  Document.prototype.hasFocus = function() {
    return true;
  };
  
  // Override EventTarget.prototype to block visibilitychange, blur, and focus events
  // This catches ALL event registrations, including those from jQuery and other libraries
  // that cache the native addEventListener method
  EventTarget.prototype.addEventListener = function(type, listener, options) {
    if (type === 'visibilitychange' || type === 'blur' || type === 'focus') {
      // Log and silently ignore these event listeners
      console.log(`[Page Visibility API Disabler] Blocked ${type} event listener`);
      return;
    }
    return originalAddEventListener.call(this, type, listener, options);
  };
  
  EventTarget.prototype.removeEventListener = function(type, listener, options) {
    if (type === 'visibilitychange' || type === 'blur' || type === 'focus') {
      // Silently ignore removal of these event listeners
      return;
    }
    return originalRemoveEventListener.call(this, type, listener, options);
  };
  
  console.log('[Page Visibility API Disabler] Extension active - all visibility/focus detection disabled.');
})();
