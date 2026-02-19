let reconData = {};
let currentTab = null;

document.addEventListener('DOMContentLoaded', function() {
    initTerminal();
});

function initTerminal() {
    const input = document.getElementById('command-input');
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const cmd = input.value.trim();
            input.value = '';
            processCommand(cmd);
        }
    });

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        currentTab = tabs && tabs[0];
        if (currentTab) {
            appendOutput(`<em>Current tab: ${currentTab.url}</em>`, true);
        }
    });
}

function processCommand(cmd) {
    appendOutput(`<span style="color:#39FF14;">racoon&gt; ${cmd}</span>`, true);
    const parts = cmd.split(' ');
    const command = parts[0].toLowerCase();

    if (command === 'clear') {
        clearOutput();
    } else if (command === 'download') {
        downloadResult();
    } else if (/^\d+$/.test(command)) {
        const num = parseInt(command);
        if (num >= 1 && num <= 12) {
            runFeature(num - 1);
        } else {
            appendOutput('<span style="color:#FFA500;">Invalid feature number. Use 1-12.</span>', true);
        }
    } else {
        appendOutput('<span style="color:#FFA500;">Unknown command. Available: 1-12 (features), clear, download</span>', true);
    }
}

function runFeature(index) {
    if (!currentTab) {
        appendOutput('<span style="color:#FF4500;">No active tab.</span>', true);
        return;
    }

    if (!isInjectablePage(currentTab.url)) {
        appendOutput('<span style="color:#FF4500;">Halaman ini tidak bisa di-scan.</span>', true);
        return;
    }

    appendOutput(`<em>⏳ Preparing scanning for feature ${index + 1}...</em>`, true);

    // Inject content script and wait a bit for modules to load
    chrome.scripting.executeScript({
        target: { tabId: currentTab.id },
        files: ['modules-embedded.js', 'content.js']
    }, function() {
        // Modules embedded directly, should be ready immediately
        setTimeout(() => {
            appendOutput(`<em>▶ Running feature ${index + 1}...</em>`, true);
            chrome.tabs.sendMessage(currentTab.id, { action: 'runFeature', index: index }, function(response) {
                if (chrome.runtime.lastError) {
                    appendOutput(`<span style="color:#FF4500;">✗ Error: ${chrome.runtime.lastError.message}</span>`, true);
                    return;
                }
                handleFeatureResponse(response);
            });
        }, 500);
    });
}

function handleFeatureResponse(response) {
    if (response && response.result !== undefined) {
        appendOutput('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        appendOutput(`<strong>✓ ${response.feature}</strong>`, true);
        
        // Display formatted output if available
        if (response.formatted) {
            appendOutput(`<pre style="background:#111; padding:8px; border:1px solid #39FF14; margin:5px 0; font-size:11px; line-height:1.4;">${escapeHtml(response.formatted)}</pre>`, true);
        } else if (Array.isArray(response.result) || typeof response.result === 'object') {
            appendOutput(`<pre style="background:#111; padding:5px; border:1px solid #39FF14; margin:5px 0;">${JSON.stringify(response.result, null, 2)}</pre>`, true);
        } else {
            appendOutput(`<strong>Result:</strong> ${String(response.result)}`, true);
        }
        appendOutput('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        if (response.feature) {
            reconData[response.feature] = response.result;
        }
    } else {
        appendOutput('<span style="color:#FFA500;">No result returned.</span>', true);
    }
}

function escapeHtml(s) {
    if (!s) return '';
    return String(s).replace(/[&<>\"']/g, function(c) { 
        const m = {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":"&#39;"}; 
        return m[c]; 
    });
}

function clearOutput() {
    document.getElementById('terminal-output').innerHTML = `
        <div>RACON - The Stealthy Bandit Recon</div>
        <div>Available Tools:</div>
        <div>1. Tech Stack</div>
        <div>2. CMS</div>
        <div>3. Subdomains</div>
        <div>4. Endpoints</div>
        <div>5. External Assets</div>
        <div>6. Emails</div>
        <div>7. SQLi Check</div>
        <div>8. XSS Check</div>
        <div>9. Sensitive Files</div>
        <div>10. API Keys</div>
        <div>11. Security Headers</div>
        <div>12. Cookies</div>
        <div></div>
        <div>Silahkan pilih tools berdasarkan nomor dan masukkan di perintah</div>
        <div>Commands: [nomor] untuk run tool, clear untuk hapus jejak, download untuk download result</div>
        <div>Output cleared.</div>
    `;
    reconData = {};
}

function downloadResult() {
    if (!currentTab) return;
    try {
        const url = new URL(currentTab.url);
        const domain = url.hostname.replace(/\./g, '_');
        const filename = `result_${domain}.json`;
        const blob = new Blob([JSON.stringify(reconData, null, 2)], { type: 'application/json' });
        const link = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = link;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(link);
        appendOutput(`<span style="color:#00FF00;">Downloaded ${filename}</span>`, true);
    } catch (err) {
        appendOutput('<span style="color:#FF4500;">Download failed.</span>', true);
    }
}

function appendOutput(text, isHtml = false) {
    const output = document.getElementById('terminal-output');
    const div = document.createElement('div');
    if (isHtml) {
        div.innerHTML = text;
    } else {
        div.textContent = text;
    }
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
}

function isInjectablePage(url) {
    try {
        const parsed = new URL(url);
        if (parsed.protocol === 'chrome:' || parsed.protocol === 'chrome-extension:' || parsed.protocol === 'file:' || parsed.protocol === 'about:') {
            return false;
        }
        if (url.includes('chrome://') || url.includes('view-source:') || url.includes('data:')) {
            return false;
        }
        return true;
    } catch (e) {
        return false;
    }
}
