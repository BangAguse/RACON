window.__raconModules = window.__raconModules || {};
window.__raconModules.detectSQLi = function() {
    const inputs = document.querySelectorAll('input, textarea');
    const vulns = [];
    inputs.forEach(input => {
        try {
            const v = (input.value || '').toString();
            // common SQLi heuristics
            if (/\bOR\s+1=1\b/i.test(v) || /UNION\s+SELECT/i.test(v) || /\bDROP\s+TABLE\b/i.test(v) || /['"].*--/.test(v) || /\'/.test(v) && /\b(SELECT|INSERT|UPDATE|DELETE)\b/i.test(v)) {
                vulns.push({ type: 'SQLi', description: 'Potential SQL injection in input', severity: 'high' });
            }
        } catch (e) {}
    });
    return vulns;
};
