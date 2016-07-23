app.controller('MapController', ['$scope','$http','uiGmapLogger','uiGmapGoogleMapApi', function ($scope,$http,$log,GoogleMapApi) {

    $scope.geolocationAvailable = navigator.geolocation ? true : false;

    var style = [{"featureType":"landscape","stylers":[{"hue":"#FFBB00"},{"saturation":43.400000000000006},{"lightness":37.599999999999994},{"gamma":1}]},{"featureType":"road.highway","stylers":[{"hue":"#FFC200"},{"saturation":-61.8},{"lightness":45.599999999999994},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":51.19999999999999},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":52},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#0078FF"},{"saturation":-13.200000000000003},{"lightness":2.4000000000000057},{"gamma":1}]},{"featureType":"poi","stylers":[{"hue":"#00FF6A"},{"saturation":-1.0989010989011234},{"lightness":11.200000000000017},{"gamma":1}]}];

    $scope.map = {
        center: {
            latitude: 34.0098598,
            longitude: -118.4986249
        },
        zoom: 15,
        options: {
            streetViewControl: false,
            mapTypeControl: false,
            scaleControl: false,
            rotateControl: false,
            zoomControl: false,
            draggable: true,
            disableDefaultUI: true,
            clickableIcons:false
        },
        styles:style
    };

    $scope.findMe = function () {
        if ($scope.geolocationAvailable) {

            navigator.geolocation.getCurrentPosition(function (position) {

                $scope.map.center = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };

                $scope.$apply();
            }, function () {
            });
        } else{
            console.log("Geo not available.");
        }
    };

    GoogleMapApi.then(function(maps) {

        //$scope.findMe();

        $scope.pokemonMarkers = [];
        var httpRequest = $http({
            method: 'GET',
            dataType:'json',
            url: '/api/'+$scope.map.center.latitude+'/'+$scope.map.center.longitude

        }).success(function (data) {
            $scope.pokemonMarkers = (data);
        });

        console.log('Google Maps loaded');
    })
}]);