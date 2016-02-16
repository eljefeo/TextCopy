var enabled = false,
    myTabs = [],
    //prevWindow = 0,
    prevTab = 0;
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
            if (sender && sender.tab && sender.tab.id) {

                console.log("get enabled " + enabled + " from tab " + sender.tab.id);
            }
            sendResponse({
                result: enabled
            });
        } else if (request.greeting === "imInActiveTab") {
            console.log("background: last tab here, i am blurred now " + sender.tab.id);
            prevTab = sender.tab.id;
        } else if (request.greeting === "imActiveTab") {
            console.log("new win focused is " + sender.tab.windowId);

            console.log("new tab focused is " + sender.tab.id);
            console.log("last tab focused was " + prevTab);
            chrome.windows.update(sender.tab.windowId, {
                focused: true
            });
            chrome.tabs.update(sender.tab.id, {
                active: true
            });
        } else if (request.greeting === "doOtherTabActive") {
            console.log("trying to make tab " + prevTab + " active, from tab " + sender.tab.id);
            chrome.tabs.update(prevTab, {
                active: true
            });
        } else if (request.greeting === "makeMeActive") {
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

chrome.windows.onRemoved.addListener(function(winId) {
    for (var i = 0; i < windows.length; i++) {
        if (myTabs[i] === winId) {
            windows.splice(i, 1);
            break;
        }
    }
    console.log(windows);
    console.log("got rid of window " + winId);
    // alert("!! Exiting the Browser !! " + windowId);
});