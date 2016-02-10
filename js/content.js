var enabled = false,
    keys = [],
    keyDownTimes = [],
    keyUpTimes = [],
    elements = [],
    cushionTime = 50,
    mouseX = 0,
    mouseY = 0;

$(window).blur(function() {
    for (var i = 0; i < keys.length; i++)
        keys[i] = false;
});

$(document).keydown(function(e) {
    keyDownTimes[e.keyCode] = new Date().getTime();
    keys[e.keyCode] = (!keyUpTimes[e.keyCode] || keyDownTimes[e.keyCode] - keyUpTimes[e.keyCode] > cushionTime);
})
    .keyup(function(e) {
        keyUpTimes[e.keyCode] = new Date().getTime();
        if (enabled && keys[17] && (keys[16] || keys[18])) {
            elements = keys[16] || (keys[18] && elements.length > 1) ? [] : elements;
            elements.push(document.elementFromPoint(mouseX, mouseY));
            selectText(elements);
        }
        keys[e.keyCode] = false;
    })
    .mousemove(function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

function selectText(arr) {
    if (arr && arr.length < 3 && window.getSelection) {
        if (arr[1]) {
            selection = window.getSelection();
            range = document.createRange();
            range.setStart(arr[0], 0);
            range.setEnd(arr[1], 1);
            if (range.startOffset) {
                range.setStart(arr[1], 0);
                range.setEnd(arr[0], 1);
            }
            selection.removeAllRanges();
            selection.addRange(range);
        } else {
            selection = window.getSelection();
            range = document.createRange();
            range.selectNodeContents(arr[0]);
            selection.removeAllRanges();
            selection.addRange(range);
        }
        copyToClipboard();
    }
}

function copyToClipboard() {
    try {
        document.execCommand('copy');
    } catch (err) {
        console.log('Unable to copy');
    }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.greeting && request.greeting === 'updateEnabled')
        enabled = request.result;
});
