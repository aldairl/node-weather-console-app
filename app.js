require("dotenv").config();

const {
  readInput,
  inquirerMenu,
  pause,
  listPlaces,
} = require("./helpers/inquirer");
const Search = require("./models/search");

require("colors");

console.log("hola mundo".blue);

const main = async () => {
  let opt;
  do {
    opt = await inquirerMenu();

    const search = new Search();

    switch (opt) {
      case 1:
        const placeTSearch = await readInput("search:");
        // Search cities
        const places = await search.search(placeTSearch);
        // Select a city
        const placeId = await listPlaces(places);
        if (placeId === 0) continue;
        const city = places.find((place) => place.id === placeId);
        search.savePlaceInHistory(city.name);
        // get weather
        const weather = await search.weatherCity(city.lat, city.lng);
        // show results
        console.log("City weather information\n".green);
        console.log("City: ", city.name);
        console.log("Lat: ", city.lat);
        console.log("Lng: ", city.lng);
        console.log("Temperature: ", weather.temp);
        console.log("-> min: ", weather.min);
        console.log("-> max: ", weather.max);
        console.log("state: ", weather.desc);
        break;
      case 2:
        search.listHistory();
        break;
    }

    if (opt !== 0) await pause();
  } while (opt != 0);
};

main();
