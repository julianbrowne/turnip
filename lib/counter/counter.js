
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

    return function(time, el, template) { 

        this.duration = 1000;
        this.max = time;
        this.time = time;
        this.el = el;
        this.template = _(template.innerHTML).template();
        this.delta = 1;
        this.timer = null;

        this.update = function() { 
            this.checkTime();
            this.setSizes();
            this.setupAnimation();
            _(this.executeAnimation).delay(20);
            _(this.finishAnimation).delay(this.duration * 0.9);
            // this.timer = _(this.update).delay(this.duration);
        };

        this.checkTime = function() { 
            this.time += this.delta;

            if (this.time === 0) this.delta = 1;
            if (this.time === this.max) this.delta = -1;

            this.delta === 1 ? this.toggleDirection('up', 'down') : this.toggleDirection('down', 'up');

            this.nextTime = this.time + this.delta;
        };

        this.stop = function() { 
            clearTimeout(this.timer);
        };

        this.toggleDirection = function(add, remove) { 
            this.el.classList.add(add);
            this.el.classList.remove(remove);
        };

        this.setSizes = function() { 
            this.currentSize = this.getSize(this.time);
            this.nextSize = this.getSize(this.nextTime);
        };

        this.getSize = function(time) { 
            return time > 9 ? 'small' : '';
        };

        this.setupAnimation = function() { 
            this.el.innerHTML = this.template(this);
            this.el.classList.remove('changed');
        };

        this.executeAnimation = function() { 
            this.el.classList.add('changing');
        };

        this.finishAnimation = function() { 
            this.el.classList.add('changed');
            this.el.classList.remove('changing');
        }

    };

});
