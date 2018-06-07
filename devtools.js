if (typeof chrome !== "undefined")
    var browser = chrome;

browser.devtools.panels.create('Debug Logs', '/icons/64.png', '/panel/panel.html', function(extensionPanel) {
    var _window;
    var tabId = browser.devtools.inspectedWindow.tabId;
    var data = [];
    var port = browser.runtime.connect({name: 'devtools'});

    port.onMessage.addListener(function(msg) {
        // Write information to the panel, if exists.
        // If we don't have a panel reference (yet), queue the data.
        if(msg.tabId == tabId){
            if (_window) {
                _window.makeAction(msg);
            } else {
                data.push(msg);
            }
        }
    });

    extensionPanel.onShown.addListener(function tmp(panelWindow) {
        extensionPanel.onShown.removeListener(tmp); // Run once only

        _window = panelWindow;

        // Release queued data
        var msg;
        while (msg = data.shift())
            _window.makeAction(msg);
    });

    port.postMessage({
        type: 'init',
        tabId: tabId
    });
});






