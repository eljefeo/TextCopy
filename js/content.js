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
    heyImInActive();
    console.log('new tab start');


});


$(document).mouseleave(function() {
    heyImInActive();
    console.log('aaaaout');
});
$(document).mouseenter(function() {
    heyImActive();
    console.log('aaaain');
});

//reset the keys on window blur to avoid losing a keyUp when switching windows
$(window).blur(function() {
    heyImInActive();
    console.log('aaaablurr');

    elements = [];
    if (keys) {
        console.log("window blur, resetting all keys");
        resetAllKeys();
    }
});
$(window).focus(function() {
    heyImActive();
    console.log('aaaafocus');

    console.log("This window is focused now. letting back know");
})

;



$(document).keydown(function(e) {
    keyDownTimes[e.keyCode] = new Date().getTime();
    if (e.keyCode != 16 && e.keyCode != 17 && e.keyCode != 18) {
        otherKeyPressed = true;
        console.log("Pressing extra keys ? " + e.keyCode);
        return;
    }

    //  console.log('press ' + e.keyCode + ", keyDownTime = "+ keyDownTimes[e.keyCode]);
    var diff = keyDownTimes[e.keyCode] - keyUpTimes[e.keyCode];
    if (diff <= cushionTime && diff > 0) {
        keys[e.keyCode] = false;
        console.log("TEXTCOPY *********** detected stick...");
    } else {
        keys[e.keyCode] = true;
    }
})
    .keyup(function(e) {
        keyUpTimes[e.keyCode] = new Date().getTime();

        if (otherKeyPressed) {
            console.log("other key is pressed (in keyup)");
            //wait for all keys to be let up before resetting otherkeypressed
            keys[e.keyCode] = false;
            if (!isAnyKeyPressed()) {
                console.log("resetting otherkey pressed ");
                otherKeyPressed = false;
            }
            keys[e.keyCode] = false;
            return;
        } else if (keys[16] && keys[17]) {

            getEnabled();
            if (enabled) {
                console.log("selecting single");
                selectTextSingleElement(document.elementFromPoint(mouseX, mouseY));
            }
        } else if (keys[18] && keys[17]) {
            getEnabled();
            if (enabled) {
                if (elements.length === 2) {
                    elements = [];
                }
                elements.push(document.elementFromPoint(mouseX, mouseY));
                if (elements.length === 1) {
                    console.log("selecting single again");
                    selectTextSingleElement(elements[0]);
                }
                if (elements.length === 2) {
                    console.log("selecting two");
                    selectTextTwoElements(elements[0], elements[1]);
                }
            }
        }
        keys[e.keyCode] = false;
    })
    .mousemove(function(e) {
        if (!amIActive) {
            heyImActive();
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
        var textMaybe = range.select();
        console.log("text 2 " + textMaybe);
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

        var textMaybe = selection.addRange(range);
        console.log("text 2 " + textMaybe);
        copyToClipboard();
    }
}

function selectTextSingleElement(startElement) {
    chrome.runtime.sendMessage({
        greeting: "doOtherTabActive"
    }, function(response) {
        // enabled = response.result;
    });
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
    if (request.greeting && request.greeting === 'updateEnabled') {
        enabled = request.result;
        console.log("Received update from background! enabled is now " + enabled);
    }
});

function isAnyKeyPressed() {
    for (var i = 0; i < keys.length; i++) {
        if (keys[i]) {
            return true;
        }
    }
    return false;
}

function resetAllKeys() {
    for (var i = 0; i < keys.length; i++) {
        keys[i] = false;
    }
}


function tellbackImInactive() {
    console.log("This tab is blurred now. letting back know im last tab");

    chrome.runtime.sendMessage({
        greeting: "gotBlurred"
    }, function(response) {
        // enabled = response.result;
    });
}

function heyImActive() {
    if (!amIActive) {
        amIActive = true;
        console.log('tell back active now');
        chrome.runtime.sendMessage({
            greeting: "imActiveTab"
        }, function(response) {
        });
    }

}

function heyImInActive() {
    if (amIActive) {
        amIActive = false;
        console.log('tell back inActive now');
        chrome.runtime.sendMessage({
            greeting: "imInActiveTab"
        }, function(response) {
        });
    }

}


function copyToClipboard() {
    try {
        document.execCommand('copy');
    } catch (err) {
        console.log('Unable to copy');
    }
}