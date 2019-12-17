// Store our API endpoint inside queryUrl
var usgsURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(usgsURL, function(data){
  createFeatures(data.features);
});

// Create function to set color based on earthquake magnitudels

function radiusSize(magnitude){
  return magnitude * 10000;
}
function getColor(magnitude){
  if (magnitude < 1){
    return "rgb(255,255,255)"
  }
  else if (magnitude < 2){
    return "rgb(255,225,225)"
  }
  else if (magnitude < 3){
    return "rgb(255,195,195)"
  }
  else if (magnitude < 4){
    return "rgb(255,165,165)"
  }
  else if (magnitude < 5){
    return "rgb(255,135,135)"
  }
  else {
    return "rgb(255,15,15)"
  }
}

function createFeatures(earthquakeData){
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(feature, latlng){
      return L.circleMarker(latlng,{
        radius: feature.properties.mag*5,
        fillColor : getColor(feature.properties.mag),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.9})
        .bindPopup("<h3>"+ feature.properties.place +
        "<h3><hr><p>" + new Date(feature.properties.time)+ "</p>" +
        "Magnitude: " + feature.properties.mag + "</p>");
    }
  });

  createMap(earthquakes);
}
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

      // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
    }).addTo(myMap);


function colors(d) {
  return d < 1 ? 'rgb(255,255,255)' :
        d < 2  ? 'rgb(255,225,225)' :
        d < 3  ? 'rgb(255,195,195)' :
        d < 4  ? 'rgb(255,165,165)' :
        d < 5  ? 'rgb(255,135,135)' :
        d < 6  ? 'rgb(255,15,15)"':
                  'rgb(255,0,0)';
  }
    
    // Create a legend to display information about our map
  var legend = L.control({position: 'bottomleft'});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 1, 2, 3, 4, 5, 6],
      labels = [];

      div.innerHTML+='Magnitude<br><hr>'
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + colors(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }
  
  return div;
  };
  
  legend.addTo(myMap);
}
