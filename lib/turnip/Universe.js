
define(['VectorClock'], function(VectorClock) { 

    console.log("Loading : Universe");

    return function(numberOfClocks, ui) { 

        var universe = this;
        this.numberOfClocks = numberOfClocks;
        this.clocks = [];
        this.events = [];
        this.ui = ui;
        this.tags = new Tags();

        universe.ui.on('recv',  function(data)   { universe.ui.logMessage(data.message); });
        universe.ui.on('init',  function(clock)  { universe.ui.addClockToDisplay(clock); });
        universe.ui.on('tick',  function(clock)  { universe.ui.updateDisplay(clock);     });
        universe.ui.on('order', function(events) { universe.ui.updateOrder(events);      });

        for(var i=0; i<numberOfClocks; i++) { 
            var c = new VectorClock(universe.clocks.length, universe);
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
            universe.ui.emit('order', { events: this.events });
        };

        this.inspect = function() { 
            universe.ui.logMessage(this.numberOfClocks + ' clocks');
            for(var i=0; i < this.clocks.length; i++) { 
                universe.ui.logMessage('clock: ' + i);
                universe.ui.logMessage('timestamp: ' + this.clocks[i].timestamp);
                universe.ui.logMessage(this.clocks[i].events);
            }
        };

        function randomClockPair() { 
            var from = universe.clocks[Math.floor(Math.random() * universe.clocks.length)];
            do { var to = universe.clocks[Math.floor(Math.random() * universe.clocks.length)]; } while (to === from);
            return [ from, to ];
        };

        function Tags() { 
            this.tags = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            this.count = 0;
            this.next = function() { 
                return this.tags[this.count++];
                if(this.count > (this.tags.length - 1)) this.count = 0;
            };
        };

        this.sendRandomMessages = function(number) { 
            for(var i=0; i<number; i++) { 
                var clocks = randomClockPair();
                clocks[0].send(clocks[1], universe.tags.next(), clocks[0].id + ' -> ' + clocks[1].id);
            }
        };

    };

});