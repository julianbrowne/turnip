
var LClock = function() { 

    this.t = new Date().getTime();;

    this.inc = function() { 
        this.t = new Date().getTime();
    };

    this.timestamp = function(time) {
        this.t = time;
    };

};