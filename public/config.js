// Runtime configuration
// This file is loaded before the app and allows runtime environment variable injection
(function() {
  window.__API_URL__ = '{{API_URL}}';
})();
