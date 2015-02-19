function displayWeatherData(position)
{
	console.log("In displayWeatherData");
	var weatherUrl = "http://api.openweathermap.org/data/2.5/weather?mode=json&units=metric";
	weatherUrl = weatherUrl + "&lat=" + position.coords.latitude + "&lon=" + position.coords.longitude;
	//console.log(weatherUrl);
	//Get the weather information from openweathermap API
	$.ajax({url: weatherUrl,
		dataType: "json",
		success: function(responseData) {
					var city = responseData.name;
					var temp = responseData.main.temp;
					var temp_min = responseData.main.temp_min;
					console.log("Temp min: " + temp_min);
					var temp_max = responseData.main.temp_max;
					var humidity = responseData.main.humidity;
					var icon_url = "http://openweathermap.org/img/w/" + responseData.weather[0].icon + ".png";
					
					//Set data elements on the form
					$("#city").text(city);
					$("#temp").text(temp);
					$("#tempMin").text(temp_min);
					$("#tempMax").text(temp_max);
					$("#humidity").text(humidity);
					$("#weatherImg").attr("src",icon_url);
					$("#dayTime").text(getCurrentDayTime());
					
					//Load google maps
					lat = position.coords.latitude;
					lon = position.coords.longitude;
					latlon = new google.maps.LatLng(lat, lon)
					mapholder = document.getElementById('mapHolder')
					
					var myOptions = {
						center:latlon,zoom:14,
						mapTypeId:google.maps.MapTypeId.ROADMAP,
						mapTypeControl:false,
						navigationControlOptions:{style:google.maps.NavigationControlStyle.SMALL}
					}
					
					var map = new google.maps.Map(document.getElementById("mapHolder"), myOptions);
					var marker = new google.maps.Marker({position:latlon,map:map,title:"You are here!"});
					
					//Hide the error id and show the container with data in case of success 
					$("#error").hide();
					$("#container").show();
					
					//Fade out the preloader screen active and reveal the screen populated with data
					$(".preload").fadeOut("slow");
				}
			}
	);
}

//Return the day and time in a format using moment.js API
function getCurrentDayTime()
{
	return moment().format("dddd, h:mm A");	
}

function loadWeatherData()
{
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(displayWeatherData, handleGeoLocationError);
	}
	else{
		handleGeoLocationError();
	}
	
}

//Function to handle location related errors
function handleGeoLocationError(error) {
    //console.log("in handleGeoLocationError");
	var x = $("#error");
	if(typeof error === undefined)
	{
		x.text("Your browser does not provide location information");
	}
	else
	{
		switch(error.code) {
			case error.PERMISSION_DENIED:
				x.text("User denied the request for Geolocation.");
				break;
			case error.POSITION_UNAVAILABLE:
				x.text("Location information is unavailable.");
				break;
			case error.TIMEOUT:
				x.text("The request to get user location timed out.");
				break;
			case error.UNKNOWN_ERROR:
				x.text("An unknown error occurred.");
				break;
		}
	}
	$("#error").show();
	$("#container").hide();
	
	//Fade out the preloader screen active
	$(".preload").fadeOut("slow");
}