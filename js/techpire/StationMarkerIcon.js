function StationMarkerIcon() {
    var self = this;
    
    self.symbols = [
        { key: '/!', value: "/PrimaryTable/PD.gif", name: "Police Department" }
        , { key: '/#', value: "/PrimaryTable/Digipeater1.gif", name: "Digipeater" }
        , { key: '/$', value: "/PrimaryTable/Phone.gif", name: "Phone" }
        , { key: '/%', value: "/PrimaryTable/DX.gif", name: "DX Station" }
        , { key: '/&', value: "/PrimaryTable/Gateway.gif", name: "Gateway" }
        , { key: '/\'', value: "/PrimaryTable/SmallAircraft.gif", name: "Small Aircraft" }
        , { key: '/(', value: "/PrimaryTable/MobileSatteliteStation.gif", name: "Mobile Sattelite Station" }
        , { key: '/)', value: "/PrimaryTable/Wheelchair.gif", name: "Wheelchair" }
        , { key: '/*', value: "/PrimaryTable/Snowmobile.gif", name: "Snow Mobile" }
        , { key: '/+', value: "/PrimaryTable/RedCross.gif", name: "Red Cross" }
        , { key: '/,', value: "/PrimaryTable/BoyScout.gif", name: "Boy Scouts" }
        , { key: '/-', value: "/PrimaryTable/House.gif", name: "House" }
        , { key: '/.', value: "/PrimaryTable/RedX.gif", name: "X" }
        , { key: '//', value: "/PrimaryTable/RedDot.gif", name: "Dot" }
        , { key: '/0', value: "/PrimaryTable/Circle.gif", name: "Circle 0" }
        , { key: '/1', value: "/PrimaryTable/Circle1.gif", name: "Circle 1" }
        , { key: '/2', value: "/PrimaryTable/Circle2.gif", name: "Circle 2" }
        , { key: '/3', value: "/PrimaryTable/Circle3.gif", name: "Circle 3" }
        , { key: '/4', value: "/PrimaryTable/Circle4.gif", name: "Circle 4" }
        , { key: '/5', value: "/PrimaryTable/Circle5.gif", name: "Circle 5" }
        , { key: '/6', value: "/PrimaryTable/Circle6.gif", name: "Circle 6" }
        , { key: '/7', value: "/PrimaryTable/Circle7.gif", name: "Circle 7" }
        , { key: '/8', value: "/PrimaryTable/Circle8.gif", name: "Circle 8" }
        , { key: '/9', value: "/PrimaryTable/Circle9.gif", name: "Circle 9" }
        , { key: '/:', value: "/PrimaryTable/Fire.gif", name: "Fire" }
        , { key: '/;', value: "/PrimaryTable/Campground.gif", name: "Campground" }
        , { key: '/<', value: "/PrimaryTable/Motorcycle.gif", name: "Motorcycle" }
        , { key: '/=', value: "/PrimaryTable/TrainEngine.gif", name: "Train" }
        , { key: '/>', value: "/PrimaryTable/Car.gif", name: "Car" }
        , { key: '/?', value: "/PrimaryTable/FileServer.gif", name: "File Server" }
        , { key: '/@', value: "/PrimaryTable/HurricaneFuturePrediction.gif", name: "Hurricane Future Prediction" }
        , { key: '/A', value: "/PrimaryTable/AidStation.gif", name: "Aid Station" }
        , { key: '/B', value: "/PrimaryTable/BullitenSystem.gif", name: "Bulliten System" }
        , { key: '/C', value: "/PrimaryTable/Canoe.gif", name: "Canoe" }
        , { key: '/E', value: "/PrimaryTable/Eye.gif", name: "Eye" }
        , { key: '/F', value: "/PrimaryTable/FarmEquipment.gif", name: "Farm Equipment" }
        , { key: '/G', value: "/PrimaryTable/GridSquare.gif", name: "Grid Square" }
        , { key: '/H', value: "/PrimaryTable/Hotel.gif", name: "Hotel" }
        , { key: '/I', value: "/PrimaryTable/TCPIPOnAirNetwork.gif", name: "TCPIP On Air Network" }
        , { key: '/K', value: "/PrimaryTable/School.gif", name: "School" }
        , { key: '/L', value: "/PrimaryTable/PCUser.gif", name: "PC User" }
        , { key: '/M', value: "/PrimaryTable/MacAprs.gif", name: "Mac APRS" }
        , { key: '/N', value: "/PrimaryTable/NationalTrafficStation.gif", name: "National Traffic Station" }
        , { key: '/O', value: "/PrimaryTable/Balloon.gif", name: "Balloon" }
        , { key: '/P', value: "/PrimaryTable/Police.gif", name: "Pilice" }
        , { key: '/Q', value: "/PrimaryTable/Quake.gif", name: "Earthquake" } // TBD?
        , { key: '/R', value: "/PrimaryTable/RV.gif", name: "RV" }
        , { key: '/S', value: "/PrimaryTable/Shuttle.gif", name: "Shuttle" }
        , { key: '/T', value: "/PrimaryTable/SSTV.gif", name: "SSTV" }
        , { key: '/U', value: "/PrimaryTable/Bus.gif", name: "Bus" }
        , { key: '/V', value: "/PrimaryTable/ATV.gif", name: "ATV" }    // TODO: Find out what this really stands for
        , { key: '/W', value: "/PrimaryTable/NationalWeatherService.gif", name: "NWS" }
        , { key: '/X', value: "/PrimaryTable/Helicopter.gif", name: "Helicopter" }
        , { key: '/Y', value: "/PrimaryTable/Yacht.gif", name: "Yacht" }
        , { key: '/Z', value: "/PrimaryTable/WinAprs.gif", name: "Win APRS" }
        , { key: '/[', value: "/PrimaryTable/Person.gif", name: "Person" }
        , { key: '/\\', value: "/PrimaryTable/DFStation.gif", name: "DF Station" }
        , { key: '/]', value: "/PrimaryTable/PostOffice.gif", name: "Post Office" }
        , { key: '/^', value: "/PrimaryTable/LargeAircraft.gif", name: "Large Aircraft" }
        , { key: '/_', value: "/PrimaryTable/WeatherStation.gif", name: "Weather Station" }
        , { key: '/`', value: "/PrimaryTable/DishAntenna.gif", name: "Dish Antenna" }
        , { key: '/a', value: "/PrimaryTable/Ambulance.gif", name: "Ambulance" }
        , { key: '/b', value: "/PrimaryTable/Bicycle.gif", name: "Bicycle" }
        , { key: '/c', value: "/PrimaryTable/IncidentCommandPost.gif", name: "Incident Command Post" }
        , { key: '/d', value: "/PrimaryTable/Firehouse.gif", name: "Firehouse" }
        , { key: '/e', value: "/PrimaryTable/Horse.gif", name: "Horse" }
        , { key: '/f', value: "/PrimaryTable/FireTruck.gif", name: "Fire Truck" }
        , { key: '/g', value: "/PrimaryTable/Glider.gif", name: "Glider" }
        , { key: '/h', value: "/PrimaryTable/Hospital.gif", name: "Hospital" }
        , { key: '/i', value: "/PrimaryTable/IslandsOnTheAir.gif", name: "Islands on the Air" }
        , { key: '/j', value: "/PrimaryTable/Jeep.gif", name: "Jeep" }
        , { key: '/k', value: "/PrimaryTable/Truck.gif", name: "Truck" }
        , { key: '/l', value: "/PrimaryTable/Laptop.gif", name: "Laptop" }
        , { key: '/m', value: "/PrimaryTable/MicERepeater.gif", name: "Mic E Repeater" }
        , { key: '/n', value: "/PrimaryTable/Node.gif", name: "Node" }
        , { key: '/o', value: "/PrimaryTable/EOC.gif", name: "EOC" }
        , { key: '/p', value: "/PrimaryTable/Dog.gif", name: "Dog" }
        , { key: '/q', value: "/PrimaryTable/GridSquare2.gif", name: "Gridsquare" }
        , { key: '/r', value: "/PrimaryTable/Repeater.gif", name: "Repeater" }
        , { key: '/s', value: "/PrimaryTable/Boat.gif", name: "Boat" }
        , { key: '/t', value: "/PrimaryTable/TruckStop.gif", name: "Truck Stop" }
        , { key: '/u', value: "/PrimaryTable/SemiTruck.gif", name: "Semi Truck" }
        , { key: '/v', value: "/PrimaryTable/Van.gif", name: "Van" }
        , { key: '/w', value: "/PrimaryTable/WaterStation.gif", name: "Water Station" }
        , { key: '/x', value: "/PrimaryTable/Xastir.gif", name: "Xastir" }
        , { key: '/y', value: "/PrimaryTable/HouseWithYagi.gif", name: "House with Yagi" }
        , { key: '/z', value: "/PrimaryTable/TBD.gif", name: "TBD" }
        , { key: '/|', value: "/PrimaryTable/TNCStreamSwitch.gif", name: "TNC Strem Switch" }
        , { key: '/~', value: "/PrimaryTable/TNCStreamSwitch1.gif", name: "TNC Strem Switch" }
        , { key: '!', value: "/AlternateTable/Emergency.gif", name: "Emergency" }
        , { key: '#', value: "/AlternateTable/Digipeater.gif", name: "Digipeater" }
        , { key: '$', value: "/AlternateTable/Bank.gif", name: "Bank" }
            // TODO: Create PowerPlant icon '\\%', value: "/AlternateTable/.gif"
        , { key: '&', value: "/AlternateTable/BlackDiamond.gif", name: "Black Diamond" }
        , { key: '\'', value: "/AlternateTable/CrashSite.gif", name: "Crash Site" }
        , { key: '(', value: "/AlternateTable/Cloudy.gif", name: "Cloudy" }
        , { key: ')', value: "/AlternateTable/Firenet.gif", name: "Firenet" }
        , { key: '*', value: "/AlternateTable/Snow.gif", name: "Snow" }
        , { key: '+', value: "/AlternateTable/Church.gif", name: "Church" }
        , { key: ',', value: "/AlternateTable/GirlScout.gif", name: "Girl Scout" }
        , { key: '-', value: "/AlternateTable/HouseHF.gif", name: "House HF" }
        , { key: '.', value: "/AlternateTable/Ambiguous.gif", name: "Ambiguous" }
        , { key: '/', value: "/AlternateTable/Waypoint.gif", name: "Waypoint" }
            // TODO: ADD 802.11 OR OTHER NETWORK NODE ICON (\8)
        , { key: '9', value: "/AlternateTable/GasStation.gif", name: "Gas Station" }
        , { key: ':', value: "/AlternateTable/Hail.gif", name: "Hail" }
        , { key: ';', value: "/AlternateTable/Park.gif", name: "Park" }
        , { key: '<', value: "/AlternateTable/WeatherFlag.gif", name: "Weather Flag" }
            // TODO: ADD APRSTT TOUCHTONE (DTMF USERS) ICON (\=)
        , { key: '>', value: "/AlternateTable/Car.gif", name: "Car" }
        , { key: '?', value: "/AlternateTable/InfoKiosk.gif", name: "Info Kiosk" }
        , { key: '@', value: "/AlternateTable/Hurricane.gif", name: "Hurricane" }
        , { key: 'A', value: "/AlternateTable/OverlayBox.gif", name: "Overlay Box" }
        , { key: 'B', value: "/AlternateTable/BlowingSnow.gif", name: "Blowing Snow" }
        , { key: 'C', value: "/AlternateTable/CoastGuard.gif", name: "Coast Guard" }
        , { key: 'D', value: "/AlternateTable/Drizzle.gif", name: "Drizzle" }
        , { key: 'E', value: "/AlternateTable/Smoke.gif", name: "Smoke" }
        , { key: 'F', value: "/AlternateTable/FreezingRain.gif", name: "Freezing Rain" }
        , { key: 'G', value: "/AlternateTable/SnowShower.gif", name: "Snow Shower" }
        , { key: 'H', value: "/AlternateTable/Haze.gif", name: "Haze" }
        , { key: 'I', value: "/AlternateTable/RainShower.gif", name: "Rain Shower" }
        , { key: 'J', value: "/AlternateTable/Lightning.gif", name: "Lightning" }
        , { key: 'K', value: "/AlternateTable/KenwoodHT.gif", name: "Kenwood HT" }
        , { key: 'L', value: "/AlternateTable/Lighthouse.gif", name: "Lighthouse" }
            // TODO: ADD MARS ICON (\M)
        , { key: 'N', value: "/AlternateTable/Bouy.gif", name: "Bouy" }
        , { key: 'O', value: "/AlternateTable/Rocket.gif", name: "Rocket" }
        , { key: 'P', value: "/AlternateTable/Parking.gif", name: "Parking" }
        , { key: 'Q', value: "/AlternateTable/Earthquake.gif", name: "Earthquake" }
        , { key: 'R', value: "/AlternateTable/Restaurant.gif", name: "Restaurant" }
        , { key: 'S', value: "/AlternateTable/Satellite.gif", name: "Satellite" }
        , { key: 'T', value: "/AlternateTable/Thunderstorm.gif", name: "Thunderstorm" }
        , { key: 'U', value: "/AlternateTable/Sunny.gif", name: "Sunny" }
        , { key: 'V', value: "/AlternateTable/VORTAC.gif", name: "VORTAC" }
        , { key: 'W', value: "/AlternateTable/NWSSite.gif", name: "NWS Site" }
        , { key: 'X', value: "/AlternateTable/Pharmacy.gif", name: "Pharmacy" }
            // TODO: ADD RADIOS AND DEVICES ICON (\Y)
        , { key: '[', value: "/AlternateTable/Wallcloud.gif", name: "Wallcloud" }
            // TODO: ADD OVERLAYABLE GPS SYMBOL (\\)
        , { key: '^', value: "/AlternateTable/Aircraft.gif", name: "Aircraft" }
        , { key: '_', value: "/AlternateTable/WXSite.gif", name: "WX Site" }
        , { key: '`', value: "/AlternateTable/Rain.gif", name: "Rain" }
        , { key: 'a', value: "/AlternateTable/ARRL.gif", name: "ARRL" }
        , { key: 'b', value: "/AlternateTable/BlowingSand.gif", name: "Blowing Sand" }
        , { key: 'c', value: "/AlternateTable/CDTriangle.gif", name: "CD Triangle" }
        , { key: 'd', value: "/AlternateTable/DXSpot.gif", name: "DX Spot" }
        , { key: 'e', value: "/AlternateTable/Sleet.gif", name: "Sleet" }
        , { key: 'f', value: "/AlternateTable/FunnelCloud.gif", name: "Funnel Cloud" }
        , { key: 'g', value: "/AlternateTable/GaleFlags.gif", name: "Gale Flags" }
        , { key: 'h', value: "/AlternateTable/HamStore.gif", name: "Ham Store" }
        , { key: 'i', value: "/AlternateTable/POIBox.gif", name: "POI Box" }
        , { key: 'j', value: "/AlternateTable/WorkZone.gif", name: "Work Zone" }
        , { key: 'k', value: "/AlternateTable/SpecialVehicle.gif", name: "Special Vehicle" }
            // TODO: ADD AREAS ICON (\l)
        , { key: 'm', value: "/AlternateTable/ValueSign.gif", name: "Value Sign" }
        , { key: 'n', value: "/AlternateTable/OverlayTriangle.gif", name: "Overlay Triangle" }
        , { key: 'o', value: "/AlternateTable/SmallCircle.gif", name: "Small Circle" }
        , { key: 'p', value: "/AlternateTable/PartlyCloudy.gif", name: "Partly Cloudy" }
        , { key: 'r', value: "/AlternateTable/Restrooms.gif", name: "Restrooms" }
        , { key: 's', value: "/AlternateTable/Boat.gif", name: "Boat" }    // TODO: Make a better graphic
        , { key: 't', value: "/AlternateTable/Tornado.gif", name: "Tornado" }
        , { key: 'u', value: "/AlternateTable/Truck.gif", name: "Truck" }
        , { key: 'v', value: "/AlternateTable/Van.gif", name: "Van" }
        , { key: 'w', value: "/AlternateTable/Flood.gif", name: "Flood" }
        , { key: 'x', value: "/AlternateTable/Obstruction.gif", name: "Obstruction" }
        , { key: 'y', value: "/AlternateTable/Skywarn.gif", name: "Skywarn" }
        , { key: 'z', value: "/AlternateTable/Shelter.gif", name: "Shelter" }
        , { key: '{', value: "/AlternateTable/Fog.gif", name: "Fog" }
        , { key: '|', value: "/AlternateTable/TNCSwitchStream1.gif", name: "TNC Switch Stream 1" }
        , { key: '~', value: "/AlternateTable/TNCSwitchStream2.gif", name: "TNC Switch Stream 2" }
    ];
    
    self.overlays = [
        { key: '0', value: "/Overlay/Zero.gif" }
        , { key: '1', value: "/Overlay/One.gif" }
        , { key: '2', value: "/Overlay/Two.gif" }
        , { key: '3', value: "/Overlay/Three.gif" }
        , { key: '4', value: "/Overlay/Four.gif" }
        , { key: '5', value: "/Overlay/Five.gif" }
        , { key: '6', value: "/Overlay/Six.gif" }
        , { key: '7', value: "/Overlay/Seven.gif" }
        , { key: '8', value: "/Overlay/Eight.gif" }
        , { key: '9', value: "/Overlay/Nine.gif" }
        , { key: 'a', value: "/Overlay/la.gif" }
        , { key: 'b', value: "/Overlay/lb.gif" }
        , { key: 'c', value: "/Overlay/lc.gif" }
        , { key: 'd', value: "/Overlay/ld.gif" }
        , { key: 'e', value: "/Overlay/le.gif" }
        , { key: 'f', value: "/Overlay/lf.gif" }
        , { key: 'g', value: "/Overlay/lg.gif" }
        , { key: 'h', value: "/Overlay/lh.gif" }
        , { key: 'i', value: "/Overlay/li.gif" }
        , { key: 'j', value: "/Overlay/lj.gif" }
        , { key: 'k', value: "/Overlay/lk.gif" }
        , { key: 'l', value: "/Overlay/ll.gif" }
        , { key: 'm', value: "/Overlay/lm.gif" }
        , { key: 'n', value: "/Overlay/ln.gif" }
        , { key: 'o', value: "/Overlay/lo.gif" }
        , { key: 'p', value: "/Overlay/lp.gif" }
        , { key: 'q', value: "/Overlay/lq.gif" }
        , { key: 'r', value: "/Overlay/lr.gif" }
        , { key: 's', value: "/Overlay/ls.gif" }
        , { key: 't', value: "/Overlay/lt.gif" }
        , { key: 'u', value: "/Overlay/lu.gif" }
        , { key: 'v', value: "/Overlay/lv.gif" }
        , { key: 'w', value: "/Overlay/lw.gif" }
        , { key: 'x', value: "/Overlay/lx.gif" }
        , { key: 'y', value: "/Overlay/ly.gif" }
        , { key: 'z', value: "/Overlay/lz.gif" }
        , { key: 'A', value: "/Overlay/A.gif" }
        , { key: 'B', value: "/Overlay/B.gif" }
        , { key: 'C', value: "/Overlay/C.gif" }
        , { key: 'D', value: "/Overlay/D.gif" }
        , { key: 'E', value: "/Overlay/E.gif" }
        , { key: 'F', value: "/Overlay/F.gif" }
        , { key: 'G', value: "/Overlay/G.gif" }
        , { key: 'H', value: "/Overlay/H.gif" }
        , { key: 'I', value: "/Overlay/I.gif" }
        , { key: 'J', value: "/Overlay/J.gif" }
        , { key: 'K', value: "/Overlay/K.gif" }
        , { key: 'L', value: "/Overlay/L.gif" }
        , { key: 'M', value: "/Overlay/M.gif" }
        , { key: 'N', value: "/Overlay/N.gif" }
        , { key: 'O', value: "/Overlay/O.gif" }
        , { key: 'P', value: "/Overlay/P.gif" }
        , { key: 'Q', value: "/Overlay/Q.gif" }
        , { key: 'R', value: "/Overlay/R.gif" }
        , { key: 'S', value: "/Overlay/S.gif" }
        , { key: 'T', value: "/Overlay/T.gif" }
        , { key: 'U', value: "/Overlay/U.gif" }
        , { key: 'V', value: "/Overlay/V.gif" }
        , { key: 'W', value: "/Overlay/W.gif" }
        , { key: 'X', value: "/Overlay/X.gif" }
        , { key: 'Y', value: "/Overlay/Y.gif" }
        , { key: 'Z', value: "/Overlay/Z.gif" }
        , { key: '!', value: "/Overlay/Exclamation.gif" }
        , { key: '"', value: "/Overlay/dQuote.gif" }
        , { key: '#', value: "/Overlay/hash.gif" }
        , { key: '$', value: "/Overlay/dollar.gif" }
        , { key: '%', value: "/Overlay/pct.gif" }
        , { key: '&', value: "/Overlay/amp.gif" }
        , { key: '\'', value: "/Overlay/sQuote.gif" }
        , { key: '(', value: "/Overlay/oParen.gif" }
        , { key: ')', value: "/Overlay/cParen.gif" }
        , { key: '*', value: "/Overlay/asterisk.gif" }
        , { key: '+', value: "/Overlay/plus.gif" }
        , { key: ',', value: "/Overlay/comma.gif" }
        , { key: '-', value: "/Overlay/dash.gif" }
        , { key: '.', value: "/Overlay/period.gif" }
        , { key: '/', value: "/Overlay/fSlash.gif" }
        , { key: ':', value: "/Overlay/colon.gif" }
        , { key: ';', value: "/Overlay/sColon.gif" }
        , { key: '<', value: "/Overlay/oaBracket.gif" }
        , { key: '=', value: "/Overlay/equal.gif" }
        , { key: '>', value: "/Overlay/caBracket.gif" }
        , { key: '?', value: "/Overlay/question.gif" }
        , { key: '@', value: "/Overlay/at.gif" }
        , { key: '[', value: "/Overlay/osBracket.gif" }
        , { key: '\\', value: "/Overlay/bSlash.gif" }
        , { key: ']', value: "/Overlay/csBracket.gif" }
        , { key: '^', value: "/Overlay/caret.gif" }
        , { key: '_', value: "/Overlay/underscore.gif" }
        , { key: '`', value: "/Overlay/grave.gif" }
        , { key: '{', value: "/Overlay/oBracket.gif" }
        , { key: '|', value: "/Overlay/pipe.gif" }
        , { key: '}', value: "/Overlay/cBracket.gif" }
        , { key: '~', value: "/Overlay/tilde.gif" }
    ];
    
    self.getSymbolPath = function(symbolTableId, symbolCode) {
        var retVal = self.symbols.filter(function(s) {
            return s.key == (symbolTableId + symbolCode) || s.key == symbolCode;
        });
        
        if(retVal && retVal.length > 0) {
            return retVal[0].value;
        } else {
            return "/Crosshair.gif";
        }
    };
    
    self.getPrimaryIcons = function() {
        return self.symbols.filter(function(s) {
            return s.key.charAt(0) == ('/');
        });
    };
    
    self.getOverlayPath = function(symbolTableId, symbolCode) {
        if(symbolTableId != '/') {
            var retVal = self.overlays.filter(function(c) {
                return c.key == symbolTableId;
            });
            
            if(retVal.length > 0) {
                return retVal[0].value;
            }
        }
        
        return null;
    };
    
    self.GetIconLayers = function(symbolTableId, symbolCode) {
        var retVal = [];
        var overlay = self.getOverlayPath(symbolTableId, symbolCode);
        
        if(overlay != null) {
            retVal[0] = overlay;
            retVal[1] = self.getSymbolPath(symbolTableId, symbolCode);
        } else {
            retVal[0] = self.getSymbolPath(symbolTableId, symbolCode);
        }
        
        return retVal;
    }
}