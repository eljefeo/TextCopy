var enabled = false,
    keys = [],
    elements = [],
    mouseX = 0,
    mouseY = 0;

$(document).keydown(function(e) {
    keys[e.keyCode] = true;
})
    .keyup(function(e) {
    if (keys[16] && keys[17]) {
        getEnabled();
        if (enabled) {
            selectTextSingleElement(document.elementFromPoint(mouseX, mouseY));
        }
    } else if (keys[18] && keys[17]) {
        getEnabled();
        if (enabled) {
            if (elements.length == 2) {
                elements = [];
            }
            elements.push(document.elementFromPoint(mouseX, mouseY));
            if (elements.length == 1) {
                selectTextSingleElement(elements[0]);
            }
            if (elements.length == 2) {
                selectTextTwoElements(elements[0], elements[1]);
            }
        }
    }
        keys[e.keyCode] = false;
    })
    .mousemove(function(e) {
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

function copyToClipboard() {
    try {
        document.execCommand('copy');
    } catch (err) {
        console.log('Unable to copy');
    }
}