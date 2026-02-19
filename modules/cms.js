window.__raconModules = window.__raconModules || {};
window.__raconModules.detectCMS = function() {
    if (document.querySelector('meta[name="generator"][content*="WordPress"]')) return 'WordPress';
    if (document.querySelector('link[href*="shopify"]')) return 'Shopify';
    return 'Unknown';
};
