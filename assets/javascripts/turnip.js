
function tags() { 
    this.tags = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    this.count = 0;
    this.next = function() { 
        return this.tags[this.count++];
        if(this.count > (this.tags.length - 1)) this.count = 0;
    };
};

function randomClockPair() { 
    var from = u.clocks[Math.floor(Math.random()*u.clocks.length)];
    do { var to = u.clocks[Math.floor(Math.random()*u.clocks.length)]; } while (to === from);
    return [ from, to ];
};

function sendRandomMessages(number) {
    for(var i=0; i<number; i++) { 
        var clocks = randomClockPair();
        clocks[0].send(clocks[1], tag.next(), clocks[0].id + ' -> ' + clocks[1].id);
    }
};
