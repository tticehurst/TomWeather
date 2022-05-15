Module.register("TomWeather", {
  defaults: {
    appID: undefined,
    lat: undefined,
    lon: undefined,
    unit: "metric"
  },

  __getData() {
    this.sendSocketNotification("GetWeather", {
      lat: this.config.lat,
      lon: this.config.lon,
      appID: this.config.appID,
      unit: this.config.unit
    });

    this.sendSocketNotification("GetIndoor", {});
  },

  start() {
    setTimeout(() => {
      setInterval(() => {
        this.__getData();
      }, 600000);
      this.__getData();
    }, 1000);
  },

  updateSunTime(lat, lon) {
    let now = !this.date ? new Date() : this.date.toDate();
    let times = SunCalc.getTimes(now, lat, lon);
    this.sunrise = moment(times.sunrise, "X");
    this.sunset = moment(times.sunset, "X");
  },
  socketNotificationReceived(id, payload) {
    if (id === "GetWeatherResult") {
      if (!payload.liveWeatherData) {
        this.weatherData = payload.weatherData;
        this.prefix = "*";
      } else {
        this.weatherData = payload.liveWeatherData;
      }

      let times = SunCalc.getTimes(new Date(), this.config.lat, this.config.lon);
      let sunriseTime = moment(times.sunrise, "X");
      let sunsetTime = moment(times.sunset, "X");

      this.windDirection = payload.windDirection;
      this.windSpeed = payload.weatherData.wind.speed;
      this.weatherTypeID = payload.weatherData.weather[0].id

      this.feelsLike = payload.weatherData.main.feels_like;
      this.outdoorTemperature = (this.weatherData.main === undefined) ? this.weatherData.value : this.weatherData.main.temp;

      this.cloudCover = payload.weatherData.clouds.all;
      this.humidity = payload.weatherData.main.humidity;

      if (moment().isBetween(sunriseTime, sunsetTime)) {
        this.nextSunAction = "sunset"
        this.nextSunActionTime = moment.unix(payload.weatherData.sys.sunset).format("HH:mm");
      } else {
        this.nextSunAction = "sunrise"
        this.nextSunActionTime = moment.unix(payload.weatherData.sys.sunrise).format("HH:mm");
      }

      this.updateDom(300);
    } else if (id === "GetIndoorResult") {
      this.indoorTemperature = payload.value;

      this.updateDom(300);
    }
  },

  getTemplateData() {
    return {
      data: {
        outsideTemperature: this.outdoorTemperature,
        indoorTemperature: this.indoorTemperature,
        windDirection: this.windDirection,
        degreeSymbol: `°${this.config.unit.toLowerCase() === "metric" ? "c" : "f"}`,
        nextSunAction: this.nextSunAction,
        nextSunActionTime: this.nextSunActionTime,
        prefix: this.prefix,
        feelsLike: this.feelsLike,
        windSpeed: this.windSpeed,
        weatherTypeID: this.weatherTypeID,
        cloudCover: this.cloudCover,
        humidity: this.humidity
      }
    }
  },

  getTemplate() {
    return "WeatherInfo.njk";
  },

  getScripts() {
    return ["moment.js", "suncalc.js"]
  },

  getStyles() {
    return ["font-awesome.css", "weather-icons.css", "weather.css"];
  }
})