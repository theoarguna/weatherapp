$(document).ready(function ($) {

	//The functions
    function runProgram() {

        function WeatherObj() {
            //These are set so the DOM is scanned only once:
            this["locationText"] = $(".location-text");
            this["circle"] = $("header");
            this["temp"] = $("#temp");
            this["moreData"] = $(".more-data");
			this["selectCity"] = $(".select-city");
            this["dataTrigger"] = $(".data-trigger");
			this["formTrigger"] = $(".form-trigger");
            this["apikey"] = "1e644e820e0fb03a";
        }

        WeatherObj.prototype.setNewClass = function (arg) {
            var colors = "cold frozen hot lukewarm unfilled warm white-text"; //See css.css lines 128 - 180
            this["circle"].removeClass(colors);
            this["temp"].addClass("white-text");
            this["circle"].addClass(arg);
        };


        WeatherObj.prototype.setBackgroundColor = function (arg) {
            if (arg <= 120 && arg >= 90) {
                this.setNewClass("hot");
            }
            else if (arg <= 89 && arg >= 80) {
                this.setNewClass("warm");
            }
            else if (arg <= 79 && arg >= 60) {
                this.setNewClass("lukewarm");
            }
            else if (arg <= 59 && arg >= 33) {
                this.setNewClass("cold");
            }
            else {
                this.setNewClass("frozen");
            }
        };


        WeatherObj.prototype.pushToSelf = function (ary, jsonName) {
            for (var i = 0; i < ary.length; i++) {
                this[ary[i]] = jsonName[ary[i]];
            }
        };


		WeatherObj.prototype.getWeatherData = function() {
			var theCurrentObj = this;
			$.ajax({
                url: "http://api.wunderground.com/api/" + theCurrentObj["apikey"] + "/conditions/q/" + theCurrentObj["zip"] + ".json",
                dataType: "jsonp",
                cache: false,
                success: function (jsonObj) {

                    //Gathers more data:
                    var conditionDataNeeded = ["weather", "wind_string", "relative_humidity", "pressure_in", "visibility_mi", "precip_today_in", "dewpoint_f", "UV", "temp_f"];
                    var jsonToParse = jsonObj["current_observation"];
                    theCurrentObj.pushToSelf(conditionDataNeeded, jsonToParse);
                    var currentTempF = Math.round(theCurrentObj["temp_f"]);

                    //Removes the loading message and adds the current weather conditions:
                    theCurrentObj["dataTrigger"].html('<a href="#">MORE INFORMATION</a>');
                    theCurrentObj["moreData"].html('Status: ' + theCurrentObj["weather"] + '<br/>Wind: ' + theCurrentObj["wind_string"] + '<br/>Humidity: ' + theCurrentObj["relative_humidity"] + '<br/>Pressure: ' + theCurrentObj["pressure_in"] + ' in<br/>Visibility: ' + theCurrentObj["visibility_mi"] + ' mi<br/>Percipitation: ' + theCurrentObj["precip_today_in"] + ' in<br/>Dewpoint: ' + theCurrentObj["dewpoint_f"] + ' &deg F<br/>UV Index: ' + theCurrentObj["UV"]);
					theCurrentObj.setBackgroundColor(currentTempF);
                    theCurrentObj["temp"].html(currentTempF + "&deg");

                },
                error: function (result) {
                    if (result.statusText != "abort") {  //Won't show the error message if the Ajax call was aborted.
                        theCurrentObj["temp"].text("timed out");
                        theCurrentObj["locationText"].text("We were unable to grab weather data. We apologize for the inconvenience.");
                    }
                }
            });//End inner Ajax call
		}



        WeatherObj.prototype.getLocationData = function () {
			var theCurrentObj = this;
			if (theCurrentObj["zip"]) {
	            $.ajax({
					url: "http://api.wunderground.com/api/" + theCurrentObj["apikey"] + "/geolookup/q/" + theCurrentObj["zip"] + ".json",
	                dataType: "jsonp",
	                cache: false,
	                success: function (jsonObj) {
	                    var locationDataNeeded = ["city", "state", "zip", "country"];
	                    var jsonToParse = jsonObj["location"];
	                    theCurrentObj.pushToSelf(locationDataNeeded, jsonToParse);
	                    theCurrentObj["locationText"].html("<b>Your Current Location:</b><br/>" + theCurrentObj["city"] + ", " + theCurrentObj["state"] + " " + theCurrentObj["country"]);
						theCurrentObj.getWeatherData();
	                },
	                error: function (result) {
	                    if (result.statusText != "abort") {  //Won't show the error message if the Ajax call was aborted.
	                        theCurrentObj["temp"].text("timed out");
	                        theCurrentObj["locationText"].text("We were unable to grab your location data.  We apologize for the inconvenience.");
	                    }
	                }
	            }); //End Ajax call	
			}

			else {
	            $.ajax({
					url: "http://api.wunderground.com/api/" + theCurrentObj["apikey"] + "/geolookup/q/autoip.json",
	                dataType: "jsonp",
	                cache: false,
	                success: function (jsonObj) {
	                    var locationDataNeeded = ["city", "state", "zip", "country"];
	                    var jsonToParse = jsonObj["location"];
	                    theCurrentObj.pushToSelf(locationDataNeeded, jsonToParse);
	                    theCurrentObj["locationText"].html("<b>Your Current Location:</b><br/>" + theCurrentObj["city"] + ", " + theCurrentObj["state"] + " " + theCurrentObj["country"]);
						theCurrentObj.getWeatherData();
	                },
	                error: function (result) {
	                    if (result.statusText != "abort") {  //Won't show the error message if the Ajax call was aborted.
	                        theCurrentObj["temp"].text("timed out");
	                        theCurrentObj["locationText"].text("We were unable to grab your location data.  We apologize for the inconvenience.");
	                    }
	                }
	            }); //End Ajax call
			}
        };



		//Buttons and Toggles
        $(document).on("click", ".data-trigger", function(){
            $(this).toggleClass("active").next().slideToggle();
            if (!$(this).hasClass("active")) {
                $(this).html('<a href="#">MORE INFORMATION</a>');
            }
            else {
                $(this).html('<a href="#">MORE INFORMATION</a>')
            }	
		});

        $(document).on("click", ".form-trigger", function(){
            $(this).toggleClass("active").next().slideToggle();
            if (!$(this).hasClass("active")) {
                $(this).html('<a href="#">PICK A CITY</a>');
            }
            else {
                $(this).html('<a href="#">PICK A CITY</a>')
            }	
		});

		$(document).on("click", "button", function(event){
			event.preventDefault();
			wo.zip = $("input").val();
			wo.getLocationData();
		});


        var wo = new WeatherObj();
        wo["moreData"].hide();
		wo["selectCity"].hide();
		wo.getLocationData();
    } //End run program

    runProgram();
});