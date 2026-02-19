// RACON Module Functions - Embedded version (loaded directly as content script)
// This ensures modules are always available in page context

window.__raconModules = window.__raconModules || {};

// 1. Tech Stack Detection
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
    try {
        if (window.React) frameworks.add('React');
        if (window.Vue) frameworks.add('Vue');
        if (window.angular) frameworks.add('Angular');
        if (window.jQuery || window.$) frameworks.add('jQuery');
    } catch (e) {}
    const out = Array.from(frameworks);
    return out.length ? out.join(', ') : 'Unknown';
};

// 2. CMS Detection
window.__raconModules.detectCMS = function() {
    if (document.querySelector('meta[name="generator"][content*="WordPress"]')) return 'WordPress';
    if (document.querySelector('link[href*="shopify"]')) return 'Shopify';
    if (document.querySelector('meta[content*="Joomla"]')) return 'Joomla';
    if (document.querySelector('meta[content*="Drupal"]')) return 'Drupal';
    if (document.querySelector('meta[name="generator"][content*="Magento"]')) return 'Magento';
    return 'Unknown';
};

// 3. Subdomains Extraction
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

// 4. Endpoints Discovery
window.__raconModules.extractEndpoints = function() {
    const scripts = Array.from(document.querySelectorAll('script'));
    const endpoints = new Set();
    scripts.forEach(script => {
        try {
            const text = script.textContent || '';
            const matches = text.match(/https?:\/\/[^\s'\"]+/g) || [];
            matches.forEach(m => endpoints.add(m));
            const relMatches = text.match(/\/[a-z0-9_\-\/]*api[a-z0-9_\-\/]*["'\)\s]/gi) || [];
            relMatches.forEach(m => {
                const cleaned = m.replace(/["'\)\s]/g, '');
                try { endpoints.add(new URL(cleaned, window.location.href).href); } catch (e) {}
            });
            const fetchMatches = text.match(/fetch\s*\(\s*['"`]([^'"`]+)['"`]/g) || [];
            fetchMatches.forEach(fm => {
                const urlm = fm.match(/fetch\s*\(\s*['"`]([^'"`]+)['"`]/);
                if (urlm && urlm[1]) {
                    try { endpoints.add(new URL(urlm[1], window.location.href).href); } catch (e) { endpoints.add(urlm[1]); }
                }
            });
        } catch (e) {}
    });
    return Array.from(endpoints);
};

// 5. External Assets Listing
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

// 6. Email Harvesting
window.__raconModules.harvestEmails = function() {
    const text = document.body ? document.body.textContent : '';
    const emails = (text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g) || []).slice();
    const obf = text.match(/([A-Za-z0-9._%+-]+)\s*\[at\]\s*([A-Za-z0-9.-]+\.[A-Za-z]{2,})/gi) || [];
    obf.forEach(m => {
        const parts = m.match(/([A-Za-z0-9._%+-]+)\s*\[at\]\s*([A-Za-z0-9.-]+\.[A-Za-z]{2,})/i);
        if (parts && parts[1] && parts[2]) emails.push(parts[1] + '@' + parts[2]);
    });
    return Array.from(new Set(emails));
};

// 7. SQLi Detection
window.__raconModules.detectSQLi = function() {
    const inputs = document.querySelectorAll('input, textarea');
    const vulns = [];
    inputs.forEach(input => {
        try {
            const v = (input.value || '').toString();
            if (/\bOR\s+1=1\b/i.test(v) || /UNION\s+SELECT/i.test(v) || /\bDROP\s+TABLE\b/i.test(v) || /['"].*--/.test(v) || /\'/.test(v) && /\b(SELECT|INSERT|UPDATE|DELETE)\b/i.test(v)) {
                vulns.push({ type: 'SQLi', description: 'Potential SQL injection in input', severity: 'high' });
            }
        } catch (e) {}
    });
    return vulns;
};

// 8. XSS Detection
window.__raconModules.detectXSS = function() {
    const vulns = [];
    try {
        const all = Array.from(document.querySelectorAll('*'));
        all.forEach(el => {
            const hasOn = Array.from(el.attributes || []).some(a => /^on/i.test(a.name));
            if (hasOn) vulns.push({ type: 'XSS', description: 'Element with inline event handler (possible sink)', severity: 'medium' });
        });
        const scripts = Array.from(document.querySelectorAll('script'));
        scripts.forEach(s => {
            const t = s.textContent || '';
            if (/\.innerHTML\s*=/.test(t) || /document\.write\s*\(/.test(t) || /innerHTML\.append/i.test(t)) {
                vulns.push({ type: 'XSS', description: 'Script uses innerHTML/document.write (possible sink)', severity: 'high' });
            }
        });
    } catch (e) {}
    const uniq = [];
    const seen = new Set();
    vulns.forEach(v => { if (!seen.has(v.description)) { seen.add(v.description); uniq.push(v); } });
    return uniq;
};

// 9. Sensitive Files Check
window.__raconModules.detectSensitiveFiles = function() {
    const links = document.querySelectorAll('a[href]');
    const vulns = [];
    links.forEach(link => {
        try {
            const href = link.href || '';
            if (href.includes('.env') || href.includes('.git') || href.includes('phpinfo.php') || href.includes('.bak') || href.includes('.sql')) {
                vulns.push({ type: 'Sensitive File', description: `Exposed: ${href}`, severity: 'high' });
            }
        } catch (e) {}
    });
    return vulns;
};

// 10. API Keys Detection
window.__raconModules.detectAPIKeys = function() {
    const scripts = Array.from(document.querySelectorAll('script'));
    const vulns = [];
    const patterns = [
        /AKIA[0-9A-Z]{16}/,
        /AIza[0-9A-Za-z-_]{35}/,
        /sk_live_[0-9a-zA-Z]{24,}/i,
        /pk_live_[0-9a-zA-Z]{24,}/i,
        /TWILIO_[0-9A-Za-z_-]{16,}/i,
        /eyJ[A-Za-z0-9-_]{10,}\.[A-Za-z0-9-_]{10,}\.[A-Za-z0-9-_]{10,}/
    ];
    scripts.forEach(script => {
        try {
            const text = script.textContent || '';
            for (const re of patterns) if (re.test(text)) { vulns.push({ type: 'API Key Leak', description: 'Potential API key exposed (pattern matched)', severity: 'high' }); break; }
        } catch (e) {}
    });
    return vulns;
};

// 11. Security Headers Audit
window.__raconModules.auditSecurityHeaders = function(headers) {
    headers = headers || {};
    const vulns = [];
    try {
        const csp = headers['Content-Security-Policy'] || headers['content-security-policy'];
        if (!csp) vulns.push({ type: 'Security Headers', description: 'Missing CSP', severity: 'medium' });
        else {
            if (/default-src\s+\*/.test(csp) || /script-src\s+\*/.test(csp)) {
                vulns.push({ type: 'Security Headers', description: 'CSP appears permissive (contains *)', severity: 'medium' });
            }
        }
        if (!headers['Strict-Transport-Security'] && !headers['strict-transport-security']) vulns.push({ type: 'Security Headers', description: 'Missing HSTS', severity: 'medium' });
        if (!headers['X-Frame-Options'] && !headers['x-frame-options']) vulns.push({ type: 'Security Headers', description: 'Missing X-Frame-Options', severity: 'low' });
    } catch (err) {}
    return vulns;
};

// 12. Cookies Audit
window.__raconModules.auditCookies = function() {
    const vulns = [];
    try {
        const raw = document.cookie || '';
        if (!raw) return vulns;
        const cookies = raw.split(';');
        cookies.forEach(cookie => {
            const parts = cookie.split('=');
            const name = parts[0] ? parts[0].trim() : '';
            if (name) {
                const severity = /session|sess|auth|token/i.test(name) ? 'medium' : 'low';
                vulns.push({ type: 'Insecure Cookie (heuristic)', description: `Cannot verify Secure/HttpOnly for cookie '${name}' from JS. Server-side flags should be checked.`, severity: severity });
            }
        });
    } catch (err) {}
    return vulns;
};

// Mark as ready
if (typeof window.__raconModulesReady === 'undefined') {
    window.__raconModulesReady = true;
    console.debug('✅ RACON modules embedded loaded successfully');
}
