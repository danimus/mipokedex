'use strict';

var app = angular.module('MiPokedexApp', ['ui.router','uiGmapgoogle-maps', 'angularSpinners', 'lapokedexDirectives']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    $stateProvider
        .state('index', {
            url: "/",
            templateUrl: "/static/templates/pages/home.html",
            controller: "MapController",
            data: {
                pageTitle: 'Find all the Pokemon near you!'
            }
        });

    $stateProvider
        .state('contact', {
            url: "/contact",
            templateUrl: "/static/templates/pages/contact.html",
            controller: "ContactController",
            data: {
                pageTitle: 'Contact us'
            }
        });

    $urlRouterProvider.otherwise('/');
    //$locationProvider.html5Mode(true);

});

app.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: MAPS_API_KEY,
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
                    if (toState.data && toState.data.pageTitle) title = "MiPokédex | " + toState.data.pageTitle;

                    $timeout(function() {
                        element.text(title);
                    }, 0, false);
                };

                $rootScope.$on('$stateChangeSuccess', listener);
            }
        };
    }
]);