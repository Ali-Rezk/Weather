const apiKey = "5aba5ac55b984050bfa230233240709";
const baseURL = "http://api.weatherapi.com/v1";
const searchInput = document.getElementById("search");
const weather = {};

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      weather.latitude = latitude;
      weather.longitude = longitude;
      search(`${latitude},${longitude}`);
      displayMap();
    },
    (error) => {
      console.error(`Error: ${error.message}`);
    }
  );
} else {
  console.error("Geolocation is not supported by this browser.");
}

document.getElementById("search").addEventListener("input", function () {
  search(searchInput.value);
});

async function search(city) {
  try {
    const reqForecast = await fetch(
      `${baseURL}/forecast.json?key=${apiKey}&q=${city}&days=3`
    );

    const resForecast = await reqForecast.json();

    console.log(resForecast);

    const {
      location,
      current: { condition, temp_c },
      forecast: { forecastday },
    } = resForecast;

    weather.name = location.name;
    weather.currentDate = location.localtime;
    weather.condition = condition.text;
    weather.conditionIcon = condition.icon;
    weather.temp = temp_c;

    weather.forecastMax = forecastday[1].day.maxtemp_c;
    weather.forecastMin = forecastday[1].day.mintemp_c;
    weather.forecastCondition = forecastday[1].day.condition.text;
    weather.forecastIcon = forecastday[1].day.condition.icon;
    weather.forecastDate1 = forecastday[1].date;

    weather.forecastMax2 = forecastday[2].day.maxtemp_c;
    weather.forecastMin2 = forecastday[2].day.mintemp_c;
    weather.forecastCondition2 = forecastday[2].day.condition.text;
    weather.forecastIcon2 = forecastday[2].day.condition.icon;
    weather.forecastDate2 = forecastday[2].date;

    weather.currentDate = locationDate(weather.currentDate);
    weather.forecastDate1 = locationDate(weather.forecastDate1);
    weather.forecastDate2 = locationDate(weather.forecastDate2);

    console.log(
      weather.currentDate,
      weather.forecastDate1,
      weather.forecastDate2
    );

    displayData();
  } catch (error) {
    console.log(error);
  }
}

function locationDate(time) {
  const date = new Date(time).toDateString().split(" ").slice(0, 3);
  return date;
}

function displayData() {
  const container = `<div class="today forecast col-md-4">
            <div
              class="forecast-header d-flex justify-content-between"
              id="today"
            >
              <div class="day">${weather.currentDate[0]}</div>
              <div class="date">${weather.currentDate[2]}${weather.currentDate[1]}</div>
            </div>
            <div class="forecast-content" id="current">
              <div class="location">${weather.name}</div>
              <div class="degree">
                <div class="num">${weather.temp}<sup>o</sup>C</div>
                <div class="forecast-icon mb-2">
                  <img src="${weather.conditionIcon}" alt="" width="90" />
                </div>
              </div>
              <div class="condition">${weather.condition}</div>
              <span><img src="../Images/icon-umberella.png" alt="" />20%</span>
              <span><img src="../Images/icon-wind.png" alt="" />18km/h</span>
              <span><img src="../Images/icon-compass.png" alt="" />East</span>
            </div>
          </div>

          <div class="forecast col-md-4 first text-center">
            <div class="forecast-header">
              <div class="day">${weather.forecastDate1[0]}</div>
            </div>
            <div class="forecast-content">
              <div class="forecast-icon">
                <img
                  src="${weather.forecastIcon}"
                  alt=""
                  width="48"
                />
              </div>
              <div class="degree">${weather.forecastMax}<sup>o</sup>C</div>
              <small>${weather.forecastMin}<sup>o</sup></small>
              <div class="condition">${weather.forecastCondition}</div>
            </div>
          </div>

          <div class="forecast col-md-4 text-center">
            <div class="forecast-header">
              <div class="day">${weather.forecastDate2[0]}</div>
            </div>
            <div class="forecast-content">
              <div class="forecast-icon">
                <img
                  src="${weather.forecastIcon2}"
                  alt=""
                  width="48"
                />
              </div>
              <div class="degree">${weather.forecastMax}<sup>o</sup>C</div>
              <small>${weather.forecastMin}<sup>o</sup></small>
              <div class="condition">${weather.forecastCondition}</div>
            </div>
          </div>`;

  document.getElementById("forecast").innerHTML = container;
}

function displayMap() {
  const mapContainer = `
    <iframe
    src="https://www.google.com/maps?q=${weather.latitude},${weather.longitude}&z=15&output=embed"
    width="100%"
    height="100%"
    style="border: 0"
    allowfullscreen=""
    loading="lazy"
    referrerpolicy="no-referrer-when-downgrade"
    >
    </iframe>`;

  document.getElementById("map").innerHTML = mapContainer;
}
