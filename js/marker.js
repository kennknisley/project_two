function legendColor(unemp){
  if (unemp >22){
    return "#a50026"
  }
  else if (unemp>19){
    return "#d3322b"
  }
  else if (unemp>16){
    return "#f16d43"
  }
  else if (unemp>14){
    return "#fcab63"
  }
  else if (unemp>12){
    return "#fedc8c"
  }
  else if (unemp>10){
    return "#d7ee8e"
  }
  else if (unemp>8){
    return "#64bc61"
  }
  else{
    return "#23964f"
  };
}

var map={};
function createMap(counties) {

    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.dark",
      accessToken: API_KEY
    });
  
    var baseMaps = {
      "Dark Map": darkmap
    };
  
    var overlayMaps = {
      "Counties": counties
    };
  
    var map = L.map("map", {
      center: [38.577, -92.174],
      zoom: 7,
      layers: [darkmap, counties]
    });
  
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);

    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var rates = [0,3,6,11,13,15,17,19,21,23,25];
    var labels = [];

    var legendInfo = "<h2>Unemployment Rate</h2>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + rates[0] + "</div>" +
        "<div class=\"middle\">" + rates[5] + "</div>"+
        "<div class=\"max\">" + rates[rates.length - 1]+"+" + "</div>" +
      "</div>";


    div.innerHTML = legendInfo;

    rates.forEach(function(rate, index) {
      labels.push("<li style=\"background-color: " + legendColor(rates[index]) + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;

  };

  legend.addTo(map);
  }

var f;
var s;
var mo_data_csv;

d3.csv('/Resources/mo_data.csv').then(function(data){
  mo_data_csv=data;
  loadJSON();});

function chooseColor(station){ 
  for (var data=0; data<mo_data_csv.length; data++){
      f=mo_data_csv[data].County.substring(0, mo_data_csv[data].County.length-12);
      s=station;
      if (f===s){
        var unemp=+mo_data_csv[data].AllAgesinPovertyPercent;         
      if (unemp >22){
        return "#a50026"
      }
      else if (unemp>19){
        return "#d3322b"
      }
      else if (unemp>16){
        return "#f16d43"
      }
      else if (unemp>14){
        return "#fcab63"
      }
      else if (unemp>12){
        return "#fedc8c"
      }
      else if (unemp>10){
        return "#d7ee8e"
      }
      else if (unemp>8){
        return "#64bc61"
      }
      else{
        return "#23964f"
      }
    

}}}
  
  function createMarkers(response) {

    var stations = response.features
  
    var countyMarkers = [];
  
    for (var index = 0; index < stations.length; index++) {
      var station = stations[index];
  
      var countyMarker = L.geoJSON(station,{
          style:{color:"orange",
          fillOpacity:0.6,
          weight:0.3,
          fillColor: chooseColor(station.properties.NAME)},
          onEachFeature: function(feature,layer){
            layer.on({
              mouseover:function(event){
                layer=event.target;
                layer.setStyle({
                  fillOpacity:0.9
                });
              },
              mouseout: function(event){
                layer=event.target;
                layer.setStyle({
                  fillOpacity:0.6
                });
              }
            });
            layer.bindPopup(`<h4>${station.properties.NAME} County</h4>`);
          }
      })
  
      countyMarkers.push(countyMarker);
    }
  
    createMap(L.layerGroup(countyMarkers));
  }

  function loadJSON(){d3.json('/Resources/countyLines.json').then(createMarkers)};

  



  