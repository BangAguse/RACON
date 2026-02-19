window.__raconModules = window.__raconModules || {};
window.__raconModules.extractSubdomains = function() {
    const links = document.querySelectorAll('a[href]');
    const subdomains = new Set();
    links.forEach(link => {
        try {
            const url = new URL(link.href, window.location.origin);
            if (url.hostname !== window.location.hostname) {
                subdomains.add(url.hostname);
            }
        } catch (e) {}
    });
    return Array.from(subdomains);
};
