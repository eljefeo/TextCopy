var enabled = false;
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.greeting === "changeEnabled") {
            enabled = !enabled;
            updateTabsEnabledStatus(enabled);
            sendResponse({
                result: enabled
            });
        } else if (request.greeting === "getEnabled") {
            sendResponse({
                result: enabled
            });
        }
    });

function updateTabsEnabledStatus(sendData) {
    chrome.tabs.query({}, function(tabs) {
        for (var i = 0; i < tabs.length; ++i) {
            chrome.tabs.sendMessage(tabs[i].id, {
                greeting: 'updateEnabled',
                result: enabled
            });
        }
    });
}