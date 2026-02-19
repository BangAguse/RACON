window.__raconModules = window.__raconModules || {};
window.__raconModules.detectTechStack = function() {
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const frameworks = new Set();
    scripts.forEach(script => {
        const src = (script.src || '').toLowerCase();
        if (src.includes('react') || src.includes('react-dom')) frameworks.add('React');
        if (src.includes('vue')) frameworks.add('Vue');
        if (src.includes('angular') || src.includes('ng-')) frameworks.add('Angular');
        if (src.includes('jquery')) frameworks.add('jQuery');
        if (src.includes('next') || src.includes('_next')) frameworks.add('Next.js');
        if (src.includes('nuxt')) frameworks.add('Nuxt.js');
    });
    // also check globals
    try {
        if (window.React) frameworks.add('React');
        if (window.Vue) frameworks.add('Vue');
        if (window.angular) frameworks.add('Angular');
        if (window.jQuery || window.$) frameworks.add('jQuery');
    } catch (e) {}
    const out = Array.from(frameworks);
    return out.length ? out.join(', ') : 'Unknown';
};
