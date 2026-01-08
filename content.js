// Content script to disable Page Visibility API
// This script runs before the page loads and injects the override script

(function() {
  'use strict';

  // Inject the script file into the page context to override API before any page scripts run
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('inject.js');
  script.onload = function() {
    this.remove();
  };
  
  // Insert script at the very beginning of the document
  (document.head || document.documentElement).appendChild(script);
})();
