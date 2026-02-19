window.__raconModules = window.__raconModules || {};
window.__raconModules.listExternalAssets = function() {
    const assets = document.querySelectorAll('script[src], link[href], img[src]');
    const externals = new Set();
    assets.forEach(asset => {
        try {
            const src = asset.src || asset.href || '';
            if (src && !src.startsWith(window.location.origin)) {
                externals.add(new URL(src, window.location.origin).hostname);
            }
        } catch (e) {}
    });
    return Array.from(externals);
};
