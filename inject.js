// Injected script to override Page Visibility API and window focus detection
// This runs in the page context to override APIs before page scripts execute

(function() {
    'use strict';

    window.addEventListener(
        "visibilitychange",
        function(event) {
            event.stopImmediatePropagation();
        },
        true
    );

    window.addEventListener(
        "webkitvisibilitychange",
        function(event) {
            event.stopImmediatePropagation();
        },
        true
    );

    window.addEventListener(
        "blur",
        function(event) {
            event.stopImmediatePropagation();
        },
        true
    );

    // List of event types that should be blocked
    const BLOCKED_EVENT_TYPES = ['visibilitychange', 'blur', 'focus', 'focusin', 'focusout'];

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
        if (BLOCKED_EVENT_TYPES.includes(type)) {
            // Log and silently ignore these event listeners
            console.log(`[Page Visibility API Disabler] Blocked ${type} event listener`);
            return;
        }
        return originalAddEventListener.call(this, type, listener, options);
    };

    EventTarget.prototype.removeEventListener = function(type, listener, options) {
        if (BLOCKED_EVENT_TYPES.includes(type)) {
            // Silently ignore removal of these event listeners
            return;
        }
        return originalRemoveEventListener.call(this, type, listener, options);
    };

    // Override EventTarget.prototype.dispatchEvent to block event dispatch at the deepest level
    // This prevents both new AND existing event listeners from firing
    const originalDispatchEvent = EventTarget.prototype.dispatchEvent;

    EventTarget.prototype.dispatchEvent = function(event) {
        if (BLOCKED_EVENT_TYPES.includes(event.type)) {
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

    // Override document.onvisibilitychange property to prevent property-based event handlers
    let onvisibilitychangeHandler = null;

    Object.defineProperty(Document.prototype, 'onvisibilitychange', {
        get: function() {
            // Always return null to make it appear as if no handler is set
            return null;
        },
        set: function(handler) {
            console.log('[Page Visibility API Disabler] Blocked document.onvisibilitychange property assignment');
            // Store it but never use it - effectively blocks the handler from being called
            onvisibilitychangeHandler = handler;
        },
        configurable: true
    });

    // Override HTMLElement.prototype.onblur and onfocus properties
    // This catches property assignments on any HTML element (div, body, etc.)
    Object.defineProperty(HTMLElement.prototype, 'onblur', {
        get: function() {
            return null;
        },
        set: function(handler) {
            console.log('[Page Visibility API Disabler] Blocked element.onblur property assignment');
        },
        configurable: true
    });

    Object.defineProperty(HTMLElement.prototype, 'onfocus', {
        get: function() {
            return null;
        },
        set: function(handler) {
            console.log('[Page Visibility API Disabler] Blocked element.onfocus property assignment');
        },
        configurable: true
    });

    // Override Event constructor to prevent creating blocked event types
    const OriginalEvent = window.Event;
    window.Event = function(type, eventInitDict) {
        if (BLOCKED_EVENT_TYPES.includes(type)) {
            console.log(`[Page Visibility API Disabler] Blocked Event constructor for type: ${type}`);
            // Return a dummy event instead
            return new OriginalEvent('dummy-blocked-event', eventInitDict);
        }
        return new OriginalEvent(type, eventInitDict);
    };
    // Preserve the prototype chain
    window.Event.prototype = OriginalEvent.prototype;

    // MutationObserver to watch for and remove inline HTML attribute event handlers
    // This prevents event handlers added via setAttribute or directly in HTML
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes') {
                const attrName = mutation.attributeName;
                // Check if it's one of the blocked event attributes
                if (['onblur', 'onfocus', 'onvisibilitychange'].includes(attrName)) {
                    const element = mutation.target;
                    const attrValue = element.getAttribute(attrName);
                    if (attrValue !== null) {
                        console.log(`[Page Visibility API Disabler] Removed inline ${attrName} attribute from element`);
                        element.removeAttribute(attrName);
                    }
                }
            }
        });
    });

    // Start observing when DOM is ready
    // Script runs at document_start, so documentElement should exist
    if (document.documentElement) {
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['onblur', 'onfocus', 'onvisibilitychange'],
            subtree: true
        });
    }

    // Zone.js detection and handling (for Angular applications)
    // Zone.js patches native event methods, so we need to override those too
    if (window.Zone && window.Zone.__symbol__ && typeof window.Zone.__symbol__ === 'function') {
        const zoneSymbol = window.Zone.__symbol__;

        // Try to override Zone's patched addEventListener
        const addEventListenerSymbol = zoneSymbol('addEventListener');
        if (EventTarget.prototype[addEventListenerSymbol]) {
            const originalZoneAddEventListener = EventTarget.prototype[addEventListenerSymbol];
            EventTarget.prototype[addEventListenerSymbol] = function(type, listener, options) {
                if (BLOCKED_EVENT_TYPES.includes(type)) {
                    console.log(`[Page Visibility API Disabler] Blocked Zone.js ${type} event listener`);
                    return;
                }
                return originalZoneAddEventListener.call(this, type, listener, options);
            };
            console.log('[Page Visibility API Disabler] Zone.js addEventListener patched');
        }

        // Try to override Zone's patched removeEventListener
        const removeEventListenerSymbol = zoneSymbol('removeEventListener');
        if (EventTarget.prototype[removeEventListenerSymbol]) {
            const originalZoneRemoveEventListener = EventTarget.prototype[removeEventListenerSymbol];
            EventTarget.prototype[removeEventListenerSymbol] = function(type, listener, options) {
                if (BLOCKED_EVENT_TYPES.includes(type)) {
                    return;
                }
                return originalZoneRemoveEventListener.call(this, type, listener, options);
            };
            console.log('[Page Visibility API Disabler] Zone.js removeEventListener patched');
        }
    }

    // Override jQuery.event.special if jQuery is loaded
    // This needs to be done after jQuery loads, so we use a timer to check
    // Note: This runs early at document_start, so jQuery may not be loaded yet
    function overrideJQuerySpecialEvents() {
        if (typeof jQuery !== 'undefined') {

            // CRITICAL FIX: Override jQuery.event.add which jQuery.on() uses internally
            if (jQuery.event && jQuery.event.add) {
                const originalEventAdd = jQuery.event.add;

                jQuery.event.add = function(elem, types, handler, data, selector) {
                    // Check if types contains any blocked event
                    if (typeof types === 'string') {
                        const typeArray = types.split(' ');
                        const hasBlockedType = typeArray.some(type => {
                            const cleanType = type.replace(/^on/, '').split('.')[0]; // Handle namespaced events like 'blur.namespace'
                            return BLOCKED_EVENT_TYPES.includes(cleanType);
                        });

                        if (hasBlockedType) {
                            console.log(`[Page Visibility API Disabler] Blocked jQuery.event.add for: ${types}`);
                            return; // Don't add the event
                        }
                    }

                    return originalEventAdd.call(this, elem, types, handler, data, selector);
                };

                console.log('[Page Visibility API Disabler] jQuery.event.add overridden');
            }

            // ADDITIONAL FIX: Override jQuery.fn.on as a backup
            if (jQuery.fn && jQuery.fn.on) {
                const originalOn = jQuery.fn.on;

                jQuery.fn.on = function(types, selector, data, fn) {
                    if (typeof types === 'string') {
                        const typeArray = types.split(' ');
                        const hasBlockedType = typeArray.some(type => {
                            const cleanType = type.replace(/^on/, '').split('.')[0];
                            return BLOCKED_EVENT_TYPES.includes(cleanType);
                        });

                        if (hasBlockedType) {
                            console.log(`[Page Visibility API Disabler] Blocked jQuery.fn.on for: ${types}`);
                            return this; // Return jQuery object for chaining but don't add event
                        }
                    }

                    return originalOn.call(this, types, selector, data, fn);
                };

                console.log('[Page Visibility API Disabler] jQuery.fn.on overridden');
            }

            // EXISTING CODE: Override jQuery's special event handlers
            if (jQuery.event && jQuery.event.special) {
                // Override jQuery's special focus event handler
                if (jQuery.event.special.focus) {
                    jQuery.event.special.focus = {
                        setup: function() {
                            console.log('[Page Visibility API Disabler] Blocked jQuery.event.special.focus setup');
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

    // Override Window Management API (Multi-Screen Window Placement API)
    // This API allows websites to detect multiple monitors and manage windows across them
    // We override it to always return that there is only one monitor
    
    // Only override if the browser supports these APIs to preserve feature detection
    // This prevents breaking sites that check for API availability before using it

    // Override window.screen.isExtended to always return false (indicating single monitor)
    if ('isExtended' in window.screen) {
        Object.defineProperty(window.screen, 'isExtended', {
            get: function() {
                return false;
            },
            configurable: true
        });
    }

    // Override window.getScreenDetails() to return a mock ScreenDetails object with single monitor
    // Only override if the function already exists to maintain proper feature detection
    if (typeof window.getScreenDetails === 'function') {
        const originalGetScreenDetails = window.getScreenDetails;
        
        window.getScreenDetails = async function() {
            console.log('[Page Visibility API Disabler] Blocked window.getScreenDetails() - returning single monitor');
            
            // Try to get real screen details first, then collapse to single screen
            let realDetails;
            try {
                realDetails = await originalGetScreenDetails.call(window);
            } catch (e) {
                // If permission denied or error, we'll use fallback values
                realDetails = null;
            }
            
            // Use real screen data if available, otherwise fall back to window.screen
            const sourceScreen = (realDetails && realDetails.screens && realDetails.screens.length > 0) 
                ? realDetails.screens[0] 
                : window.screen;
            
            // Create a mock ScreenDetailed object for the primary screen
            // Using real values when possible to avoid fingerprinting
            const mockScreen = {
                availWidth: sourceScreen.availWidth,
                availHeight: sourceScreen.availHeight,
                width: sourceScreen.width,
                height: sourceScreen.height,
                colorDepth: sourceScreen.colorDepth,
                pixelDepth: sourceScreen.pixelDepth,
                availLeft: sourceScreen.availLeft || 0,
                availTop: sourceScreen.availTop || 0,
                left: 0,
                top: 0,
                isPrimary: true,
                // Use real value if available, otherwise default to true for primary monitor
                isInternal: sourceScreen.isInternal !== undefined ? sourceScreen.isInternal : true,
                devicePixelRatio: sourceScreen.devicePixelRatio || window.devicePixelRatio || 1,
                // Use real label if available, otherwise generic label
                label: sourceScreen.label || '',
                // EventTarget methods (ScreenDetailed extends EventTarget)
                addEventListener: function() {},
                removeEventListener: function() {},
                dispatchEvent: function() { return true; }
            };

            // Create mock ScreenDetails object
            const mockScreenDetails = {
                screens: [mockScreen],
                currentScreen: mockScreen,
                // EventTarget methods (ScreenDetails extends EventTarget)
                addEventListener: function() {},
                removeEventListener: function() {},
                dispatchEvent: function() { return true; },
                // screenschange event handling (we never fire it)
                onscreenschange: null
            };

            // Return a resolved promise with the mock data
            return Promise.resolve(mockScreenDetails);
        };
    }

    console.log("[Page Visibility API Disabler] Extension active - all visibility/focus detection disabled.");
})();
