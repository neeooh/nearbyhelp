

var map;
var placesService;
var infowindow;
var userLocation;
var infoWindow;

var placesAllSelected = ['pharmacy', 'police', 'grocery_or_supermarket'];


var placesEssential = ['pharmacy', 'liquor_store', 'atm'];
var placesSafety = ['police', 'lawyer'];
var placesMoney = ['accounting', 'lawyer', 'lodging'];
var placesTravel = ['airport', 'light_rail_station'];
var placesGov = ['local_government_office'];
var placesLaundry = ['laundry'];

// Immediately Invoked Function Expressions
(function () {
  createNavBtns();
}());


function createNavBtns() {
//  var table = document.createElement('table');
//  var tableBody = document.createElement('tbody');
    var filterPanel = document.getElementById('filter-panel');
    
  placesAllSelected.forEach(function(rowData) {
    var label = document.createElement('label');
      label.classList.add('mr-1');
      label.classList.add('place-type-btn');
      label.classList.add('btn');
      label.classList.add('btn-sm');
      label.classList.add('btn-secondary');
      label.classList.add('active'); //TODO - only if active
      label.setAttribute("aria-labelledby", rowData);
      
    var input = document.createElement('input');
      input.setAttribute("type", "checkbox");
      input.setAttribute("autocomplete", "off");
      input.setAttribute("checked", true);
      input.setAttribute("value", rowData);
      //input.createTextNode(rowData);
      
      label.appendChild(input);
      var sanitizedLabel = rowData.replace(/_/g, " ");
      label.appendChild(document.createTextNode(sanitizedLabel));
//    rowData.forEach(function(cellData) {
//      var cell = document.createElement('td');
//      cell.appendChild(document.createTextNode(cellData));
//      row.appendChild(cell);
//    });

    filterPanel.appendChild(label);
  });

//  table.appendChild(tableBody);
  //document.body.appendChild(table);
}

function initMap() {
    
    //JQUERY for Button Toggle selection of places
    $(".place-type-btn").click(function(event){
        var target = $(event.currentTarget);
       var placeTypeStr = target.attr('aria-labelledby');
        
        if(target.hasClass('active')){
            var removePos = placesAllSelected.indexOf(placeTypeStr)
            placesAllSelected.splice(removePos, 1);
            clearMarkers(placeTypeStr);
        }
        else{
            placesAllSelected.push(placeTypeStr);
            getMultipleDifferentPlaces(map.getCenter());
            //getPlacesNearby(placeTypeStr, map.getCenter());
            
        }
    
        
        
    });
//
//    getPlacesNearby('grocery_or_supermarket');
//  getPlacesNearby('pharmacy');
//    
    
    var sydney = new google.maps.LatLng(-33.867, 151.195);

        infowindow = new google.maps.InfoWindow();
        mapOptions = {
            center: sydney, 
            zoom: 14,
            styles: mapStyle
        };

        map = new google.maps.Map(
          document.getElementById('map'), mapOptions);

// Drag-End Event
map.addListener('idle', function() {
    //get center location of the drag
    setTimeout(function(){ 
        getMultipleDifferentPlaces(map.getCenter());
    }, 3000);
    
});
    
    
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
             
            map.setCenter(userLocation);
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
    

    

placesService = new google.maps.places.PlacesService(map);



infoWindow = new google.maps.InfoWindow({});
    
    
    
            getMultipleDifferentPlaces(map.getCenter());
}


function getMultipleDifferentPlaces(selectedLocation){
    
    //Build config
    var config = placesAllSelected; //placesEssential.concat(placesSafety);
    
    for(i = 0; i < config.length; i++) {
        getPlacesNearby(config[i], selectedLocation);
    }
    
    map.setCenter(selectedLocation);
}



function getPlacesNearby(selectedType, selectedLocation) {
    
//    var request = {
//        location: selectedLocation,
//        radius: '5000',
//        type: selectedType
//    };
     var request = {
        bounds: map.getBounds(),
        type: selectedType
    };
    
    placesService.nearbySearch(request, 
        function(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              for (var i = 0; i < results.length; i++) {
                createMarker(results[i], selectedType);
              }
              //map.setCenter(selectedLocation);
            }
    });
}

function getPlacesFromQuery(request) {
    
    placesService.findPlaceFromQuery(request, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
          }
          map.setCenter(results[0].geometry.location);
        }
    });
    
}


// Location Error Handling
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
  }

var markers = [];

function createMarker (pos, selectedType) {
    
     var icon = {
      url: pos.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };
    
    
    var marker = new google.maps.Marker({
        placeType: selectedType,
        position: pos.geometry.location,
        map: map,
        icon: icon
    });
    
    markers.push(marker);
    
//    marker.addListener('click', function() {
//        infoWindow.open(map, marker);
//    });
    
    
    // Show the information for a store when its marker is clicked.
    marker.addListener('click', function() {
    var name = pos.name;
    //var description = event.feature.getProperty('description');
    var hours = (pos.opening_hours != undefined) ? pos.opening_hours.open_now : '';
    //var phone = event.feature.getProperty('phone');
    var position = pos.geometry.location;
    var rating = pos.rating;
    var vicinity = pos.vicinity;
    var typesButtons = `<div class="btn-group-toggle" data-toggle="buttons">`;
        
    for(i = 0; i < pos.types.length; i++) {
        typesButtons += `
<label class="btn btn-sm btn-secondary btn-sm p-0 px-1 active">
<input type="checkbox" checked autocomplete="off"> ${pos.types[i]}
</label>
`;
        
        
    
                
    }    
    
    typesButtons += "</div>";
      
    var content = 
`
<div class="container-fluid">
<div class="row">
<div class="col p-0">
<h2>${name}</h2>
<p>${vicinity}</p>
${typesButtons}
<p><b>Open:</b> ${hours}<br/><b>Phone:</b> <b>Rating:</b> ${rating}</p>
</div>
</div>
</div>
`;

    infoWindow.setContent(content);
    infoWindow.setPosition(pos.geometry.location);
    infoWindow.setOptions({pixelOffset: new google.maps.Size(0, -30)});
    infoWindow.open(map);
  });

    
    
}

function createMarkers(places) {
  var bounds = new google.maps.LatLngBounds();
  //var placesList = document.getElementById('places');

  for (var i = 0, place; place = places[i]; i++) {
    var image = {
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };

    var marker = new google.maps.Marker({
      map: map,
      icon: image,
      title: place.name,
      position: place.geometry.location
    });

    var li = document.createElement('li');
    li.textContent = place.name;
    placesList.appendChild(li);

    bounds.extend(place.geometry.location);
  }
  map.fitBounds(bounds);
}




// Sets the map on all markers in the array.
function setMapOnAll(mapID, placeType) {
    for (var i = 0; i < markers.length; i++) {
        if(markers[i].placeType == placeType)
            markers[i].setMap(mapID);
    }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers(placeType) {
    setMapOnAll(null, placeType);
}




/**
 * Initialize the Google Map.
 */
function initMap2() {
  // Create the map.
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 7,
    center: {lat: 52.632469, lng: -1.689423},
    //styles: mapStyle,
  });

  // Load the stores GeoJSON onto the map.
  map.data.loadGeoJson('stores.json', {idPropertyName: 'storeid'});

  // Define the custom marker icons, using the store's "category".
  map.data.setStyle((feature) => {
    return {
      icon: {
        url: `img/icon_${feature.getProperty('category')}.png`,
        scaledSize: new google.maps.Size(64, 64),
      },
    };
  });

  const apiKey = 'AIzaSyDKLAB-abarMKOVmwh2NYHq5zkXnaMstjI';
  const infoWindow = new google.maps.InfoWindow();

  // Show the information for a store when its marker is clicked.
  map.data.addListener('click', (event) => {
    const category = event.feature.getProperty('category');
    const name = event.feature.getProperty('name');
    const description = event.feature.getProperty('description');
    const hours = event.feature.getProperty('hours');
    const phone = event.feature.getProperty('phone');
    const position = event.feature.getGeometry().get();
    const content = sanitizeHTML`
      <img style="float:left; width:200px; margin-top:30px" src="img/logo_${category}.png">
      <div style="margin-left:220px; margin-bottom:20px;">
        <h2>${name}</h2><p>${description}</p>
        <p><b>Open:</b> ${hours}<br/><b>Phone:</b> ${phone}</p>
        <p><img src="https://maps.googleapis.com/maps/api/streetview?size=350x120&location=${position.lat()},${position.lng()}&key=${apiKey}"></p>
      </div>
      `;

    infoWindow.setContent(content);
    infoWindow.setPosition(position);
    infoWindow.setOptions({pixelOffset: new google.maps.Size(0, -30)});
    infoWindow.open(map);
  });

  // Build and add the search bar
  const card = document.createElement('div');
  const titleBar = document.createElement('div');
  const title = document.createElement('div');
  const container = document.createElement('div');
  const input = document.createElement('input');
  const options = {
    types: ['address'],
    componentRestrictions: {country: 'gb'},
  };

  card.setAttribute('id', 'pac-card');
  title.setAttribute('id', 'title');
  title.textContent = 'Find the nearest store';
  titleBar.appendChild(title);
  container.setAttribute('id', 'pac-container');
  input.setAttribute('id', 'pac-input');
  input.setAttribute('type', 'text');
  input.setAttribute('placeholder', 'Enter an address');
  container.appendChild(input);
  card.appendChild(titleBar);
  card.appendChild(container);
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

  // Make the search bar into a Places Autocomplete search bar and select
  // which detail fields should be returned about the place that
  // the user selects from the suggestions.
  const autocomplete = new google.maps.places.Autocomplete(input, options);

  autocomplete.setFields(
      ['address_components', 'geometry', 'name']);

  // Set the origin point when the user selects an address
  const originMarker = new google.maps.Marker({map: map});
  originMarker.setVisible(false);
  let originLocation = map.getCenter();

  autocomplete.addListener('place_changed', async () => {
    originMarker.setVisible(false);
    originLocation = map.getCenter();
    const place = autocomplete.getPlace();

    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert('No address available for input: \'' + place.name + '\'');
      return;
    }

    // Recenter the map to the selected address
    originLocation = place.geometry.location;
    map.setCenter(originLocation);
    map.setZoom(9);
    console.log(place);

    originMarker.setPosition(originLocation);
    originMarker.setVisible(true);

    // Use the selected address as the origin to calculate distances
    // to each of the store locations
    const rankedStores = await calculateDistances(map.data, originLocation);
    showStoresList(map.data, rankedStores);

    return;
  });
}





// Credits: https://snazzymaps.com/style/151/ultra-light-with-labels
//
const mapStyle = 
[
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e9e9e9"
            },
            {
                "lightness": 17
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f5f5"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 17
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 29
            },
            {
                "weight": 0.2
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 18
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f5f5"
            },
            {
                "lightness": 21
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dedede"
            },
            {
                "lightness": 21
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#ffffff"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "saturation": 36
            },
            {
                "color": "#333333"
            },
            {
                "lightness": 40
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f2f2f2"
            },
            {
                "lightness": 19
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#fefefe"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#fefefe"
            },
            {
                "lightness": 17
            },
            {
                "weight": 1.2
            }
        ]
    }
];