$(function() {
    chrome.runtime.sendMessage({
        greeting: "getEnabled"
    }, function(response) {
        var enabled = response.result;
        if (enabled) {
            document.getElementById("spanButtonChange").innerHTML = "Off";
            document.getElementById("spanStatus").className = "label label-success";
            document.getElementById("spanStatus").innerHTML = "On";
        } else {
            document.getElementById("spanButtonChange").innerHTML = "On";
            document.getElementById("spanStatus").className = "label label-warning";
            document.getElementById("spanStatus").innerHTML = "Off";

        }
    });

    $('#switchEnable').on('click', function(e) {
        chrome.runtime.sendMessage({
            greeting: "changeEnabled"
        }, function(response) {
            var enabled = response.result;
            if (enabled) {
                document.getElementById("spanButtonChange").innerHTML = "Off";
                document.getElementById("spanStatus").className = "label label-success";
                document.getElementById("spanStatus").innerHTML = "On";

            } else {
                document.getElementById("spanButtonChange").innerHTML = "On";
                document.getElementById("spanStatus").className = "label label-warning";
                document.getElementById("spanStatus").innerHTML = "Off";
            }
        });
    });
});