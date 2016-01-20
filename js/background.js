var enabled = false;
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.greeting == "getEnabled") {
            sendResponse({
                result: enabled
            });
        } else if (request.greeting == "changeEnabled") {
            enabled = !enabled;
            sendResponse({
                result: enabled
            });
        }
    });