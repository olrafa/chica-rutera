# Chica Rutera - A Route Planning app

> "Given a list of cities and the distances between each pair of cities, what is the shortest possible route that visits each city exactly once and returns to the origin city?"

This app is meant as a study of the [Travelling Salesman Problem](https://en.wikipedia.org/wiki/Travelling_salesman_problem) and the existing APIs meant to solve it.

It uses the [Open Route Service](https://openrouteservice.org/) API to generate routes between multiple points.

You can see the app live [here](https://chicarutera.netlify.app/).

![app preview](/public/readme-img.png)

At this moment it is possible to add one start, one finish and 48 points to a route. You can do so by either searching for an address, clicking on the map, or uploading a list of addresses from a text file.

This is a React app created in 2021 with the `create-react-app` script, with the TypeScript template.

The address search and the reverse geocoding, as well as the map positioning based on the user's IP address, are done using the [Geoapify](https://www.geoapify.com/) APIs. The map engine is [OpenLayers](https://openlayers.org/), and the map style is by [Carto](https://github.com/CartoDB/basemap-styles).

Chica Rutera is the name of a song by Argentine band [Él Mató a un Policía Motorizado](https://www.elmato.com.ar/).

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Installation

```
git clone git@github.com:olrafa/chica-rutera.git
cd chica-rutera
npm install
```

Keep in mind that you will need your own [Open Route Service](https://openrouteservice.org/) and [Geoapify](https://www.geoapify.com/) API keys to run it locally (both are free for this use case). Once you have them, you need to create a `.env` file (which is gitignored) in your local root folder, with the following structure:

```
REACT_APP_ORS_KEY=YOUR_KEY
REACT_APP_GEOAPIFY_KEY=YOUR_KEY
```

Then, run `npm start`. This will run the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits. You will also see any lint errors in the console.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
