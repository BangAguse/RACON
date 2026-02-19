window.__raconModules = window.__raconModules || {};
window.__raconModules.detectAPIKeys = function() {
    const scripts = Array.from(document.querySelectorAll('script'));
    const vulns = [];
    const patterns = [
        /AKIA[0-9A-Z]{16}/, // AWS access key
        /AIza[0-9A-Za-z-_]{35}/, // Google API key
        /sk_live_[0-9a-zA-Z]{24,}/i, // Stripe secret (partial)
        /pk_live_[0-9a-zA-Z]{24,}/i, // Stripe publishable
        /TWILIO_[0-9A-Za-z_-]{16,}/i,
        /eyJ[A-Za-z0-9-_]{10,}\.[A-Za-z0-9-_]{10,}\.[A-Za-z0-9-_]{10,}/ // JWT-like
    ];
    scripts.forEach(script => {
        try {
            const text = script.textContent || '';
            for (const re of patterns) if (re.test(text)) { vulns.push({ type: 'API Key Leak', description: 'Potential API key exposed (pattern matched)', severity: 'high' }); break; }
        } catch (e) {}
    });
    return vulns;
};
