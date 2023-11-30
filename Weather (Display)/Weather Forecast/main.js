if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(getWeather);
  //navigator.geolocation.getCurrentPosition(getPastWeather);
} 

//Search button with expandable functions such as past weather display
const searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", searchWeather);
//searchBtn.addEventListener("click", searchPastWeather);
addEventListener("keypress", function(event) {
  if (event.keyCode === 13) {
    searchWeather();
  }
});
// addEventListener("keypress", function(event) {
//   if (event.keyCode === 13) {
//     searchPastWeather();
//   }
// })

function getWeather(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  // Make a request to the Visual Crossing Weather API
  const apiKey = 'LUKCXBB9YHQKCYXLB6FXZZVFW';
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude},${longitude}?unitGroup=us&include=days%2Ccurrent%2Chours%2Calerts%2Cevents&key=${apiKey}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Grab the current weather data 
      const currentTemp = data.currentConditions.temp;
      const currentPrecip = data.days[0].precipprob;
      //const latlng = new google.maps.LatLng(latitude, longitude);
      //const geocoder = new google.maps.Geocoder();
      const condition = data.currentConditions.conditions;
      const descritpion = data.days[0].description;
      const highTemp = data.days[0].tempmax;
      const lowTemp = data.days[0].tempmin;

      //console.log(data.address);

      //Display location
      // geocoder.geocode({ 'latLng': latlng }, function(results, status) {
      //   let city = 'Unknown';
      
      //   if (status === google.maps.GeocoderStatus.OK && results[0]) {
      //     city = results[0].address_components.find(ac => ac.types.includes('locality')).long_name;
      //   }
      
      //   //Set to i <= 7 during past weather expansion
      //   for (let i = 1; i <= 5; i++) {
      //     const locationElement = document.getElementById(`location${i}`);
          
      //     if (locationElement) {
      //       locationElement.textContent = city;
      //     } else {
      //       console.log(`Element with ID location${i} not found.`);
      //     }
      //   }
      // });

    const apiUrl = 'https://ipinfo.io/json?token=f7874ee6cbca3c';

    // Make a request to ipinfo.io API
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        let city = 'Unknown';

        if (data.city) {
          city = data.city;
        }

        // Set to i <= 7 during past weather expansion
        for (let i = 1; i <= 5; i++) {
          const locationElement = document.getElementById(`location${i}`);

          if (locationElement) {
            locationElement.textContent = city;
          } else {
            console.log(`Element with ID location${i} not found.`);
          }
        }
      })
      .catch(error => {
        console.error('Error fetching location data:', error);
      });

      
      //Display weather data
      document.getElementById("condition").textContent = condition;
      document.getElementById("temperature").textContent = `${currentTemp}°F`;
      document.getElementById("precipitation").textContent = `Precipiation: ${currentPrecip}%`
      document.getElementById("description").textContent = descritpion;
      document.getElementById("highTemp").textContent = `Hi: ${highTemp}°F`;
      document.getElementById("lowTemp").textContent = `Lo: ${lowTemp}°F`;
      
      // Display the weather icon based on the weather code
      const iconCode = data.currentConditions.icon;
      const iconUrl = getIconUrl(iconCode);
      document.getElementById("icon").setAttribute("src", iconUrl);

      // Display the weather icon based on the date
      for (let x = 1; x <= 4; x++) {
        const futIconCode = data.days[x].icon;
        const futDescritpion = data.days[x].description;
        const futPrecip = data.days[x].precipprob;
        const futCondition = data.days[x].conditions;
        const futHighTemp = data.days[x].tempmax;
        const futLowTemp = data.days[x].tempmin;
      
        const futIconUrl = getIconUrl(futIconCode);

        //Display Day 2 or when x = 1
        document.getElementById("futIcon").setAttribute("src", futIconUrl);
        document.getElementById("futCondition").textContent = futCondition;
        document.getElementById("futDescription").textContent = futDescritpion;
        document.getElementById("futPrecipitation").textContent = `Precipiation: ${futPrecip}%`
        document.getElementById("futHighTemp").textContent = `Hi: ${futHighTemp}°F`;
        document.getElementById("futLowTemp").textContent = `Lo: ${futLowTemp}°F`;
      
        const iconElement = document.getElementById(`futIcon${x}`);
        const precipElement = document.getElementById(`futPrecipitation${x}`);
        const conditionElement = document.getElementById(`futCondition${x}`);
        const descriptionElement = document.getElementById(`futDescription${x}`);
        const highTempElement = document.getElementById(`futHighTemp${x}`);
        const lowTempElement = document.getElementById(`futLowTemp${x}`);
      
        if (iconElement && precipElement && conditionElement && descriptionElement && highTempElement && lowTempElement) {
          iconElement.setAttribute("src", futIconUrl);
          precipElement.textContent = `Precipiation: ${futPrecip}%`;
          conditionElement.textContent = futCondition;
          descriptionElement.textContent = futDescritpion;
          highTempElement.textContent = `Hi: ${futHighTemp}°F`;
          lowTempElement.textContent = `Lo: ${futLowTemp}°F`;
        }
      }
      
      // Display the hourly forecast for the next 24 hours
      let tformat = new Intl.DateTimeFormat('en-US', {
        hour: "2-digit",
        hour12: false
      })

      let tmformat = new Intl.DateTimeFormat('en-US', {
        hour: "numeric"
      })

      let x = new Date();

      const today_hrs = data.days[0];
      const tmw_hrs = data.days[1];
      let mt = tformat.format(x);

      // Hourly data for upcoming hours
      for (let t = mt; t <= mt + 4; t++) {
        const hrIconCode = today_hrs.hours[t].icon;
        const hrTemp = today_hrs.hours[t].temp;
        const hrPrecip = today_hrs.hours[t].precipprob;
      
        let hrTime = new Date(x.getTime());
        hrTime.setHours(t);
        let time = tmformat.format(hrTime);
      
        const hrIconUrl = getIconUrl(hrIconCode);

        if (t === mt){
        document.getElementById("hrCurrent").textContent = time;
        document.getElementById("hrIcon").setAttribute("src", hrIconUrl);
        document.getElementById("hrPrecipitation").textContent = `Precipiation: ${hrPrecip}%`
        document.getElementById("hrTemp").textContent = `${hrTemp}°F`;
        }
      
        const currentIndex = t - mt + 1;
        const currentHrElement = document.getElementById(`hrCurrent${currentIndex}`);
        const currentIconElement = document.getElementById(`hrIcon${currentIndex}`);
        const currentPrecipElement = document.getElementById(`hrPrecipitation${currentIndex}`);
        const currentTempElement = document.getElementById(`hrTemp${currentIndex}`);
      
        if (currentHrElement && currentIconElement && currentPrecipElement && currentTempElement) {
          currentHrElement.textContent = time;
          currentIconElement.setAttribute("src", hrIconUrl);
          currentPrecipElement.textContent = `Precipiation: ${hrPrecip}%`;
          currentTempElement.textContent = `${hrTemp}°F`;
        }
      }    
    });
}

function searchWeather() {
  // Get the city name input value
  const cityName = document.getElementById("cityInput").value;

  // Make a request to the Visual Crossing Weather API with the city name
  const apiKey = 'LUKCXBB9YHQKCYXLB6FXZZVFW';
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityName}?unitGroup=us&include=days%2Ccurrent%2Chours%2Calerts%2Cevents&key=${apiKey}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Display the current temperature, location, high temperature, and low temperature
      const currentTemp = data.currentConditions.temp;
      const currentPrecip = data.days[0].precipprob;
      const city = cityName;
      const condition = data.currentConditions.conditions;
      const descritpion = data.days[0].description;
      const highTemp = data.days[0].tempmax;
      const lowTemp = data.days[0].tempmin;
      
      //Set to i <= 7 during past weather expansion
      for (let i = 1; i <= 5; i++) {
        const locationElement = document.getElementById(`location${i}`);
      
        if (locationElement) {
          locationElement.textContent = cityName;
        } else {
          console.log(`Element with ID location${i} not found.`);
        }
      }      
      document.getElementById("condition").textContent = condition;
      document.getElementById("temperature").textContent = `${currentTemp}°F`;
      document.getElementById("precipitation").textContent = `Precipiation: ${currentPrecip}%`
      document.getElementById("description").textContent = descritpion;
      document.getElementById("highTemp").textContent = `Hi: ${highTemp}°F`;
      document.getElementById("lowTemp").textContent = `Lo: ${lowTemp}°F`;

      // Display the weather icon based on the weather code
      const iconCode = data.currentConditions.icon;
      const iconUrl = getIconUrl(iconCode);
      document.getElementById("icon").setAttribute("src", iconUrl);

      // Display the weather icon based on the date
      for (let x = 1; x <= 4; x++) {
        const futIconCode = data.days[x].icon;
        const futDescritpion = data.days[x].description;
        const futPrecip = data.days[x].precipprob;
        const futCondition = data.days[x].conditions;
        const futHighTemp = data.days[x].tempmax;
        const futLowTemp = data.days[x].tempmin;
      
        const futIconUrl = getIconUrl(futIconCode);

        //Display Day 2 or when x = 1
        document.getElementById("futIcon").setAttribute("src", futIconUrl);
        document.getElementById("futCondition").textContent = futCondition;
        document.getElementById("futDescription").textContent = futDescritpion;
        document.getElementById("futPrecipitation").textContent = `Precipiation: ${futPrecip}%`
        document.getElementById("futHighTemp").textContent = `Hi: ${futHighTemp}°F`;
        document.getElementById("futLowTemp").textContent = `Lo: ${futLowTemp}°F`;
      
        const iconElement = document.getElementById(`futIcon${x}`);
        const precipElement = document.getElementById(`futPrecipitation${x}`);
        const conditionElement = document.getElementById(`futCondition${x}`);
        const descriptionElement = document.getElementById(`futDescription${x}`);
        const highTempElement = document.getElementById(`futHighTemp${x}`);
        const lowTempElement = document.getElementById(`futLowTemp${x}`);
      
        if (iconElement && precipElement && conditionElement && descriptionElement && highTempElement && lowTempElement) {
          iconElement.setAttribute("src", futIconUrl);
          precipElement.textContent = `Precipiation: ${futPrecip}%`;
          conditionElement.textContent = futCondition;
          descriptionElement.textContent = futDescritpion;
          highTempElement.textContent = `Hi: ${futHighTemp}°F`;
          lowTempElement.textContent = `Lo: ${futLowTemp}°F`;
        }
      }

      let tformat = new Intl.DateTimeFormat('en-US', {
        hour: "2-digit",
        hour12: false
      })

      let tmformat = new Intl.DateTimeFormat('en-US', {
        hour: "numeric"
      })

      let x = new Date();

      const today_hrs = data.days[0];
      let mt = tformat.format(x);
      
      //console.log(today_hrs.hours[mt])

       // Hourly data for upcoming hours
       for (let t = mt; t <= mt + 4; t++) {
        const hrIconCode = today_hrs.hours[t].icon;
        const hrTemp = today_hrs.hours[t].temp;
        const hrPrecip = today_hrs.hours[t].precipprob;
      
        let hrTime = new Date(x.getTime());
        hrTime.setHours(t);
        let time = tmformat.format(hrTime);
      
        const hrIconUrl = getIconUrl(hrIconCode);

        if (t === mt){
        document.getElementById("hrCurrent").textContent = time;
        document.getElementById("hrIcon").setAttribute("src", hrIconUrl);
        document.getElementById("hrPrecipitation").textContent = `Precipiation: ${hrPrecip}%`
        document.getElementById("hrTemp").textContent = `${hrTemp}°F`;
        }
      
        const currentIndex = t - mt + 1;
        const currentHrElement = document.getElementById(`hrCurrent${currentIndex}`);
        const currentIconElement = document.getElementById(`hrIcon${currentIndex}`);
        const currentPrecipElement = document.getElementById(`hrPrecipitation${currentIndex}`);
        const currentTempElement = document.getElementById(`hrTemp${currentIndex}`);
      
        if (currentHrElement && currentIconElement && currentPrecipElement && currentTempElement) {
          currentHrElement.textContent = time;
          currentIconElement.setAttribute("src", hrIconUrl);
          currentPrecipElement.textContent = `Precipiation: ${hrPrecip}%`;
          currentTempElement.textContent = `${hrTemp}°F`;
        }
      }
    })
    
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

function displaydt() {
  let dtFormat = new Intl.DateTimeFormat('default');
  var d = new Date();

  Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}
var date = new Date();

  //document.getElementById("past2").innerHTML = dtFormat.format(date.addDays(-2));
  //document.getElementById("past").innerHTML = dtFormat.format(date.addDays(-1));  
  document.getElementById("current").innerHTML = dtFormat.format(d);
  document.getElementById("future").innerHTML = dtFormat.format(date.addDays(1));
  document.getElementById("future2").innerHTML = dtFormat.format(date.addDays(2));
  document.getElementById("future3").innerHTML = dtFormat.format(date.addDays(3));
  document.getElementById("future4").innerHTML = dtFormat.format(date.addDays(4));
}

const slides = document.getElementsByClassName("carousel-item");
const nextButton = document.getElementById("carousel-button-next");
const prevButton = document.getElementById("carousel-button-prev");
const dots = document.getElementsByClassName("dot");
let position = 0;
const numberOfSlides = slides.length;

function hideAllSlides() {
    // remove all slides not currently being viewed
    for (const slide of slides) {
        slide.classList.remove("carousel-item-visible");
        slide.classList.add("carousel-item-hidden");
    }
}

const handleMoveToNextSlide = function(e) {
    hideAllSlides();
  
    // check if last slide has been reached
    if (position === numberOfSlides - 1) {
        position = 0; // go back to first slide
    } else {
        // move to next slide
        position++;
    }
    // make current slide visible
    slides[position].classList.add("carousel-item-visible");
  
    // update dot to represent current slide
    dots[position].classList.add("selected-dot");
    dots[position].checked = true;
}

const handleMoveToPrevSlide = function(e) {
    hideAllSlides();
    
    // check if we're on the first slide
    if (position === 0) {
        position = numberOfSlides - 1; // move to the last slide
    } else {
        // move back one
        position--;
    }
    // make current slide visible
    slides[position].classList.add("carousel-item-visible");
  
    // update dot to represent current slide
    dots[position].classList.add("selected-dot");
    dots[position].checked = true;
}

// listen for slide change events
nextButton.addEventListener("click", handleMoveToNextSlide);
prevButton.addEventListener("click", handleMoveToPrevSlide);

function getPastWeather(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  // Make a request to the Visual Crossing Weather API
  const apiKey = 'LUKCXBB9YHQKCYXLB6FXZZVFW';
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude},${longitude}/last2days?key=${apiKey} `;
  fetch(url)
    .then(response => response.json())
    .then(data => { 
      // Display the current temperature and location
      const latlng = new google.maps.LatLng(latitude, longitude);
      const geocoder = new google.maps.Geocoder();
      
      geocoder.geocode({'latLng': latlng}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            const city = results[0].address_components.find(ac => ac.types.includes('locality')).long_name;
            document.getElementById("location6").textContent = city;
            document.getElementById("location7").textContent = city; 
          } else {
            document.getElementById("location").textContent = 'Unknown';
          }
        } else {
          document.getElementById("location").textContent = 'Unknown';
        }
      });

      // Display the weather icon based on the date
    //   for (let x = 1; x <= 2; x++) {
    //   const preIconCode = data.days[x].icon;
    //   const preDescritpion = data.days[x].description;
    //   const preCondition = data.days[x].conditions;
    //   const preHighTemp = data.days[x].tempmax;
    //   const preLowTemp = data.days[x].tempmin;
    //   console.log(data.days);

    //   const preIconUrl = getIconUrl(preIconCode);

    //   document.getElementById("icon6").setAttribute("src", preIconUrl);
    //   document.getElementById("condition6").textContent = preCondition;
    //   document.getElementById("description6").textContent = preDescritpion;
    //   document.getElementById("highTemp6").textContent = `Hi: ${preHighTemp}°F`;
    //   document.getElementById("lowTemp6").textContent = `Lo: ${preLowTemp}°F`;

    //   if (x === 2) {
    //     document.getElementById("icon7").setAttribute("src", preIconUrl);
    //     document.getElementById("condition7").textContent = preCondition;
    //     document.getElementById("description7").textContent = preDescritpion;
    //     document.getElementById("highTemp7").textContent = `Hi: ${preHighTemp}°F`;
    //     document.getElementById("lowTemp7").textContent = `Lo: ${preLowTemp}°F`;  
    //   } else {
    //     document.getElementById("futIcon").textContent = 'Unknown';
    //     document.getElementById("futIcon2").textContent = 'Unknown';
    //     document.getElementById("futIcon3").textContent = 'Unknown';
    //   }
    // }
  })
}

function searchPastWeather() {
  // Get the city name input value
  const cityName = document.getElementById("cityInput").value;

  // Make a request to the Visual Crossing Weather API with the city name
  const apiKey = 'LUKCXBB9YHQKCYXLB6FXZZVFW';
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityName}/last2days?key=${apiKey} `;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Display the current temperature, location, high temperature, and low temperature
      const city = cityName;
      
      document.getElementById("location6").textContent = cityName;
      document.getElementById("location7").textContent = cityName;
      

      // for (let x = 1; x <= 2; x++) {
      //   const preIconCode = data.days[x].icon;
      //   const preDescritpion = data.days[x].description;
      //   const preCondition = data.days[x].conditions;
      //   const preHighTemp = data.days[x].tempmax;
      //   const preLowTemp = data.days[x].tempmin;
  
      //   const preIconUrl = getIconUrl(preIconCode);
  
      //   document.getElementById("icon6").setAttribute("src", preIconUrl);
      //   document.getElementById("condition6").textContent = preCondition;
      //   document.getElementById("description6").textContent = preDescritpion;
      //   document.getElementById("highTemp6").textContent = `Hi: ${preHighTemp}°F`;
      //   document.getElementById("lowTemp6").textContent = `Lo: ${preLowTemp}°F`;
  
      //   if (x === 2) {
      //     document.getElementById("icon7").setAttribute("src", preIconUrl);
      //     document.getElementById("condition7").textContent = preCondition;
      //     document.getElementById("description7").textContent = preDescritpion;
      //     document.getElementById("highTemp7").textContent = `Hi: ${preHighTemp}°F`;
      //     document.getElementById("lowTemp7").textContent = `Lo: ${preLowTemp}°F`;  
      //   } else {
      //     document.getElementById("futIcon").textContent = 'Unknown';
      //     document.getElementById("futIcon2").textContent = 'Unknown';
      //     document.getElementById("futIcon3").textContent = 'Unknown';
      //   }
      // }
  
    })
}