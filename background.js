let headersData = {};
let networkData = {};

chrome.webRequest.onHeadersReceived.addListener(
    function(details) {
        const headers = {};
        details.responseHeaders.forEach(header => {
            headers[header.name] = header.value;
        });
        headersData[details.tabId] = headers;
    },
    { urls: ["<all_urls>"] },
    ["responseHeaders"]
);

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        if (!networkData[details.tabId]) networkData[details.tabId] = [];
        networkData[details.tabId].push({
            url: details.url,
            method: details.method,
            time: Date.now()
        });
    },
    { urls: ["<all_urls>"] }
);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'getData') {
        const tabId = sender.tab ? sender.tab.id : null;
        sendResponse({
            headers: headersData[tabId] || {},
            network: networkData[tabId] || []
        });
    }
});
