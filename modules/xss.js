window.__raconModules = window.__raconModules || {};
window.__raconModules.detectXSS = function() {
    const vulns = [];
    try {
        // inline event handlers
        const all = Array.from(document.querySelectorAll('*'));
        all.forEach(el => {
            const hasOn = Array.from(el.attributes || []).some(a => /^on/i.test(a.name));
            if (hasOn) vulns.push({ type: 'XSS', description: 'Element with inline event handler (possible sink)', severity: 'medium' });
        });
        // script usage of innerHTML/document.write
        const scripts = Array.from(document.querySelectorAll('script'));
        scripts.forEach(s => {
            const t = s.textContent || '';
            if (/\.innerHTML\s*=/.test(t) || /document\.write\s*\(/.test(t) || /innerHTML\.append/i.test(t)) {
                vulns.push({ type: 'XSS', description: 'Script uses innerHTML/document.write (possible sink)', severity: 'high' });
            }
        });
    } catch (e) {}
    // dedupe by description
    const uniq = [];
    const seen = new Set();
    vulns.forEach(v => { if (!seen.has(v.description)) { seen.add(v.description); uniq.push(v); } });
    return uniq;
};
