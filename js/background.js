var enabled = false;
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.greeting === "changeEnabled") {
            enabled = !enabled;
<<<<<<< HEAD
            updateTabsEnabledStatus(enabled);
=======
            console.log("Change enabled " + enabled);
>>>>>>> parent of fbe9a9e... fixed async issue for on off timing
            sendResponse({
                result: enabled
            });
        } else if (request.greeting === "getEnabled") {
            sendResponse({
                result: enabled
            });
        }
<<<<<<< HEAD
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
=======
    });
>>>>>>> parent of fbe9a9e... fixed async issue for on off timing
