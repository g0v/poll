'use strict';

/**
 * @ngdoc function
 * @name pollApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pollApp
 */
angular.module('pollApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
