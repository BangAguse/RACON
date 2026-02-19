window.__raconModules = window.__raconModules || {};
window.__raconModules.extractEndpoints = function() {
    const scripts = Array.from(document.querySelectorAll('script'));
    const endpoints = new Set();
    scripts.forEach(script => {
        try {
            const text = script.textContent || '';
            // full URLs
            const matches = text.match(/https?:\/\/[^\s'\"]+/g) || [];
            matches.forEach(m => endpoints.add(m));
            // common relative API patterns
            const relMatches = text.match(/\/[a-z0-9_\-\/]*api[a-z0-9_\-\/]*["'\)\s]/gi) || [];
            relMatches.forEach(m => {
                const cleaned = m.replace(/["'\)\s]/g, '');
                try { endpoints.add(new URL(cleaned, window.location.href).href); } catch (e) {}
            });
            // fetch/XHR/axios patterns
            const fetchMatches = text.match(/fetch\s*\(\s*['"`]([^'"`]+)['"`]/g) || [];
            fetchMatches.forEach(fm => {
                const urlm = fm.match(/fetch\s*\(\s*['"`]([^'"`]+)['"`]/);
                if (urlm && urlm[1]) {
                    try { endpoints.add(new URL(urlm[1], window.location.href).href); } catch (e) { endpoints.add(urlm[1]); }
                }
            });
            const xhrMatches = text.match(/open\s*\(\s*['\"](GET|POST)['\"]\s*,\s*['\"]([^'\"]+)['\"]/gi) || [];
            xhrMatches.forEach(x => {
                const m = x.match(/open\s*\(\s*['\"](?:GET|POST)['\"]\s*,\s*['\"]([^'\"]+)['\"]/i);
                if (m && m[1]) {
                    try { endpoints.add(new URL(m[1], window.location.href).href); } catch (e) { endpoints.add(m[1]); }
                }
            });
        } catch (e) {}
    });
    return Array.from(endpoints);
};
