app.controller('MapController', ['$scope','uiGmapGoogleMapApi', function ($scope, uiGmapGoogleMapApi) {

    $scope.map = {
        center: {
            latitude: -23.598763,
            longitude: -46.676547
        },
        zoom: 10,
        options: {
            streetViewControl: false,
            mapTypeControl: false,
            scaleControl: false,
            rotateControl: false,
            zoomControl: false
        }
    };

    // The "then" callback function provides the google.maps object.
    uiGmapGoogleMapApi.then(function(maps) {
        console.log('Google Maps loaded');
    });

    uiGmapGoogleMapApi.then(function(maps) {
        // You can now merge your options which need google.map helpers
        angular.merge($scope.map, {
            options: {
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.LARGE,
                    position: google.maps.ControlPosition.LEFT_CENTER
                },
                center: {
                    latitude: -23.598763,
                    longitude: -46.676547
                },
                zoom: 13
            }
        });
    })
}]);