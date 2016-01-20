$(function() {
    chrome.runtime.sendMessage({
        greeting: "getEnabled"
    }, function(response) {
        var enabled = response.result;
        updateFront(enabled);
        
    });

    $('#switchEnable').on('click', function(e) {
        chrome.runtime.sendMessage({
            greeting: "changeEnabled"
        }, function(response) {
            var enabled = response.result;
        updateFront(enabled);
        });
    });
});

function updateFront(enabled) {
    document.getElementById("spanButtonChange").innerHTML = enabled ? "Off" : "On";
    document.getElementById("spanStatus").className = enabled ? "label label-success" : "label label-warning";
    document.getElementById("spanStatus").innerHTML = enabled ? "On" : "Off";
}