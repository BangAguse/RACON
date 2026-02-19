window.__raconModules = window.__raconModules || {};
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
                // heuristics: session-like names
                const severity = /session|sess|auth|token/i.test(name) ? 'medium' : 'low';
                vulns.push({ type: 'Insecure Cookie (heuristic)', description: `Cannot verify Secure/HttpOnly for cookie '${name}' from JS. Server-side flags should be checked.`, severity: severity });
            }
        });
    } catch (err) {}
    return vulns;
};
