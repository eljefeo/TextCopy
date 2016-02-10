var enabled = false;
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.greeting === "changeEnabled") {
            enabled = !enabled;
            console.log("Change enabled " + enabled);
            sendResponse({
                result: enabled
            });
        } else if (request.greeting === "getEnabled") {
            console.log("get enabled " + enabled);
            sendResponse({
                result: enabled
            });
        }
    });