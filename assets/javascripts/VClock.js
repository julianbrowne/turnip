
var VClock = function(id, clocks, transport) { 

    this.id = id;
    this.v = newVector(clocks);
    this.clocks = this.v.length;

    this.inc = function() { 
        this.v[this.id]++;
    }

    function newVector(length) { 
        var v = [];
        for(var i=0; i<length; i++) { 
            v.push(0);
        }
        return v;
    };

    this.send = function(to) { 
        this.v[this.id]++;
        var message = { 
            to: to, 
            content: "hello", 
            from: this.id, 
            clock: this.v.slice(0), // clone so as to leave historical copy
            delivered: false 
        };
        transport.push(message);
    };

    this.receive = function(mesg) { 
        this.v[this.id]++;
        for (var i=0; i<mesg.clock.length; i++)
            if (mesg.clock[i] > this.v[i])
                this.v[i] = mesg.clock[i];
        mesg.delivered = true;
    };

};
