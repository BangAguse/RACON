window.__raconModules = window.__raconModules || {};
window.__raconModules.detectSensitiveFiles = function() {
    const links = document.querySelectorAll('a[href]');
    const vulns = [];
    links.forEach(link => {
        try {
            const href = link.href || '';
            if (href.includes('.env') || href.includes('.git') || href.includes('phpinfo.php')) {
                vulns.push({ type: 'Sensitive File', description: `Exposed: ${href}`, severity: 'high' });
            }
        } catch (e) {}
    });
    return vulns;
};
