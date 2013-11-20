
var VClock = function(t) { 

    this.t = t;

    this.inc = function() { 
        this.t++;
    }

    this.timestamp = function(time) {
        this.t = time;
    };

};
