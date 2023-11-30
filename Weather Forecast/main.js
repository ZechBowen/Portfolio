if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(getWeather);
}

function getWeather(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  // Make a request to the Visual Crossing Weather API
  const apiKey = 'LUKCXBB9YHQKCYXLB6FXZZVFW';
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude},${longitude}?unitGroup=us&key=${apiKey}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Display the current temperature and location
      const currentTemp = data.currentConditions.temp;
      const latlng = new google.maps.LatLng(latitude, longitude);
      const geocoder = new google.maps.Geocoder();
      const description = data.currentConditions.conditions;
      geocoder.geocode({'latLng': latlng}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            const city = results[0].address_components.find(ac => ac.types.includes('locality')).long_name;
            document.getElementById("location").textContent = city;
          } else {
            document.getElementById("location").textContent = 'Unknown';
          }
        } else {
          document.getElementById("location").textContent = 'Unknown';
        }
      });
 
      document.getElementById("description").textContent = description;
      document.getElementById("temperature").textContent = `${currentTemp}°F`;

      // Display the weather icon based on the weather code
      const iconCode = data.currentConditions.icon;
      const iconUrl = getIconUrl(iconCode);
      document.getElementById("icon").setAttribute("src", iconUrl);
    });
}


function getIconUrl(iconCode) {
  let iconUrl = "";

  switch(iconCode) {
    case "clear-day":
      iconUrl =  "icons/clear-day.png";
      break;
    case "clear-night":
      iconUrl =  "icons/clear-night.png";
      break;
    case "partly-cloudy-day":
      iconUrl =  "icons/partly-cloudy-day.png";
      break;
    case "partly-cloudy-night":
      iconUrl =  "icons/partly-cloudy-night.png";
      break;
    case "cloudy":
      iconUrl =  "icons/cloudy.png";
      break;
    case "rain":
      iconUrl =  "icons/rain.png";
      break;
    case "sleet":
      iconUrl =  "icons/sleet.png";
      break;
    case "snow":
      iconUrl =  "icons/snow.png";
      break;
    case "wind":
      iconUrl =  "icons/wind.png";
      break;
    case "fog":
      iconUrl =  "icons/fog.png";
      break;
    default:
      iconUrl =  "icons/clear-day.png";
  }

  return iconUrl;
}
