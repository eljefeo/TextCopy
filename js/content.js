var enabled = false,
    otherKeyPressed = false,
    amIActive = false,
    keys = [],
    keyDownTimes = [],
    keyUpTimes = [],
    elements = [],
    cushionTime = 100,
    mouseX = 0,
    mouseY = 0;

$(function() {
    getEnabled();
    heyIHaveTheMouse();
});

$(document).mouseleave(function() {
    heyILostTheMouse();
});
$(document).mouseenter(function() {
    heyIHaveTheMouse();
});

//reset the keys on window blur to avoid losing a keyUp when switching windows
$(window).blur(function() {
    heyILostTheMouse();
    elements = [];
    if (keys) {
        resetAllKeys();
    }
});
$(window).focus(function() {
    heyIHaveTheMouse();
});

$(document).keydown(function(e) {
    keyDownTimes[e.keyCode] = new Date().getTime();
    if (e.keyCode != 16 && e.keyCode != 17 && e.keyCode != 18) {
        otherKeyPressed = true;
        return;
    }
    var diff = keyDownTimes[e.keyCode] - keyUpTimes[e.keyCode];
    if (diff <= cushionTime && diff > 0) {
        keys[e.keyCode] = false;
    } else {
        keys[e.keyCode] = true;
    }
})
    .keyup(function(e) {
        keyUpTimes[e.keyCode] = new Date().getTime();
        if (otherKeyPressed) {
            //wait for all keys to be let up before resetting otherkeypressed
            keys[e.keyCode] = false;
            if (!isAnyKeyPressed()) {
                otherKeyPressed = false;
            }
            keys[e.keyCode] = false;
            return;
        } else if (keys[16] && keys[17]) {
            getEnabled();
            if (enabled) {
                chrome.runtime.sendMessage({
                    greeting: "doSingleSelect"
                }, function(response) {});
            }
        } else if (keys[18] && keys[17]) {
            getEnabled();
            if (enabled) {
                chrome.runtime.sendMessage({
                    greeting: "doRangeSelect"
                }, function(response) {});
            }
        }
        keys[e.keyCode] = false;
    })
    .mousemove(function(e) {
        if (!amIActive) {
            heyIHaveTheMouse();
            amIActive = true;
        }
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

function selectTextTwoElements(startElement, endElement) {
    var doc = document,
        range, selection;
    if (doc.body.createTextRange) {
        range = document.body.createTextRange();
        range.setStart(startElement, 0);
        range.setEnd(endElement, 1);
        if (range.startOffset === 1) {
            range.setStart(endElement, 0);
            range.setEnd(startElement, 1);
        }
        range.select();
        copyToClipboard();
    } else if (window.getSelection) {
        selection = window.getSelection();
        range = document.createRange();
        range.setStart(startElement, 0);
        range.setEnd(endElement, 1);
        if (range.startOffset === 1) {
            range.setStart(endElement, 0);
            range.setEnd(startElement, 1);
        }
        selection.removeAllRanges();
        selection.addRange(range);
        copyToClipboard();
    }
}

function selectTextSingleElement(startElement) {
    var doc = document,
        range, selection;
    if (doc.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(startElement);
        range.select();
        copyToClipboard();
    } else if (window.getSelection) {
        selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(startElement);
        selection.removeAllRanges();
        selection.addRange(range);
        copyToClipboard();
    }
}

function getEnabled() {
    chrome.runtime.sendMessage({
        greeting: "getEnabled"
    }, function(response) {
        enabled = response.result;
    });
}

//listen for updates from background
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.greeting) {
        if (request.greeting === 'updateEnabled') {
            enabled = request.result;
        } else if (request.greeting === "doSelectSingle") {
            selectTextSingleElement(document.elementFromPoint(mouseX, mouseY));
        } else if (request.greeting === "doSelectRange") {
            if (elements.length === 2) {
                elements = [];
            }
            elements.push(document.elementFromPoint(mouseX, mouseY));
            if (elements.length === 1) {
                selectTextSingleElement(elements[0]);
            }
            if (elements.length === 2) {
                selectTextTwoElements(elements[0], elements[1]);
            }
        }
    }
});

function isAnyKeyPressed() {
    for (var i = 0; i < keys.length; i++)
        if (keys[i])
            return true;
    return false;
}

function resetAllKeys() {
    for (var i = 0; i < keys.length; i++)
        keys[i] = false;
}

function heyIHaveTheMouse() {
    if (!amIActive) {
        amIActive = true;
        chrome.runtime.sendMessage({
            greeting: "imActiveTab"
        }, function(response) {});
    }
}

function heyILostTheMouse() {
    amIActive = false;
}

function copyToClipboard() {
    try {
        document.execCommand('copy');
    } catch (err) {
        console.log('Unable to copy');
    }
}