'use strict';

var app = angular.module('MiPokedexApp', ['ui.router','uiGmapgoogle-maps', 'angularSpinners', 'lapokedexDirectives']);


app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    $stateProvider
        .state('index', {
            url: "/",
            templateUrl: "/static/templates/pages/home.html",
            controller: "MapController",
            data: {
                pageTitle: 'Home'
            }
        });

    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);

});

app.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyByk399DfLeIwm1y64P-hMlYhUkC9avX88',
        v: '3',
        libraries: 'places'
    });
});

app.directive('updateTitle', ['$rootScope', '$timeout',
    function($rootScope, $timeout) {
        return {
            link: function(scope, element) {

                var listener = function(event, toState) {

                    var title = 'MiPokedex';
                    if (toState.data && toState.data.pageTitle) title = "MiPokedex | " + toState.data.pageTitle;

                    $timeout(function() {
                        element.text(title);
                    }, 0, false);
                };

                $rootScope.$on('$stateChangeSuccess', listener);
            }
        };
    }
]);