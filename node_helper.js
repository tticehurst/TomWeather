/* eslint-disable */
const NodeHelper = require("node_helper");

const axios = require("axios").default;
const cardinal = require("cardinal-direction");

module.exports = NodeHelper.create({
  async socketNotificationReceived(notification, payload) {
    if (notification === "GetWeather") {
      let weatherData = undefined;
      let liveWeatherData = undefined;

      try {
        liveWeatherData = (await axios.get("http://192.168.0.40:5000/get/temperature/outside")).data;
      } catch { }

      weatherData = (await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${payload.lat}&lon=${payload.lon}&appid=${payload.appID}&units=${payload.unit}`)).data;

      let windDirection = cardinal.cardinalFromDegree(weatherData.wind.deg, cardinal.CardinalSubset.Intercardinal);

      this.sendSocketNotification("GetWeatherResult", { weatherData, windDirection, liveWeatherData })
    } else if (notification === "GetIndoor") {
      try {
        let data = (await axios.get("http://192.168.0.43:5000/get/temperature/inside")).data;

        this.sendSocketNotification("GetIndoorResult", data)
      } catch { }
    } else if (notification === "Print") {
      console.log(payload);
    }
  },
});
