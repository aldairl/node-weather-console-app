const fs = require("fs");

const axios = require("axios");

class Search {
  history = [];
  dbPath = "./db/history.json";

  constructor() {
    this.loadDB();
  }

  get capitalizePlace() {
    return this.history.map((place) => {
      let placewords = place.split(" ");
      placewords = placewords.map(
        (word) => word[0].toUpperCase() + word.substring(1)
      );
      return placewords.join(" ");
    });
  }

  get paramsMapbox() {
    return {
      access_token: process.env.MAPBOX_KEY,
      limit: 5,
    };
  }

  async search(city = "") {
    try {
      const axiosIntance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${city}.json`,
        params: this.paramsMapbox,
      });

      const { data } = await axiosIntance.get();
      return data.features.map((place) => ({
        id: place.id,
        name: place.place_name,
        lng: place.center[0],
        lat: place.center[1],
      }));
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async weatherCity(lat, lon) {
    try {
      const axiosIntance = axios.create({
        baseURL: "https://api.openweathermap.org/data/2.5/weather",
        params: {
          lat,
          lon,
          appid: process.env.OPENWEATHER_KEY,
          units: "metric",
        },
      });

      const { data } = await axiosIntance.get();
      const { main, weather } = data;

      return {
        temp: main.temp,
        min: main.temp_min,
        max: main.temp_max,
        desc: weather[0].description,
      };
    } catch (error) {
      console.log("\nWe can't find the weather info :(");
      return [];
    }
  }

  listHistory() {
    this.capitalizePlace.forEach((place, i) => {
      const idx = (i + 1 + ".").green;
      console.log(`${idx} ${place}`);
    });
  }

  savePlaceInHistory(placeName = "") {
    const place = placeName.toLowerCase();
    if (this.history.includes(place)) return;

    // save only last 6 places
    this.history = this.history.splice(0, 5);
    this.history.unshift(place);
    this.saveOnDB();
  }

  saveOnDB() {
    const payload = {
      history: this.history,
    };
    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  loadDB() {
    if (!fs.existsSync(this.dbPath)) return;
    const data = fs.readFileSync(this.dbPath, { encoding: "utf-8" });
    const { history } = JSON.parse(data);
    this.history = history;
  }
}

module.exports = Search;
