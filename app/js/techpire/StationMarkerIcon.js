function getSymbolPath(symbolTableId, symbolCode) {
	if(symbolTableId == '/') {
		if(symbolCode == '!') {
			return "/PrimaryTable/PD.gif";
		} else if(symbolCode == '#') {
			return "/PrimaryTable/Digipeater1.gif";
		} else if(symbolCode == '$') {
			return "/PrimaryTable/Phone.gif";
		} else if(symbolCode == '%') {
			return "/PrimaryTable/DX.gif";
		} else if(symbolCode == '&') {
			return "/PrimaryTable/Gateway.gif";
		} else if(symbolCode == '\'') {
			return "/PrimaryTable/SmallAircraft.gif";
		} else if(symbolCode == '(') {
			return "/PrimaryTable/MobileSatteliteStation.gif";
		} else if(symbolCode == ')') {
			return "/PrimaryTable/Wheelchair.gif";
		} else if(symbolCode == '*') {
			return "/PrimaryTable/SnowMobile.gif";
		} else if(symbolCode == '+') {
			return "/PrimaryTable/RedCross.gif";
		} else if(symbolCode == ',') {
			return "/PrimaryTable/BoyScout.gif";
		} else if(symbolCode == '-') {
			return "/PrimaryTable/House.gif";
		} else if(symbolCode == '.') {
			return "/PrimaryTable/RedX.gif";
		} else if(symbolCode == '/') {
			return "/PrimaryTable/RedDot.gif";
		} else if(symbolCode == '0') {
			return "/PrimaryTable/Circle.gif";
		} else if(symbolCode == '1') {
			return "/PrimaryTable/Circle1.gif";
		} else if(symbolCode == '2') {
			return "/PrimaryTable/Circle2.gif";
		} else if(symbolCode == '3') {
			return "/PrimaryTable/Circle3.gif";
		} else if(symbolCode == '4') {
			return "/PrimaryTable/Circle4.gif";
		} else if(symbolCode == '5') {
			return "/PrimaryTable/Circle5.gif";
		} else if(symbolCode == '6') {
			return "/PrimaryTable/Circle6.gif";
		} else if(symbolCode == '7') {
			return "/PrimaryTable/Circle7.gif";
		} else if(symbolCode == '8') {
			return "/PrimaryTable/Circle8.gif";
		} else if(symbolCode == '9') {
			return "/PrimaryTable/Circle9.gif";
		} else if(symbolCode == ':') {
			return "/PrimaryTable/Fire.gif";
		} else if(symbolCode == ';') {
			return "/PrimaryTable/Campground.gif";
		} else if(symbolCode == '<') {
			return "/PrimaryTable/Motorcycle.gif";
		} else if(symbolCode == '=') {
			return "/PrimaryTable/TrainEngine.gif";
		} else if(symbolCode == '>') {
			return "/PrimaryTable/Car.gif";
		} else if(symbolCode == '?') {
			return "/PrimaryTable/FileServer.gif";
		} else if(symbolCode == '@') {
			return "/PrimaryTable/HurricaneFuturePrediction.gif";
		} else if(symbolCode == 'A') {
			return "/PrimaryTable/AidStation.gif";
		} else if(symbolCode == 'B') {
			return "/PrimaryTable/BullitenSystem.gif";
		} else if(symbolCode == 'C') {
			return "/PrimaryTable/Canoe.gif";
		} else if(symbolCode == 'E') {
			return "/PrimaryTable/Eye.gif";
		} else if(symbolCode == 'F') {
			return "/PrimaryTable/FarmEquipment.gif";
		} else if(symbolCode == 'G') {
			return "/PrimaryTable/GridSquare.gif";
		} else if(symbolCode == 'H') {
			return "/PrimaryTable/Hotel.gif";
		} else if(symbolCode == 'I') {
			return "/PrimaryTable/TCPIPOnAirNetwork.gif";
		} else if(symbolCode == 'K') {
			return "/PrimaryTable/School.gif";
		} else if(symbolCode == 'L') {
			return "/PrimaryTable/PCUser.gif";
		} else if(symbolCode == 'M') {
			return "/PrimaryTable/MacAprs.gif";
		} else if(symbolCode == 'N') {
			return "/PrimaryTable/NationalTrafficStation.gif";
		} else if(symbolCode == 'O') {
			return "/PrimaryTable/Balloon.gif";
		} else if(symbolCode == 'P') {
			return "/PrimaryTable/Police.gif";
		} else if(symbolCode == 'Q') {
			return "/PrimaryTable/Quake.gif"; // TBD?
		} else if(symbolCode == 'R') {
			return "/PrimaryTable/RV.gif";
		} else if(symbolCode == 'S') {
			return "/PrimaryTable/Shuttle.gif";
		} else if(symbolCode == 'T') {
			return "/PrimaryTable/SSTV.gif";
		} else if(symbolCode == 'U') {
			return "/PrimaryTable/Bus.gif";
		} else if(symbolCode == 'V') {
			return "/PrimaryTable/ATV.gif";    // TODO: Find out what this really stands for
		} else if(symbolCode == 'W') {
			return "/PrimaryTable/NationalWeatherService.gif";
		} else if(symbolCode == 'X') {
			return "/PrimaryTable/Helicopter.gif";
		} else if(symbolCode == 'Y') {
			return "/PrimaryTable/Yacht.gif";
		} else if(symbolCode == 'Z') {
			return "/PrimaryTable/WinAprs.gif";
		} else if(symbolCode == '[') {
			return "/PrimaryTable/Person.gif";
		} else if(symbolCode == '\\') {
			return "/PrimaryTable/DFStation.gif";
		} else if(symbolCode == ']') {
			return "/PrimaryTable/PostOffice.gif";
		} else if(symbolCode == '^') {
			return "/PrimaryTable/LargeAircraft.gif";
		} else if(symbolCode == '_') {
			return "/PrimaryTable/WeatherStation.gif";
		} else if(symbolCode == '`') {
			return "/PrimaryTable/DishAntenna.gif";
		} else if(symbolCode == 'a') {
			return "/PrimaryTable/Ambulance.gif";
		} else if(symbolCode == 'b') {
			return "/PrimaryTable/Bicycle.gif";
		} else if(symbolCode == 'c') {
			return "/PrimaryTable/IncidentCommandPost.gif";
		} else if(symbolCode == 'd') {
			return "/PrimaryTable/Firehouse.gif";
		} else if(symbolCode == 'e') {
			return "/PrimaryTable/Horse.gif";
		} else if(symbolCode == 'f') {
			return "/PrimaryTable/FireTruck.gif";
		} else if(symbolCode == 'g') {
			return "/PrimaryTable/Glider.gif";
		} else if(symbolCode == 'h') {
			return "/PrimaryTable/Hospital.gif";
		} else if(symbolCode == 'i') {
			return "/PrimaryTable/IslandsOnTheAir.gif";
		} else if(symbolCode == 'j') {
			return "/PrimaryTable/Jeep.gif";
		} else if(symbolCode == 'k') {
			return "/PrimaryTable/Truck.gif";
		} else if(symbolCode == 'l') {
			return "/PrimaryTable/Laptop.gif";
		} else if(symbolCode == 'm') {
			return "/PrimaryTable/MicERepeater.gif";
		} else if(symbolCode == 'n') {
			return "/PrimaryTable/Node.gif";
		} else if(symbolCode == 'o') {
			return "/PrimaryTable/EOC.gif";
		} else if(symbolCode == 'p') {
			return "/PrimaryTable/Dog.gif";
		} else if(symbolCode == 'q') {
			return "/PrimaryTable/GridSquare2.gif";
		} else if(symbolCode == 'r') {
			return "/PrimaryTable/Repeater.gif";
		} else if(symbolCode == 's') {
			return "/PrimaryTable/Boat.gif";
		} else if(symbolCode == 't') {
			return "/PrimaryTable/TruckStop.gif";
		} else if(symbolCode == 'u') {
			return "/PrimaryTable/SemiTruck.gif";
		} else if(symbolCode == 'v') {
			return "/PrimaryTable/Van.gif";
		} else if(symbolCode == 'w') {
			return "/PrimaryTable/WaterStation.gif";
		} else if(symbolCode == 'x') {
			return "/PrimaryTable/Xastir.gif";
		} else if(symbolCode == 'y') {
			return "/PrimaryTable/HouseWithYagi.gif";
		} else if(symbolCode == 'z') {
			return "/PrimaryTable/TBD.gif";
		} else if(symbolCode == '|') {
			return "/PrimaryTable/TNCSwitchStream.gif";
		} else if(symbolCode == '~') {
			return "/PrimaryTable/TNCSwitchStream1.gif";
		} else {
			return "/Crosshair.gif";
		}
	} else {
		if(symbolCode == '!') {
			return "/AlternateTable/Emergency.gif";
		} else if(symbolCode == '#') {
			return "/AlternateTable/Digipeater.gif";
		} else if(symbolCode == '$') {
			return "/AlternateTable/Bank.gif";
		}

		/*
		TODO: Create PowerPlant icon
		else if(symbolCode == '%') {
			symbolIconPath = "/AlternateTable/.gif";
		}
		*/
		else if(symbolCode == '&') {
			return "/AlternateTable/BlackDiamond.gif";
		} else if(symbolCode == '\'') {
			return "/AlternateTable/CrashSite.gif";
		} else if(symbolCode == '(') {
			return "/AlternateTable/Cloudy.gif";
		} else if(symbolCode == ')') {
			return "/AlternateTable/Firenet.gif";
		} else if(symbolCode == '*') {
			return "/AlternateTable/Snow.gif";
		} else if(symbolCode == '+') {
			return "/AlternateTable/Church.gif";
		} else if(symbolCode == ',') {
			return "/AlternateTable/GirlScout.gif";
		} else if(symbolCode == '-') {
			return "/AlternateTable/HouseHF.gif";
		} else if(symbolCode == '.') {
			return "/AlternateTable/Ambiguous.gif";
		} else if(symbolCode == '/') {
			return "/AlternateTable/Waypoint.gif";
		}

		// TODO: ADD 802.11 OR OTHER NETWORK NODE ICON (\8)
		else if(symbolCode == '9') {
			return "/AlternateTable/GasStation.gif";
		} else if(symbolCode == ':') {
			return "/AlternateTable/Hail.gif";
		} else if(symbolCode == ';') {
			return "/AlternateTable/Park.gif";
		} else if(symbolCode == '<') {
			return "/AlternateTable/WeatherFlag.gif";
		}

		// TODO: ADD APRSTT TOUCHTONE (DTMF USERS) ICON (\=)
		else if(symbolCode == '>') {
			return "/AlternateTable/Car.gif";
		} else if(symbolCode == '?') {
			return "/AlternateTable/InfoKiosk.gif";
		} else if(symbolCode == '@') {
			return "/AlternateTable/Hurricane.gif";
		} else if(symbolCode == 'A') {
			return "/AlternateTable/OverlayBox.gif";
		} else if(symbolCode == 'B') {
			return "/AlternateTable/BlowingSnow.gif";
		} else if(symbolCode == 'C') {
			return "/AlternateTable/CoastGuard.gif";
		} else if(symbolCode == 'D') {
			return "/AlternateTable/Drizzle.gif";
		} else if(symbolCode == 'E') {
			return "/AlternateTable/Smoke.gif";
		} else if(symbolCode == 'F') {
			return "/AlternateTable/FreezingRain.gif";
		} else if(symbolCode == 'G') {
			return "/AlternateTable/SnowShower.gif";
		} else if(symbolCode == 'H') {
			return "/AlternateTable/Haze.gif";
		} else if(symbolCode == 'I') {
			return "/AlternateTable/RainShower.gif";
		} else if(symbolCode == 'J') {
			return "/AlternateTable/Lightning.gif";
		} else if(symbolCode == 'K') {
			return "/AlternateTable/KenwoodHT.gif";
		} else if(symbolCode == 'L') {
			return "/AlternateTable/Lighthouse.gif";
		}

		// TODO: ADD MARS ICON (\M)
		else if(symbolCode == 'N') {
			return "/AlternateTable/Bouy.gif";
		} else if(symbolCode == 'O') {
			return "/AlternateTable/Rocket.gif";
		} else if(symbolCode == 'P') {
			return "/AlternateTable/Parking.gif";
		} else if(symbolCode == 'Q') {
			return "/AlternateTable/Earthquake.gif";
		} else if(symbolCode == 'R') {
			return "/AlternateTable/Restaurant.gif";
		} else if(symbolCode == 'S') {
			return "/AlternateTable/Satellite.gif";
		} else if(symbolCode == 'T') {
			return "/AlternateTable/Thunderstorm.gif";
		} else if(symbolCode == 'U') {
			return "/AlternateTable/Sunny.gif";
		} else if(symbolCode == 'V') {
			return "/AlternateTable/VORTAC.gif";
		} else if(symbolCode == 'W') {
			return "/AlternateTable/NWSSite.gif";
		} else if(symbolCode == 'X') {
			return "/AlternateTable/Pharmacy.gif";
		}

		// TODO: ADD RADIOS AND DEVICES ICON (\Y)
		else if(symbolCode == '[') {
			return "/AlternateTable/Wallcloud.gif";
		}

		// TODO: ADD OVERLAYABLE GPS SYMBOL (\\)
		else if(symbolCode == '^') {
			return "/AlternateTable/Aircraft.gif";
		} else if(symbolCode == '_') {
			return "/AlternateTable/WXSite.gif";
		} else if(symbolCode == '`') {
			return "/AlternateTable/Rain.gif";
		} else if(symbolCode == 'a') {
			return "/AlternateTable/ARRL.gif";
		} else if(symbolCode == 'b') {
			return "/AlternateTable/BlowingSand.gif";
		} else if(symbolCode == 'c') {
			return "/AlternateTable/CDTriangle.gif";
		} else if(symbolCode == 'd') {
			return "/AlternateTable/DXSpot.gif";
		} else if(symbolCode == 'e') {
			return "/AlternateTable/Sleet.gif";
		} else if(symbolCode == 'f') {
			return "/AlternateTable/FunnelCloud.gif";
		} else if(symbolCode == 'g') {
			return "/AlternateTable/GaleFlags.gif";
		} else if(symbolCode == 'h') {
			return "/AlternateTable/HamStore.gif";
		} else if(symbolCode == 'i') {
			return "/AlternateTable/POIBox.gif";
		} else if(symbolCode == 'j') {
			return "/AlternateTable/WorkZone.gif";
		} else if(symbolCode == 'k') {
			return "/AlternateTable/SpecialVehicle.gif";
		}

		// TODO: ADD AREAS ICON (\l)
		else if(symbolCode == 'm') {
			return "/AlternateTable/ValueSign.gif";
		} else if(symbolCode == 'n') {
			return "/AlternateTable/OverlayTriangle.gif";
		} else if(symbolCode == 'o') {
			return "/AlternateTable/SmallCircle.gif";
		} else if(symbolCode == 'p') {
			return "/AlternateTable/PartlyCloudy.gif";
		} else if(symbolCode == 'r') {
			return "/AlternateTable/Restrooms.gif";
		} else if(symbolCode == 's') {
			return "/AlternateTable/Boat.gif";    // TODO: Make a better graphic
		} else if(symbolCode == 't') {
			return "/AlternateTable/Tornado.gif";
		} else if(symbolCode == 'u') {
			return "/AlternateTable/Truck.gif";
		} else if(symbolCode == 'v') {
			return "/AlternateTable/Van.gif";
		} else if(symbolCode == 'w') {
			return "/AlternateTable/Flooding.gif";
		} else if(symbolCode == 'x') {
			return "/AlternateTable/Obstruction.gif";
		} else if(symbolCode == 'y') {
			return "/AlternateTable/Skywarn.gif";
		} else if(symbolCode == 'z') {
			return "/AlternateTable/Shelter.gif";
		} else if(symbolCode == '{') {
			return "/AlternateTable/Fog.gif";
		} else if(symbolCode == '|') {
			return "/AlternateTable/TNCSwitchStream1.gif";
		} else if(symbolCode == '~') {
			return "/AlternateTable/TNCSwitchStream2.gif";
		} else {
			return "/Crosshair.gif";
		}
	}
}