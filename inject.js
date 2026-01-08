// Injected script to override Page Visibility API and window focus detection
// This runs in the page context to override APIs before page scripts execute

(function() {
  'use strict';
  
  // Store original methods
  const originalAddEventListener = Document.prototype.addEventListener;
  const originalRemoveEventListener = Document.prototype.removeEventListener;
  const originalWindowAddEventListener = Window.prototype.addEventListener;
  const originalWindowRemoveEventListener = Window.prototype.removeEventListener;
  
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
  
  // Block visibilitychange events
  Document.prototype.addEventListener = function(type, listener, options) {
    if (type === 'visibilitychange') {
      // Silently ignore visibilitychange event listeners
      return;
    }
    return originalAddEventListener.call(this, type, listener, options);
  };
  
  Document.prototype.removeEventListener = function(type, listener, options) {
    if (type === 'visibilitychange') {
      // Silently ignore removal of visibilitychange event listeners
      return;
    }
    return originalRemoveEventListener.call(this, type, listener, options);
  };
  
  // Block window blur and focus events
  Window.prototype.addEventListener = function(type, listener, options) {
    if (type === 'blur' || type === 'focus') {
      // Silently ignore blur and focus event listeners
      return;
    }
    return originalWindowAddEventListener.call(this, type, listener, options);
  };
  
  Window.prototype.removeEventListener = function(type, listener, options) {
    if (type === 'blur' || type === 'focus') {
      // Silently ignore removal of blur and focus event listeners
      return;
    }
    return originalWindowRemoveEventListener.call(this, type, listener, options);
  };
  
  console.log('[Page Visibility API Disabler] Extension active - all visibility/focus detection disabled.');
})();
