/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var map;
var placesService;
var infowindow;
var userLocation;
var infoWindow;

var placesAllSelected = ['pharmacy' ]; //'grocery_or_supermarket'


var placesEssential = ['pharmacy', 'grocery_or_supermarket', 'convenience_store', 'liquor_store', 'post_office', 'atm'];
var placesSafety = ['police'];
var placesMoney = ['lodging']; //'lawyer'
var placesTravel = ['train_station', 'bus_station']; //'airport', 'light_rail_station'
var placesGov = []; //'local_government_office'
var placesLaundry = ['laundry', 'funeral_home'];

var placesAllUnSelected = [];


// Immediately Invoked Function Expressions
(function () {
	placesAllUnSelected = placesAllUnSelected.concat(placesEssential, placesSafety, placesMoney, placesTravel, placesGov, placesLaundry);

	placesAllSelected.forEach(function (place) {

		var index = placesAllUnSelected.indexOf(place);

		if (index > -1) {
			delete placesAllUnSelected[index];
		}
	});


	// Create The UI GUI Buttons for Places
	createNavBtns();

	
	window.initMap = function(){
	//function initMap() {
	var london = new google.maps.LatLng(51.512886, -0.102280);
	var causewayCoast = new google.maps.LatLng(55.167355, -6.679138);
	infoWindow = new google.maps.InfoWindow({});

	//jQuery for Button Toggle selection of places
	$(".place-type-btn").click(function (event) {
		var target = $(event.currentTarget);
		var placeTypeStr = target.attr('aria-labelledby');

		if (target.hasClass('active')) {
			// Button was Un-selected
			target.removeClass('btn-primary');
			target.addClass('btn-secondary');
			var removePos = placesAllSelected.indexOf(placeTypeStr)
			placesAllSelected.splice(removePos, 1);
			clearMarkers(placeTypeStr);
		} else {
			// Button was Selected
			target.removeClass('btn-secondary');
			target.addClass('btn-primary');
			placesAllSelected.push(placeTypeStr);
			// TODO - implement some caching???
			getMultipleDifferentPlaces(map.getCenter());
		}
	});

	mapOptions = {
		center: london,
		zoom: 14,
		styles: mapStyle,
		disableDefaultUI: true,
		zoomControl: true,
		//mapTypeControl: true,
		scaleControl: true,
		streetViewControl: true,
		rotateControl: true,
		fullscreenControl: true
	};

	map = new google.maps.Map(document.getElementById('map'), mapOptions);
	placesService = new google.maps.places.PlacesService(map);

	
	// Try HTML5 geolocation.
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
			// Success getting location
			userLocation = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			map.setCenter(userLocation);
			map.zoom = 16;

		}, function () {
			handleLocationError(true, infoWindow, map.getCenter());
		});
	} else {
		// Browser doesn't support Geolocation
		handleLocationError(false, infoWindow, map.getCenter());
	}

	if (map.getBounds() == undefined) {
		setTimeout(function () {
			getMultipleDifferentPlaces();
		}, 500); //some error map.getBounds() returns undefined at start so that's why I delay it by 500ms
	}


	// EVENTS

	// Panning/Dragging End
	google.maps.event.addListener(map, 'idle', function () {
		if (map.zoom >= 8) //TODO if you want to getting places info when zoomed out
			getMultipleDifferentPlaces();
	});

	// Zooming Out End (with correct timout method)
	google.maps.event.addListener(map, 'zoom_changed', function () {

		//    if(map.zoom >= 8) //TODO if you want to getting places info when zoomed out
		//        getMultipleDifferentPlaces(map.getCenter());

		rtime = new Date();
		if (timeout === false) {
			timeout = true;
			setTimeout(zoomChangedEnd, delta);
		}
	});
}
	
	
	
}());


function createNavBtns() {
	
	var filterPanel = document.getElementById('filter-panel');

	placesAllSelected.forEach(function (rowData) {
		appendBtnsToParent(filterPanel, rowData, true)
	});

	var groupLabel = document.createElement('label');
	//groupLabel.appendChild(document.createTextNode("Unselected:"));

	filterPanel.appendChild(groupLabel);

	placesAllUnSelected.forEach(function (rowData) {
		appendBtnsToParent(filterPanel, rowData, false)
	});

}

function appendBtnsToParent(parentElement, rowData, isActive) {
	
	var label = document.createElement('label');
	label.classList.add('mr-1');
	label.classList.add('mt-1');
	label.classList.add('place-type-btn');
	label.classList.add('btn');
	label.classList.add('btn-sm');

	if (isActive == true) {
		label.classList.add('active');
		label.classList.add('btn-primary');
	} else {
		label.classList.add('btn-secondary');
	}
	label.setAttribute("aria-labelledby", rowData);

	var input = document.createElement('input');
	input.setAttribute("type", "checkbox");
	input.setAttribute("autocomplete", "off");
	if (isActive == true)
		input.setAttribute("checked", true);
	input.setAttribute("value", rowData);
	//input.createTextNode(rowData);

	label.appendChild(input);
	var sanitizedLabel = rowData.replace(/_/g, " ");
	label.appendChild(document.createTextNode(sanitizedLabel));

	parentElement.appendChild(label);
}




var rtime;
var timeout = false;
var delta = 700;

function zoomChangedEnd() {
	if (new Date() - rtime < delta) {
		setTimeout(zoomChangedEnd, delta);
	} else {
		timeout = false;
		getMultipleDifferentPlaces();
	}
}

function getAllSelectedPlaces() {

}

function getMultipleDifferentPlaces() {

	//Build config
	//var config = placesAllSelected; //placesEssential.concat(placesSafety);
	if (map.zoom < 8) {
		console.log("Please zoom-in to see the new pins.");
		return;
	}

	for (i = 0; i < placesAllSelected.length; i++) {
		getPlacesNearby(placesAllSelected[i]);
	}

	//map.setCenter(selectedLocation);
}



function getPlacesNearby(selectedType) {
	//    if(map.getBounds() == undefined) {
	//        var request = {
	//            location: map.getCenter(),
	//            radius: '50000',
	//            type: selectedType
	//        };
	//    }
	//    else {
	//        var request = {
	//            bounds: map.getBounds(),
	//            type: selectedType
	//        };
	//    }



	var request = {
		bounds: map.getBounds(),
		type: selectedType
	};

	console.log("Getting nearby places center: " + map.getCenter() + " bounds:" + map.getBounds());

	placesService.nearbySearch(request,
		function (results, status) {
			if (status === google.maps.places.PlacesServiceStatus.OK) {
				for (var i = 0; i < results.length; i++) {
					createMarker(results[i], selectedType);
				}
				//map.setCenter(selectedLocation);
			}
		});
}

function getPlacesFromQuery(request) {

	placesService.findPlaceFromQuery(request, function (results, status) {
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
	//    infoWindow.setPosition(pos);
	//    infoWindow.setContent(browserHasGeolocation ?
	//                          'Error: The Geolocation service failed.' :
	//                          'Error: Your browser doesn\'t support geolocation.');
	//    infoWindow.open(map);
}

var markers = [];

function createMarker(pos, selectedType) {

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
	marker.addListener('click', function () {
		var name = pos.name;
		//var description = event.feature.getProperty('description');
		var hours = (pos.opening_hours != undefined) ? pos.opening_hours.open_now : '';
		//var phone = event.feature.getProperty('phone');
		var position = pos.geometry.location;
		var rating = pos.rating;
		var vicinity = pos.vicinity;
		var typesButtons = `<div class="btn-group-toggle" data-toggle="buttons">`;

		for (i = 0; i < pos.types.length; i++) {
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
		infoWindow.setOptions({
			pixelOffset: new google.maps.Size(0, -30)
		});
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
		if (markers[i].placeType == placeType)
			markers[i].setMap(mapID);
	}
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers(placeType) {
	setMapOnAll(null, placeType);
}






// Credits: https://snazzymaps.com/style/151/ultra-light-with-labels
//
const mapStyle = [
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


/***/ })
/******/ ]);