#APRSViewJS

Experimental APRS Client using NodeWebkit.

##Trademarks

APRS is a registered trademark of APRS Software and Bob Bruninga, WB4APR.

###Contributors
Are you a HAM, a developer, and interested in contributing?  Please contact me.  The more developers contributing, the faster we can add features and make this a viable APRS client.

Special Thanks To:
- David Alexander - KD0ULC
- Ross Martin

##Local Dev Setup

###Windows
- Install Node.js (of course)
- Install Yeoman globally: npm install -g yeoman
- Install the Yeoman Node WebKit Generator globally: npm install -g generator-node-webkit
- Install Node WebKit globally: npm install -g nodewebkit
- Install the Grunt CLI globally: npm install -g grunt-cli

###Linux
- Install Node.js (of course) via your favorite method (package manager or source)

To do the following steps you'll have to have root (or sudo) permissions.
- Install Yeoman globally: npm install -g yo
- Install the Yeoman Node WebKit Generator globally: npm install -g generator-node-webkit
- Install Node WebKit globally: npm install -g nodewebkit
- Install the Grunt CLI globally: npm install -g grunt-cli

This is where everything gets fun.  If you were excited, couldn't wait, and tried to run it, most likely you've run into an issue!
Documentation: https://www.exponential.io/blog/install-node-webkit-on-ubuntu-linux

- Now install ghex
- Find where the nw file lives (for me this was /lib/node_modules/nodewebkit/nodewebkit
- # ghex nw
- Expand the window as this makes editing easier.
- Press Ctrl + F to open the Find dialog box.
- Press Tab to move the cursor to the right textbox.
- Type libudev.so.
- Click Find Next.
- You should now see libudev.so.0. Note: **libudev.so will be highlighted in red. Hint: Resize the window if you do not see every character in libudev.so.0.
- Select 0 with your mouse and type 1.
- Select File, click Save.
- Select File, click Exit.


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
- leaflet-plugins
- knockout
- notify.js
- NeDB
- OfflineMap (precache with filereader) https://github.com/tbicr/OfflineMap/blob/master/leaflet_base64fr_precache_site/map.js#L71
-- This was heavily modified