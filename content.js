let reconData = {};
let currentFeatureIndex = 0;
let modulesReady = false;
const featureList = [
    { name: 'Tech Stack', key: 'detectTechStack' },
    { name: 'CMS', key: 'detectCMS' },
    { name: 'Subdomains', key: 'extractSubdomains' },
    { name: 'Endpoints', key: 'extractEndpoints' },
    { name: 'External Assets', key: 'listExternalAssets' },
    { name: 'Emails', key: 'harvestEmails' },
    { name: 'SQLi Check', key: 'detectSQLi' },
    { name: 'XSS Check', key: 'detectXSS' },
    { name: 'Sensitive Files', key: 'detectSensitiveFiles' },
    { name: 'API Keys', key: 'detectAPIKeys' },
    { name: 'Security Headers', key: 'auditSecurityHeaders' },
    { name: 'Cookies', key: 'auditCookies' }
];

// Initialize module namespace early
window.__raconModules = window.__raconModules || {};

function getFeatureFunction(key) {
    try {
        if (key === 'auditSecurityHeaders') return function() { return window.__raconModules && window.__raconModules.auditSecurityHeaders ? window.__raconModules.auditSecurityHeaders(reconData.serverHeaders) : [] };
        return window.__raconModules && window.__raconModules[key] ? window.__raconModules[key] : function() { return null; };
    } catch (e) { return function() { return null; }; }
}
// Modules already embedded via modules-embedded.js (loaded before this script)
// window.__raconModules is populated by modules-embedded.js
// Fallback: if embedded didn't load, try external loader (backup)

function formatResult(result) {
    if (result === null || result === undefined) return '(no data)';
    if (Array.isArray(result)) {
        if (result.length === 0) return '(empty array)';
        return result.map((r, i) => {
            if (typeof r === 'string') return `  [${i+1}] ${r}`;
            if (typeof r === 'object') return `  [${i+1}] ${r.type || 'item'}: ${r.description || JSON.stringify(r)}`;
            return `  [${i+1}] ${String(r)}`;
        }).join('\n');
    }
    if (typeof result === 'object') return JSON.stringify(result, null, 2);
    return String(result);
}

function logScanProgress(featureName, status, details = '') {
    const timestamp = new Date().toLocaleTimeString();
    const marker = status === 'start' ? '▶' : status === 'ok' ? '✓' : '✗';
    const msg = `[${timestamp}] ${marker} ${featureName}${details ? ': ' + details : ''}`;
    safeLog(msg);
}

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
        if (request.index >= 0 && request.index < featureList.length) {
            const featureMeta = featureList[request.index];
            logScanProgress(featureMeta.name, 'start');
            const featureFunc = getFeatureFunction(featureMeta.key);
            try {
                const result = featureFunc();
                console.log('feature result:', result);
                const formatted = formatResult(result);
                logScanProgress(featureMeta.name, 'ok', formatted.split('\n')[0]);
                sendResponse({ ok: true, result: result, feature: featureMeta.name, formatted: formatted });
            } catch (err) {
                console.log('runFeature error:', err);
                logScanProgress(featureMeta.name, 'error', err.message);
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
    if (currentFeatureIndex >= featureList.length) {
        console.log('all features done');
        reconData.securityScore = calculateSecurityScore(reconData.vulnerabilities);
        renderOverlay(reconData, true);
        return;
    }
    const featureMeta = featureList[currentFeatureIndex];
    logScanProgress(featureMeta.name, 'start');
    const featureFunc = getFeatureFunction(featureMeta.key);
    console.log('running feature:', featureMeta.name);
    try {
        const result = featureFunc();
        console.log('feature result:', result);
        reconData[featureMeta.name.toLowerCase().replace(/\s+/g, '')] = result;
        if (featureMeta.name.includes('Check') || featureMeta.name === 'Security Headers' || featureMeta.name === 'Cookies') {
            if (Array.isArray(result)) reconData.vulnerabilities.push(...result);
        }
        const formatted = formatResult(result);
        logScanProgress(featureMeta.name, 'ok', `${Array.isArray(result) ? result.length : 'N/A'} items`);
        renderOverlay(reconData, false, featureMeta.name, result, formatted);
        currentFeatureIndex++;
    } catch (err) {
        console.log('runNextFeature error:', err);
        logScanProgress(featureMeta.name, 'error', err.message);
        currentFeatureIndex++;
        runNextFeature();
    }
}

// Feature implementations moved to modules/*.js — loaded at runtime.
// Modules attach functions to `window.__raconModules`.
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

function renderOverlay(data, isFinal = false, currentFeature = '', currentResult = null, formattedResult = '') {
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
            secCurrent.innerHTML = `<div><strong>▶ Running:</strong> ${escapeHtml(currentFeature)}</div>`;
            const resultDiv = document.createElement('div');
            resultDiv.style.fontFamily = 'monospace';
            resultDiv.style.fontSize = '11px';
            resultDiv.style.whiteSpace = 'pre-wrap';
            resultDiv.style.color = '#39FF14';
            resultDiv.textContent = formattedResult || `Result: ${JSON.stringify(currentResult)}`;
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
