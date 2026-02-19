window.__raconModules = window.__raconModules || {};
window.__raconModules.auditSecurityHeaders = function(headers) {
    headers = headers || {};
    const vulns = [];
    try {
        const csp = headers['Content-Security-Policy'] || headers['content-security-policy'];
        if (!csp) vulns.push({ type: 'Security Headers', description: 'Missing CSP', severity: 'medium' });
        else {
            // warn if CSP is too permissive
            if (/default-src\s+\*/.test(csp) || /script-src\s+\*/.test(csp)) {
                vulns.push({ type: 'Security Headers', description: 'CSP appears permissive (contains *)', severity: 'medium' });
            }
        }
        if (!headers['Strict-Transport-Security'] && !headers['strict-transport-security']) vulns.push({ type: 'Security Headers', description: 'Missing HSTS', severity: 'medium' });
        if (!headers['X-Frame-Options'] && !headers['x-frame-options']) vulns.push({ type: 'Security Headers', description: 'Missing X-Frame-Options', severity: 'low' });
    } catch (err) {}
    return vulns;
};
