
define(['EventEmitter', '../counter/counter'], function (EventEmitter, Counter) { 

    console.log("Loading : UI");

    return function(config) { 

        var ui = this;
        this.ee = (undefined === EventEmitter) ?  undefined : new EventEmitter();
        this.counters = [];

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
            document.getElementById(config.messages).appendChild(mesgElem);
        };

        this.addClockToDisplay = function(clock) { 
            var clockFaceElem = document.createElement('div');
            clockFaceElem.id = 'clockface-' + clock.id;
            clockFaceElem.className = 'clock-face';
            var clockNameElem = document.createElement('span');
            clockNameElem.id = 'clockname-' + clock.id;
            clockNameElem.className = 'clock-name';
            clockNameElem.innerHTML = clock.id;
            clockFaceElem.appendChild(clockNameElem);
            var clockHandElem = document.createElement('span');
            clockHandElem.id = 'clockhands-' + clock.id;
            clockHandElem.className = 'clock-hands';
            clockFaceElem.appendChild(clockHandElem);
            document.getElementById(config.clocks).appendChild(clockFaceElem);
            constructCounters(clockHandElem.id, clock.id, clock.timestamp);
        };

        this.updateDisplay = function(clock) { 
            clock.timestamp.forEach(function(count, index) { 
                var counterObj = ui.counters[clock.id][index];
                counterObj.set(count);
            });
        };

        this.updateOrder = function(events) { 
            var eventsElem = document.getElementById(config.events);
            eventsElem.innerHTML = '';
            events.events.forEach(function(event) { 
                var eventElem = document.createElement('span');
                eventElem.className = 'mesg';
                eventElem.innerHTML = event.tag;
                eventsElem.appendChild(eventElem);
            });
        };

        function constructCounters(clockDivElemId, id, timestamp) { 
            timestamp.forEach(function(count, index) { 
                if(undefined === ui.counters[id]) ui.counters[id] = [];
                ui.counters[id][index] = new Counter(clockDivElemId, id + '-' + index);
            });
        };

    };

});
