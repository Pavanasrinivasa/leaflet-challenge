// Store our API endpoint inside queryUrl
var usgsURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(usgsURL, function(data) {
  createFeatures(data.features);
});

// Create function to create circular features
function createFeatures(earthquakeData) {

  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>"+
      "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>");
  }
  function radiusSize(magnitude) {
    return magnitude * 20000;
  }
  function color(magnitude) {
    if (magnitude < 1) {
      return "#ffe4e4"
    }
    else if (magnitude < 2) {
      return "#ff9595"
    }
    else if (magnitude < 3) {
      return "#ff4747"
    }
    else if (magnitude < 4) {
      return "#ff0c0c"
    }
    else if (magnitude < 5) {
      return "#bc0000"
    }
    else {
      return "#6e0000"
    }
  }
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (earthquakeData, latlng) {
      var color;
      var r = 255;
      var g = Math.floor(255-80*earthquakeData.properties.mag);
      var b = Math.floor(255-80*earthquakeData.properties.mag);
      color= "rgb("+r+" ,"+g+","+ b+")"
      
      var geojsonMarkerOptions = {
        radius: 4*earthquakeData.properties.mag,
        fillColor: color,
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };
      return L.circleMarker(latlng, geojsonMarkerOptions);
    }
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}
//Create the createMap function
function createMap(earthquakes){

    // Basemap layers
    var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors,\<a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
    });

    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.light",
      accessToken: API_KEY
    });

    var outdoorsmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors,\<a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
    });

    //Object to hold the base layers
    var baseMaps = {
        "Satellite": satellitemap,
        "Grayscale": lightmap,
        "Outdoors": outdoorsmap
    };

    //Object to hold overlay layer
    var overlayMaps = {
        "Earthquakes": earthquakes
    };

    //Create map object
    var myMap = L.map("map", {
        center: [38, -95],
        zoom: 5,
        layers: [satellitemap , earthquakes]
      });
    function getColor(d) {
      return d < 1 ? 'rgb(255,255,255)' :
            d < 2  ? 'rgb(255,225,225)' :
            d < 3  ? 'rgb(255,195,195)' :
            d < 4  ? 'rgb(255,165,165)' :
            d < 5  ? 'rgb(255,135,135)' :
            d < 6  ? 'rgb(255,105,105)' :
            d < 7  ? 'rgb(255,75,75)' :
            d < 8  ? 'rgb(255,45,45)' :
            d < 9  ? 'rgb(255,15,15)' :
                        'rgb(255,0,0)';
    }
        
    //Layer control
    L.control.layers(baseMaps, overlayMaps,{
        collapsed : false
      }).addTo(myMap);

 // Create a legend to display information about our map
 var legend = L.control({position: 'bottomright'});

 legend.onAdd = function (map) {
 
     var div = L.DomUtil.create('div', 'info legend'),
     grades = [0, 1, 2, 3, 4, 5, 6, 7, 8],
     labels = [];

     div.innerHTML+='Magnitude<br><hr>'
 
     // loop through our density intervals and generate a label with a colored square for each interval
     for (var i = 0; i < grades.length; i++) {
         div.innerHTML +=
             '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
             grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
 }
 
 return div;
 };
 
 legend.addTo(myMap);
}