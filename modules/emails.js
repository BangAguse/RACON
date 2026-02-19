window.__raconModules = window.__raconModules || {};
window.__raconModules.harvestEmails = function() {
    const text = document.body ? document.body.textContent : '';
    // capture normal emails and simple obfuscations like 'user [at] domain.com'
    const emails = (text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g) || []).slice();
    const obf = text.match(/([A-Za-z0-9._%+-]+)\s*\[at\]\s*([A-Za-z0-9.-]+\.[A-Za-z]{2,})/gi) || [];
    obf.forEach(m => {
        const parts = m.match(/([A-Za-z0-9._%+-]+)\s*\[at\]\s*([A-Za-z0-9.-]+\.[A-Za-z]{2,})/i);
        if (parts && parts[1] && parts[2]) emails.push(parts[1] + '@' + parts[2]);
    });
    // dedupe
    return Array.from(new Set(emails));
};
