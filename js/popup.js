$(function() {
    var talkToBack = function(text) {
        chrome.runtime.sendMessage({
            greeting: text
        }, function(response) {
           // updateFront(response.result);

            var enabled = response.result;
            var preventCloseEnabled = response.otherResult;

            document.getElementById("spanTextCopyButtonChange").innerHTML = enabled ? "Off" : "On";
            document.getElementById("spanTextCopyStatus").className = enabled ? "label label-success" : "label label-warning";
            document.getElementById("spanTextCopyStatus").innerHTML = enabled ? "On" : "Off";

            document.getElementById("spanCloseButtonChange").innerHTML = preventCloseEnabled ? "Off" : "On";
            document.getElementById("spanCloseStatus").className = preventCloseEnabled ? "label label-success" : "label label-warning";
            document.getElementById("spanCloseStatus").innerHTML = preventCloseEnabled ? "On" : "Off";
        });
    }
    talkToBack("getBothEnabled");

    $('#switchTextCopyEnable').on('click', function(e) {
        talkToBack("changeEnabled");
    });
    $('#switchCloseEnable').on('click', function(e) {
        talkToBack("changePreventCloseEnabled");
    });
});

/*function updateFront(enabled) {
    
}*/