knockout-es5
============

Knockout.js meets ECMAScript 5 properties. Read the [introduction and basic usage guide](http://blog.stevensanderson.com/2013/05/20/knockout-es5-a-plugin-to-simplify-your-syntax/).

Installation
============

To use in a client-side web application, get a copy of the [`knockout-es5.min.js` file](https://raw.github.com/SteveSanderson/knockout-es5/master/dist/knockout-es5.min.js),
and just add a `<script>` tag referencing at. Be sure to place the reference *after* your reference to Knockout itself:

    <script src='knockout-x.y.z.js'></script>
    <script src='knockout-es5.min.js'></script>

If you are using this on the server in Node.js, just require the file as a module:

    var ko = require('./knockout-es5');
    // Now use ko - it has been enhanced with ES5 features

How to build from source
========================

First, install [NPM](https://npmjs.org/) if you don't already have it. It comes with Node.js.

Second, install Grunt globally, if you don't already have it:

    npm install -g grunt-cli

Third, use NPM to download all the dependencies for this module:

    cd wherever_you_cloned_this_repo
    npm install

Now you can build the package (linting and running tests along the way):

    grunt
    
Or you can just run the linting tool and tests:

    grunt test
    
Or you can make Grunt watch for changes to the sources/specs and auto-rebuild after each change:
    
    grunt watch
    
The browser-ready output files will be dumped at the following locations:

 * `dist/knockout-es5.js`
 * `dist/knockout-es5.min.js`
