
$(function() { 

    var messages = [];
    var clocks = [];
    var maxClocks = 3;

    for(var i=0; i<maxClocks; i++) { 
        clocks.push(new VClock(i, maxClocks, messages));
    };

    showStatus();

    // two concurrent sends

    clocks[0].send(1);          // message 0
    clocks[2].send(0);          // message 1
    showStatus();
    delivery();
    showStatus();

    // three sequential sends

    clocks[0].send(1);          // message 2
    delivery();
    clocks[1].send(2);          // message 3
    delivery();
    clocks[2].send(0);          // message 4
    delivery();
    showStatus();

    clocks[1].send(2);          // message 5
    clocks[1].send(2);          // message 6
    clocks[2].send(0);          // message 7
    delivery();
    showStatus();

    console.log(isConcurrent(messages[0], messages[1]));
    console.log(isConcurrent(messages[2], messages[3]));

    console.log(isBefore(messages[0], messages[1]));
    console.log(isBefore(messages[2], messages[3]));
    console.log(isBefore(messages[3], messages[4]));
    console.log(isBefore(messages[4], messages[5]));
    console.log(isBefore(messages[5], messages[6]));
    console.log(isBefore(messages[6], messages[7]));

    function delivery() { 
        for(var i=0; i<messages.length; i++) { 
            if(!messages[i].delivered) { 
                var recipient = messages[i].to;
                clocks[recipient].receive(messages[i]);
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

    function isBefore(messageA, messageB) { 
        before = true;
        var clockA = messageA.clock;
        var clockB = messageB.clock;
        console.log(clockA);
        console.log(clockB);
        for (var i=0; i<=clocks.length; i++) { 
            if(clockA[i] > clockB[i]) { 
                before = false;
            }
        }
        return before;
    }

    function isConcurrent(messageA, messageB) { 
        var greater = false;
        var less = false;
        var clockA = messageA.clock;
        var clockB = messageB.clock;

        for (var i=0; i<clocks.length; i++) { 
            if(clockA[i] > clockB[i]) { 
                greater = true;
            }
            else {
                if(clockA[i] < clockB[i]) { 
                    less = true;
                }
            }
        }

        return (greater && less);
    };

});
