
requirejs( ['UI', 'Universe', 'VectorClock' ],

    function(UI, Universe, VectorClock) { 

        var ui = new UI({ clocks: 'clocks', messages: 'messages', events: 'events' });

        var universe = new Universe(3, ui);

        universe.sendRandomMessages(10);
        universe.sendRandomMessages(3);
        universe.localEvent(universe.clocks[0], 'T1', 'buy');
        universe.sendRandomMessages(3);
        universe.localEvent(universe.clocks[1], 'T2', 'buy');
        universe.sendRandomMessages(3);
        universe.localEvent(universe.clocks[2], 'T3', 'buy');
        universe.sendRandomMessages(3);
        universe.localEvent(universe.clocks[2], 'T4', 'buy');
        universe.localEvent(universe.clocks[2], 'T5', 'buy');
        universe.sendRandomMessages(3);
        universe.sendRandomMessages(3);

        universe.order();

    }

);