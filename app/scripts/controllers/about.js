'use strict';

/**
 * @ngdoc function
 * @name pollApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the pollApp
 */
angular.module('pollApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
