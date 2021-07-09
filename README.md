# Chica Rutera

This app is meant as a study for myself into the [Travelling Salesman Problem](https://en.wikipedia.org/wiki/Travelling_salesman_problem) and the existing APIs meant to solve it.

It uses the [Open Route Service](https://openrouteservice.org/) API to generate routes between multiple points.

You can see the app live [here](https://chicarutera.netlify.app/).

![app preview](/public/readme-img.png)

At this moment it is possible to add one start, one finish and 48 points to a route. You can do so by either searching for an address, clicking on the map, or uploading a list of addresses from a text file.

The address search and the reverse geocoding, as well as the map positioning based on the user's IP address, are done using the [Geoapify](https://www.geoapify.com/) APIs. The map engine is [OpenLayers](https://openlayers.org/), and the map style is by [Carto](https://github.com/CartoDB/basemap-styles).

Chica Rutera is the name of a song by Argentinean band [Él Mató a un Policía Motorizado](https://www.elmato.com.ar/).

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Installation

```
git clone git@github.com:rafaelrolivares/chica-rutera.git
cd chica-rutera
npm install
npm start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
