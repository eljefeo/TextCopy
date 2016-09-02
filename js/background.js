var enabled = true,
    preventCloseEnabled = false,
    tabToCopy = 0,
    myTabs = [],
    myWindows = [];

chrome.windows.onRemoved.addListener(function(windowid) {
 alert("window closed");
    var ind = myWindows.indexOf(windowid);
    myWindows.splice(ind, 1);
    console.log('window closed : id= ' + windowid);
 //confirm("Press a button!");
});

chrome.windows.onCreated.addListener(function(windowid) {
 //alert("window closed");
 myWindows.push(windowid.id);
 console.log('window count ' + myWindows.length);

    console.log('window added : id= ' + windowid.id);
    for(var i=0;i<myWindows.length;i++){
        console.log("window entry " + myWindows[i]);
    }
// confirm("Press a basdasdutton!");
});



chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.greeting === "changeEnabled") {
            enabled = !enabled;
            sendDetails(enabled);
            sendResponse({
                result: enabled,
                otherResult: preventCloseEnabled
            });
        } else if (request.greeting === "getEnabled") {
            sendResponse({
                result: enabled
            });
        } else if (request.greeting === "getBothEnabled") {
            sendResponse({
                result: enabled,
                otherResult: preventCloseEnabled
            });
        }else if (request.greeting === "imActiveTab") {
            tabToCopy = sender.tab.id;
        } else if (request.greeting === "doSingleSelect") {
            chrome.tabs.sendMessage(tabToCopy, {
                greeting: 'doSelectSingle'
            }, function(response) {});
        } else if (request.greeting === "doRangeSelect") {
            chrome.tabs.sendMessage(tabToCopy, {
                greeting: 'doSelectRange'
            }, function(response) {});
        } else if (request.greeting === "changeSelected") {
            console.log('Tab ' + sender.tab.id + ' change selected');
            chrome.tabs.update(sender.tab.id, {selected: true});
        } else if (request.greeting === "changePreventCloseEnabled") {
            preventCloseEnabled = !preventCloseEnabled;
            sendPreventCloseDetails(preventCloseEnabled);
            sendResponse({
                result: enabled,
                otherResult: preventCloseEnabled
            });
        } else if (request.greeting === "getPreventCloseEnabled") {
            sendPreventCloseDetails({
                otherResult: preventCloseEnabled
            });
        }

        return true;
    });

function sendDetails(sendData) {
    chrome.tabs.query({}, function(tabs) {
        for (var i = 0; i < tabs.length; ++i) {
            chrome.tabs.sendMessage(tabs[i].id, {
                greeting: 'updateEnabled',
                result: enabled
            }, function(response) {});
        }
    });
}

function sendPreventCloseDetails(sendData) {
    chrome.tabs.query({}, function(tabs) {
        for (var i = 0; i < tabs.length; ++i) {
            chrome.tabs.sendMessage(tabs[i].id, {
                greeting: 'updatePreventCloseEnabled',
                result: preventCloseEnabled
            }, function(response) {});
        }
    });
}