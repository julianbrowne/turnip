
define([], function() { 

    console.log("Loading : VectorClock");

    return function(id, universe) { 

        var clock = this;
        this.id = id;
        this.timestamp = null;
        this.events = [];
        this.universe = universe;

        this.init = function(numberOfClocks) { 
            clock.timestamp = Array.apply(null, new Array(numberOfClocks)).map(Number.prototype.valueOf,0);
            universe.ui.emit('init', { id: clock.id, clocks: numberOfClocks, timestamp: clock.timestamp });
        };

        this.inc = function() { 
            clock.timestamp[clock.id]++;
            universe.ui.emit('tick', { id: clock.id, timestamp: clock.timestamp });
        }

        this.send = function(to, tag, message) { 
            clock.inc();
            to.recv({ tag: tag, message: message }, this.id, this.timestamp);
        };

        this.recv = function(payload, senderId, timestamp) { 
            universe.ui.emit('recv', { message: payload.tag + ': ' + payload.message });
            if(clock.timestamp[senderId] <= timestamp[senderId])    
                clock.timestamp[senderId] = timestamp[senderId] + 1;
            for(var i=0; i<clock.timestamp.length; i++) { 
                if(clock.timestamp[i] < timestamp[i]) clock.timestamp[i] = timestamp[i];
            };
            clock.inc();
            clock.events.push({ id: clock.id, tag: payload.tag, name: payload.message, timestamp: clock.timestamp.slice(0) });
        };

        this.event = function(tag, message) { 
            clock.inc();
            clock.events.push({ id: clock.id, tag: tag, name: message, timestamp: clock.timestamp.slice(0) });
            clock.timestamp.forEach(function(proc, index) { 
                if(index !== clock.id)
                    clock.send(clock.universe.clocks[index], '-', 'sync');
            });
        };

    };

});


