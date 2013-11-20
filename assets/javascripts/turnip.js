
$(function() { 

    var messages = [];
    var clocks = [];
    var maxClocks = 3;

    for(var i=0; i<maxClocks; i++) { 
        clocks.push(new VClock(i, maxClocks, messages));
    };

    showStatus();

    clocks[0].send(1);
    clocks[2].send(0);

    showStatus();

    delivery()

    showStatus();

    clocks[1].send(0);

    showStatus();

    delivery()

    showStatus();

    console.log(isConcurrent(messages[0], messages[1]));

    function delivery() { 
        for(var i=0; i<messages.length; i++) { 
            if(!messages[i].delivered) { 
                var recipient = messages[i].to;
                clocks[recipient].receive(messages[i]);
                messages[i].delivered = true;
            }
        };
    };

    function showStatus() { 

        for(var i=0; i<clocks.length; i++) { 
            $("#clocks").append("Clock " + i + " => " + clocks[i].v + "<br/>");
        };
        $("#clocks").append("<br/>");

        for(var i=0; i<messages.length; i++) {
            $("#messages").append("Message " + i + " => " + JSON.stringify(messages[i]) + "<br/>");
        };
        $("#messages").append("<br/>");

    };

    function isConcurrent(messageA, messageB) { 
        var greater = false;
        var less = false;

        for (var i=0; i<clocks.length; i++) { 
            if (messageA[i] > messageB[i])
                greater = true; 
            else (messageA[i] < messageB[i]) 
                less = true;
        }

        return (greater && less);
    };

});
