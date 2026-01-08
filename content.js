// Content script to disable Page Visibility API
// This script runs before the page loads and overrides the API

(function() {
  'use strict';

  // Inject the script into the page context to override API before any page scripts run
  const script = document.createElement('script');
  script.textContent = `
    (function() {
      'use strict';
      
      // Store original properties and methods
      const originalDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'hidden');
      const originalVisibilityStateDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'visibilityState');
      const originalAddEventListener = Document.prototype.addEventListener;
      const originalRemoveEventListener = Document.prototype.removeEventListener;
      
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
      
      console.log('[Page Visibility API Disabler] API has been disabled. document.hidden will always return false, and visibilityState will always return "visible".');
    })();
  `;
  
  // Insert script at the very beginning of the document
  (document.head || document.documentElement).appendChild(script);
  script.remove();
})();
