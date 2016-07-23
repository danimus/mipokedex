'use strict';

var app = angular.module('MiPokedexApp', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    $stateProvider
        .state('index', {
            url: "/",
            templateUrl: "/static/templates/pages/home.html",
            data: {
                pageTitle: 'Home'
            }
        });

    $urlRouterProvider.otherwise('/');
    //$locationProvider.html5Mode(true);

});

app.directive('updateTitle', ['$rootScope', '$timeout',
    function($rootScope, $timeout) {
        return {
            link: function(scope, element) {

                var listener = function(event, toState) {

                    var title = 'SharkScore';
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