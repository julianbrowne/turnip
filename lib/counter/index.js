
requirejs.config({ 

});

requirejs([ 'counter' ], function(Counter) { 
    return Counter; 
});
