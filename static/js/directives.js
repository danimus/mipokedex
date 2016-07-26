'use strict';

var lapokedexDirectives = angular.module('lapokedexDirectives', []);



lapokedexDirectives.directive('timePokemon', function() {
	function link(scope, element, attr){

		var data = scope.source;
		console.log(data);

	}	
  	return {
      restrict: 'AE',
      replace: 'true',
      template: '<h3>Hello World!!</h3>'
  	};
});
