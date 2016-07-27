 function secondsToTime(ms){

    var x = ms / 1000
    var seconds = x % 60
    x /= 60
    var minutes = x % 60
    x /= 60
    var hours = x % 24
    x /= 24
    var days = x

    return Math.floor(minutes) + ":" + Math.floor(seconds); 
}


app.controller('MapController', ['$scope', '$http', 'uiGmapLogger', 'uiGmapGoogleMapApi', 'spinnerService', function ($scope, $http, $log, GoogleMapApi,spinnerService) {

    //Check if browser has geo activated
    $scope.geolocationAvailable = navigator.geolocation ? true : false;

    var style = [{
        "featureType": "landscape",
        "stylers": [{"hue": "#FFBB00"}, {"saturation": 43.400000000000006}, {"lightness": 37.599999999999994}, {"gamma": 1}]
    }, {
        "featureType": "road.highway",
        "stylers": [{"hue": "#FFC200"}, {"saturation": -61.8}, {"lightness": 45.599999999999994}, {"gamma": 1}]
    }, {
        "featureType": "road.arterial",
        "stylers": [{"hue": "#FF0300"}, {"saturation": -100}, {"lightness": 51.19999999999999}, {"gamma": 1}]
    }, {
        "featureType": "road.local",
        "stylers": [{"hue": "#FF0300"}, {"saturation": -100}, {"lightness": 52}, {"gamma": 1}]
    }, {
        "featureType": "water",
        "stylers": [{"hue": "#0078FF"}, {"saturation": -13.200000000000003}, {"lightness": 2.4000000000000057}, {"gamma": 1}]
    }, {
        "featureType": "poi",
        "stylers": [{"hue": "#00FF6A"}, {"saturation": -1.0989010989011234}, {"lightness": 11.200000000000017}, {"gamma": 1}]
    }];

    //Map initial config
    $scope.map = {
        center: {
            latitude: 40.7829,
            longitude: 73.9654
        },
        zoom: 16,
        options: {
            streetViewControl: false,
            mapTypeControl: false,
            scaleControl: true,
            rotateControl: false,
            zoomControl: true,
            draggable: true,
            disableDefaultUI: true,
            clickableIcons: false,
            styles: style
        }
    };


    $scope.GetMarkers = function () {

        spinnerService.show('mapSpinner');
        //Will get markers with actual scope coord values
        var httpRequest = $http({
            method: 'GET',
            dataType: 'json',
            url: '/api/' + $scope.map.center.latitude + '/' + $scope.map.center.longitude

        }).success(function (data) {

            var user_location_marker = {
                latitude: $scope.map.center.latitude,
                longitude:$scope.map.center.longitude,
                // name:"<strong>You are here</strong>",
                options: {
                    labelContent : "You are here!",
                    labelAnchor: "36 67",
                    labelClass: 'user_label',
                    // labelStyle: "newstyle",
                    labelInBackground: true
                    },
                encounter_id: 0,
            };
            

            for (var i = data.length - 1; i >= 0; i--) {
                data[i].options = {
                    labelContent : '<span id=timepokemon>'+secondsToTime(data[i].time_till_hidden_ms)+'</pokemon>',
                    labelAnchor: "20 55",
                    labelClass: 'pokemon_label',
                    // labelStyle: "newstyle",
                    labelInBackground: true
                }
            };
            
            data.push(user_location_marker);
            $scope.pokemonMarkers = (data);

            //TODO, use a watcher? This is just a test.
            // var markers = $(document).find("#timepokemon");
            // console.log("dssfasd");
            // console.log(markers);
            //  for (var i = 0; i < markers.length; i++) {
            //      console.log(markers[i].style);
            //  }

        })
        .error(function(data, status) {
            $('#alert_connection').removeClass('hidden');
        })
        .finally(function () {
            spinnerService.hide('mapSpinner');
        });
    };

    $scope.setCenter = function (latitude, longitude) {

        //Update scope with new values
        $scope.map.center = {
            latitude: latitude,
            longitude: longitude
        };

        //Submit scope. refresh map, submit new values to map.
        $scope.$apply();

    };


    angular.extend($scope, {
        searchbox: {
            template: 'static/templates/partials/searchbox.html',
            events: {
                places_changed: function (searchBox) {

                    var place = searchBox.getPlaces();

                    $scope.setCenter(place[0].geometry.location.lat(), place[0].geometry.location.lng());
                    $scope.GetMarkers();
                }
            },
            options: {
                autocomplete: false
            }
        }
    });

    $scope.getLocation = function () {
        //Get GEO, if not available, will use default coord values (Central Park)

        if ($scope.geolocationAvailable) {

            navigator.geolocation.getCurrentPosition(function (position) {

                $scope.setCenter(position.coords.latitude, position.coords.longitude);
                //download and print Markers
                $scope.GetMarkers();


            });

        } else {
            console.log("Geo not available.");
            $scope.GetMarkers();
        }

    };


    GoogleMapApi.then(function (maps) {

        $scope.getLocation();

        $scope.pokemonMarkers = [];

    });

}]);
