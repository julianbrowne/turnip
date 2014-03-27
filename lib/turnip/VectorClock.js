
define([], function() { 

    console.log("Loading : VectorClock");

    return function(id, universe) { 

        var clock = this;
        this.id = id;
        this.timestamp = [];
        this.events = [];
        this.universe = universe;

        this.init = function(numberOfClocks) { 
            clock.timestamp = Array.apply(null, new Array(numberOfClocks)).map(Number.prototype.valueOf,0);
            universe.ui.emit('init', { id: clock.id, clocks: numberOfClocks, timestamp: clock.ts() });
        };

        this.inc = function() { 
            clock.timestamp[clock.id]++;
            universe.ui.emit('tick', { id: clock.id, timestamp: clock.ts() });
        }

        /**
         *  send: send message to another process (clock)
         *  @param {object}  to          clock object of destination process
         *  @param {string}  tag         identifier for this message
         *  @param {string}  message     contents of message
         *  @param {boolean} deferred    defer recv event to the end of currrent stack
        **/

        this.send = function(to, tag, message, deferred) { 
            clock.inc();
            universe.ui.emit('send', { from: clock.id, to: to.id, tag: tag, message: message });
            invokeReceive = function() { to.recv({ tag: tag, message: message }, clock.id, clock.ts()); };
            if(deferred) {
                var transitDelay = Math.floor(Math.random() * 3000);
                setTimeout(invokeReceive, transitDelay);
            }
            else
                invokeReceive();
        };

        /**
         *  recv: receive a message from another process (clock)
        **/

        this.recv = function(payload, senderId, timestamp) { 
            clock.inc();
            clock.universe.messagesActive--;
            universe.ui.emit('recv', { from: senderId, to: clock.id, tag: payload.tag, message: payload.message });
            clock.syncClocks(clock.timestamp, timestamp, senderId);
            clock.events.push({ id: clock.id, tag: payload.tag, message: payload.message, timestamp: clock.ts() });
        };

        this.event = function(tag, message) { 
            clock.inc();
            clock.events.push({ id: clock.id, tag: tag, message: message, timestamp: clock.ts() });
            clock.timestamp.forEach(function(proc, index) { 
                if(index !== clock.id) { 
                    clock.send(clock.universe.clocks[index], '~', clock.id + ' -> ' + index, clock.universe.deferred());
                }
            });
        };

        this.syncClocks = function(localClock, remoteClock, remoteId) { 
            if(localClock[remoteId] <= remoteClock[remoteId])
                localClock[remoteId] = remoteClock[remoteId] + 1;
            for(var i=0; i<localClock.length; i++) { 
                if(localClock[i] < remoteClock[i]) localClock[i] = remoteClock[i];
            };
        };

        /**
         * Copy of (not ref to) this.timestamp
        **/

        this.ts = function() { 
            var copy = clock.timestamp.slice(0);
            return copy;
        };

    };

});


