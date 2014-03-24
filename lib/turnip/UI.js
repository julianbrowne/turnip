
define(['EventEmitter', '../counter/counter'], function (EventEmitter, Counter) { 

    console.log("Loading : UI");

    return function() { 

        this.ee = (undefined === EventEmitter) ?  undefined : new EventEmitter();

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
            clockElem.className = 'clock count';
            clockElem.innerHTML = JSON.stringify(clock.timestamp);
            clockDivElem.appendChild(clockElem);
            document.getElementById('clocks').appendChild(clockDivElem);
            new Counter(0, document.getElementById(clockElem.id));
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

});
