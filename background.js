if (typeof chrome !== "undefined")
    var browser = chrome;

var ports = [];
var messageStack = {};

browser.tabs.onRemoved.addListener(function(tabId){
    if(tabId in messageStack)
        delete messageStack[tabId];
});

browser.runtime.onConnect.addListener(function(port) {
    if (port.name !== "devtools") return;

    port.tabId = 0;
    ports.push(port);

    // Remove port when destroyed (eg when devtools instance is closed)
    port.onDisconnect.addListener(function() {
        var i = ports.indexOf(port);
        if (i !== -1) ports.splice(i, 1);
    });

    port.onMessage.addListener(function(msg){
        if(msg.type == 'init'){
            port.tabId = msg.tabId;

            if(msg.tabId in messageStack){
                messageStack[msg.tabId].forEach(function(message) {
                    port.postMessage(message);
                });
            }
        }
    });
});

function notifyDevtools(msg) {
    ports.forEach(function(port) {
        if(port.tabId == msg.tabId)
            port.postMessage(msg);
    });

    if(!(msg.tabId in messageStack) || msg.type == "main_frame")
        messageStack[msg.tabId] = [];

    messageStack[msg.tabId].push(msg);
}

function headerListener(e){
    var msg = {
        log: [],
        type: e.type,
        tabId: e.tabId,
        url: e.url,
        method: e.method,
        statusCode: e.statusCode
    };

    for (var i=0; i<e.responseHeaders.length; i++) {
        var matches = e.responseHeaders[i].name.match(/^X-Debugger-Log-ID-([0-9]+)$/i);
        if(matches){
            msg.log.push(e.responseHeaders[i].value);
        }
    }

    if(msg.log.length == 0){
        msg.log.push('no_logs');
    }

    notifyDevtools(msg);
}

browser.webRequest.onHeadersReceived.addListener(
    headerListener,
    {urls: ['<all_urls>'], types: ['xmlhttprequest', 'main_frame', 'sub_frame']},
    ["responseHeaders"]
);