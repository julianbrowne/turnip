
requirejs.config({ 
 
});

requirejs( 
    [ 
        'UI', 
        'Universe', 
        'VectorClock'
    ],
    function(UI, Universe, VectorClock) { 

        var ui = new UI();
        var u  = new Universe(3, ui);

        u.sendRandomMessages(20);

        u.clocks[0].event('1', "buy ticket");
        u.clocks[1].event('2', "buy ticket");
        u.clocks[2].event('3', "buy ticket");

        u.sendRandomMessages(20);

        u.order();

    }
);