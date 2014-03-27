
requirejs.config({ 
    baseUrl: "lib/counter",
    shim: { 
        'underscore': { 
            exports: '_'
        }
    }
});

define(['underscore'], function(_) { 

    console.log("Loading : Counter");

    return function(targetElementId, id) { 

        var counter = this;
        this.id = id;
        this.duration = 1000;
        this.numerals = { count: 0, next: 1 };
        this.fonts = { curr: 'medium', next: 'medium' };
        this.parent = document.getElementById(targetElementId);
        this.el = addWrapper(this.parent);
        this.template = _(document.getElementById('clock-template').innerHTML).template();
        this.delta = 1;
        this.timer = null;
        this.queue = [];
        this.currentAnimation = null;

        function addWrapper(parent) { 
            var w = document.createElement('div');
            w.className = 'count';
            w.innerHTML = counter.numerals.count;
            return parent.appendChild(w);
        }

        /**
        this.update = function() { 
            counter.checkTime();
            counter.setSizes();
            counter.setupAnimation();
            _(counter.executeAnimation).delay(20);
            _(counter.finishAnimation).delay(counter.duration * 0.9);
            // this.timer = _(this.update).delay(this.duration);
        };
        **/

        this.set = function(n) { 
            ((counter.numerals.count - n) <= 0) ? counter.toggleDirection('up', 'down') : counter.toggleDirection('down', 'up');
            counter.numerals.next = ((counter.numerals.count - n) <= 0) ? n + 1 : n - 1;
            counter.numerals.count = n;
            counter.setSizes();
            counter.addUpdate(counter.numerals, counter.fonts);
        };

        this.addUpdate = function(numerals, fonts) { 
            var m = { 
                numerals: { 
                    count: numerals.count,
                    next: numerals.next
                },
                fonts: { 
                    curr: fonts.curr,
                    next: fonts.next
                }
            };
            counter.queue.push( 
                function() { 
                    counter.el.innerHTML = counter.template(m);
                    // counter.el.classList.remove('changed');
                    // counter.el.classList.add('changing');
                    // counter.el.classList.add('changed');
                    // counter.el.classList.remove('changing');
                }
            );
            if (!counter.timer) counter.timer = setInterval(function() { counter.update(); }, 50);
            counter.update();
        };

        this.update = function() { 
            if(counter.currentAnimation === null) { 
                if (counter.queue.length === 0) { 
                    counter.stop();
                    return;
                }
                counter.currentAnimation = counter.queue.shift();
            }
            counter.currentAnimation();
            counter.currentAnimation = null;
        };

        this.checkTime = function() { 
            counter.numerals.count += counter.delta;
            counter.delta === 1 ? counter.toggleDirection('up', 'down') : counter.toggleDirection('down', 'up');
            counter.numerals.next = counter.numerals.count + counter.delta;
        };

        this.stop = function() { 
            clearInterval(counter.timer);
            counter.timer = null;
        };

        this.toggleDirection = function(add, remove) { 
            counter.el.classList.add(add);
            counter.el.classList.remove(remove);
        };

        this.setSizes = function() { 
            counter.fonts.curr = counter.getSize(counter.numerals.count);
            counter.fonts.next = counter.getSize(counter.nextTime);
        };

        this.getSize = function(n) { 
            return (n > 9 || n < 0) ? 'small' : '';
        };

        this.setupAnimation = function() { 
            counter.el.innerHTML = counter.template(counter);
            counter.el.classList.remove('changed');
        };

        this.executeAnimation = function() { 
            counter.el.classList.add('changing');
        };

        this.finishAnimation = function() { 
            counter.el.classList.add('changed');
            counter.el.classList.remove('changing');
        }

        this.set(this.numerals.count);

    };

});