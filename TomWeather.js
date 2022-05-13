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

    this.sendSocketNotification("GetIndoor", {})
  },

  start() {
    setTimeout(() => {
      setInterval(() => {
        this.__getData();
      }, 600000);
      this.__getData();
    }, 1000);
  },


  socketNotificationReceived(id, payload) {
    if (id === "GetWeatherResult") {
      if (!payload.liveWeatherData) {
        this.weatherData = payload.weatherData;
        this.using = "Online";
      } else {
        this.weatherData = payload.liveWeatherData;
        this.using = "Live";
      }

      this.windDirection = payload.windDirection;
      this.windSpeed = payload.weatherData.wind.speed;

      this.feelsLike = payload.weatherData.main.feels_like;
      this.temperature = (this.weatherData.main === undefined) ? this.weatherData.value : this.weatherData.main.temp

      if (new Date(0).setUTCMilliseconds(payload.weatherData.sys.sunrise) < new Date(0).setUTCMilliseconds(new Date().getTime())) {
        this.nextSunAction = "sunrise"
        this.nextSunActionTime = moment.unix(payload.weatherData.sys.sunrise).format("hh:mm");
      } else {
        this.nextSunAction = "sunset"
        this.nextSunActionTime = moment.unix(payload.weatherData.sys.sunset).format("hh:mm");
      }


      this.updateDom(300);
    } else if (id === "GetIndoorResult") {
      this.indoorData = payload;

      this.updateDom(300);
    }
  },

  getTemplateData() {
    return {
      data: {
        temperature: this.temperature,
        windDirection: this.windDirection,
        indoorData: this.indoorData,
        charUnit: this.config.unit.toLowerCase() === "metric" ? "c" : "f",
        nextSunAction: this.nextSunAction,
        nextSunActionTime: this.nextSunActionTime,
        using: this.using,
        feelsLike: this.feelsLike,
        windSpeed: this.windSpeed
      }
    }
  },

  getTemplate() {
    return "TomInfo.njk";
  },

  getScripts() {
    return ["moment.js"]
  },

  getStyles() {
    return ["font-awesome.css", "weather-icons.css", "weather.css"];
  },

  addFilters() {
    this.nunjucksEnvironment().addFilter("round", (item) => {
      return Math.floor(parseInt(item));
    }).bind(this);
  }
})