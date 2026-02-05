let reconData = {};
let currentFeatureIndex = 0;
const features = [
    { name: 'Tech Stack', func: detectTechStack },
    { name: 'CMS', func: detectCMS },
    { name: 'Subdomains', func: extractSubdomains },
    { name: 'Endpoints', func: extractEndpoints },
    { name: 'External Assets', func: listExternalAssets },
    { name: 'Emails', func: harvestEmails },
    { name: 'SQLi Check', func: detectSQLi },
    { name: 'XSS Check', func: detectXSS },
    { name: 'Sensitive Files', func: detectSensitiveFiles },
    { name: 'API Keys', func: detectAPIKeys },
    { name: 'Security Headers', func: () => auditSecurityHeaders(reconData.serverHeaders) },
    { name: 'Cookies', func: auditCookies }
];

function safeLog() {
    try { console.debug.apply(console, arguments); } catch (e) {}
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (!request || !request.action) return;
    if (request.action === 'gatherData') {
        console.log('gatherData received');
        chrome.runtime.sendMessage({ action: 'getData' }, function(bgData) {
            if (chrome.runtime.lastError) {
                console.log('bg getData error:', chrome.runtime.lastError.message);
                bgData = { headers: {}, network: [] };
            }
            reconData.serverHeaders = bgData.headers || {};
            reconData.networkTraffic = bgData.network || [];
            console.log('bg data received, starting recon');
            currentFeatureIndex = 0;
            reconData = { url: window.location.href, vulnerabilities: [], report: {} };
            runNextFeature();
            sendResponse({ ok: true, started: true });
        });
        return true;
    } else if (request.action === 'runNext') {
        console.log('runNext received');
        runNextFeature();
        sendResponse({ ok: true });
        return true;
    } else if (request.action === 'runFeature') {
        console.log('runFeature received, index:', request.index);
        if (request.index >= 0 && request.index < features.length) {
            const feature = features[request.index];
            try {
                const result = feature.func();
                console.log('feature result:', result);
                sendResponse({ ok: true, result: result, feature: feature.name });
            } catch (err) {
                console.log('runFeature error:', err);
                sendResponse({ ok: false, error: String(err) });
            }
        } else {
            sendResponse({ ok: false, error: 'Invalid feature index' });
        }
        return true;
    } else if (request.action === 'getReport') {
        try {
            sendResponse({ ok: true, data: reconData });
        } catch (err) {
            sendResponse({ ok: false, error: String(err) });
        }
    }
});

function runNextFeature() {
    console.log('runNextFeature called, index:', currentFeatureIndex);
    if (currentFeatureIndex >= features.length) {
        console.log('all features done');
        reconData.securityScore = calculateSecurityScore(reconData.vulnerabilities);
        renderOverlay(reconData, true);
        return;
    }
    const feature = features[currentFeatureIndex];
    console.log('running feature:', feature.name);
    try {
        const result = feature.func();
        console.log('feature result:', result);
        reconData[feature.name.toLowerCase().replace(' ', '')] = result;
        if (feature.name.includes('Check') || feature.name === 'Security Headers' || feature.name === 'Cookies') {
            reconData.vulnerabilities.push(...result);
        }
        renderOverlay(reconData, false, feature.name, result);
        currentFeatureIndex++;
    } catch (err) {
        console.log('runNextFeature error:', err);
        currentFeatureIndex++;
        runNextFeature();
    }
}

function detectTechStack() {
    const scripts = document.querySelectorAll('script[src]');
    const frameworks = [];
    scripts.forEach(script => {
        const src = script.src;
        if (src.includes('react')) frameworks.push('React');
        if (src.includes('vue')) frameworks.push('Vue');
        if (src.includes('angular')) frameworks.push('Angular');
        if (src.includes('jquery')) frameworks.push('jQuery');
    });
    return frameworks.join(', ') || 'Unknown';
}

function detectCMS() {
    if (document.querySelector('meta[name="generator"][content*="WordPress"]')) return 'WordPress';
    if (document.querySelector('link[href*="shopify"]')) return 'Shopify';
    return 'Unknown';
}

function extractSubdomains() {
    const links = document.querySelectorAll('a[href]');
    const subdomains = new Set();
    links.forEach(link => {
        const url = new URL(link.href, window.location.origin);
        if (url.hostname !== window.location.hostname) {
            subdomains.add(url.hostname);
        }
    });
    return Array.from(subdomains);
}

function analyzeRobotsSitemap() {
    return { robots: '/robots.txt', sitemap: '/sitemap.xml' };
}

function extractEndpoints() {
    const scripts = document.querySelectorAll('script');
    const endpoints = [];
    scripts.forEach(script => {
        const text = script.textContent;
        const matches = text.match(/https?:\/\/[^\s'"]+/g);
        if (matches) endpoints.push(...matches);
    });
    return endpoints;
}

function listExternalAssets() {
    const assets = document.querySelectorAll('script[src], link[href], img[src]');
    const externals = new Set();
    assets.forEach(asset => {
        const src = asset.src || asset.href;
        if (src && !src.startsWith(window.location.origin)) {
            externals.add(new URL(src).hostname);
        }
    });
    return Array.from(externals);
}

function harvestEmails() {
    const text = document.body.textContent;
    const emails = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g) || [];
    return emails;
}

function detectSQLi() {
    const inputs = document.querySelectorAll('input, textarea');
    const vulns = [];
    inputs.forEach(input => {
        if (input.value.includes("'") || input.value.includes('--') || input.value.includes('OR 1=1')) {
            vulns.push({ type: 'SQLi', description: 'Potential SQL injection in input', severity: 'high' });
        }
    });
    return vulns;
}

function detectXSS() {
    const sinks = document.querySelectorAll('[innerHTML], [outerHTML]');
    const vulns = [];
    sinks.forEach(sink => {
        vulns.push({ type: 'XSS', description: 'Potential XSS sink found', severity: 'medium' });
    });
    return vulns;
}

function detectSensitiveFiles() {
    const links = document.querySelectorAll('a[href]');
    const vulns = [];
    links.forEach(link => {
        const href = link.href;
        if (href.includes('.env') || href.includes('.git') || href.includes('phpinfo.php')) {
            vulns.push({ type: 'Sensitive File', description: `Exposed: ${href}`, severity: 'high' });
        }
    });
    return vulns;
}

function detectAPIKeys() {
    const scripts = document.querySelectorAll('script');
    const vulns = [];
    scripts.forEach(script => {
        const text = script.textContent;
        if (text.match(/AKIA[0-9A-Z]{16}/) || text.match(/AIza[0-9A-Za-z-_]{35}/)) {
            vulns.push({ type: 'API Key Leak', description: 'Potential API key exposed', severity: 'high' });
        }
    });
    return vulns;
}

function auditSecurityHeaders(headers) {
    headers = headers || {};
    const vulns = [];
    try {
        if (!headers['Content-Security-Policy'] && !headers['content-security-policy']) vulns.push({ type: 'Security Headers', description: 'Missing CSP', severity: 'medium' });
        if (!headers['Strict-Transport-Security'] && !headers['strict-transport-security']) vulns.push({ type: 'Security Headers', description: 'Missing HSTS', severity: 'medium' });
        if (!headers['X-Frame-Options'] && !headers['x-frame-options']) vulns.push({ type: 'Security Headers', description: 'Missing X-Frame-Options', severity: 'low' });
    } catch (err) {
        safeLog('auditSecurityHeaders error:', err);
    }
    return vulns;
}

function auditCookies() {
    const vulns = [];
    try {
        const raw = document.cookie || '';
        if (!raw) return vulns;
        const cookies = raw.split(';');
        cookies.forEach(cookie => {
            const parts = cookie.split('=');
            const name = parts[0] ? parts[0].trim() : '';
            if (name) {
                vulns.push({ type: 'Insecure Cookie (heuristic)', description: `Cannot verify Secure/HttpOnly for cookie '${name}' from JS. Consider server-side audit.`, severity: 'low' });
            }
        });
    } catch (err) {
        safeLog('auditCookies error:', err);
    }
    return vulns;
}

function calculateSecurityScore(vulns) {
    try {
        vulns = vulns || [];
        let score = 10;
        vulns.forEach(v => {
            if (v.severity === 'high') score -= 3;
            else if (v.severity === 'medium') score -= 2;
            else score -= 1;
        });
        if (score < 1) score = 1;
        if (score > 10) score = 10;
        return score;
    } catch (err) {
        safeLog('calculateSecurityScore error:', err);
        return 'N/A';
    }
}

function renderOverlay(data, isFinal = false, currentFeature = '', currentResult = null) {
    try {
        if (!data) return;
        const existing = document.getElementById('racon-overlay-container');
        if (existing) existing.remove();

        const container = document.createElement('div');
        container.id = 'racon-overlay-container';
        container.style.all = 'initial';
        container.style.position = 'fixed';
        container.style.zIndex = 2147483647;
        container.style.right = '20px';
        container.style.bottom = '20px';
        container.style.width = '420px';
        container.style.maxHeight = '80vh';
        container.style.borderRadius = '8px';

        const shadow = container.attachShadow({ mode: 'open' });

        const style = document.createElement('style');
        style.textContent = `
        :host { font-family: monospace; }
        .panel { background: #050505; color: #39FF14; border: 2px solid #39FF14; box-shadow: 0 0 12px #39FF14; padding: 10px; width: 100%; box-sizing: border-box; }
        .header { display:flex; justify-content:space-between; align-items:center; gap:8px }
        .title { font-weight:700; font-size:16px }
        .copyright { font-size:12px; color:#39FF14; margin-top:4px }
        .controls button { background:#39FF14; color:#050505; border:none; padding:5px 8px; cursor:pointer; margin-left:6px }
        .body { margin-top:8px; max-height:60vh; overflow:auto; }
        .section { margin-bottom:8px }
        .vuln-high { color:#FF4500; }
        .vuln-med { color:#FFA500; }
        pre { background:#000; color:#39FF14; padding:8px; border-radius:4px; overflow:auto; white-space:pre-wrap }
        `;

        const panel = document.createElement('div');
        panel.className = 'panel';

        const header = document.createElement('div');
        header.className = 'header';
        const title = document.createElement('div');
        title.className = 'title';
        title.textContent = 'RACON — Recon Results';
        const copyright = document.createElement('div');
        copyright.className = 'copyright';
        copyright.textContent = 'Copyright Muh. Agus Tri Ananda';

        const controls = document.createElement('div');
        controls.className = 'controls';

        const btnDownload = document.createElement('button');
        btnDownload.textContent = 'Download JSON';
        btnDownload.addEventListener('click', () => {
            try {
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'racon-report.json';
                a.click();
                URL.revokeObjectURL(url);
            } catch (err) { safeLog('download error', err); }
        });

        const btnClose = document.createElement('button');
        btnClose.textContent = 'Close';
        btnClose.addEventListener('click', () => container.remove());

        controls.appendChild(btnDownload);
        controls.appendChild(btnClose);

        if (!isFinal) {
            const btnNext = document.createElement('button');
            btnNext.textContent = 'Next Feature';
            btnNext.addEventListener('click', () => {
                chrome.runtime.sendMessage({ action: 'runNext' });
            });
            controls.appendChild(btnNext);
        }

        header.appendChild(title);
        header.appendChild(controls);
        header.appendChild(copyright);

        const body = document.createElement('div');
        body.className = 'body';

        if (!isFinal && currentFeature && currentResult !== null) {
            const secCurrent = document.createElement('div');
            secCurrent.className = 'section';
            secCurrent.innerHTML = `<div><strong>Running:</strong> ${escapeHtml(currentFeature)}</div>`;
            const resultDiv = document.createElement('div');
            resultDiv.textContent = `Result: ${JSON.stringify(currentResult)}`;
            secCurrent.appendChild(resultDiv);
            body.appendChild(secCurrent);
        } else if (isFinal) {
            const secOverview = document.createElement('div');
            secOverview.className = 'section';
            secOverview.innerHTML = `<div><strong>URL:</strong> ${escapeHtml(data.url || window.location.href)}</div>` +
                `<div><strong>Score (1-10):</strong> ${escapeHtml(String(data.securityScore || calculateSecurityScore(data.vulnerabilities)))}</div>`;

            const secVulns = document.createElement('div');
            secVulns.className = 'section';
            const vulnTitle = document.createElement('div');
            vulnTitle.textContent = 'Vulnerabilities:';
            secVulns.appendChild(vulnTitle);
            if (Array.isArray(data.vulnerabilities) && data.vulnerabilities.length > 0) {
                data.vulnerabilities.forEach(v => {
                    const d = document.createElement('div');
                    d.textContent = `${v.type}: ${v.description}`;
                    if (v.severity === 'high') d.className = 'vuln-high';
                    else if (v.severity === 'medium') d.className = 'vuln-med';
                    secVulns.appendChild(d);
                });
            } else {
                const none = document.createElement('div'); none.textContent = 'No obvious issues found (passive scan).';
                secVulns.appendChild(none);
            }

            const secRaw = document.createElement('div');
            secRaw.className = 'section';
            const pre = document.createElement('pre');
            pre.textContent = JSON.stringify(data, null, 2);
            secRaw.appendChild(pre);

            body.appendChild(secOverview);
            body.appendChild(secVulns);
            body.appendChild(secRaw);
        }

        panel.appendChild(header);
        panel.appendChild(body);

        shadow.appendChild(style);
        shadow.appendChild(panel);

        document.body.appendChild(container);
    } catch (err) {
        safeLog('renderOverlay fatal:', err);
    }
}

function escapeHtml(s) {
    if (!s) return '';
    return String(s).replace(/[&<>\"']/g, function(c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":"&#39;"}[c]; });
}