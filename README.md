# THIS REPO IS DEAD!!!
Please see: https://github.com/KD0NKS/aprs-view-js for the latest stuff.

# Update
Bear with me here.  The project is out of date, I know!  I can't even get it to recompile.  There were a couple major setbacks when dependencies on this project went dead or were completely pulled.  However, I am working on updating the project to use VueJS and Electron.  The only downside is I have to learn VueJS.  So far the project is broken out into this, js-aprs-is, js-aprs-fap, and js-aprs-engine (very early stages).  I am working on a very intuitive interface to make this easier to use!

If you would like to help, plese fork the VueRewrite branch and create a pull request to that branch.

See js-aprs-fap, js-aprs-is, and js-aprs-engine.  More projects planned including GPS, ULS integration, tnc lib, app engine to tie all components together.  This will allow for independent UIs to be created.  Any help would be much appreciated!

# APRSViewJS

Experimental APRS Client using NW (NodeWebkit).

## Trademarks

APRS is a registered trademark of APRS Software and Bob Bruninga, WB4APR.

### Contributors
Special Thanks To:
* David Alexander - KD0ULC
* Craig Schley - KA0FSP
* Joe Bennett - KA3NAM
* Ross Martin

### Contributing
Are you a HAM, a developer, and interested in contributing?  Please contact me at development@techpire.com.  The more developers contributing, the faster we can add features and make this a viable APRS client.

Have ideas or suggestions on how to improve APRSView-JS?  Please go here https://github.com/KD0NKS/APRSViewJS/issues and mark them as an enhancement.

Still nothing?  You are always more than welcome to test


## Local Dev Setup

* Install Node.js (of course)
* Install NW globally: npm install -g nw
* Install the Grunt CLI globally: npm install -g grunt-cli


## Run the project
## #USING NW

Navigate to the project directory
`> nw`

## Build the Application

* In gulpFile.js
    * Change the version of you want to use.
    * Change your build target ['win', 'osx', 'win32', 'win64', 'osx32', 'osx64', 'linux32', 'linux64']
* Install the dependencies.  These should be ignored and not included in the repository.

    `npm install --save-dev gulp gulp-util node-webkit-builder`

* Run the Build
 
    `gulp nw`

* The executables will be in the /build folder.


## Third-Party Libraries - Currently Used
* [NW/NWJS](http://nwjs.io)
* [bacon.js](https://baconjs.github.io/)
* [jQuery](https://jquery.com/)
* [jQuery-UI](http://jqueryui.com/)
* [Leaflet](http://leafletjs.com/)
* [leaflet-search](https://github.com/stefanocudini/leaflet-search)
* [leaflet-plugins](https://github.com/shramov/leaflet-plugins)
* [KnockoutJS](http://knockoutjs.com/)
* [notify.js](http://notifyjs.com/)
* [NeDB](https://github.com/louischatriot/nedb)
* [OfflineMap (precache with filereader)](https://github.com/tbicr/OfflineMap/blob/master/leaflet_base64fr_precache_site/map.js#L71)
    * This was heavily modified
* [Knockout-ES5](https://github.com/SteveSanderson/knockout-es5)
* [Leaflet.contextmenu](https://github.com/aratcliffe/Leaflet.contextmenu)

## Overlay Sources
* [http://nowcoast.noaa.gov/help/mapservices.shtml?name=mapservices](http://nowcoast.noaa.gov/help/mapservices.shtml?name=mapservices)
* [http://radar.weather.gov/](http://radar.weather.gov/)
