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
  
  // Override EventTarget.prototype to block visibilitychange, blur, focus, focusin, and focusout events
  // This catches ALL event registrations, including those from jQuery and other libraries
  // that cache the native addEventListener method
  EventTarget.prototype.addEventListener = function(type, listener, options) {
    if (type === 'visibilitychange' || type === 'blur' || type === 'focus' || type === 'focusin' || type === 'focusout') {
      // Log and silently ignore these event listeners
      console.log(`[Page Visibility API Disabler] Blocked ${type} event listener`);
      return;
    }
    return originalAddEventListener.call(this, type, listener, options);
  };
  
  EventTarget.prototype.removeEventListener = function(type, listener, options) {
    if (type === 'visibilitychange' || type === 'blur' || type === 'focus' || type === 'focusin' || type === 'focusout') {
      // Silently ignore removal of these event listeners
      return;
    }
    return originalRemoveEventListener.call(this, type, listener, options);
  };
  
  // Override EventTarget.prototype.dispatchEvent to block event dispatch at the deepest level
  // This prevents both new AND existing event listeners from firing
  const originalDispatchEvent = EventTarget.prototype.dispatchEvent;
  
  EventTarget.prototype.dispatchEvent = function(event) {
    const blockedTypes = ['blur', 'focus', 'focusin', 'focusout', 'visibilitychange'];
    
    if (blockedTypes.includes(event.type)) {
      console.log(`[Page Visibility API Disabler] Blocked ${event.type} event dispatch`);
      // Return true to indicate event was "handled" without errors
      return true;
    }
    
    return originalDispatchEvent.call(this, event);
  };
  
  // Override window.onblur and window.onfocus properties to prevent property-based event handlers
  // We store the handlers but never actually call them, effectively blocking them
  let onblurHandler = null;
  let onfocusHandler = null;
  
  Object.defineProperty(window, 'onblur', {
    get: function() {
      // Always return null to make it appear as if no handler is set
      return null;
    },
    set: function(handler) {
      console.log('[Page Visibility API Disabler] Blocked window.onblur property assignment');
      // Store it but never use it - effectively blocks the handler from being called
      onblurHandler = handler;
    },
    configurable: true
  });
  
  Object.defineProperty(window, 'onfocus', {
    get: function() {
      // Always return null to make it appear as if no handler is set
      return null;
    },
    set: function(handler) {
      console.log('[Page Visibility API Disabler] Blocked window.onfocus property assignment');
      // Store it but never use it - effectively blocks the handler from being called
      onfocusHandler = handler;
    },
    configurable: true
  });
  
  // Override jQuery.event.special if jQuery is loaded
  // This needs to be done after jQuery loads, so we use a timer to check
  // Note: This runs early at document_start, so jQuery may not be loaded yet
  function overrideJQuerySpecialEvents() {
    if (typeof jQuery !== 'undefined' && jQuery.event && jQuery.event.special) {
      // Override jQuery's special focus event handler
      if (jQuery.event.special.focus) {
        jQuery.event.special.focus = {
          setup: function() {
            console.log('[Page Visibility API Disabler] Blocked jQuery.event.special.focus setup');
            // Return false to prevent jQuery from setting up the event
            return false;
          },
          teardown: function() {
            return false;
          }
        };
      }
      
      // Override jQuery's special blur event handler
      if (jQuery.event.special.blur) {
        jQuery.event.special.blur = {
          setup: function() {
            console.log('[Page Visibility API Disabler] Blocked jQuery.event.special.blur setup');
            // Return false to prevent jQuery from setting up the event
            return false;
          },
          teardown: function() {
            return false;
          }
        };
      }
      
      console.log('[Page Visibility API Disabler] jQuery special events overridden');
    }
  }
  
  // Try to override jQuery special events immediately
  overrideJQuerySpecialEvents();
  
  // Also check periodically for jQuery loading (for up to 5 seconds)
  let jqueryCheckAttempts = 0;
  const jqueryCheckInterval = setInterval(function() {
    jqueryCheckAttempts++;
    if (typeof jQuery !== 'undefined') {
      overrideJQuerySpecialEvents();
      clearInterval(jqueryCheckInterval);
    } else if (jqueryCheckAttempts >= 50) {
      // Stop checking after 5 seconds (50 * 100ms)
      clearInterval(jqueryCheckInterval);
    }
  }, 100);
  
  console.log('[Page Visibility API Disabler] Extension active - all visibility/focus detection disabled.');
})();
