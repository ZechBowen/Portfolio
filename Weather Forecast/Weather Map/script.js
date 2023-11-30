const API_KEY = 'n73CV46iWOeoUXjBtFN0NFLmRHraJQG0';

const map = L.map('map', {
  minZoom: 3,
  maxZoom: 10
}).setView([29.7604, -95.3698], 7);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
}).addTo(map);

let currentLayer = L.tileLayer(`https://api.tomorrow.io/v4/map/tile/{z}/{x}/{y}/precipitationIntensity/now.png?apikey=${API_KEY}`, {
  attribution: '&copy; <a href="https://www.tomorrow.io/weather-api">Powered by Tomorrow.io</a>',
}).addTo(map);

const options = {
  precipitationIntensity: {
    title: 'Precipitation',
    url: `https://api.tomorrow.io/v4/map/tile/{z}/{x}/{y}/precipitationIntensity/now.png?apikey=${API_KEY}`
  },
  temperature: {
    title: 'Temperature',
    url: `https://api.tomorrow.io/v4/map/tile/{z}/{x}/{y}/temperature/now.png?apikey=${API_KEY}`
  },
  humidity: {
    title: 'Humidity',
    url: `https://api.tomorrow.io/v4/map/tile/{z}/{x}/{y}/humidity/now.png?apikey=${API_KEY}`
  },
  windSpeed: {
    title: 'Wind Speed',
    url: `https://api.tomorrow.io/v4/map/tile/{z}/{x}/{y}/windSpeed/now.png?apikey=${API_KEY}`
  },
  visibility: {
    title: 'Visibility',
    url: `https://api.tomorrow.io/v4/map/tile/{z}/{x}/{y}/visibility/now.png?apikey=${API_KEY}`
  },
  uvHealthConcern: {
    title: 'UV Index',
    url: `https://api.tomorrow.io/v4/map/tile/{z}/{x}/{y}/uvIndex/now.png?apikey=${API_KEY}`
  }
};

const buttonsContainer = document.createElement('div');
buttonsContainer.id = 'buttons-container';
document.body.appendChild(buttonsContainer);

// Add CSS styles to buttons container
buttonsContainer.style.position = 'absolute';
buttonsContainer.style.bottom = '0';
buttonsContainer.style.display = 'flex';
buttonsContainer.style.justifyContent = 'center';
buttonsContainer.style.alignItems = 'center';
buttonsContainer.style.width = '100%';
buttonsContainer.style.height = '50px';
buttonsContainer.style.backgroundColor = '#f2f2f2';
buttonsContainer.style.zIndex = '1000';

for (const option in options) {
  const button = document.createElement('button');
  button.innerText = options[option].title;
  button.style.margin = '10px';
  button.style.padding = '10px 20px';
  button.style.border = 'none';
  button.style.backgroundColor = 'transparent';
  button.style.color = '#666';
  button.style.fontSize = '16px';
  button.style.fontWeight = 'bold';
  button.style.cursor = 'pointer';
  button.style.zIndex = '1000';

  button.addEventListener('click', () => {
    if (map.hasLayer(currentLayer)) {
      map.removeLayer(currentLayer);
    }

    currentLayer = L.tileLayer(options[option].url, {
      attribution: '&copy; <a href="https://www.tomorrow.io/weather-api">Powered by Tomorrow.io</a>',
    }).addTo(map);

    // Highlight the active button
    const buttons = buttonsContainer.getElementsByTagName('button');
    for (const b of buttons) {
      b.classList.remove('active');
    }
    button.classList.add('active');
  });

  buttonsContainer.appendChild(button);
}

