#APRSViewJS

Experimental APRS Client using NodeWebkit.

##Trademarks

APRS is a registered trademark of APRS Software and Bob Bruninga, WB4APR.

###Contributors
Are you a HAM, a developer, and interested in contributing?  Please contact me.  The more developers contributing, the faster we can add features and make this a viable APRS client.

Special Thanks To:
- David Alexander - KD0ULC
- Ross Martin

##Latest Update
Honest, I haven't been sitting around letting the project go idle!  The latest round of updates includes support for AGWPE as well as adding support for Objects.  Both JavAPRS-IS and AGWPE connections and parsers are on par with each other.

##Local Dev Setup

###Windows
- Install Node.js (of course)
- Install Yeoman globally: npm install -g yeoman
- Install the Yeoman Node WebKit Generator globally: npm install -g generator-node-webkit
- Install Node WebKit globally: npm install -g nodewebkit
- Install the Grunt CLI globally: npm install -g grunt-cli

##Run the project
Navigate to the project directory

    > nodewebkit app

##Third-Party Libraries - Currently Used
- NodeWebkit
- bacon.js
- jQuery
- jQuery-UI
- leaflet
- leaflet-search-master
- knockout
- notify.js
- NeDB
- path
- OfflineMap (precache with filereader) https://github.com/tbicr/OfflineMap/blob/master/leaflet_base64fr_precache_site/map.js#L71
-- This was heavily modified