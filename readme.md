
# Turnip

Turnip, named after the mid 19th century mocking term for [plump pocket watches](http://richardlangworth.com/the-turnip-churchills-breguet-pocket-watch) based on the [verge escapement](http://en.wikipedia.org/wiki/Verge_escapement#Decline), is a demonstration of Vector Clocks in action.

![ screen-shot ](https://raw.githubusercontent.com/julianbrowne/turnip/master/assets/images/screen-shot.png)

## Running

Just open up index.html in a browser

## Structure

Turnip (lib/turnip) is made up of a number of modules:

*   VectorClock.js (implements the basic functions of a vclock)  
*   Universe.js (holds all instantiated clocks and any 'universal' properties)
*   UI.js (implements the UI drawing and message-passing functionality)
*   require.js (for module management)
*   EventEmitter.js (a node-like version of EventEmitter for the browser taken from [here](https://github.com/Wolfy87/EventEmitter))

Counter (lib/counter) is a modified version of [Countdown](http://codepen.io/averyvery/pen/IvDLB) a very cool flipping train station clock animation that is nearly all CSS.

*   counter.js (main code)
*   underscore.js

## TODO

*   Add a Lamport clock demo
*   Actually use D3 (currently doesn't use D3 or a real anim)
*   Add button to restart message sending (currently requires refresh)

> "Then what is so funny?"   
>  
> "While preparing the turnip surprise, we had a surprise. We came across a turnip that was exactly the same shape as a thingy."
>   
> "Oh, really?"  
>   
> "It was a great big thingy"
>   
> "I found it particularly ironic my lord, because I've got a thingy shaped like a turnip."
>   
