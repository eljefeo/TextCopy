var enabled = false,
    myTabs = [];
//prevWindow = 0,
//prevTab = 0;
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.greeting === "changeEnabled") {
            enabled = !enabled;
            console.log("Change enabled " + enabled);
            sendDetails(enabled);
            sendResponse({
                result: enabled
            });
        } else if (request.greeting === "getEnabled") {
            sendResponse({
                result: enabled
            });
        } else if (request.greeting === "imInActiveTab") {
            console.log("background here: message from tab, i am blurred now " + sender.tab.id);
        } else if (request.greeting === "imActiveTab") {
            console.log("background here: message from tab, i am focused now " + sender.tab.id);
            chrome.windows.update(sender.tab.windowId, {
                focused: true
            });
            chrome.tabs.update(sender.tab.id, {
                active: true
            });
        }
    });

function sendDetails(sendData) {
    //Select tab
    chrome.tabs.query({}, function(tabs) {
        for (var i = 0; i < tabs.length; ++i) {
            chrome.tabs.sendMessage(tabs[i].id, {
                greeting: 'updateEnabled',
                result: enabled
            }, function(response) {});
        }
    });
}

/*chrome.windows.onRemoved.addListener(function(winId) {
    for (var i = 0; i < windows.length; i++) {
        if (myTabs[i] === winId) {
            windows.splice(i, 1);
            break;
        }
    }
    console.log(windows);
    console.log("got rid of window " + winId);
    // alert("!! Exiting the Browser !! " + windowId);
});*/