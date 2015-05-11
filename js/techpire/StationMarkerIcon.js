function StationMarkerIcon() {
    console.log("CREATING ICON UTIL");
    
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
        , { key: '&', value: "/AlternateTable/BlackDiamond.gif", name: "" }
        , { key: '\'', value: "/AlternateTable/CrashSite.gif", name: "" }
        , { key: '(', value: "/AlternateTable/Cloudy.gif", name: "" }
        , { key: ')', value: "/AlternateTable/Firenet.gif", name: "" }
        , { key: '*', value: "/AlternateTable/Snow.gif", name: "" }
        , { key: '+', value: "/AlternateTable/Church.gif", name: "" }
        , { key: ',', value: "/AlternateTable/GirlScout.gif", name: "" }
        , { key: '-', value: "/AlternateTable/HouseHF.gif", name: "" }
        , { key: '.', value: "/AlternateTable/Ambiguous.gif", name: "" }
        , { key: '/', value: "/AlternateTable/Waypoint.gif", name: "" }
            // TODO: ADD 802.11 OR OTHER NETWORK NODE ICON (\8)
        , { key: '9', value: "/AlternateTable/GasStation.gif", name: "" }
        , { key: ':', value: "/AlternateTable/Hail.gif", name: "" }
        , { key: ';', value: "/AlternateTable/Park.gif", name: "" }
        , { key: '<', value: "/AlternateTable/WeatherFlag.gif", name: "" }
            // TODO: ADD APRSTT TOUCHTONE (DTMF USERS) ICON (\=)
        , { key: '>', value: "/AlternateTable/Car.gif", name: "" }
        , { key: '?', value: "/AlternateTable/InfoKiosk.gif", name: "" }
        , { key: '@', value: "/AlternateTable/Hurricane.gif", name: "" }
        , { key: 'A', value: "/AlternateTable/OverlayBox.gif", name: "" }
        , { key: 'B', value: "/AlternateTable/BlowingSnow.gif", name: "" }
        , { key: 'C', value: "/AlternateTable/CoastGuard.gif", name: "" }
        , { key: 'D', value: "/AlternateTable/Drizzle.gif", name: "" }
        , { key: 'E', value: "/AlternateTable/Smoke.gif", name: "" }
        , { key: 'F', value: "/AlternateTable/FreezingRain.gif", name: "" }
        , { key: 'G', value: "/AlternateTable/SnowShower.gif", name: "" }
        , { key: 'H', value: "/AlternateTable/Haze.gif", name: "" }
        , { key: 'I', value: "/AlternateTable/RainShower.gif", name: "" }
        , { key: 'J', value: "/AlternateTable/Lightning.gif", name: "" }
        , { key: 'K', value: "/AlternateTable/KenwoodHT.gif", name: "" }
        , { key: 'L', value: "/AlternateTable/Lighthouse.gif", name: "" }
            // TODO: ADD MARS ICON (\M)
        , { key: 'N', value: "/AlternateTable/Bouy.gif", name: "" }
        , { key: 'O', value: "/AlternateTable/Rocket.gif", name: "" }
        , { key: 'P', value: "/AlternateTable/Parking.gif", name: "" }
        , { key: 'Q', value: "/AlternateTable/Earthquake.gif", name: "" }
        , { key: 'R', value: "/AlternateTable/Restaurant.gif", name: "" }
        , { key: 'S', value: "/AlternateTable/Satellite.gif", name: "" }
        , { key: 'T', value: "/AlternateTable/Thunderstorm.gif", name: "" }
        , { key: 'U', value: "/AlternateTable/Sunny.gif", name: "" }
        , { key: 'V', value: "/AlternateTable/VORTAC.gif", name: "" }
        , { key: 'W', value: "/AlternateTable/NWSSite.gif", name: "" }
        , { key: 'X', value: "/AlternateTable/Pharmacy.gif", name: "" }
            // TODO: ADD RADIOS AND DEVICES ICON (\Y)
        , { key: '[', value: "/AlternateTable/Wallcloud.gif", name: "" }
            // TODO: ADD OVERLAYABLE GPS SYMBOL (\\)
        , { key: '^', value: "/AlternateTable/Aircraft.gif", name: "" }
        , { key: '_', value: "/AlternateTable/WXSite.gif", name: "" }
        , { key: '`', value: "/AlternateTable/Rain.gif", name: "" }
        , { key: 'a', value: "/AlternateTable/ARRL.gif", name: "" }
        , { key: 'b', value: "/AlternateTable/BlowingSand.gif", name: "" }
        , { key: 'c', value: "/AlternateTable/CDTriangle.gif", name: "" }
        , { key: 'd', value: "/AlternateTable/DXSpot.gif", name: "" }
        , { key: 'e', value: "/AlternateTable/Sleet.gif", name: "" }
        , { key: 'f', value: "/AlternateTable/FunnelCloud.gif", name: "" }
        , { key: 'g', value: "/AlternateTable/GaleFlags.gif", name: "" }
        , { key: 'h', value: "/AlternateTable/HamStore.gif", name: "" }
        , { key: 'i', value: "/AlternateTable/POIBox.gif", name: "" }
        , { key: 'j', value: "/AlternateTable/WorkZone.gif", name: "" }
        , { key: 'k', value: "/AlternateTable/SpecialVehicle.gif", name: "" }
            // TODO: ADD AREAS ICON (\l)
        , { key: 'm', value: "/AlternateTable/ValueSign.gif", name: "" }
        , { key: 'n', value: "/AlternateTable/OverlayTriangle.gif", name: "" }
        , { key: 'o', value: "/AlternateTable/SmallCircle.gif", name: "" }
        , { key: 'p', value: "/AlternateTable/PartlyCloudy.gif", name: "" }
        , { key: 'r', value: "/AlternateTable/Restrooms.gif", name: "" }
        , { key: 's', value: "/AlternateTable/Boat.gif", name: "" }    // TODO: Make a better graphic
        , { key: 't', value: "/AlternateTable/Tornado.gif", name: "" }
        , { key: 'u', value: "/AlternateTable/Truck.gif", name: "" }
        , { key: 'v', value: "/AlternateTable/Van.gif", name: "" }
        , { key: 'w', value: "/AlternateTable/Flood.gif", name: "" }
        , { key: 'x', value: "/AlternateTable/Obstruction.gif", name: "" }
        , { key: 'y', value: "/AlternateTable/Skywarn.gif", name: "" }
        , { key: 'z', value: "/AlternateTable/Shelter.gif", name: "" }
        , { key: '{', value: "/AlternateTable/Fog.gif", name: "" }
        , { key: '|', value: "/AlternateTable/TNCSwitchStream1.gif", name: "" }
        , { key: '~', value: "/AlternateTable/TNCSwitchStream2.gif", name: "" }
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
}