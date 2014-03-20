
function Event() { 

    this.ee = (EventEmitter !== undefined) ?  new EventEmitter() : undefined;

    if(this.ee === undefined)
        this.logMessage("No EventEmitter class found");

    this.emit = function(channel, mesg) { 
        if(this.ee !== undefined) { 
            this.ee.emitEvent(channel, [ mesg ]);
        }
    };

    this.on = function(channel, func) { 
        if(this.ee !== undefined) { 
            this.ee.on(channel, function(data) { 
                func(data)
            });
        }
    };

    this.logMessage = function(message) { 
        var mesgElem = document.createElement('span');
        mesgElem.className = 'mesg';
        mesgElem.innerHTML = message;
        document.getElementById('messages').appendChild(mesgElem);
    };

    this.addClockToDisplay = function(clock) { 
        var clockDivElem = document.createElement('div');
        clockDivElem.className = 'clock-face';
        var clockNameElem = document.createElement('span');
        clockNameElem.innerHTML = clock.id;
        clockNameElem.className = 'clock-name';
        clockDivElem.appendChild(clockNameElem);
        var clockElem = document.createElement('span');
        clockElem.id = 'clock' + clock.id;
        clockElem.className = 'clock';
        clockElem.innerHTML = JSON.stringify(clock.timestamp);
        clockDivElem.appendChild(clockElem);
        document.getElementById('clocks').appendChild(clockDivElem);
    };

    this.updateDisplay = function(clock) { 
        var clockElem = document.getElementById('clock' + clock.id);
        clockElem.innerHTML = JSON.stringify(clock.timestamp);
    };

    this.updateOrder = function(events) { 
        var eventsElem = document.getElementById('events');
        eventsElem.innerHTML = '';
        events.events.forEach(function(event) { 
            var eventElem = document.createElement('span');
            eventElem.className = 'mesg';
            eventElem.innerHTML = event.tag;
            eventsElem.appendChild(eventElem);
        });
    };

};

var e = new Event();

function Clock(id, universe) { 

    var clock = this;
    this.id = id;
    this.timestamp = null;
    this.events = [];
    this.universe = universe;

    this.init = function(numberOfClocks) { 
        clock.timestamp = Array.apply(null, new Array(numberOfClocks)).map(Number.prototype.valueOf,0);
        e.emit('init', { id: clock.id, clocks: numberOfClocks, timestamp: clock.timestamp });
    };

    // increment local clock

    this.inc = function() {
        clock.timestamp[clock.id]++;
        e.emit('tick', { id: clock.id, timestamp: clock.timestamp });
    }

    this.send = function(to, tag, message) { 
        clock.inc();
        to.recv({ tag: tag, message: message }, this.id, this.timestamp);
    };

    this.recv = function(payload, senderId, timestamp) { 
        e.emit('recv', { message: payload.tag + ': ' + payload.message });
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

function Universe(numberOfClocks) { 

    this.numberOfClocks = numberOfClocks;
    this.clocks = [];
    this.events = [];

    e.on('recv', function(data)  { e.logMessage(data.message); });
    e.on('init', function(clock) { e.addClockToDisplay(clock); });
    e.on('tick', function(clock) { e.updateDisplay(clock); });
    e.on('order', function(events) { e.updateOrder(events); });

    for(var i=0; i<numberOfClocks; i++) { 
        var c = new Clock(this.clocks.length, this);
        c.init(numberOfClocks);
        this.clocks.push(c);
    }

    this.order = function() { 
        this.events = [];
        for(var i=0; i < this.clocks.length; i++) { 
            this.events = this.events.concat(this.clocks[i].events);
        }
        this.events.sort(function(e1, e2) { 
            return e1.timestamp[e1.id] - e2.timestamp[e1.id];
        });
        e.emit('order', { events: this.events });
    };

    this.inspect = function() { 
        e.logMessage(this.numberOfClocks + ' clocks');
        for(var i=0; i < this.clocks.length; i++) { 
            e.logMessage('clock: ' + i);
            e.logMessage('timestamp: ' + this.clocks[i].timestamp);
            e.logMessage(this.clocks[i].events);
        }
    };

};
