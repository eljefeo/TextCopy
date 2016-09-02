var enabled = false,
    preventCloseEnabled = false,
    otherKeyPressed = false,
    keys = [],
    keyDownTimes = [],
    keyUpTimes = [],
    elements = [],
    cushionTime = 20,
    mouseX = 0,
    mouseY = 0;

//function PopIt() { return "Are you sure you want to leave?"; console.log('hmmm trying to close');}
//function UnPopIt()  { /* nothing to return */ }

/*$(document).ready(function() {
    window.onbeforeunload = PopIt;
    $("a").click(function(){ window.onbeforeunload = UnPopIt; });
});*/




$(function() {

    getEnabled();
    getPreventCloseEnabled();
    heyIHaveTheMouse();

   /* $('head').append('<link rel="stylesheet" href="sidebar.css" type="text/css" />');

    // Set this variable with the height of your sidebar + header
    var offsetPixels = 700; 

    $(window).scroll(function() {
        if ($(window).scrollTop() > offsetPixels) {
            $( ".scrollingBox" ).css({
                "position": "fixed",
                "top": "15px"
            });
        } else {
            $( ".scrollingBox" ).css({
                "position": "static"
            });
        }
    });*/
});

//window.onunload = function(){}

/*window.onbeforeunload = function() {
    if(preventCloseEnabled){
       // changePreventCloseEnabled();
        return "Would you really like to close?"; 
    }
}
*/

$(document).mouseenter(function() {
    heyIHaveTheMouse();
    sendGreetingToBackground("changeSelected");
});

//reset the keys on window blur to avoid losing a keyUp when switching windows
$(window).blur(function() {
    elements = [];
    if (keys) {
        resetAllKeys();
    }
});

$(document).keydown(function(e) {
    console.log('pressed ' + e.keyCode);

       if (e.keyCode === 114 || (e.ctrlKey && e.keyCode === 70)) { 
        e.preventDefault();
       $.get(chrome.extension.getURL('/sidebar.html'), function(data) {
    //$(data).appendTo('body');
    // Or if you're using jQuery 1.8+:
    $($.parseHTML(data)).appendTo('body');
});
    }

    keyDownTimes[e.keyCode] = new Date().getTime();
    if (e.keyCode != 16 && e.keyCode != 17 && e.keyCode != 18 && e.keyCode != 70) {
        otherKeyPressed = true;
        return;
    }
    var diff = keyDownTimes[e.keyCode] - keyUpTimes[e.keyCode];
    if (diff <= cushionTime && diff > 0) {
        keys[e.keyCode] = false;
    } else {
        keys[e.keyCode] = true;
    }

    if(keys[17] && keys[70]){
        console.log('!!!ctrl f is pressed');
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
            if (enabled) {
                sendGreetingToBackground("doSingleSelect");
            }
        } else if (keys[18] && keys[17]) {
            if (enabled) {
                sendGreetingToBackground("doRangeSelect");
            }
        }
        keys[e.keyCode] = false;
    })
    .mousemove(function(e) {
        heyIHaveTheMouse();
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

function getPreventCloseEnabled() {
    chrome.runtime.sendMessage({
        greeting: "getPreventCloseEnabled"
    }, function(response) {
        preventCloseEnabled = response.otherResult;
    });
}

function changePreventCloseEnabled() {
    chrome.runtime.sendMessage({
        greeting: "changePreventCloseEnabled"
    }, function(response) {
        preventCloseEnabled = response.otherResult;
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
            if (elements.length === 2)
                elements = [];
            elements.push(document.elementFromPoint(mouseX, mouseY));
            if (elements.length === 1)
                selectTextSingleElement(elements[0]);
            if (elements.length === 2)
                selectTextTwoElements(elements[0], elements[1]);
        } else if(request.greeting === "updatePreventCloseEnabled") {
            preventCloseEnabled = request.result;
        }
    }
    return true;
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
    sendGreetingToBackground("imActiveTab");
}

function copyToClipboard() {
    try {
        document.execCommand('copy');
    } catch (err) {}
}

function simulateESCKeyPress() {
  jQuery.event.trigger({ type : 'keypress', which : 27 });
}